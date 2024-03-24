const path = require('path');
const express = require('express');
const router = express.Router();
const adminController = require('../controllers/admin')
const multer  = require('multer')

// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads')
//   },
//   filename: function (req, file, cb) {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
//     const extension = path.extname(file.originalname);
//     cb(null, file.fieldname + '-' + uniqueSuffix  + extension)
//   }
// })

const storage = multer.memoryStorage()
const upload = multer({ storage: storage })
// const upload = multer({ storage: storage })

router.post('/addproduct',upload.single('image'),adminController.postAddProduct)
// router.get('/products',adminController.getProducts)
router.get('/addproduct',adminController.getAddProduct)
router.get('/viewproducts',adminController.getViewProducts)

router.get('/editproducts',adminController.getEditProducts)
router.post('/editproducts',upload.single('image'),adminController.postEditProducts)
router.get('/deleteproducts',adminController.getDeleteProducts)


module.exports = router;
