function init() {
    if (!(localStorage.getItem("session_id"))) {
        localStorage.setItem("redirect_url", window.location.href)
        window.location = 'login.html'
    }
    $("#signup_email").val(getUrlVars()['email'])

    get_video_info()
    init_feedback();
    load_video()
    get_activity(function(results) {
        /// XXX Santosh display users videos on screen
        console.log(results)

    });
}

function init_feedback() {
    console.log("INIT")
    $("#send_feedback").on('click', function(e) {
        var id = getUrlVars()['id'];
        var user = getUrlVars()['user'];
        $.ajax({
            'type': "POST",
            'url': SERVER + "/api/send-feedback/?token=" +
                localStorage.getItem("session_id") + "&user=" + user +
                "&id=" + id,
            'data': {'message': $("#message").val()}}).done(function(resp) {

                console.log(resp)

                alert("DONE")
            })

    })
    $("body").delegate(".logout", "click", function(e) {
        localStorage.clear()
        window.location = 'login.html'
    });
}


function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(
        /[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
        vars[key] = value;
    });
    return vars;
}

function formatDate(date) {
    var hours = date.getHours();
    var minutes = date.getMinutes();
    var ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12; // the hour '0' should be '12'
    minutes = minutes < 10 ? '0'+minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return date.toLocaleDateString("en-US") + " " + strTime;
}

function get_video_info() {
    var id = getUrlVars()['id'];
    var user = getUrlVars()['user'];
    $.get(SERVER + "/api/get-video-info/?token=" +
        localStorage.getItem("session_id") + "&user=" + user +
        "&id=" + id, function(res) {

        if('status' in res && res.status == 'error') {
            swal({
                'title': 'Access Denied',
                'text': 'The video was not sent to the email address ' +
                        'you are logged in with.',
                'icon': 'error',
            });
            return
        }

        $("#patient_name").text(res.owner_name)
        $("#created_at").text(formatDate(new Date(res.created_at*1000)))

        for(var message of res.feedback) {
            $(".feedback_received").append(
                "<div><b>" + message.user + "</b> - " + message.message + "</div>"
            )
        }
    })
}

function get_activity(callback) {
  var settings = {
    async: true,
    crossDomain: true,
    headers: {
      Authorization: "Token " + localStorage.getItem("session_id")
    },
    url: SERVER + "/api/get-activity/",
    method: "GET",
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data"
  };

  $.ajax(settings).done(function(response) {
      var msg= JSON.parse(response);
      videoData =JSON.parse(response);
      var allData = JSON.parse(response);
      console.log(allData)
      alert(allData)
      callback(msg);
    }).fail(function(err) {
      alert("Got err");
      console.log(err);
    });
}


function load_video() {
    debugger;
    var id = getUrlVars()['id'];
    var user = getUrlVars()['user'];
    $("#video").html(
        '<source src=' + SERVER + '/api/review-video/?id=' + id +
            '&user=' + user + '&token=' +
            localStorage.getItem("session_id") + ' type="video/mp4">')

}
window.addEventListener("DOMContentLoaded", init, false);
