const jwt = require('jsonwebtoken');
const User = require('./../models/userModel');
const {promisify} = require('util');

const signToken = id => {
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn : process.env.JWT_EXPIRES_IN
    });
}

exports.signup = async (req,res,next) => {
    try{
        const newUser =  await User.create({
            name : req.body.name,
            email : req.body.email,
            mobile : req.body.mobile,
            password : req.body.password,
            passwordConfirm : req.body.passwordConfirm
        });
        const token = signToken(newUser._id);
        res.status(201).json({
            status : 'success',
            token : token,
            data : {
                user : newUser
        }
    });
    }
    catch(err){
        res.status(404).json({
            status : 'fail',
            message : err
        })
    }
}

exports.login = async (req,res,next) => {
    const { email , password } = req.body;
    // 1. Check if email and password exist
    //console.log(email,password);
    if(!email || !password){
        res.status(400).json({
            status : "fail",
            data : {
                message : "Please provide email and password..."
            }
        });
    }

    try{
        // 2. Check if user exists and password is correct
        const user = await User.findOne({email : email}).select('+password');

        if(!user || !(await user.correctPassword(password,user.password))){
        return res.status(401).json({
            status : "fail",
            message : "Please provide valid credentials!!!"
        });
        }
        // 3. If everything is ok, send token to client
        const token = signToken(user._id);
        res.status(200).json({
        status : "success",
        token : token
        });
    }
    catch(err){
        res.status(400).json({
            status : "fail",
            message : err
        });
    }

};

exports.protect = async(req,res,next) => {
    // 1. Getting token and check if it's there
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1];
    }
    if(!token){
        return res.status(401).json({
            status : "fail",
            message : "Please log in to get access..."
        });
    }
    // 2. Verification token
    const decoded = await promisify(jwt.verify)(token,process.env.JWT_SECRET);
    //console.log(decoded);

    // 3. Check if user still exists

    // 4. Check if user changed password after the token was issued

    next();
}