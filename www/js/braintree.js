function init_unsubscribe_events() {
  // unsubscribe
  $("#Unsubscribe").on("click", function (e) {
    console.log("unsubscript");
    $(".toggleBar").click();
    closeAllModals();
    // $("#unsubscriptionModule").addClass("is-visible");
    swal({
      title: "Cancel Plan?",
      text: "Are you sure? You will no longer be able to" +
        " submit updates.",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    })
    .then((willDelete) => {
        if (willDelete) {
            cancel_BrainTree_subscription()
        }
    });
  });

  function cancel_BrainTree_subscription() {
    var unsubscription_form = new FormData();
    // XXX later update "the_subscrition_id pass from user_profile_api request
    // from subscription_id stored in prod-api.useiam.net api
    unsubscription_form.append(
        "the_subscription_id", "IAM001")
    unsubscription_form.append(
        "session_id", localStorage.getItem("session_id"))

    var settings = {
      "async": true,
      "crossDomain": true,
      "url": PythonAPIServer + "/store/userbrainTreeUnsubscription",
      "method": "POST",
      "type": "POST",
      "processData": false,
      "contentType": false,
      "mimeType": "multipart/form-data",
      "data": unsubscription_form,
      // "headers": {
      //     "Authorization": localStorage.getItem("user-token")
      // }
    };

    $.ajax(settings).done(function (response) {
        var msg = JSON.parse(response)
        if (msg.status == 'OKAY'){
            //unsubscribe
            var settings = {
              "async": true,
              "crossDomain": true,
               "headers": {
               "Authorization": "Token " + localStorage.getItem("session_id"),
              },
              "url": SERVER + "/api/cancel-plan-braintree/",
              "method": "GET",
              "processData": false,
              "contentType": false,
              "mimeType": "multipart/form-data",
            }

            $.ajax(settings).done(function (response) {
                var msg = JSON.parse(response)
                if (msg.status == 'OKAY')
                    swal({
                        title: "Success!",
                        text: "You're subscription has been successfully deleted.",
                        confirmButtonColor: '#01aaff',
                        icon: "success"}).then(function() {
                            do_set_not_paying("")
                            // TODO redirect to show instructions the first time.
                        })
                else {
                    swal({
                        title: "Error",
                        text: "We're sorry but an unexpected error has occured. " +
                            "Please try again.",
                        icon: "error"}).then(function() {
                            window.location = '/'
                        })
                }
            }).fail(function(err) {
                // DODO slack log error
                swal({
                    title: "Error",
                    text: "We're sorry but an unexpected error has occured. " +
                        "Please try again.",
                    icon: "error"}).then(function() {
                        window.location = '/'
                })
                console.log(err)
            });
            //unsubscribe
          }
        else {
            swal({
                title: "Error",
                text: "We're sorry but an unexpected error has occured. " +
                    "Please try again.",
                icon: "error"}).then(function() {
                    window.location = '/'
                })
        }
    }).fail(function(err) {
        // DODO slack log error
        swal({
            title: "Error",
            text: "We're sorry but an unexpected error has occured. " +
                "Please try again.",
            icon: "error"}).then(function() {
                window.location = '/'
        })

        console.log(err)
    });
}
}

