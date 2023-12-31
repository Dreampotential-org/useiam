function init_video_event() {
  LOGO_FILE = ''
  $('#OpenImgUpload').click(function () {
    $('#imgupload').trigger('click');
    $("#imgupload").on("change", function (e) {
      e.preventDefault();
      var file = e.target.files[0];
      LOGO_FILE = file;
    });
  });

  $('#org_submit').on('click', function () {
    if (LOGO_FILE == '') {
      swal({
        'title': 'Error',
        'text': 'Upload the Logo',
        'icon': 'error',
      });
    }

    var form = new FormData();
    form.append("name", $('#org_name').val());
    form.append("hostname", $('#org_host_name').val());
    form.append("city", $('#org_city').val());
    form.append("address", $('#org_address').val());
    form.append("phone_no", $('#org_phone').val());

    form.append("state", $('#org_state').val());

    form.append("file", LOGO_FILE, LOGO_FILE.name);

    if ($('#org_name').val() == '') {
      swal({
        'title': 'Error',
        'text': 'Enter the valid Name',
        'icon': 'error',
      });

      return false;
    }

    if ($('#org_host_name').val() == '') {
      swal({
        'title': 'Error',
        'text': 'Enter the valid Hostname',
        'icon': 'error',
      });

      return false;
    }

    if ($('#org_city').val() == '') {
      swal({
        'title': 'Error',
        'text': 'Enter the valid City',
        'icon': 'error',
      });

      return false;
    }
    if ($('#org_phone').val() == '') {
      swal({
        'title': 'Error',
        'text': 'Enter the valid Phone no',
        'icon': 'error',
      });

      return false;
    }

    if ($('#org_address').val() == '') {
      swal({
        'title': 'Error',
        'text': 'Enter the valid Address',
        'icon': 'error',
      });

      return false;
    }

    if ($('#org_state').val() == '') {
      swal({
        'title': 'Error',
        'text': 'Enter the valid State',
        'icon': 'error',
      });

      return false;
    }

    var settings = {
      async: true,
      crossDomain: true,
      headers: {
        // Authorization: "Token " + localStorage.getItem("session_id"),
      },
      url: SERVER + "/api/add-org-client/",
      method: "POST",
      processData: false,
      contentType: false,
      mimeType: "multipart/form-data",
      data: form,
    };

    $.ajax(settings).done(function (response) {

      var msg = objToStr(JSON.parse(response));
      $('#org_name').val('')
      $('#org_host_name').val('')
      $('#org_city').val('')
      $('#org_phone').val('')

      $('#org_address').val('')
      $('#org_state').val('')

      swal({
        title: "Successfully!",
        text: "Organization Crated",
        icon: "success",
      });

      return false;
    }).fail(function (err) {
      var errMsg = objArrToStr(JSON.parse(err['responseText']));
      swal({
        title: "Error",
        text: err.responseText,
        icon: "error",
        closeOnEsc: false,
        closeOnClickOutside: false,
      });

      return false;
    });
    return false;
  });


  $(".close").on("click", function (e) {
    closeAllModals();
  });

  $(".btnVideo").on("click", function (e) {
    // clicking back btn takes you to dashboard
    // showBackButton('dashboard');
    // showATab('takeVideo');
    $("#videoInfo").addClass("is-visible");
  });

  $("#upload_vid_form").submit(function (e) {
    e.preventDefault();
    var data = new FormData();
    data.append("video", GLOBAL_FILE, GLOBAL_FILE.name);
    data.append("source", window.location.host);

    var xhr = new XMLHttpRequest();
    // xhr.withCredentials = true;
    function updateProgress(e) {
      if (e.lengthComputable) {
        console.log(e.loaded);
        console.log(e.loaded + " / " + e.total);
        $(".swal-title").text(parseInt((e.loaded / e.total) * 100) + "%");
      }
    }

    swal({
      title: "0%",
      text: "Video uploading please wait.",
      icon: "info",
      buttons: false,
      closeOnEsc: false,
      closeOnClickOutside: false,
    });

    xhr.upload.addEventListener("progress", updateProgress, false);
    xhr.addEventListener("readystatechange", function () {
      if (this.readyState === 4) {
        if (this.status == 200) {
          swal({
            title: "Good job!",
            text: "Video submitted successfully!",
            icon: "success",
          });
          $("#overlay_loading").hide();
          $("#takeavideoModal").removeClass("is-visible");
        } else {
          swal({
            title: "Error Try Again",
            text: "Sorry, there is an error please try again later.",
            icon: "error",
            buttons: [true, "Retry"],
          }).then((retry) => {
            if (retry) {
              $("#upload_vid_form").submit();
            }
          });
        }
      }
    });
    $("#overlay_loading").show();
    xhr.open("POST", SERVER + "/api/video-upload/");
    xhr.setRequestHeader(
      "Authorization",
      "Token " + localStorage.getItem("session_id")
    );
    xhr.send(data);
  });

  $("#upload-vid").on("change", function (e) {
    e.preventDefault();
    var file = e.target.files[0];
    GLOBAL_FILE = file;
    $("#upload_vid_form").submit();
    swal({
      title: "0%",
      text: "Video uploading please wait.",
      icon: "info",
      buttons: false,
      closeOnEsc: false,
      closeOnClickOutside: false,
    });
  });
  $("#videoInfo .btnOk").on("click", function (e) {
    e.preventDefault();
    if (isApp()) {
      if (window.cordova.platformId != "android") $("#upload-vid").click();

      var captureSuccess = function (mediaFiles) {
        var i, path, len;
        for (i = 0, len = mediaFiles.length; i < len; i += 1) {
          path = mediaFiles[i].fullPath;
          // do something interesting with the file
          if (window.cordova.platformId == "android") {
            api_video_checkin_android(mediaFiles[i]);
          } else {
            api_video_checkin(mediaFiles[i]);
          }
        }
      };

      // capture error callback
      var captureError = function (error) {
        alert("Error code: " + error.code, null, "Capture Error");
      };

      // start video capture
      navigator.device.capture.captureVideo(captureSuccess, captureError, {
        limit: 1,
      });
    } else {
      $("#upload-vid").click();
    }
  });
}

function api_video_checkin_android(mediaFile) {
  var temp = mediaFile;

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
      buttons: [true, "Retry"],
    }).then((retry) => {
      if (retry) {
        api_video_checkin_android(temp);
      }
    });

    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
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
    Authorization: "Token " + localStorage.getItem("session_id"),
  };

  options.headers = headers;
  var params = {};
  params.source = "";
  options.params = params;
  var type = window.PERSISTENT;
  var size = 500 * 1024 * 1024; // 500 MB
  var ft = new FileTransfer();

  window.requestFileSystem(type, size, successCallback, errorCallback); // Request Access file system permission
  function successCallback(fs) {
    fs.root.getFile(
      "DCIM/Camera/" + mediaFile.name,
      { create: false, exclusive: false },
      function (fileEntry) {
        fileEntry.file(function (file) {
          ft.onprogress = function (progressEvent) {
            $(".swal-title").text(
              parseInt((progressEvent.loaded / progressEvent.total) * 100) + "%"
            );
          };
          ft.upload(mediaFile.fullPath, uri, win, fail, options);
        }, errorCallbackFileEntry);
      },
      errorCallbackGetFile
    );
  }

  function errorCallbackGetFile(error) {
    console.log("errorCallbackGetFile ", error);
    alert("ERROR: " + error.code);
    swal({
      title: "Error Try Again",
      text: "Sorry, there is an error please try again later.",
      icon: "error",
    });
  }

  function errorCallbackFileEntry(error) {
    console.log("errorCallbackFileEntry ", error);
    alert("ERROR: " + error.code);
    swal({
      title: "Error Try Again",
      text: "Sorry, there is an error please try again later.",
      icon: "error",
    });
  }
  function errorCallback(error) {
    console.log("errorCallback ", error);
    alert("ERROR: " + error.code);
    swal({
      title: "Error Try Again",
      text: "Sorry, there is an error please try again later.",
      icon: "error",
    });
  }
}

function api_video_checkin(mediaFile) {
  var temp = mediaFile;

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
    swal({
      title: "Error Try Again",
      text: "Sorry, there is an error please try again later.",
      icon: "error",
      buttons: [true, "Retry"],
    }).then((retry) => {
      if (retry) {
        api_video_checkin(temp);
      }
    });
    console.log("upload error source " + error.source);
    console.log("upload error target " + error.target);
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
    Authorization: "Token " + localStorage.getItem("session_id"),
  };

  options.headers = headers;

  var ft = new FileTransfer();
  ft.onprogress = function (progressEvent) {
    $(".swal-title").text(
      parseInt((progressEvent.loaded / progressEvent.total) * 100) + "%"
    );
    return;

    if (progressEvent.lengthComputable) {
      loadingStatus.setPercentage(progressEvent.loaded / progressEvent.total);
      $(".swal-title").text(
        parseInt((progressEvent.loaded / progressEvent.total) * 100) + "%"
      );
    } else {
      loadingStatus.increment();
    }
  };
  ft.upload(mediaFile.fullPath, uri, win, fail, options);
}
