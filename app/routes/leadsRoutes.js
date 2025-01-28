const express = require('express');
const leadsController = require('../controllers/leadsController.js');
const { protectJWT, isAdmin, isUser } = require('../middlewares/authMiddleware.js');

const router = express.Router();

router.post('/list', protectJWT, leadsController.leadsList);

router.post('/creation', protectJWT, leadsController.leadsCreation);

router.get('/details/:id', protectJWT, leadsController.leadsDetailsById);

router.put('/edit/:id', protectJWT, leadsController.leadsUpdation);

router.delete('/delete/:id', protectJWT, leadsController.leadsDeletion);

module.exports = router;