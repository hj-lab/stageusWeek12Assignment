const express = require("express")
const app = express()
const port = 8001

app.get("/", (req, res) => {
    res.sendFile(`${__dirname}/public/index.html`)
})

// 1. 로그인 기능
app.get("/logIn", (req, res) => {
    //logIn에서 값 가져옴
    const { id, pw } = req.body;

    // 프론트에 전달할 값 미리 만들기
    const result = {
        success : false,
        message : '',
        data : null
    };

    // DB 통신 - id, pw와 같은 사용자가 있는지

    // 로그인 성공시
    result.success = true;
    result.message = "로그인 성공";
    result.data = {
        "id" : id,
        "pw" : pw,
        "name" : name,
        "birth" : birth, 
        "tel" : tel
    };
    // 세션 등록

    //로그인 실패시
    result.message ="로그인 실패"

    res.send(result);
})


// 2. 회원가입 기능
app.post("/signUp", (req, res) => {
    // signUp에서 값 가져옴
    const { id, pw, name, birth, tel } = req.body
    // 프론트에 전달할 값 미리 만들기
    const result = {
        success : false,
        message : '',
        data : null
    };
    // DB통신
    const newAccount = { id, pw, name, birth, tel }

    
    // 통신의 값이 true면
    result.success = true;
    result.message = "회원가입 성공"
    // 통신의 값이 false면
    result.message = "회원가입 실패"

    res.send(result);
})

// 3. id 찾기 기능 - query string (특정한것 조회)
app.get("/findId", (req, res) =>{
    //findId에서 값 가져옴
    const { name, birth, tel} = req.query;

    // DB 통신 (DB에서 가져온 값이 findId에서 가져온 값이랑 같은지 비교)
    // id반환
    
    // 프론트에 전달할 값 미리 만들기
    const result = {
        success : false,
        message : '',
        data : null
    };
    // id 찾기 결과가 true일시
    result = true;
    result.data = id; //db에서 가져온 id값
    result.message = `당신의 id는 ${id}`

    // id 찾기 결과가 false일시
    result.message = "일치하는 id가 없습니다."

    res.send(result);
})

// 4. 비밀번호 찾기 - query string
app.get("/findPw", (req, res) => {
    // findPw에서 값 가져옴
    const { id, name, birth, tel} = req.query;
    // DB 통신

    // 프론트에 전달할 값 미리 만들기
    const result = {
        success : false,
        message : '',
        data : null
    };
    // Pw 찾기 결과가 true일시
    result.success = true;
    result.data = pw; // db에서 가져온 pw값
    result.message = `당신의 pw는 ${pw}입니다.`;

    // Pw 찾기 결과가 false일시
    result.message = "일치하는 pw가 없습니다";

    res.send(result);
})

// 5. 내 정보 보기 기능 - session (query?)
app.get("/myInform", (req, res) => {
    // 세션에서 내 정보 가져옴
    const { id, name, birth, tel } = req.session;

    // 프론트에 전달할 값 미리 만들기
    const result = {
        success : false,
        message : '',
        data : null
    };

    // session에 등록이 안됐다면
    if(id==null){
        result.success = false;
        result.message = "로그인 하십시오";
    }   
    else{
        result.success = true;
        result.message = "내 정보 보기 성공";
        result.data = {
            id : id,
            name : name,
            birth : birth,
            tel : tel
        };
    }
})

// 6. 내 정보 수정 기능 - path parameter ('나' 만 가져와야하니까)
app.put("/modifyMyInform/:id", (req, res) => {
    // db에서 가져온 내 정보를 수정하고 세션에도 등록해야함
    // modifyMyInform에서 수정할 정보 가져옴
    const id = req.params.id;
    const sessionId = req.session; // 세션 존재하는지 확인 해야함
    const { pw, name, birth, tel} = req.body;

    // 프론트에 전달할 값 미리 만들기
    const result = {
        success : false,
        message : '',
        data : null
    };

    // db 통신 -> db data를 수정할 정보로 바꿔줌

    // 세션 정보도 바꿔줌

    // 정보 수정 성공시
    result.success = true;
    result.message = "정보가 수정되었습니다."
    result.data = {
        pw : pw,
        name : name,
        birth : birth,
        tel : tel
    };
    // 정보 수정 실패시
    result.message = "정보 수정에 실패했습니다"

    res.send(result);
})

// 7. 회원 탈퇴 기능
app.delete("/quit", (req, res) =>{
    // session값 가져오기
    const { id, pw, name, birth, tel } = req.session; 

    // 프론트에 전달할 값 미리 만들기
    const result = {
        success : false,
        message : ''
    };

    // session에서 삭제, db에서 삭제

    // 삭제 성공시 (session 값 존재할시)
    result.success = true;
    result.message = "회원 탈퇴 성공"
    // 삭제 실패시 (session값 존재안할시)
    result.message = "회원 탈퇴 실패"

    res.send(result);
})

// 8. 게시글 쓰기 기능
app.post("/write", (req, res) =>{
    // 글 내용 받아오기
    const {title, contents} = req.body
    const {id} = req.session

     // 프론트에 전달할 값 미리 만들기
     const result = {
        success : false,
        message : '',
        data : null
    };
    // db 통신
    // board table에 등록

    // 글쓰기 성공시
    result.success = true;
    result.message = "글쓰기 성공";
    result.data = { // board table의 값 저장
        "boardnum_pk" : boardnum_pk,
        "accountid_fk" : id, // 세션의 id
        "title" : title,
        "contents" : contents,
        "createAt" : createAt
    };
    // 글쓰기 실패시
    result.message = "글쓰기 실패";
    
    res.send(result);
})

// 9. 게시글 읽기 기능 (전체 목록 보는 board, 개별 post 보는 showpost)

// 전체 목록 보는 board
app.get("/board", (req,res) => {
    // db에서 전체 게시글 내용 가져옴

    // 프론트에 전달할 값 미리 만들기
    const result = {
        success : false,
        message : '',
        data : null
    };

    // 가져오기 성공시
    result.success = true;
    result.data = {
        "boardnum_pk" : boardnum_pk,
        "title" : title,
        "accountid_fk" : accountid_fk,
        "contents" : contents,
        "createAt" : createAt
    };
    result.message = "게시글 목록 전체 가져오기 성공"

    // 가져오기 실패시
    result.message = "게시글 목록 전체 가져오기 실패"
    
    res.send(result)
})

// 개별 post 보는 showPost - path parameter (어떤 자원을 특정해서 보여줄때)
app.get("/showPost/:boardnum_pk", (req, res) => {
    // 클릭한 게시글의 boardnum 가져옴
    const boardnum_pk = req.params.boardnum_pk;
    
    // db에서 boardnum_pk에 해당하는 것의
    // title, accountid_fk, contents, createAt 가져옴

     // 프론트에 전달할 값 미리 만들기
     const result = {
        success : false,
        message : '',
        data : null
    };

    // 성공시
    result.success = true;
    result.message = "showPost 성공";
    result.data = { // board table의 값 
        "boardnum_pk" : boardnum_pk,
        "accountid_fk" : id, // 세션의 id
        "title" : title,
        "contents" : contents,
        "createAt" : createAt
    };

    //실패시
    result.message = "showPost 실패";
    
    res.send(result);
})

// 10. 게시글 수정 기능 - path parameter (게시글 번호 받아와서 그거 수정)
app.put("/modifyPost/:boardnum_pk", (req,res) => {
    // modifyPost에서 수정할 title, content 가져옴
    const boardnum_pk = req.params.boardnum_pk;
    const { title, contents } = req.body
    const {id} = req.session

    // DB 통신 -> table의 값 바꾸기

    // 프론트에 전달할 값 미리 만들기
    const result = {
        success : false,
        message : '',
        data : null
    };

    // 수정 성공시
    result.success = true;
    result.message = "게시글 수정 성공"
    result.data = {
        "boardnum_pk" : boardnum_pk,
        "accountid_fk" : id, // 세션의 id
        "title" : title,
        "contents" : contents,
        "createAt" : createAt // 이건 안바뀌어야하는거아님?
    }

    // 수정 실패시
    result.message = "게시글 수정 실패"

    res.send(result)
})

// 11. 게시글 삭제 기능 - path parameter
app.delete("/delPost/:boardnum_pk", (req, res) =>{
    // delete할 post 가져오기
    const boardnum_pk = req.params.boardnum_pk;
    const { id } = req.session; // 로그인 상태인지 확인

     // 프론트에 전달할 값 미리 만들기
     const result = {
        success : false,
        message : '',
    };

    // db 통신 -> id가 존재하고 id=accountid_fk이면  boardnum_pk 해당하는 게시글 삭제

    // 삭제 성공시
    result.success = true;
    result.message = "게시글 삭제 성공"

    // 삭제 실패시
    result.message = "게시글 삭제 실패"
    
})

// 12. 댓글 쓰기 기능
app.post("/showPost", (req, res) =>{
    // 글 내용 받아오기
    const {contents} = req.body
    const {id, boardnum} = req.session

     // 프론트에 전달할 값 미리 만들기
     const result = {
        success : false,
        message : '',
        data : null
    };
    // db 통신 -> 
    // comment table에 등록

    // 글쓰기 성공시
    result.success = true;
    result.message = "글쓰기 성공";
    result.data = { // board table의 값 저장
        "boardnum_fk" : boardnum_fk,
        "commentnum_pk" : commentnum_pk, // auto_increment
        "accountid_fk" : id, // 세션의 id
        "contents" : contents,
        "createAt" : createAt
    };
    // 글쓰기 실패시
    result.message = "글쓰기 실패";
    
    res.send(result);
})

// 13. 댓글 읽기 기능 - query string (필터링, 정렬)
app.get("/showPost", (req, res) => {
    // 읽고자 하는 댓글이 있는 Post의 num 가져옴
    const boardnum = req.query.boardnum;
    const id = req.session;

    const result = {
        success : false,
        message : '',
        data : null
    };

    // db 통신 -> boardnum_fk = boardnum 인 댓글 다 가져오기

    // 댓글 가져오기 성공시
    result.success = true;
    result.message = "댓글 읽기 성공"
    result.data = {
        boardnum_fk : boardnum, // 게시글 번호
        commentnum_pk : commentnum_pk, // 댓글 번호
        accountid_fk : id, // 내 id
        contents : contents, // 내용
        createAt : createAt // 생성일시
    };
    // 댓글 가져오기 실패시
    result.message = "댓글 읽기 실패"
})

// 14. 댓글 수정 기능 - path parameter (댓글 번호 가져와서 그거 수정)
app.put("/modifyComment/:commentnum_pk", (req, res) => {
    // 수정하고자 하는 댓글의 commentnum_pk 가져옴
    const commentnum_pk = req.params.commentnum_pk;
    const contents  = req.body;
    const id  = req.session;

    // 프론트에 전달할 값 미리 만들기
    const result = {
        success : false,
        message : '',
        data : null
    };

    // db 통신 -> commentnum_pk에 해당하는 댓글 가져와서 contents 수정

    // 수정 성공시
    result.success = true;
    result.message = "댓글 수정 성공";
    result.data = {
        contents : contents
    };
    // 수정 실패시
    result.message = "댓글 수정 실패";

    res.send(result);
})

// 15. 댓글 삭제 기능 - path parameter
app.delete("/delComment/:commentnum_pk", (req, res) => {
    const commentnum_pk = req.params.commentnum_pk;

    // 프론트에 전달할 값 미리 만들기
    const result = {
        success : false,
        message : '',
    };

    // db 통신 -> commentnum_pk에 해당하는 댓글 삭제

    // 삭제 성공시
    result.success = true;
    result.message = "댓글 삭제 성공";

    // 삭제 실패시
    result.message = "댓글 삭제 실패";

    res.send(result);
})

app.listen(port, () => {
    console.log(`assignMent 파일의 ${port}번에서 서버 실행`)
})