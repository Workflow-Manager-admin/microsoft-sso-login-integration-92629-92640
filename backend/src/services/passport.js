const passport = require('passport');
const { OIDCStrategy } = require('passport-azure-ad');

/**
 * Passport configuration for Azure AD OIDC integration.
 */
passport.serializeUser((user, done) => {
  done(null, user);
});
passport.deserializeUser((obj, done) => {
  done(null, obj);
});

// Strategy options should be customized as per Azure app registration.
// Use environment variables for secrets/IDs.
const oidcOptions = {
  identityMetadata: `https://login.microsoftonline.com/${process.env.AZURE_AD_TENANT_ID}/v2.0/.well-known/openid-configuration`,
  clientID: process.env.AZURE_AD_CLIENT_ID,
  responseType: 'code',
  responseMode: 'form_post',
  redirectUrl: process.env.AZURE_AD_REDIRECT_URI || 'http://localhost:3001/auth/microsoft/callback',
  allowHttpForRedirectUrl: true,
  clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
  scope: ['openid', 'profile', 'email'],
  passReqToCallback: false,
};

// PUBLIC_INTERFACE
/**
 * Setup AzureAD/OpenID Connect strategy for Passport.
 */
passport.use(
  new OIDCStrategy(oidcOptions,
    (iss, sub, profile, accessToken, refreshToken, done) => {
      // Accept all users with valid MS login
      return done(null, profile);
    }
  )
);

module.exports = passport;
