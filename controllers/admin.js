const path = require('path');
const projectProducts = require('../models/product');
const cloudinary = require('cloudinary').v2
const DatauriParser = require('datauri/parser');
const parser = new DatauriParser();
const mongoose = require('mongoose');
const productsCategory = require('../models/category');
const category = require('../models/category');

cloudinary.config({
    cloud_name: 'ddlly0w8c',
    api_key: '441434349264774',
    api_secret: 'ZwlPiHNE1cNIzT-alpv-Z0hhNKM'
});

// module.exports.getProducts = ((req, res) => {
//     res.render('admin/viewproducts', {
//         isLoggedIn: req.user ? true : false,
//         isAdmin: req.user.isAdmin
//     })
// })

module.exports.getAddProduct = (req, res) => {
    res.render('admin/addproducts', {
        isLoggedIn: req.user ? true : false,
        isAdmin: req.user.isAdmin
    })
}

module.exports.getViewProducts = async (req, res, next) => {
    try {
        let productsList = await projectProducts.find({}).populate('seller_details').populate('category');
        
        // let productsListCategory = await projectProducts.find({}).populate('category');
        // console.log(list);
        console.log("ProductsList:",productsList)
        // let categoryList = await productsCategory.find({}).populate('product_details');
        // console.log(categoryList);
        res.render('admin/viewproducts' , {
            // productsListCategory,
            productsList,    //is variable mein db ke saare products store krkr aage "viewproducts.hbs" pr bhejdenge
            isLoggedIn: req.user ? true : false,
            isAdmin: req.user.isAdmin
        })
    }
    catch (err) {
        next(err);
    }
}

//Using Cloudinary
// module.exports.postAddProduct = async (req,res,next)=>{
//     const {name,price,description} = req.body; //form se extract krliya (de-structuring)
//     const image = req.file;
//     console.log(req.file)
//     const imagePath = path.join('uploads', req.file.filename);

//     try{
//         cloudinary.uploader.upload(imagePath, async (error, result) => {
//             if (error) return next(error);
//             console.log(result);
//             let newProduct = await projectProducts.create({
//                 name,
//                 description,
//                 price,
//                 image: result.url
//             });
//             return res.redirect('/admin/viewproducts');
//         });
//     }

//     catch(err){
//         next(err);
//     }
// }


//Using DATAURI
module.exports.postAddProduct = async (req, res, next) => {
    const { name, price, description, category } = req.body; //form se extract krliya (de-structuring)
    const image = req.file;
    const myUrl = parser.format('.png', image.buffer)
    try {

        let existingCategory = await productsCategory.findOne({ 
            categoryName: category 
        });

        // If the category doesn't exist, create it

        if (!existingCategory) {
            existingCategory = await productsCategory.create({ 
                categoryName: category 
            });
        }

        let newProduct = await projectProducts.create({
            name,
            description,
            price,
            category: existingCategory._id,
            image: myUrl.content,
            seller_details: req.user._id
        })

        existingCategory.products.push(newProduct._id);
        await existingCategory.save();

        // await newProduct.populate('category');
        // console.log(newProduct.category.categoryName);
        // console.log(categoryList)
        res.redirect('/admin/viewproducts')
    }
    catch(err){
        next(err);
    }
}

module.exports.getEditProducts = async (req, res, next) => {
    const { id } = req.query;
    try {
        let productsList = await projectProducts.findOne({ _id: id })
        res.render('admin/editproducts', {
            productsList,
            isLoggedIn: req.user ? true : false,
            isAdmin: req.user.isAdmin
        })
    }

    catch (err) {
        next(err);
    }
}

module.exports.postEditProducts = async (req, res, next) => {
    const { name, description, id, price, category } = req.body;  //new values of product lenge
    const image = req.file;     //new image bhi lenge
    // console.log(image);
    // const buffer = fs.readFileSync('');
    const myUrl = parser.format('.png', image.buffer);

    try {
        let oldProductDetails = await projectProducts.findOne({ _id: id });
        let existingCategory = await productsCategory.findOne({ 
            categoryName: category 
        });

        // If the category doesn't exist, create it

        if (!existingCategory) {
            existingCategory = await productsCategory.create({ 
                categoryName: category 
            });
        }

        // Find the previous associated category
        let previousCategory = await productsCategory.findOne({ _id: oldProductDetails.category });

        // Remove the product from the previous category's products array
        previousCategory.products = previousCategory.products.filter(productId => productId.toString() !== id.toString());

        await previousCategory.save();

         // Update the product details
         oldProductDetails.name = name;
         oldProductDetails.price = price;
         oldProductDetails.description = description;
         oldProductDetails.seller_details = req.user._id;
         oldProductDetails.image = myUrl.content;
         oldProductDetails.category = existingCategory._id;
 
         // Update the category's products array
         existingCategory.products = existingCategory.products.filter(productId => productId.toString() !== id.toString());
         existingCategory.products.push(oldProductDetails._id);
 
         // Save the changes
         await oldProductDetails.save();
         await existingCategory.save();
        return res.redirect('/admin/viewproducts');
    }

    catch (err) {
        next(err);
    }
}

module.exports.getDeleteProducts = async (req, res, next) => {
    const { id } = req.query;
    try {

        let productSelected = await projectProducts.findOne({ _id: id });


        let category = await productsCategory.findOne({ _id: productSelected.category });
        //Isse category find krenge jo Product ki hogi jisse remove krna hai

        await productSelected.deleteOne();

        category.products = category.products.filter(productId => productId.toString() !== id.toString());
        //Yaha uss category ke products array mein se remove krdenge uss product ko

        await category.save();

        return res.redirect('/admin/viewproducts');
    }
    catch (err) {
        next(err);
    }
}