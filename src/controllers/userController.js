const userModel=require('../models/userModel')
const jwt=require('jsonwebtoken')
const bcrypt=require('bcryptjs')
const {isValidRequestBody,isValid,isValidObjectId} = require('../validation/validator');


const createUser = async function (req, res) {
    try {
        let requestBody = req.body
    const { title, fullName,email, password} = requestBody

        if (!isValidRequestBody(requestBody))
            return res.status(400).send({ status: false, msg: "Please Enter some data" })
        
            if (!isValid(title)) {
            return res.status(400).send({ status: false, msg: "Title is Required" })
        }
       
       const titleEnum = function (title){
           return ["Mr", "Mrs", "Miss"].indexOf(title) !== -1
       }

       if(!titleEnum(title)){
           return res.status(400).send({status:false, msg:"Is not valid title provide Mr, Mrs, Miss "})
       }
       

        if (!isValid(fullName)) {
            return res.status(400).send({ status: false, msg: "Name is Required" })
        }
        
        if (isValid(email))
            if (!(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(email)))
                return res.status(400).send({ status: false, msg: "is not a valid email" })
        if (!isValid(email))
            return res.status(400).send({ status: false, msg: "email is required" })

        
        let alreadyExistEmail = await userModel.findOne({ email: email })
        if (alreadyExistEmail) {
            return res.status(400).send({ status: false, msg: "email already exit" })
        }

        if (!isValid(password)) {
            return res.status(400).send({ status: false, msg: "Password is Required" })
        }
        // if (!(/^[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(data.password))) {
        //     return res.status(400).send({ status: false, msg: "please provide valid password with one uppercase letter ,one lowercase, one character and one number " })
        // }
        let hash = await bcrypt.hash(password, 10)

        const finalData = {title:title, fullName:fullName, email:email,password: hash }


        let savedData = await userModel.create(finalData )
        res.status(201).send({status :true, msg:"succesfully run", data: savedData })

    }
    catch (err) {
        res.status(500).send({ status: false, msg: err.message })
    }
}
const login = async function(req, res){
    try{
        let data = req.body
        if(!data){
            return res
            .status(400)
            .send({status:false, msg:"data required for login"})
        }
        let email = req.body.email
        let password = req.body.password
    
        if(!isValid(email)){
            return res
            .status(400)
            .send({status:false, msg:"email is requires"})
        }
    
        let Email = email
                let validateEmail = function (Email) {
                    return /^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(Email);
                }
                if (!validateEmail(Email)) {
                    return res.status(400).send({ status: false, message: "Please enter a valid email" })
                }
    
        let isUserExist = await userModel.findOne({email})
    
        if(!isUserExist){
            return res
            .status(404)
            .send({status:false, msg:" User Not Found Please Check Email"})
        }
    
        if(!isValid(password)){
            return res
            .status(400)
            .send({status:false, msg:"password is required"})
        }
    
        // if (!(/^[a-zA-Z0-9!@#$%^&*]{8,15}$/.test(data.password))) {
        //     return res.status(400).send({ status: false, msg: "please provide valid password" })
        // }
    
        let pass = isUserExist.password

        let check = await bcrypt.compare(password,pass)
        
        if(!check){return res.status(400).send({status:false, msg: "password is incorrect"})}
    
        let token = jwt.sign(
            {
                userId:isUserExist._id.toString(),
                iat: Math.floor(Date.now() / 1000),
               exp: Math.floor(Date.now() / 1000) + 1 * 60 * 60
            },
            "outshade",
            
        );
        res.setHeader("authorization", token)
        res
        .status(200)
        .send({status:true, message: 'user Login SuccessFull', data:{ userId:isUserExist._id, token }})
    
    }catch(err){
        res.status(500).send({ status: false, message: err.message })
    }
    }
    const logoutUser = async function (req, res) {
        try {
    
            const { email } = req.body
    
            const findEmail = await userModel.findOne({ email: email })
            console.log(findEmail)
            if (!findEmail) {
                return res.status(400).send({ status: false, msg: "user not login or user not created" })
            }
            return res.status(200).send({ status: true, message: " logout sucessfully" })
    
        }
        catch (err) {
            return res.status(500).send({ status: false, message: err.message })
        }
    }
    const resetPassword = async function (req, res) {
        try {
            let userId = req.params.userId
    
            let { password } = req.body;
    
    
            if (!isValidObjectId(userId))
                return res.status(400).json({ status: false, message: `objectId is invalid` });
    
            const userFind = await userModel.findOne({ _id: userId });
    
            if (!userFind)
                return res.status(404).send({ status: false, message: `User do not exists` });
    
            if (!isValidRequestBody(password))
                return res.status(400).json({ status: false, message: "Please provide details to update" });
    
            let updateUserData = {};
            if (password) {
                let hash = await bcrypt.hash(password, 10);
                updateUserData["password"] = hash;
            }
    
            const updatedUserData = await userModel.findOneAndUpdate({ _id: userId }, updateUserData, { new: true });
            return res.status(201).json({ status: true, msg: "password reset successfully", data: updatedUserData, });
        } catch (error) {
            return res.status(500).json({ status: false, msg: error.message });
        }
    };


module.exports.createUser=createUser;
module.exports.login=login;
module.exports.logoutUser=logoutUser;
module.exports.resetPassword=resetPassword;

