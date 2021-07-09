function init_monitor() {
  $("#sober_count").on("click", function (e) {
    console.log("In updtate date function....");
    console.log("SRVER", SERVER);

    get_profile_info(function (msg) {
      if (msg.sober_date) {
        $("#sober_date_update").val(msg.sober_date);
      }
      show_set_sober_date();
      // closes side menu
      $(".toggleBar").click();
    });
  });

  $("#setSoberDate #nextBtn").on("click", function (e) {
    do_set_sober_date();
  });


  $("#setOrg").on("click", function (e) {
    list_orgs(function (msg) {
        console.log(msg)
       show_set_orgs();
      // closes side menu
      $(".toggleBar").click();
      $(".current-monitors").empty();
        $("#org_ids").empty()
      for (var org of msg) {
        $("#org_ids").append(
            "<option id='" + org.id + "'>" + org.name + "</option>")
      }
    });
  });

  $("#setMonitor").on("click", function (e) {
    get_profile_info(function (msg) {
      show_set_monitor();

      // closes side menu
      $(".toggleBar").click();
      $(".current-monitors").empty();
      for (var monitor of msg.monitors) {
        display_monitor(monitor);
      }
    });
  });


  $("#setOrgModal #nextBtn").on("click", function (e) {
    do_set_org();
  });

  $("#setmonitorModal #nextBtn").on("click", function (e) {
    do_set_monitor();
  });
}

function init_time() {
  console.log("In Init Time fun()......................");
  $("#setTime").on("click", function (e) {
    get_profile_info(function (msg) {
      show_set_time();

      // closes side menu
      $(".toggleBar").click();
    });
  });
}

function init_invite() {
  console.log("In Invite fun()......................");
  $("#invite").on("click", function (e) {
    get_profile_info(function (msg) {
      show_invite();

      // closes side menu
      $(".toggleBar").click();
    });
  });
}

function display_monitor(monitor) {
  $(".current-monitors").append(
    "<div>" +
      monitor +
      " - <a val='" +
      monitor +
      "' class='remove-monitor buttonColor' href='#'>remove</a></div>"
  );

  $(".remove-monitor").on("click", function (e) {
    var remove_monitor = $(this).attr("val");
    swal({
      title: "Are you sure?",
      text:
        "Once deleted, " +
        remove_monitor +
        " will no longer get updates from you.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    }).then((willDelete) => {
      if (willDelete) {
        api_remove_monitor(remove_monitor);
        swal("Monitor has been removed", {
          icon: "success",
        });
      }
    });
  });
}

function show_set_sober_date() {
  closeAllModals();
  $("#setSoberDate").addClass("is-visible");
}

function show_set_monitor() {
  closeAllModals();
  $("#setmonitorModal").addClass("is-visible");
}

function show_set_orgs() {
  closeAllModals();
  $("#setOrgModal").addClass("is-visible");
}

function show_set_time() {
  closeAllModals();
  $("#setTimeModal").addClass("is-visible");
  $(".timepicker").timepicker({
    interval: 10,
  });
}

function show_invite() {
  closeAllModals();
  $("#inviteModal").addClass("is-visible");
}

function do_set_not_paying(iap_blurb) {
  var form = new FormData();
  form.append("paying", "false");
  form.append("iap_blurb", iap_blurb);

  var settings = {
    async: true,
    crossDomain: true,
    headers: {
      Authorization: "Token " + localStorage.getItem("session_id"),
    },
    url: SERVER + "/api/profile/",
    method: "PUT",
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data",
    data: form,
  };

  $.ajax(settings)
    .done(function (response) {
      var msg = JSON.parse(response).message;
      // update sober date text on page
      get_profile_info();
      swal("Thanks for using useIAM", {
        icon: "success",
      }).then(function() {
          // XXX currently doing reload as there are some elements from
          // iap braintree seems to explore clean up issue.
          window.location.reload()
      })

      $("#not-subscribed-user").hide();
      $("#subscribed-user").show();

      //after successful login or signup show dashboard contents
      showATab("dashboard");
      //close modals
      closeAllModals();

      $(".toggleBar").click();
    })
    .fail(function (err) {
      // XXX loggg to slack
      console.log(err);
      swal({
        title: "Error",
        text: "",
        icon: "error",
      });
    });
}



function do_set_paying(iap_blurb) {
  var form = new FormData();
  form.append("paying", true);
  form.append("iap_blurb", iap_blurb);

  var settings = {
    async: true,
    crossDomain: true,
    headers: {
      Authorization: "Token " + localStorage.getItem("session_id"),
    },
    url: SERVER + "/api/profile/",
    method: "PUT",
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data",
    data: form,
  };

  $.ajax(settings)
    .done(function (response) {
      var msg = JSON.parse(response).message;
      // update sober date text on page
      get_profile_info();
    })
    .fail(function (err) {
      // XXX loggg to slack
      console.log(err);
      swal({
        title: "Error",
        text: "",
        icon: "error",
      });
    });
}




function do_set_sober_date() {
  var form = new FormData();

  form.append("sober_date", $("#sober_date_update").val().trim());
  form.append("source", window.location.host);
  var settings = {
    async: true,
    crossDomain: true,
    headers: {
      Authorization: "Token " + localStorage.getItem("session_id"),
    },
    url: SERVER + "/api/profile/",
    method: "PUT",
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data",
    data: form,
  };

  $.ajax(settings)
    .done(function (response) {
      var msg = JSON.parse(response).message;
      // update sober date text on page
      get_profile_info();
      swal("Sober Date has been updated", {
        icon: "success",
      });

      //after successful login or signup show dashboard contents
      showATab("dashboard");
      //close modals
      closeAllModals();

      $(".toggleBar").click();
    })
    .fail(function (err) {
      $("#setmonitorModal #nextBtn").removeClass("running");
      console.log(err);
      swal({
        title: "Error",
        text: "",
        icon: "error",
      });
    });
}

// function do_set_remainder_time(e) {
//   console.log('in function');
//   document.addEventListener('deviceready', function () {
//     //$("#reminder_time")
//     //.val()
//     console.log('in device ready');
//     cordova.plugins.notification.local.schedule({
//       title: 'My first notification',
//       text: 'Thats pretty easy...',
//       trigger: { every: { minute: 1 } },
//       foreground: true
//     });
//   }, false);
// }



function do_set_org() {
  var form = new FormData();
  form.append("org_id", parseInt($("#org_ids").find('option:selected').attr('id')))
  var settings = {
    async: true,
    crossDomain: true,
    headers: {
      Authorization: "Token " + localStorage.getItem("session_id"),
    },
    url: SERVER + "/api/set-org/",
    method: "PUT",
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data",
    data: form,
  };

  $.ajax(settings)
    .done(function (response) {
      var msg = JSON.parse(response).message;
      swal("Org has been set", {
        icon: "success",
      });

      //after successful login or signup show dashboard contents
      showATab("dashboard");
      $(".toggleBar").click();
      $("#showInstructions").click();
      console.log("Show instructions");
    })
    .fail(function (err) {
      console.log(err);
      swal({
        title: "Error",
        text: "",
        icon: "error",
      });
    });
}



function do_set_monitor() {
  if (!validateEmail($("#monitor_email").val().trim())) {
    swal({
      title: "Error Invalid email address",
      text: "",
      icon: "error",
    });
    return;
  }

  if ($("#monitor_email").val().trim().length != 0) {
    if (!validateEmail($("#monitor_email").val().trim())) {
      $("#monitor_email").addClass("invalid");
      return;
    }
  }

  var form = new FormData();
  form.append("notify_email", $("#monitor_email").val().trim());
  form.append("source", window.location.host);
  var settings = {
    async: true,
    crossDomain: true,
    headers: {
      Authorization: "Token " + localStorage.getItem("session_id"),
    },
    url: SERVER + "/api/add-monitor/",
    method: "PUT",
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data",
    data: form,
  };

  $.ajax(settings)
    .done(function (response) {
      var msg = JSON.parse(response).message;
      swal("Monitor has been added", {
        icon: "success",
      });

      $("#monitor_email").val("");
      //after successful login or signup show dashboard contents
      showATab("dashboard");
      //close modals
      //closeAllModals();

      $(".toggleBar").click();
      $("#showInstructions").click();
      console.log("Show instructions");
    })
    .fail(function (err) {
      $("#setmonitorModal #nextBtn").removeClass("running");
      console.log(err);
      swal({
        title: "Error",
        text: "",
        icon: "error",
      });
    });
}

function api_remove_monitor(notify_email) {
  var form = new FormData();
  form.append("notify_email", notify_email);
  var settings = {
    async: true,
    crossDomain: true,
    headers: {
      Authorization: "Token " + localStorage.getItem("session_id"),
    },
    url: SERVER + "/api/remove-monitor/",
    method: "PUT",
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data",
    data: form,
  };

  $.ajax(settings)
    .done(function (response) {
      var msg = JSON.parse(response).message;
      //after successful login or signup show dashboard contents
      showATab("dashboard");
      //close modals
      closeAllModals();
    })
    .fail(function (err) {
      swal({
        title: "Error",
        text: "",
        icon: "error",
      });
    });
}

function get_profile_info(callback) {
  if (!localStorage.getItem("session_id")) {
    return;
  }
  var settings = {
    async: true,
    crossDomain: true,
    headers: {
      Authorization: "Token " + localStorage.getItem("session_id"),
    },
    url: SERVER + "/api/profile/",
    method: "GET",
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data",
  };

  $.ajax(settings)
    .done(function (response) {
      var msg = JSON.parse(response);
      if (msg.user_org) {
        $(".logo img").attr('src', msg.user_org.logo);
      }
        $("#not-subscribed-user").hide();
        $("#subscribed-user").show();
        $("#Unsubscribe_div").hide();

      // if is not app and is paying
      if (true) {
        $("#not-subscribed-user").hide();
        $("#subscribed-user").show();
        $("#Unsubscribe_div").show();
      }
      // app paying free
      else if (isApp() == true) {
         $("#not-subscribed-user").show();
         $("#subscribed-user").show();
         $("#Unsubscribe_div").hide();
      // if not paying browser make pay
      }
      // else {
      //   $("#not-subscribed-user").show();
      //   $("#subscribed-user").hide();
      //   $("#Unsubscribe_div").hide();
      // }

      if (callback) callback(msg);
    })
    .fail(function (err) {
      console.log("ERR");
      console.log(err);
      localStorage.clear();
      location.reload();
    });
}

function list_monitors(callback) {
  var settings = {
    async: true,
    crossDomain: true,
    headers: {
      Authorization: "Token " + localStorage.getItem("session_id"),
    },
    url: SERVER + "/api/list-monitors/",
    method: "GET",
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data",
  };

  $.ajax(settings)
    .done(function (response) {
      //var msg = JSON.parse(response)
      callback(response);
    })
    .fail(function (err) {
      console.log(err);
    });
}


function list_orgs(callback) {
  var settings = {
    async: true,
    crossDomain: true,
    headers: {
      Authorization: "Token " + localStorage.getItem("session_id"),
    },
    url: SERVER + "/api/list_organizations/",
    method: "GET",
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data",
  };

  $.ajax(settings)
    .done(function (response) {
      var msg = JSON.parse(response)
      callback(msg);
    })
    .fail(function (err) {
      console.log(err);
    });
}
