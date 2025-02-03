const express = require('express');
const { protectJWT } = require('../middlewares/authMiddleware.js');
const countryController = require('../controllers/countryController.js'); 

const router = express.Router();


router.post('/list', countryController.countryList);

router.post('/creation', protectJWT, countryController.countryCreation);

router.get('/details/:id', protectJWT, countryController.countryDetailsById);

router.put('/edit/:id', protectJWT, countryController.countryUpdation);

router.delete('/delete/:id', protectJWT, countryController.countryDeletion);

module.exports = router;
