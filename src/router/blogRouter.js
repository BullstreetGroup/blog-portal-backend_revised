import express from 'express'
import { authMiddleware } from '../middleware/authMiddleware.js'
import {
  publishBlog,
  deleteBlog,
  editBlog,
  getBlog,
  getBlogs,
  saveAsDraft,
  publishDraft,
  searchBlogs,
  getSlugs,
} from '../controller/blogController.js'
import multer from 'multer'

const blogRouter = express.Router()

const storage = multer.memoryStorage()
const upload = multer({ storage })

blogRouter.get('/blogs', getBlogs)
blogRouter.get('/blog/:id', getBlog)
blogRouter.get('/slugs', getSlugs)

blogRouter.post(
  '/publish',
  authMiddleware,
  upload.single('thumbnail'),
  publishBlog
)
blogRouter.put(
  '/edit/:id',
  authMiddleware,
  upload.single('thumbnail'),
  editBlog
)
blogRouter.delete('/delete/:id', authMiddleware, deleteBlog)
blogRouter.post(
  '/save-as-draft',
  authMiddleware,
  upload.single('thumbnail'),
  saveAsDraft
)

blogRouter.get('/search', authMiddleware, searchBlogs)

blogRouter.put('/publish-draft/:id', authMiddleware, publishDraft)
export default blogRouter
