const express = require('express');
const { protectJWT } = require('../middlewares/authMiddleware.js');
const packagesController = require('../controllers/packagesController.js'); 

const router = express.Router();


router.post('/list', protectJWT, packagesController.packagesList);

router.post('/creation', protectJWT, packagesController.packagesCreation);

router.get('/details/:id', protectJWT, packagesController.packagesDetailsById);

router.put('/edit/:id', protectJWT, packagesController.packagesUpdation);

router.delete('/delete/:id', protectJWT, packagesController.packagesDeletion);

module.exports = router;
