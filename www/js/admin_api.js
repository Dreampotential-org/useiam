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


function display_table_list(patients) {
  var html = "";
  for (var patient of patients) {
    var created_at=new Date(patient.created_at)
    var date=created_at.getDate();
    var month=created_at.getMonth()+1;
    var year=created_at.getFullYear();
    html += `<tr>
                <td>${patient.name}</td>
                <td>${date} - ${month} -${year} </td>
                <td>
                    <i class="material-icons align-middle">play_circle_filled${patient.type}</i>
                </td>
              </tr>
              
            
              <div>
                  <p>${patient.email}</p>
                  <p>${patient.msg} </p>
              </div>

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
                  <img src="../icon.png" alt=img/>
                  <p>${patient.email}</p>
                  <p>${patient.msg} </p>
              </div>`;
  }

  $(".comment").html(html);
}




window.addEventListener("DOMContentLoaded", init, false);
