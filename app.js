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

// Version # 1.0.0 
app.use(require('./v1/routers/apiRouters'))
app.use(require('./v1/middlewares/commonResponse').setResponseHeader)

if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
        message: err.message,
        error: err
    })
  })
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500)
    res.render('error', {
        message: err.message,
        error: {}
    })
})

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express API Server Listening on port ' + app.get('port'));
})