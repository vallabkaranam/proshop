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

function fileFilter(req, file, cb) {
  // regex
  const filetypes = /jpe?g|png|webp/
  const mimetypes = /image\/jpe?g|image\/png|image\/webp/

  const extname = filetypes.test(path.extname(file.originalname).toLowerCase())
  const mimetype = mimetypes.test(file.mimetype)

  if (extname && mimetype) {
    // if extension and mimetype are the accepted ones
    cb(null, true)
  } else {
    // first argument is the error message
    cb(new Error('Images only!'), false)
  }
}

const upload = multer({ storage, fileFilter })

// only upload one image
// file.fieldname is 'image' here, can be any name
const uploadSingleImage = upload.single('image')

router.post('/', (req, res) => {
  uploadSingleImage(req, res, function (err) {
    if (err) {
      return res.status(400).send({ message: err.message })
    }

    res.status(200).send({
      message: 'Image uploaded successfully',
      image: `/${req.file.path}`,
    })
  })
})

export default router
