const router = require('express').Router();
const authControllers = require('../controllers/authControllers');
const middlewareToken = require('../middleware');


router.post('/register', authControllers.register);
router.post('/login', authControllers.login);
router.post('/refresh', authControllers.refresh);
router.post('/logout', middlewareToken.verifyToken, authControllers.logout)


module.exports = router;