import path from 'path'
import express from 'express'
import multer from 'multer'

const router = express.Router()

const storage = multer.diskStorage({
  // where we want to store the file
  destination(req, file, cb) {
    cb(null, 'uploads/') // null is for error, second argument is where we want to store the file
  },
  filename(req, file, cb) {
    cb(
      null,
      `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`
    )
  },
})

function checkFileType(file, cb) {
  // regex
  const filetypes = /jpg|jpeg|png/
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = filetypes.test(file.mimetype)
  if (extname && mimetype) {
    // if extension and mimetype are the accepted ones
    return cb(null, true)
  } else {
    // first argument is error message
    cb('Images only!')
  }
}

const upload = multer({
  storage,
})

// only upload one image
// file.fieldname is 'image' here, can be any name
router.post('/', upload.single('image'), (req, res) => {
  res.send({ message: 'Image Uploaded', image: `/${req.file.path}` })
})

export default router
