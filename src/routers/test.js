const router = require("express").Router()
const { isIdValid } = require('../modules/check');

router.get("/", (req, res) => {

    const { id, pw, name } = req.body

    const result = {
        success : false,
        message : '',
        data : null
    };

    try{
        checkId(id)
        checkPw(pw)
        checkName(name)
        checkBirth(birth)
        checkTel(tel)

        

        result.success = true
        result.message = "성공"
    }catch(e){
        result.message = e.message
    }finally{
        res.send(result)
    }

    
})


module.exports = router