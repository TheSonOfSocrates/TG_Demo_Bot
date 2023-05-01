const express = require('express');
const router = express.Router();
const flightController = require('../../controllers/FlightController');
const userController = require('../../controllers/UserController');

router.get('/get', userController.isDBConnected, flightController.getFlights);
router.get('/get/:id', userController.isDBConnected, flightController.getFlightById);
router.post('/getBalance', userController.isDBConnected, flightController.getBalance);
router.post('/create', userController.isDBConnected, flightController.createFlight);
router.get('/datas', userController.isDBConnected, flightController.getDatas)

module.exports = router;
