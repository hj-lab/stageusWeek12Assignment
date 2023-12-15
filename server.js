const e = require("express");
const express = require("express");
const session = require("express-session"); // 세션
const memoryStore = require("memorystore")(session); //세션값 저장할곳
const app = express();
const port = 8001;


// 세션 미들웨어 추가
app.use(session({
    secret : "hj", // 필수, SID 생성시 사용되는 비밀키
    resave : false, // session에 변경사항이 없으면 다시 저장할것인지? -> no 
    saveUninitialized : false // request에서 session에 아무런 작업이 없으면 강제로 저장할것인지? -> no (내용없는 session 저장 방지)
}))

// 1. 로그인 기능
app.post("/logIn", (req, res) => {
    try{
        //logIn에서 값 가져옴
        const { id, pw } = req.body;

        // 프론트에 전달할 값 미리 만들기
        const result = {
            success : false,
            message : '',
            data : null
        };

        // id, pw 예외처리
        if(!id.trim() || id.length < 4 || id.length > 10){
            result.message = "ID는 공백 제외 4~10자여야합니다."
            res.send(result);
            return;
        }

        if(!pw.trim() || pw.length < 8 || pw.length > 15 || !(/[a-zA-Z]/.test(pw)) || !(/\d/.test(pw)) ){ // \d : 0~9 숫자
            result.message = "PW는 공백 제외, 영문자 숫자 포함 8~15자여야합니다."
            res.send(result);
            return;
        }
        

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

        res.send(result);

    }catch(Exception e){
        e.printStackTrace();
    }

})



// 2. 회원가입 기능
app.post("/signUp", (req, res) => {
    try{
        // signUp에서 값 가져옴
        const { id, pw, name, birth, tel } = req.body

        // 프론트에 전달할 값 미리 만들기
        const result = {
            success : false,
            message : '',
            data : null
        };

        // 예외처리
        if (!id.trim() || id.length < 4 || id.length > 10) {
            result.message = "ID는 공백 제외 4~10자여야합니다.";
            res.send(result);
            return;
        }

        if(!pw.trim() || pw.length < 8 || pw.length > 15 || !(/[a-zA-Z]/.test(pw)) || !(/\d/.test(pw)) ){ // \d : 0~9 숫자
            result.message = "PW는 공백 제외, 영문자 숫자 포함 8~15자여야합니다."
            res.send(result);
            return;
        }

        if (!name.trim() || name.length < 2 || name.length > 5) {
            result.message = "이름은 공백 제외 2~5자여야합니다.";
            res.send(result);
            return;
        }

        if (!birth.trim()) {
            result.message = "생년월일을 입력하세요.";
            res.send(result);
            return;
        }

        if (!tel.trim() || !(/^\d+$/.test(tel))) {
            result.message = "전화번호는 숫자만 입력해야합니다.";
            res.send(result);
            return;
        }


        // DB통신
        const newAccount = { id, pw, name, birth, tel }

        
        // 통신의 값이 true면
        result.success = true;
        result.message = "회원가입 성공"
        res.send(result);
    }catch(Exception e){
        e.printStackTrace();
    }
})

// 3. id 찾기 기능 - query string (특정한것 조회)
app.get("/findId", (req, res) =>{
    try{
        //findId에서 값 가져옴
        const { name, birth, tel } = req.query;

         // 프론트에 전달할 값 미리 만들기
         const result = {
            success : false,
            message : '',
            data : null
        };

        // 예외처리
        if (!name.trim() || name.length < 2 || name.length > 5) {
            result.message = "이름은 공백 제외 2~5자여야합니다.";
            res.send(result);
            return;
        }

        if (!birth.trim()) {
            result.message = "생년월일을 입력하세요.";
            res.send(result);
            return;
        }

        if (!tel.trim() || !(/^\d+$/.test(tel))) {
            result.message = "전화번호는 숫자만 입력해야합니다.";
            res.send(result);
            return;
        }

        // DB 통신 (DB에서 가져온 값이 findId에서 가져온 값이랑 같은지 비교)
        // id반환
        
       
        // id 찾기 결과가 true일시
        result = true;
        result.data = id; //db에서 가져온 id값
        result.message = `당신의 id는 ${id}`

        res.send(result);
    }catch(Exception e){
        e.printStackTrace();
    }
})

// 4. 비밀번호 찾기 - query string
app.get("/findPw", (req, res) => {
    try{
        // findPw에서 값 가져옴
        const { id, name, birth, tel} = req.query;

        // 프론트에 전달할 값 미리 만들기
        const result = {
            success : false,
            message : '',
            data : null
        };

        // 예외처리
        if (!id.trim() || id.length < 4 || id.length > 10) {
            result.message = "ID는 공백 제외 4~10자여야합니다.";
            res.send(result);
            return;
        }

        if (!name.trim() || name.length < 2 || name.length > 5) {
            result.message = "이름은 공백 제외 2~5자여야합니다.";
            res.send(result);
            return;
        }

        if (!birth.trim()) {
            result.message = "생년월일을 입력하세요.";
            res.send(result);
            return;
        }

        if (!tel.trim() || !(/^\d+$/.test(tel))) {
            result.message = "전화번호는 숫자만 입력해야합니다.";
            res.send(result);
            return;
        }

        // db 통신

        // Pw 찾기 결과가 true일시
        result.success = true;
        result.data = pw; // db에서 가져온 pw값
        result.message = `당신의 pw는 ${pw}입니다.`;
        res.send(result);
    }catch(Exception e){
        e.printStackTrace();
    }
})

// 5. 내 정보 보기 기능 - session (query?)
app.get("/myInform", (req, res) => {
    try{
        // 세션에서 내 정보 가져옴
        const { userIdx, userId, userName, userBirth, userTel } = req.session;

        // 프론트에 전달할 값 미리 만들기
        const result = {
            success : false,
            message : '',
            data : null
        };

        // session에 등록이 안됐다면
        if(!userIdx){
            result.message = "로그인 하십시오";
            res.send(result);
            return;
        }   
        else{
            result.success = true;
            result.message = "내 정보 보기 성공";
            result.data = {
                id : userId,
                name : userName,
                birth : userBirth,
                tel : userTel
            };
            res.send(result);
            return;
        }
    }catch(Exception e){
        e.printStackTrace();
    }
})

// 6. 내 정보 수정 기능 - path parameter ('나' 만 가져와야하니까)
app.put("/modifyMyInform/:id", (req, res) => {
    try{
        // modifyMyInform에서 수정할 정보 가져옴
        const id = req.params.id;
        const sessionId = req.session.userId;
        const sessionIdx = req.session.userIdx; // 세션 존재하는지 확인 해야함
        const { pw, name, birth, tel} = req.body;

        // 프론트에 전달할 값 미리 만들기
        const result = {
            success : false,
            message : '',
            data : null
        };

        // 예외처리 (본인이 아니거나 로그인 안했을 경우 ▽)
        if(!sessionIdx || sessionId != id){
            result.message = "로그인 후 본인의 정보만 수정할 수 있습니다."
            res.send(result);
            return;
        }

        if (!id.trim() || id.length < 4 || id.length > 10) {
            result.message = "ID는 공백 제외 4~10자여야합니다.";
            res.send(result);
            return;
        }
        if (!name.trim() || name.length < 2 || name.length > 5) {
            result.message = "이름은 공백 제외 2~5자여야합니다.";
            res.send(result);
            return;
        }

        if (!birth.trim()) {
            result.message = "생년월일을 입력하세요.";
            res.send(result);
            return;
        }

        if (!tel.trim() || !(/^\d+$/.test(tel))) {
            result.message = "전화번호는 숫자만 입력해야합니다.";
            res.send(result);
            return;
        }

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

        res.send(result);
    }catch(Exception e){
        e.printStackTrace();
    }
})

// 7. 회원 탈퇴 기능
app.delete("/quit", (req, res) =>{
    try{
        const sessionIdx = req.session.userIdx;
       
        // 프론트에 전달할 값 미리 만들기
        const result = {
            success : false,
            message : ''
        };

        if(!sessionIdx){
            result.message = "로그인 하십시오."
            res.send(result);
            return;
        }

        // DB에서 삭제
        //

        // session에서 삭제
        req.session.destroy(err => {
            if(err){ // 삭제 실패시
                result.message = "세션 오류 발생"
                res.send(result);
                return;
            }
            // 삭제 성공시
            result.success = "true";
            result.message = "회원 탈퇴 되었습니다.";
            res.send(result);
            return;
        })

    }catch(Exception e){
        e.printStackTrace();
    }
})  

// 8. 게시글 쓰기 기능
app.post("/write", (req, res) =>{
    try{
        // 세션값 받아오기
        const sessionIdx = req.session.userIdx;

        // 글 내용 받아오기
        const {title, contents} = req.body

          // 프론트에 전달할 값 미리 만들기
          const result = {
            success : false,
            message : '',
            data : null
        };

        // 예외처리
        if(!sessionIdx){
            result.message = "로그인 하십시오."
            res.send(result);
            return;
        }

        if (!title.trim()) { // 빈칸일경우
            result.message = "제목을 입력하세요.";
            res.send(result);
            return;
        }

        if (contents.trim()) {
            result.message = "내용을 입력하세요.";
            res.send(result);
            return;
        } 

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
        res.send(result);

    }catch(Exception e){
        e.printStackTrace();
    }
})

// 9. 게시글 읽기 기능 (전체 목록 보는 board, 개별 post 보는 showpost)

// 전체 목록 보는 board
app.get("/board", (req,res) => {
    try{
        // 세션값 받아오기
        const sessionIdx = req.session.userIdx;

        // 프론트에 전달할 값 미리 만들기
        const result = {
            success : false,
            message : '',
            data : null
        };

        // 예외처리
        if(!sessionIdx){
            result.message = "로그인 하십시오."
            res.send(result);
            return;
        }

        // db에서 전체 게시글 내용 가져옴

        // if(가져오기 성공시)
        result.success = true;
        result.data = {
            "boardnum_pk" : boardnum_pk,
            "title" : title,
            "accountid_fk" : accountid_fk,
            "contents" : contents,
            "createAt" : createAt
        };
        result.message = "게시글 목록 전체 가져오기 성공"
        res.send(result)

        // else(가져오기 실패시)
        result.message = "게시글 목록 전체 가져오기 실패"
        res.send(result)

    }catch(Exception e){
        e.printStackTrace();
    }
})

// 개별 post 보는 showPost - path parameter (어떤 자원을 특정해서 보여줄때)
app.get("/showPost/:boardnum_pk", (req, res) => {
    try{
        // 세션값 받아오기
        const sessionIdx = req.session.userIdx;
        // 클릭한 게시글의 boardnum 가져옴
        const boardnum_pk = req.params.boardnum_pk;
        
        // 프론트에 전달할 값 미리 만들기
        const result = {
            success : false,
            message : '',
            data : null
        };

        // 예외처리
        if(!sessionIdx){
            result.message = "로그인 하십시오.";
            res.send(result);
            return;
        }
        if(boardnum_pk == null){
            result.message = "해당 게시글을 확인할 수 없습니다.";
            res.send(result);
            return;
        }

        // db에서 boardnum_pk에 해당하는 것의
        // title, accountid_fk, contents, createAt 가져옴


        // if(성공시)
        result.success = true;
        result.message = "showPost 성공";
        result.data = { // board table의 값 
            "boardnum_pk" : boardnum_pk,
            "accountid_fk" : id, // 세션의 id
            "title" : title,
            "contents" : contents,
            "createAt" : createAt
        };
        res.send(result);

        //else(실패시)
        result.message = "showPost 실패";  
        res.send(result);

    }catch(Exception e){
        e.printStackTrace();
    }
})

// 10. 게시글 수정 기능 - path parameter (게시글 번호 받아와서 그거 수정)
app.put("/modifyPost/:boardnum_pk", (req,res) => {
    try{
        // 세션값 받아오기
        const sessionIdx = req.session.userIdx;

        // modifyPost에서 수정할 title, content 가져옴
        const boardnum_pk = req.params.boardnum_pk;
        const { title, contents } = req.body


        // 프론트에 전달할 값 미리 만들기
        const result = {
            success : false,
            message : '',
            data : null
        };

        // 예외처리
        if(!sessionIdx){
            result.message = "로그인 하십시오.";
            res.send(result);
            return;
        }
        if(boardnum_pk == null){
            result.message = "해당 게시글을 확인할 수 없습니다.";
            res.send(result);
            return;
        }
        if (!title.trim()) { // 빈칸일경우
            result.message = "제목을 입력하세요.";
            res.send(result);
            return;
        }
        if (!contents.trim()) { // 빈칸일경우
            result.message = "내용을 입력하세요.";
            res.send(result);
            return;
        }
        
        // DB 통신 -> table의 값 바꾸기

        // if(수정 성공시) -> accountid_fk = sessionIdx랑 같을 경우 (본인일 경우)
        result.success = true;
        result.message = "게시글 수정 성공"
        result.data = {
            "boardnum_pk" : boardnum_pk,
            "accountid_fk" : id, // 세션의 id
            "title" : title,
            "contents" : contents,
            "createAt" : createAt // 이건 안바뀌어야하는거아님?
        }
        res.send(result)
        
        // else(수정 실패시)
        result.message = "게시글 수정 실패 / 본인만 수정 가능합니다."
        res.send(result)

    }catch(Exception e){
        e.printStackTrace();
    }
})

// 11. 게시글 삭제 기능 - path parameter
app.delete("/delPost/:boardnum_pk", (req, res) =>{
    try{
         // 세션값 받아오기
         const sessionIdx = req.session.userIdx;

        // delete할 post 가져오기
        const boardnum_pk = req.params.boardnum_pk;

        // 프론트에 전달할 값 미리 만들기
        const result = {
            success : false,
            message : '',
        };

           // 예외처리
        if(!sessionIdx){
            result.message = "로그인 하십시오.";
            res.send(result);
            return;
        }
        if(boardnum_pk == null){
            result.message = "해당 게시글을 확인할 수 없습니다.";
            res.send(result);
            return;
        }


        // db 통신 -> id가 존재하고 id=accountid_fk이면  boardnum_pk 해당하는 게시글 삭제

        // if(삭제 성공시) -> accountid_fk = sessionIdx일 경우 (본인일 경우)
        result.success = true;
        result.message = "게시글 삭제 성공"
        res.send(result);

        // else(삭제 실패시)
        result.message = "게시글 삭제 실패 / 본인만 삭제 가능합니다."
        res.send(result);
    }catch(Exception e){
        e.printStackTrace();
    }
})

// 12. 댓글 쓰기 기능
app.post("/showPost", (req, res) =>{
    try{
        // 세션값 받아오기
        const sessionIdx = req.session.userIdx;
        // 글 내용 받아오기
        const {contents, boardnum} = req.body

        // 프론트에 전달할 값 미리 만들기
        const result = {
            success : false,
            message : '',
            data : null
        };

        // 예외처리
        if(!sessionIdx){
            result.message = "로그인 하십시오.";
            res.send(result);
            return;
        }
        if(boardnum == null){
            result.message = "해당 게시글을 확인할 수 없습니다.";
            res.send(result);
            return;
        }
        if(!contents.trim()){
            result.message = "내용을 입력하세요."
            res.send(result);
            return;
        }

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
        res.send(result);

        // else(글쓰기 실패시)
        result.message = "글쓰기 실패";
        res.send(result);

    }catch(Exception e){
        e.printStackTrace();
    }
})

// 13. 댓글 읽기 기능 - query string (필터링, 정렬)
app.get("/showPost", (req, res) => {
    try{
        // 세션값 받아오기
        const sessionIdx = req.session.userIdx;
        // 읽고자 하는 댓글이 있는 Post의 num 가져옴
        const boardnum = req.query.boardnum;

        const result = {
            success : false,
            message : '',
            data : null
        };

          // 예외처리
        if(!sessionIdx){
            result.message = "로그인 하십시오.";
            res.send(result);
            return;
        }
        if(boardnum == null){
            result.message = "해당 게시글을 확인할 수 없습니다.";
            res.send(result);
            return;
        }

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
        res.send(result);
        // else(댓글 가져오기 실패시)
        result.message = "댓글 읽기 실패"
        res.send(result);

    }catch(Exception e){
        e.printStackTrace();
    }   
})

// 14. 댓글 수정 기능 - path parameter (댓글 번호 가져와서 그거 수정)
app.put("/modifyComment/:commentnum_pk", (req, res) => {
    try{
        // 세션값 받아오기
        const sessionIdx = req.session.userIdx;
        // 수정하고자 하는 댓글의 commentnum_pk 가져옴
        const commentnum_pk = req.params.commentnum_pk;
        const contents  = req.body;

        // 프론트에 전달할 값 미리 만들기
        const result = {
            success : false,
            message : '',
            data : null
        };

        // 예외처리
        if(!sessionIdx){
            result.message = "로그인 하십시오.";
            res.send(result);
            return;
        }
        if(commentnum_pk == null){
            result.message = "해당 댓글을 확인할 수 없습니다.";
            res.send(result);
            return;
        }
        if(!contents.trim()){
            result.message = "내용을 입력하세요."
            res.send(seult);
            return;
        }

        // db 통신 -> commentnum_pk에 해당하는 댓글 가져와서 contents 수정

        // if(수정 성공시) accountid_fk = sessionIdx 본인일시
        result.success = true;
        result.message = "댓글 수정 성공";
        result.data = {
            contents : contents
        };
        res.send(result);

        // else(수정 실패시)
        result.message = "댓글 수정 실패 / 본인만 수정할 수 있습니다.";
        res.send(result);

    }catch(Exception e){
        e.printStackTrace();
    }
})

// 15. 댓글 삭제 기능 - path parameter
app.delete("/delComment/:commentnum_pk", (req, res) => {
    try{
        // 세션값 받아오기
        const sessionIdx = req.session.userIdx;
        const commentnum_pk = req.params.commentnum_pk;

        // 프론트에 전달할 값 미리 만들기
        const result = {
            success : false,
            message : '',
        };

        // 예외처리
        if(!sessionIdx){
            result.message = "로그인 하십시오.";
            res.send(result);
            return;
        }
        if(commentnum_pk == null){
            result.message = "해당 댓글을 확인할 수 없습니다.";
            res.send(result);
            return;
        }

        // db 통신 -> commentnum_pk에 해당하는 댓글 삭제

        // if(삭제 성공시) accountid_fk = sessionIdx 본인일 경우
        result.success = true;
        result.message = "댓글 삭제 성공";
        res.send(result);
        // else(삭제 실패시)
        result.message = "댓글 삭제 실패 / 본인만 삭제할 수 있습니다.";
        res.send(result);

    }catch(Exception e){
        e.printStackTrace();
    }
})

// 16. 로그아웃 기능
app.delete("/logOut", (req, res) =>{
    try{
        // 세션값 받아오기
        const sessionIdx = req.session.userIdx;
        // session값 가져오기 -> 필요없나?
        const { id, pw, name, birth, tel } = req.session; 

        // 프론트에 전달할 값 미리 만들기
        const result = {
            success : false,
            message : ''
        };

        // 예외처리
        if(!sessionIdx){
            result.message = "로그인 하십시오.";
            res.send(result);
            return;
        }

        // session에서 삭제
        req.session.destroy(err => {
            if(err){ // 삭제 실패시
                result.message = "세션 삭제 오류 발생"
                res.send(result);
                return;
            }
            // 삭제 성공시
            result.success = "true";
            result.message = "로그아웃 되었습니다.";
            res.send(result);
            return;
        })

    }catch(Exception e){
        e.printStackTrace();
    }
}) 

app.listen(port, () => {
    console.log(`assignMent 파일의 ${port}번에서 서버 실행`)
})