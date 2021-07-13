var data = [];
var id;
var user_id;
var offset = 0;
var total_count = 0;
var limit = 10;
var NEXT_PAGE_URL = null;
var PREV_PAGE_URL = null;

function init() {
    if (!(localStorage.getItem("session_id"))) {
        window.location = 'login.html'
    }
    init_page_events();
    // list_patients(function(response) {
    //     console.log(response)
    //  //   display_patients(response.patients);
    // })
    list_patient_events(
        getUrlVars()['email'], "", function (response) {

            display_events(response)
        })
}
$(document).ready(function () {
    $("#myInput").on("keyup", function () {
        var value = $(this).val().toLowerCase();
        if (value == '') { value = 'all' }

        var request = $.ajax({
            url: SERVER + "/api/search_member/" + value,
            type: 'GET',
            // data: value ,
            headers: {	"Authorization": "Token " + localStorage.getItem("session_id")	},
            contentType: 'application/json',
        });
        request.done(function (response) {
            display_events(response);
            //var r = JSON.parse(response)
            var r = response;
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
            paginate();
        });
        request.fail(function (err) {
            console.log(err)
        });

        $(".clientsList .col-2").filter(function () {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
});

function init_page_events() {

    $("body").delegate(".logout", "click", function (e) {
        localStorage.clear()
        //  window.location = 'login.html'
        window.location = 'login2.html'
    });

    $("body").delegate(".select-patient", "change", function (e) {
        list_patient_events($(this).val(), "", function (response) {
            display_events(response);
        })
    });

    // $('body').delegate('.next', 'click', function (e) {
    //     if (NEXT_PAGE_URL == null) {
    //         alert("No more pages")
    //         return
    //     }
    //     api_list_patient_events(NEXT_PAGE_URL, function (response) {
    //         console.log("ERE")
    //         console.log(response)
    //         display_events(response);
    //     });
    // })

    // $('body').delegate('.prev', 'click', function (e) {
    //     if (PREV_PAGE_URL == null) {
    //         alert("No more pages")
    //         return
    //     }

    //     api_list_patient_events(PREV_PAGE_URL, function (response) {
    //         display_events(response);
    //     })
    // })
}

function init_street_view(e) {
    var spot = { lat: parseFloat(e.lat), lng: parseFloat(e.lng) }
    new google.maps.StreetViewPanorama(
        document.getElementById('gps-' + e.id),
        {
            position: spot,
            pov: { heading: 165, pitch: 0 },
            zoom: 1
        });
}

function display_events(response) {
    total_count = response.count;
    var html = "";

    if (response.count == 0) {
        html += `<div class="col-md-12 my-2 text-center">No records found.</div>`
    }

    var gps_views = []
    data = response.results;
    for (var e of response.results) {
        var i = response.results.indexOf(e);
        html += `<div class="col-md-3 col-lg-2 col-sm-3 col-6 my-2">

                    <div class="card">
                        <div class="text-center bg-secondary d-flex justify-content-center align-items-center custom-img">
                            <i style="font-size: 100px;" class="material-icons">person</i>
                        </div>
                        <div class="card-body">
                            <h6 class="card-subtitle">${e.Name} `

        html += `<i style="color: #009688;cursor:pointer"onClick="deleting(` + e.user_id + `)" class="material-icons align-middle float-right">delete</i><span style="padding-right:8px;color: #009688;cursor:pointer"onClick="editing(` + e.user_id + `)"data-toggle="modal"
       data-target="#modaleditForm" class="material-icons float-right">create<span/></h6></div></div></div>`
        user_id = e.user_id;
    }
    var r = response
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

    $(".events").html(html)
    // for (var e of gps_views) {
    //     //init_street_view(e)
    // }

    var classes = ['bg-primary', 'bg-secondary', 'bg-success', 'bg-danger', 'bg-warning', 'bg-info'];
    var len = $(".custom-img").length;
    $(".custom-img").each(function (index) {
        var random = Math.floor(Math.random() * len) + 1;
        random = (Math.random() * len--) > 6 ? random + 1 : random;
        //alert(random);
        $(this).addClass(classes[random]);
    });
    paginate();
}
function openModal(ind) {

    console.log("In  myFunction......", ind)

    var modal = document.getElementById("myModal" + ind);
    console.log(modal)

    var btn = document.getElementById("myBtn");
    console.log(btn)

    modal.style.display = "block";

}

function editing(idd) {
    id = idd;
    var html = '';
    html = `<div style="padding-top: 70px;" class="modal fade" id="modaleditForm" tabindex="-1" role="dialog"
    aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header text-center">
          <h4 style="color: #009688;" class="modal-title w-100 font-weight-bold">Edit Organization</h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body mx-10">
          <div class="md-form mb-4">
            <i class="fas fa-envelope prefix grey-text"></i>
            <input type="name" id='edit_name' class="form-control validate">
            <label style="color:rgb(133, 133, 133);" data-error="wrong" data-success="right"
              for="edit_name">Name</label>
          </div>
          <div class="md-form mb-4">
            <i class="fas fa-envelope prefix grey-text"></i>
            <input type="email" id='edit_email' class="form-control validate">
            <label style="color:rgb(133, 133, 133);" data-error="wrong" data-success="right"
              for="edit_email">Email</label>
          </div>
          <div class="md-form mb-4">
            <i class="fas fa-lock prefix grey-text"></i>
            <input type="password" id='edit_password' class="form-control validate">
            <label style="color:rgb(133, 133, 133);" data-error="wrong" data-success="right"
              for="edit_password">Password</label>
          </div>
          <div class="md-form mb-4">
                <i class="fas fa-lock prefix grey-text"></i>
                <span style="color:rgb(133, 133, 133);">Admin: </span><input type='checkbox' id="adminCheck" /><br>
          </div>

        </div>
        <div class="modal-footer d-flex justify-content-center">
          <button id='edit_member' style="font-size: 20px;" aria-label="Close" data-dismiss="modal"
            class="btn btn-primary waves-effect waves-light font-weight-bold" onclick="editing_member()">Submit</button>
        </div>
      </div>
    </div>
    </div>`
    var current_data;
    $("#edit").html(html);
    data.forEach(element => {

        if (id == element.user_id) {
            current_data = element;
            return false;
        }
    });
    document.getElementById("edit_name").value = current_data.Name;
    document.getElementById("edit_email").value = current_data.Email;
    document.getElementById("edit_password").value = "";
}
function deleting(id) {
    swal({
        title: "Warning",
        text: "Are you sure you want to delete organization",
        icon: "warning",
        buttons: true,
        dangerMode: true,
    })
        .then((willDelete) => {
            if (willDelete) {
                $.ajax({
                    url: SERVER + "/api/remove_member/" + id,
                    type: 'DELETE',
                    headers: {
                        "Authorization": "Token " + localStorage.getItem("session_id"),
                    },
                    contentType: 'application/json',  // <---add this
                    success: function (result) {
                        console.log('successfully deleted');
                        getUpdatedData();
                    },
                    error: function (result) {

                    }
                });
            }
        });

}
function editing_member() {

    data.forEach(element => {

        if (id == element.id) {
            current_element = element;
            return false;
        }
    });
    var isAdmin;
    // isAdmin = document.querySelector('#adminCheck').checked;
    // console.log(document.getElementById('adminCheck').checked);
    // console.log($('#adminCheck:checked').val());
    var temp = $('#adminCheck:checked').val();
    if(temp=='on')isAdmin=true;
    else isAdmin=false;
    var obj = {};
    obj['first_name'] = document.getElementById("edit_name").value;
    obj['email'] = document.getElementById("edit_email").value;
    obj['password'] = document.getElementById("edit_password").value;
    obj['is_superuser'] = isAdmin;
    obj['id'] = id;
    var myJson = JSON.stringify(obj);
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": SERVER + "/api/edit_member/",
        "type": "PUT",
        processData: false,
        "headers": {
            "Authorization": "Token " + localStorage.getItem("session_id"),
        },
        "data": myJson,
        "contentType": "application/json; charset=utf-8",
        // success: (response, textStatus, jQxhr) => {
        //     console.log("info updated")
        // }
    }
    $.ajax(settings).done((response) => {
        //  console.log("info updated success");
        var value = 'all';
        var request = $.ajax({
            url: SERVER + "/api/search_member/" + value,
            type: 'GET',
            // data: value ,
            headers: {	"Authorization": "Token " + localStorage.getItem("session_id")	},
            contentType: 'application/json',
        });
        request.done(function (response) {
            display_events(response);
            var r = response;
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
        });
        request.fail(function (err) {
            console.log(err)
        });
    });
    $.ajax(settings).fail((response) => {
        console.log("error while editing")
    });

}

function closeModal(ind) {
    document.getElementById("myModal" + ind).style.display = "none";
}

function display_patients(patients) {
    $(".select-patient").append(
        "<option text-primary' value=''>All Patients</option>"
    )

    for (var patient of patients) {
        $(".select-patient").append(
            "<option value='" + patient.email + "'>" +
            patient.name + "(" + patient.email + ")" +
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
        "url": SERVER + "/api/get_member/",
        "method": "GET",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
    }
    $.ajax(settings).done(function (response) {
        display_events(response)
        callback(JSON.parse(response))
    }).fail(function (err) {
        console.log(err)
    });
}

function list_patient_events(patient_email, filter_type, callback) {
    // if (!(patient_email)) {
    //     patient_email = ''
    // } else {
    //     patient_email = encodeURIComponent(patient_email)
    // }
    var url = SERVER + "/api/list-patient-events/?email=" + patient_email

    // if (filter_type == 'gps') {
    //     url += "&filter_type=gps"

    // } else if (filter_type == 'video') {
    //     url += "&filter_type=video"
    // }
    api_list_patient_events(url, callback);
}

function api_list_patient_events(url, callback) {

    var settings = {
        "async": true,
        "crossDomain": true,
        "headers": {
            "Authorization": "Token " + localStorage.getItem("session_id"),
        },
        "url": SERVER + "/api/get_member/",
        "method": "GET",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
    }
    $.ajax(settings).done(function (response) {
        var r = JSON.parse(response)
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
    }).fail(function (err) {
        console.log(err)
        localStorage.clear()
    });
}

function getUpdatedData() {
    var settings = {
        "async": true,
        "crossDomain": true,
        "headers": {
            "Authorization": "Token " + localStorage.getItem("session_id"),
        },
        "url": SERVER + "/api/get_member/"+'?limit='+limit+'&offset='+offset,
        "method": "GET",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
    }
    $.ajax(settings).done(function (response) {
        display_events(JSON.parse(response));
        var r = JSON.parse(response)
        total_count = r.count;
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
        paginate();
        // callback(JSON.parse(response))
    }).fail(function (err) {
        console.log(err)
    });
}

function getUrlVars() {
    var vars = {};
    var parts = window.location.href.replace(
        /[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
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
    minutes = minutes < 10 ? '0' + minutes : minutes;
    var strTime = hours + ':' + minutes + ' ' + ampm;
    return date.toLocaleDateString("en-US") + " " + strTime;
}

function next_page() {

    if (NEXT_PAGE_URL !== null) {
        let url = new URL(NEXT_PAGE_URL);
        let search_params = url.searchParams;
        offset = Number(search_params.get('page'))
        offset = ((offset - 1) * limit);
        hittingRecordApi(NEXT_PAGE_URL);
    }
    else console.log('next is null')

}
function previous_page() {
    if (PREV_PAGE_URL !== null) {
        let url = new URL(PREV_PAGE_URL);
        let search_params = url.searchParams;
        if (search_params.get('page')) {
            offset = Number(search_params.get('page'))
            offset = (offset - 1) * limit;
            if (offset > -1 && offset !== null) {
                hittingRecordApi(PREV_PAGE_URL);
            }
        }
        else {
            offset = 0;
            hittingRecordApi(PREV_PAGE_URL);
        }

    }
    else console.log('previous is null')
}
function goto_page(offset_no) {
    offset = offset_no;
    var url = new URL(NEXT_PAGE_URL ? NEXT_PAGE_URL : PREV_PAGE_URL);
    var search_params = url.searchParams;
    var off = (offset_no / limit) + 1;
    search_params.set('page', off.toString());
    url.search = search_params.toString();
    var new_url = url.toString();
    hittingRecordApi(new_url)
}
function paginate() {


    var page = '';

    page += `  <ul  style="display:inline-flex;padding-left: 500px;font-size: 18px;" class="pagination">`;
    if (PREV_PAGE_URL !== null) {
        page += `<li class="text-primary page-item"><a class="page-link"  onclick="previous_page()">Previous</a></li>`;
    }
    if (offset - 20 >= 0 && offset >= 10 * 2) {
        page += `<li class="text-primary page-item"><a class="page-link"onclick="goto_page(${offset - 20})" >${(offset - 10 * 2) / 10 + 1}</a></li>`;
    }
    if (offset - 10 >= 0 && offset >= 10) {
        page += `<li class="text-primary page-item"><a class="page-link"onclick="goto_page(${offset - 10})" >${(offset - 10) / 10 + 1}</a></li>`;
    }

    page += `<li class="text-primary page-item active"><a href="javascript:void(0)" class="page-link" >${(offset / 10) + 1}</a></li>`;

    if (total_count >= (offset + 1 + 10)) {
        page += `<li class="text-primary page-item"><a class="page-link"onclick="goto_page(${offset + 10})" >${((offset + 10) / 10) + 1}</a></li>`;
    }
    if (total_count >= (offset + 1 + 20)) {
        page += `<li class="text-primary page-item"><a class="page-link"onclick="goto_page(${offset + 10 * 2})" >${((offset + 10 * 2) / 10) + 1}</a></li>`;
    }
    if (NEXT_PAGE_URL !== null) {
        page += `<li class="text-primary page-item"><a class="page-link" onclick="next_page()">Next</a></li>`;
    }
    page += `</ul>`;

    $('#paginate').append(page);
    $("#paginate").html(page);
}

function hittingRecordApi(url) {
    var request = $.ajax({
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
    });
    request.done(function (response) {

        display_events(JSON.parse(response));

        var r = JSON.parse(response)
        $(".count").text(r.count)
        total_count = r.count;
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
        paginate();
    });
    request.fail(function (err) {
        alert(err)
    });

}
window.addEventListener("DOMContentLoaded", init, false);
