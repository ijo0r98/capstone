// 회원탈퇴
// Author : Sumin, Created : 2021.10.09

var express = require('express');
var router = express.Router();
var config = require('../../config/db_config');
var connection = config.init();
connection.connect();

router.post('/deleteUser', function (req, res) {
    //비밀번호 확인 필요
    //var storePw = req.session.user.storePw; // 비밀번호
    var query = `DELETE FROM store WHERE storeId = ${req.session.user.storeId}` // 회원탈퇴 쿼리문

    // DB 에서 사용자 정보 삭제
    connection.query(query, storeId, function (err, result) {
        if(err) { // 에러 발생시
            console.log("error ocurred: ", err);
            res.json({ "code": 400, "result": "error ocurred" })
        } else {
            console.log("delete user success");
            res.json({"code": 200, "result": "delete user success"})
        }
    })

});

module.exports = router;