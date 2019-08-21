function init() {
    if (!(localStorage.getItem("session_id"))) {
        window.location = 'login.html'
    }
    list_patients(function(response) {
        display_patients(response.patients);
    })

    list_patient_events(
        getUrlVars()['email'], "", function(response) {
            display_events(response.events)})
}

function init_street_view(e) {
    var spot = {lat: parseFloat(e.lat), lng: parseFloat(e.lng)}

    new google.maps.StreetViewPanorama(
            document.getElementById('gps-' + e.id),
            {
              position: spot,
              pov: {heading: 165, pitch: 0},
              zoom: 1
            });

}


function display_events(events) {

    var html = (
        "<table border='1'>" +
            "<tr>" +
                "<th>Date</th>" +
                "<th>Submission</th>" +
            "</tr>"
    )

    var gps_views = []
    for(var e of events) {
        html += "<tr>"
        html += "<td>" + formatDate((new Date(e.created_at * 1000))) + "</td>"
        if (e.type == 'gps') {
            html += (
                "<td>" +
                    "<div style='height:240px;width:320px;'  id='gps-" + e.id + "'></div>" +
                "</td>"
            )
            gps_views.push(e);
        }

        if (e.type == 'video') {
            html += (
                "<td>" +
                '<video controls="" name="media" width="320" height="240">' +
                    '<source src=' + SERVER + "" + e.url + "&token=" +
                        localStorage.getItem("session_id") + ' type="video/mp4">' +
                '</video></td>')

        }
        html += "</tr>"
    }

    $(".events").html(html)
    for(var e of gps_views) {
        init_street_view(e)
    }

}


function display_patients(patients) {

    for(var patient of patients) {
        $(".patients").append(
            "<div class='patient'>" +
                "<a href='/admin-events.html?email=" + patient.email + "'>" +
                    patient.name + " - " + patient.email +
                "</a>" +
            "</div>"
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
        localStorage.clear()
        window.location.reload()
    });
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m,key,value) {
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
window.addEventListener("DOMContentLoaded", init, false);
