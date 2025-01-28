const express = require('express');
const userController = require('../controllers/userController.js');
const { protectJWT, isAdmin, rolesList } = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.post('/login', userController.loginUser);

router.post('/creation', userController.createUser);

router.post('/list', userController.getAllUsers);

router.put('/edit/:id', protectJWT, isAdmin, userController.userUpdate);

router.get('/details/:id', protectJWT, isAdmin, userController.getUserById);

router.delete('/delete/:id', protectJWT, isAdmin, userController.deleteUser);

router.put('/password/reset/:id', protectJWT, isAdmin, userController.adminChangepassword);

router.put('/password/forgot', protectJWT, userController.userForgetPassword);

router.put('/password/change', protectJWT, userController.userChangePassword);

module.exports = router;
