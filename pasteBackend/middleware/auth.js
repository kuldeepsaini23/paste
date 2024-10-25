import jwt from "jsonwebtoken";
import dot from "dotenv";
dot.config();

//auth
export const auth = async (req, res, next) => {
  try {
    //extract token
    const token =  req.header("Authorization").replace("Bearer ", "")||
      req.cookies.token ||
      req.body.token;


      // console.log("TOKEN->", token);

    //if token missing, then return response
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token is missing",
      });
    } 

    console.log(token)

    //verify the token
    try {
      const decode = jwt.verify(token, process.env.JWT_SECRET);
      // console.log("decoding is running", decode);
      req.user = decode;
    } catch (err) {
      //verification - issue
      console.log("ERROR WHILE EXTRACTING TOKEN....", err);
      return res.status(401).json({
        success: false,
        message: "token is invalid " + err.message,
      });
    }
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: "Something went wrong while validating the token",
    });
  }
};

//isStudent
export const isUser = async (req, res, next) => {
  try {
    if (!req.user.id) {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Students only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role(Student) cannot be verified, please try again",
    });
  }
};


//isAdmin
export const isAdmin = async (req, res, next) => {
  try {
    if (req.user.accountType !== "Admin") {
      return res.status(401).json({
        success: false,
        message: "This is a protected route for Admin only",
      });
    }
    next();
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "User role(Admin) cannot be verified, please try again",
    });
  }
};