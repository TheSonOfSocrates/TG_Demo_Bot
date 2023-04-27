const User = require('../models/User');
const axios = require('axios');

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const TG_SITE_LOGIN_ENDPOINT = 'https://tg-investment.com/api/user/login';

  const response = await axios.post(TG_SITE_LOGIN_ENDPOINT, {
    email,
    password
  });

  if (response.status === 200) {
    const user = await User.findOne({ email });
    if (user === null) {
      await new User({ email: response.data.user.email, accessToken: response.data.user.accessToken }).save();
      next();
    } else {
      user.accessToken = response.data.user.accessToken;
      user.save();
    }

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

    const user = await User.findOne({ accessToken });

    if (user !== null && accessToken === user.accessToken) {
      req.user = user;
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

exports.changeLicenseKey = async (req, res) => {
  let user = req.user;
  user.licenseKey = req.body.licenseKey;
  await user.save();

  const validationInfo = await isValidLicenseKey(req.user.email, req.body.licenseKey);
  res.json({ success: true });
};

exports.checkLicenseKey = async (req, res) => {
  const validationInfo = await isValidLicenseKey(req.user.email, req.body.licenseKey);
  res.json({ success: true, validationInfo: validationInfo });
};

exports.getLicenseKey = async (req, res) => {
  const validationInfo = await isValidLicenseKey(req.user.email, req.user.licenseKey);
  res.json({ licenseKey: req.user.licenseKey, validationInfo: validationInfo });
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


