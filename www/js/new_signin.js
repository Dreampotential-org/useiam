function init() {
  $("#signup_email").val(getUrlVars()["email"]);
  signup_monitor();
  login_monitor();
}

function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (
    m,
    key,
    value
  ) {
    vars[key] = value;
  });
  return vars;
}

function login_monitor() {
  // create their account
  $("#login").on("click", function (e) {
    login_api(
      $("#signin_email").val().trim(),
      $("#signin_password").val().trim(),
      function () {
        // swal({
        //     'title': 'Login Success!',
        //     'text': 'You will now be able to view video links from email',
        //     'icon': 'success',
        // });

        if (localStorage.getItem("redirect_url")) {
          var redirect = localStorage.getItem("redirect_url");
          localStorage.removeItem("redirect_url");
          window.location = redirect;
        } else {
          //window.location = './admin.html';
          window.location = "./clients.html";
        }
      }
    );
  });
}

function login_api(email, password, callback) {
  var form = new FormData();
  form.append("username", email);
  form.append("password", password);
  var settings = {
    async: false,
    crossDomain: true,
    url: SERVER + "/api/api-token-auth/",
    method: "POST",
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data",
    data: form,
  };

  $.ajax(settings)
    .done(function (response) {
      localStorage.setItem("session_id", JSON.parse(response).token);
      console.log("user logged in");
      getOrganizationId();
      callback();

    })
    .fail(function (err) {
      swal({
        title: "Error",
        text: "Invalid email or password",
        icon: "error",
      });
    });
}

function signup_monitor() {
  $("#signup").on("click", function (e) {
    var invalid = false;
    if ($("#signup_name").val().trim().length == 0) {
      $("#signup_name").addClass("invalid");
      invalid = true;
    }

    if ($("#signup_email").val().trim().length != 0) {
      if (!validateEmail($("#signup_email").val().trim())) {
        $("#signup_email").addClass("invalid");
        invalid = true;
      }
    } else {
      $("#signup_email").addClass("invalid");
      invalid = true;
    }

    if ($("#signup_password").val().trim().length == 0) {
      $("#signup_password").addClass("invalid");
      invalid = true;
    }

    if (invalid == true) {
      swal({
        title: "Name or password field cannot be empty",
        text: "",
        icon: "error",
      });
      return;
    }
    if ($("#signup").hasClass("running")) {
      return;
    }
    // create their account
    $("#signup").addClass("running");
    signup_api({
      name: $("#signup_name").val().trim(),
      email: $("#signup_email").val().trim(),
      password: $("#signup_password").val().trim(),
    });
  });
}

function signup_api(params) {
  if (params.days_sober == null) {
    params.days_sober = "0";
  }
  var form = new FormData();
  form.append("name", params.name);
  form.append("email", params.email);
  form.append("days_sober", params.days_sober);
  form.append("password", params.password);
  //form.append("notify_email", 'aaronorosen@gmail.com');

  var settings = {
    async: true,
    crossDomain: true,
    url: SERVER + "/api/create-user/",
    method: "POST",
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data",
    data: form,
  };

  $.ajax(settings)
    .done(function (response) {
      $("#signup").removeClass("running");
      var msg = JSON.parse(response).message;
      if (msg && "User already exists" == msg) {
        swal({
          title: "Email already exists",
          text: "",
          icon: "error",
        });
        return;
      }
      localStorage.setItem("session_id", JSON.parse(response).token);
      console.log("user logged in");
      //after successful login or signup show dashboard contents

      swal({
        title: "Account Created",
        text: "You will now be able to view monitor events via email",
        icon: "success",
      });
    })
    .fail(function (err) {
      $("#signup").removeClass("running");
      console.log(err);
      alert(err);
      swal({
        title: "Error",
        text: "Invalid email or password",
        icon: "error",
      });
    });
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function getOrganizationId(){
  var request = $.ajax({
    "async": false,
    "crossDomain": true,
    "headers": {
      "Authorization": "Token " + localStorage.getItem("session_id"),
    },
    "url": SERVER + '/api/get_organization_id/',
    "method": "GET",
    "processData": false,
    "contentType": false,
  //  "mimeType": "multipart/form-data",
  });
  request.done(function(res){
    console.log(res)
    localStorage.setItem('organizationId',res.organization_id);
    localStorage.setItem('patient_org_id',res.Patient_org_id)
  });
  request.fail(function(err){
    console.log('error')
  });

  
}

window.addEventListener("DOMContentLoaded", init, false);
