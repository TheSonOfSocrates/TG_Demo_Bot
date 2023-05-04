const express = require('express');
const router = express.Router();
const flightController = require('../../controllers/FlightController');
const userController = require('../../controllers/UserController');

router.get('/get', userController.checkKeyInputted, flightController.getFlights);
router.get('/get/:id', userController.checkKeyInputted, flightController.getFlightById);
router.post('/getBalance', userController.checkKeyInputted, flightController.getBalance);
router.post('/create', userController.checkKeyInputted, flightController.createFlight);
router.get('/datas', userController.checkKeyInputted, flightController.getDatas)

module.exports = router;