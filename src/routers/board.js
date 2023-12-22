const router = require("express").Router()
const { checkSession, checkId, checkPw, checkName, checkBirth, checkTel, checkBlank, checkIdx } = require('../modules/check');
const conn = require("../../config/database")

// 게시글 쓰기, 읽기(전체, 개별), 수정, 삭제

// 게시글 쓰기 기능
router.post("/", (req, res) =>{
    // 글 내용 받아오기
    const {title, contents} = req.body

    // 프론트에 전달할 값 미리 만들기
    const result = {
        success : false,
        message : '',
        data : null
    };

    try{
        // 예외처리
        checkSession(req)
        checkBlank(title)
        checkBlank(contents)
        
        const userId = req.session.userId;
        // db 통신
        const sql = "INSERT INTO board (accountid_fk, title, contents) VALUES (?, ?, ?)";
        const values = [userId, title, contents];

        // 글쓰기 성공시
        conn.query(sql, values, (err, rows) => {
            if (err) {
                result.message = "게시글 쓰기 DB 통신 오류 발생";
                res.status(500).json(result);
                return;
            }

            if (rows.affectedRows == 0) { //변경점이 없으면
                result.message = "게시글을 추가할 수 없습니다.";
                res.status(404).json(result);
                return;
            }

            // 게시글 추가 성공시
            result.success = true;
            result.message = "게시글 쓰기 성공";
            result.data = {
                boardnum_pk: rows.insertId, // 삽입된 게시글의 ID (auto_increment)
                accountid_fk: userId, // 세션의 사용자 ID나 idx
                title: title,
                contents: contents,
                createAt: new Date().toISOString() // 현재 시간
            };
            res.json(result);
        });

    }catch(e){
        result.message = e.message
        res.status(400).json(result);
    }
})

// 게시글 읽기 기능 (전체 목록 보는 board, 개별 post 보는 showpost)

// 전체 목록 보는 board
router.get("/all", (req,res) => {
    // 프론트에 전달할 값 미리 만들기
    const result = {
        success : false,
        message : '',
        data : null
    };
    try{
        // 예외처리
        checkSession(req)

        // db에서 전체 게시글 내용 가져옴
        const sql = "SELECT * FROM board";

        conn.query(sql, (err, rows) => {
            if (err) {
                result.message = "게시글 목록 가져오기 실패";
                res.status(500).json(result);
                return;
            }

            // 게시글 목록 가져오기 성공시
            result.success = true;
            result.data = rows;
            result.message = "게시글 목록 전체 가져오기 성공";
            res.json(result);
        });

    }catch(e){
        result.message = e.message
    }
})

// 개별 post 보는 showPost - path parameter (완)
router.get("/:idx", (req, res) => {
    // 클릭한 게시글의 boardnum 가져옴
    const boardIdx = req.params.idx;
    
    // 프론트에 전달할 값 미리 만들기
    const result = {
        success : false,
        message : '',
        data : null
    };

    try{
        // 예외처리
        checkSession(req)

        // db에서 boardnum_pk에 해당하는 것의
        // title, accountid_fk, contents, createAt 가져옴
        const sql = "SELECT * FROM board WHERE boardnum_pk = ?";
        
        conn.query(sql, [boardIdx], (err, rows) => {
            if (err) {
                result.message = "DB 통신 실패";
                res.status(500).json(result);
                return;
            }

            // 해당하는 게시글이 없는 경우
            if (rows.length == 0) {
                result.message = "해당하는 게시글이 없습니다.";
                res.status(404).json(result);
                return;
            }

            // 조회된 게시글 반환
            const postData = rows[0];
            result.success = true;
            result.message = "해당 게시글 조회 성공";
            result.data = {
                "boardnum_pk": postData.boardnum_pk,
                "accountid_fk": postData.accountid_fk,
                "title": postData.title,
                "contents": postData.contents,
                "createAt": postData.createAt
            };
            res.json(result);
        });

    }catch(e){
        result.message = e.message
        res.status(400).json(result)
    }
})

// 게시글 수정 기능 - path parameter (게시글 번호 받아와서 그거 수정)
router.put("/:idx", (req,res) => {

    // modifyPost에서 수정할 title, content 가져옴
    const boardIdx = req.params.idx;
    const { title, contents } = req.body
    


    // 프론트에 전달할 값 미리 만들기
    const result = {
        success : false,
        message : '',
        data : null
    };

    try{
        checkSession(req)
        checkIdx(boardIdx)
        checkBlank(title)
        checkBlank(contents)

        const myId = req.session.userId
        // DB 통신 -> table의 값 바꾸기
        const sql = "UPDATE board SET title = ?, contents = ? WHERE boardnum_pk = ? AND accountid_fk = ?";
        const values = [title, contents, boardIdx, myId]

        conn.query(sql, values, (err, rows) => {
            if (err) {
                result.message = "게시글 수정 실패";
                res.status(500).json(result);
                return;
            }

            if (rows.affectedRows == 0) {
                result.message = "해당하는 게시글이 없거나 수정 권한이 없습니다.";
                res.status(404).json(result);
                return;
            }

            result.success = true;
            result.message = "게시글 수정 성공";
            result.data = {
                "boardnum_pk": boardIdx,
                "accountid_fk": req.session.userIdx,
                "title": title,
                "contents": contents
            };
            res.json(result);
        });
       
    }catch(e){
        result.message = e.message
        res.status(400).json(result)
    }
})

// 게시글 삭제 기능 - path parameter (완)
router.delete("/:idx", (req, res) =>{
     // delete할 post 가져오기
     const boardIdx = req.params.idx;

     // 프론트에 전달할 값 미리 만들기
     const result = {
         success : false,
         message : '',
     };

    try{
        // 예외처리
        checkSession(req)
        checkIdx(boardIdx)

        const myId = req.session.userId
        // db 통신 -> id가 존재하고 id=accountid_fk이면  boardnum_pk 해당하는 게시글 삭제
        const sql = "DELETE FROM board WHERE boardnum_pk = ? AND accountId_fk = ?";
        const values = [boardIdx, myId]; // 현재 로그인한 사용자의 userId로 비교
        conn.query(sql, values, (err, resultDB) => {
            if (err) {
                result.message = "게시글 삭제 실패";
                res.status(500).json(result);
                return;
            }

            if (resultDB.affectedRows === 0) {
                result.message = "해당하는 게시글이 없거나 삭제 권한이 없습니다.";
                res.status(404).json(result);
                return;
            }

            result.success = true;
            result.message = "게시글 삭제 성공";
            res.json(result);
        });

    }catch(e){
        result.message = e.message
    }
})

module.exports = router