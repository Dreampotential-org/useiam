$(".subscribe").on("click", function (e) {
    console.log("subscribe clicked");
    if (isApp())
    { 
      $("#subscriptionModule").addClass("is-visible");  
    }
    // else if (
    //   window.cordova.platformId == "ios" ||
    //   window.cordova.platformId == "android"
    // ) 
    // {  
    //   console.log("showtab else");
    //   store.when("base_subscription_7").approved(finishPurchase);
    //   store.register({ type: store.CONSUMABLE, id: "base_subscription_7" });
    //   store.refresh();
    //   store.order("base_subscription_7");
    // }
    // var SERVER = 'http://127.0.0.1:8000'
    var settings_client_token = {
      async: true,
      crossDomain: true,
      // headers: {
      //   Authorization: "Token " + localStorage.getItem("session_id"),
      // },
      url: PythonAPIServer + "/store/userSubscribe",
      method: "GET",
      processData: false,
      contentType: false,
      mimeType: "multipart/form-data",
    };
  
    $.ajax(settings_client_token)
      .done(function (response) {
        var resp = JSON.parse(response);
        console.log(resp);
        $("#client_token").val(resp.client_token);
        // subscription start
        var form = document.querySelector("#subscription_form");
        var client_token = $("#client_token").val(); 
  
        braintree.dropin.create(
        {
            authorization: client_token,
            container: "#bt-dropin",
            paypal: {
            flow: "vault",
            },
        },
        function (createErr, instance) {
            form.addEventListener("submit", function (event) {
            event.preventDefault();
            $('#subsciptionSubmit').hide();
            instance.requestPaymentMethod(function (err, payload) {
                if (err) {
                console.log("Error", err);
                return;
                }
  
                // Add the nonce to the form and submit
                document.querySelector("#nonce").value = payload.nonce;
                // form.submit();
                ///////
                var subscription_form = new FormData();
                subscription_form.append("payment_method_nonce", $("#nonce").val())
                subscription_form.append("session_id", localStorage.getItem("session_id"))
                // subscription_form.append("client_token", $("#client_token").val())
                subscription_form.append("subscription_plan_ID", $("#subscription_plan_ID").val())
                var settings_add_item_update = {
                  "async": true,
                  "crossDomain": true,
                  "url":PythonAPIServer + "/store/userbrainTreeSubscription",
                  "method": "POST",
                  "type": "POST",
                  "processData": false,
                  "contentType": false,
                  "mimeType": "multipart/form-data",
                  "data": subscription_form,
                  // "headers": {
                  //     "Authorization": localStorage.getItem("user-token")
                  // }
                };
                $.ajax(settings_add_item_update).done(function (response) {
                  // response = JSON.parse(response);
                  console.log(response);
                  do_set_paying("P_IAP Info Blurb");
                  swal({
                    title: "Subscription",
                    text: "Subscrition Successful",
                    icon: "success",
                });
                location.reload();
                }).fail(function (response) {
                        console.log("Edit item Failed!");
                  swal({
                      title: "Error!",
                      text: "Subscription is failed!",
                      icon: "warning",
                  });
                });
                //////
            });
            });
        }
        );  
        
        $("#subscriptionModule").addClass("is-visible");  
      })
      .fail(function (err) {
        console.log(err);
      });
    
  });
  
  // <!-- script for toggling display of the form -->
  
  function toggleDisplay() {
  var x = document.getElementById("collapseStripe");
  if (x.style.display === "none") {
      x.style.display = "block";
  } else {s
      x.style.display = "none";
  }
  }
  
  // unsubscribe
  // $('body').delegate('#Unsubscribe', 'click', function(e) {
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
    unsubscription_form.append("the_subscription_id", "")
    unsubscription_form.append("session_id", localStorage.getItem("session_id"))

    var settings = {
      "async": true,
      "crossDomain": true,
      "url":PythonAPIServer + "/store/userbrainTreeUnsubscription",
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
                            // TODO redirect to show instructions the first time.
                            window.location = '/'
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