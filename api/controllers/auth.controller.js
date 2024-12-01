import User from "../models/user.model.js";
import bcryptjs from "bcryptjs";
import { errorHandler } from "../utils/error.js";
import jwt from "jsonwebtoken";

// Helper function to validate password strength
const validatePassword = (password) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(password);
};

// Helper function to generate a random password
const generateRandomPassword = () => {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@$!%*?&";
  let password = "";
  for (let i = 0; i < 12; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
};

// Helper function to generate a random phone number
const generateRandomPhone = () => {
  const areaCode = Math.floor(100 + Math.random() * 900);
  const centralOfficeCode = Math.floor(100 + Math.random() * 900);
  const lineNumber = Math.floor(1000 + Math.random() * 9000);
  return `${areaCode}-${centralOfficeCode}-${lineNumber}`;
};

// Helper function to generate a random date of birth (user must be at least 18 years old)
const generateRandomDateOfBirth = () => {
  const start = new Date(1970, 0, 1);
  const end = new Date();
  end.setFullYear(end.getFullYear() - 18);
  const date = new Date(
    start.getTime() + Math.random() * (end.getTime() - start.getTime())
  );
  return date;
};

// Helper function to generate a random 5-digit zipcode
const generateRandomZipcode = () => {
  return Math.floor(10000 + Math.random() * 90000).toString();
};

// Helper function to generate a valid username
const generateValidUsername = (name) => {
  // Remove non-alphanumeric characters and ensure the username starts with a letter
  let baseUsername = name.toLowerCase().replace(/[^a-zA-Z0-9]/g, "");
  if (!/^[a-zA-Z]/.test(baseUsername)) {
    baseUsername = "user" + baseUsername;
  }
  const randomSuffix = Math.floor(Math.random() * 1000);
  return `${baseUsername}${randomSuffix}`;
};

export const signup = async (req, res, next) => {
  const { username, email, phone, dateOfBirth, zipcode, password } = req.body;

  // Collect error messages
  let errorMessages = [];

  // Basic field validation
  if (!username || !email || !phone || !dateOfBirth || !zipcode || !password) {
    errorMessages.push("All fields are required");
  }

  // Password strength validation
  if (!validatePassword(password)) {
    errorMessages.push(
      "Password must be strong (at least 8 characters including upper/lowercase letters, numbers, and special characters)."
    );
  }

  try {
    // Check if username already exists
    const existingUsername = await User.findOne({ username });
    if (existingUsername) {
      errorMessages.push("Username already exists.");
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      errorMessages.push("Email already exists.");
    }

    // If there are any error messages, return them
    if (errorMessages.length > 0) {
      return res.status(400).json({
        message: errorMessages.join(", "),
      });
    }

    // Hash the password
    const hashPassword = bcryptjs.hashSync(password, 10);

    // Create new user with hashed password
    const newUser = new User({
      username,
      email,
      phone,
      dateOfBirth,
      zipcode,
      password: hashPassword,
    });

    await newUser.save();
    res.json("Signup successful");
  } catch (error) {
    if (error.name === "ValidationError") {
      // Extract the first validation error message
      const message = Object.values(error.errors)
        .map((err) => err.message)
        .join(", ");
      return res.status(400).json({ message });
    }
    next(error);
  }
};

export const signin = async (req, res, next) => {
  const { email, password } = req.body;

  // Collect error messages
  let errorMessages = [];

  // Basic field validation
  if (!email || !password) {
    errorMessages.push("All fields are required");
  }

  try {
    // Check if email exists
    const user = await User.findOne({ email });
    if (!user) {
      errorMessages.push("Email does not exist.");
    } else {
      // Check if password matches
      const isMatch = bcryptjs.compareSync(password, user.password);
      if (!isMatch) {
        errorMessages.push("Password does not match.");
      }
    }

    // If there are any error messages, return them
    if (errorMessages.length > 0) {
      return res.status(400).json({
        message: errorMessages.join(", "),
      });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id }, 'jz185');

    // Remove password from user object
    const { password: pass, ...rest } = user._doc;

    // If no errors, signin successful
    res
      .status(200)
      .cookie("access_token", token, {
        httpOnly: true,
      })
      .json(rest);
  } catch (error) {
    next(error);
  }
};

// Log out user
export const logoutUser = (req, res) => {
  try {
    // If using sessions, destroy the session
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to log out" });
      }
      // Clear the session cookie on the client side
      res.clearCookie("connect.sid"); // If using express-session

      return res.status(200).json({ message: "Logged out successfully" });
    });

    // If using JWT, no need to destroy the session, just remove the token on the client side
    // res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Server error during logout", error });
  }
};

export const google = async (req, res, next) => {
  const { name, email, googlePhotoURL } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      // User already exists, generate token and log them in
      const token = jwt.sign({ id: user._id }, 'jz185');
      const { password, ...rest } = user._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    } else {
      // Generate random values for a new user
      const generatedPassword = generateRandomPassword();
      const generatedPhone = generateRandomPhone();
      const generatedDateOfBirth = generateRandomDateOfBirth();
      const generatedZipcode = generateRandomZipcode();

      // Hash the generated password
      const hashPassword = bcryptjs.hashSync(generatedPassword, 10);

      // Create new user with generated values
      const newUser = new User({
        username: generateValidUsername(name),
        email,
        phone: generatedPhone,
        dateOfBirth: generatedDateOfBirth,
        zipcode: generatedZipcode,
        password: hashPassword,
        profilePicture: googlePhotoURL,
      });

      await newUser.save();

      const token = jwt.sign({ id: newUser._id }, 'jz185');
      const { password, ...rest } = newUser._doc;
      res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
        })
        .json(rest);
    }
  } catch (error) {
    next(error);
  }
};
