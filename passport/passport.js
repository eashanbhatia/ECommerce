const passport = require('passport');
const projectUsers = require('../models/user')
const GoogleStrategy = require('passport-google-oauth20').Strategy;

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "http://localhost:4444/auth/google/callback"
  },
  async function(accessToken, refreshToken, profile, cb) {
      //Vaha pr khali logic given hoga (niche jaise diya hua hai)
      // User.findOrCreate({ googleId: profile.id }, function (err, user) {
      //   return cb(err, user);
      // });
    let user = await projectUsers.findOne({googleId: profile.id})  //Yaha await lgaya taaki pehle ye line execute ho
    try{
      // console.log(profile)  Ye btayega ki google hume kya kya lkar de rha hai on login
        if(user) return cb(null,user);   //Ye tab jb user mil gya DB mein in the collection "projectUsers" so the error is null
        user = await projectUsers.create({ //Agar nahi mila user toh ab hum user create karenge in the collection "projectUsers"
            username: profile.displayName,
            google_id:profile.id,
            google_img:profile.photos[0].value,
            google_accessToken:accessToken
        });
        return cb(null,user)
    }
    catch(err){
        done(err)
    }
  }
));
// passport.serializeUser(function(user, done) {
//     done(null, user.id);
//   });
  
//   passport.deserializeUser(function(id, done) {
//     User.findById(id, function (err, user) {
//       done(err, user);
//     });
//   });
passport.serializeUser(function(user, done) {  //Mapping user to id
    done(null, user._id);    //Mongo DB mein id (_id) krkr save hoti hai
  });

passport.deserializeUser(async function(id, done) {   //Mapping id to user
    try{
        let user = await projectUsers.findOne({_id:id});
        if(user) return done(null,user)
        done(null,false)
    }
    catch(err){
        done(err);
    }
  });