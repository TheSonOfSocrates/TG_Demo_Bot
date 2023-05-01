const axios = require('axios');
const mongoose = require('mongoose');

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
      error: new Error('Invalid credential.')
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
        error: new Error('Invalid token.')
      });
    }
  } catch (e) {
    res.status(401).json({
      error: new Error('You need to sign in first.')
    });
  }
};

module.exports.isDBConnected = async function(req, res, next) {
  try {
    if (isDBConnected) {
      next();
    } else {
      res.status(503).json({
        error: new Error('You need to connect to database first.')
      });
    }
  } catch (e) {
    res.status(503).json({
      error: new Error('You need to connect to database first.')
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
  res.json({ success: true, validationInfo: validationInfo });
};

exports.getLicenseKey = async (req, res) => {
  const validationInfo = await isValidLicenseKey(customer_email, customer_licenseKey);
  res.json({ licenseKey: customer_licenseKey, validationInfo: validationInfo });
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

exports.connectDB = async (req, res) => {
  mongoose.connect(req.body.dbUrl,
    {
      useNewUrlParser: true,
      useFindAndModify: false,
      user: req.body.dbUserName,
      pass: req.body.dbPassword,
      dbName: 'TG',
      retryWrites: true,
      w: 'majority'
    }).then(() => {
    res.json({ success: true });
    isDBConnected = true;
  })
    .catch((err) => console.log(err));
};

exports.isConnectedDB = async (req, res) => {
  res.json({ isConnected: isDBConnected });
};


