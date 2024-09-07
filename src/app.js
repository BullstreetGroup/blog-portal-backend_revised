dotenv.config()
import express from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import { models } from './models/index.js'
import { routes } from './router/index.js'
import dotenv from 'dotenv'
import connectDB from './db/db.js'

const app = express()

// const corsOptions = {
//   origin: process.env.CORS_ORIGIN,
//   // origin: 'http://localhost:5173',
//   credentials: true,
// }

const allowedOrigins = [
  'https://wiseadvice.in',
  'https://clever-bublanina-62161e.netlify.app', // frontend origin of blog portal
  'http://localhost:5173',
]

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.includes(origin) || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  credentials: true,
}

app.use(cors(corsOptions))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(cookieParser())

app.use((req, res, next) => {
  req.context = {
    models,
  }
  next()
})

app.use('/', routes?.testRouter)
app.use('/', routes?.userRouter)
app.use('/', routes?.blogRouter)
app.use('/', routes?.utilsRouter)


connectDB()
  .then(() => {
    app.listen(process.env.PORT, async () => {
      console.log(`Server is running at ${process.env.PORT || 9000}`)
    })
  })
  .catch((err) => {
    console.log('Connection Failed: ', err)
  })
