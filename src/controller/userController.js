import bcrypt from 'bcryptjs'

export const currentUser = async (req, res) => {
  try {
    const { user } = req
    res.status(200).send(user)
  } catch (error) {
    res.status(400).send(error)
  }
}

export const register = async (req, res) => {
  try {
    const {
      context: {
        models: { User },
      },
    } = req
    const { body } = req

    await User.create(body)

    const user = await User.findOne({ email: body.email }).select('-password')

    res.status(200).send(user)
  } catch (error) {
    res.status(400).send(error)
  }
}

export const login = async (req, res) => {
  try {
    const {
      context: {
        models: { User },
      },
    } = req
    const {
      body: { email, password },
    } = req

    const existingUser = await User.findOne({ email })

    if (!existingUser) {
      return res.status(404).send({ message: 'User2 not found' })
    }

    const passwordCorrect = await existingUser.isPasswordCorrect(password)
    if (!passwordCorrect) {
      return res.status(404).send({ message: 'incorrect password' })
    }
    const token = existingUser.generateAccessToken()
    res.status(200).send({ token, message: 'User logged in successfully' })
  } catch (error) {
    res.status(400).send(error)
  }
}

export const changePassword = async (req, res) => {
  try {
    const {
      context: {
        models: { User },
      },

      body: { password, newPassword },
      user,
    } = req

    if (!user) {
      return res.status(400).send({ message: 'User not found' })
    }

    const existingUser = await User.findById(user._id)
    if (!existingUser) {
      return res.status(400).send({ error: 'User not found' })
    }

    const passwordCorrect = await existingUser.isPasswordCorrect(password)
    if (!passwordCorrect) {
      return res.status(401).send({ message: 'Incorrect old password' })
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10)

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { password: hashedPassword },
      { new: true }
    )

    if (!updatedUser) {
      return res.status(400).send({ error: 'Failed to update password' })
    }

    res.status(200).send({ message: 'Password updated successfully' })
  } catch (error) {
    res.status(500).send(error)
  }
}

export const changeEmail = async (req, res) => {
  try {
    const {
      context: {
        models: { User },
      },
      user,
    } = req

    const {
      body: { email },
    } = req

    if (!user?._id) {
      return res.status(400).send({ error: 'User not found' })
    }

    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).send({ error: 'Email already in use' })
    }

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      { email },
      { new: true }
    )

    if (!updatedUser) {
      return res.status(400).send({ error: 'Failed to update email' })
    }

    res.status(200).send({ message: 'Email updated successfully' })
  } catch (error) {
    res.status(400).send(error)
  }
}
