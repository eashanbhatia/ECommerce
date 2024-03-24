const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
    username: {
        type:String,
        required:true
    },
    password:String,
    google_accessToken: String,
    google_img: String,
    google_id: String,
    isAdmin:{
        type: Boolean,
        required: true,
        default: false
    }
  });

  module.exports = mongoose.model('projectUsers',userSchema);  //Collection name "projectUsers" mein jaakr save hoga data