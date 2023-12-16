const express = require("express");
const session = require("express-session"); // 세션
const app = express();
const port = 8001;

app.use(express.json());

// 세션 미들웨어 추가
app.use(session({
    secret : "hj", // 필수, SID 생성시 사용되는 비밀키
    resave : false, // session에 변경사항이 없으면 다시 저장할것인지? -> no 
    saveUninitialized : false // request에서 session에 아무런 작업이 없으면 강제로 저장할것인지? -> no (내용없는 session 저장 방지)
}))

const accountApi = require("./src/routers/account")
app.use("/account", accountApi)

const boardApi = require("./src/routers/board")
app.use("/board", boardApi)

const commentApi = require("./src/routers/comment")
app.use("/comment", commentApi)



// 웹서버
app.listen(port, () => {
    console.log(`assignMent 파일의 ${port}번에서 서버 실행`)
})
  





