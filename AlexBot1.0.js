//ALEX: useful utilities to interact with firebase on AWS Lambda (no fbadmin available)
var https = require('https');
var firebaseHost = "fir-database-quickstart-100fb.firebaseio.com";

/*
  =>  This is an arrow function. Arrow functions are a short syntax, introduced by ECMAscript 6, that can be used similarly to the way you would use function expressions. In other words, you can often use them in place of expressions like function (foo) {...}. But they have some important differences. For example, they do not bind their own values of this. Arrow functions are part of the ECMAscript 6 specification, but not part of "normal" JavaScript in use in most browsers today. They are, however, partially supported in Node v. 4.0+ and in many browsers.
*/

function fbGet(key) {
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

function fbPut(key, value) {
    return new Promise((resolve, reject) => {
        var options = {
            hostname: firebaseHost,
            port: 443,
            path: key + ".json",
            method: 'PUT'
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
        req.end(JSON.stringify(value));
        req.on('error', reject);
    });
}


exports.handler = (event, context, callback) => {
    // this is the object we will return to Motion AI in the callback
    var responseJSON = {
        "response": "Hello Alex!", // what the bot will respond with
        "continue": true, // "true" will result in Motion AI continuing the flow based on connections, whie "false" will make Motion AI hit this module again when the user replies
        "customPayload": "", // OPTIONAL: working data to examine in future calls to this function to keep track of state
        "quickReplies": null, // OPTIONAL: a JSON string array containing suggested/quick replies to display to the user .. i.e., ["Hello","World"]
        "cards": null, // OPTIONAL: a cards JSON object to display a carousel to the user (see docs)
        "customVars": null, // OPTIONAL: an object or stringified object with key-value pairs to set custom variables eg: {"key":"value"} or '{"key":"value"}'
        "nextModule": null // OPTIONAL: the ID of a module to follow this Node JS module
    }

    //Invoke GET function
    fbGet("/Articles").then(data => {

        //console.log('response received', data);
        //ALEX: quite horrible in my opinion, but that'll do for our POC
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
        // callback to return data to Motion AI (must exist, or bot will not work)

    })


    // VIEW DOCS HERE:  https://github.com/MotionAI/nodejs-samples

    /* "event" object contains payload from Motion AI
        {
            "from":"string", // the end-user's identifier (may be FB ID, email address, Slack username etc, depends on bot type)
            "session":"string", // a unique session identifier
            "botId":"string", // the Motion AI ID of the bot
            "botType":"string", // the type of bot this is (FB, Slack etc)
            "customPayload":"string", // a developer-defined payload for carrying information
            "moduleId":"string", // the current Motion AI Module ID
            "moduleNickname":"string", // the current Motion AI Module's nickname
            "inResponseTo":"string", // the Motion AI module that directed the conversation flow to this module
            "reply":"string", // the end-user's reply that led to this module
            "result":"string" // any extracted data from the prior module, if applicable,
            "replyHistory":"object" // an object containing the current session's conversation messages
            "nlpData":"object" // stringified NLP data object parsed from a user's message to your bot if NLP engine is enabled
            "customVars":"string" // stringified object containing any existing customVars for current session
            "fbUserData":"string" // for Messenger bots only - stringified object containing user's meta data - first name, last name, and id
            "attachedMedia":"string" // for Messenger bots only - stringified object containing attachment data from the user
        }
    */




};
