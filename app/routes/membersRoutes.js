const express = require('express');
const membersController = require('../controllers/membersController.js');
const { protectJWT } = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.get('/leader/:id', membersController.membersList);

router.get('/details/:id', membersController.membersDetailsById);

router.delete('/delete/:id', protectJWT, membersController.membersDeletion);

router.put('/edit/:id', protectJWT, membersController.membersUpdation);

module.exports = router;
