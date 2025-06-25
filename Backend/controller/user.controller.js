
import User from "../model/user.model.js"; // adjust path as needed
import { errorHnandler } from "../utlis/error.js";
import jwt from "jsonwebtoken";


// Register a new user
export const registerUser = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password || username === "" || email === "" || password === "") {
   return next(errorHnandler(400, "All fields are required"));
  }

  try {
    // Check duplicate email first
    const existing = await User.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
     return  next(errorHnandler(400, "Email already exists"));
    }

    // Create user with plain password; schema will validate, then hash
    const user = new User({ username, email, password });
    await user.save();

    res.status(201).json({
      success: true,
      message: "User registered successfully",
    });
  } catch (error) {
    if (error.name === "ValidationError") {
      const msgs = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: msgs.join(", "),
      });
    }
    console.error(error);
    next(errorHnandler(500, "Internal Server Error"));
  }
};

// Signin 

export const signinUser = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password || email === "" || password === "") {
    next(errorHnandler(400, "All fields are required"));
  }

  try{
   const validUser = await User.findOne({email});
   if (!validUser){
    next(errorHnandler(400, "Invalid email or password"));
   }

   

    const token = jwt.sign({id: validUser._id}, process.env.JWT_SECRET);
    res.status(200).cookie('access_token', token, {
      httpOnly: true}).json(validUser);


  }catch (error){
    next(error)
  }
}