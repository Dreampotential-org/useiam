var object;
var current_id;
var offset = 0;
var total_count = 0;
var limit = 10;
function init() {
    list_patients(function (response) {
        display_patients(response);
        // paginate();
    })
    $(document).ready(function () {
        $("#myInput").on("keyup", function () {
            var value = $(this).val().toLowerCase();
            var Url;
            if (value == '') Url = SERVER + "/api/list-patients-v3/";
            else Url = SERVER + "/api/list-patients-v3/?name=" + value;

            var request = $.ajax({
                url: Url,
                type: 'GET',
                headers: {	"Authorization": "Token " + localStorage.getItem("session_id")	},
                contentType: 'application/json',
            });
            request.done(function (response) {
                display_patients(response);
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
                console.log(NEXT_PAGE_URL)
                console.log(PREV_PAGE_URL)
            });
            request.fail(function (err) {
                console.log(err)
            });


            $(".clientsList .col-2").filter(function () {
                $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
            });
        });
    });
}


function list_patients(callback = '') {
    var settings = {
        "async": true,
        "crossDomain": true,
        "headers": {
            "Authorization": "Token " + localStorage.getItem("session_id"),
        },
        "url": SERVER + "/api/list-patients-v3/",
        "method": "GET",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
    }
    $.ajax(settings).done(function (response) {
        display_patients(JSON.parse(response));
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

function openEditDialog(){
    console.log('hello ...')
    $(".modal-title").text("Edit Client");
    $('#addClientModal').modal('show');
}

function display_patients(patients) {
    $(".clientsList").empty();
    object = patients.results;
    for (var patient of patients.results) {

        id = patient.id
        var html = '';
        var i = patients.results.indexOf(patient);
        if (patient.gps && patient.gps.type == 'gps') {
            html += (
                `<a target="_blank" href="https://www.google.com/maps/place/${patient.gps.latitude},${patient.gps.long}">
                 <i class="material-icons align-middle">room</i></a>`  )
        }

        if (patient.video && patient.video.type == 'video') {
            html += (
                '<a href="#" id="myBtn" type="button" aria-pressed="true" onclick="openModal(' + i + ')"><i class="material-icons align-middle">play_circle_filled</i></a>' +
                '<div id="myModal' + i + '" class="modal">' +
                '<div class="modal-dialog modal-dialog-centered">' +
                '<div class="modal-content">' + '<div class="p-2"><p  onclick="closeModal(' + i + ')" class="close" id="closeModal">&times;</p></div><br/>' +
                '<video controls="" name="media"  class="video">' +
                '<source src=' + SERVER + "" + patient.video.video_url + "&token=" +
                localStorage.getItem("session_id") + ' type="video/mp4">' +
                '</video></div></div></div>')

        }

        $(".clientsList").append(
            `<div class="col-md-3 col-lg-2 col-sm-3 col-6 my-2">

                <div class="card">
                    <div class="text-center bg-secondary d-flex justify-content-center align-items-center clinetProfileImage">
                        <i style="font-size: 100px;" class="material-icons">person</i>
                    </div>
                    <div class="card-body">
                        <h6 class="card-subtitle">${patient.User ? patient.User.first_name ? patient.User.first_name : '--' : ''}`
            + html +
            `<i style="color: #009688;cursor:pointer"onClick="deleting(` + (patient.id) + `)"
                         class="material-icons align-middle float-right">delete</i>
                         <span style="padding-right:8px;color: #009688;cursor:pointer"
                         onClick="editing(`+ patient.id + `)"data-toggle="modal"
                        data-target="#modaleditForm" class="material-icons float-right">create<span/>
                        </h6>
                    </div>
                </div>
            </div>`
        )
    }

    var classes = ['bg-primary', 'bg-secondary', 'bg-success', 'bg-danger', 'bg-warning', 'bg-info'];
    var len = $(".clinetProfileImage").length;
    $(".clinetProfileImage").each(function (index) {
        var random = Math.floor(Math.random() * len) + 1;
        random = (Math.random() * len--) > 6 ? random + 1 : random;
        $(this).addClass(classes[random]);
    });
}

function editing(id) {
    var html = '';
    html = `<div style="padding-top: 70px;" class="modal fade" id="modaleditForm" tabindex="-1" role="dialog"
    aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog" role="document">
      <div class="modal-content">
        <div class="modal-header text-center">
          <h4 style="color: #009688;" class="modal-title w-100 font-weight-bold">Edit Client</h4>
          <button type="button" class="close" data-dismiss="modal" aria-label="Close">
            <span aria-hidden="true">&times;</span>
          </button>
        </div>
        <div class="modal-body mx-10">
          <div class="md-form mb-4">
            <i class="fas fa-envelope prefix grey-text"></i>
            <input type="name" id='edit_name' class="form-control validate">
            <label style="color:rgb(133, 133, 133);" data-error="wrong" data-success="right"
              for="name">Name</label>
          </div>
          <div class="md-form mb-4">
            <i class="fas fa-envelope prefix grey-text"></i>
            <input type="email" id='edit_email' class="form-control validate">
            <label style="color:rgb(133, 133, 133);" data-error="wrong" data-success="right"
              for="email">Email</label>
          </div>
        </div>
        <div class="modal-footer d-flex justify-content-center">
          <button id='edit_member' style="font-size: 20px;" aria-label="Close" data-dismiss="modal"
            class="btn btn-primary waves-effect waves-light font-weight-bold"onclick="editing_client()">Submit</button>
        </div>
      </div>
    </div>
    </div>`
    var current_data;
    $("#edit").html(html);
    object.forEach(element => {
        if (id == element.id) {
            current_data = element;
            return false;
        }
    });
    current_id = current_data.user;
    document.getElementById("edit_name").value = current_data.User ? current_data.User.first_name ? current_data.User.first_name : ' ' : '';
    document.getElementById("edit_email").value = current_data.notify_email;


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
                    url: SERVER + "/api/list-patients-v3/" + id,
                    type: 'DELETE',
                    headers: {
                        "Authorization": "Token " + localStorage.getItem("session_id"),
                    },
                    contentType: 'application/json',  // <---add this
                    success: function (result) {
                        getUpdatedData();
                    },
                    error: function (result) {

                    }
                });

            }
        });
}
function getUpdatedData() {
    var settings = {
        "async": true,
        "crossDomain": true,
        "headers": {
            "Authorization": "Token " + localStorage.getItem("session_id"),
        },
        "url": SERVER + "/api/list-patients-v3/",
        "method": "GET",
        "processData": false,
        "contentType": false,
        "mimeType": "multipart/form-data",
    }
    $.ajax(settings).done(function (response) {
        display_patients(JSON.parse(response));
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
$('#add_member').click(function (e) {
    console.log('ma ajaaava')
    var obj = {};
    obj['first_name'] = document.getElementById('name').value;
    obj['email'] = document.getElementById('email').value;
    obj['password'] = document.getElementById('password').value;

    var myJson = JSON.stringify(obj);
    var request = $.ajax({
        url: SERVER + "/api/add-monitor/",
        type: 'POST',
        data: myJson,
        headers: {	"Authorization": "Token " + localStorage.getItem("session_id")	},
        contentType: 'application/json',
    });
    request.done(function (response) {
        console.log(response)
        $.ajax({
            url: SERVER + "/api/list-patients-v3/",
            type: 'GET',
            headers: {
                "Authorization": "Token " + localStorage.getItem("session_id"),
            },
            contentType: 'application/json',  // <---add this
            success: function (res) {
                display_patients(res);
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
            },
            error: function (err) {

            }
        });

    });
    request.fail(function (jqXHR, textStatus) {

        alert("Request Failed: " + jqXHR.status);
    });
});
function openModal(ind) {

    console.log("In  myFunction......", ind)

    var modal = document.getElementById("myModal" + ind);
    console.log(modal)

    var btn = document.getElementById("myBtn");
    console.log(btn)

    modal.style.display = "block";

}
function closeModal(ind) {
    document.getElementById("myModal" + ind).style.display = "none";
}

function editing_client() {
    var obj = {};
    obj['first_name'] = document.getElementById("edit_name").value;
    obj['email'] = document.getElementById("edit_email").value;
    obj['id'] = current_id;
    var myJson = JSON.stringify(obj);
    var settings = {
        "async": true,
        "crossDomain": true,
        "url": SERVER + "/api/edit_monitor_member/",
        "type": "PUT",
        processData: false,
        "headers": {
            "Authorization": "Token " + localStorage.getItem("session_id"),
        },
        "data": myJson,
        "contentType": "application/json; charset=utf-8",
    }
    $.ajax(settings).done((response) => {

        var request = $.ajax({
            url: SERVER + "/api/list-patients-v3/",
            type: 'GET',
            // data: value ,
             headers: {	"Authorization": "Token " + localStorage.getItem("session_id")	},
            contentType: 'application/json',
        });
        request.done(function (resp) {
            display_patients(resp);
            var r = resp;
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
            //  callback(JSON.parse(response))
            //    }).fail(function (err) {
            //        console.log(err)
            //    });

        });
        request.fail(function (err) {
            console.log(err)
        });
    });
    $.ajax(settings).fail((response) => {
        console.log("error while editing")
    });

}

function next_page() {
    if (NEXT_PAGE_URL !== null) {
        const urlParams = new URLSearchParams(NEXT_PAGE_URL);
        offset = Number(urlParams.get('offset'))
        console.log(offset)
        hittingRecordApi(NEXT_PAGE_URL);
    }
    else console.log('next is null')

}
function previous_page() {
    if (PREV_PAGE_URL !== null) {
        const urlParams = new URLSearchParams(PREV_PAGE_URL);
        offset = Number(urlParams.get('offset'))
        console.log(offset)
        if (offset > -1 && offset !== null) {
            console.log('if condition')
            hittingRecordApi(PREV_PAGE_URL);
        }
        else {
            console.log('else condition')
            var url = new URL(PREV_PAGE_URL);
            var search_params = url.searchParams;
            let k = 0;
            offset = 0;
            search_params.set('offset', k.toString());
            url.search = search_params.toString();
            var new_url = url.toString();
            hittingRecordApi(new_url);
        }

    }
    else console.log('previous is null')
}
function goto_page(offset_no) {
    offset = offset_no;
    var url = new URL(NEXT_PAGE_URL ? NEXT_PAGE_URL : PREV_PAGE_URL);
    var search_params = url.searchParams;
    search_params.set('offset', offset.toString());
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
    if (offset - (limit * 2) >= 0 && offset >= (limit * 2)) {
        page += `<li class="text-primary page-item"><a class="page-link"onclick="goto_page(${offset - (limit * 2)})" >${(offset - (limit * 2)) / limit + 1}</a></li>`;
    }
    if (offset - limit >= 0 && offset >= limit) {
        page += `<li class="text-primary page-item"><a class="page-link"onclick="goto_page(${offset - limit})" >${(offset - limit) / limit + 1}</a></li>`;
    }

    page += `<li class="text-primary page-item active"><a href="javascript:void(0)" class="page-link" >${(offset / limit) + 1}</a></li>`;

    if (total_count >= (offset + 1 + limit)) {
        page += `<li class="text-primary page-item"><a class="page-link"onclick="goto_page(${offset + limit})" >${((offset + limit) / limit) + 1}</a></li>`;
    }
    if (total_count >= (offset + 1 + (limit * 2))) {
        page += `<li class="text-primary page-item"><a class="page-link"onclick="goto_page(${offset + (limit * 2)})" >${((offset + (limit * 2)) / limit) + 1}</a></li>`;
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

        display_patients(JSON.parse(response));

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
