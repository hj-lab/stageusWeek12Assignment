const maria = require("mysql")

const conn = maria.createConnection({
    host : "localhost",
    port : "3306", // mariadb 기본 port 번호
    user : "heeju",
    password : "1234",
    database : "page"
})

module.exports = conn
// 다른 파일에서도 쓰겠다