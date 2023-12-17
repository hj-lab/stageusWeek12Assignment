const router = require("express").Router()
const { checkSession, checkId, checkPw, checkName, checkBirth, checkTel, checkBlank, checkIdx, checkDuplicateId } = require('../modules/check');
const conn = require("../../config/database")

router.get("/", (req, res) => {
    // const { id, pw, name } = req.body
    conn.query('SELECT * FROM account WHERE id = ?',['heeju'], (err, rows) => {
        if (err) {
          res.status(500).json({ error: err.message });
        } else {
          res.status(200).json(rows);
        }
      });

    
})


// 로그아웃 기능
router.delete("/logout", (req, res) => {
    const result = {
        success: false,
        message: ''
    };

    try {
        // 세션 존재 여부 확인
        //checkSession(req);

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


////////////////////////////////////////////////////
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



//////////////////////////////////////////////////
// !회원가입! 
// router.post("/", async(req, res) => {
//     // signUp에서 값 가져옴r
//     const { id, pw, name, birth, tel } = req.body

//     // 프론트에 전달할 값 미리 만들기
//     const result = {
//         success : false,
//         message : '',
//         data : null
//     };

//    try{
//        // 예외처리
//        checkId(id)
//        checkPw(pw)
//        checkName(name)
//        checkBirth(birth)
//        checkTel(tel)

//        //checkDuplicateId(id)
//        // Check for duplicate id
//        const isDuplicateId = await checkDuplicateId(id);
//        if (isDuplicateId) {
//            res.status(400).send({ message: 'The id already exists.' });
//            return;
//        }
       
//        // DB통신
//        const sql = "INSERT INTO account(id, pw, name, birth, tel) VALUES(?, ?, ?, ?, ?)";
//        const values = [id, pw, name, birth, tel];

//        conn.query(sql, values, (err, dbResult) => {
//            if(err){
//                 result.message = "DB 통신 에러";
//                 res.status(500).json(result);
//            }
//            else{
//                 result.success = true
//                 result.message = "DB 통신 성공"
//                 result.data = dbResult
//                 res.send(result)
//            }
//        })

//    }catch(e){
//        result.message = e.message
//        res.status(400).json(result);
//    }
// })


module.exports = router