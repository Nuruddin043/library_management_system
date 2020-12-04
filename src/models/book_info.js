const mongoose=require('mongoose') 

const string_required={
    type:String,
    required:true,
    trim:true
}

const book_infoSchema=new mongoose.Schema({
    bookName:{
        ...string_required
    },
    author:{
        ...string_required
    },
    genre:{
        ...string_required
    },
    releaseDate:{
        ...string_required
    },
    bookImageUrl:{
        type:String,
        trim:true
    },
    bookImageData:{
        type:Buffer
    },
    visible:{
        type:Boolean,
        default:true
    }
})

///to delete image data
book_infoSchema.methods.toJSON = function(){
    const book=this
    const bookObject= book.toObject()
    delete bookObject.bookImageData
    return bookObject
}

const BookInfo=mongoose.model('BookInfo',book_infoSchema)

module.exports=BookInfo
