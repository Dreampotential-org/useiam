var SERVER = 'https://useiam.dreampotential.org'
//var SERVER = 'http://127.0.0.1:8000'
 //var PythonAPIServer = 'http://127.0.0.1:8000'
 var PythonAPIServer = 'https://api.dreampotential.org'
 var organization_id = null;
 // plan id = IAM001
 // test plan id = 007
 //var SERVER = 'http://192.168.100.166:8081'
 

function closeAllModals() {
  // $("#logincodeModal").removeClass("is-visible");
  $("#setOrgModal").removeClass("is-visible");
  $("#signinModal").removeClass("is-visible");
  $("#signupModal").removeClass("is-visible");
  $("#LocationModal").removeClass("is-visible");
  $("#videoInfo").removeClass("is-visible");
  $("#setmonitorModal").removeClass("is-visible");
  $("#setTimeModal").removeClass("is-visible");
  $("#inviteModal").removeClass("is-visible");
  $("#setSoberDate").removeClass("is-visible");
  $("#proTip").removeClass("is-visible");
  $("#instructionsModal").removeClass("is-visible");
  $("#paymentForm").removeClass("is-visible");
}


function toggleloadingon() {

   swal({
      title: "Setting up",
      text: "Just a momemt,.",
      icon: "info",
      buttons: false,
      closeOnEsc: false,
      closeOnClickOutside: false,
    });

}
function toggleloadingoff() {
    swal.close()
}

