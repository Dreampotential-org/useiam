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
    /* $("#viewActivity").click()
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

function display_activities(activities) {
    for (var activity of activities) {
        if (activity.type == 'gps') {
            $(".activity-log").append(
                "<div><span>" + activity.type + "</span> - " +
                    "<span>" + activity.msg + "</span> - " +
                    "<span>" + new Date(activity.created_at*1000) + "</span></div>"
            )
        }
        if (activity.type == 'video') {
            $(".activity-log").append(
                "<div><span>" + activity.type + "</span> - " +
                    "<span><a url=" +
                            activity.url +
                        " href='#'>Play</a></span> - " +
                    "<span>" +
                        new Date(activity.created_at * 1000) +
                    "</span></div>"
            )
        }
    }
}
