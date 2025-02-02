const express = require('express');
const { protectJWT } = require('../middlewares/authMiddleware.js');
const leadsFollowUpController = require('../controllers/leadsFollowUpController.js');

const router = express.Router();


router.post('/creation/:id', protectJWT, leadsFollowUpController.leadsFollowUpCreation);

router.get('/list', protectJWT, leadsFollowUpController.leadsFollowUpList);


module.exports = router;
