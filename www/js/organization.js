function init_organization_events() {
    $("#add_member").on("click", function (e) {
        signup_api()

    })
}


function signup_api(params) {
  var form = new FormData();
  form.append("name", $('#member_name'));
  form.append("email", $('#member_email'));
  form.append("password", $('#member_password'));
  form.append("is_admin_member", $('#is_admin_member'));
  form.append("source", window.location.host);

  var settings = {
    async: true,
    crossDomain: true,
    url: SERVER + "/api/add_organization_member/",
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
