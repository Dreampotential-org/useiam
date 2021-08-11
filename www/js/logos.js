function init_logo() {
  var full = window.location.host;
  //window.location.host is subdomain.domain.com
  var parts = full.split(".");
  var sub = parts[0];
  var domain = parts[1];
  var type = parts[2];

  if (sub == "futures") {
    _append_logo_and_icon("img/futuresLogo.png");
  } else if (sub == "gatewayfoundation") {
    _append_logo_and_icon("img/gateway.png");
    $(".logo img").css("width", "140px");
    $("body").css("background", "#fff");
  } else if (sub == "discoveryhb") {
    _append_logo_and_icon("img/discoveryhb.jpg");
    $(".logo img").css("width", "180px");
    $("body").css("background", "#fff");
  } else if (sub == "manorofhope") {
    _append_logo_and_icon("img/manorofhope.png");
    $(".logo img").css("width", "150px");
    $("body").css("background", "#fff");
  } else if (sub == "victorybay") {
    _append_logo_and_icon("img/victory-bay.jpg");
    $(".logo img").css("width", "180px");
    $("body").css("background", "#fff");
  } else if (sub == "rca") {
    _append_logo_and_icon("img/rca.jpg");
    $(".logo img").css("width", "60px");
  } else if (sub == "elevaterehab") {
    _append_logo_and_icon("img/elevaterehab.png");
    $(".logo img").css("width", "205px");
  } else if (sub == "pinelands") {
    _append_logo_and_icon("img/pinelands.png");
    $(".logo img").css("width", "200px");
  } else if (sub == "valleyrecovery") {
    _append_logo_and_icon("img/valley.png");
    $(".logo img").css("width", "126px");
  } else if (sub == "wellnessretreat") {
    _append_logo_and_icon("img/wellnessretreat.jpg");
    $(".logo img").css("width", "126px");
  } else if (sub == "turnbridge") {
    _append_logo_and_icon("img/turnbidge.png");
    $(".logo img").css("width", "115px");
  } else if (sub == "pbdwi") {
    _append_logo_and_icon("img/pbdwi.jpg");
    $(".logo img").css("width", "115px");
  } else if (sub == "beachcomber") {
    _append_logo_and_icon("img/beachlogo.png");
    $(".logo img").css("width", "200px");
  } else if (sub == "fouraze") {
    _append_logo_and_icon("img/fouraze.webp");
    $(".logo img").css("width", "200px");
    $(".logo img").css("margin-top", "-40px");
  } else if (sub == "pbbhw") {
    _append_logo_and_icon("img/pbbhw.png");
    $(".logo img").css("width", "327px");
  } else if (sub == "urbanrecovery") {
    _append_logo_and_icon("img/urbanRecover.png");
    $(".logo img").css("width", "200px");
    $(".logo img").css("padding-top", "10px");
  } else {
    _append_logo_and_icon("img/useiam_logo.png");
    $(".logo img").css("width", "200px");
  }
  $(".logo img").show();
}

function _append_logo_and_icon(icon_path) {
  $(".logo").append("<img src='" + icon_path + "'/>");
  $("head").append('<link rel="apple-touch-icon" href="' + icon_path + '">');
  if (icon_path == "img/.png") {
    return;
  }
}

function load_logo_from_url() {
    var url = new URL(window.location.href);
    var org_id = url.searchParams.get("org");

    if (org_id) {
      var settings = {
        async: true,
        crossDomain: true,
        url: SERVER + "/api/get_org/?id=" + org_id,
        method: "GET",
        processData: false,
        contentType: false,
        mimeType: "multipart/form-data",
      };

      $.ajax(settings)
        .done(function (response) {
          var org = JSON.parse(response)
          if (org.length) {
            _append_logo_and_icon(org[0].logo);
            localStorage.setItem("org_id", org[0].id)
            localStorage.setItem("org_logo", org[0].logo)
          }
          $(".logo").show()
          $(".logo img").show();
        }).fail(function (err) {
          console.log(err);
        });
    } else {
        init_logo()
        $(".logo").show()
    }
}
