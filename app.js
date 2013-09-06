/**
 * Module dependencies.
 */

var express     = require('express'),
    routes      = require('./routes'),
    http        = require('http'),
    path        = require('path'),
    sockHandler = require('socket-handler.js');


var app     = express();
var server  = http.createServer(app);

sockHandler.init(server);


// setup NodeJS environment
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.favicon());
app.use(express.logger('dev'));

app.get('/', routes.index);

app.set('port', 1337);
server.listen(app.get('port'), function(){
    console.log('Express server listening on port ' + app.get('port'));
});


