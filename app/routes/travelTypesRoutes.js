const express = require('express');
const { protectJWT } = require('../middlewares/authMiddleware.js');
const travelTypesController = require('../controllers/travelTypesController.js');

const router = express.Router();


router.post('/list', protectJWT, travelTypesController.travelTypesList);

router.post('/creation', protectJWT, travelTypesController.travelTypesCreation);

router.get('/details/:id', protectJWT, travelTypesController.travelTypesDetailsById);

router.put('/edit/:id', protectJWT, travelTypesController.travelTypesUpdation);

router.delete('/delete/:id', protectJWT, travelTypesController.travelTypesDeletion);

module.exports = router;
