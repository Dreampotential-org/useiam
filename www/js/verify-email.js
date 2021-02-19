function verifyEmail (uid, token) {

    var settings = {
        "crossDomain": true,
        "url": SERVER + '/api/activate/'+uid+'/'+token+'/',
        "method": "GET",
    }

    $.ajax(settings).done(function (response) {
        var msg = 'You email account has been verified you may login now.';
        $('#msg').html(msg);

    }).fail(function (err) {
        var msg = 'Unable to verify you email. It cause expire link or some other reason. Get new link by login.';
        $('#msg').html(msg);
    });
}

$(document).ready(function(){
    url_string = window.location.href;
    var url = new URL(url_string);
    var uid = url.searchParams.get("u");
    var token = url.searchParams.get("t");

    verifyEmail(uid, token);

    $(document).on('click', '#signin_btn',function(){
        window.location = '/';
    });
});