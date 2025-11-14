
const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    // Validate input
    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      })
    }

    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = Buffer.from(`${email}:${Date.now()}`).toString('base64')

      return res.status(200).json({
        message: 'Login successful',
        token,
        admin: {
          email,
          role: 'admin'
        }
      })
    }

    // Invalid credentials
    return res.status(401).json({
      message: 'Invalid email or password'
    })
  } catch (error) {
    res.status(500).json({
      message: 'Error during login',
      error: error.message
    })
  }
}

export default {
  adminLogin
}
