function init_iap_events() {
  init_unsubscribe_events();

  $(".subscribe").on("click", function (e) {
    console.log("subscribe clicked ######");
    if (false && isApp()) {
      $("#subscriptionModule").addClass("is-visible");
    }
    else if (window.cordova && (window.cordova.platformId == "ios")
      //window.cordova.platformId == "android")
    ) {
      // APPLE PAY
      console.log("showtab else");
      store.when("base_subscription_7").approved(finishPurchase);
      store.register({ type: store.PAID_SUBSCRIPTION, id: "base_subscription_7" });
      var product = store.get("base_subscription_7")
      //alert(product.owned)
      store.error(function(e){
        alert("ERROR " + e.code + ": " + e.message);
      });

      store.refresh();
      store.order("base_subscription_7");
      return
    }
    $("#subscriptionModule").addClass("is-visible");

    // var SERVER_subscription = 'http://127.0.0.1:8000'
    var settings_client_token = {
      async: true,
      crossDomain: true,
      url: "https://api.dreampotential.org/store/userSubscribe",
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
        var client_token = $("#client_token").val()

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
              instance.requestPaymentMethod(function (err, payload) {
                console.log(err)
                if (err) {
                  swal({
                    title: "Error!",
                    text: err.message,
                    icon: 'error'
                  })
                  console.log("Error", err);
                  return;
                }

                swal({
                  title: "Get Ready!",
                  text: "Activating your Account",
                  icon: "info",
                  buttons: false,
                  closeOnEsc: false,
                  closeOnClickOutside: false,
                });


                $('#subsciptionSubmit').hide();

                // Add the nonce to the form and submit
                document.querySelector("#nonce").value = payload.nonce;
                // form.submit();
                ///////

                var subscription_form = new FormData();
                subscription_form.append("payment_method_nonce", $("#nonce").val())
                subscription_form.append("session_id", localStorage.getItem("session_id"))
                subscription_form.append("subscription_plan_ID", $("#subscription_plan_ID").val())
                var settings_add_item_update = {
                  "async": true,
                  "crossDomain": true,
                  "url": "https://api.dreampotential.org/store/userbrainTreeSubscription",
                  "method": "POST",
                  "type": "POST",
                  "processData": false,
                  "contentType": false,
                  "mimeType": "multipart/form-data",
                  "data": subscription_form,
                };
                $.ajax(settings_add_item_update).done(function (response) {
                  response = JSON.parse(response);
                  console.log(response)
                  do_set_paying(response.ID);
                  // XXX currently doing reload as there are some elements from
                  // iap braintree seems to explore clean up issue.

                  swal("Thank you Ready Go useIAM", {
                    icon: "success",
                  }).then(function() {
                    window.location.reload()
                  })
                });
              })
            })
          });
      });
    });

    // <!-- script for toggling display of the form -->

    function toggleDisplay() {
      var x = document.getElementById("collapseStripe");
      if (x.style.display === "none") {
        x.style.display = "block";
      } else {
        s
        x.style.display = "none";
      }
    }


    function finishPurchase(p) {
      alert("HERE2")
      console.log("finishPurchase");
      console.log(p);
      console.log("finishPurchase status");
      console.log(p.state);
      localStorage.goldCoins = (localStorage.goldCoins | 0) + 10;

      //alert(p.state)
      //if "state":"approved" the call server api to save purchase details
      //if p.state()==approved
      if (p.state == "approved") {
        inAppPurchaseDone(p);
      }

      p.finish();
    }

    function inAppPurchaseDone(p) {
      // localStorage.setItem("isSubscribed", "true");
      showATab("dashboard");

      // NEED Figure out blurb to send from p to set as iap_burb which
      // we need to coordinate unsubscribe interface.

      // sets inform API user is now subscribe success :)
      // XXX fix IAP blurb info
      do_set_paying("P_IAP Info Blurb");
      // XXX currently doing reload as there are some elements from
      // iap braintree seems to explore clean up issue.

      swal("Thank you Ready Go useIAM", {
        icon: "success",
      }).then(function() {
        window.location.reload()
      })

      // $("#not-subscribed-user").hide();
      // $("#subscribed-user").show();
    }

// function refreshUI() {
//   const product = store.get("base_subscription_7");
//   const button = `<button onclick="">Purchase</button>`;

//   document.getElementsByTagName("body")[0].innerHTML = `
//     <div>
//     <pre>
//     Gold: ${localStorage.goldCoins | 0}

//     Product.state: ${product.state}
//     .title: ${product.title}
//     .descr: ${product.description}
//     .price: ${product.price}

//     </pre>
//     ${product.canPurchase ? button : ""}
//     </div>`;
// }
}
