var express = require("express")
var router = express.Router();

// All routers
router.get('/', require('../controllers/commonCtrl').all)
router.get('/api/v1/geolocation', require('../controllers/commonCtrl').geolocation)
router.get('/api/v1/webhook', require('../controllers/facebookChatBotCtrl').validate)
router.post('/api/v1/webhook', require('../controllers/facebookChatBotCtrl').sendMessage)

module.exports = router