const jwt = require('jsonwebtoken');
const User = require('../model/user');

const authenticate = async (req, res, next) => {
   try {
       const token = req.header('Authorization');
       const user = jwt.verify(token, process.env.JWT_SECRET_KEY); // Use environment variable for secret
       const userFromDB = await User.findById(user.userId); // Use await for async operation
       if (!userFromDB){
           throw new Error('Invalid user ID'); // Throw specific error for invalid user
       }

       req.user = userFromDB;
       next()

   } catch (err) {
       console.error(err); // Log error for debugging
       return res.status(401).json({ success: false, message: 'Unauthorized' }); // Provide informative error response
   }
};

// const authenticate = (req, res, next) =>{
//     try{
//        const token = req.header('Authorization');
//        const user = jwt.verify(token, 'secretkey');
//        User.find({_id: user.userId})
//        .then(user => {
//         req.user = user;
//         next();
//        })
//        .catch(err => {
//         console.log(err);
//        })
//     }
//     catch(err){
//        return res.status(401).json({success: false});
//     }
// }


module.exports = {authenticate};