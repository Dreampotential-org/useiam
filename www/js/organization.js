function signup_api(params) {
  var form = new FormData();
  form.append("name", params.name);
  form.append("email", params.email);
  form.append("password", params.password);
  form.append("source", window.location.host);

  var settings = {
    async: true,
    crossDomain: true,
    url: SERVER + "/api/add_organization_member/",
    method: "POST",
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data",
    data: form,
  };

  $.ajax(settings).done(
        function (response) {
  }).fail(function (err) {
      console.log(err);
      swal({
        title: "Error",
        text: "Invalid email or password",
        icon: "error",
      });
    });
}
