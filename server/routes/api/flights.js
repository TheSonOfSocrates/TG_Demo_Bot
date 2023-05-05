const express = require('express');
const router = express.Router();
const flightController = require('../../controllers/FlightController');
const userController = require('../../controllers/UserController');

router.get('/get', userController.isAuthorized, flightController.getFlights);
router.get('/get/:id', userController.isAuthorized, flightController.getFlightById);
router.post('/getBalance', userController.isAuthorized, flightController.getBalance);
router.post('/create', userController.isAuthorized, flightController.createFlight);
router.get('/datas', userController.isAuthorized, flightController.getDatas)

module.exports = router;