function init_login_stuff() {
  // setup calender
  // $("#sober_date").datepicker()
  // $("#sober_date_update").datepicker()

  user_logged_in();
  signup_signin_buttons();
  handle_signup();
  handle_signin();
  handle_logout();

  handle_show_instructions();
}

function user_logged_in() {
  if (localStorage.getItem("session_id")) {
    showATab("dashboard");
    // close modals
    closeAllModals();
  }
}

function handle_logout() {
  $("#logout").on("click", function (e) {
    var subscribed = false;

    if (localStorage.getItem("isSubscribed")) {
      subscribed = localStorage.getItem("isSubscribed");
    }
    localStorage.clear();
    localStorage.setItem("isSubscribed", subscribed);
    location.reload();
    $(".moto").hide();
  });
}

function handle_show_instructions() {
  $("body").delegate("#showInstructions", "click", function (e) {
    $(".toggleBar").click();
    $("#instructionsModal").addClass("is-visible");
  });
}

function handle_signup() {
  $("#signupModal #nextBtn").on("click", function (e) {
    e.preventDefault();
    // validate inputs
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

    if ($("#signup_name").val().trim().length == 0) {
      $("#signup_name").addClass("invalid");
      invalid = true;
    }

    if ($("#signup_password").val().trim().length == 0) {
      $("#signup_password").addClass("invalid");
      invalid = true;
    }

    if (invalid == true) {
      setTimeout(function () {
        $("#signup").click();
      }, 400);
      return;
    }
    if ($("#signupModal #nextBtn").hasClass("running")) {
      return;
    }

    // create their account
    $("#signupModal #nextBtn").addClass("running");
    signup_api({
      name: $("#signup_name").val().trim(),
      email: $("#signup_email").val().trim(),
      password: $("#signup_password").val().trim(),
      days_sober: null,
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
  form.append("sober_date", null);
  form.append("password", params.password);
  // form.append("notify_email", 'aaronorosen@gmail.com');
  form.append("source", window.location.host);

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
      $("#signupModal #nextBtn").removeClass("running");
      var msg = JSON.parse(response).message;
      if (msg && msg == "User already exists") {
        swal({
          title: "Email already exists",
          text: "",
          icon: "error",
        });
        return;
      }
      localStorage.setItem("session_id", JSON.parse(response).token);
      // show toggle bar
      $(".toggleBar").show();
      console.log("user logged in");
      // after successful login or signup show dashboard contents
      showATab("dashboard");
      // close modals
      closeAllModals();
      $(".moto").show();

      swal({
        title: "Good job!",
        text: "You're logged in",
        icon: "success",
      });

      get_profile_info(function (msg) {
        // XXX Check payment status

        // show_set_monitor();
        // if (!isApp()) {
          // Farrukh add subscription integration
          // make free for webclient until we implement
        console.log(msg)
        //$("#not-subscribed-user").show();
        ////$("#subscribed-user").hide();
        $("#not-subscribed-user").hide();
        $("#subscribed-user").show();
        $("#Unsubscribe_div").show();

        //}
      });

      // $("#proTip").addClass("is-visible");
    })
    .fail(function (err) {
      console.log(err);
      $("#signupModal #nextBtn").removeClass("running");
      console.log(err);
      swal({
        title: "Error",
        text: "Invalid email or password",
        icon: "error",
      });
    });
}

function handle_signin() {
  // create their account
  $("#signinModal .loginToDashboard").on("click", function (e) {
    e.preventDefault();

    login_api(
      $("#signin_email").val().trim(),
      $("#signin_password").val().trim(),
      function () {
        // after successful login or signup show dashboard contents
        showATab("dashboard");
        // close modals
        closeAllModals();
        swal({
          title: "Good job!",
          text: "You're logged in",
          icon: "success",
        });

        //if (!isApp()) {
          // Farrukh add subscription integration
          // make free for webclient until we implement
        $("#not-subscribed-user").show();
        $("#subscribed-user").hide();

        get_profile_info(function (msg) {
            console.log(msg)
          // show_set_monitor();
        });
      }
    );
  });
}

function login_api(email, password, callback) {
  var form = new FormData();
  form.append("username", email);
  form.append("password", password);
  form.append("source", window.location.host);
  var settings = {
    async: true,
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

      $(".toggleBar").show();
      $(".moto").show();
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

function signup_signin_buttons() {
  $("#signin").on("click", function (e) {
    e.preventDefault();
    $("#signinModal").addClass("is-visible");
  });

  $("#signup").on("click", function (e) {
    e.preventDefault();
    $("#signupModal").addClass("is-visible");
    $("#signup_name").focus();
  });

  $(".loginNeed").on("click", function (e) {
    e.preventDefault();
    $("#signupModal").removeClass("is-visible");
    $("#signinModal").addClass("is-visible");
  });

  $(".signupNeed").on("click", function (e) {
    e.preventDefault();
    $("#signupModal").addClass("is-visible");
    $("#signinModal").removeClass("is-visible");
  });

  $("#admin").on("click", function (e) {
    window.location = "new_index.html";
  });
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
