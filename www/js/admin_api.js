function init() {

    get_all_activity(function(events) {
        for(var e of events['results']) {
            console.log(e);
        }
        // populate screen....
    })

}


function get_all_activity(callback) {
  var settings = {
    async: true,
    crossDomain: true,
    headers: {
      Authorization: "Token " + localStorage.getItem("session_id")
    },
    url: SERVER + "/api/list-patient-events-v2/",
    method: "GET",
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data"
  };

  $.ajax(settings).done(function(response) {
      var msg= JSON.parse(response);
      videoData =JSON.parse(response);
      var allData = JSON.parse(response);
      console.log(allData)
      callback(msg);
    }).fail(function(err) {
      alert("Got err");
      console.log(err);
    });
}

window.addEventListener("DOMContentLoaded", init, false);
