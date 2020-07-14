function init() {
    list_patients(function(response) {
        display_patients(response.patients);
    })
    $(document).ready(function(){
    $("#myInput").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $(".clientsList .col-2").filter(function() {
            $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
    });
    });
}

function list_patients(callback) {
    var settings = {
      "async": true,
      "crossDomain": true,
       "headers": {
       "Authorization": "Token " + localStorage.getItem("session_id"),
      },
      "url": SERVER + "/api/list-patients/",
      "method": "GET",
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
    }
    $.ajax(settings).done(function (response) {
        console.log(response)
        callback(JSON.parse(response))
    }).fail(function(err) {
        console.log(err)
    });
}

function display_patients(patients) {
    /*$(".select-patient").append(
        "<option value=''>All Patients</option>"
    )

    for(var patient of patients) {
        $(".select-patient").append(
            "<option value='" + patient.email + "'>" +
                patient.name + "(" + patient.email +  ")" +
            "</option>"
        )
    }*/
    // for(var patient of patients) {
    //     $(".clientsList").append(
    //         '<div class="col-2">'+
    //             '<div class="card-header font-weight-bold clientInfo-cardHeader">'+
    //                 '<div class="clientInfo">'+
    //                     '<div class="clinetProfileImage">'+
    //                         '<i class="material-icons align-middle mr-2">person</i>'+
    //                     '</div>'+
    //                     '<div class="clientName"><span>'+patient.name+'</span></div>'+
    //                 '</div>'+
    //             '</div>'+
    //         '</div>'
    //     )
    // }


    for(var patient of patients) {
        $(".clientsList").append(

            `<div class="col-md-3 col-lg-2 col-sm-3 col-6 my-2">

                <div class="card">
                    <div class="text-center bg-secondary d-flex justify-content-center align-items-center clinetProfileImage">
                        <i style="font-size: 100px;" class="material-icons">person</i>
                    </div>
                    <div class="card-body">
                        <h6 class="card-subtitle">${patient.name}</h6>
                    </div>
                </div>
            </div>`
        )
    }


    //var classes = ['bg-1', 'bg-2', 'bg-3', 'bg-4', 'bg-5', 'bg-6'];
    var classes = ['bg-primary', 'bg-secondary', 'bg-success', 'bg-danger', 'bg-warning', 'bg-info'];
    var len = $(".clinetProfileImage").length;
    $(".clinetProfileImage").each(function(index){
        var random = Math.floor( Math.random() * len ) + 1;
        random = (Math.random() * len--) > 6 ? random + 1 : random;
        //alert(random);
        $(this).addClass(classes[random]);
    });
}

window.addEventListener("DOMContentLoaded", init, false);