const express = require("express");
const router = express.Router();

users_obj = require("../system_modules/users_module");

router.get("/signout", users_obj.signout);

router.get("/signin", users_obj.signin);
router.post("/signin", users_obj.process_signin);
module.exports = router;
