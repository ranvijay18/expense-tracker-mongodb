const Expense = require('../model/expense');
const User = require('../model/user');



exports.getLeaderboard = async (req, res, next) => {
   const users = await User.find({
    order:-1
   })
    
   res.status(201).json(users);
 
   
}