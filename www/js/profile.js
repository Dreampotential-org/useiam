function get_profile_info() {
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
        console.log(msg)
      if (msg.org_member && msg.org_member.logo) {
        $(".text-center img").attr('src', msg.org_member.logo);
        $("#org_name").text(msg.org_member.name);
      }
    })
}

function get_last_event(email) {
  if (!localStorage.getItem("session_id")) {
    return;
  }
  var settings = {
    async: true,
    crossDomain: true,
    headers: {
      Authorization: "Token " + localStorage.getItem("session_id"),
    },
    url: SERVER + "/api/get-last-patient-event/?email=" +
        encodeURIComponent(email),
    method: "GET",
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data",
  };

  $.ajax(settings)
    .done(function (response) {
      var msg = JSON.parse(response);
        console.log(msg)
      if (msg.org_member && msg.org_member.logo) {
        $(".text-center img").attr('src', msg.org_member.logo);
        $("#org_name").text(msg.org_member.name);
      }
    })
}
