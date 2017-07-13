const getIP = require('external-ip')();
const where = require('node-where');
var requestIp = require('request-ip');

exports.all = function(req, res){
    res.send({"status":"Express API is Working!"})
};

exports.geolocation = function(req, res){
    var clientIp = requestIp.getClientIp(req);
    where.is(clientIp, function(err, result) {
        if (err) { throw err; }
        req.geoip = ip;
        req.geoLoc = result.attributes;
        var data = {
            ip: clientIp,
            geo:result.attributes
        };
        res.send(JSON.stringify(data));
    });
};