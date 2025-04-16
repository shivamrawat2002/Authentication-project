const express = require("express");// You're importing the Express library so you can use its features (like routing, middleware, etc.).
const router = express.Router()//This creates a new Router instance — basically a mini Express app that you can attach routes to.
const authController = require("../controllers/authController");
router.post("/signup",authController.signup)

module.exports = router// 