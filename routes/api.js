var express = require('express');
var router = express.Router();
var controller = require('../api.controller');

router.route('/screen').post(controller.screen);
router.route('/verify').post(controller.verify);
router.route('/weather').post(controller.weather);

module.exports = router;
