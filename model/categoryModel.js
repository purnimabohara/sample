const mongoose=require('mongoose');
const Schema = mongoose.Schema;

const categorySchema= new mongoose.Schema({
    categoryName:{
        type:String,
        required:true,
        trim:true,
    },
  
    categoryImageUrl:{
        type:String,
        required:true,
        trim:true,
    },
    items: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Item',
      },
    ],
    // menus: [
    //     {
    //       type: Schema.Types.ObjectId,
    //       ref: 'Menu',
    //     },
    //   ],

    

});

const Categories=mongoose.model('categories',categorySchema);
module.exports=Categories;

