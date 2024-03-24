module.exports = (req,res,next)=>{
    if(!req.user) res.redirect('/signin')
    if(req.user.isAdmin) next();
    else res.redirect('/profile');
}