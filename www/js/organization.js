var organ_id = localStorage.getItem('organizationId');
document.getElementById("adminCheck").checked = false;

function init_organization_events() {
    get_profile_info();

  $("#add_member").on("click", function (e) {
    signup_api();
  })
}

function signup_api(params = '') {

  var isAdmin = document.querySelector('#adminCheck').checked;
  var obj = {};
  obj['name'] = document.getElementById("name").value;
  obj["email"] = document.getElementById("email").value;
  obj["password"] = document.getElementById("password").value;
  obj["admin"] = isAdmin;
  if (organ_id != undefined && organ_id != null && organ_id != 'null') obj['organization_id'] = organ_id;
  else obj['organization_id'] = selected_organization_id;

  var myJson = JSON.stringify(obj);
  var settings = {
    async: true,
    crossDomain: true,
    url: SERVER + "/api/add_member/",
    method: "POST",
    processData: false,
    contentType: false,
    contentType: 'application/json',
    "headers": {
      "Authorization": "Token " + localStorage.getItem("session_id"),
    },
    data: myJson,
  };

  $.ajax(settings).done(
    function (response) {
      getUpdatedData();
    }).fail(function (err) {
      console.log(err);
      swal({
        title: "Error",
        text: "Invalid email or password",
        icon: "error",
      });
    });
}



window.addEventListener("DOMContentLoaded", init_organization_events, false);
