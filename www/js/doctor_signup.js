
function init() {
    init_doctor_login_stuff();
}

function init_doctor_login_stuff() {

    handle_doctorSignup();
    doctorSignup_button();
    // doctorSignup_monitor();

}

function handle_doctorSignup() {

    $("#doctorSignupModal #nextBtn").on('click', function(e) {
        // $("#doctorSignupModal #nextBtn").addClass("running");

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
        if ($("#doctorSignupModal #nextBtn").hasClass("running")) {
            return
        }

        // create their account
        $("#doctorSignupModal #nextBtn").addClass("running")
        doctorSignup_api({
            'name': $("#signup_name").val().trim(),
            'email': $("#signup_email").val().trim(),
            'password': $("#signup_password").val().trim(),
        })
    });

}

function doctorSignup_button(){

    $('#doctorSignUp').on('click', function(e) {
        console.log("Doctor SIGNUP Need......__________")
      e.preventDefault();
      $('#doctorSignupModal').addClass('is-visible');
    });
    
    $(document).ready(function(){
        $( "#loginLink,#colseId" ).click(function() {
            console.log("Click on login link-----------")
          $('#doctorSignupModal').removeClass("is-visible");
       });
     });
}



// function doctorSignup_monitor() {
//     $("#signup").on('click', function(e) {
//         var invalid = false;
//         if($("#signup_name").val().trim().length == 0) {
//             $("#signup_name").addClass("invalid")
//             invalid = true;
//         }

//         if($("#signup_email").val().trim().length != 0) {
//             if (!(validateEmail($("#signup_email").val().trim()))) {
//                 $("#signup_email").addClass("invalid")
//                 invalid = true;
//             }
//         } else {
//             $("#signup_email").addClass("invalid")
//             invalid = true;
//         }

//         if($("#signup_password").val().trim().length == 0) {
//             $("#signup_password").addClass("invalid")
//             invalid = true;
//         }

//         if (invalid == true) {
//             swal({
//                 'title': 'Name or password field cannot be empty',
//                 'text': '',
//                 'icon': 'error',
//             });
//             return
//         }
//         if ($("#signup").hasClass("running")) {
//             return
//         }
//         // create their account
//         $("#signup").addClass("running")
//         doctorSignup_api({
//             'name': $("#signup_name").val().trim(),
//             'email': $("#signup_email").val().trim(),
//             'password': $("#signup_password").val().trim(),
//         })
//     });
// }

function doctorSignup_api(params) {
    if (params.days_sober == null) {
        params.days_sober = '0'
    }
    var form = new FormData();
    form.append("name", params.name);
    form.append("email", params.email);
    form.append("days_sober", params.days_sober);
    // form.append("sober_date", params.sober_date);
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
        $("#doctorSignupModal #nextBtn").removeClass("running")
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

    }).fail(function(err) {
        $("#doctorSignupModal #nextBtn").removeClass("running")
        console.log(err);
        alert(err)
        swal({
            'title': 'Error',
            'text': 'Invalid email or password',
            'icon': 'error',
        });

    });
}

function validateEmail(email) {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
}

window.addEventListener("DOMContentLoaded", init, false);
