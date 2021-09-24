function init_gps_stuff() {
    init_gps_event();
}

var CURRENT_POSITION = null;
var CURRENT_POSITION_LOW = null;

function init_gps_event() {
    $('.btnEvent').on('click', function (e) {
        // before showing add event tab enable back btn
        // dashboard will be shown when the back btn is clicked
        showBackButton('dashboard');
        showATab('addEvent');
        // hide info button if visible
        $("#LocationModal").addClass("is-visible");
        // clear text area content
        $("#addEvent textarea").val("")
    });

    $("#allowGPS").on("click", function (e) {
        start_gps()
        found_gps_or_timeout();
    });


    $("#locationAuth").on('click', function (e) {
        swal({
            title: "Uploading",
            text: "Please wait.",
            icon: "info",
            buttons: false,
            closeOnEsc: false,
            closeOnClickOutside: false,
        });

        api_gps_checkin();
    });
}

function api_gps_checkin() {
    var form = new FormData();
    if (!($("#addEvent textarea").val().length)) {
        swal({
            'title': 'Missing Description',
            'text': 'You must provide a description of the event.',
            'icon': 'error',
        });
        return
    }


    form.append("msg", $("#addEvent textarea").val());

    if (CURRENT_POSITION != null) {
        form.append("lat", CURRENT_POSITION.coords.latitude);
        form.append("lng", CURRENT_POSITION.coords.longitude);
    } else {
        form.append("lat", CURRENT_POSITION_LOW.coords.latitude);
        form.append("lng", CURRENT_POSITION_LOW.coords.longitude);
    }

    var settings = {
        "async": true,
        "crossDomain": true,
        "headers": {
            "Authorization": "Token " + localStorage.getItem("session_id"),
        },
        "url": SERVER + "/api/gps-checkin/",
        "method": "POST",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
        "data": form
    }
    $.ajax(settings).done(function (response) {
        swal({
            title: "Good job!",
            text: "Gps and Note submitted successfully!",
            showCancelButton: false,
            confirmButtonText: "ok",
            icon: "success",
        })
        showATab('dashboard');
        //close modals
        closeAllModals();
        showMenuBar();
    }).fail(function (err) {
        // Good on error we post
            'title': 'Error',
            'text': 'Try again',
            'icon': 'error',
             buttons: [true, "Retry"],
        }).then((retry) => {
            if(retry) {
            api_gps_checkin();
        }
    });
}


function found_gps_or_timeout() {
    $('#LocationModal').removeClass('is-visible');
    swal({
        title: "Checking for GPS Signal",
        text: "Please wait while we find GSP location",
        icon: "info",
        buttons: false,
        closeOnEsc: false,
        closeOnClickOutside: false,
    });

    setTimeout(function () {
        var counter = 0;
        var i = setInterval(function () {
            if (CURRENT_POSITION == null && CURRENT_POSITION_LOW == null) {
                console.log("No GPS Signal. Try again");
            } else {
                // XXX These values are not getting correctly set on android.
                swal({
                    title: "GPS Location Found",
                    text: "Now, enter event and submit",
                    icon: "success",
                });

                clearInterval(i);
            }
            counter++;
        }, 200);
    }, 20);
}

function isApp() {
    return (typeof(cordova) !== 'undefined' ||
            typeof(phonegap) !== 'undefined');
}

function start_gps() {
    // log_error_to_slack("GSP INIT")
    // Start gps prob with low accuracy
    var geo_options_low = {
        enableHighAccuracy: false,
        maximumAge: 30000,
        timeout: 27000
    };

    if (isApp()) {
    //if (window.cordova.platformId == 'ios' || window.cordova.platformId == 'android') {
        document.addEventListener('deviceready', function () {
            navigator.geolocation.watchPosition(
                geo_success_low, geo_error, geo_options_low
            );
        }, false);
    } else {
        navigator.geolocation.watchPosition(
            geo_success_low, geo_error, geo_options_low
        );
    }

    function geo_error(err) {

        if (err.code == 1 || err.code == err.PERMISSION_DENIED ||
            err.code == err.UNKNOWN_ERROR) {
            swal({
                title: "GPS Issue.",
                text: "Please allow gps permission",
                icon: "error",
            });
        }
        console.log("errror no gps")
        console.warn('ERROR(' + err.code + '): ' + err.message);
        //alert('ERROR(' + err.code + '): ' + err.message);
        //log_error_to_slack(
        //     'ERROR(' + err.code + '): ' + err.message);
        start_gps()
    }

    geo_options = {
        enableHighAccuracy: true,
        maximumAge: 30000,
        timeout: 27000
    };

    // Start gps prob with high accuracy
    //if (window.cordova.platformId == 'ios' || window.cordova.platformId == 'android') {
    if (isApp()) {
        document.addEventListener('deviceready', function () {
            navigator.geolocation.watchPosition(
                geo_success, geo_error, geo_options
            );
        }, false);
    }else{
        navigator.geolocation.watchPosition(
            geo_success, geo_error, geo_options
        );
    }

    function geo_success_low(position) {
        CURRENT_POSITION_LOW = position
        console.log(position.coords.latitude +
            " " + position.coords.longitude);
    }

    function geo_success(position) {
        CURRENT_POSITION = position
        console.log(position.coords.latitude +
            " " + position.coords.longitude);
    }
}
