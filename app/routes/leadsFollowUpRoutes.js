const express = require('express');
const { protectJWT } = require('../middlewares/authMiddleware.js');
const leadsFollowUpController = require('../controllers/leadsFollowUpController.js');

const router = express.Router();


router.post('/creation/:id', protectJWT, leadsFollowUpController.leadsFollowUpCreation);

router.get('/list', protectJWT, leadsFollowUpController.leadsFollowUpList);

// router.post('/creation/group', protectJWT, leadsFollowUpController.groupleadsFollowUpCreation);

// router.get('/group/members/:id', protectJWT, leadsFollowUpController.getGroupMembers);

// router.get('/details/:id', protectJWT, leadsFollowUpController.leadsFollowUpDetailsById);

// router.put('/edit/:id', protectJWT, leadsFollowUpController.leadsFollowUpUpdation);

// router.delete('/delete/:id', protectJWT, leadsFollowUpController.leadsFollowUpDeletion);

module.exports = router;
