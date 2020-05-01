function init() {
    if (!(localStorage.getItem("session_id"))) {
        localStorage.setItem("redirect_url", window.location.href)
        window.location = 'login.html'
    }
    $("#signup_email").val(getUrlVars()['email'])

    init_feedback();
    load_video()
    get_video_info(function(video_info) {
        get_activity(function(results) {
            console.log(results)
            display_side_activity_log(results)
        });
    })
}

function display_side_activity_log(resp) {
    var c = 0;
    for (var activity of resp.events) {
        // XXX add gps event
        if (activity.type == "video") {
        $("#activity-log").append(
            '<li class="other dark"><div class="msg"> <p class="dateClass">' +
            formatDate(new Date(activity.created_at * 1000)) +
            "</p>" +
            "<div style='width:80%'><i class='fa fa-star iconStar'></i><span class='alignTag'><a url=" +
            activity.url +
            " href='#' class='view-video customLinkBtn'>" +
            activity.type +'<span><i class="fa fa-angle-double-right"></i></span>'+
            "</a></span></div>" +
            '<div class="icon"><div class="borderDiv"><img src="img/play-button_black.svg" alt=""/></div></div>' +
            "</div> </li>"
            //   <img src="images/play_icon.png" alt=""/>
        );

        $("#video-list").append(
        '<div  class="panel panel-default panelCls"> '+
        '<div class="panel-heading"><b>Created at :</b> ' +
            formatDate(new Date(activity.created_at * 1000))+'</div> '+
                '<div class="panel-body panelVid"> ' +
                    '<video  preload="metadata" width="300" class="panel_video" id="videoPanel'+(c++)+'"> '+
                            '<source class="list-video" src=' + getUrl(activity.url) +' type="video/mp4"> '+
                        '</video> '+
                        // '<input class="playBtn" type="button" value="Play" />'+
                        '<i class="fa fa-play playBtn" aria-hidden="true"></i>'+
                '</div></div>');
        }
    }
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

        console.log(res)

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

// XXX @Santosh
function get_activity(video_info, callback) {
  var settings = {
    async: true,
    crossDomain: true,
    headers: {
      Authorization: "Token " + localStorage.getItem("session_id")
    },
    url: SERVER + "/api/list-patient-events-v2/?email=" + video_info.owner_email,
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
