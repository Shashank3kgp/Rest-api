const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const User = require('../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post("/signup",(req,res,next)=>{
    User.find({email:req.body.email}).exec()
    .then(user => {
        if(user.length  > 0){
            return res.status(409).json({
                message:'Mail exits'
            })
        }
        else{
            bcrypt.hash(req.body.password,10,(err,hash)=>{
                if(err){
                    return res.status(500).json({
                        error : err
                    })
                }
                else{
                    const user = new User({
                        _id: new mongoose.Types.ObjectId,
                        email:req.body.email,
                        password:hash
                    });
                    user
                    .save()
                    .then(result=>{
                        return res.status(201).json({
                            message:'User created'
                        });
                    })
                    .catch(err=>{
                        return res.status(500).json({
                            error:err
                        })
                    }
                    );
                }
            })
        }
    });
})

router.post('/login',(req,res,next)=>{
    User.find({email:req.body.email})
    .exec()
    .then(user=>{
        if(user.length < 1){
            return res.status(401).json({
                 message:'Auth failed'
            })
        }
        bcrypt.compare(req.body.password,user[0].password,(err,result)=>{
            if(err){
                return res.status(401).json({
                    message:'Auth failed'
               })
            }
            if(result){
                const token = jwt.sign(
                    {email:user[0].email,
                    id:user[0]._id},
                    "secret",
                    {
                        expiresIn:"1hr"
                    }
                );
                return res.status(200).json({
                    message:'Auth successful',
                    token:token
                })
            }
            return res.status(401).json({
                message:'Auth failed'
           })
        })
    })
    .catch();
})
router.delete("/:userId",(req,res,next)=>{
    Order.deleteOne({_id:req.params.userId})
    .exec()
    .then(result=>{
        res.status(200).json({
            message:'User deleted'
        })
    })
    .catch(err=>{
        res.status(500).json({
            error:err
        })
    });
})
module.exports = router;