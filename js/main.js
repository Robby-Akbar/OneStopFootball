let webPush = require('web-push');
let pushSubscription = {
    "endpoint": "https://android.googleapis.com/gcm/send/cHPOjCSQ0Io:APA91bEPdC11hpRf6MzQGiN-tK0xSxh9jVPTMocnE0sudhzi0YMXRnvUSYKiZ34EQqOpUpq4G6swA7agRFLo7KUhBGZ93ooYcxxeFpLnx8psE_TZgcemPcSYX7GHtEwJBmmoSbmUzuyq",
    "keys": {
        "p256dh": "BGJ547wH16Mi77gNiqYqyv9cwslH5f+QbcSXF4K8nY9jIqGFBQE8UoJqf/y1IHfYF8swBSVRtR43iAi63Fm7e48=",
        "auth": "zoDuKGZ/sfqR1S+kNWYd3Q=="
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