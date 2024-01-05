const express = require('express');
const router = express.Router();
const Order = require('../models/order');
const { default: mongoose } = require('mongoose');
const Product = require('../models/product');
const checkAuth = require('../middleware/check-auth');

router.get('/',(req,res,next) =>{
    Order.find()
    .exec()
    .populate('product','name price')
    .then(docs =>{
        res.status(200).json({
            count : docs.length,
            orders : docs.map(doc=>{
                return {
                    _id :doc.id,
                    product : doc.product,
                    quantity : doc.quantity,
                    request : {
                        type: 'GET',
                        url:'http"//localhost:3000/orders/'+doc.id
                    }
                }
            })
        });
    })
    .catch(err=>{
        res.status(500).json({error :err})
    }
    );
});

router.post('/',checkAuth,(req,res,next) =>{
    Product.findById(req.body.orderId)
    .exec()
    .then(product=>{
        if(!product){
            return res.status(500).json({
                message : 'Product not found'
            })
        }
        const order = new order({
            _id : mongoose.Types.ObjectId,
            quantity : req.body.quantity,
            product : req.body.ObjectId
        });
        return order.save();
    })
    .then(result=>{
        res.status(201).json({
            message:'order stored',
            createdorder :{
                _id:result.id,
                 product : result.product,
                 quantity : result.quantity
            },
            request :{
                type:'GET',
                url : 'http://localhost:3000/orders/'+result.id
            }
        })
    })
    .catch(err=>{
        res.status(500).json({
            error :err
        });
    })
});

router.get('/:orderId',(req,res,next) =>{
    const Id = req.params.orderId;
    Order.findById(Id)
    .exec()
    .populate('product')   // what ever schema we will be defining that is the only thing we will be working with and stuff that is the important part of all the remaining things and stuff 
    .then(result =>{
        if(!result){
            return res.status(400).json({
                message : 'No order found'
            })
        }
        res.status(201).json({
            order : order,
            request: {
                type:'GET',
                url :'http://localhost:3000/orders/'
            }
        })
    })
    .catch(err =>{
        res.status(500).json({
            error :err
        })
    });
});

router.delete('/:orderId',checkAuth,(req,res,next)=>{
    Order.deleteOne({_id:req.params.orderId})
    .exec()
    .then(result=>{
        res.status(200).json({
            message:'order deleted',
            request : {
                type: "POST",
                url : 'http://localhost:3000/orders',
                body:{productId : 'ID',quantity : 'Number'}
            }
        })
    })
    .catch();
})

module.exports = router;      