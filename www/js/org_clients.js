var organ_id = localStorage.getItem('organizationId');
//document.getElementById("adminCheck").checked = false;
var MEMBERS = null;

function init_organization_events() {

    if (!(localStorage.getItem("session_id"))) {
        localStorage.setItem("redirect_url", window.location.href)
        window.location = 'login.html'
    }

  get_profile_info();
  // First we get list of org_members
  list_org_members(function(members) {
    MEMBERS = members;
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

    object = clients
    $(".clientsList").empty();
    for (var client of clients) {
        console.log(client)

        // Here is MemberMontiors for patient
        var html = '';
        console.log("client",clients)

        $(".clientsList").append(`
            <div class="col-md-3 col-lg-2 col-sm-3 col-6 my-2">

                <div class="card">
                    <div class="text-center bg-secondary d-flex justify-content-center align-items-center clinetProfileImage">
                        <i style="font-size: 100px;" class="material-icons">person</i>
                    </div>
                    <div class="card-body">
                        <h6 class="card-subtitle">${client.name}<br>${client.email}`
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
                  async:false,
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

function client_mapping(id) {
  var html = '';
  html = `<div style="padding-top: 70px;" class="modal fade" id="modaleditForm" tabindex="-1" role="dialog"
  aria-labelledby="myModalLabel" aria-hidden="true">
  <div class="modal-dialog" role="document">
    <div class="modal-content">
      <div class="modal-header text-center">
        <h4 style="color: #009688;" class="modal-title w-100 font-weight-bold">Select Client Member Monitors</h4>
        <button type="button" class="close" data-dismiss="modal" aria-label="Close">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
      <div class="modal-body mx-10">
        <!--
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
        </div> -->
        <div class="md-form mb-4" id='monitors'>
        </div>
      </div>
      <div class="modal-footer d-flex justify-content-center">
        <!--<button id='edit_member' style="font-size: 20px;" aria-label="Close" data-dismiss="modal"
          class="btn btn-primary waves-effect waves-light font-weight-bold"onclick="editing_client()">Submit</button>-->
      </div>
    </div>
  </div>
  </div>`
    var current_data;
    $("#edit").html(html);
    object.forEach(element => {
        if (id == element.user_id) {
            current_data = element;
            console.log("HERE")
            console.log(current_data)
            $("#monitors").html(generate_members_checkboxes(
                current_data.org_monitors, id))
            $("#monitors input").on('click', function() {
                if ($(this).is(":checked")) {
                    add_member_client($(this).attr("user_id"),
                                      $(this).attr("member_user_id"))
                } else {
                    delete_member_client($(this).attr("org_monitor_id"))

                }
                console.log($(this).attr("user_id"))
                console.log($(this).attr("member_user_id"))
            })
        }
      })
}


function generate_members_checkboxes(org_monitors, user_id) {
    var html = ''
    for(var member of MEMBERS) {
        var checked = ''
        for(var org_monitor of org_monitors) {
            console.log(member.User.email + " " + org_monitor.email)
            if (member.User.email == org_monitor.email) {
                checked = 'checked org_monitor_id=' + org_monitor.id
                break
            }
        }

        html = (
            "<input user_id=" + user_id + " member_user_id=" + member.User.id +
            " type='checkbox' " +  checked + "><label>" +
            member.User.first_name + " - " + member.User.email +
            "</label><br>" + html
        )
    }

    console.log(html)
    return html
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

      swal({
        title: "Success",
        text: "success in api response",
        icon: "success",
      }).then(function() {window.location.reload()});


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
      swal({
        title: "Success",
        text: "success in api response",
        icon: "success",
      }).then(function() {window.location.reload()});




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

