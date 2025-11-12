
import jwt from "jsonwebtoken";

export const gentoken = (userId) => {
  try {
    const token =  jwt.sign(
      { userId },
      process.env.JWTSECRETKEY,  // ✅ Corrected key name
      { expiresIn: "7d" }
    );
    console.log(token)
    return token;  // ✅ Returns a plain string
  } catch (error) {
    console.error("Token generation error:", error);
  }
};
