var PORT = process.env.PORT || 8080;
var express = require("express");

var app = express();
app.use(express.static(__dirname));

startServer(PORT);

function startServer(port) {
  console.log('Starting server on port', port, '...');
  app.listen(port)
    .on('error', function(){
      console.log('...port ' + port + " was already taken.");
      PORT = port + 1;
      startServer(PORT);
    });
}
