const axios = require('axios');
const ccxt = require('ccxt');

exports.login = async (req, res, next) => {
  const { email, password } = req.body;

  const TG_SITE_LOGIN_ENDPOINT = 'https://tg-investment.com/api/user/login';

  const response = await axios.post(TG_SITE_LOGIN_ENDPOINT, {
    email,
    password
  });

  if (response.status === 200) {
    const customer_email = response.data.user.email;
    const customer_accessToken = response.data.user.accessToken;
    const customer_licenseKey = response.data.user.licenseKey;

    if (!customerInfo) {
      customerInfo = {
        email: customer_email,
        accessToken: customer_accessToken,
        licenseKey: customer_licenseKey,
        binance_credential: undefined
      };
    } else {
      customerInfo.email = customer_email;
      customerInfo.accessToken = customer_accessToken;
      customerInfo.licenseKey = customer_licenseKey;
    }

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
    const {
      clientAccessToken,
      clientEmail,
      clientBinanceCredential
    } = JSON.parse(req.headers.authorization.split(' ')[1]);

    // check authentication
    if (!clientAccessToken) {
      return res.status(401).json({
        error: 'Credential missing.'
      });
    }

    if (!customerInfo) {
      const result = await authWithAccessToken(clientEmail, clientAccessToken);
      if (result.status === 200 && result.data.success) {
        customerInfo = {
          email: clientEmail,
          accessToken: clientAccessToken,
          licenseKey: result.data.licenseKey,
          binance_credential: undefined
        };
      } else {
        return res.status(401).json({
          error: 'Credential doesn\'t match.'
        });
      }
    }

    if (!customerInfo.accessToken) {
      const result = await authWithAccessToken(clientEmail, clientAccessToken);
      if (result.status === 200 && result.data.success) {
        customerInfo.email = clientEmail;
        customerInfo.accessToken = clientAccessToken;
        customerInfo.licenseKey = result.data.licenseKey;
      } else {
        return res.status(401).json({
          error: 'Credential doesn\'t match.'
        });
      }
    }

    // check binance credential
    if (!clientBinanceCredential) {
      return res.status(507).json({
        error: 'Binance Credential missing.'
      });
    }

    customerInfo.binance_credential = clientBinanceCredential;

    if (!binance) {
      binance = new ccxt.pro.binance(JSON.parse(clientBinanceCredential));
      binance.setSandboxMode(true);
    }

    next();
  } catch (e) {
    res.status(401).json({
      error: 'Something went wrong.' + e.message
    });
  }
};

exports.changeLicenseKey = async (req, res) => {
  customerInfo.licenseKey = req.body.licenseKey;
  await isValidLicenseKey(customerInfo.email, req.body.licenseKey);
  res.json({ success: true });
};

exports.checkLicenseKey = async (req, res) => {
  const validationInfo = await isValidLicenseKey(customerInfo.email, req.body.licenseKey);
  res.json({ success: true, validationInfo });
};

exports.getLicenseKey = async (req, res) => {
  const validationInfo = await isValidLicenseKey(customerInfo.email, customerInfo.licenseKey);
  res.json({ licenseKey: customerInfo.licenseKey, validationInfo });
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

async function authWithAccessToken(email, accessToken) {
  // const LICENSE_CHECK_ENDPOINT = 'http://localhost:5000/api/user/check-token';
  const LICENSE_CHECK_ENDPOINT = 'https://tg-investment.com/api/user/check-token';
  const response = await axios.post(LICENSE_CHECK_ENDPOINT, {
    email,
    accessToken
  });

  return response;
}