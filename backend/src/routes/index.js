const express = require('express');
const healthController = require('../controllers/health');
const authController = require('../controllers/auth');

const router = express.Router();

/**
 * @swagger
 * /:
 *   get:
 *     summary: Health endpoint
 *     tags: [Health]
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', healthController.check.bind(healthController));

/**
 * @swagger
 * /auth/microsoft:
 *   get:
 *     summary: Start Microsoft SSO login flow
 *     tags: [Auth]
 *     description: Redirects user to Microsoft login (Azure AD) for authentication.
 *     responses:
 *       302:
 *         description: Redirects to Microsoft login page.
 */
router.get('/auth/microsoft', authController.login.bind(authController));

/**
 * @swagger
 * /auth/microsoft/callback:
 *   get:
 *     summary: Microsoft SSO login callback handler
 *     tags: [Auth]
 *     description: Handles callback after Microsoft login, issues JWT, and redirects to frontend.
 *     parameters:
 *       - name: code
 *         in: query
 *         description: Authorization code
 *         required: false
 *         schema:
 *           type: string
 *     responses:
 *       302:
 *         description: Redirect to frontend with JWT
 *       401:
 *         description: Failed login
 */
router.get('/auth/microsoft/callback', authController.callback.bind(authController));

/**
 * @swagger
 * /auth/failure:
 *   get:
 *     summary: SSO login failure endpoint
 *     tags: [Auth]
 *     description: Called when authentication fails or is cancelled.
 *     responses:
 *       401:
 *         description: Login failed.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 message:
 *                   type: string
 *                   example: Authentication failed
 */
router.get('/auth/failure', authController.failure.bind(authController));

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Returns the currently authenticated user
 *     tags: [Auth]
 *     description: Checks JWT and returns authenticated user, if valid.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User info
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     name:
 *                       type: string
 *       401:
 *         description: Not authenticated / invalid token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: fail
 *                 message:
 *                   type: string
 *                   example: Invalid token
 */
router.get('/auth/me', authController.me.bind(authController));

module.exports = router;
