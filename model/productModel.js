const mongoose=require('mongoose');


const productSchema= new mongoose.Schema({
    productName:{
        type:String,
        required:true,
        trim:true,
    },
    productPrice:{
        type:String,
        required:true,
        trim:true,
    },
    productCategory:{
        type:String,
        required:true,
        trim:true,
    },
    productDescription:{
        type:String,
        required:true,
        trim:true,
    },

    productImageUrl:{
        type:String,
        required:true,
        trim:true,
    }

    

})

const Products=mongoose.model('products',productSchema);
module.exports=Products;

