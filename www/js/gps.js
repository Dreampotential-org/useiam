function init_gps_stuff() {
    init_gps_event();
}


var CURRENT_POSITION = null;
var CURRENT_POSITION_LOW = null;

function init_gps_event() {
    $('.btnEvent').on('click', function(e){
        // before showing add event tab enable back btn
        // dashboard will be shown when the back btn is clicked
        showBackButton('dashboard');
        showATab('addEvent');
        //hide info button if visible
        $("#LocationModal").addClass("is-visible")
    });

    $("#allowGPS").on("click", function(e) {
        start_gps()
        found_gps_or_timeout();
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

    setTimeout(function() {
        var counter = 0;
        var i = setInterval(function() {
            if (CURRENT_POSITION == null && CURRENT_POSITION_LOW == null) {
                console.log("No GPS Signal. Try again");
            } else {

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


function start_gps() {
    // log_error_to_slack("GSP INIT")
    // Start gps prob with low accuracy
    var geo_options_low = {
        enableHighAccuracy: false,
        maximumAge        : 30000,
        timeout           : 27000
    };

    navigator.geolocation.watchPosition(
        geo_success_low, geo_error, geo_options_low
    );

   function geo_error(err) {
        if (err.code  == 1) {
            swal({
              title: "GPS Disabled.",
              text: "Please enable this for Safari to Allow GPS checkin.",
              icon: "error",
            });
        }
       console.log("errror no gps")
       console.warn('ERROR(' + err.code + '): ' + err.message);
       alert('ERROR(' + err.code + '): ' + err.message);
       //log_error_to_slack(
       //     'ERROR(' + err.code + '): ' + err.message);
       // init_gps()
    }

    geo_options = {
      enableHighAccuracy: true,
      maximumAge        : 30000,
      timeout           : 27000
    };

    // Start gps prob with high accuracy
    navigator.geolocation.watchPosition(
        geo_success, geo_error, geo_options
    );

    function geo_success_low(position) {
        CURRENT_POSITION_LOW = position
        console.log(position.coords.latitude +
                    " " +  position.coords.longitude);
    }

    function geo_success(position) {
        CURRENT_POSITION = position
        console.log(position.coords.latitude +
                    " " +  position.coords.longitude);
    }
}
