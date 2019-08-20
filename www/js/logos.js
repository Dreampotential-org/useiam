function init_logo() {
    var full = window.location.host
    //window.location.host is subdomain.domain.com
    var parts = full.split('.')
    var sub = parts[0]
    var domain = parts[1]
    var type = parts[2]

    if (sub == 'futures') {
        $(".logo").append("<img src='img/futuresLogo.png' />")
    } else if (sub == 'turnbridge') {
        $(".logo").append("<img src='img/turnbidge.png' />")
        $(".logo img").css("width", '115px')
    } else if (sub == 'pbdwi') {
        $(".logo").append("<img src='img/pbdwi.jpg' />")
        $(".logo img").css("width", '115px')
    } else if (sub == 'beachcomber') {
        $(".logo").append("<img src='img/beachlogo.png' />")
        $(".logo img").css("width", '200px')
    } else if (sub == 'pbbhw') {
        $(".logo").append("<img src='img/pbbhw.png' />")
        $(".logo img").css("width", '327px')
    } else if (sub == 'urbanrecovery') {
        $(".logo").append("<img src='img/urbanRecover.png' />")
        $(".logo img").css("width", '220px')
        $(".logo img").css("padding-top", '22px')
    } else {
        $(".logo").append("<img src='images/iam.png' />")
        $(".logo img").css("width", '100px')
    }

    $(".logo img").show()
}
