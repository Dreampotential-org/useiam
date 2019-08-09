var SERVER = 'http://127.0.0.1:8844'

function init() {
    $("#signup_email").val(getUrlVars()['email'])
    load_video()
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
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
