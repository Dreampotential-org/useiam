function init() {
    if (!(localStorage.getItem("session_id"))) {
        localStorage.setItem("redirect_url", window.location.href)
        window.location = 'login.html'
    }
    $("#signup_email").val(getUrlVars()['email'])

    init_feedback();

    var id = getUrlVars()['id'];
    var user = getUrlVars()['user'];

    get_video_info(id, user, function(video_info) {
        if (video_info.type == 'video') {
            load_video()
        } else if (video_info.type == 'gps') {
            load_gps(video_info)
        }
        get_activity(video_info, function(results) {

            console.log(results)
            display_side_activity_log(results)
        });
    })
}

function getUrl(videoUrl) {
    var vars = {};
    var parts = videoUrl.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
        vars[key] = value;
    });
    var id = vars["id"];
    var user = vars["user"];
    console.log("id",id);
    console.log("user",user);
    var vidSrc = SERVER +"/api/review-video/?id=" +id +"&user=" +user +"&token=" +localStorage.getItem("session_id");
    console.log(vidSrc);
   return vidSrc;
}


function display_side_activity_log(resp) {
    var c = 0;
    for (var activity of resp.events) {
        // XXX add gps event
        if (activity.type == "video") {
        $("#video-list").append(
        '<div class="panel panel-default panelCls" id="' +
            activity.id + '"> '+
        '<div class="panel-heading"><b>Created at :</b><span> ' +
            formatDate(new Date(activity.created_at * 1000))+'</span></div> '+
                '<div class="panel-body panelVid"> ' +
                    '<video  preload="metadata" width="300" class="panel_video" id="videoPanel'+(c++)+'"> '+
                            '<source class="list-video" src=' + getUrl(activity.url) +' type="video/mp4"> '+
                        '</video> '+
                        // '<input class="playBtn" type="button" value="Play" />'+
                        '<i class="fa fa-play playBtn" aria-hidden="true"></i>'+
                '</div></div>');
        }
    else {
        $("#video-list").append(
        '<div  class="panel panel-default panelCls" id="' + activity.id + '"> '+
        '<div class="panel-heading"><b>Created at :</b><span> ' +
            formatDate(new Date(activity.created_at * 1000))+'</span></div> '+
                '<div class="panel-body panelVid"> ' +
                    " GPS - Checkin<br>" + activity.msg +
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
            'data': {'message': $("#comment").val()}}).done(function(resp) {

                console.log(resp)
                swal({
                    'title': 'Comment',
                    'text': 'Success',
                    'icon': 'success',
                }).then(function() {
                    window.location.reload()
                })
            })

    })
    $("body").delegate(".logout", "click", function(e) {
        localStorage.clear()
        window.location = 'login.html'
    });

    $("body").delegate(".panelCls", "click", function(e) {
        setGetParam('id', $(this).attr('id'))
        window.location.reload()
    });

}
function setGetParam(key,value) {
  if (history.pushState) {
    var params = new URLSearchParams(window.location.search);
    params.set(key, value);
    var newUrl = window.location.protocol + "//" +
        window.location.host + window.location.pathname + '?'
        + params.toString();
    window.history.pushState({path:newUrl},'',newUrl);
  }
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

function get_video_info(id, user, callback) {

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
        if(res.feedback.length==0){
            $(".feedback_received").append(
                "<div>No comments found!</div>"
            )
        }
        else {
            for(var message of res.feedback) {
                $(".feedback_received").append(
                    "<div><b>" + message.user + "</b> - " + message.message + "</div>"
                )
            }
        }
        callback(res);
    })
}

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

function load_gps(gps_info) {
    console.log(gps_info)
    $("#mainVideoDiv").html(
      "<div id='gps-view' style='width:100%;height:400px;'></div>"
    );
    var spot = {
      lat: parseFloat(gps_info.lat),
      lng: parseFloat(gps_info.lng),
    };
    var panorama = new google.maps.StreetViewPanorama(
      document.getElementById("gps-view"),
      {
        position: spot,
        pov: { heading: 165, pitch: 0 },
        zoom: 1
      }
    );
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
