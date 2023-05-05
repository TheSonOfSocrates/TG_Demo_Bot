const axios = require('axios');
const mongoose = require('mongoose');
const ccxt = require('ccxt');

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const TG_SITE_LOGIN_ENDPOINT = 'https://tg-investment.com/api/user/login';

  const response = await axios.post(TG_SITE_LOGIN_ENDPOINT, {
    email,
    password
  });

  if (response.status === 200 ) {
    customer_email = response.data.user.email;
    customer_accessToken = response.data.user.accessToken;
    customer_licenseKey = response.data.user.licenseKey;

    res.json(response.data);
    return response.data;
  } else {
    res.status(401).json({
      error: 'Invalid credential.'
    });
  }
};

module.exports.isAuthorized = async function(req, res, next) {
  try {
    const accessToken = req.headers.authorization.split(' ')[1];

    if (accessToken === customer_accessToken) {
      next();
    } else {
      res.status(401).json({
        error: 'Credential doesn\'t mathch',
        your_token: accessToken
      });
    }
  } catch (e) {
    res.status(401).json({
      error: 'Something went wrong.' + e.message
    });
  }
};

exports.changeLicenseKey = async (req, res) => {
  customer_licenseKey = req.body.licenseKey;
  await isValidLicenseKey(customer_email, req.body.licenseKey);
  res.json({ success: true });
};

exports.checkLicenseKey = async (req, res) => {
  const validationInfo = await isValidLicenseKey(customer_email, req.body.licenseKey);
  res.json({ success: true, validationInfo, isKeyInputted });
};

exports.getLicenseKey = async (req, res) => {
  const validationInfo = await isValidLicenseKey(customer_email, customer_licenseKey);
  res.json({ licenseKey: customer_licenseKey, validationInfo, isKeyInputted});
};

async function isValidLicenseKey(email, licenseKey) {
  const LICENSE_CHECK_ENDPOINT = 'https://www.tg-investment.com/license/check-license-validation';
  const response = await axios.post(LICENSE_CHECK_ENDPOINT, {
    email,
    licenseKey
  });

  if (response.status === 200) {
    return response.data;
  } else {
    return null;
  }
}

module.exports.checkKeyInputted = async function(req, res, next) {
  try {
    if (isKeyInputted) {
      next();
    } else {
      res.status(503).json({
        error: 'You need to input binance key first.'
      });
    }
  } catch (e) {
    res.status(503).json({
      error: 'Something went wrong.' + e.message
    });
  }
};

exports.isKeyInputted = async (req, res) => {
  res.json({ isKeyInputted: isKeyInputted });
};

exports.setKey = async (req, res) => {
  try {
    isKeyInputted = true;
    api_credential = {
      apiKey: req.body.apiKey,
      secret: req.body.secret
    };

    binance = new ccxt.pro.binance(api_credential);
    binance.setSandboxMode(true);
  } catch (e) {
    isKeyInputted = false;
    console.log(e.toString());
    res.json({ isKeyInputted: false, msg: e.toString() });
  }

  res.json({ isKeyInputted: isKeyInputted });
};


