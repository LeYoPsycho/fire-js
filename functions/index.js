// index.js

const functions = require('firebase-functions');
const admin = require('firebase-admin');
const request = require('request-promise');
admin.initializeApp();

let streamer = {
    username: ''
};

const younow_api = "https://api.younow.com/php/api/broadcast/info/curId=0/user=";

exports.checkStreamer = functions.https.onRequest((req, res) => {
    // Grab the text parameter.
    const query = younow_api + req.query.user;
    console.log("Query:", query);
    request.get(query, {
        headers: {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:63.0) Gecko/20100101 Firefox/63.0'
        }
    }).then(body => {
        //parse JSON
        let data = JSON.parse(body);
        //wenn der strömer gerade am strömen ist
        if (data.errorCode == 0) {
            streamer.username = data.profile;
            streamer.isOnline = true;

            admin.database().ref('/streamer').on('value', snapshot => {
                
            });

            //push streamer to db
            admin.database().ref('/streamer').push(streamer).then((snapshot) => {
                return res.redirect(303, snapshot.ref.toString());
            });
        } else {
            res.send("Strömer ned am strömen oder ned gfunden tazächlich");
        }
    }).catch(err => {
        console.log("Error is passiert gehabt", err);
        res.end('Error');
    });
});