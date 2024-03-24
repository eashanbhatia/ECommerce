// const path = require('path');
// const express = require('express');
const isLoggedIn = require('../middleware/isLoggedIn')
const projectProducts =require('../models/product')
const mongoose = require('mongoose')
const productsCategory = require('../models/category')
module.exports.getIndex = async (req, res) => {
    // console.log(req.user); jo jo data hum mongo mein store kar rahe hai
    // console.log(req.user)
    // if(!req.user) return res.redirect('/signin')
    let products = await projectProducts.find({})
    res.render('index', {
        isLoggedIn: req.user ? true : false,  //agar req.user exist krta hai toh isLoggedIn=true hoga
        isAdmin: req?.user?.isAdmin
        //This makes the isAdmin value not mandatorily reqd, it assigns value if avlbl as req.user is undefined when the user is logged out!
    });
}

module.exports.getSignIn = (req,res)=>{
    if(req.user) return res.redirect('/profile')
    res.render('signin')
}

module.exports.getSignUp = (req,res)=>{
    if(req.user) return res.redirect('/profile')
    res.render('signup')
}

module.exports.getProfile = (req,res)=>{
    if (!req.user) return res.redirect('/signin');
    res.render('profile', {
        user: req.user,
        //Yaha se user bhejenge frontend pr profile.hbs file mein use krne ke liye
        isLoggedIn: req.user ? true : false
    });
}

module.exports.getLogOut = (req,res)=>{
    req.logout(()=>{
        res.redirect('/signin')
    })
}

module.exports.getProducts = async (req,res,next)=>{
    try {
        let productsList = await projectProducts.find({}).populate({
            path:'seller_details',
            select:'username -_id'
        });
        console.log(productsList)
        res.render('user/products', {
            productsList,
            isLoggedIn: req.user ? true : false,
            isAdmin: req?.user?.isAdmin
        })
    }
    catch (err) {
        next(err);
    }
}

// module.exports.getProducts = async(req,res,next)=>{
//     try{
//         let products = await projectProducts.find({}).populate({
//             path: 'user_id',
//             select: 'username -_id'

//         });
//         console.log(products)
//         // console.log(products.populated('user_id'))
//         res.render('user/products',{
//             products,
//             isLoggedIn: req.user?true:false,
//             isAdmin: req.user.isAdmin
//         });
//     }
//     catch(err){
//         next(err);
//     }
// }

// module.exports.getAddToCart = async (req,res,next) => {
//     const {id} = req.query;
//     try{
//     }
//     catch(err){
//     }
// }


module.exports.getProductsCategory = async (req,res,next) => {
    // const {name} = req.query;
    const {name} = req.params
    // console.log(req.params);

    try {
        // console.log('categoryName:',name)
        let categoryProducts = await productsCategory.findOne({categoryName:name}).populate({path:"products",populate:{path:"seller_details"}});
        console.log(categoryProducts.products)
        // console.log(JSON.stringify(categoryProducts.products));
        
        res.render('user/productscategory',{categorylist:categoryProducts.products})

        // const productsArray = [];

        // categoryProducts.products.forEach( async item => {
        //     // console.log(item);
        //     let finalProduct = await projectProducts.findById(item).exec();
        //     productsArray.push(finalProduct);
        //     // console.log(finalProduct);
        // });
        // console.log(productsArray);
        // res.render('user/productscategory', { productsArray });
        
        //Ek saath agar 2 await lgane ho (2 promises banane ho ek saath)
        // await Promise.all(categoryProducts.products.map(async (item) => {
        //         let finalProduct = await projectProducts.findById(item).exec();
        //         productsArray.push(finalProduct);
        //         // console.log(finalProduct);
        //     }));
            
            // res.send(productsArray)
        // Now 'productsArray' contains all the final products retrieved from the loop
        // Send 'productsArray' to the frontend
        // res.render('user/productscategory')
        // res.send(categoryProducts);
    }
    catch(err){
        console.log(err);
    }

}