var express = require("express")
var router = express.Router();

router.get('/', require('../controllers/commonCtrl').all)
router.get('/geolocation', require('../controllers/commonCtrl').geolocation)

module.exports = router