const mongoose = require('mongoose');
const {Schema} = mongoose;


const productSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    image:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    ratings:Number,
    description:String,
    reviews:[
    {
        username:String,
        comment:String
    }
    ],
    seller_details:{
        type: Schema.ObjectId,  //_id
        required: true,
        ref: 'projectUsers'
    },
    category:{
        type: Schema.ObjectId,
        required:true,
        ref: 'productsCategory'
    }
});



module.exports = mongoose.model('projectProducts',productSchema)
//"projectProducts" name se Collection banaenge