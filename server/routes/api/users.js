const express = require('express');
const router = express.Router();
// const upload = require('../../utils/multerConfig');

const userController = require('../../controllers/UserController');

router.post('/login', userController.login);
router.post('/get-license-key', userController.isAuthorized, userController.getLicenseKey);
router.post('/check-license-key', userController.isAuthorized, userController.checkLicenseKey);
router.post('/change-license-key', userController.isAuthorized, userController.changeLicenseKey);
router.post('/is-key-inputed', userController.isKeyInputted);
router.post('/set-key', userController.setKey);

module.exports = router;