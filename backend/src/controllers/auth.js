const passport = require('passport');
const jwt = require('jsonwebtoken');

/**
 * Controller for Microsoft SSO authentication with Azure AD/OIDC.
 * Handles login redirect, callback, token validation, and user info endpoint.
 */
class AuthController {
  // PUBLIC_INTERFACE
  /**
   * Starts Microsoft login (redirects to Azure AD login).
   *
   * @route GET /auth/microsoft
   * @returns Redirect
   */
  login(req, res, next) {
    passport.authenticate('azuread-openidconnect', { prompt: 'login', failureRedirect: '/auth/failure' })(req, res, next);
  }

  // PUBLIC_INTERFACE
  /**
   * Handles callback after Microsoft login, creates JWT and redirects to frontend with token.
   *
   * @route GET /auth/microsoft/callback
   * @returns Redirect with token (or failure)
   */
  callback(req, res, next) {
    passport.authenticate('azuread-openidconnect', { failureRedirect: '/auth/failure' }, (err, user) => {
      if (err || !user) {
        return res.redirect('/auth/failure');
      }
      // issue a JWT for the frontend to use
      const payload = {
        id: user.oid,
        email: user._json.preferred_username,
        name: user.displayName || user._json.name,
      };
      const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });

      // Redirect to frontend (you may need to change this URL/env for frontend client)
      const redirectUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/login-success?token=${token}`;
      return res.redirect(redirectUrl);
    })(req, res, next);
  }

  // PUBLIC_INTERFACE
  /**
   * Returns authentication failure.
   *
   * @route GET /auth/failure
   * @returns JSON error
   */
  failure(req, res) {
    return res.status(401).json({ status: 'fail', message: 'Authentication failed' });
  }

  // PUBLIC_INTERFACE
  /**
   * Checks/validates JWT, returns user for authenticated sessions.
   *
   * @route GET /auth/me
   * @returns User info as JSON or 401
   */
  me(req, res) {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ status: 'fail', message: 'No authorization header' });
    }
    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      return res.json({ status: 'ok', user: decoded });
    } catch (error) {
      return res.status(401).json({ status: 'fail', message: 'Invalid token' });
    }
  }
}

module.exports = new AuthController();
