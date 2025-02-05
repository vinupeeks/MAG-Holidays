const express = require('express');
const membersController = require('../controllers/membersController.js');
const { protectJWT } = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.get('/leader/:id', membersController.membersList);

router.get('/details/:id', membersController.membersDetailsById);

router.put('/edit/:id', protectJWT, membersController.membersUpdation);

router.delete('/delete/:id', protectJWT, membersController.membersDeletion);

module.exports = router;
