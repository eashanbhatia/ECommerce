const mongoose = require('mongoose');
const {Schema} = mongoose;

const categorySchema = new Schema({
    // product_details:{
    //     type: Schema.ObjectId,  //_id
    //     required: true,
    //     ref: 'projectProducts'
    // },
    categoryName:
    {
        type:String,
        required:true
    },

    products:[
        {
            type: Schema.ObjectId,
            required: true,
            ref: 'projectProducts'
        }
    ]
});



module.exports = mongoose.model('productsCategory',categorySchema);
//Collection name "productsCategory" mein jaakr save hoga data