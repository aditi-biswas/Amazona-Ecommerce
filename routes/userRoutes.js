import express from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils.js';
import User from '../models/userModel.js';
import expressAsyncHandler from 'express-async-handler';

const userRouter = express.Router();

userRouter.post(
    '/signin',
    expressAsyncHandler(async (req,res)=>{
        const user=await User.findOne({email: req.body.email})
        if(user){
            if(bcrypt.compareSync(req.body.password, user.password)){
                res.send({
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    isAdmin: user.isAdmin,
                    token: generateToken(user) //we are using token to make authenticated requests
                });
                return;
            }
            res.status(401).send({message: 'Invalid email or password'});
        }

        res.status(401).send({message: 'Invalid email or password'});
    })
)

userRouter.post(
    '/signup',
    expressAsyncHandler(async (req,res)=>{
        const newUser= new User({
            name:req.body.name,
            email:req.body.email,
            password:bcrypt.hashSync(req.body.password),
        });
        const user=await newUser.save();   //saving newUser to database
        res.send({      // returning data to frontend
            _id: user._id,
            name: user.name,
            email: user.email,
            isAdmin: user.isAdmin,
            token: generateToken(user) 
        });
    })
);

export default userRouter;