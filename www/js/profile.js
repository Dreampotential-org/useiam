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

function get_last_event(user_id) {
  if (!localStorage.getItem("session_id")) {
    return;
  }
  var settings = {
    async: true,
    crossDomain: true,
    headers: {
      Authorization: "Token " + localStorage.getItem("session_id"),
    },
    url: SERVER + "/api/get-last-patient-event/?user_id=" + user_id,
    method: "GET",
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data",
  };

  $.ajax(settings)
    .done(function (response) {
      var msg = JSON.parse(response);
        console.log(msg)
      if (msg.id && msg.user) {
        window.location.href = '/review-video.html?id=' + msg.id + '&user=' + msg.user;
      } else {
        alert("no events for user yet")
      }
    })
}
