$(".subscribe").on("click", function (e) {
  console.log("subscribe clicked");
  store.when("base_subscription_7").approved(finishPurchase);
  store.register({ type: store.CONSUMABLE, id: "base_subscription_7" });
  store.refresh();
  store.order("base_subscription_7");
});

function finishPurchase(p) {
  localStorage.goldCoins = (localStorage.goldCoins | 0) + 10;
  p.finish();
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
