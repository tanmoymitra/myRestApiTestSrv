var express = require('express')
var http = require('http');
var path = require('path');
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var logger = require('morgan')
var helmet = require('helmet')
var cors = require('cors');

var app = express()
app.set('port', process.env.PORT || 3000)

app.use(helmet())
app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))
app.use(cors());
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(require('./routers/apiRouters'))

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express API Server Listening on port ' + app.get('port'));
})