const router = require("express").Router()
const { checkSession, checkId, checkPw, checkName, checkBirth, checkTel, checkBlank, checkIdx, checkDuplicateId } = require('../modules/check');
const conn = require("../../config/database")

// 회원가입, 로그인, 로그아웃, id찾기, pw찾기, 정보 보기(나, 다른사람), 내 정보 수정, 회원 탈퇴

// 회원가입 기능
router.post("/", async(req, res) => {
    // signUp에서 값 가져옴
    const { id, pw, name, birth, tel } = req.body

    // 프론트에 전달할 값 미리 만들기
    const result = {
        success : false,
        message : '',
        data : null
    };

   try{
       // 예외처리
       checkId(id)
       checkPw(pw)
       checkName(name)
       checkBirth(birth)
       checkTel(tel)

       // 비동기함수 query
       const isDuplicateId = await checkDuplicateId(id);
       if (isDuplicateId) {
           res.status(400).send({ message: "중복된 id입니다." })
           return;
       }
       
       // DB통신
       const sql = "INSERT INTO account(id, pw, name, birth, tel) VALUES(?, ?, ?, ?, ?)";
       const values = [id, pw, name, birth, tel];

       conn.query(sql, values, (err, dbResult) => {
           if(err){
                result.message = "DB 통신 에러";
                res.status(500).json(result);
           }
           else{
                result.success = true
                result.message = "DB 통신 성공"
                result.data = dbResult
                res.send(result)
           }
       })

   }catch(e){
       result.message = e.message
       res.status(400).json(result);
   }
})

// 로그인 기능
router.post("/login", (req, res) => {
    //logIn에서 값 가져옴
    const { id, pw } = req.body;

    // 프론트에 전달할 값 미리 만들기
    const result = {
        success : false,
        message : '',
        data : null
    };

    try{
        // id, pw 예외처리
        checkId(id)
        checkPw(pw)
        
        // DB 통신 - id, pw와 같은 사용자가 있는지
        // idx, id, pw, name, birth, tel 가져옴
        const sql = "SELECT * FROM account WHERE id = ? AND pw = ?";
        const values = [id, pw];

        conn.query(sql, values, (err, rows) => {
            if(err) {
                result.message = "DB 통신 오류 발생";
                res.status(500).json(result);
                return;
            }
            if (!rows || rows.length === 0) {
                result.message = "일치하는 사용자가 없습니다.";
                res.status(400).json(result);
                return;
            }
            // 일치하는 유저가 있을시 (성공시)
            // 해당하는 유저의 정보를 담음 (id, pw, name ...)
            const user = rows[0]

            // 세션 등록
            req.session.userIdx = user.accountnum_pk;
            req.session.userId = user.id;
            req.session.userPw = user.pw;
            req.session.userName = user.name;
            req.session.userBirth = user.birth;
            req.session.userTel = user.tel;

            result.success = true;
            result.message = "로그인 성공";
            result.data = user

            res.json(result);
        })
     

    }catch(e){
        result.message = e.message
        res.status(400).json(result);
    }
})

// 로그아웃 기능
router.delete("/logout", (req, res) => {
    const result = {
        success: false,
        message: ''
    };

    try {
        // 세션 존재 여부 확인 (이건 확인 못해봄..)
        checkSession(req);

        // 세션 삭제
        req.session.destroy(err => {
            if (err) {
                result.message = "세션 삭제 오류 발생";
                res.status(500).json(result);
                return;
            }
          
            result.success = true;
            result.message = "로그아웃 되었습니다.";
            res.json(result);
        });
    } catch (e) {
        result.message = e.message;
        res.status(400).json(result);
    }
});

// id 찾기 기능 - query string (특정한것 조회)
router.get("/find/id", (req, res) =>{
    //findId에서 값 가져옴
    const { name, birth, tel } = req.query;

    // 프론트에 전달할 값 미리 만들기
    const result = {
       success : false,
       message : '',
       data : null
   };

    try{
        // 예외처리
        checkName(name)
        checkBirth(birth)
        checkTel(tel)

        // DB 통신 (DB에서 가져온 값이 findId에서 가져온 값이랑 같은지 비교)
        // id반환
        
       
        // id 찾기 결과가 true일시
        result = true;
        result.data = id; //db에서 가져온 id값
        result.message = `당신의 id는 ${id}`

    }catch(e){
        result.message = e.message
    }finally{
        res.send(result);

    }
})

// 비밀번호 찾기 - query string
router.get("/find/pw", (req, res) => {
    // findPw에서 값 가져옴
    const { id, name, birth, tel} = req.query;

    // 프론트에 전달할 값 미리 만들기
    const result = {
        success : false,
        message : '',
        data : null
    };

    try{
        // 예외처리
        checkId(id)
        checkName(name)
        checkBirth(birth)
        checkTel(tel)

        // db 통신

        // Pw 찾기 결과가 true일시
        result.success = true;
        result.data = pw; // db에서 가져온 pw값
        result.message = `당신의 pw는 ${pw}입니다.`;


    }catch(e){
        result.message = e.message
    }finally{
        res.send(result);

    }
})


// 내 정보 보기 기능 - session (query?)
router.get("/", (req, res) => {
    // 세션에서 내 정보 가져옴
    const { userIdx, userId, userName, userBirth, userTel } = req.session;

    // 프론트에 전달할 값 미리 만들기
    const result = {
        success : false,
        message : '',
        data : null
    };

    try{
        //예외처리
        checkSession(req)

        //db통신

        //성공시
        result.success = true;
        result.message = "내 정보 보기 성공";
        result.data = {
            id : userId,
            name : userName,
            birth : userBirth,
            tel : userTel
        };
        
    }catch(e){
        result.message = e.message
    }finally{
        res.send(result);
    }
})

// 다른 사람 정보 보기
// router.get("/:idx" (req, res) => {
//     const otherIdx = req.params.idx;

// })

// 내 정보 수정 기능 - path parameter ('나' 만 가져와야하니까)
router.put("/", (req, res) => {
     // modifyMyInform에서 수정할 정보 가져옴
     const { pw, name, birth, tel} = req.body;

     // 프론트에 전달할 값 미리 만들기
     const result = {
         success : false,
         message : '',
         data : null
     };

    try{
        // 예외처리
        checkSession(req)
        checkPw(pw)
        checkName(name)
        checkBirth(birth)
        checkTel(tel)

        // db 통신 -> db data를 수정할 정보로 바꿔줌
        // 

        // 세션 정보 수정
        req.session.userPw = pw;
        req.session.userName = name;
        req.session.userBirth = birth;
        req.session.userTel = tel;

        // 정보 수정 성공시
        result.success = true;
        result.message = "정보가 수정되었습니다."
        result.data = {
            pw : pw,
            name : name,
            birth : birth,
            tel : tel
        };

    }catch(e){
        result.message = e.message
    }finally{
        res.send(result);

    }
})

// 회원 탈퇴 기능
router.delete("/", (req, res) =>{
        // 프론트에 전달할 값 미리 만들기
        const result = {
            success : false,
            message : ''
        };

    try{
        // 예외처리
        checkSession(req)

        // DB에서 삭제
        //

        // session에서 삭제
        req.session.destroy(err => {
            if(err) throw new Error("세션 오류 발생")
               
            // 삭제 성공시
            result.success = "true";
            result.message = "회원 탈퇴 되었습니다.";
        })

    }catch(e){
        result.message = e.message
    }finally{
        res.send(result);
    }
})


module.exports = router