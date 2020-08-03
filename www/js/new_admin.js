function init() {
    if (!(localStorage.getItem("session_id"))) {
        window.location = 'login.html'
    }
    init_page_events();
    list_patients(function(response) {
        display_patients(response.patients);
    })
    list_patient_events(
        getUrlVars()['email'], "", function(response) {
            display_events(response)})
}


function init_page_events() {

    $("body").delegate(".logout", "click", function(e) {
        localStorage.clear()
      //  window.location = 'login.html'
        window.location = 'login2.html'
    });

    $("body").delegate(".select-patient", "change", function(e) {
        list_patient_events($(this).val(), "", function(response) {
            display_events(response);
        })
    });

    $('body').delegate('.next', 'click', function(e) {
        if (NEXT_PAGE_URL == null)  {
            alert("No more pages")
            return
        }
        api_list_patient_events(NEXT_PAGE_URL, function(response) {
            console.log("ERE")
            console.log(response)
            display_events(response);
        });
    })

    $('body').delegate('.prev', 'click', function(e) {
        if (PREV_PAGE_URL == null)  {
            alert("No more pages")
            return
        }

        api_list_patient_events(PREV_PAGE_URL, function(response) {
            display_events(response);
        })
    })
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

var NEXT_PAGE_URL = null;
var PREV_PAGE_URL = null;

function display_events(response) {

    var html = "";

    if(response.count == 0){
        html += `<div class="col-md-12 my-2 text-center">No records found.</div>`
    }

    var gps_views = []
    for(var e of response.results) {
        var i = response.results.indexOf(e);

        html += `<div class="col-md-3 col-lg-2 col-sm-3 col-6 my-2">

                    <div class="card">
                        <div class="text-center bg-secondary d-flex justify-content-center align-items-center custom-img">
                            <i style="font-size: 100px;" class="material-icons">person</i>
                        </div>
                        <div class="card-body">
                            <h6 class="card-subtitle">${e.name} `

                            

        if (e.type == 'gps') {
            html += (

                    `<a target="_blank" href="https://www.google.com/maps/place/${e.lat},${e.lng}"><i class="material-icons align-middle">room</i></a>`
            )
            gps_views.push(e);
        }

        if (e.type == 'video') {
            html += (
                '<a href="#" id="myBtn" type="button" aria-pressed="true" onclick="openModal('+i+')"><i class="material-icons align-middle">play_circle_filled</i></a>'+
                '<div id="myModal'+i+'" class="modal">'+ 
                '<div class="modal-dialog modal-dialog-centered">'+
                '<div class="modal-content">'+'<div class="p-2"><p  onclick="closeModal('+i+')" class="close" id="closeModal">&times;</p></div><br/>'+
                '<video controls="" name="media"  class="video">' +
                    '<source src=' + SERVER + "" + e.url + "&token=" +
                        localStorage.getItem("session_id") + ' type="video/mp4">' +
                '</video></div></div></div>')

        }
        
        
        html += `</h6></div></div></div>`
    }

    $(".events").html(html)
    for(var e of gps_views) {
        //init_street_view(e)
    }

    var classes = ['bg-primary', 'bg-secondary', 'bg-success', 'bg-danger', 'bg-warning', 'bg-info'];
    var len = $(".custom-img").length;
    $(".custom-img").each(function(index){
        var random = Math.floor( Math.random() * len ) + 1;
        random = (Math.random() * len--) > 6 ? random + 1 : random;
        //alert(random);
        $(this).addClass(classes[random]);
    });
}
function openModal(ind){
    
    console.log("In  myFunction......",ind)

    var modal = document.getElementById("myModal"+ind);
    console.log(modal)

    var btn = document.getElementById("myBtn");
    console.log(btn)
    
    modal.style.display = "block";

}

function closeModal(ind){
    document.getElementById("myModal"+ind).style.display="none";
}

function display_patients(patients) {
    $(".select-patient").append(
        "<option text-primary' value=''>All Patients</option>"
    )

    for(var patient of patients) {
        $(".select-patient").append(
            "<option value='" + patient.email + "'>" +
                patient.name + "(" + patient.email +  ")" +
            "</option>"
        )

        // $(".select-patient").append(
        //     "<a class='dropdown-item' value='" + patient.email + "'>" +
        //         patient.name + "(" + patient.email +  ")" +
        //     "</a>"
        // )
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
    if (!(patient_email)) {
        patient_email = ''
    } else {
        patient_email = encodeURIComponent(patient_email)
    }
    var url = SERVER + "/api/list-patient-events/?email=" + patient_email

    if (filter_type == 'gps') {
        url += "&filter_type=gps"

    } else if (filter_type == 'video') {
        url += "&filter_type=video"
    }
    api_list_patient_events(url, callback);
}

function api_list_patient_events(url, callback) {

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
        var r = JSON.parse(response)

        console.log(r)
        $(".count").text(r.count)
        if (r.next) {
            NEXT_PAGE_URL = SERVER + "/api" + r.next.split("/api")[1]
            $(".next").show()
        } else {
            NEXT_PAGE_URL = null;
            $(".next").hide()
        }
        if (r.previous) {
            PREV_PAGE_URL = SERVER + "/api" + r.previous.split("/api")[1]
            $(".prev").show()
        } else {
            PREV_PAGE_URL = null;
            $(".prev").hide()
        }
        callback(r)
    }).fail(function(err) {
        console.log(err)
        localStorage.clear()
        //window.location.reload()
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

window.addEventListener("DOMContentLoaded", init, false);
