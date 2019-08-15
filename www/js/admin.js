function init() {
    if (!(localStorage.getItem("session_id"))) {
        window.location = 'login.html'
    }
    list_patients(function(response) {display_patients(response.patients); })
    list_patient_events(
        "aaron.orosen@gmail.com", "", function(response) {
            display_events(response.events)})
}

function init_street_view(e) {
    var spot = {lat: parseFloat(e.lat), lng: parseFloat(e.lng)}

    panorama = new google.maps.StreetViewPanorama(
            document.getElementById('gps-' + e.id),
            {
              position: spot,
              pov: {heading: 165, pitch: 0},
              zoom: 1
            });

    // Set up the map.
    //map = new google.maps.Map(document.getElementById('map'), {
    //  center: spot,
    //  zoom: 16,
    //  streetViewControl: false
    //});
    // Set the initial Street View camera to the center of the map

}

function display_events(events) {

    for(var e of events) {

        if (e.type == 'gps') {
            console.log(e)
            $(".events").append(
                formatDate((new Date(e.created_at * 1000))) +
                "<div style='height:240px;width:320px;' id='gps-" + e.id + "'><div>"
            )
            init_street_view(e)
        }

        if (e.type == 'video') {
            $(".events").append("<div>" +
                formatDate((new Date(e.created_at * 1000))) +
                '<video controls="" name="media" width="320" height="240">' +
                    '<source src=' + SERVER + "" + e.url + "&token=" +
                        localStorage.getItem("session_id") + ' type="video/mp4">' +
                '</video></div>'
            )

        }
    }

}


function display_patients(patients) {

    for(var patient of patients) {
        $(".patients").append(
            "<div class='patient'><a href='#'>" +
                patient.name + " - " + patient.email +
            "</a></div>"
        )
    }

}


function list_patients(callback) {
    var settings = {
      "async": true,
      "crossDomain": true,
       "headers": {
       "Authorization": "Token " + localStorage.getItem("session_id"),
      },
      "url": SERVER + "/api/list-patients/",
      "method": "GET",
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
    }
    $.ajax(settings).done(function (response) {
        console.log(response)
        callback(JSON.parse(response))
    }).fail(function(err) {
        console.log(err)
    });
}

function list_patient_events(patient_email, filter_type, callback) {
    var url = SERVER + "/api/list-patient-events/?email=" + patient_email

    if (filter_type == 'gps') {
        url += "&filter_type=gps"

    } else if (filter_type == 'video') {
        url += "&filter_type=video"
    }

    var settings = {
      "async": true,
      "crossDomain": true,
       "headers": {
       "Authorization": "Token " + localStorage.getItem("session_id"),
      },
      "url": url,
      "method": "GET",
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
    }
    $.ajax(settings).done(function (response) {
        console.log(response)
        callback(JSON.parse(response))
    }).fail(function(err) {
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
window.addEventListener("DOMContentLoaded", init, false);
