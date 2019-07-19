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
            alert("SUCCESS")
            var i, path, len;
            for (i = 0, len = mediaFiles.length; i < len; i += 1) {
                path = mediaFiles[i].fullPath;
                // do something interesting with the file
                alert(path)
                api_video_checkin(path);

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


function api_video_checkin(video_path) {
    function win(r) {
        console.log("Code = " + r.responseCode);
        console.log("Response = " + r.response);
        console.log("Sent = " + r.bytesSent);
        alert("Finished!")
    }

    function fail(error) {
        alert("An error has occurred: Code = " + error.code);
        console.log("upload error source " + error.source);
        console.log("upload error target " + error.target);
    }

    var uri = encodeURI(SERVER + "/api/video/");
    var options = new FileUploadOptions();
    options.fileKey = "video";
    options.fileName = fileURL.substr(video_path.lastIndexOf('/')+1);
    options.mimeType = "application/octet-stream";

    var headers = {
        'Authorization': "Token " + localStorage.getItem("session_id")
    };

    options.headers = headers;

    var ft = new FileTransfer();
    ft.onprogress = function(progressEvent) {
        if (progressEvent.lengthComputable) {
            loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
        } else {
            loadingStatus.increment();
        }
    };
    ft.upload(fileURL, uri, win, fail, options);
}
