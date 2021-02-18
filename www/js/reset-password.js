url_string = window.location.href;
var url = new URL(url_string);
var uid = url.searchParams.get("u");
var token = url.searchParams.get("t");

var url = '/reset-password/'+uid;
window.history.pushState("", "", url);

$(document).on('click', '#password-btn', function () {
    $('#forgot-icon').hide();
    $('#forgot-spinner-icon').show();

    var data = {};
    data['new_password1'] = $('#new-password').val();
    data['new_password2'] = $('#new-password').val();
    data['uid'] = uid;
    data['token'] = token;

    if (data['new_password1'] == '') {
        swal({
            title: "Error",
            text: "Must enter password",
            icon: "error",
            closeOnEsc: false,
            closeOnClickOutside: false,
        });

        $('#forgot-icon').show();
        $('#forgot-spinner-icon').hide();
        return false;
    }

    var settings = {
        "async": true,
        "crossDomain": true,
        "url": SERVER + "/rest-auth/password/reset/confirm/",
        "method": "POST",
        "processData": false,
        'contentType': 'application/json',
        "mimeType": "multipart/form-data",
        "data": JSON.stringify(data)
    }

    $.ajax(settings).done(function (response) {
        $('#new-password').val('');

        var msg = objToStr(JSON.parse(response));

        swal({
            title: "Success",
            text: msg,
            icon: "success",
            closeOnEsc: false,
            closeOnClickOutside: false,
        });

        $('#forgot-icon').show();
        $('#forgot-spinner-icon').hide();
        return false;
    }).fail(function (err) {
        var errMsg = objArrToStr(JSON.parse(err['responseText']));
        swal({
            title: "Error",
            text: errMsg,
            icon: "error",
            closeOnEsc: false,
            closeOnClickOutside: false,
        });

        $('#forgot-icon').show();
        $('#forgot-spinner-icon').hide();
        return false;
    });
    return false;
});

$(document).on('click', '#signin_btn',function(){
    window.location = '/';
});