const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Product = require('../models/product');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

const storage = multer.diskStorage({
    destination : function(req, file, cb){
        cb(null,'./uploads/');
    },
    filename:function(req,file,cb){
        cb(null, new Date().toISOString()+file.originalname);
    }
});

const filefilter = (req,file,cb) =>{
    if(file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
        cb(null,true);  // null is that if we get any error we show null there or can send error message also 
    }
    else{
        cb(null,false);
    }
}
const upload = multer({storage:storage,limits :{
    fileSize : 1024*1024*5
},fileFilter:filefilter});

router.get('/',(req,res,next)=>{
    Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs =>{
        const response = {
            count : docs.length,
            products : docs.map(doc => {
                return {
                    name : doc.name,
                    price : doc.price,
                    _id : doc.id,
                    productImage:doc.productImage,
                    request : {
                        type: 'GET',
                        url : 'http://localhost:3000/products/'+doc.id
                    }
                }
            }) 
        }
        res.status(200).json(response);
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({
            error : err
        })
    })
});

router.post('/',checkAuth,upload.single('productImage'),(req,res,next)=>{   // through this we can store the uploaded folder into our our code and data base
    console.log(req.file);
    const product = new Product({
        _id: new mongoose.Types.ObjectId,
        name:req.body.name,
        price:req.body.price,
        productImage:req.file.path,
    });
    product.save().then(result=>{
        console.log(result);
        res.status(200).json({
            message:'Created product',
            createdProduct : {
                name:result.name,
                price:result.price,  // this validation to 
                _id: result.id,
                request:{
                    type:'GET',
                    url:'http://localhost:3000/products/'+result.id
                }
            }
        }); 
    }).catch(err=>{
        console.log(err);
    });
});

router.get('/:productId',(req,res,next)=>{
    const Id = req.params.productId;
    Product.findById(Id)
    .select('name price _id')
    .exec()
    .then(doc =>{
        console.log(doc);
        if(doc){
          res.status(200).json({
            product:doc,
            request:{
                type:'GET_all_orders',
                url: 'http://localhost:3000/products'
            }
          }
          );
        }
        else{
          res.status(404).json({
            message : 'No valid information found about the provided ID'
          })
        }
    })
    .catch(err =>{
        console.log(err);
        res.status(500).json({error:err});
    });
});

router.patch("/:productId",checkAuth, (req,res,next)=>{
    const id = req.params.productId;
    const updateOps = {};
    for(const ops of req.body){
        updateOps[ops.propName] = ops.value;
    }
    Product.update({_id:id},{$set :updateOps})
    .exec()
    .then(result =>{
        res.status(200).json({
            message:'Product details updated',
            request:{
             type:'GET',
             url:'http://localhost:3000/products/'+id
            }
        });
    })
    .error(err=>{
      console.log(err);
      res.status(500).json({
        error : err
      })
    });
})

router.delete("/:productId",checkAuth,(req,res,next)=>{
    const id = req.params.productId;
    Product.deleteOne({_id : id})   // these are mongoose functions and stuff 
    .exec()
    .then(result => {
        res.status(200).json({
            message:'Product succesfully deleted',
            request:{
                type:'POST',
                url:'http://localhost:3000/products/',
                data:{name:'String',price:'Number'}
            }
        });
    })
    .catch(err => {
        console.log(err);
        res.status(500).json({
         error : err
        })
    })
})


module.exports = router;