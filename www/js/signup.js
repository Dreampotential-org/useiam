var LAST_EMAIL = null
function init_login_stuff() {
    user_logged_in();
    signup_signin_buttons();
    handle_signup();
    handle_signin();
    handle_logout();
    handle_login_code()
    handle_show_instructions();


}

function user_logged_in() {
    if (localStorage.getItem("session_id")) {
        showATab("dashboard");
        // close modals
        closeAllModals();
        return
    }

    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const email = urlParams.get('email')
    const name = urlParams.get('name', "")
    const phone = urlParams.get('phone', "")

    if (email) {
        return
        signup_api({
            name: name,
            email: email,
            password: null,
            days_sober: null,
        });
    }
}


function handle_login_code() {
    $("body").delegate("#login_code_button", "click", function (e) {

        handle_login_code_api(LAST_EMAIL, $("#login_code").val().trim())

    })

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

        //if ($("#signup_password").val().trim().length == 0) {
        //  $("#signup_password").addClass("invalid");
        //  invalid = true;
        //}

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
        LAST_EMAIL = $("#signup_email").val().trim()

        signup_api({
            name: $("#signup_name").val().trim(),
            email: $("#signup_email").val().trim(),
            password: $("#signup_password").val(),
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

    var path = window.location.pathname;
    var page = path.split("/").pop();
    console.log(page);
    form.append("page", page.toLowerCase());

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
                console.log(response)
                $("#signupModal #nextBtn").removeClass("running");
                closeAllModals();
                if (Object.keys(JSON.parse(response)).includes('token')) {
                    localStorage.setItem("session_id", JSON.parse(response).token);

                    if(SELECTED_ORG_ID) {
                        do_set_org(SELECTED_ORG_ID, SELECTED_ORG_LOGO, function() {
                            swal({
                                title: "Good job!",
                                text: "You're logged in",
                                icon: "success",
                            });
                            $(".toggleBar").show();
                            $("#signupModal").hide();
                            $("#page-contents").show();
                            
                            $(".logoDiv").show();

                            $(".moto").show();
                            showATab("dashboard");
                            closeAllModals();
                            


                        });
                    } else {
                        swal({
                            title: "Good job!",
                            text: "You're logged in",
                            icon: "success",
                        });
                        $(".toggleBar").show();
                        $(".moto").show();
                        showATab("dashboard");
                        closeAllModals();
                    }
                } else {
                    $("#logincodeModal").addClass("is-visible");
                }

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
        LAST_EMAIL = $("#signin_email").val().trim()

        if (!(validateEmail(LAST_EMAIL))) {
            return
        }
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


function login_api_code(email, code, callback) {
    var form = new FormData();
    form.append("username", email);
    form.append("code", code);
    form.append("source", window.location.host);
    var settings = {
        async: true,
        crossDomain: true,
        url: SERVER + "/api/api-email-code/",
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

function handle_login_code_api(email, code, callback) {

    swal({
        title: "Checking Code",
        text: "Please wait.",
        icon: "info",
        buttons: false,
        closeOnEsc: false,
        closeOnClickOutside: false,
    });

    var form = new FormData();
    form.append("email", email);
    form.append("code", code);
    form.append("source", window.location.host);
    var settings = {
        async: true,
        crossDomain: true,
        url: SERVER + "/api/login-user-code/",
        method: "POST",
        processData: false,
        contentType: false,
        mimeType: "multipart/form-data",
        data: form,
    };
    $.ajax(settings)
            .done(function (response) {
                console.log(response)
                localStorage.setItem("session_id", JSON.parse(response).token);
                console.log("user logged in");

                $(".toggleBar").show();
                $(".moto").show();
                showATab("dashboard");
                closeAllModals();
                swal({
                    title: "Good job!",
                    text: "You're logged in",
                    icon: "success",
                }).then(function () {
                    closeAllModals();
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

            })
            .fail(function (err) {
                $("#logincodeModal").addClass("is-visible");
                swal({
                    title: "Error",
                    text: "Invalid code",
                    icon: "error",
                });
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

                $("#signinModal").hide();
                $("#page-contents").show();

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
        // $("#signinModal").addClass("is-visible");
        $("#signinModal").show();
        $("#page-contents").hide();
        $('.logoDiv').hide()

    });

    $("#signup").on("click", function (e) {
        e.preventDefault();
        $("#signupModal").addClass("is-visible");
        $("#signup_name").focus();
    });
    $("#select_organize").on("click", function (e) {
        e.preventDefault();
        $("#page-contents").hide();
        $('.logoDiv').hide()

        $("#orgModal").show();
        $("#organize_name").focus();
    });

    $("#backorgButtonAction").on("click", function (e) {
        e.preventDefault();
        $("#orgModal").hide();
        $("#page-contents").show();
        $('.logoDiv').show()
    });


    $(".close").on("click", function (e) {
        e.preventDefault();
        $("#orgModal").removeClass("is-visible");
    });
    $(".loginNeed").on("click", function (e) {
        e.preventDefault();
        $("#signupModal").removeClass("is-visible");
        $("#signinModal").addClass("is-visible");
    });

    $(".signupNeed").on("click", function (e) {
        e.preventDefault();
        
        $("#signupModal").show();
        $("#signinModal").hide();
        // $("#signupModal").addClass("is-visible");
        // $("#signinModal").removeClass("is-visible");
    });

    $("#admin").on("click", function (e) {
        window.location = "new_index.html";
    });
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}
