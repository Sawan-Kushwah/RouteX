import jwt from 'jsonwebtoken'
import BusDriver from '../models/busDriverModel.js'
import bcrypt from 'bcrypt';

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: 'Email and password are required'
      });
    }

    // ADMIN LOGIN
    if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
      const token = jwt.sign(
        { email, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '2h' }
      );

      res.cookie("authToken", token, {
        httpOnly: true,
        secure: true,       // because Render is HTTPS
        sameSite: "None",   // because frontend & backend are different origins
        maxAge: 24 * 60 * 60 * 1000
      });


      return res.status(200).json({
        message: 'Login successful',
        token,
        user: { email, role: 'admin' }
      });
    }

    // DRIVER LOGIN
    const driver = await BusDriver.findOne({ email });

    if (!driver) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, driver.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { email, role: 'driver' },
      process.env.JWT_SECRET,
      { expiresIn: '2h' }
    );

    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true,       // because Render is HTTPS
      sameSite: "None",   // because frontend & backend are different origins
      maxAge: 24 * 60 * 60 * 1000
    });

    return res.status(200).json({
      message: 'Login successful',
      token,
      user: { email, role: 'driver' }
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Error during login',
      error: error.message
    });
  }
};


// VERIFY TOKEN
const verifyToken = (req, res) => {
  const token = req.cookies.authToken;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(token, decoded)
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true,       // because Render is HTTPS
      sameSite: "None",   // because frontend & backend are different origins
      maxAge: 24 * 60 * 60 * 1000
    });


    return res.status(200).json({
      valid: true,
      user: decoded,
      authToken: token
    });

  } catch (err) {
    return res.status(401).json({ valid: false, message: "Invalid token" });
  }
};


// LOGOUT
const logout = (req, res) => {
  try {
    res.cookie("authToken", token, {
      httpOnly: true,
      secure: true,       // because Render is HTTPS
      sameSite: "None",   // because frontend & backend are different origins
      maxAge: 24 * 60 * 60 * 1000
    });
    return res.status(200).json({ message: "Logged out" });

  } catch (error) {
    return res.status(401).json({ valid: false, message: "Invalid token" });
  }
};

export default {
  login,
  verifyToken,
  logout
};
