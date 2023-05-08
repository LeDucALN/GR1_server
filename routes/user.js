const router = require('express').Router();
const profileController = require('../controllers/profileController');
const middlewareToken = require('../middleware');

router.get('/showProfile/:id',middlewareToken.verifyToken, profileController.show);
router.get('/deleteProfile/:id',middlewareToken.verifyTokenAdmin, profileController.delete);

module.exports = router;