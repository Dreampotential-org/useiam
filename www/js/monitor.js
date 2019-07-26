function init_monitor() {
    $("#setMonitor").on('click', function(e) {
        get_profile_info(function(msg) {
            show_set_monitor()

            // closes side menu
            $('.toggleBar').click()
            if (msg.notify_email) {
                $("#monitor_email").val(msg.notify_email)
            }
        })
    });

    $("#setmonitorModal #nextBtn").on('click', function(e) {
        do_set_monitor();
    });
}


function show_set_monitor() {
    closeAllModals();
    $('#setmonitorModal').addClass('is-visible');
}


function do_set_monitor() {
    if($("#monitor_email").val().trim().length != 0) {
        if (!(validateEmail($("#monitor_email").val().trim()))) {
            $("#monitor_email").addClass("invalid")
            return
        }
    }

    var form = new FormData();
    form.append("notify_email", $("#monitor_email").val().trim());
    var settings = {
      "async": true,
      "crossDomain": true,
       "headers": {
       "Authorization": "Token " + localStorage.getItem("session_id"),
      },
      "url": SERVER + "/api/profile/",
      "method": "PUT",
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form
    }

    $.ajax(settings).done(function (response) {
        var msg = JSON.parse(response).message
        //after successful login or signup show dashboard contents
        showATab('dashboard');
        //close modals
        closeAllModals();
    }).fail(function(err) {
        $("#setmonitorModal #nextBtn").removeClass("running")
        console.log(err);
        swal({
            'title': 'Error',
            'text': '',
            'icon': 'error',
        });

    });
}
function get_profile_info(callback) {
    var settings = {
      "async": true,
      "crossDomain": true,
       "headers": {
       "Authorization": "Token " + localStorage.getItem("session_id"),
      },
      "url": SERVER + "/api/profile/",
      "method": "GET",
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
    }

    $.ajax(settings).done(function (response) {
        var msg = JSON.parse(response)
        callback(msg)
    }).fail(function(err) {
    });
}
