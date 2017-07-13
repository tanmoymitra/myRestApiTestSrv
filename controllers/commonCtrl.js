const getIP = require('external-ip')();
const where = require('node-where');

exports.all = function(req, res){
    res.send({"status":"Express API is Working!"})
};

exports.geolocation = function(req, res){
    getIP(function (err, ip) {
        if (err) { throw err; }
        where.is(ip, function(err, result) {
            if (err) { throw err; }
            req.geoip = ip;
            req.geoLoc = result.attributes;
            var data = {
                ip: ip,
                geo:result.attributes
            };
            res.send(JSON.stringify(data));
        });
    });
};