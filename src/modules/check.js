const alphabet = /[a-zA-Z]/; //영문자
const number = /\d/; // 숫자
const allNumber = /^\d+$/; // 모든 부분이 숫자로만 이루어져있는지
const whiteSpace = /\s/; //공백

const conn = require("../../config/database")

// 세션 존재 체크
function checkSession(req){
    const userIdx = req.session.userIdx
    if(!userIdx || userIdx == "" || userIdx == undefined){
        throw new Error("로그인 하십시오.")
    }
    
}

// ID 존재 여부 체크
function checkId(id) {
    const idLength = id.length;

    if(!id || id == "" || id == undefined){
        throw new Error('아이디를 입력하세요.');
    } 
    if(idLength == 0 || idLength < 4 || idLength > 10) {
        throw new Error('아이디는 4에서 10자 사이여야 합니다.');
    }

}


// ID 중복 체크 (앞에 async 써야하나?)
// function checkDuplicateId(id) {
//     const sql = 'SELECT id FROM account WHERE id = ?';

//     conn.query(sql, [id], (err, rows) => {
//         if (err) {
//             throw new Error("Id 중복 체크 조회 중 오류 발생");
//         }
//         if (rows) {
//             throw new Error("중복된 ID입니다.");
//         }
//     });
// }


// ID 중복 체크 함수 (Promise 기반)
async function checkDuplicateId(id) {
    return new Promise((resolve, reject) => {
        const sql = 'SELECT id FROM account WHERE id = ?';
        conn.query(sql, [id], (err, rows) => {
            if (err) {
                reject(new Error("DB communication error"));
            } else {
                if (rows && rows.length > 0) {
                    reject(new Error("중복된 ID입니다."));
                } else {
                    resolve(false); // 중복되지 않은 경우에는 false를 반환
                }
            }
        });
    });
}

// PW 체크
function checkPw(pw) {
    const pwLengh = pw.length

    if (!pw || pw == "" || pw == undefined){
        throw new Error("비밀번호를 입력하세요.")
    }
    
    if( pwLengh < 8 || pwLengh > 15 || !alphabet.test(pw) || !number.test(pw)) {
        throw new Error('PW는 공백을 제외한 문자 및 숫자를 포함하여 8~15자여야 합니다.');
    }
}

// PW, PWcheck 같은지 체크

// 이름 체크
function checkName(name){
    const nameLength = name.length;

    if(!name || name == "" || name == undefined){
        throw new Error('이름을 입력하세요.');
    } 
    if(nameLength == 0 || nameLength < 2 || nameLength > 5) {
        throw new Error('아이디는 4에서 10자 사이여야 합니다.');
    }
}

// 생일 체크
function checkBirth(birth){
    if(!birth || birth == "" || birth == undefined){
        throw new Error("생년월일을 입력하세요. !!!!!")
    }

}

// 전화번호 체크
function checkTel(tel){
    if(!tel || tel == "" || tel == undefined){
        throw new Error("전화번호를 입력하세요.")
    }
    if(!allNumber.test(tel)){
        throw new Error("전화번호에 숫자만 입력하십시오.")
    }
}

// 내용(제목) 체크
function checkBlank(content){
    if(!content || content == "" || content == undefined){
        throw new Error("내용을 입력하세요.")
    }
    
}

// idx 체크
function checkIdx(idx){
    if(!idx || idx == "" || idx == undefined){
        throw new Error(`${idx} 번째 idx 값을 확인할 수 없습니다.`)
    }
}


module.exports = { checkSession, checkId, checkDuplicateId, checkPw, checkName, checkBirth, checkTel, checkBlank, checkIdx }