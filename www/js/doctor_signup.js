
function init() {
    init_doctor_login_stuff();
}

function init_doctor_login_stuff() {

    handle_doctorSignup();
    doctorSignup_button();

}

function handle_doctorSignup() {

    $("#doctorSignupModal #nextBtn").on('click', function(e) {
        // create their account
        $("#doctorSignupModal #nextBtn").addClass("running");
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

function nextPrev(n) {
    // This function will figure out which tab to display
    var x = document.getElementsByClassName("tab");
    // Exit the function if any field in the current tab is invalid:
    if (currentTab < (x.length-1)) {
        if (n == 1 && !validateForm()) return false;
        // Hide the current tab:
        x[currentTab].style.display = "none";
    }
    // Increase or decrease the current tab by 1:
    currentTab = currentTab + n;
    // if you have reached the end of the form... :
    if (currentTab >= x.length) {
        //...the form gets submitted:
        document.getElementById("regForm").submit();
        //hiding popup and showing dashboard
        $('#signupModal').toggle("fast");
        parentDiv.children().hide();
        parentDiv.find('#dashboard').show("slow");

        return false;
    }
    else{
        x[currentTab].style.display = "none";
    }
    // Otherwise, display the correct tab:
    //showTab(currentTab);
}



window.addEventListener("DOMContentLoaded", init, false);