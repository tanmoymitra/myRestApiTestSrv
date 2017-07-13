var express = require("express")
var router = express.Router();

// All routers
router.get('/', require('../controllers/commonCtrl').all)
router.get('/api/v1/geolocation', require('../controllers/commonCtrl').geolocation)

module.exports = router