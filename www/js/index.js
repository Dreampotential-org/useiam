var app = {
    // Application Constructor
    initialize: function () {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    onDeviceReady: function () {
        // this.receivedEvent('deviceready');
        console.log('deviceready in index.js');
        cordova.plugins.notification.local.hasPermission(function (granted) {
            if (granted == false) {
                cordova.plugins.notification.local.requestPermission(function (granted) {
                    // if granted is true then user granted or is false then not
                });
            }
        });
        app.pluginInitialize();
    },

    pluginInitialize: function () {
        console.log('pluginInitialize');
        document.getElementById('setRemainder').onclick = app.scheduleInterval;
        var details = cordova.plugins.notification.local.launchDetails;

        if (details) {
            // alert('Launched by notification with ID ' + details.id);
        }
    },

    // Schedule a repeating notification
    scheduleInterval: function () {
        console.log('scheduleInterval');
        app.clearAll();
        var remainderTime = document.getElementById('remainderTime').value;
        // console.log('remainderTime', remainderTime);

        var time = remainderTime;
        var hours = Number(time.match(/^(\d+)/)[1]);
        var minutes = Number(time.match(/:(\d+)/)[1]);
        var AMPM = time.match(/\s(.*)$/)[1];
        if (AMPM == "PM" && hours < 12) hours = hours + 12;
        if (AMPM == "AM" && hours == 12) hours = hours - 12;
        var sHours = hours.toString();
        var sMinutes = minutes.toString();
        if (hours < 10) sHours = "0" + sHours;
        if (minutes < 10) sMinutes = "0" + sMinutes;
        // console.log(sHours + ":" + sMinutes);

        var sound = device.platform != 'iOS' ? 'file://sound.mp3' : 'file://beep.caf';
        // console.log(sound);
        var date = new Date();
        // var currDate = (new Date(date.getFullYear(), date.getMonth(), date.getDate(), sHours, sMinutes, 0, 0)).toUTCString();
        var currDate = new Date(date.getFullYear(), date.getMonth(), date.getDate(), sHours, sMinutes, 0, 0);
        console.log(currDate);
        cordova.plugins.notification.local.schedule({
            id: 1,
            text: 'Scheduled every day',
            trigger: {
                every: 'day',
                at: new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1, sHours, sMinutes, 0, 0),
                // firstAt: currDate
            },
            // trigger: { every: { hour: sHours, minute: sMinutes } },
            // trigger: { every: 'minute' },
            sound: sound,
            vibrate: true,
            // icon: 'res://icon',
            // smallIcon: 'res://ic_popup_sync'
        });
        cordova.plugins.notification.local.schedule({
            id: 2,
            text: 'Scheduled every day',
            trigger: {
                at: new Date(date.getFullYear(), date.getMonth(), date.getDate(), sHours, sMinutes, 0, 0),
            },
            sound: sound,
            vibrate: true,
        });
    },
    // Clear all notifications
    clearAll: function () {
        console.log('Clear');
        cordova.plugins.notification.local.clearAll(app.ids);
    },

};

app.initialize();