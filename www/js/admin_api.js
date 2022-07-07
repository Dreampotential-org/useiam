function init() {

    $("#video-tag").hide();
    $("#googleMapsDiv").hide();
    $("#selectedPatient").hide();

    if(!localStorage.getItem('session_id')){
      location.href ='login.html'
    }

    list_patients(function (response) {
      
      // display_activity_patients(response.patients);
      displayPatientsDropDown(response.patients);
    });

    get_all_activity(function(events) {
        console.log(events)
        for(var e of events['results']) {
            console.log(e);
        }
        // populate screen....
    }) 

   
    $("#send_feedback").on("click", function (e) {
      
      
    });

    $("#deleteSelectedPatient").on("click", function (e) {
      var selectedPatient= document.getElementById('selectedPatient');
      if (selectedPatient) {
        selectedPatient.getElementsByTagName('span')[0].innerText = '';
        $("#selectedPatient").hide();
      }
      get_all_activity(function(events) {
      });
    });
    

    $("#send_feedback").on("click", function (e) {
      var url = URL
      var id = getUrlVars(url)["id"]
      var user = getUrlVars(url)["user"];
  
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
                title: "Feedback Sent",
                text: "Your feedback sent successfully",
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
      console.log('123123')
      callback(JSON.parse(response));
    })
    .fail(function (err) {
      console.log(err);
    });
}



function display_activity_patients(patients, value) {
  
  $(".abcded").on("click", function(e){
    console.log('div clicked')
  })

  var html = "";
  html+= `<div class="accordion accordianClick" id="accordionExample" style="margin:10px">
  <div class="accordion-item">
    <h2 class="accordion-header" id="headingOne">
      <button id="mycustom" class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne" aria-expanded="true" >
        Filter patients
              </button>
    </h2>
   
  </div>
</div>`


  patients.forEach((patient,i)=>{
    html+= `<div id="collapseOne" onclick="playXYZ('${patient.email}','${i}','${patient.name}')" class="accordion-collapse collapse" aria-labelledby="headingOne" data-bs-parent="#accordionExample">
    <div style="padding: 10px;
    border-radius: 5px;
    margin: 10px;
    box-shadow: 2px 2px 1px #9d9c9c;" class="accordion-body">
      <div>
      <p  style="font-weight:600;margin:0">${patient.name }</p>

      <p>${patient.email}</p>
      </div>
    </div>
  </div>`
  })

  // for (var [patient,i] of patients.keys()) {
    // html +=
    //   "<option value='" +
    //   patient.email +
    //   "'>" +
    //   patient.name +
    //   "(" +
    //   patient.email +
    //   ")" +
    //   "</option>";

      
  // }

  $(".select-patient").html(html);

  // $(".select-patient").val(value);
}

function displayPatientsDropDown(patients) {
  var html = "";
  html+= `<div class="searchField">
    <input type="text" placeholder="Search patient" id="myInput" onkeyup="filterFunction()">
    <img src="./img/search.png"/>
  </div>
  <div class="menuItemsContainer">`
  patients.forEach((patient,i)=>{
  html+=
    `<span onclick="playXYZ('${patient.email}','${i}','${patient.name}')">
        <div class="menuItemDiv">
          <p class="m-0 namePtag">${patient.name }</p>
          <p class="m-0 emailPtag">${patient.email}</p>
        </div>
    </span>`;
  });
  html+= `</div>`
  $("#myDropdown").html(html);
}

function get_all_activity(callback) {
  var settings = {
    async: true,
    crossDomain: true,
    headers: {
      Authorization: "Token " + localStorage.getItem("session_id")
    },
    url: SERVER + "/api/list-patient-events/",
    method: "GET",
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data"
  };

  $.ajax(settings).done(function(response) {
      var msg= JSON.parse(response);
      videoData =JSON.parse(response);
      var allData = JSON.parse(response);
      console.log('all data',allData)
    
      NEXT_PAGE_URL = SERVER + "/api" + allData.next.split("/api")[1];
      $(".count").text(allData.count);

      console.log('check',NEXT_PAGE_URL)

      display_table_list(allData.results);

      // comments(allData.results)
      // callback(msg);
    }).fail(function(err) {
      alert("Got err");
      console.log(err);
    });
}

function playXYZ(patient,index,name){
  $(".next").show();
  $(".prev").show();
  
  
  var selectedPatient= document.getElementById('selectedPatient');
  if (selectedPatient) {
    selectedPatient.getElementsByTagName('span')[0].innerText = name;
    $("#selectedPatient").show();
  }
  var abcd= document.getElementById('mycustom');
 
  abcd && abcd.click();
  document.getElementById("myDropdown") && document.getElementById("myDropdown").classList.remove('show');

  var settings = {
    async: true,
    crossDomain: true,
    headers: {
      Authorization: "Token " + localStorage.getItem("session_id")
    },
    url: SERVER + "/api/list-patient-events/?email="+ patient,
    method: "GET",
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data"
  };

  $.ajax(settings).done(function(response) {
      var msg= JSON.parse(response);
      videoData =JSON.parse(response);
      var allData = JSON.parse(response);
      console.log('all data',allData)
    
      NEXT_PAGE_URL = SERVER + "/api" + allData.next?.split("/api")[1];
      $(".count").text(allData.count);

      console.log('check',NEXT_PAGE_URL)
      if(!allData.next){
        $(".next").hide();
        $(".prev").hide();

      }

      display_table_list(allData.results);

      // comments(allData.results)
      // callback(msg);
    }).fail(function(err) {
      alert("Got err");
      console.log(err);
    });
}

function play_video(index,url) {
  // alert('hiii-----'+index+"url"+url);
  URL = url
  console.log('server',SERVER,url,localStorage.getItem('session_id'))
  $("#googleMapsDiv").hide();
  $("#video-tag").show();
  var video = document.getElementById('video-tag');
  video.src = SERVER+url+'&token='+localStorage.getItem("session_id")
  console.log('videi',video)

  get_video_info(getUrlVars(url)["id"], getUrlVars(url)["user"], function (
    data
  ) {});

  // var modal = document.getElementById("myModal" + index);
  // console.log(modal);

  // var btn = document.getElementById("myBtn");
  // console.log(btn);
 
  // modal.style.display = "block";

  // get_video_info(getUrlVars(url)["id"], getUrlVars(url)["user"], function (
  //   data
  // ) {});
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
      // if ("status" in res && res.status == "error") {
      //   swal({
      //     title: "Access Denied",
      //     text:
      //       "The video was not sent to the email address " +
      //       "you are logged in with.",
      //     icon: "error",
      //   });
      //   return;
      // }
      $("#patient_name").text(res.owner_name);
      // $("#created_at").text(formatDate(new Date(res.created_at * 1000)));

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

var NEXT_PAGE_URL = null;

$("body").delegate(".next", "click", function (e) {
  console.log('111')
  if (NEXT_PAGE_URL == null) {
    alert("No more pages");
    return;
  }
  api_list_patient_events(NEXT_PAGE_URL, function (response) {
    console.log("ERE");
    console.log(response);
    display_table_list(response.results);
  });
  
});




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

      console.log('response',r);
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

function openMap(lat, lng) {
  var geocoder = new google.maps.Geocoder();
  var mapProp = {
    center: new google.maps.LatLng(lat, lng),
    zoom: 10,
  };

  $("#video-tag").hide();
  $("#googleMapsDiv").show();
  $(".feedback_received").html('');

  var map = new google.maps.Map(document.getElementById("googleMapsDiv"), mapProp);

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
  // $("#mapModal").modal("show");
}

function display_table_list(patients) {
  var html = "";
  for (var patient of patients) {

    var i = patients.indexOf(patient);

    var created_at=new Date(patient.created_at*1000)
    var date=created_at.getDate();
    var month=created_at.getMonth()+1;
    var year=created_at.getFullYear();


    html += `<tr style="text-align: -webkit-center;">
                <td>${patient.name}</td>
                <td>${month} - ${date} -${year} </td>` ;
                if (patient.type == "gps") {
                  html +=
                    // `<a target="_blank" href="https://www.google.com/maps/place/${e.lat},${e.lng}"><i class="material-icons align-middle">room</i></a>`
                  ` <td class="viewCol">
                      <a href="javascript:void(0);" onclick="openMap(${patient.lat},${patient.lng})"><i class="material-icons align-middle">room</i></a>
                   </td>`
                }
                if(patient.type =="video")
                html+=`
                <td class="viewCol">
                    <i class="material-icons align-middle" style="color: #009688; cursor:pointer; font-size: 30px" id="myBtn" onclick="play_video(${i},'${
                      patient.url
                    }')">play_circle_filled</i>

                    <div id="myModal${i}" class="modal" style="margin-top:30px">
                    <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content"><div class="p-2"><p  onclick="closeModal(${i})" class="close" id="closeModal">&times;</p></div><br/>
                      <video controls="" name="media"  class="video">
                       <source src="${SERVER}${patient.url}&token=${localStorage.getItem("session_id")}" type="video/mp4">
                      </video>
                      
                      <div class="card m-2 rounded-0">
                        <div class="card-body">
                            <div class="feedback_received">
                            </div>
                        </div>
                      </div>
                    </div></div></div>

                </td>
              </tr>
              
            
  
               `;

  }
  
  $(".list").html(html);
  

  html += ` <div>
                  <p>${patient.email}</p>
                  <p>${patient.msg} </p>
              </div>

              `;



}



function comments(patients_comment){
  var html = "";
  for (var patient of patients_comment) {
    html += `<div>
                <div>
                <div style="display:flex">
                    <div>
                    </div>
                    <div>
                      <p>${patient.email}</p>
                      <p>${patient.msg} </p>
                    </div>
                  </div>
                </div>
              </div>`;
  }

  $(".comment").html(html);
}



function display_patients(patients) {

  var g_count = 0;
  var v_count = 0;

  // for (var patient of patients) {
    // for (var event of patient.events) {
    //   if (event.type == "gps") {
    //     g_count++;
    //   } else {
    //     v_count++;
    //   }
    // }
  // }

}


window.addEventListener("DOMContentLoaded", init, false);
