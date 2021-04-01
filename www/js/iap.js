$(".subscribe").on("click", function (e) {
  console.log("subscribe clicked");
  if (isApp())
  {
    $("#subscriptionModule").addClass("is-visible");  
  }
  else if (window.cordova && (
    window.cordova.platformId == "ios" ||
    window.cordova.platformId == "android")
  )
  {
    console.log("showtab else");
    store.when("base_subscription_7").approved(finishPurchase);
    store.register({ type: store.CONSUMABLE, id: "base_subscription_7" });
    store.refresh();
    store.order("base_subscription_7");
  }
  // var SERVER_subscription = 'http://127.0.0.1:8000'
  var settings_client_token = {
    async: true,
    crossDomain: true,
    // headers: {
    //   Authorization: "Token " + localStorage.getItem("session_id"),
    // },
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
              // subscription_form.append("client_token", $("#client_token").val())
              subscription_form.append("subscription_plan_ID", $("#subscription_plan_ID").val())
              var settings_add_item_update = {
                "async": true,
                "crossDomain": true,
                "url":SERVER + "/store/userbrainTreeSubscription",
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


function finishPurchase(p) {
  console.log("finishPurchase");
  console.log(p);
  console.log("finishPurchase status");
  console.log(p.state);
  localStorage.goldCoins = (localStorage.goldCoins | 0) + 10;

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
