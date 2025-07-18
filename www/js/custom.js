var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

function handleOpenURL(url) {
  setTimeout(function () {
    alert("received url: " + url);
  }, 0);
}

function init() {
  onDeviceReady()

  //  https://github.com/apache/cordova-ios/issues/417
  $(document).on("blur", "input", function () {
    window.scrollTo(0, NaN);
  });

  // fixes same issue though on textareas
  $(document).on("blur", "textarea", function () {
    window.scrollTo(0, NaN);
  });

  init_login_stuff();
  init_gps_stuff();
  init_video_event();
  init_monitor();
  init_time();
  init_invite();
  init_activity();
  init_display();
  //init_stripe();
  init_iap_events()
  load_logo_from_url()

  init_not_med()
  setTimeout(function () {
    login_via_code_url()
  }, 200);


  if (!isApp()) {
    // Farrukh add subscription integration
    // make free for webclient until we implement
    $("#not-subscribed-user").hide();
    $("#subscribed-user").show();
  }
  // $("#not-subscribed-user").show();
  //  init_doctor_login_stuff();

  // populates user profile image
  get_profile_info(function() {}, false);
  $("body").show();
}

function block_desktop() {
  if (!window.location.pathname.includes('reset-password')) {
    if (!isMobile) {
      swal({
        title: "Computer not supported",
        text: "Use IAM with your smartphone or tablet.",
        icon: "info",
        closeOnEsc: false,
        closeOnClickOutside: false,
      });
    }
  }
}
function login_via_code_url() {
  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  const code = urlParams.get('code')
  const email = urlParams.get('email')
  if (code && email) {
    handle_login_code_api(email, code);
    closeAllModals()
    window.history.pushState("", "", "/")
  }
}


function init_not_med() {
  if (window.location.hostname == 'cardoneaccountability.com') {
    $(".meds").remove()
  }

}

function init_display() {
  console.log('init_display')
  if (localStorage.getItem("session_id") && localStorage.getItem('show_intro') == '0') {
    console.log('init_display > show');
    toggleBar.show();
    $('#header').show();
    $(".moto").show();
  }
}

// function init_reset_password() {
//   $("#forgot_password").attr("href", SERVER + "/password_reset");
// }

// capture all errors and send to slack
window.onerror = function (msg, url, lineNo, columnNo, error) {
  var string = msg.toLowerCase();
  var substring = "script error";
  if (string.indexOf(substring) > -1) {
    alert("Script Error: See Browser Console for Detail");
  } else {
    var message = [
      "Message: " + msg,
      "URL: " + url,
      "Line: " + lineNo,
      "Column: " + columnNo,
      "Error object: " + JSON.stringify(error),
    ].join(" - ");

    log_error_to_slack(message);
  }
  return false;
};

function log_error_to_slack(msg) {
  $.ajax({
    url:
      "https://hooks.slack.com/services/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",
    data: JSON.stringify({
      text: msg,
    }),
    type: "post",
    success: function (results) {
      //callback(JSON.parse(results))
    },
  });
}

$(".modal-overlay").on("click", function (e) {
  // if the user does not correctly tap allow we trigger
  // dialog box here too
  if ($(this).parent().attr("id") == "LocationModal") {
    start_gps();
    found_gps_or_timeout();
  }
  //$(".modal").removeClass("is-visible");
});

$(".toggleBar").on("click", function (e) {
  $(".slideMenu").toggle("slow");
  $(this).toggleClass("toggleClose");
  if ($(this).hasClass("toggleClose")) {
    $("#page-contents").css("margin-left", "400px");
  } else {
    $("header").css("margin-left", "0");
    $("#page-contents").css("margin-left", "0");
  }
});

//for singup form tabs
var currentTab = 0; // Current tab is set to be the first tab (0)
//showTab(currentTab); // Display the current tab

/*
function showTab(n) {
    // This function will display the specified tab of the form ...
    var x = document.getElementsByClassName("tab");
    x[n].style.display = "block";
    if (n == (x.length - 1)) {
        document.getElementById("nextBtn").innerHTML = "Submit";
        document.getElementById("nextBtn").setAttribute(
            'class','btnNext loginToDashboard');
    } else {
        document.getElementById("nextBtn").innerHTML = "Next";
    }
    // ... and run a function that displays the correct step indicator:

    fixStepIndicator(n)
}
*/

function nextPrev(n) {
  // This function will figure out which tab to display
  var x = document.getElementsByClassName("tab");
  // Exit the function if any field in the current tab is invalid:
  if (currentTab < x.length - 1) {
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
    $("#signupModal").toggle("fast");
    // parentDiv.children().hide();
    // parentDiv.find("#dashboard").show("slow");

    return false;
  } else {
    x[currentTab].style.display = "none";
  }
  // Otherwise, display the correct tab:
  //showTab(currentTab);
}

function validateForm() {
  // This function deals with validation of the form fields
  var x,
    y,
    i,
    valid = true;
  x = document.getElementsByClassName("tab");
  y = x[currentTab].getElementsByTagName("input");
  // A loop that checks every input field in the current tab:
  for (i = 0; i < y.length; i++) {
    // If a field is empty...
    if (y[i].value == "") {
      // add an "invalid" class to the field:
      y[i].className += " invalid";
      // and set the current valid status to false:
      valid = false;
    }
  }
  // If the valid status is true, mark the step as finished and valid:
  if (valid) {
    document.getElementsByClassName("step")[currentTab].className += " finish";
  }
  return valid; // return the valid status
}

function fixStepIndicator(n) {
  // This function removes the "active" class of all steps...
  var i,
    x = document.getElementsByClassName("step");
  for (i = 0; i < x.length; i++) {
    x[i].className = x[i].className.replace(" active", "");
  }
  //... and adds the "active" class to the current step:
  x[n].className += " active";
}

/*****************SWAPPING PAGE CONTENTS HERE******************/
var parentDiv = $("#page-contents");

$(".btnRecord").on("click", function (e) {
  showATab("submitVideo");
  //hide info button if visible
});

$(".submitRecordingBtn").on("click", function (e) {
  //hide info button if visible
  showATab("success");

  //removing old notifications
  $("ol.chat li:not(:first-child)").remove();
  //showing notifications
  $(
    '<li class="notification" style="display: none"> <div class="msg"> <p>Video Added!</p> </div> </li>'
  )
    .appendTo(parentDiv.find("#success .chat"))
    .show("slow");
  setTimeout(function () {
    $(
      '<li class="other" style="display: none"><div class="avatar"><img src="images/avater.png" draggable="false"/></div><div class="msg">' +
      "<p>Your video was submitted successfully!</p> </div> </li>"
    )
      .appendTo(parentDiv.find("#success .chat"))
      .show("slow");
  }, 1000);
});

var backBtn = $(".btnBack");
var toggleBar = $(".toggleBar");
var infoBtn = $(".btnInfo");
//showing back button instead of the side menu bars
function showBackButton(backTabID) {
  console.log('showBackButton', backTabID);
  toggleBar.hide();
  backBtn.show();

  $("input[id=backTabID]").val(backTabID);
  backBtn.id = backTabID;
  //alert("showbackbutton: "+backTabID);
}

backBtn.on("click", function (e) {
  console.log('custom.js',"On Back Button");

  var tabToShow = $("input[id=backTabID]").val();
  if (tabToShow == "activity") {
    document.getElementById("logoDivId").style.display = "none";
  } else {
    document.getElementById("logoDivId").style.display = "block";
  }
  showATab(tabToShow);

  if (tabToShow == "dashboard") {
    showMenuBar();
    $("#page-contents").hide();
    $('#dashboard').show('slow');
  }
});

function showInfoBtn(modalID) {
  infoBtn.show();
  infoBtn.id = modalID;
}

infoBtn.on("click", function (e) {
  var modalToShow = infoBtn.id;
  $("#" + modalToShow).addClass("is-visible");
});

function hideInfoBtn() {
  infoBtn.hide();
}

function showMenuBar() {
  $('#header').show();
  backBtn.hide();
  toggleBar.show();
}

function showATab(tabID) {
  console.log('showATab', tabID)

  parentDiv.children().hide();
  parentDiv.find("#" + tabID).show("fast");

  if (tabID == "dashboard" && localStorage.getItem('show_intro') == '0') {
    $("#page-contents").hide();
    $('#dashboard').show('slow');
  }

  if (tabID == "addEvent") {
    showBackButton("dashboard");
  }

  if (tabID == "activity") {
    $('#dashboard').hide();
    $('#page-contents').show('slow');
    showBackButton("dashboard");
  }

  if (tabID == "eventView") {
    showBackButton("activity");
  }

  // show info button for specific tabs else hide it
  if (tabID == "takeVideo") {
    showInfoBtn("videoInfo");
  } else {
    hideInfoBtn();
  }
}

$(".btnOk").on("click", function (e) {
  closeAllModals();
});

$("#feedback").on("click", function (e) {
  document.addEventListener('deviceready', function () {
    if (LaunchReview.isRatingSupported()) {
      LaunchReview.rating();
    } else {
      LaunchReview.launch(function () {
        console.log("Successfully");
      }, function (err) {
        console.log("Error launching store app: " + err);
      }, '1497407740');
    }
  }, false);
});

//setting height of video recorder
var totalHeight = $("body").outerHeight();
var headerHeight = $("header").outerHeight();
var secActionHeight = $("div.secAction.recording").outerHeight();
console.log(totalHeight);
console.log(headerHeight);
console.log(secActionHeight);

$("#takeVideo").css({
  height: totalHeight - headerHeight - secActionHeight,
});
$("#submitVideo").css({
  height: totalHeight - headerHeight - secActionHeight,
});

function objToStr(obj) {
  var text = '';
  $.each(obj, function (k, v) {
    text += v;
  });
  return text;
}

function objArrToStr(obj) {
  var text = '';
  $.each(obj, function () {
    var key = Object.keys(this)[0];
    var value = this[key];
    text += value + ' ';
  });
  return text;
}


// device APIs are available
//
function onDeviceReady() {
  document.addEventListener("pause", onPause, false);
  document.addEventListener("resume", onResume, false);
}

function onPause() {
  // Handle the pause event
  setTimeout(function () {
    // TODO report to server user activity
  }, 0);
}

function onResume() {
  // Handle the resume event
  setTimeout(function () {
    // TODO report to server user activity
  }, 0);

}


window.addEventListener("DOMContentLoaded", init, false);
