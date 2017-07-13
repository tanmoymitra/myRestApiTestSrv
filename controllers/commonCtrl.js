const getIP = require('external-ip')();
const where = require('node-where');
var requestIp = require('request-ip');

exports.all = function(req, res){
    res.send({"status":"Express API is Working!"})
};

exports.geolocation = function(req, res){
    var clientIp = requestIp.getClientIp(req);
    res.send({"IP":clientIp});
};