//ALEX: useful utilities to interact with firebase on AWS Lambda (no fbadmin available)

var https = require('https');
var firebaseHost = "fir-database-quickstart-100fb.firebaseio.com";

const request = require('request');

//This section is only required for the set() and update() ways of accessing firebase,
//unfortunately that is not working with motion Ai so I have to go the HTTP route for this
var firebase = require('firebase');
var config = {
    apiKey: "AIzaSyAGAqdV69_4vaFnNFGLnbFLnn_imE8uHBY",
    authDomain: "fir-database-quickstart-100fb.firebaseapp.com",
    databaseURL: "https://fir-database-quickstart-100fb.firebaseio.com",
    projectId: "fir-database-quickstart-100fb",
    storageBucket: "fir-database-quickstart-100fb.appspot.com",
    messagingSenderId: "334076859078"
};
firebase.initializeApp(config);



/*
Ways to Save Data
*****************
PUT	    Write or replace data to a defined path, like messages/users/user1/<data>
PATCH	Update some of the keys for a defined path without replacing all of the data.
POST	Add to a list of data in our Firebase database. Every time we send a POST request, the Firebase client generates a unique key, like messages/users/<unique-id>/<data>
DELETE	Remove data from the specified Firebase database reference.
*/

//var ref = firebase.app().database().ref();
//var usersRef = ref.child('users');


function UPDATE_PROMISE(username, email) {

    console.log("username = " + username, "email = " + email);

    return new Promise((resolve, reject) => {

        var path_ref = firebase.database().ref('/users/');
        //var email = email;
        var profile_picture = "img 2";
        //var username = username;

        var obj = {
            email: email,
            profile_picture: profile_picture,
            username: username
        };

        //path_ref.push(obj); // Creates a new ref with a new "push key"
        //path_ref.set(obj); // Overwrites the path
        //path_ref.update(obj); // Updates only the specified attributes*/

        path_ref.push(obj).then(function (ref) {
            //console.log(ref);
        }, function (error) {
            console.log("Error:", error);
        });

        /*
        req.end(JSON.stringify(value));
        req.on('error', reject);
        */


    });
}



function firebaseGet(key) {

    return new Promise((resolve, reject) => {

        var options = {
            hostname: firebaseHost,
            port: 443,
            path: key + ".json",
            method: 'GET'
        };

        var req = https.request(options, function (res) {
            res.setEncoding('utf8');
            var body = '';
            res.on('data', function (chunk) {
                body += chunk;
            });
            res.on('end', function () {
                resolve(JSON.parse(body))
            });
        });
        req.end();
        req.on('error', reject);
    });
}


function firebasePut(path, email) {

    return new Promise((resolve, reject) => {

        var options = {
            hostname: firebaseHost,
            port: 443,
            path: path + ".json",
            method: 'PUT'
        };


        var obj = {
            email: email,
            profile_picture: 'prof',
            username: 'timm'
        };

        var req = https.request(options, function (res) {
            res.setEncoding('utf8');
            var body = '';
            res.on('data', function (chunk) {
                body += chunk;
            });
            res.on('end', function () {
                resolve(body)
            });
        });
        req.end(JSON.stringify(obj));
        req.on('error', reject);
    });
}


function firebasePostNew(path, email) {

    return new Promise((resolve, reject) => {

        var options = {
            hostname: firebaseHost,
            port: 443,
            path: path + ".json",
            method: 'POST'
        };


        var obj = {
            email: email,
            profile_picture: 'prof',
            username: 'timm'
        };

        var req = https.request(options, function (res) {
            res.setEncoding('utf8');
            var body = '';
            res.on('data', function (chunk) {
                body += chunk;
            });
            res.on('end', function () {
                resolve(body)
            });
        });
        req.end(JSON.stringify(obj));
        req.on('error', reject);
    });
}


//exports.handler = (event, context, callback) => {

// this is the object we will return to Motion AI in the callback
var responseJSON = {
    "response": "<b> Thanks " + getPayloadData() + " ! </b>", // what the bot will respond with
    "continue": true, // "true" will result in Motion AI continuing the flow based on connections, whie "false" will make Motion AI hit this module again when the user replies
    "customPayload": "", // OPTIONAL: working data to examine in future calls to this function to keep track of state
    "quickReplies": null, // OPTIONAL: a JSON string array containing suggested/quick replies to display to the user .. i.e., ["Hello","World"]
    "cards": null, // OPTIONAL: a cards JSON object to display a carousel to the user (see docs)
    "customVars": null, // OPTIONAL: an object or stringified object with key-value pairs to set custom variables eg: {"key":"value"} or '{"key":"value"}'
    "nextModule": null // OPTIONAL: the ID of a module to follow this Node JS module
}

function getResponse() {
    var resp = "Enter whatever text you want in here as default";
    return resp;
}

function getPayloadData() {
    //var email = event.reply;
    var email = "greg@hat.com";
    console.log('The email supplied in the last reply is : ' + email);
    return email;
}

var emailSupplied = getPayloadData();


//Invoke 
/*UPDATE_PROMISE('tom1', 'tom_moran@1.com').then(data => {

    console.log('SUCCESS!');
    // callback to return data to Motion AI (must exist, or bot will not work)
    callback(null, responseJSON);
}, function (reason) {
    console.log('Put request was rejected and reason was ....... ' + reason);
});

*/

//Invoke PUT function
/*firebasePut("/users/userId1", emailSupplied).then(data => {

    console.log('EMAIL IS : ', emailSupplied);
    //let articles = Object.keys(data).map((k) => data[k]);
    //console.log('SUCCESS! THE DATA is ', articles);
    // callback to return data to Motion AI (must exist, or bot will not work)
    callback(null, responseJSON);


}, function (reason) {
    console.log('Put request was rejected !');
});*/


//Invoke POST function
firebasePostNew("/users/", emailSupplied).then(data => {

    console.log('EMAIL IS : ', emailSupplied);
    //let articles = Object.keys(data).map((k) => data[k]);
    //console.log('SUCCESS! THE DATA is ', articles);
    // callback to return data to Motion AI (must exist, or bot will not work)
    callback(null, responseJSON);


}, function (reason) {
    console.log('Put request was rejected !');
});


/*firebasePut("/users/userId/email", emailSupplied).then(data => {

    console.log('EMAIL IS : ', emailSupplied);
    let articles = Object.keys(data).map((k) => data[k]);
    console.log('SUCCESS! THE DATA is ', articles);


    // callback to return data to Motion AI (must exist, or bot will not work)
    callback(null, responseJSON);


}, function (reason) {
    console.log('Put request was rejected !');
});
*/

//Invoke GET function
/*firebaseGet("/Articles").then(data => {

    //The then() method returns a Promise. It takes up to two arguments: 
    // callback functions for the success and failure cases of the Promise.


        console.log('response received', data);
        // Transform response Object to Array of objects

        let articles = Object.keys(data).map((k) => data[k]);

        //Populate the bot cards so that it'll show the articles
        responseJSON.cards = [];

        articles.forEach(article => {
           // console.log('ARTICLE LOOP', responseJSON);
            responseJSON.cards.push({
                cardTitle: article.title,
                buttons: [{
                    buttonText: 'Read the post',
                    buttonType: 'url',
                    target: 'https://saascriptions.io'
                }]
            });

        });

        console.log('RESPONSE', responseJSON);
        
        // callback to return data to Motion AI (must exist, or bot will not work)
        callback(null, responseJSON);
   
    })
    */


//};
