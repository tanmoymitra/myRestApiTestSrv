var requestIp = require('request-ip');
var geoip = require('geoip-lite')
var country = require('countryjs')

exports.all = function(req, res){
    res.send({"status":"Express API is Working!"})
};

exports.geolocation = function(req, res){
    try{
        var clientIp = requestIp.getClientIp(req)
        var geo = geoip.lookup(clientIp)
        var countryDetails = country.info(geo.country)
        var data = {
                    'countryName': countryDetails.name,
                    'countryCode': '+'+countryDetails.callingCodes[0],
                    'countryID': countryDetails.ISO['2']
        }
        res.send(data);
    } catch(err) {
        res.send(err);
    }       
};