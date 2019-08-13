function init_activity() {
    $("#viewActivity").on('click', function(e) {
        $(".toggleBar").click()
        closeAllModals();
        showBackButton('dashboard');
        showATab('activity');
        get_activity(function(resp) {
            display_activities(resp.events)
        });
    })
    /*
    $("#viewActivity").click()
    $(".toggleBar").click()
    get_activity(function(resp) {  display_activities(resp.events) });
    */
}

function get_activity(callback) {
    var settings = {
      "async": true,
      "crossDomain": true,
       "headers": {
       "Authorization": "Token " + localStorage.getItem("session_id"),
      },
      "url": SERVER + "/api/get-activity/",
      "method": "GET",
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
    }

    $.ajax(settings).done(function (response) {
        var msg = JSON.parse(response)
        callback(msg)
    }).fail(function(err) {
        alert("Got err")
        console.log(err)
    });
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


function display_activities(activities) {
    for (var activity of activities) {
        if (activity.type == 'gps') {
            $(".activity-log").append(
                "<div><span>" + activity.type + "</span> - " +
                    "<span>" + activity.msg + "</span> - " +
                    "<span>" + formatDate(new Date(activity.created_at*1000)) + "</span></div>"
            )
        }
        if (activity.type == 'video') {
            $(".activity-log").append(
                "<div><span>" + activity.type + "</span> - " +
                    "<span><a href=" +
                            activity.url +
                        ">Play</a></span> - " +
                    "<span>" +
                        formatDate(new Date(activity.created_at * 1000)) +
                    "</span></div>"
            )
        }
    }
}
