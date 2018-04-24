const http = require('http');

http.createServer((request, response) => {
    //var url = "https://api.motion.ai/messageBot";

    const {
        headers,
        method,
        url
    } = request;

    let body = [];
    request.on('error', (err) => {
        console.error(err);
    }).on('data', (chunk) => {
        body.push(chunk);
    }).on('end', () => {
        body = Buffer.concat(body).toString();
        // At this point, we have the headers, method, url and body, and can now
        // do whatever we need to in order to respond to this request.
        response.writeHead(200, {
            "Content-Type": "text/html"
        });

        response.write('<!DOCTYPE html>' +
            '<html>' +
            ' <head>' +
            ' <meta charset="utf-8" />' +
            ' <title>My Node.js page!</title>' +
            ' </head>' +
            ' <body>' +
            ' <h1>My Basic Node.js starting page!</h1>' +
            ' <p>And this is a paragraph of <strong>HTML</strong>!</p>' +
            body +
            ' </body>' +
            '</html>');

        response.end();
        console.log(body);
    });
}).listen(8080, () => {
    console.log("Server started on port 8080")
}); // Activates this server, listening on port 8080.


//NEXT STEP is to Integrate the below....... 

/*

var request = require('request');

var options = {
    method: 'GET',
    url: 'https://api.motion.ai/messageBot',
    qs: {
        bot: 'bot',
        msg: 'msg',
        session: 'session',
        key: 'key'
    }
};

request(options, function (error, response, body) {
    if (error) throw new Error(error);

    console.log(body);
});

*/
