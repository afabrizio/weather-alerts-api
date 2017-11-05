var express = require('express');
var router = express.Router();
var controller = require('../api.controller');

/* GET home page. */
router.route('/screen').post(controller.screen);
router.route('/weather').post(controller.weather);

module.exports = router;
