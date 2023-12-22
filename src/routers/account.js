const router = require("express").Router()
const { checkSession, checkId, checkPw, checkName, checkBirth, checkTel, checkBlank, checkIdx, checkDuplicateId, checkPwMatch } = require('../modules/check');
const conn = require("../../config/database")

// 회원가입, 로그인, 로그아웃, id찾기, pw찾기, 정보 보기(나, 다른사람), 내 정보 수정, 회원 탈퇴

// 회원가입 기능 (완)
router.post("/", async(req, res) => {
    // signUp에서 값 가져옴
    const { id, pw, pwCheck, name, birth, tel } = req.body

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
       checkPwMatch(pw,pwCheck)
       checkName(name)
       checkBirth(birth)
       checkTel(tel)
       // 비동기함수 id중복check
       await checkDuplicateId(id)
       // DB통신
       const sql = "INSERT INTO account(id, pw, name, birth, tel) VALUES(?, ?, ?, ?, ?)";
       const values = [id, pw, name, birth, tel];

       conn.query(sql, values, (err, rows) => {
           if(err){
                result.message = "DB 통신 에러";
                res.status(500).json(result);
           }
           else{
                result.success = true
                result.message = "DB 통신 성공"
                result.data = {
                    "id" : id,
                    "pw" : pw,
                    "name" : name,
                    "birth" : birth,
                    "tel" : tel
                }
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


// id 찾기 기능 - query string (특정한것 조회) (완)
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
        const sql = "SELECT id FROM account WHERE name = ? AND birth = ? AND tel = ?";
        const values = [name, birth, tel];

        conn.query(sql, values, (err, rows) =>{
            if(err){
                result.message = "ID찾기 DB 통신 오류"
                res.status(500).json(result);
                return;
            }
            
            if(!rows || rows.length == 0) {
                result.message ="일치하는 사용자가 없습니다.";
                res.status(404).json(result);
                return;
            }

            const id = rows[0].id;

            // id 찾기 결과가 true일시
            result.success = true;
            result.data = id; // db에서 가져온 id값
            result.message = `당신의 id는 ${id}`;

            res.json(result);
        })
        

    }catch(e){
        result.message = e.message
        res.status(400).json(result);
    }
})

// 비밀번호 찾기 - query string (완)
router.get("/find/pw", (req, res) => {
    // findPw에서 값 가져옴
    const { id, name, birth, tel } = req.query;

    // 프론트에 전달할 값 미리 만들기
    const result = {
        success: false,
        message: '',
        data: null
    };

    try {
        // 예외처리
        checkId(id);
        checkName(name);
        checkBirth(birth);
        checkTel(tel);

        // DB 통신 - 해당 ID의 사용자의 비밀번호 조회
        const sql = "SELECT pw FROM account WHERE id = ? AND name = ? AND birth = ? AND tel = ?";
        const values = [id, name, birth, tel];

        conn.query(sql, values, (err, rows) => {
            if (err) {
                result.message = "PW찾기 DB 통신 오류 발생";
                res.status(500).json(result);
                return;
            }

            if (!rows || rows.length == 0) {
                result.message = "일치하는 사용자가 없습니다.";
                res.status(404).json(result);
                return;
            }

            const pw = rows[0].pw;

            // 비밀번호 찾기 결과가 true일시
            result.success = true;
            result.data = pw; // DB에서 가져온 pw 값
            result.message = `당신의 비밀번호는 ${pw}입니다.`;
            res.json(result);
        });

    }catch(e){
        result.message = e.message
        res.status(400).json(result);
    }
})


// 내 정보 보기 기능 - session (query?)
router.get("/", (req, res) => {
    // 프론트에 전달할 값 미리 만들기
    const result = {
        success : false,
        message : '',
        data : null
    };

    try{
        //예외처리
        checkSession(req)

        //성공시
        result.success = true;
        result.message = "내 정보 보기 성공";
        result.data = {
            id : req.session.userId,
            name : req.session.userName,
            birth : req.session.userBirth,
            tel : req.session.userTel
        };
        
    }catch(e){
        result.message = e.message
    }finally{
        res.send(result);
    }
})

// 다른 사람 정보 보기
router.get("/:idx", (req, res) => {
    const otherIdx = req.params.idx;

    const result = {
        success: false,
        message: '',
        data: null
    };

    try {
        // DB 통신 - 해당 idx에 해당하는 사용자 정보 조회
        const sql = "SELECT id, name, birth, tel FROM account WHERE accountnum_pk = ?";
        const values = [otherIdx];

        conn.query(sql, values, (err, rows) => {
            if (err) {
                result.message = "DB 통신 오류 발생";
                res.status(500).json(result);
                return;
            }

            if (!rows || rows.length === 0) {
                result.message = "해당 사용자 정보를 찾을 수 없습니다.";
                res.status(404).json(result);
                return;
            }

            const userInfo = rows[0];

            // 해당 사용자 정보 반환
            result.success = true;
            result.data = userInfo;
            result.message = `다른 사용자 정보(${otherIdx}) 조회 완료`;
            res.json(result);
            })

        } catch (e) {
            result.message = e.message;
            res.status(400).json(result);
        }
})

// 내 정보 수정 기능 - path parameter 
router.put("/", (req, res) => {
    // modifyMyInform에서 수정할 정보 가져옴
    const { pw, pwCheck, name, birth, tel} = req.body;

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
       checkPwMatch(pw, pwCheck)
       checkName(name)
       checkBirth(birth)
       checkTel(tel)

       // 현재 세션 idx
       const myIdx = req.session.userIdx;

       // db 통신 -> db data를 수정할 정보로 바꿔줌
       const sql = "UPDATE account SET pw=?, name=?, birth=?, tel=? WHERE accountnum_pk = ?";
       const values = [pw, name, birth, tel, myIdx]

       conn.query(sql, values, (err, rows) => {
            if (err) {
                result.message = "정보 수정 DB 통신 오류 발생";
                res.status(500).json(result);
                return;
            }

            if (!rows || rows.length == 0) {
                result.message = "해당 사용자 정보를 찾을 수 없거나 수정 권한이 없습니다.";
                res.status(404).json(result);
                return;
            }

            const userInfo = rows[0];

            // 해당 사용자 정보 반환
            result.success = true;
            result.data = userInfo;
            result.message = "정보 수정 완료";

            // 세션 정보 수정
            req.session.userPw = pw;
            req.session.userName = name;
            req.session.userBirth = birth;
            req.session.userTel = tel;
            res.json(result);
        })
       
      

   }catch(e){
       result.message = e.message
       res.status(400).json(result);
   }
})

// 회원 탈퇴 기능 (완..? 세션 체크 필요 path parameter로 줬을땐 작동함)
router.delete("/", (req, res) =>{
    // 프론트에 전달할 값 미리 만들기
    const result = {
        success : false,
        message : ''
    };

    try {
        // 예외처리 (이부분 생각)
        checkSession(req);
        // 이부분 test
        const userIdx = req.session.userIdx; // 세션에서 사용자의 ID나 idx 가져오기
        //const userIdx = req.params.idx;

        // DB에서 사용자 정보 삭제
        const sql = "DELETE FROM account WHERE accountnum_pk = ?";
        conn.query(sql, [userIdx], (err, rows) => {
            if (err) {
                result.message = "회원 탈퇴 DB 통신 오류 발생";
                res.status(500).json(result);
                return;
            }

            if (!rows || rows.length == 0) {
                result.message = "해당 사용자 정보를 찾을 수 없거나 탈퇴 권한이 없습니다.";
                res.status(404).json(result);
                return;
            }

            // 세션에서 사용자 정보 삭제
            req.session.destroy(err => {
                if (err) {
                    result.message = "회원 탈퇴 세션 오류 발생";
                    res.status(500).json(result);
                    return;
                }

                // 삭제 성공시
                result.success = true;
                result.message = "회원 탈퇴 되었습니다.";
                res.json(result);
            });
        });
    } catch (e) {
        result.message = e.message;
        res.status(400).json(result);
    }
});


module.exports = router