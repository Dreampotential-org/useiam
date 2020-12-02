function init() {
  init_events();
  isSignIn();
}

function init_events() {
  $("body").delegate(".video-body", "click", function () {
    $("#gps-tag").hide();
    $("#video-tag").show();

    var ele = $(this).find("source");
    console.log(ele);
    var video_url = $(ele).attr("src");
    getVideoInfo(video_url);
  });

  $("#send_feedback").on("click", function (e) {
    var id = throughUrl()["id"];
    var user = throughUrl()["user"];

    if ($("#message").val().trim() != "") {
      $.ajax({
        type: "POST",
        url:
          SERVER +
          "/api/send-feedback/?token=" +
          localStorage.getItem("session_id") +
          "&user=" +
          user +
          "&id=" +
          id,
        data: { message: $("#message").val() },
      })
        .done(function (resp) {
          console.log(resp);

          if (resp.status == "okay") {
            get_video_info(id, user, function() {});

            swal({
              title: "Feedback Send",
              text: "Your feedback send successfully",
              icon: "success",
            });
          } else {
            swal({
              title: "Please try again later.",
              icon: "error",
            });
          }

          $("#message").val("");
        })
        .fail(function (err) {
          console.log(err);
          swal({
            title: "Something wrong",
            icon: "error",
          });
        });
    } else {
      swal({
        text: "Comment field should not be empty.",
        icon: "error",
      });
    }
  });

}

function isSignIn() {
    var id = throughUrl()['id'];
    var user = throughUrl()['user'];
    var isLoggedIn = localStorage.getItem("session_id");

    console.log(id)
    console.log(user)

  if(id == undefined && user == undefined){
    activityPage("");
  } else if (isLoggedIn != null && isLoggedIn != "") {
    videoPage();
  }
  else {
    loggedInPage();
  }

  headerButtons();
  tabChange();
  signup_monitor();
  login_monitor();
  createAccount();
}

// Get id and user through url
function throughUrl() {
  var vars = {};
  var parts = window.location.href.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (
    m,
    key,
    value
  ) {
    vars[key] = value;
  });
  return vars;
}

//Get id and user from storage
function getUrlVars(url) {
  var video_url = "";

  if (url == undefined) {
    var ele = $("#video").find("source");
    console.log(ele);
    video_url = $(ele).attr("src");
  } else {
    video_url = url;
  }

  var vars = {};
  var parts = video_url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (
    m,
    key,
    value
  ) {
    vars[key] = value;
  });
  return vars;
}

function login_monitor() {
  // create their account
  $("#login").on("click", function (e) {
    login_api(
      $("#signin_email").val().trim(),
      $("#signin_password").val().trim(),
      function () {
        // // swal({
        // //     'title': 'Login Success!',
        // //     'text': 'You will now be able to view video links from email',
        // //     'icon': 'success',
        // // });

        // if (localStorage.getItem("redirect_url")) {
        //     var redirect = localStorage.getItem("redirect_url")
        //     localStorage.removeItem("redirect_url")
        //     window.location = redirect
        // } else {
        //     window.location = './review.html'
        // }

        isSignIn();
      }
    );
  });
}

function login_api(email, password, callback) {
  var form = new FormData();
  form.append("username", email);
  form.append("password", password);
  var settings = {
    async: true,
    crossDomain: true,
    url: SERVER + "/api/api-token-auth/",
    method: "POST",
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data",
    data: form,
  };

  $.ajax(settings)
    .done(function (response) {
      localStorage.setItem("session_id", JSON.parse(response).token);
      console.log("user logged in");
      callback();
    })
    .fail(function (err) {
      swal({
        title: "Error",
        text: "Invalid email or password",
        icon: "error",
      });
    });
}

function signup_monitor() {
  $("#signup").on("click", function (e) {
    var invalid = false;
    if ($("#signup_name").val().trim().length == 0) {
      $("#signup_name").addClass("invalid");
      invalid = true;
    }

    if ($("#signup_email").val().trim().length != 0) {
      if (!validateEmail($("#signup_email").val().trim())) {
        $("#signup_email").addClass("invalid");
        invalid = true;
      }
    } else {
      $("#signup_email").addClass("invalid");
      invalid = true;
    }

    if ($("#signup_password").val().trim().length == 0) {
      $("#signup_password").addClass("invalid");
      invalid = true;
    }

    if (invalid == true) {
      swal({
        title: "Name or password field cannot be empty",
        text: "",
        icon: "error",
      });
      return;
    }
    if ($("#signup").hasClass("running")) {
      return;
    }
    // create their account
    $("#signup").addClass("running");
    signup_api({
      name: $("#signup_name").val().trim(),
      email: $("#signup_email").val().trim(),
      password: $("#signup_password").val().trim(),
    });
  });
}

function signup_api(params) {
  if (params.days_sober == null) {
    params.days_sober = "0";
  }
  var form = new FormData();
  form.append("name", params.name);
  form.append("email", params.email);
  form.append("days_sober", params.days_sober);
  form.append("password", params.password);
  //form.append("notify_email", 'aaronorosen@gmail.com');

  var settings = {
    async: true,
    crossDomain: true,
    url: SERVER + "/api/create-user/",
    method: "POST",
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data",
    data: form,
  };

  $.ajax(settings)
    .done(function (response) {
      $("#signup").removeClass("running");
      var msg = JSON.parse(response).message;
      if (msg && "User already exists" == msg) {
        swal({
          title: "Email already exists",
          text: "",
          icon: "error",
        });
        return;
      }
      localStorage.setItem("session_id", JSON.parse(response).token);
      console.log("user logged in");
      //after successful login or signup show dashboard contents

      isSignIn();

      swal({
        title: "Account Created",
        text: "You will now be able to view monitor events via email",
        icon: "success",
      });
    })
    .fail(function (err) {
      $("#signup").removeClass("running");
      console.log(err);
      alert(err);
      swal({
        title: "Error",
        text: "Invalid email or password",
        icon: "error",
      });
    });
}

function validateEmail(email) {
  var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

function createAccount() {
  $("#create-account").on("click", function (e) {
    signUpPage();
  });

  $("#already-account").on("click", function (e) {
    loggedInPage();
  });

  $("#user-interface").on("click", function (e) {
    window.location = "index.html";
  });
}

function headerButtons() {
  $("#notification-btn").on("click", function (e) {
    $(".bmd-drawer-f-l").removeClass("bmd-drawer-in");

    videoPause();
    activityPage("");
  });

  $("#logout-btn").on("click", function (e) {
    videoPause();
    localStorage.removeItem("session_id");
    loggedInPage();
  });
}

function videoPause() {
  $("#video").trigger("pause");
}

function isActive(ele) {
  if ($("#menu-ul").children("a").hasClass("active")) {
    $("#menu-ul").children("a").removeClass("active");
    $(ele).addClass("active");
  }
}

function loggedInPage() {
  $("#custom-header").hide();
  $("#signin-div").show();
  $("#signup-div").hide();
  $("#video-div").hide();
  $("#client-div").hide();
  $("#activity-div").hide();
  //$("#dw-s1").hide();
}

function signUpPage() {
  $("#custom-header").hide();
  $("#signin-div").hide();
  $("#signup-div").show();
  $("#video-div").hide();
  $("#client-div").hide();
  $("#activity-div").hide();
}

function videoPage() {
  $("#custom-header").show();
  $("#signin-div").hide();
  $("#signup-div").hide();
  $("#video-div").show();
  $("#client-div").hide();
  $("#activity-div").hide();

  var id = throughUrl()["id"];
  var user = throughUrl()["user"];


  get_video_info(id, user, function (video_info) {
    if (video_info.type == "video") {
      getVideoInfo(video_info.url);
      load_video();
    } else if (video_info.type == "gps") {
      load_gps(video_info.lat, video_info.lng, video_info.msg);
    }
    get_activity(video_info, function (results) {
      console.log(results);
      display_side_activity_log(results);
    });
  });

}

function clientPage() {
  $("#myInput").val("");

  $("#custom-header").show();
  $("#signin-div").hide();
  $("#signup-div").hide();
  $("#video-div").hide();
  $("#client-div").show();
  $("#activity-div").hide();

  list_patients(function (response) {
    display_patients(response.patients);
  });

  $(document).ready(function () {
    $("#myInput").on("keyup", function () {
      var value = $(this).val().toLowerCase();
      $(".clientsList .my-2").filter(function () {
        $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1);
      });
    });

    $(".clientsList").on("click", ".card", function () {
      console.log("TEST");

      console.log($(this).find(".card-body").children(".patient-email").text());

      isActive("#activity-tab");
      activityPage(
        $(this).find(".card-body").children(".patient-email").text()
      );
    });
  });
}

var NEXT_PAGE_URL = null;
var PREV_PAGE_URL = null;

function activityPage(value) {
  $("#custom-header").show();
  $("#signin-div").hide();
  $("#signup-div").hide();
  $("#video-div").hide();
  $("#client-div").hide();
  $("#activity-div").show();

  list_patients(function (response) {
    display_activity_patients(response.patients, value);
  });

  list_patient_events(value, "", function (response) {
    display_events(response);
  });

  $("body").delegate(".select-patient", "change", function (e) {
    list_patient_events($(this).val(), "", function (response) {
      display_events(response);
    });
  });

  $("body").delegate(".next", "click", function (e) {
    if (NEXT_PAGE_URL == null) {
      alert("No more pages");
      return;
    }
    api_list_patient_events(NEXT_PAGE_URL, function (response) {
      console.log("ERE");
      console.log(response);
      display_events(response);
    });
  });

  $("body").delegate(".prev", "click", function (e) {
    if (PREV_PAGE_URL == null) {
      alert("No more pages");
      return;
    }

    api_list_patient_events(PREV_PAGE_URL, function (response) {
      display_events(response);
    });
  });
}

function invitePage() {
  $("#inviteModal").modal("show");

  $("#invite-btn").on("click", function (e) {
    // Call the invitation api here
  });
}

function tabChange() {
  $("#home-tab").on("click", function (e) {
    isActive(this);
    videoPage();
  });

  $("#client-tab").on("click", function (e) {
    isActive(this);

    videoPause();
    clientPage();
  });

  $("#activity-tab").on("click", function (e) {
    isActive(this);
    videoPause();
    activityPage("");
  });

  $("#invite-tab").on("click", function (e) {
    isActive(this);
    videoPause();
    invitePage();
  });

  $("#manage-tab").on("click", function (e) {
    isActive(this);
    videoPause();
  });
}

function list_patients(callback) {
  var settings = {
    async: true,
    crossDomain: true,
    headers: {
      Authorization: "Token " + localStorage.getItem("session_id"),
    },
    url: SERVER + "/api/list-patients/",
    method: "GET",
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data",
  };
  $.ajax(settings)
    .done(function (response) {
      console.log(response);
      callback(JSON.parse(response));
    })
    .fail(function (err) {
      console.log(err);
    });
}

function display_patients(patients) {
  //$(".clientsList").remove();

  var html = "";
  var g_count = 0;
  var v_count = 0;

  for (var patient of patients) {
    //$(".clientsList").append(

    for (var event of patient.events) {
      if (event.type == "gps") {
        g_count++;
      } else {
        v_count++;
      }
    }

    html += `<div class="col-md-3 col-lg-2 col-sm-3 col-6 my-2">

                <div class="card">
                    <div class="text-center bg-secondary d-flex justify-content-center align-items-center clinetProfileImage">
                        <i style="font-size: 100px;" class="material-icons">person</i>
                    </div>
                    <div class="card-body">
                        <h6 class="card-subtitle">${patient.name}</h6>
                        <p class="m-0 mt-1 text-primary"><span class="mr-2"><i class="material-icons align-middle mr-1">room</i>${g_count} </span> <span class="mr-2"><i class="material-icons align-middle mr-1">play_circle_filled</i>${v_count}</span></p>
                        <p class="d-none patient-email">${patient.email}</p>
                    </div>
                </div>
            </div>`;
    //)
  }

  $(".clientsList").html(html);

  //var classes = ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'bg-5', 'bg-6'];
  var classes = [
    "bg-primary",
    "bg-secondary",
    "bg-success",
    "bg-danger",
    "bg-warning",
    "bg-info",
  ];
  var len = $(".clinetProfileImage").length;
  $(".clinetProfileImage").each(function (index) {
    var random = Math.floor(Math.random() * len) + 1;
    random = Math.random() * len-- > 6 ? random + 1 : random;
    //alert(random);
    $(this).addClass(classes[random]);
  });
}

function display_events(response) {
  var html = "";

  if (response.count == 0) {
    html += `<div class="col-md-12 my-2 text-center">No records found.</div>`;
  }

  var gps_views = [];
  for (var e of response.results) {
    var i = response.results.indexOf(e);

    html += `<div class="col-md-3 col-lg-2 col-sm-3 col-6 my-2">

                    <div class="card">
                        <div class="text-center bg-secondary d-flex justify-content-center align-items-center custom-img">
                            <i style="font-size: 100px;" class="material-icons">person</i>
                        </div>
                        <div class="card-body">
                            <h6 class="card-subtitle">${e.name} `;

    if (e.type == "gps") {
      html +=
        // `<a target="_blank" href="https://www.google.com/maps/place/${e.lat},${e.lng}"><i class="material-icons align-middle">room</i></a>`
        `<a href="javascript:void(0);" onclick="openMap(${e.lat},${e.lng})"><i class="material-icons align-middle">room</i></a>`;
      gps_views.push(e);
    }

    if (e.type == "video") {
      html += `<a href="javascript:void(0);" id="myBtn" type="button" aria-pressed="true" onclick="openModal(${i},'${
        e.url
      }')"><i class="material-icons align-middle">play_circle_filled</i></a>
                <div id="myModal${i}" class="modal">
                <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content"><div class="p-2"><p  onclick="closeModal(${i})" class="close" id="closeModal">&times;</p></div><br/>
                <video controls="" name="media"  class="video">
                    <source src="${SERVER}${e.url}&token=${localStorage.getItem(
        "session_id"
      )}" type="video/mp4">
                </video>
                <div class="card m-2 rounded-0">
                    <div class="card-body">
                        <h6 class="card-subtitle">Comments</h6>
                        <!--<div class="form-group">
                            <label for="message" class="bmd-label-floating px-2">Add Monitor Comment</label>
                            <textarea class="form-control border rounded px-2" id="message" rows="4"></textarea>
                        </div>

                        
                        <div class="text-right">
                            <button id="send_feedback" class="btn btn-primary active" role="button" aria-pressed="true">Comment</button>
                        </div>-->
                        <div class="feedback_received"></div></div></div>
                    
                    
                
                
                </div></div></div>`;
    }

    html += `</h6></div></div></div>`;
  }

  $(".events").html(html);
  for (var e of gps_views) {
    //init_street_view(e)
  }

  var classes = [
    "bg-primary",
    "bg-secondary",
    "bg-success",
    "bg-danger",
    "bg-warning",
    "bg-info",
  ];
  var len = $(".custom-img").length;
  $(".custom-img").each(function (index) {
    var random = Math.floor(Math.random() * len) + 1;
    random = Math.random() * len-- > 6 ? random + 1 : random;
    //alert(random);
    $(this).addClass(classes[random]);
  });
}

function openModal(ind, url) {
  console.log("In  myFunction......", ind);

  var modal = document.getElementById("myModal" + ind);
  console.log(modal);

  var btn = document.getElementById("myBtn");
  console.log(btn);

  modal.style.display = "block";
  //$('#myModal'+ind).modal('show');

  get_video_info(getUrlVars(url)["id"], getUrlVars(url)["user"], function (
    data
  ) {});
}

function closeModal(ind) {
  $("#myModal" + ind)
    .find("video")
    .trigger("pause");
  document.getElementById("myModal" + ind).style.display = "none";
}

function openMap(lat, lng) {
  var geocoder = new google.maps.Geocoder();

  var mapProp = {
    center: new google.maps.LatLng(lat, lng),
    zoom: 10,
  };

  var map = new google.maps.Map(document.getElementById("googleMap"), mapProp);

  geocoder.geocode(
    { location: { lat: parseFloat(lat), lng: parseFloat(lng) } },
    function (results, status) {
      if (status === "OK") {
        if (results[0]) {
          name = results[0].formatted_address;
          //alert(name);
          var marker = new google.maps.Marker({
            position: new google.maps.LatLng(lat, lng),
            map: map,
            icon: "images/map_icon.png",
          });
          var infowindow = new google.maps.InfoWindow({
            content: name,
          });
          infowindow.setContent(results[0].formatted_address);
          infowindow.open(map, marker);
          marker.addListener("click", function () {
            infowindow.open(map, marker);
          });
        } else {
          window.alert("No results found");
        }
      } else {
        window.alert("Geocoder failed due to: " + status);
      }
    }
  );

  // mapModal.style.display = "block";
  $("#mapModal").modal("show");
}

function display_activity_patients(patients, value) {
  // $(".select-patient").append(
  //     "<option text-primary' value=''>All Patients</option>"
  // )

  // for(var patient of patients) {
  //     $(".select-patient").append(
  //         "<option value='" + patient.email + "'>" +
  //             patient.name + "(" + patient.email +  ")" +
  //         "</option>"
  //     )
  // }

  var html = "<option text-primary' value=''>All Patients</option>";

  for (var patient of patients) {
    html +=
      "<option value='" +
      patient.email +
      "'>" +
      patient.name +
      "(" +
      patient.email +
      ")" +
      "</option>";
  }

  $(".select-patient").html(html);

  $(".select-patient").val(value);
}

function list_patient_events(patient_email, filter_type, callback) {
  if (!patient_email) {
    patient_email = "";
  } else {
    patient_email = encodeURIComponent(patient_email);
  }
  var url = SERVER + "/api/list-patient-events/?email=" + patient_email;

  if (filter_type == "gps") {
    url += "&filter_type=gps";
  } else if (filter_type == "video") {
    url += "&filter_type=video";
  }
  api_list_patient_events(url, callback);
}

function api_list_patient_events(url, callback) {
  var settings = {
    async: true,
    crossDomain: true,
    headers: {
      Authorization: "Token " + localStorage.getItem("session_id"),
    },
    url: url,
    method: "GET",
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data",
  };
  $.ajax(settings)
    .done(function (response) {
      var r = JSON.parse(response);

      console.log(r);
      $(".count").text(r.count);
      if (r.next) {
        NEXT_PAGE_URL = SERVER + "/api" + r.next.split("/api")[1];
        $(".next").show();
      } else {
        NEXT_PAGE_URL = null;
        $(".next").hide();
      }
      if (r.previous) {
        PREV_PAGE_URL = SERVER + "/api" + r.previous.split("/api")[1];
        $(".prev").show();
      } else {
        PREV_PAGE_URL = null;
        $(".prev").hide();
      }
      callback(r);
    })
    .fail(function (err) {
      console.log(err);
      localStorage.clear();
      //window.location.reload()
    });
}

function get_list_patient() {}

function get_activity(video_info, callback) {
  var settings = {
    async: true,
    crossDomain: true,
    headers: {
      Authorization: "Token " + localStorage.getItem("session_id"),
    },
    url:
      SERVER + "/api/list-patient-events-v2/?email=" + encodeURIComponent(
            video_info.owner_email),
    method: "GET",
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data",
  };

  $.ajax(settings)
    .done(function (response) {
      var msg = JSON.parse(response);
      videoData = JSON.parse(response);
      var allData = JSON.parse(response);
      console.log(allData);
      callback(msg);
    })
    .fail(function (err) {
      alert("Got err");
      console.log(err);
    });
}

function display_side_activity_log(resp) {
  var html = "";
  var c=0;

  for (var activity of resp.events) {
    if (activity.type == "video") {
      html +=
        '<div class="card mt-2"id="' +
        activity.id +
        '"> ' +
        '<div class="card-header font-weight-bold">Created at : ' +
        formatDate(new Date(activity.created_at * 1000)) +
        "</div>" +
        '<div class="card-body video-body">' +
        '<video class="custom_video" id="videoPanel' +
        c++ +
        '" width="100%" height="200px" >' +
        '<div class="list-video" src=' +
            getUrl(activity.url) +
        ">Play Video</div>" +
        //' type="video/mp4"></video>' +
        '<i class="material-icons playBtn">play_arrow</i></div>' +
        "</div>";
    } else {
      // GPS
      html += `<div class="card mt-2"id="${activity.id}">
                <div class="card-header font-weight-bold">Created at : ${formatDate(
                  new Date(activity.created_at * 1000)
                )}</div>
                <div class="card-body gps-body"
                    onclick="getGpsInfo(${activity.id},'${activity.email}')" >
                    GPS - Checkin<br>${activity.msg}
                </div>
                </div>`;
    }
  }

  $("#video-list").html(html);
}

function getGpsInfo(id, user) {
    // set ID / user in url
    window.history.pushState(
        '', 'USEIAM',
        '/review-video.html?id=' + id + '&user=' + user + '');

  get_video_info(id, user, function (activity) {
    load_gps(activity.lat, activity.lng, activity.msg);
  });
}

function getVideoInfo(url) {
    var vars = {};
    var parts = url.replace(
        /[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
        vars[key] = value;
    });

    var id = vars["id"];
    var user = vars["user"];
    window.history.pushState(
        '', 'USEIAM',
        '/review-video.html?id=' + id + '&user=' + user + '');

    get_video_info(id, user, function (activity) {
        load_video(id, user);
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

function getUrl(videoUrl) {
  var vars = {};
  var parts = videoUrl.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (
    m,
    key,
    value
  ) {
    vars[key] = value;
  });
  var id = vars["id"];
  var user = vars["user"];
  console.log("id", id);
  console.log("user", user);
  var vidSrc =
    SERVER +
    "/api/review-video/?id=" +
    id +
    "&user=" +
    user +
    "&token=" +
    localStorage.getItem("session_id");
  console.log(vidSrc);
  return vidSrc;
}

function get_video_info(id, user, callback) {
  $.get(
    SERVER +
      "/api/get-video-info/?token=" +
      localStorage.getItem("session_id") +
      "&user=" +
      user +
      "&id=" +
      id,
    function (res) {
      console.log(res);
      if ("status" in res && res.status == "error") {
        swal({
          title: "Access Denied",
          text:
            "The video was not sent to the email address " +
            "you are logged in with.",
          icon: "error",
        });
        return;
      }
      $("#patient_name").text(res.owner_name);
      $("#created_at").text(formatDate(new Date(res.created_at * 1000)));

      var html = "";

      if (res.feedback.length == 0) {
        html +=
          '<div class="d-flex mt-3">' +
          '<div class="ml-3 border-bottom border-light">' +
          '<p class="font-weight-bold mb-0">No comments found!</p>' +
          "</div>" +
          "</div>";
        //)
      } else {
        for (var message of res.feedback.reverse()) {
          html +=
            '<div class="d-flex mt-3">' +
            '<img src="./img/logoReviewVideo.png" class="rounded-circle comment-img" alt="...">' +
            '<div class="ml-3 border-bottom border-light">' +
            '<p class="font-weight-bold mb-0">' +
            message.user +
            "</p>" +
            '<p class="font-weight-normal">' +
            message.message +
            "</p>" +
            "</div>" +
            "</div>";
          //)
        }
      }

      $(".feedback_received").html(html);
      callback(res);
    }
  );
}

function load_video(id, user) {

  $(".client_gps").hide()
  var newsrc =
    SERVER +
    "/api/review-video/?id=" +
    id +
    "&user=" +
    user +
    "&token=" +
    localStorage.getItem("session_id");

  var video = document.getElementById("video");
  var source = document.createElement("source");

  if (video.childNodes.length > 0) {
    video.removeChild(video.childNodes[0]);
  }

  video.appendChild(source);

  source.setAttribute("src", newsrc);

  video.load();
}

function load_gps(lat, lng, msg) {
  $(".client_gps").show()
  $("#gps_msg").text(msg)
  videoPause();
  $("#video-tag").hide();
  $("#gps-tag").show();
  //console.log(gps_info)
  $("#gps-tag").html(
    "<div id='gps-view' style='width:100%;height:500px;'></div>"
  );
  var spot = {
    lat: parseFloat(lat),
    lng: parseFloat(lng),
  };
  var name = "";
  var latlng = spot;
  var geocoder = new google.maps.Geocoder();

  var panorama = new google.maps.Map(document.getElementById("gps-view"), {
    center: { lat: spot.lat, lng: spot.lng },
    zoom: 18,
  });
  geocoder.geocode({ location: latlng }, function (results, status) {
    if (status === "OK") {
      if (results[0]) {
        name = results[0].formatted_address;
        //alert(name);
        var marker = new google.maps.Marker({
          position: spot,
          map: panorama,
          icon: "images/map_icon.png",
        });
        var infowindow = new google.maps.InfoWindow({
          content: name,
        });
        infowindow.setContent(results[0].formatted_address);
        infowindow.open(panorama, marker);
        marker.addListener("click", function () {
          infowindow.open(panorama, marker);
        });
      } else {
        window.alert("No results found");
      }
    } else {
      window.alert("Geocoder failed due to: " + status);
    }
  });
}

window.addEventListener("DOMContentLoaded", init, false);
