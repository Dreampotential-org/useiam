function init() {
    init_reset_password()
    init_logo()
    init_login_stuff();
    init_gps_stuff()
    init_video_event();
    init_monitor()
    init_activity()
    init_display();

    // populates days sober in left side pannel
    get_profile_info();
    $("body").show()
}

function init_display() {
    if (localStorage.getItem("session_id")) {
        $(".toggleBar").show()
    }
}

function init_reset_password() {
    $("#forgot_password").attr("href", SERVER + "/password_reset");
}


// capture all errors and send to slack
window.onerror = function (msg, url, lineNo, columnNo, error) {
    var string = msg.toLowerCase();
    var substring = "script error";
    if (string.indexOf(substring) > -1){
        alert('Script Error: See Browser Console for Detail');
    } else {
        var message = [
            'Message: ' + msg,
            'URL: ' + url,
            'Line: ' + lineNo,
            'Column: ' + columnNo,
            'Error object: ' + JSON.stringify(error)
        ].join(' - ');

        log_error_to_slack(message);
    }
    return false;
};

function log_error_to_slack(msg) {
    $.ajax({
        url: '/log-errors/',
        data: JSON.stringify({
          'error': msg,
        }),
        type: 'post',
        success: function(results) {
            //callback(JSON.parse(results))
        }
    })
}

$('.modal-overlay').on('click', function(e) {
  $('.modal').removeClass('is-visible');
});
$('.toggleBar').on('click', function(e) {
  $('.slideMenu').toggle("slow");
    $(this).toggleClass('toggleClose');
    if($(this).hasClass('toggleClose')){
        $('header').css('margin-left','400px');
        $('#page-contents').css('margin-left','400px');
    }
    else{
        $('header').css('margin-left','0');
        $('#page-contents').css('margin-left','0');
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

function validateForm() {
    // This function deals with validation of the form fields
    var x, y, i, valid = true;
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
    var i, x = document.getElementsByClassName("step");
    for (i = 0; i < x.length; i++) {
        x[i].className = x[i].className.replace(" active", "");
    }
    //... and adds the "active" class to the current step:
    x[n].className += " active";
}


/*****************SWAPPING PAGE CONTENTS HERE******************/
var parentDiv = $('#page-contents');

$('.btnRecord').on('click',function(e){
    showATab('submitVideo');
    //hide info button if visible

});

$('.submitRecordingBtn').on('click',function(e){
    //hide info button if visible
    showATab('success');

    //removing old notifications
    $('ol.chat li:not(:first-child)').remove();
    //showing notifications
    $('<li class="notification" style="display: none"> <div class="msg"> <p>Video Added!</p> </div> </li>').
        appendTo(parentDiv.find('#success .chat')).show("slow");
    setTimeout(
        function()
        {
            $('<li class="other" style="display: none"><div class="avatar"><img src="images/avater.png" draggable="false"/></div><div class="msg">' +
            '<p>Your video was submitted successfully!</p> </div> </li>').
                appendTo(parentDiv.find('#success .chat')).show("slow");
        }, 1000);
});

var backBtn = $('.btnBack');
var toggleBar = $('.toggleBar');
var infoBtn = $('.btnInfo');
//showing back button instead of the side menu bars
function showBackButton(backTabID){
    toggleBar.hide();
    backBtn.show();
    $('input[id=backTabID]').val(backTabID);
    backBtn.id = backTabID;
    //alert("showbackbutton: "+backTabID);
}

backBtn.on('click',function(e){
    //hide info button if visible

    //alert("onclickbackbutton: "+$('input[id=backTabID]').val());

    //var tabToShow  = backBtn.id;
    var tabToShow = $('input[id=backTabID]').val();
    showATab(tabToShow);

    if(tabToShow == 'dashboard')
        showMenuBar();
});

function showInfoBtn(modalID){
    infoBtn.show();
    infoBtn.id = modalID;
}

infoBtn.on('click',function(e){
    var modalToShow = infoBtn.id;
    $('#'+modalToShow).addClass("is-visible");
});

function hideInfoBtn(){
    infoBtn.hide();
}

function showMenuBar(){
    backBtn.hide();
    toggleBar.show();
}

function showATab(tabID){
    parentDiv.children().hide();
    parentDiv.find('#' + tabID).show("fast");

    if (tabID == 'activity') {
        showBackButton('dashboard');
    }

    if (tabID == 'eventView') {
        showBackButton('activity');
    }

    // show info button for specific tabs else hide it
    if(tabID == 'takeVideo'){
        showInfoBtn('videoInfo');
    }
    else{
        hideInfoBtn();
    }
}

$('.btnOk').on('click',function(e){
    closeAllModals();
});

function closeAllModals(){
    $('#signinModal').removeClass("is-visible");
    $('#signupModal').removeClass("is-visible");
    $('#LocationModal').removeClass("is-visible");
    $('#videoInfo').removeClass('is-visible');
    $('#setmonitorModal').removeClass('is-visible');
    $("#proTip").removeClass("is-visible");
    $("#instructionsModal").removeClass("is-visible");
}


//setting height of video recorder
var totalHeight = $('body').outerHeight();
var headerHeight = $('header').outerHeight();
var secActionHeight = $('div.secAction.recording').outerHeight();
console.log(totalHeight);
console.log(headerHeight);
console.log(secActionHeight);

$('#takeVideo').css({
    height: totalHeight - headerHeight - secActionHeight
});
$('#submitVideo').css({
    height: totalHeight - headerHeight - secActionHeight
});


window.addEventListener("DOMContentLoaded", init, false);
