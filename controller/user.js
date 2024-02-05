const User = require('../model/user');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const Sib = require('sib-api-v3-sdk');
const Forget = require('../model/forget');
require("dotenv").config();

let testUserId;


async function isExists(emailSearch){
   const data = await User.find({email : emailSearch})

   if(data.length > 0){
    return data[0];
   }else{
    return false;
   }
}

function generateAccessToken(id, premium){
    return jwt.sign({userId : id, isPremium: premium} , "secret")
}

exports.postUser = async (req,res,next) => {
   
        const name = req.body.username;
    const email = req.body.email;
    const password = req.body.password;

    const check = await isExists(email);
    console.log(check);

    if(check === false){

    bcrypt.hash(password, 10, function(err, hash) {

        const user = new User({
           name: name,
           email: email,
           password: hash,
           isPremium: false,
           totalExpenses: 0
        })
        user.save()
        .then(() => {
            res.status(201).json( "Account is successfully created!!!");
        }).catch(err => {
            console.log(err);
        })
    })
}else{
    res.status(201).json("Email already exists!!!");
}
}

exports.postLogin = async (req,res,next) => {
    const email = req.body.email;
    const password = req.body.password;

    const check = await isExists(email);

    if(check === false){
        res.status(201).json("Account not found!!!");
    }else{

         bcrypt.compare(password, check.password , function(err, result) {
            if(result == true){
                res.status(201).json({status: true, token: generateAccessToken(check._id.toString() , check.isPremium)});
            }else{
                res.status(201).json({status: false});
            }
        });
    }

}


exports.postForgetPassword = async (req, res, next) => {
    const email = req.body.email;

    const user = await isExists(email);

    if(user === false){
        res.status(201).json({status: false , message: "User not exixts!!!"})
    }else{

        const forget = new Forget({
            forget_id: uuidv4(),
            email: email,
            isActive: true,
            userId: user.id
        })
        const link = "http://localhost:5000/password/resetpassword/" + forget.id
    
    const client = Sib.ApiClient.instance;
    const apiKey = client.authentications['api-key'];

    apiKey.apiKey = process.env.EMAIL_API_KEY;
  
    const transEmailApi = new Sib.TransactionalEmailsApi()

    const sender = {
        email: "ranvi1800@gmail.com",
        name: "Ranvijay"
    }

    const receivers = [{
         email: email
    }]

    transEmailApi.sendTransacEmail({
        sender,
        to: receivers,
        subject: 'Forget Password Request',
        textContent: 'Click on the link to reset password {{params.link}}',
        params: {link : link}

    }).then(() => {
        res.status(201).json({status: true});
    }).catch(err => {
        console.log(err);
        res.status(201).json({status: false});
    })
    }}


    exports.getForget = async (req, res, next) => {
        const uuid = req.params.id
        const user = await Forget.find({forget_id : uuid})

        const userForget = user[0];
        const isActive = userForget.isActive;

        testUserId = userForget.userId;

        if(isActive == true){
            userForget.isActive = false;
            await userForget.save({ fields: ['isActive'] });
            res.redirect('http://127.0.0.1:5500/views/reset/reset.html');
        }
    }

    exports.postResetPassword = async (req, res, next) => {
        const password = req.body.password;

        const users = await User.find({_id : testUserId})
        const user = users[0]

        bcrypt.hash(password, 10, async function(err, hash) {

            user.password = hash;
            await user.save({ fields: ['password'] });
         })

         res.status(201).json("true");
    }
