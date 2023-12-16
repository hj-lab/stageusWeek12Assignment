const alphabet = /[a-zA-Z]/; //영문자
const number = /\d/; // 숫자
const whiteSpace = /\s/; //공백

function checkSession(req){
    const userIdx = req.session.userIdx
    if(!userIdx || userIdx == "" || userIdx == undefined){
        throw new Error("로그인 하십시오.")
    }
    
}

function checkId(id) {
    const idLength = id.length;

    if(!id || id == "" || id == undefined){
        throw new Error('아이디를 입력하세요.');
    } 
    if(idLength == 0 || idLength < 4 || idLength > 10) {
        throw new Error('아이디는 4에서 10자 사이여야 합니다.');
    }

}

function checkPw(pw) {
    const pwLengh = pw.length

    if (!pw || pw == "" || pw == undefined){
        throw new Error("비밀번호를 입력하세요.")
    }
    
    if( pwLengh < 8 || pwLengh > 15 || !alphabet.test(pw) || !number.test(pw)) {
        throw new Error('PW는 공백을 제외한 문자 및 숫자를 포함하여 8~15자여야 합니다.');
    }
}

function checkName(name){
    const nameLength = name.length;

    if(!name || name == "" || name == undefined){
        throw new Error('이름을 입력하세요.');
    } 
    if(nameLength == 0 || nameLength < 2 || nameLength > 5) {
        throw new Error('아이디는 4에서 10자 사이여야 합니다.');
    }
}

function checkBirth(birth){
    if(!birth || birth == "" || birth == undefined){
        throw new Error("생년월일을 입력하세요.")
    }

}

function checkTel(tel){
    if(!tel || tel == "" || tel == undefined){
        throw new Error("생년월일을 입력하세요.")
    }
    if(!number.test(tel)){
        throw new Error("전화번호에 숫자만 입력하십시오.")
    }
}

// error message custom
function checkBlank(content){
    if(!content || content == "" || content == undefined){
        throw new Error("내용을 입력하세요.")
    }
    
}

function checkIdx(idx){
    if(!idx || idx == "" || idx == undefined){
        throw new Error(`${idx} 번째 idx 값을 확인할 수 없습니다.`)
    }
}

module.exports = { checkSession, checkId, checkPw, checkName, checkBirth, checkTel, checkBlank, checkIdx }