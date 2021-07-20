var organ_id = localStorage.getItem('organizationId');
//document.getElementById("adminCheck").checked = false;

function init_organization_events() {

  // First we get list of org_members
  list_org_members(function(members) {
    // then we get list of org clients
    list_org_clients(members);

  })
  $("#add_member").on("click", function (e) {});
}


function list_org_members(callback) {

  var settings = {
    async: true,
    crossDomain: true,
    url: SERVER + "/api/get_member/",
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
        callback(response.results)
    }).fail(function (err) {
      console.log(err);
      swal({
        title: "Error",
        text: "Error in api response",
        icon: "error",
      });
    });
}

function list_org_clients(members) {

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
        console.log(response)
        display_clients(response, members)

    }).fail(function (err) {
      console.log(err);
      swal({
        title: "Error",
        text: "Error in api response",
        icon: "error",
      });
    });
}

function display_clients(clients, members) {
    console.log(members)

    for(var member of members) {
        console.log(member)
    }


    $(".clientsList").empty();
    for (var client of clients) {
        console.log(client)

        id = client.user_id

        // Here is MemberMontiors for patient
        var html = '';
        console.log(client.org_monitors)

        $(".clientsList").append(`
            <div class="col-md-3 col-lg-2 col-sm-3 col-6 my-2">

                <div class="card">
                    <div class="text-center bg-secondary d-flex justify-content-center align-items-center clinetProfileImage">
                        <i style="font-size: 100px;" class="material-icons">person</i>
                    </div>
                    <div class="card-body">
                        <h6 class="card-subtitle">${client.name}`
            + html +
            `<i style="color: #009688;cursor:pointer"onClick="deleting(` + (client.user_id) + `)"
                         class="material-icons align-middle float-right">delete</i>
                         <span style="padding-right:8px;color: #009688;cursor:pointer"
                         onClick="client_mapping(`+ client.user_id + `)"data-toggle="modal"
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




function add_member_client(user_id, member_id) {
  var form = new FormData();
  form.append("member_id", member_id);
  form.append("client_id", user_id);
  var settings = {
    async: true,
    crossDomain: true,
    url: SERVER + "/api/add-member-client/",
    method: "POST",
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data",
    "headers": {
      "Authorization": "Token " + localStorage.getItem("session_id"),
    },
    data: form,
  };

  $.ajax(settings).done(
    function (response) {
        // XXX continue ..
        console.log(response)
    }).fail(function (err) {
      console.log(err);
      swal({
        title: "Error",
        text: "Error in api response",
        icon: "error",
      });
    });
}

function delete_member_client(id) {
  var form = new FormData();
  form.append("org_member_monitor", id);
  var settings = {
    async: true,
    crossDomain: true,
    url: SERVER + "/api/delete-member-client/",
    method: "POST",
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data",
    "headers": {
      "Authorization": "Token " + localStorage.getItem("session_id"),
    },
    data: form,
  };

  $.ajax(settings).done(
    function (response) {
        // XXX continue ..
        console.log(response)
        // alert success
        // reload page...


    }).fail(function (err) {
      console.log(err);
      swal({
        title: "Error",
        text: "Error in api response",
        icon: "error",
      });
    });
}




window.addEventListener("DOMContentLoaded", init_organization_events, false);

