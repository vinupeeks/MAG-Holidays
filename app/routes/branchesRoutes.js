const express = require('express');
const { protectJWT } = require('../middlewares/authMiddleware.js');
const branchesController = require('../controllers/branchesController.js');
const { route } = require('./userRoutes.js');

const router = express.Router();


router.post('/list', branchesController.branchesList);

router.post('/creation', protectJWT, branchesController.branchesCreation);

router.get('/details/:id', protectJWT, branchesController.branchesDetailsById);

router.put('/edit/:id', protectJWT, branchesController.branchesUpdation);

router.delete('/delete/:id', protectJWT, branchesController.branchesDeletion);

module.exports = router;
