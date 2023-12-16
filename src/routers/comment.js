const router = require("express").Router() 

// 댓글 쓰기, 읽기, 수정, 삭제

// 댓글 쓰기 기능
router.post("/", (req, res) =>{
    // 세션값 받아오기
    const sessionIdx = req.session.userIdx;
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
        if(!sessionIdx || sessionIdx == "" || sessionIdx == undefined ) throw new Error("로그인 하십시오.")
        if(!boardIdx || boardIdx == "" || boardIdx == undefined) throw new Error("해당 게시글을 찾을 수 없습니다.")
        if(!contents || contents == "" || contents == undefined) throw new Error("내용을 입력하세요.")

        // db 통신 -> 
        // comment table에 등록

        // if(글쓰기 성공시)
        result.success = true;
        result.message = "글쓰기 성공";
        result.data = { // board table의 값 저장
            "boardnum_fk" : boardnum_fk,
            "commentnum_pk" : commentnum_pk, // auto_increment
            "accountid_fk" : id, // 세션의 id
            "contents" : contents,
            "createAt" : createAt
        };

        //if(db통신 실패시) throw new Error("db통신실패")

    }catch(e){
        result.message = e.message
    }finally{
        res.send(result)
    }
})

// 댓글 읽기 기능 - query string (필터링, 정렬)
router.get("/:idx", (req, res) => {
    // 세션값 받아오기
    const sessionIdx = req.session.userIdx;
    // 읽고자 하는 댓글이 있는 게시글의 idx 가져옴
    const boardIdx = req.query.boardIdx;
    // 댓글의 idx
    const commentIdx = req.params.idx;

    const result = {
        success : false,
        message : '',
        data : null
    };

    try{
        //예외처리
        if(!sessionIdx || sessionIdx == "" || sessionIdx == undefined ) throw new Error("로그인 하십시오.")
        if(!boardIdx || boardIdx == "" || boardIdx == undefined) throw new Error("해당 게시글을 찾을 수 없습니다.")
        if(!commentIdx || commentIdx == "" || commentIdx == undefined) throw new Error("해당 댓글을 찾을 수 없습니다.")
        

        // db 통신 -> boardnum_fk = boardnum 인 댓글 다 가져오기

        // if(댓글 가져오기 성공시)
        result.success = true;
        result.message = "댓글 읽기 성공"
        result.data = {
            boardnum_fk : boardnum, // 게시글 번호
            commentnum_pk : commentnum_pk, // 댓글 번호
            accountid_fk : id, // 내 id
            contents : contents, // 내용
            createAt : createAt // 생성일시
        };

        //if(db통신 실패시) throw new Error("db통신실패")

    }catch(e){
        result.message = e.message
    }finally{
        // 최종적으로 실행되는거 (try, catch 둘중 뭐든 실행하고 나면)
        res.send(result)
    }
})

// 댓글 수정 기능 - path parameter (댓글 번호 가져와서 그거 수정)
router.put("/:idx", (req, res) => {
    // 세션값 받아오기
    const sessionIdx = req.session.userIdx;
    // 수정하고자 하는 댓글의 commentnum_pk 가져옴
    const commentIdx = req.params.idx;
    const contents  = req.body;

    // 프론트에 전달할 값 미리 만들기
    const result = {
        success : false,
        message : '',
        data : null
    };

    try{
        // 예외처리
        if(!sessionIdx || sessionIdx == "" || sessionIdx == undefined ) throw new Error("로그인 하십시오.")
        if(!commentIdx || commentIdx == "" || commentIdx == undefined) throw new Error("해당 댓글을 찾을 수 없습니다.")
        if(!contents || contents == "" || contents == undefined) throw new Error("내용을 입력하세요.")

        // db 통신 -> commentnum_pk에 해당하는 댓글 가져와서 contents 수정

        // if(수정 성공시) accountid_fk = sessionIdx 본인일시
        result.success = true;
        result.message = "댓글 수정 성공";
        result.data = {
            contents : contents
        };

        //if(db통신 실패시) throw new Error("db통신실패")

    }catch(e){
        result.message = e.message
    }finally{
        // 최종적으로 실행되는거 (try, catch 둘중 뭐든 실행하고 나면)
        res.send(result)
    }

})

// 댓글 삭제 기능 - path parameter
router.delete("/:idx", (req, res) => {
    // 세션값 받아오기
    const sessionIdx = req.session.userIdx;
    const commentIdx = req.params.idx;

    // 프론트에 전달할 값 미리 만들기
    const result = {
        success : false,
        message : '',
    };

    try{
        // 예외처리
        // 예외처리
        if(!sessionIdx || sessionIdx == "" || sessionIdx == undefined ) throw new Error("로그인 하십시오.")
        if(!commentIdx || commentIdx == "" || commentIdx == undefined) throw new Error("해당 댓글을 찾을 수 없습니다.")
       
        // db 통신 -> commentnum_pk에 해당하는 댓글 삭제

        // if(삭제 성공시) accountid_fk = sessionIdx 본인일 경우
        result.success = true;
        result.message = "댓글 삭제 성공";
    
        //if(db통신 실패시) throw new Error("db통신실패")

    }catch(e){
        result.message = e.message
    }finally{
        // 최종적으로 실행되는거 (try, catch 둘중 뭐든 실행하고 나면)
        res.send(result)
    }

})

module.exports = router