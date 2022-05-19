function init_activity() {
  $('#viewActivity').on('click', function (e) {
    if (document.getElementById('activity')) {
      document.getElementById('logoDivId').style.display = 'none';
    } else {
      document.getElementById('logoDivId').style.display = 'block';
    }
    $('.toggleBar').click();
    closeAllModals();
    showATab('activity');
    get_activity(function (resp) {
      display_activities(resp.events);
    });
  });

  $('.open-pdf').on('click', function (e) {
    var pdfUrl = $(this).attr('href');
    e.preventDefault();
    document.addEventListener(
      'deviceready',
      function () {
        cordova.InAppBrowser.open(pdfUrl, '_blank', 'location=no');
      },
      false
    );
  });
}

function loadVideo(id, video_url) {
  $('#eventView .content').html(
    '<video controls autoplay playsinline preload="auto" name="media" id="video" class="activityVideo" width="170" height="240"></video>'
  );
  loadBtns(id)
  var uid = getUrlVars(video_url)['id'];
  var user = getUrlVars(video_url)['user'];
  get_content_comments(uid, user)
  var vid = document.getElementById("video");
  vid.pause();
  $('#video').html(
    '<source src=' +
    SERVER +
    '/api/review-video/?id=' +
    uid +
    '&user=' +
    user +
    '&token=' +
    localStorage.getItem('session_id') +
    ' type="video/mp4">'
  );
  vid.load();
  vid.play();
}

function loadGPS(id, lat, lng) {
  $('#eventView .content').html(
    "<div id='gps-view' style='width:100%;height:400px;'></div>"
  );
  loadBtns(id)
  var spot = {
    lat: parseFloat(lat),
    lng: parseFloat(lng),
  };
  var name = '';
  var latlng = spot;
  var geocoder = new google.maps.Geocoder();

  var panorama = new google.maps.Map(document.getElementById('gps-view'), {
    center: { lat: spot.lat, lng: spot.lng },
    zoom: 18,
  });
  geocoder.geocode({ location: latlng }, function (results, status) {
    if (status === 'OK') {
      if (results[0]) {
        name = results[0].formatted_address;
        var marker = new google.maps.Marker({
          position: spot,
          map: panorama,
          icon: 'images/map_icon.png',
        });
        var infowindow = new google.maps.InfoWindow({ content: name });
        infowindow.setContent(results[0].formatted_address);
        infowindow.open(panorama, marker);
        marker.addListener('click', function () {
          infowindow.open(panorama, marker);
        });
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
}

function loadBtns(id) {
  var prevBtn = nextBtn = '';
  if (parseInt(id) !== 0) {
    prevBtn = '<div class="col-4 col-md-4 col-sm-03 "><p><button class="nextButton" key=' + id + ' id="previousBtn">Prev</button></p></div>';
  }
  if (parseInt(id) !== allData.events.length - 1) {
    nextBtn = '<div class="col-4 col-md-4 col-sm-03 pText"><p><button class="nextButton" key=' + id + ' id="nextBtn">Next</button></p></div>';
  }

  $('#eventView .content').append(
    '<div class="detailsDiv">' +
    '<div class="row">' + prevBtn + nextBtn +
    '<div class="col-4 col-md-4 col-sm-03 pText"><p><button class="favBtn"   id="favBtn"><i class="fa fa-star-o starIcon"></i></button></p></div>' +
    '</div>' +
    '<div class="row" id="feedbacks">' +

    '</div>' +
    '</div>'
  );
}

$('body').delegate('.view-event', 'click', function (e) {
  var id = $(this).attr('id');
  var type = $(this).attr('type');
  showATab('eventView');
  showBackButton('activity');

  if (type === "video") {
    loadVideo(id, $(this).attr('url'));
  } else if (type === "gps") {
    loadGPS(id, $(this).attr('lat'), $(this).attr('lng'));
  }
})

$('body').delegate('#favBtn', 'click', function () {
  $(this).find('.fa').toggleClass('fa-star-o fa-star');
});

$('body').delegate('#nextBtn', 'click', function () {
  var key = parseInt($(this).attr('key'));
  var nextKey = key + 1;
  if (nextKey <= allData.events.length) {
    var event = allData.events[nextKey];
    console.log(event);
    if (event.type == 'video') {
      loadVideo(nextKey, event.url)
    } else if (event.type == 'gps') {
      loadGPS(nextKey, event.lat, event.lng)
    }
  }
})

$('body').delegate('#previousBtn', 'click', function () {
  var key = parseInt($(this).attr('key'));
  var prevKey = key - 1;
  if (prevKey >= 0) {
    var event = allData.events[prevKey];
    console.log(event);
    if (event.type == 'video') {
      loadVideo(prevKey, event.url)
    } else if (event.type == 'gps') {
      loadGPS(prevKey, event.lat, event.lng)
    }
  }
})

var videoData;
var allData;
function get_activity(callback) {
  var settings = {
    async: true,
    crossDomain: true,
    headers: {
      Authorization: 'Token ' + localStorage.getItem('session_id'),
    },
    url: SERVER + '/api/get-activity/',
    method: 'GET',
    processData: false,
    contentType: false,
    mimeType: 'multipart/form-data',
  };
  $.ajax(settings)
    .done(function (response) {
      allData = JSON.parse(response);
      var events = [];
      for (var i = 0; i < allData.events.length; i++) {
        if (allData.events[i].type == 'video') {
          events.push(allData.events[i]);
        }
      }
      console.log(allData);
      videoData = { events: events };
      if (allData.events.length == 0) {
        document.getElementById('eventData').style.height = 'auto';
        document.getElementById('activity-log').style.padding = '0px';
        $('#activity-log.chat').html(
          '<div class="noActivityDiv"><h3>No Activities in List</h3> </div>'
        );
      }
      callback(allData);
    }).fail(function (err) {
      alert('Got err');
    });
}

function display_activities(activities) {
  $('#activity-log').empty();
  activities.forEach(function (activity, key) {
    if (activity.type == 'gps') {
      $('#activity-log').append(
        '<li class="other"><div class="msg"> <p class="dateClass">' +
        formatDate(new Date(activity.created_at * 1000)) +
        // "</p>" +"<p class='msgText'>"+ activity.msg +"</p>"+
        "<div style='width:80%'>" +
        activity.msg +
        " <span class='alignTag'>" +
        "<a href='#' class='view-event customLinkBtn' type=" + activity.type + " id=" + key + " lat=" + activity.lat + ' ' + 'lng=' + activity.lng + '> '
        + activity.type +
        '<span><i class="fa fa-angle-double-right"></i></span>' +
        '</a>' +
        '</span></div>' +
        ' <div class="icon"><img src="img/wifi-signal.svg" alt=""/></div>' +
        '</div> </li>'
      );
    }
    if (activity.type == 'video') {
      $('#activity-log').append(
        '<li class="other dark"><div class="msg"> <p class="dateClass">' +
        formatDate(new Date(activity.created_at * 1000)) +
        '</p>' +
        "<div style='width:80%'><i class='fa fa-star iconStar'></i><span class='alignTag'>" +
        "<a url=" + activity.url + " id=" + key + "  type=" + activity.type + "  href='#' class='view-event customLinkBtn'>" +
        activity.type +
        '<span><i class="fa fa-angle-double-right"></i></span>' +
        '</a></span></div>' +
        '<div class="icon"><div class="borderDiv"><img src="img/play-button_black.svg" alt=""/></div></div>' +
        '</div> </li>'
      );
    }
  });
}

function getUrlVars(url) {
  var vars = {};
  url.replace(/[?&]+([^=&]+)=([^&]*)/gi, function (m, key, value) {
    vars[key] = value;
  });
  return vars;
}

function formatDate(date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';
  hours = hours % 12;
  hours = hours || 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? '0' + minutes : minutes;
  var strTime = hours + ':' + minutes + ' ' + ampm;
  return date.toLocaleDateString('en-US') + ' ' + strTime;
}

function get_content_comments(id, user) {
  var settings = {
    async: true,
    crossDomain: true,
    headers: {
      Authorization: "Token " + localStorage.getItem("session_id"),
    },
    url: SERVER + "/api/get-video-info/?token=" + localStorage.getItem("session_id") + "&user=" + user + "&id=" + id,
    method: "GET",
    processData: false,
    contentType: false,
    mimeType: "multipart/form-data",
  };

  $.ajax(settings)
    .done(function (response) {
      $('#feedbacks').html('');
      var allData = JSON.parse(response);
      if (allData.feedback && allData.feedback.length > 0) {
        $('#feedbacks').append(
          '<div class="videoDetailsDiv"><b>Feedback received : ' + allData.feedback.length + ' </b><br>' +
          '<div class="feedback_received">' +
          '<ul class="list"  id="feedback_list">' +
          '</ul>' +
          '</div>' +
          '</div>'
        );
        for (var feedback of allData.feedback) {
          $('#feedback_list').append(
            '<li class="list-item">' +
            '<div class="list-item-content">' +
            '<h4>' + feedback.user + '</h4>' +
            '<p>' + feedback.message + '</p>' +
            '<p>' + formatDate(new Date(feedback.created_at * 1000)) + '</p>' +
            '</div>' +
            '</li>'
          )
        }
      } else {
        $('#feedbacks').append(
          '<div class="videoDetailsDiv"><b>No Feedback Received</b><br>' +
          '<div class="feedback_received">' +
          '<ul class="list"  id="feedback_list">' +
          '</ul>' +
          '</div>' +
          '</div>'
        );
      }
    })
}