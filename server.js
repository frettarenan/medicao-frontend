const express = require('express');
const app = express();

app.use(express.static(__dirname + '/dist'));

http.get('/', function (req, res) {
  res.redirect('https://' + req.get('host') + req.url);
});

/*app.get('/*', function(req, res) {
  res.sendFile(__dirname + '/dist/index.html');
});*/

app.listen(process.env.PORT || 4200);
