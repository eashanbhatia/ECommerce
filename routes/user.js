const path = require('path');
const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const isLoggedIn = require('../middleware/isLoggedIn');


router.get('/',userController.getIndex);

router.get('/signin',userController.getSignIn);

router.get('/signup',userController.getSignUp);

router.get('/profile',userController.getProfile);

router.get('/logout',userController.getLogOut);

router.get('/products',isLoggedIn,userController.getProducts);

// router.get('/productscategory',userController.getProductsCategory);

router.get('/category/:name',userController.getProductsCategory);

// router.get('/addtocart',userController.getAddToCart);

module.exports = router;