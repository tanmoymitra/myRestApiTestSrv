var express = require('express')
var http = require('http')
var path = require('path')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')
var logger = require('morgan')
var helmet = require('helmet')
var cors = require('cors')
var compression = require('compression')
var cluster = require('cluster')


if (cluster.isMaster) {
    var cpuCount = require('os').cpus().length;
    for (var i = 0; i < cpuCount; i += 1) {
        cluster.fork();
    }
    cluster.on('exit', function (worker) {
        console.log('Worker %d died :(', worker.id);
        cluster.fork();
    });
} else {
    var app = express()
    app.set('port', process.env.PORT || 3000)
    app.use(compression())
    app.use(helmet())
    app.use(cors());
    app.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next()
    })

    app.use(logger('dev'))
    app.use(bodyParser.json())
    app.use(bodyParser.urlencoded({ extended: false }))
    app.use(cookieParser())
    app.use(express.static(path.join(__dirname, 'public')))

    // Version # 1.0.0 
    app.use(require('./v1/routers/apiRouters'))
    app.use(require('./v1/middlewares/commonResponse').setResponseHeader)

    http.createServer(app).listen(app.get('port'), function(){
      console.log('Express API Server Listening on port ' + app.get('port'))
    })
}
