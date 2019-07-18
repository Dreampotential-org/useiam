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
