const router = require("express").Router()
const { checkSession, checkId, checkPw, checkName, checkBirth, checkTel, checkBlank, checkIdx } = require('../modules/check');

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
        

        // db 통신
        // board table에 등록

        // 글쓰기 성공시
        result.success = true;
        result.message = "글쓰기 성공";
        result.data = { // board table의 값 저장 --> db에서 가져와야함
            "boardnum_pk" : boardnum_pk,
            "accountid_fk" : id, // 세션의 id
            "title" : title,
            "contents" : contents,
            "createAt" : createAt
        };

    }catch(e){
        result.message = e.message
    }finally{
        res.send(result)
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

        //if(가져오기 실패시) throw new Error("게시글 목록 가져오기 실패") 

    }catch(e){
        result.message = e.message
    }finally{
        res.send(result)
    }
})

// 개별 post 보는 showPost - path parameter (어떤 자원을 특정해서 보여줄때)
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
        checkBlank(contents)


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

        // if(DB통신 실패시) throw new Error("db통신 실패")

    }catch(e){
        result.message = e.message
    }finally{
        res.send(result)
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
        
        // else(수정 실패시)
        // if(db통신 실패시) throw new Error("db 통신 실패")

    }catch(e){
        result.message = e.message
    }finally{
        res.send(result)
    }
})

// 게시글 삭제 기능 - path parameter
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


        // db 통신 -> id가 존재하고 id=accountid_fk이면  boardnum_pk 해당하는 게시글 삭제

        // if(삭제 성공시) -> accountid_fk = sessionIdx일 경우 (본인일 경우)
        result.success = true;
        result.message = "게시글 삭제 성공"

        //if(db통신 실패시) throw new Error("db통신 실패")
    }catch(e){
        result.message = e.message
    }finally{
        // 최종적으로 실행되는거 (try, catch 둘중 뭐든 실행하고 나면)
        res.send(result)
    }
})

module.exports = router