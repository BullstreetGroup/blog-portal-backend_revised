import jwt from 'jsonwebtoken'

const validateToken = async (authToken) => {
  const token = authToken.slice(7, authToken.length)
  return new Promise((resolve, reject) => {
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, {}, (err, decoded) => {
      if (err) {
        reject(err)
      }
      return resolve(decoded)
    })
  })
}

export const authMiddleware = async (req, res, next) => {
  try {
    const {
      context: {
        models: { User },
      },
    } = req

    const token = req.headers.authorization

    if (token) {
      let userData
      if (!token.startsWith('Bearer ')) {
        res.status(400).send({ message: 'Invalid' })
        return false
      }

      userData = await validateToken(token)

      const user = await User.findOne({ _id: userData?._id }).select(
        '-password'
      )

      if (!user) {
        res.status(400).send({ message: 'user not exist' })
        return false
      }
      req.user = user
      next()
    } else {
      res.status(400).send({ message: 'unauthorized' })
    }
  } catch (error) {
    res.status(404).send(error)
  }
}
