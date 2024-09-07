import { Schema, model } from 'mongoose'

const blogSchema = new Schema(
  {
    thumbnail: {
      type: String,
    },
    title: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: Schema.Types.Mixed,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    tag: {
      type: String,
      index: true,
      default: 'CRYPTOCURRENCY',
    },
    slug: {
      type: String,
      index: true,
    },
    status: {
      type: String,
      enum: ['Draft', 'Published'],
      default: 'Draft',
    },
  },
  {
    timestamps: true,
  }
)

blogSchema.index({ slug: 1 })
blogSchema.index({ status: 1 })

const Blog = new model('Blog', blogSchema)

export default Blog
