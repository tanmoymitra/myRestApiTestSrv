var express = require("express")
var router = express.Router();

router.get('/', require('../controllers/commonCtrl').all)

module.exports = router