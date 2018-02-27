/*const request = require('request');

request('http://stackabuse.com', function(err, res, body) {  
    console.log(body);
});
*/
var request = require("request");
var options = {
    method: 'GET'
    , url: 'https://api.motion.ai/messageBot'
    , qs: {
        bot: '86709'
        , msg: 'Hello there mr robot, I#m human and my name is Thomas'
        , session: '86709_api_1234'
        , key: 'def053717cc857fdb07fc54fab1f145c'
    }
};
request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(body);
});