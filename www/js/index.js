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
      cordova.plugins.notification.local.hasPermission(function (granted) {
        if (granted == false) {
          cordova.plugins.notification.local.requestPermission(function (
            granted
          ) {
            // if granted is true then user granted or is false then not
          });
        }
      });
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

  const queryString = window.location.search;
  const urlParams = new URLSearchParams(queryString);
  let token = urlParams.get('token')
  if (token){
  var formToken = new FormData();
  formToken.append("token", token);

  var settings = {
      "async": true,
      "crossDomain": true,
      "url": "http://192.168.100.141:8080/api/auth-magic-link/",
      "method": "POST",
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": formToken
  }

  $.ajax(settings).done(function (response) {

    window.history.pushState({}, document.title, "/");

    localStorage.setItem("session_id", JSON.parse(response).auth_token)
      showATab("dashboard");
          // close modals
          closeAllModals();
          swal({
            title: "Good job!",
            text: "You're logged in",
            icon: "success",
          });
          $("#not-subscribed-user").show();
          $("#subscribed-user").hide();

          $(".toggleBar").show();
          $(".moto").show();

          get_profile_info();


  // }).fail(function(err) {
  //     swal({
  //         title: "Something Wrong.",
  //         text: err['responseText'],
  //         icon: "error",
  //         closeOnEsc: false,
  //         closeOnClickOutside: false,
  //     });

  });

  }

  // function removeParam(parameter)
  // {

  //   var url=document.location.href;
  //   var urlparts= url.split('?');

  //  if (urlparts.length>=2)
  //  {
  //   var urlBase=urlparts.shift();
  //   var queryString=urlparts.join("?");

  //   var prefix = encodeURIComponent(parameter)+'=';
  //   var pars = queryString.split(/[&;]/g);
  //   for (var i= pars.length; i-->0;)
  //       if (pars[i].lastIndexOf(prefix, 0)!==-1)
  //           pars.splice(i, 1);
  //   url = urlBase+'?'+pars.join('&');
  //   window.history.pushState('',document.title,url); // added this line to push the new url directly to url bar .

  // }
  // return url;
  // }

  app.initialize();

  $(document).ready(function(){
      $('#login_magiclink').on('click', function(){
          $('.login-form-div').hide();
          $('.login-magic').show();
      });

      $('#login_magic_btn').on('click', function(){
        $('.login-form-div').show();
        $('.login-magic').hide();
    });


    $('#magicbtn').on('click', function(){

      $('#magic-icon').hide();
      $('#magic-spinner-icon').show();

      email = $('#magic_email').val();

      if (email === '' || email === null) {
          swal({
              title: "Email is required.",
              icon: "error",
              closeOnEsc: false,
              closeOnClickOutside: false,
          });

          $('#magic-icon').show();
          $('#magic-spinner-icon').hide();
          return false;
      }

      var form = new FormData();
      form.append("email", email);

      var settings = {
          "async": true,
          "crossDomain": true,
          "url": SERVER_API + "/api/send-magic-link/",
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

          $('#magic-icon').show();
          $('#magic-spinner-icon').hide();
      }).fail(function(err) {
          swal({
              title: "Something Wrong.",
              text: err['responseText'],
              icon: "error",
              closeOnEsc: false,
              closeOnClickOutside: false,
          });

          $('#magic-icon').show();
          $('#magic-spinner-icon').hide();
      });

      return false;

  });

      $('#forgot_password').on('click', function(){
        $('.login-form-div').hide();
        $('.forgot-form-div').show();
    });


      $('#login_form_btn').on('click', function(){
          $('.login-form-div').show();
          $('.forgot-form-div').hide();
      });

      $('#forgotBtn').on('click', function(){

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
          }).fail(function(err) {
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
