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

    $('#upload_vid_form').submit(function(e) {
        e.preventDefault();
        var data = new FormData();
        data.append("video", GLOBAL_FILE, GLOBAL_FILE.name);
        data.append("source", window.location.host);

        var xhr = new XMLHttpRequest();
        // xhr.withCredentials = true;
        function updateProgress(e) {
            if (e.lengthComputable) {
                console.log(e.loaded)
                console.log(e.loaded+  " / " + e.total)
                $(".swal-title").text(parseInt(e.loaded/e.total*100) + "%")
            }
        }

        xhr.upload.addEventListener('progress', updateProgress, false)
        xhr.addEventListener("readystatechange", function() {
            if (this.readyState === 4) {
                if (this.status == 200) {
                    swal({
                      title: "Good job!",
                      text: "Video submitted successfully!",
                      icon: "success",
                    });
                    $("#overlay_loading").hide()
                    $("#takeavideoModal").removeClass("is-visible")
                } else {
                    swal({
                      title: "Error Try Again",
                      text: "Sorry, there is an error please try again later.",
                      icon: "error",
                    });
                }
            }
        });
        $("#overlay_loading").show()
        xhr.open("POST", SERVER + "/api/video-upload/");
        xhr.setRequestHeader(
            "Authorization", "Token " + localStorage.getItem("session_id"))
        xhr.send(data);
    });

    $('#upload-vid').on('change', function(e) {
        e.preventDefault();
        var file = e.target.files[0];
        GLOBAL_FILE = file;
        $("#upload_vid_form").submit()
        swal({
            title: "0%",
            text: "Video uploading please wait.",
            icon: "info",
            buttons: false,
            closeOnEsc: false,
            closeOnClickOutside: false,
        });
    });
    $("#videoInfo .btnOk").on('click', function(e) {
        e.preventDefault();
        $('#upload-vid').click()

        var captureSuccess = function(mediaFiles) {
            var i, path, len;
            for (i = 0, len = mediaFiles.length; i < len; i += 1) {
                path = mediaFiles[i].fullPath;
                // do something interesting with the file
                if (window.cordova.platformId == "android") {
                    api_video_checkin_android(mediaFiles[i]);
                } else {
                    api_video_checkin(mediaFiles[i])
                }

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


function api_video_checkin_android(mediaFile) {
    swal({
        title: "0%",
        text: "Video uploading please wait.",
        icon: "info",
        buttons: false,
        closeOnEsc: false,
        closeOnClickOutside: false,
    });
    function win(r) {
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
        swal({
          title: "Good job!",
          text: "Video submitted successfully!",
          icon: "success",
        });
    }

    function fail(error) {
        console.log(error);

        swal({
          title: "Error Try Again",
          text: "Sorry, there is an error please try again later.",
          icon: "error",
        });

        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
    }

    var uri = encodeURI(SERVER + "/api/video-upload/");
    var options = new FileUploadOptions();
    options.fileKey = "video";
    options.fileName = mediaFile.name
    options.mimeType = mediaFile.type
    options.contentType = "multipart/form-data";
    options.httpMethod = "POST";
    options.chunkedMode = false;
    var headers = {
        'Authorization': "Token " + localStorage.getItem("session_id")
    };

    options.headers = headers;
    var type = window.PERSISTENT;
   var size = 500*1024*1024;//500 MB
   var ft = new FileTransfer();

    window.requestFileSystem(type, size, successCallback, errorCallback); //Request Access file system permission
    function successCallback(fs) {
       fs.root.getFile("DCIM/Camera/"+mediaFile.name,{ create: false, exclusive: false }, function(fileEntry) {
          fileEntry.file(function(file) {
             ft.onprogress = function(progressEvent) {
                $(".swal-title").text(parseInt(progressEvent.loaded/progressEvent.total*100) + "%");
                   return;
            };
            ft.upload(mediaFile.fullPath, uri, win, fail, options);
          }, errorCallbackFileEntry);
       }, errorCallbackGetFile);
    }
 
    function errorCallbackGetFile(error) {
        console.log("errorCallbackGetFile ",error);
       alert("ERROR: " + error.code)
        swal({
          title: "Error Try Again",
          text: "Sorry, there is an error please try again later.",
          icon: "error",
        });
    }

    function errorCallbackFileEntry(error) {
        console.log("errorCallbackFileEntry ",error);
       alert("ERROR: " + error.code)
        swal({
          title: "Error Try Again",
          text: "Sorry, there is an error please try again later.",
          icon: "error",
        });

    }
    function errorCallback(error) {
        console.log("errorCallback ",error);
       alert("ERROR: " + error.code)
        swal({
          title: "Error Try Again",
          text: "Sorry, there is an error please try again later.",
          icon: "error",
        });

    }
}


function api_video_checkin(mediaFile) {

    swal({
        title: "0%",
        text: "Video uploading please wait.",
        icon: "info",
        buttons: false,
        closeOnEsc: false,
        closeOnClickOutside: false,
    });

    function win(r) {
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
        swal({
          title: "Good job!",
          text: "Video submitted successfully!",
          icon: "success",
        });
    }

    function fail(error) {
        alert("An error has occurred: Code = " + error.code);
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
    }

    var uri = encodeURI(SERVER + "/api/video-upload/");
    var options = new FileUploadOptions();
    options.fileKey = "video";
    options.fileName = mediaFile.name
    options.mimeType = mediaFile.type
    options.contentType = "multipart/form-data";
    options.httpMethod = "POST";
    options.chunkedMode = false

    var headers = {
        'Authorization': "Token " + localStorage.getItem("session_id")
    };

    options.headers = headers;

    var ft = new FileTransfer();
    ft.onprogress = function(progressEvent) {
       $(".swal-title").text(
         parseInt(progressEvent.loaded/progressEvent.total*100) + "%")
	return

        if (progressEvent.lengthComputable) {
            loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
            $(".swal-title").text(
                parseInt(progressEvent.loaded/progressEvent.total*100) + "%")
        } else {
            loadingStatus.increment();
        }
    };
    ft.upload(mediaFile.fullPath, uri, win, fail, options);
}



