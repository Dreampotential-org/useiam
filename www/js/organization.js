
document.getElementById("adminCheck").checked = false;

function init_organization_events() {
  $("#add_member").on("click", function (e) {
    signup_api();
  })
}

function signup_api(params = '') {

  var isAdmin = document.querySelector('#adminCheck').checked;
  var form = new FormData();
  form.append("first_name", document.getElementById("name").value);
  form.append("email", document.getElementById("email").value);
  form.append("password", document.getElementById("password").value);
  form.append("is_superuser", isAdmin);
  //form.append("source", window.location.host);

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
      //     console.log(response)
      getUpdatedData();
      // location.reload();
      // windows.location.reload();

    }).fail(function (err) {
      console.log(err);
      swal({
        title: "Error",
        text: "Invalid email or password",
        icon: "error",
      });
    });
}

// $("#edit").on("click", function (e) {
//   console.log('i am in edit')


// })

window.addEventListener("DOMContentLoaded", init_organization_events, false);
