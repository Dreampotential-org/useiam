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
    

      display_table_list(allData);

      comments(allData)
      // callback(msg);
    }).fail(function(err) {
      alert("Got err");
      console.log(err);
    });
}

function play_video(index,url) {
  // alert('hiii-----'+index+"url"+url);


  var modal = document.getElementById("myModal" + index);
  console.log(modal);

  var btn = document.getElementById("myBtn");
  console.log(btn);

  modal.style.display = "block";
  
  console.log(url["id"], url["user"]);

  
  get_video_info(getUrlVars(url)["id"], getUrlVars(url)["user"], function (
    data
  ) {});
}

function get_video_info(id,user,callback){
  $.get(
    SERVER +
      "/api/review-video?token=" +
      localStorage.getItem("session_id") +
      "&user=" +
      user +
      "&id=" +
      id,
    function (res) {
      console.log(res);

      callback(res);
    }
  );

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

function display_table_list(patients) {
  var html = "";
  for (var patient of patients) {

    var i = patients.indexOf(patient);

    var created_at=new Date(patient.created_at)
    var date=created_at.getDate();
    var month=created_at.getMonth()+1;
    var year=created_at.getFullYear();

    html += `<tr style="text-align: -webkit-center;">
                <td>${patient.name}</td>
                <td>${date} - ${month} -${year} </td>
                <td>
                    <i class="material-icons align-middle" style="color: #009688; cursor:pointer; font-size: 30px" id="myBtn" onclick="play_video(${i},'${
                      patient.url
                    }')">play_circle_filled</i>

                    <div id="myModal${i}" class="modal">
                    <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content"><div class="p-2"><p  onclick="closeModal(${i})" class="close" id="closeModal">&times;</p></div><br/>
                      <video controls="" name="media"  class="video">
                          
                      </video>
                      <div class="card m-2 rounded-0">
                        <div class="card-body">
                            <div class="feedback_received">
                            </div>
                        </div>
                      </div>
                    </div></div></div>

                </td>
              </tr> `;
  }
  
  $(".list").html(html);
  html += ` <div>
                  <p>${patient.email}</p>
                  <p>${patient.msg} </p>
              </div> `;
}

function comments(patients_comment){
  var html = "";
  for (var patient of patients_comment) {



    html += `<div>
                <div>
                <div style="display:flex">
                    <div>
                      <img src="../icon.png" alt=img/>
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


window.addEventListener("DOMContentLoaded", init, false);
