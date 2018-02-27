var request = require("request");
var options = {
    method: 'POST'
    , url: 'https://api.motion.ai/messageHuman'
        //, body: 'to=1234'
        
    , form: {
        to: 'heydude'
        , session: '86709_api_1234'
        , bot: '86709'
        , key: 'def053717cc857fdb07fc54fab1f145c'
        , msg: 'Hello there Mr Thomas, Im a bot  and my name is MR ROBOT'
    }
};
request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(body);
});