const express=require('express')
const router=new express.Router()
const BookInfo=require('../models/book_info')
///get all book info
router.get('/api/v1/all_books',async(req,res,next)=>{
    try{
        const all_books=await BookInfo.find({visible: true})
        
        res.status(200).send({
            "status":"success",
             "data":all_books
        })
    }catch(e){
        next(e)
    }
})
///get a single book info
router.get('/api/v1/single_book/:book_id',async(req,res,next)=>{
    try{
        const book=await BookInfo.findById(req.params.book_id)
        if(book.visible==true){
            return res.status(200).send({
                "status":"success",
                 "data":book
            })
        }else{
            res.status(206).send({
                "status":"failed",
                 "error":"this book is not available right now"
            })
        }
        
    }catch(e){  
        next(e)
    }
})


module.exports=router