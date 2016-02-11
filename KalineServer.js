var apn  = require("apn")

var apnError = function(err){
    console.log("APN Error:", err);
}

var options = {
    "cert": process.env.APN_CERT_PEM || "cert.pem",
    "key":  process.env.APN_KEY_PEM  || "key.pem",
    "production": false,
    "passphrase": null,
    "gateway": "gateway.sandbox.push.apple.com",
    "port": 2195,
    "enhanced": true,
    "cacheLength": 5
};

options.errorCallback = apnError;

var feedBackOptions = {
    "batchFeedback": true,
    "interval": 300,
    "production": false,
    "cert": process.env.APN_CERT_PEM || "cert.pem",
    "key":  process.env.APN_KEY_PEM  || "key.pem",
};

var apnConnection, feedback;

module.exports = {
    init : function(){
        apnConnection = new apn.Connection(options);

        feedback = new apn.Feedback(feedBackOptions);
        feedback.on("feedback", function(devices) {
            devices.forEach(function(item) {
                //TODO Do something with item.device and item.time;
            });
        });
    },

    send : function (params){
        var myDevice, note;

        myDevice = new apn.Device(params.token);
        note = new apn.Notification();

        note.expiry = Math.floor(Date.now() / 1000) + 3600; // Expires 1 hour from now.
        note.badge = 1;
        note.sound = "ping.aiff";
        note.alert = params.message;
        note.payload = {'messageFrom': params.from};

        if(apnConnection) {
            apnConnection.pushNotification(note, myDevice);
        }
    }
}



/*usage
Kal = require("./KalineServer");
Kal.init();
Kal.send({token:'f780692d61453893b756d13eb5324921f40ba270f0434a6f9a265ac736dd6b08', message:'Hello Notif', from: 'Kal'});
*/
