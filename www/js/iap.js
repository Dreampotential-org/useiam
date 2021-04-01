function finishPurchase(p) {
  console.log("finishPurchase");
  console.log(p);
  console.log("finishPurchase status");
  console.log(p.state);
  localStorage.goldCoins = (localStorage.goldCoins | 0) + 10;
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


}
