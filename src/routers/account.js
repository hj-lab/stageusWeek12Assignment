const router = require("express").Router()
const { checkSession, checkId, checkPw, checkName, checkBirth, checkTel } = require('../modules/check');

// 회원가입, 로그인, 로그아웃, id찾기, pw찾기, 정보 보기(나, 다른사람), 내 정보 수정, 회원 탈퇴

// 회원가입 기능
router.post("/", (req, res) => {
     // signUp에서 값 가져옴r
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
        
        // DB통신
       // const newAccount = { id, pw, name, birth, tel }
       const dbResult = {
            "id" : "성공했다"
       }
        
        // 통신의 값이 true면
        result.success = true;
        result.message = "회원가입 성공"
        result.data = dbResult

    }catch(e){
        result.message = e.message
    }finally{
        // 최종적으로 실행되는거 (try, catch 둘중 뭐든 실행하고 나면)
        res.send(result)
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


        // 로그인 성공시
        result.success = true;
        result.message = "로그인 성공";
        result.data = {
            "id" : id,
            "pw" : pw,
            "name" : userName,
            "birth" : birth, 
            "tel" : tel
        };

        // 세션 등록
        req.session.userIdx = idx;
        req.session.userId = id;
        req.session.userPw = pw;
        req.session.userName = userName;
        req.session.userBirth = birth;
        req.session.userTel = tel;


    }catch(e){
        result.message = e.message
    }finally{
        res.send(result)
    }

})

// 로그아웃 기능
router.delete("/logout", (req, res) =>{
     // session값 가져오기 -> 필요없나?
     const { id, pw, name, birth, tel } = req.session; 

     // 프론트에 전달할 값 미리 만들기
     const result = {
         success : false,
         message : ''
     };

    try{
        // 예외처리
        checkSession(req)

        // session에서 삭제
        req.session.destroy(err => {
            if(err) throw new Error("세션 삭제 오류 발생")
          
            // 삭제 성공시
            result.success = "true";
            result.message = "로그아웃 되었습니다.";
        })

    }catch(e){
        result.message = e.message
    }finally{
        res.send(result)
    }
}) 

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