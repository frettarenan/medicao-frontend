const express = require('express');
const app = express();

app.use(express.static(__dirname + '/dist'));

app.get('*', function(req, res) {
  if(req.headers['x-forwarded-proto'] != 'https')
    res.redirect('https://' + req.get('host') + req.url);
  else
    res.sendFile(__dirname + '/dist/index.html');
});

app.listen(process.env.PORT || 4200);