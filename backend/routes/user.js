const { Router } = require("express");

const router = Router();

const User = require("../models/user");

const {
  createTokenForUser,
  validateToken,
} = require("../services/authentication");

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
};

function sendAuthSuccess(req, res, token, message) {
  res.cookie("token", token, cookieOptions);

  return res.json({ message });
}

router.post("/signup", async (req, res) => {
  const { fullName, email, password } = req.body;

  try {
    const user = await User.create({
      fullName,
      email,
      password,
    });

    const token = createTokenForUser(user);

    return sendAuthSuccess(
      req,
      res.status(201),
      token,
      "Account Created Successfully",
    );
  } catch (error) {
    console.log("SIGNUP ERROR:", error);

    return res.status(400).json({
      message: error.message,
    });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const token = await User.matchPasswordAndGenerateToken(email, password);

    return sendAuthSuccess(req, res, token, "Logged in Successfully");
  } catch (error) {
    console.log("SIGNIN ERROR:", error);

    return res.status(401).json({
      message: error.message,
    });
  }
});

router.post("/logout", (req, res) => {
  try {
    res.clearCookie("token", cookieOptions);
    return res.status(200).json({
      message: "Logged out successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "failed to logout",
    });
  }
});

router.get("/me", async (req, res) => {
  try {
    const user = await validateToken(req.cookies.token);

    if (!user) {
      return res.status(401).json({
        authenticated: false,
      });
    }

    return res.json({
      authenticated: true,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
      },
    });
  } catch (error) {
    console.log("ME ERROR:", error);

    return res.status(401).json({
      message: "Authentication Required",
      authenticated: false,
    });
  }
});

module.exports = router;
