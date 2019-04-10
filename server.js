

// Require and create the Express framework
var express = require('express');
var app = express();

// Determine port to listen on
app.listen(process.env.PORT || 4200);

// Enable reverse proxy support in Express. This causes the
// the "X-Forwarded-Proto" header field to be trusted so its
// value can be used to determine the protocol. See 
// http://expressjs.com/api#app-settings for more details.
app.enable('trust proxy');

// Add a handler to inspect the req.secure flag (see 
// http://expressjs.com/api#req.secure). This allows us 
// to know whether the request was via http or https.
app.use(function (req, res, next) {
  if (req.secure) {
    // request was via https, so do no special handling
    next();
  } else {
    // request was via http, so redirect to https
    res.redirect('https://' + req.headers.host + req.url);
  }
});

// Allow static files in the /dist directory to be served
app.use(express.static(__dirname + '/dist'));

app.get('/*', function(req, res) {
  res.sendFile(__dirname + '/dist/index.html');
});