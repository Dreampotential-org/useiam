function init_login_stuff() {

    // setup calender
    $("#sober_date").datepicker()
    $("#sober_date_update").datepicker()

    user_logged_in()
    signup_signin_buttons()
    handle_signup();
    handle_signin();
    handle_logout();

    handle_show_instructions();

}

function user_logged_in() {
    if (localStorage.getItem("session_id")) {
        showATab('dashboard');
        //close modals
        closeAllModals();

    }
}

function handle_logout() {
    $("#logout").on('click', function(e) {
        localStorage.clear();
        location.reload();
        $(".moto").hide()
    });
}

function handle_show_instructions() {
    $("body").delegate("#showInstructions", "click", function(e) {
        $('.toggleBar').click()
        $('#instructionsModal').addClass('is-visible');
    })
}

function handle_signup() {

    $("#signupModal #nextBtn").on('click', function(e) {

        // validate inputs
        var invalid = false;
        if($("#signup_name").val().trim().length == 0) {
            $("#signup_name").addClass("invalid")
            invalid = true;
        }

        if($("#signup_email").val().trim().length != 0) {
            if (!(validateEmail($("#signup_email").val().trim()))) {
                $("#signup_email").addClass("invalid")
                invalid = true;
            }
        } else {
            $("#signup_email").addClass("invalid")
            invalid = true;
        }

        if($("#signup_password").val().trim().length == 0) {
            $("#signup_password").addClass("invalid")
            invalid = true;
        }

        if (invalid == true) {
            return
        }
        if ($("#signupModal #nextBtn").hasClass("running")) {
            return
        }

        // create their account
        $("#signupModal #nextBtn").addClass("running")
        signup_api({
            'name': $("#signup_name").val().trim(),
            'email': $("#signup_email").val().trim(),
            'password': $("#signup_password").val().trim(),
            'days_sober': null,
            'sober_date': $("#sober_date").val().trim(),
        })
    });
}

function signup_api(params) {

    if (params.days_sober == null) {
        params.days_sober = '0'
    }
    var form = new FormData();
    form.append("name", params.name);
    form.append("email", params.email);
    form.append("days_sober", params.days_sober);
    form.append("sober_date", params.sober_date);
    form.append("password", params.password);
    //form.append("notify_email", 'aaronorosen@gmail.com');
    form.append("source", window.location.host);

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": SERVER + "/api/create-user/",
      "method": "POST",
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form
    }

    $.ajax(settings).done(function (response) {
        $("#signupModal #nextBtn").removeClass("running")
        var msg = JSON.parse(response).message
        if (msg && 'User already exists' == msg) {
            swal({
                'title': 'Email already exists',
                'text': '',
                'icon': 'error',
            });
            return
        }
        localStorage.setItem("session_id", JSON.parse(response).token)
        // show toggle bar
        $(".toggleBar").show()
        console.log("user logged in");
        //after successful login or signup show dashboard contents
        showATab('dashboard');
        //close modals
        closeAllModals();
        $(".moto").show()

        get_profile_info(function(msg) {
            if (!(msg.monitors.length)) {
                show_set_monitor();
            } else {
                $('.toggleBar').click()
                $("#showInstructions").click()
            }
        });

        //$("#proTip").addClass("is-visible");


    }).fail(function(err) {
        $("#signupModal #nextBtn").removeClass("running")
        console.log(err);
        swal({
            'title': 'Error',
            'text': 'Invalid email or password',
            'icon': 'error',
        });

    });
}

function handle_signin() {
    // create their account
    $("#signinModal .loginToDashboard").on('click', function(e) {
        e.preventDefault();

        login_api($("#signin_email").val().trim(),
        $("#signin_password").val().trim(), function() {
            //after successful login or signup show dashboard contents
            showATab('dashboard');
            //close modals
            closeAllModals();
            get_profile_info(function(msg) {
                if (!(msg.monitors.length)) {
                    show_set_monitor();
                } else {
                    $('.toggleBar').click()
                    $("#showInstructions").click()
                }
            });

            //$("#proTip").addClass("is-visible");
        })
    })
}



function login_api(email, password, callback) {

    var form = new FormData();
    form.append("username", email);
    form.append("password", password);
    form.append("source", window.location.host);
    var settings = {
      "async": true,
      "crossDomain": true,
      "url": SERVER + "/api/api-token-auth/",
      "method": "POST",
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form,
    }
    $.ajax(settings).done(function (response) {

        localStorage.setItem("session_id", JSON.parse(response).token)
        console.log("user logged in")

        $(".toggleBar").show()
        $(".moto").show()
        callback();
    }).fail(function(err) {
        swal({
            'title': 'Error',
            'text': 'Invalid email or password',
            'icon': 'error',
        });

    });
}


function signup_signin_buttons() {

    $('#signin').on('click', function(e) {
      e.preventDefault();
      $('#signinModal').addClass('is-visible');
    });

    $('#signup').on('click', function(e) {
        console.log("SIGNUP Need......__________")
      e.preventDefault();
      $('#signupModal').addClass('is-visible');
    });

    $(".loginNeed").on("click", function(e) {
      e.preventDefault();
      $('#signupModal').removeClass('is-visible');
      $('#signinModal').addClass('is-visible');
    })

    $(".signupNeed").on("click", function(e) {
      e.preventDefault();
      $('#signupModal').addClass('is-visible');
      $('#signinModal').removeClass('is-visible');
    });
}


function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}


