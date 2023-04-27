const express = require('express');
const router = express.Router();
const flightController = require('../../controllers/FlightController');

router.get('/get', flightController.getFlights);
router.get('/get/:id', flightController.getFlightById);
router.post('/getBalance', flightController.getBalance);
router.post('/create', flightController.createFlight);
router.get('/datas', flightController.getDatas)

module.exports = router;
