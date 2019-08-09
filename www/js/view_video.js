function init() {
    if (!(localStorage.getItem("session_id"))) {
        window.location = 'login.html'
    }
    $("#signup_email").val(getUrlVars()['email'])
    //validate_video_and_token()
    load_video()
}


function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(
        /[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}


function validate_video_and_token() {
    var id = getUrlVars()['id'];
    var user = getUrlVars()['user'];
    $.get(SERVER + "/api/validate-token-and-video?token=" +
        localStorage.getItem("session_id") + "&user=" + user +
        "&id=" + id, function(res) {
        alert(res)
    })
}

function load_video() {
    var id = getUrlVars()['id'];
    var user = getUrlVars()['user'];
    $("#video").html(
        '<source src=' + SERVER + '/api/review-video/?id=' + id +
            '&user=' + user + '&token=' +
            localStorage.getItem("session_id") + ' type="video/mp4">')

}
window.addEventListener("DOMContentLoaded", init, false);
