const express = require("express");// You're importing the Express library so you can use its features (like routing, middleware, etc.).
const router = express.Router()//This creates a new Router instance — basically a mini Express app that you can attach routes to.
const authController = require("../controllers/authController");
router.post("/signup",authController.signup)//if the route is signup then execute signup function in authController
router.post("/signin",authController.signin)//if the route is signin then execute signin function in authController
router.post("/signout",authController.signout)
router.patch("/send-verification-code",authController.sendVerificationCode)

module.exports = router// 