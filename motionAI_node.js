exports.handler = (event, context, callback) => {

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

    // this is the object we will return to Motion AI in the callback
    var responseJSON = {
        "response": "Hello Thomas! Let's begin the Trivia Quiz!", // what the bot will respond with
        "continue": false, // "true" will result in Motion AI continuing the flow based on connections, whie "false" will make Motion AI hit this module again when the user replies
        "customPayload": "", // OPTIONAL: working data to examine in future calls to this function to keep track of state
        "quickReplies": null, // OPTIONAL: a JSON string array containing suggested/quick replies to display to the user .. i.e., ["Hello","World"]
        "cards": null, // OPTIONAL: a cards JSON object to display a carousel to the user (see docs)
        "customVars": null, // OPTIONAL: an object or stringified object with key-value pairs to set custom variables eg: {"key":"value"} or '{"key":"value"}'
        "nextModule": null // OPTIONAL: the ID of a module to follow this Node JS module
    }

    // callback to return data to Motion AI (must exist, or bot will not work)
    //callback(null, responseJSON);
    
    var request = require('request'); // require the request library so that we can make an API call below

      if (event.customPayload) { // if the customPayload exists, that means we have some prior working data (in this case, the correct answer to the prior question)

          var rand = getRandomInt(1,4);

          if (event.customPayload == event.reply) {
              if (rand == 1)
              responseJSON.response = "Bingo!  Good job!";
              if (rand == 2)
              responseJSON.response = "I'm impressed.";
              if (rand == 3)
              responseJSON.response = "Well done.";
              if (rand == 4)
              responseJSON.response = "Very nice.";
          } else {
              responseJSON.response = "That is incorrect. It was: "+event.customPayload;
          }

      } else {
          // customPayload was empty - AKA, this was the first trivia question
      }

    // API call to Open Trivia DB
      request("https://www.opentdb.com/api.php?amount=1&difficulty=easy", function(error, response, body) {

         var json = JSON.parse(body);

         var qrArray = []; // prepare an array that contains quickReplies to display

         qrArray.push(replaceHTMLEntities(json.results[0].correct_answer)); // push the correct answer to this question

         for (var i = 0; i < json.results[0].incorrect_answers.length; i++) {
          qrArray.push(replaceHTMLEntities(json.results[0].incorrect_answers[i])); // push each of the incorrect answers to list as multiple choice options
         }

        shuffle(qrArray); // shuffle the quick replies so that the correct one is not always first

        // display results from last question and append next trivia question
        responseJSON.response = responseJSON.response+" ::next-1000:: "+replaceHTMLEntities(json.results[0].question);

        responseJSON.quickReplies = qrArray; // add our quick replies object to the callback JSON

        // store the current correct answer in customPayload so that it can be compared against their answer
        responseJSON.customPayload = replaceHTMLEntities(json.results[0].correct_answer);

        // return the data to Motion AI!
        callback(null, responseJSON);

      });
};

// functions used above
function shuffle(a) {
    var j, x, i;
    for (i = a.length; i; i--) {
        j = Math.floor(Math.random() * i);
        x = a[i - 1];
        a[i - 1] = a[j];
        a[j] = x;
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

// this is only needed because our demo lives on FB Messenger, where HTML is not supported
function replaceHTMLEntities(str) {
 	str = str.replace(/&quot;/g, '"');
 	return str.replace(/&(.*?);/g, '');
}