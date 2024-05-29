
const { google } = require('googleapis');
const { clientID, clientSecret, redirectURL } = require('../config');
const { OAuth2 } = google.auth;

const oAuth2Client = new OAuth2(
  clientID,
  clientSecret,
  redirectURL
  );

  module.exports = { oAuth2Client };