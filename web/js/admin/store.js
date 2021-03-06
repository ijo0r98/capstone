// 매장 관리
// Author : Sumin, Created : 2021.10.31
$(document).ready(function () {
    getUserInfo();
})

function getUserInfo() {
    $.ajax({
        type: 'GET',
        url: '/admin/getUserInfo',
        success: function (result) {
            if (result.code == 200) {
                $('#storeName').val(result.userInfo[0].storeName);
                $('#storeTel').val(result.userInfo[0].storeTel);
                $('#storeLoc').val(result.userInfo[0].storeLoc);
                $('#crn').val(result.userInfo[0].crn);
                $('#managerName').val(result.userInfo[0].managerName);
                $('#managerTel').val(result.userInfo[0].managerTel);
            }
        }
    })
}

function updateUserInfo() {
    let storePw = $('#storePw').val();
    let storePwValid = $('#storePwValid').val();
    let storeName = $('#storeName').val();
    let storeTel = $('#storeTel').val();
    let storeLoc = $('#storeLoc').val();
    let crn = $('#crn').val();
    let managerName = $('#managerName').val();
    let managerTel = $('#managerTel').val();

    if (!storePw || !storePwValid || !storeName || !storeTel || !storeLoc || !crn || !managerName || !managerTel) { // 입력 확인
        alert('미입력');
        location.href="/manage_store";
        return;
    }

    if (storePw != storePwValid) {
        alert('비밀번호, 비밀번호 확인 불일치');
        location.href="/manage_store";
        return;
    }

    // 회원정보수정
    $.ajax({
        type: 'POST',
        url: '/admin/updateUserInfo',
        contentType: 'application/json',
        data: JSON.stringify({'storePw': storePw, 'storeName': storeName, 'storeTel': storeTel, 'storeLoc': storeLoc, 'crn': crn, 'managerName': managerName, 'managerTel': managerTel}),
        success: function (result) {
            if (result.code == 200) {
                alert('수정되었습니다.');
            }
            else {
                alert('수정 실패');
            }
            location.href="/manage_store";
        }
    })
}

function deleteUser() {
    let storePw = $('#store_pw').val();
    // 회원탈퇴
    $.ajax({
        type: 'POST',
        url: '/admin/deleteUser',
        contentType: 'application/json',
        data: JSON.stringify({'storePw': storePw}),
        success: function (result) {
            if (result.code == 208) {
                alert('비밀번호가 맞지 않습니다.');
            }
            else if (result.code == 400) {
                alert('회원탈퇴 실패');
            }
            else if (result.code == 200) {
                alert('회원탈퇴 성공');
                location.href="/login";
            }
        }
    })
}