var organ_id = localStorage.getItem('organizationId');
//document.getElementById("adminCheck").checked = false;

function init_organization_events() {
    console.log('here')
 // list_org_clients()
  $("#add_member").on("click", function (e) {});
}

function list_org_clients() {

  var settings = {
    async: true,
    crossDomain: true,
    url: SERVER + "/api/list-org-client/",
    method: "GET",
    processData: false,
    contentType: false,
    contentType: 'application/json',
    "headers": {
      "Authorization": "Token " + localStorage.getItem("session_id"),
    },
  };

  $.ajax(settings).done(
    function (response) {
        // XXX continue ..
        console.log(response)
        display_members(response)
    }).fail(function (err) {
      console.log(err);
      swal({
        title: "Error",
        text: "Error in api response",
        icon: "error",
      });
    });
}

function display_members(patients) {
    $(".clientsList").empty();
    object = patients.results;
    for (var patient of patients.results) {

        id = patient.id
        var html = '';
        var i = patients.results.indexOf(patient);

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

window.addEventListener("DOMContentLoaded", init_organization_events, false);
