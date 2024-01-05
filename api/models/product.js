const mongoose = require('mongoose');

const productschema = mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    name:String,
    price:{type:Number,required:true},
    productImage:{type:String,required:true},
});

module.exports = mongoose.model('Product',productschema);