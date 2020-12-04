const express=require('express')
const router=new express.Router()
const BookInfo=require('../models/book_info')
const multer = require('multer')
const sharp = require('sharp')



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

router.post('/api/v1/add_book',upload.single('bookImage'),async (req,res,next)=>{
    try{
        
        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer()  ///converting image data into buffer for saving on mongodb
        req.body.bookImageData = buffer
        
        const newBook=new BookInfo(req.body)
        newBook.bookImageUrl=`http://127.0.0.1:5000/cdn/book_image/${newBook._id}`
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