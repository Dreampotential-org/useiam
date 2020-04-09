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
    console.log("videooooooooooooo url",videourl)
    showATab("eventView");
    showBackButton("activity");
    $("#eventView .content").html(
      '<div class="detailsDiv"><button class="favBtn"><i class="fa fa-star-o starIcon"></i></button><div class="row"><div class="col-6 col-md-6 col-sm-03"><p style="padding:10px"><button id="previousBtn">Previous</button></p></div><div class="col-6 col-md-6 col-sm-03"><p style="padding:10px"><button id="nextBtn"> Next</button></p></div></div><video controls autoplay="" name="media" id="video" width="170" height="240"></video></div>'
        +'<hr>'+ '<div class="videoDetailsDiv"><b>Feedback received :</b><br> <div class="feedback_received"></div></div>'
    );
    var id = getUrlVars(video_url)["id"];
    var user = getUrlVars(video_url)["user"];
    console.log("id",id);
    console.log("user",user);
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

    $('button').on('click', fav);
    function fav(e) {
        $(this).find('.fa').toggleClass('fa-star-o fa-star');
    }

    $(document).ready(function(){
       $( "p" ).click(function() {
        var text = $( this ).text();
        console.log("TEXT____",text)
        $( "textarea" ).val( text );
      });
    });

    // var $currVideo =videourl;
    // console.log("old",$currVideo)
    var $currVideo ="/review-video.html?id=" +id +"&user="+ user  

    console.log("old",$currVideo);

   
    // alert(typeof(videoData.events))
    var CurrVdeoIndex=findIndexInData(videoData.events,'url',$currVideo);
    //var CurrVdeoIndex= videoData.events.indexOf($currVideo);

   alert(CurrVdeoIndex);

    $( "#nextBtn" ).click(function() {
      console.log("currVideoIndex",CurrVdeoIndex+1);
      console.log(videoData.events[CurrVdeoIndex+1].url)
     var newUrl= videoData.events[CurrVdeoIndex+1].url
      $("#video").html(+
          newUrl+
          "&token=" +
          localStorage.getItem("session_id") +
          ' type="video/mp4">'
      );
      var vid = document.getElementById("video");
      vid.play();
    });

    
    $( "#previousBtn" ).click(function() {
      console.log("peviousVideoIndex",CurrVdeoIndex-1);
      console.log(videoData.events[CurrVdeoIndex-1].url)
     var newUrl= videoData.events[CurrVdeoIndex-1].url
      $("#video").html(
        "<source src=" +
          newUrl+
          "&token=" +
          localStorage.getItem("session_id") +
          ' type="video/mp4">'
      );
      var vid = document.getElementById("video");
      vid.play();
    });
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

var videoData;
var videourl;
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
      var msg= JSON.parse(response);
      videoData =JSON.parse(response);
      console.log("videos uploaded",videoData)
      videourl = videoData.events[0].url
      console.log("videos urlllllllllllll",videourl)

      console.log("Activity List...",msg.events.length);

      if(msg.events.length==0){
          document.getElementById("eventData").style.height = "auto";
          document.getElementById("activity-log").style.padding = "0px";

        $("#activity-log.chat").html(
            '<div class="noActivityDiv"><h3>No Activities in List</h3> </div>'
          );
      }
      callback(msg);
    })
    .fail(function(err) {
      alert("Got err");
      console.log(err);
    });
   
}
function findIndexInData(data, property, value) {
  for(var i = 0, l = data.length ; i < l ; i++) {
    if(data[i][property] === value) {
      return i;
    }
  }
  return -1;
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
          // "</p>" +"<p class='msgText'>"+ activity.msg +"</p>"+
          "<div style='width:80%'>" + activity.msg +" <span class='alignTag'><a href='#' class='view-gps customLinkBtn' lat=" +
          activity.lat +
          " " +
          "lng=" +
          activity.lng +
          "> " +
          activity.type +'<span><i class="fa fa-angle-double-right"></i></span>'+
          "</a>" +
         
          "</span></div>" +
          ' <div class="icon"><img src="img/wifi-signal.svg" alt=""/></div>' +
          "</div> </li>"
      );
      // $("#activity-log").append(
      //   '<li class="other"><div class="msg"> <p class="dateClass">' +
      //     formatDate(new Date(activity.created_at * 1000)) +
      //     "</p>" +"<p class='msgText'>"+ activity.msg +"</p>"+
      //     "<div style='width:80%'><span class='alignTag'><a href='#' class='view-gps customLinkBtn' lat=" +
      //     activity.lat +
      //     " " +
      //     "lng=" +
      //     activity.lng +
      //     "> " +
      //     activity.type +'<span><i class="fa fa-angle-double-right"></i></span>'+
      //     "</a>" +
         
      //     "</span></div>" +
      //     '<div class="icon"><img src="images/place.png" alt=""/></div>' +
      //     "</div> </li>"
      // );
    }
    // if (activity.type == "video") {
    //   $("#activity-log").append(
    //     '<li class="other dark"><div class="msg"> <p class="dateClass">' +
    //       formatDate(new Date(activity.created_at * 1000)) +
    //       "</p>" +
    //       "<div style='width:80%'><i class='fa fa-star iconStar'></i><span class='alignTag'><a url=" +
    //       activity.url +
    //       " href='#' class='view-video customLinkBtn'>" +
    //       activity.type +'<span><i class="fa fa-angle-double-right"></i></span>'+
    //       "</a></span></div>" +
    //       '<div class="icon"><div class="borderDiv"><img src="images/Play_Video.png" alt=""/></div></div>' +
    //       "</div> </li>"
    //     //   <img src="images/play_icon.png" alt=""/>
    //   );
    // }
    if (activity.type == "video") {
      $("#activity-log").append(
        '<li class="other dark"><div class="msg"> <p class="dateClass">' +
          formatDate(new Date(activity.created_at * 1000)) +
          "</p>" +
          "<div style='width:80%'><i class='fa fa-star iconStar'></i><span class='alignTag'><a url=" +
          activity.url +
          " href='#' class='view-video customLinkBtn'>" +
          activity.type +'<span><i class="fa fa-angle-double-right"></i></span>'+
          "</a></span></div>" +
          '<div class="icon"><div class="borderDiv"><img src="img/play-button_black.svg" alt=""/></div></div>' +
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
