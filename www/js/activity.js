function init_activity() {
    $("#viewActivity").on('click', function(e) {
        $(".toggleBar").click()
        closeAllModals();
        showBackButton('dashboard');
        showATab('activity');
    })
}

function get_activity(callback) {
    var settings = {
      "async": true,
      "crossDomain": true,
       "headers": {
       "Authorization": "Token " + localStorage.getItem("session_id"),
      },
      "url": SERVER + "/api/activity/",
      "method": "GET",
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
    }

    $.ajax(settings).done(function (response) {
        var msg = JSON.parse(response)
        callback(msg)
    }).fail(function(err) {
        console.log(err)
    });
}
