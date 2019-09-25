var stripe = null;
var card = null;

function init_stripe() {
    var url = new URL(window.location.href)
    if (url.searchParams.get("billing")) {
        $('#paymentForm').addClass('is-visible');
    }

    // Create a Stripe client.
    stripe = Stripe('pk_test_0UPnutnlJLR818NScvWAdbQo001ARivXIZ');
    init_stripe_events();

    $('body').delegate('.submit-payment', 'click', function(e) {
        submit_payment()
    });

    $('body').delegate('#cancel_subscription', 'click', function(e) {
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
                cancel_subscription()
            }
        });
    });
}

function init_stripe_events() {
    // Create an instance of Elements.
    var elements = stripe.elements();

    // Custom styling can be passed to options when creating an Element.
    // (Note that this demo uses a wider set of styles than the guide below.)
    var style = {
      base: {
        color: '#32325d',
        fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
        fontSmoothing: 'antialiased',
        fontSize: '16px',
        '::placeholder': {
          color: '#aab7c4'
        }
      },
      invalid: {
        color: '#fa755a',
        iconColor: '#fa755a'
      }
    };

    // Create an instance of the card Element.
    card = elements.create('card', {style: style});

    // Add an instance of the card Element into the `card-element` <div>.
    card.mount('#card-element');

    // Handle real-time validation errors from the card Element.
    card.addEventListener('change', function(event) {
      var displayError = document.getElementById('card-errors');
      if (event.error) {
        displayError.textContent = event.error.message;
      } else {
        displayError.textContent = '';
      }
    });
}

function submit_payment() {
  stripe.createToken(card).then(function(result) {
    if (result.error) {
      // Inform the user if there was an error.
      var errorElement = document.getElementById('card-errors');
      errorElement.textContent = result.error.message;
    } else {
      // Send the token to your server.
      stripeTokenHandler(result.token);
    }
  });
}

function cancel_subscription() {
    var settings = {
      "async": true,
      "crossDomain": true,
       "headers": {
       "Authorization": "Token " + localStorage.getItem("session_id"),
      },
      "url": SERVER + "/api/cancel-plan/",
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
}

// Submit the form with the token ID.
function stripeTokenHandler(token) {
    swal({
        title: "Creating Account",
        text: "Creating account please wait.",
        icon: "info",
        buttons: false,
        closeOnEsc: false,
        closeOnClickOutside: false,
    });


    $.post(SERVER + "/api/pay/?token=" + localStorage.getItem("session_id"), {
        stripeToken: token.id,
        plan: 'standard',
    }, function(response) {
        console.log(response)
        console.log("RESPONSE IS" + response)
        //response = JSON.parse(response)
        if (response.status == 'OKAY') {
            swal.close()
            swal({
                title: "Success!",
                text: "You're subscription has been successfully created!",
                confirmButtonColor: '#01aaff',
                icon: "success"}).then(function() {
                    // TODO redirect to show instructions the first time.
                    window.location = '/'
                })
        } else {
            swal.close()
            swal({
                title: "Credit Card Error",
                text: response.error,
                confirmButtonColor: '#01aaff',
                icon: "error"})
        }

    });
}
