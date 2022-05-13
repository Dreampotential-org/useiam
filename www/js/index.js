var app = {
  // Application Constructor
  initialize: function () {
    document.addEventListener(
      "deviceready",
      this.onDeviceReady.bind(this),
      false
    );
  },

  // deviceready Event Handler
  onDeviceReady: function () {
    // this.receivedEvent('deviceready');
    console.log("deviceready in index.js");
    KeepAwake.start();
    console.log(cordova.plugins);
    /*
    cordova.plugins.notification.local.hasPermission(function (granted) {
      if (granted == false) {
        cordova.plugins.notification.local.requestPermission(function (
          granted
        ) {
          // if granted is true then user granted or is false then not
        });
      }
    });
    */
    app.pluginInitialize();
  },

  pluginInitialize: function () {
    document.getElementById("setRemainder").onclick = app.scheduleInterval;
    var details = cordova.plugins.notification.local.launchDetails;

    if (details) {
      // alert('Launched by notification with ID ' + details.id);
    }
    if (
      window.cordova.platformId == "ios" ||
      window.cordova.platformId == "android"
    ) {
      $("#reminderMenu").show();
    }
  },

  // Schedule a repeating notification
  scheduleInterval: function () {
    console.log("scheduleInterval");
    app.clearAll();
    var remainderTime = document.getElementById("remainderTime").value;
    // console.log('remainderTime', remainderTime);

    var time = remainderTime;
    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var AMPM = time.match(/\s(.*)$/)[1];
    if (AMPM == "PM" && hours < 12) hours = hours + 12;
    if (AMPM == "AM" && hours == 12) hours = hours - 12;
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if (hours < 10) sHours = "0" + sHours;
    if (minutes < 10) sMinutes = "0" + sMinutes;
    // console.log(sHours + ":" + sMinutes);

    var sound =
      device.platform != "iOS" ? "file://sound.mp3" : "file://beep.caf";
    // console.log(sound);
    var date = new Date();
    // var currDate = (new Date(date.getFullYear(), date.getMonth(), date.getDate(), sHours, sMinutes, 0, 0)).toUTCString();
    var currDate = new Date(
      date.getFullYear(),
      date.getMonth(),
      date.getDate(),
      sHours,
      sMinutes,
      0,
      0
    );
    console.log(currDate);
    cordova.plugins.notification.local.schedule({
      id: 1,
      text: "Scheduled every day",
      trigger: {
        every: "day",
        at: new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate() + 1,
          sHours,
          sMinutes,
          0,
          0
        ),
        // firstAt: currDate
      },
      // trigger: { every: { hour: sHours, minute: sMinutes } },
      // trigger: { every: 'minute' },
      sound: sound,
      vibrate: true,
      // icon: 'res://icon',
      // smallIcon: 'res://ic_popup_sync'
    });
    cordova.plugins.notification.local.schedule({
      id: 2,
      text: "Scheduled every day",
      trigger: {
        at: new Date(
          date.getFullYear(),
          date.getMonth(),
          date.getDate(),
          sHours,
          sMinutes,
          0,
          0
        ),
      },
      sound: sound,
      vibrate: true,
    });
  },
  // Clear all notifications
  clearAll: function () {
    console.log("Clear");
    cordova.plugins.notification.local.clearAll(app.ids);
  },
};

app.initialize();


$(document).ready(function () {

  loadOrganization();

  $('#forgot_password').on('click', function () {
    $('.login-form-div').hide();
    $('.forgot-form-div').show();
  });

  $('#login_form_btn, #close_fp_form_btn').on('click', function () {
    $('.login-form-div').show();
    $('.forgot-form-div').hide();
  });

  $('#forgotBtn').on('click', function () {

    $('#forgot-icon').hide();
    $('#forgot-spinner-icon').show();

    email = $('#forgot_email').val();

    if (email === '' || email === null) {
      swal({
        title: "Email is required.",
        icon: "error",
        closeOnEsc: false,
        closeOnClickOutside: false,
      });

      $('#forgot-icon').show();
      $('#forgot-spinner-icon').hide();
      return false;
    }

    var form = new FormData();
    form.append("email", email);

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": SERVER + "/api/forgot-password/",
      "method": "POST",
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": form
    }

    $.ajax(settings).done(function (response) {
      swal({
        title: "Email Sent",
        text: "Email has been sent",
        icon: "success",
        closeOnEsc: false,
        closeOnClickOutside: false,
      });

      $('#forgot-icon').show();
      $('#forgot-spinner-icon').hide();
    }).fail(function (err) {
      swal({
        title: "Something Wrong.",
        text: err['responseText'],
        icon: "error",
        closeOnEsc: false,
        closeOnClickOutside: false,
      });

      $('#forgot-icon').show();
      $('#forgot-spinner-icon').hide();
    });

    return false;

  });
});

function loadOrganization() {
  let loading = '<option>Select Organization</option>';
  let loadData = '';
  var request = $.ajax({
    "async": true,
    "crossDomain": true,
    // "headers": {
    //   "Authorization": "Token " + localStorage.getItem("session_id"),
    // },
    "url": SERVER + '/api/list_organizations/',
    "method": "GET",
    "processData": false,
    "contentType": false,
    "mimeType": "multipart/form-data",
  });
  request.done(function (res) {
    loadData = JSON.parse(res);
    res = loadData;
    var listLength = loadData.length;
    for (let i = 0; i < listLength; i++) {
       loading+=`<option value='${i+1}'>${loadData[i].name}</option>`;    
   }
   $('#organization').append(loading);
    $("#organization").change(function (r) {
      let val = $('#organization').val();
      if(val!='Select Organization'){
        $('.logo').empty();
        console.log('logo');
        let img = "<img src='" + loadData[val-1].logo + "' style='width:160px'/>";
        $(".logo").append(img);
      }
      else{
        $('.logo').empty();
        //$(".logo").append("<img src='img/useiam_logo.png' width='200'height='200'/>");
      }
    });
  });
  request.fail(function (err) {
    //alert(err)
  });
}
