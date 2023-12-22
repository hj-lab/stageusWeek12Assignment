const router = require("express").Router() 
const { checkSession, checkId, checkPw, checkName, checkBirth, checkTel, checkBlank, checkIdx } = require('../modules/check');
const conn = require("../../config/database")

// 댓글 쓰기, 읽기, 수정, 삭제

// 댓글 쓰기 기능 (완)
router.post("/", (req, res) =>{
    // 글 내용 받아오기
    const {contents, boardIdx} = req.body

    // 프론트에 전달할 값 미리 만들기
    const result = {
        success : false,
        message : '',
        data : null
    };

    try{
        //예외처리
        checkSession(req)
        checkIdx(boardIdx)
        checkBlank(contents)

        // db 통신 -> 
        // comment table에 등록
        const sql = "INSERT INTO comment (boardnum_fk, accountid_fk, contents) VALUES (?, ?, ?)";
        const values = [boardIdx, req.session.userId, contents];

        conn.query(sql, values, (err, resultDB) => {
            if (err) {
                result.message = "댓글 쓰기 DB 통신 오류 발생";
                res.status(500).json(result);
                return;
            }

            if (resultDB.affectedRows == 0) {
                result.message = "댓글을 추가할 수 없습니다.";
                res.status(404).json(result);
                return;
            }

            // 댓글 추가 성공시
            result.success = true;
            result.message = "댓글 쓰기 성공";
            result.data = {
                boardnum_fk: boardIdx,
                commentnum_pk: resultDB.insertId, // 삽입된 댓글의 ID (auto_increment)
                accountid_fk: req.session.userId, // 세션의 사용자 ID
                contents: contents,
                createAt: new Date().toISOString() // 현재 시간
            };
            res.json(result);
        });
    }catch(e){
        result.message = e.message
        res.status(400).json(result)
    }
})

// 댓글 읽기 기능 - query string (필터링, 정렬)
router.get("/", (req, res) => {
    // 세션값 받아오기
    const sessionIdx = req.session.userIdx;
    // 읽고자 하는 댓글이 있는 게시글의 idx 가져옴
    const boardIdx = req.query.boardIdx;

    const result = {
        success : false,
        message : '',
        data : null
    };

    try{
        //예외처리
        checkSession(req)
        checkIdx(boardIdx)

        // db 통신 -> boardnum_fk = boardnum 인 댓글 다 가져오기
        const sql = "SELECT * FROM comment WHERE boardnum_fk = ?";
        
        conn.query(sql, [boardIdx], (err, rows) => {
            if (err) {
                result.message = "댓글 읽기 실패";
                res.status(500).json(result);
                return;
            }

            // 해당하는 게시글의 댓글이 없는 경우
            if (rows.length == 0) {
                result.message = "해당하는 댓글이 없습니다.";
                res.status(404).json(result);
                return;
            }

            // 댓글 가져오기 성공시
            result.success = true;
            result.message = "댓글 읽기 성공";
            result.data = rows
            res.json(result);
        });
    }catch(e){
        result.message = e.message
        res.status(400).json(result)
    }
})

// 댓글 수정 기능 - path parameter (댓글 번호 가져와서 그거 수정) (완)
router.put("/:idx", (req, res) => {
    // 수정하고자 하는 댓글의 commentnum_pk 가져옴
    const commentIdx = req.params.idx;
    const {contents}  = req.body;

    // 프론트에 전달할 값 미리 만들기
    const result = {
        success : false,
        message : '',
        data : null
    };

    try{
        // 예외처리
        checkSession(req)
        checkIdx(commentIdx)
        checkBlank(contents)

        const myId = req.session.userId;

        // db 통신 -> commentnum_pk에 해당하는 댓글 가져와서 contents 수정
        const sql = "UPDATE comment SET contents = ? WHERE commentnum_pk = ? AND accountid_fk = ?";
        const values = [contents, commentIdx, myId];

        conn.query(sql, values, (err, rows) => {
            if (err) {
                result.message = "댓글 수정 DB 통신 오류 발생";
                res.status(500).json(result);
                return;
            }

            // 수정된 댓글이 없는 경우
            if (rows.affectedRows == 0) {
                result.message = "해당 댓글을 찾을 수 없습니다.";
                res.status(404).json(result);
                return;
            }

            // 댓글 수정 성공
            result.success = true;
            result.message = "댓글 수정 성공";
            result.data = {
                contents: contents
            };
            res.json(result);
        });

    }catch(e){
        result.message = e.message
        res.status(400).json(result)
    }

})

// 댓글 삭제 기능 - path parameter (완)
router.delete("/:idx", (req, res) => {
    const commentIdx = req.params.idx;

    // 프론트에 전달할 값 미리 만들기
    const result = {
        success : false,
        message : '',
    };

    try{
        // 예외처리
        checkSession(req)
        checkIdx(commentIdx)

        const myId = req.session.userId;
       
        // db 통신 -> commentnum_pk에 해당하는 댓글 삭제
        const sql = "DELETE FROM comment WHERE commentnum_pk = ? AND accountId_fk = ?";
        const values = [commentIdx, myId];
        
        conn.query(sql, values, (err, rows) => {
            if (err) {
                result.message = "댓글 삭제 실패";
                res.status(500).json(result);
                return;
            }

            if (rows.affectedRows == 0) {
                result.message = "해당하는 댓글이 없거나 삭제 권한이 없습니다.";
                res.status(404).json(result);
                return;
            }

            result.success = true;
            result.message = "댓글 삭제 성공";
            res.json(result);
        });
        
    }catch(e){
        result.message = e.message
    }

})

module.exports = router