function init_logo() {
    var full = window.location.host
    //window.location.host is subdomain.domain.com
    var parts = full.split('.')
    var sub = parts[0]
    var domain = parts[1]
    var type = parts[2]

    if (sub == 'futures') {
        _append_logo_and_icon("img/futuresLogo.png")
    } else if (sub == 'elevaterehab') {
        _append_logo_and_icon("img/elevaterehab.png")
        $(".logo img").css("width", '205px')
    } else if (sub == 'pinelands') {
        _append_logo_and_icon("img/pinelands.png")
        $(".logo img").css("width", '200px')
    } else if (sub == 'valleyrecovery') {
        _append_logo_and_icon("img/valley.png")
        $(".logo img").css("width", '126px')
    } else if (sub == 'wellnessretreat') {
        _append_logo_and_icon("img/wellnessretreat.jpg")
        $(".logo img").css("width", '126px')
    } else if (sub == 'turnbridge') {
        _append_logo_and_icon("img/turnbidge.png")
        $(".logo img").css("width", '115px')
    } else if (sub == 'pbdwi') {
        _append_logo_and_icon("img/pbdwi.jpg")
        $(".logo img").css("width", '115px')
    } else if (sub == 'beachcomber') {
        _append_logo_and_icon("img/beachlogo.png")
        $(".logo img").css("width", '200px')
    } else if (sub == 'pbbhw') {
        _append_logo_and_icon("img/pbbhw.png")
        $(".logo img").css("width", '327px')
    } else if (sub == 'urbanrecovery') {
        _append_logo_and_icon("img/urbanRecover.png")
        $(".logo img").css("width", '200px')
        $(".logo img").css("padding-top", '10px')
    } else {
        _append_logo_and_icon("images/iam.png")
        $(".logo img").css("width", '100px')
   }

    $(".logo img").show()
}

function _append_logo_and_icon(icon_path) {
    $(".logo").append("<img src='" + icon_path + "'/>")
    $('head').append(
        '<link rel="apple-touch-icon" href="' + icon_path + '">')
    if (icon_path == 'images/iam.png') {
        return;
    }
    $(".logo2").append("<img src='images/iam.png'/>")
    $(".logo2 img").css("width", '80px')
}
