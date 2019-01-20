let webPush = require('web-push');
let pushSubscription = {
    "endpoint": "https://android.googleapis.com/gcm/send/e-7nm9_vs1c:APA91bFziDiGQCPNTOIqntKHLrlqs3iQnPbl0eYM1g8xy_XhWD2v-irOksECq1VluVttASu7LUvbM9E4XBaZ5yUM2y-OAkRCF0dxTWrUY8okEtcnGAV4tpfC0re-4ZTT3QjzVHiL4D4c",
    "keys": {
        "p256dh": "BF02dRSS7udAYS/W/skvxvth3+45tZekKWFDs9Vohbt7GgbZZ8m+mBzsn70cCAgyuuYBxrdcglneAPUGlPi/Hu8=",
        "auth": "zT7kcQ+rnm6+KrtnIhA11w=="
    }
};
let payload = 'Here is a payload!';
let options = {
    gcmAPIKey: 'AAAARB-5rHM:APA91bE8qAWxOO_I0tULfT805dfr6UOodkBhzCGYLnNpzaWrXzNVJv4mrWcaJZ5ipQY0RI5EKZw5_zMv7CEHM-TLLqOKTe3IcJqjafzNRVXMs35nAxV1DbzhMNlfEnUZX6Vi92F6fceF',
    TTL: 60
};
webPush.sendNotification(
    pushSubscription,
    payload,
    options
);