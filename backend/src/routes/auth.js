const router = require('express').Router()

const {login, refresh, logout, getUser} = require('../controllers/authController.js')

router.post('/login', login);
router.post('/refresh', refresh);
router.post('/logout', logout);
router.get('/get-user', getUser);

module.exports = router;