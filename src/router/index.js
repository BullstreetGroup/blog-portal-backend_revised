import userRouter from './userRouter.js'
import blogRouter from './blogRouter.js'
import express from 'express'
import testRouter from './testRouter.js'
import utilsRouter from './utils.js'


export const routes = {
  userRouter,
  blogRouter,
  testRouter,
  utilsRouter
}

