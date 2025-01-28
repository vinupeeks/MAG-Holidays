const express = require('express');
const rolesController = require('../controllers/rolesController.js');
const { protectJWT, isAdmin } = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.get('/list', protectJWT, isAdmin,  rolesController.rolesList);


module.exports = router;
