function init_activity() {
   
  $("#viewActivity").on("click", function(e) {
    
    console.log("In INIT Activity ____**************",document.getElementById("activity"));

    if (document.getElementById("activity")) {
      document.getElementById("logoDivId").style.display = "none";
    } else {
      document.getElementById("logoDivId").style.display = "block";
    }

    $(".toggleBar").click();
    closeAllModals();
    //showBackButton('dashboard');
    showATab("activity");
    get_activity(function(resp) {
      display_activities(resp.events);
    });
  });

  $("body").delegate(".view-video", "click", function(e) {
    var video_url = $(this).attr("url");
    showATab("eventView");
    showBackButton("activity");
    $("#eventView .content").html(
      '<video controls="" autoplay="" name="media" ' +
        ' id="video" width="100%" height="240"></video>'
    );
    var id = getUrlVars(video_url)["id"];
    var user = getUrlVars(video_url)["user"];
    $("#video").html(
      "<source src=" +
        SERVER +
        "/api/review-video/?id=" +
        id +
        "&user=" +
        user +
        "&token=" +
        localStorage.getItem("session_id") +
        ' type="video/mp4">'
    );
  });

  $("body").delegate(".view-gps", "click", function(e) {
    showATab("eventView");
    showBackButton("activity");

    $("#eventView .content").html(
      "<div id='gps-view' style='width:100%;height:400px;'></div>"
    );
    var spot = {
      lat: parseFloat($(this).attr("lat")),
      lng: parseFloat($(this).attr("lng"))
    };
    var panorama = new google.maps.StreetViewPanorama(
      document.getElementById("gps-view"),
      {
        position: spot,
        pov: { heading: 165, pitch: 0 },
        zoom: 1
      }
    );
  });

  /*
    $("#viewActivity").click()
    $(".toggleBar").click()
    get_activity(function(resp) {  display_activities(resp.events) });
    */
}

function get_activity(callback) {
  var settings = {
    async: true,
    crossDomain: true,
    headers: {
      Authorization: "Token " + localStorage.getItem("session_id")
    },
    url: SERVER + "/api/get-activity/",
    method: "GET",
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data"
  };

  $.ajax(settings)
    .done(function(response) {
      var msg = JSON.parse(response);
      callback(msg);
    })
    .fail(function(err) {
      alert("Got err");
      console.log(err);
    });
}

function formatDate(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? "pm" : "am";
  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;
  var strTime = hours + ":" + minutes + " " + ampm;
  return date.toLocaleDateString("en-US") + " " + strTime;
}

function display_activities(activities) {
  for (var activity of activities) {
    if (activity.type == "gps") {
      console.log(activity);
      $("#activity-log").append(
        '<li class="other"><div class="msg"> <p class="dateClass">' +
          formatDate(new Date(activity.created_at * 1000)) +
          "</p>" +"<p class='msgText'>"+ activity.msg +"</p>"+
          "<p class='alignTag'><a href='#' class='view-gps customLinkBtn' lat=" +
          activity.lat +
          " " +
          "lng=" +
          activity.lng +
          "> " +
          activity.type +'<span><i class="fa fa-angle-double-right"></i></span>'+
          "</a>" +
         
          "</p>" +
          '<div class="icon"><img src="images/place.png" alt=""/></div>' +
          "</div> </li>"
      );
    }
    if (activity.type == "video") {
      $("#activity-log").append(
        '<li class="other dark"><div class="msg"> <p class="dateClass">' +
          formatDate(new Date(activity.created_at * 1000)) +
          "</p>" +
          "<p class='alignTag'><a url=" +
          activity.url +
          " href='#' class='view-video customLinkBtn'>" +
          activity.type +'<span><i class="fa fa-angle-double-right"></i></span>'+
          "</a></p>" +
          '<div class="icon"><div class="borderDiv"><img src="images/Play_Video.png" alt=""/></div></div>' +
          "</div> </li>"
        //   <img src="images/play_icon.png" alt=""/>
      );
    }
  }
}

function getUrlVars(url) {
  var vars = {};
  var parts = url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function(m, key, value) {
    vars[key] = value;
  });
  return vars;
}
