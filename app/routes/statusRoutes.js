const express = require('express');
const { protectJWT } = require('../middlewares/authMiddleware.js');
const statusController = require('../controllers/statusController.js'); 

const router = express.Router();


router.post('/list', protectJWT, statusController.statusList);

router.post('/creation', protectJWT, statusController.statusCreation);

router.get('/details/:id', protectJWT, statusController.statusDetailsById);

router.put('/edit/:id', protectJWT, statusController.statusUpdation);

router.delete('/delete/:id', protectJWT, statusController.statusDeletion);

module.exports = router;
