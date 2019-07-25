function init_video_event() {
    $(".close").on('click', function(e) {
        closeAllModals();
    });

    $('.btnVideo').on('click',function(e){
        //clicking back btn takes you to dashboard
        // showBackButton('dashboard');
        // showATab('takeVideo');
        $("#videoInfo").addClass("is-visible")
    });

    $("#videoInfo .btnOk").on('click', function(e) {
        alert("Start take video")
        var captureSuccess = function(mediaFiles) {
            var i, path, len;
            for (i = 0, len = mediaFiles.length; i < len; i += 1) {
                path = mediaFiles[i].fullPath;
                // do something interesting with the file
                api_video_checkin(mediaFiles[i]);

            }
        };

        // capture error callback
        var captureError = function(error) {
            alert(
                'Error code: ' + error.code, null, 'Capture Error');
        };

        // start video capture
        navigator.device.capture.captureVideo(
            captureSuccess, captureError, {limit:1});
    });
}


function api_video_checkin(mediaFile) {
    function win(r) {
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
        alert("Finished!");
    }
    function fail(error) {
       console.log(error);
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
        alert("An error has occurred: Code = " + error.code);
    }
    var uri = encodeURI(SERVER + "/api/video-upload/");
    var options = new FileUploadOptions();
    options.fileKey = "video";
    options.fileName = mediaFile.name;
    options.mimeType = mediaFile.type;
    options.contentType = "multipart/form-data";

    options.httpMethod = "POST";
    options.chunkedMode = false;
    var headers = {
        'Authorization': "Token " + localStorage.getItem("session_id")
    };
    options.headers = headers;
/* Developer */
    var type = window.PERSISTENT;
   var size = 500*1024*1024;//500 MB
   var ft = new FileTransfer();

    window.requestFileSystem(type, size, successCallback, errorCallback);
    function successCallback(fs) {
       fs.root.getFile("DCIM/Camera/"+mediaFile.name,{ create: false, exclusive: false }, function(fileEntry) {
          fileEntry.file(function(file) {
             ft.onprogress = function(progressEvent) {
                if (progressEvent.lengthComputable) {
                    // do not open this comment because we donot have loadingstatus
                    // loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
                    console.log(progressEvent.loaded / progressEvent.total);
                } else {
                    // loadingStatus.increment();
                }
            };
            ft.upload(mediaFile.fullPath, uri, win, fail, options);
          }, errorCallbackFileEntry);
       }, errorCallbackGetFile);
    }
 
    function errorCallbackGetFile(error) {
        console.log("errorCallbackGetFile ",error);
       alert("ERROR: " + error.code)
    }

    function errorCallbackFileEntry(error) {
        console.log("errorCallbackFileEntry ",error);
       alert("ERROR: " + error.code)
    }
    function errorCallback(error) {
        console.log("errorCallback ",error);
       alert("ERROR: " + error.code)
    }

/* Developer End */



   
}
