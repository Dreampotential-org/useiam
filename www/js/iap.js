$(".subscribe").on("click", function (e) {
  console.log("subscribe clicked");
  if (
    window.cordova.platformId == "ios" ||
    window.cordova.platformId == "android"
  ) {
    console.log("showtab else");
    store.when("base_subscription_7").approved(finishPurchase);
    store.register({ type: store.CONSUMABLE, id: "base_subscription_7" });
    store.refresh();
    store.order("base_subscription_7");
  }
});

function finishPurchase(p) {
  console.log("finishPurchase");
  console.log(p);
  console.log("finishPurchase status");
  console.log(p.state);
  localStorage.goldCoins = (localStorage.goldCoins | 0) + 10;
  p.finish();

  //if "state":"approved" the call server api to save purchase details
  //if p.state()==approved
}

function inAppPurchaseDone() {
  localStorage.setItem("isSubscribed", "true");
  showATab("dashboard");
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
