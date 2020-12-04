const express=require('express')
const router=new express.Router()
const BookInfo=require('../models/book_info')
const multer = require('multer')
const sharp = require('sharp')


///multipart data handler 
const upload = multer({

    limits: {
      fileSize: 5000000
    },
    fileFilter(req, file, cb) {
      if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
        return cb(new Error('FILE must be image'))
      }
      cb(undefined, true)
    }
  })
//add a new book 
router.post('/api/v1/add_book',upload.single('bookImage'),async (req,res,next)=>{
    try{
        
        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()  ///converting image data into buffer for saving on mongodb
        req.body.bookImageData = buffer
        
        const newBook=new BookInfo(req.body)
        newBook.bookImageUrl=`http://library043.herokuapp.com/cdn/book_image/${newBook._id}`
        await newBook.save()

        delete newBook.bookImageData

        res.status(201).send({
            "status":"success",
            "data":newBook
        })
    }catch(e){
        next(e)
    }
})

//update a book info
router.patch('/api/v1/update_book/:book_id',async(req,res,next)=>{
  try{
    const updates = Object.keys(req.body)
    const allowedUpdates = ['bookName', 'author','genre','releaseDate','visible']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({"status":"failed", error: `Invalid updates! you can update these value ['bookName', 'author','genre','releaseDate','visible']` })
    }

    const book = await BookInfo.findOne({ _id: req.params.book_id})
    if (!book) {
        return res.status(404).send({"status":"failed", error: 'book data not found!' })
    }

    updates.forEach((update) => book[update] = req.body[update])
    await book.save()

    res.status(201).send({
      "status":"success",
      "data":book
  })
  }catch(e){
    next(e)
  }
})


//delete a book info
router.delete('/api/v1/delete_book/:book_id',async(req,res,next)=>{
  try{
    const book= await BookInfo.findOneAndDelete({_id:req.params.book_id})
    if(!book){
        return res.status(404).send({"status":"failed", error: 'book data not found!' })
    }
    res.status(201).send({
      "status":"success",
      "data":book
  })
  }catch(e){
    next(e)
  }
})



//activate a book data
router.post('/api/v1/activate_book',async (req,res,next)=>{
  try{
      
      const book = await BookInfo.findById(req.body.book_id) 
      
      if (!book) {
        throw new Error()
      }
      book.visible=true
      await book.save()


      res.status(200).send({
          "status":"success",
          "data":book
      })
  }catch(e){
      next(e)
  }
})

//deactivate a book data
router.post('/api/v1/deactivate_book',async (req,res,next)=>{
  try{
      
      const book = await BookInfo.findById(req.body.book_id) 
      
      if (!book) {
        throw new Error()
      }
      book.visible=false
      await book.save()


      res.status(200).send({
          "status":"success",
          "data":book
      })
  }catch(e){
      next(e)
  }
})




//image route for sending buffer data into png format from mongodb.
router.get('/cdn/book_image/:id', async (req, res) => {
    try {
      const book = await BookInfo.findById(req.params.id)
      if (!book || !book.bookImageData) {
        throw new Error()
      }
  
      res.set('Content-Type', 'image/png')
      res.send(book.bookImageData)
  
  
    } catch {
      res.status(404).send()
    }
  })


module.exports=router