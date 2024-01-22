const express = require("express");
const router = express.Router();

users_obj = require("../system_modules/users_module");

router.get("/users", users_obj.render_users);
router.get("/user/:param_user_id", users_obj.render_user_details);
router.get(
  "/user/:param_user_id/account_access",
  users_obj.render_user_account_access
);

router.post(
  "/user/:param_user_id/update/account_details",
  users_obj.update_account_details
);
router.post("/user/:param_user_id/update/password", users_obj.change_password);

router.post(
  "/user/:param_user_id/update/account_access",
  users_obj.update_account_access
);
router.post("/user/add", users_obj.add_user);

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

router.get("/sync", users_obj.sync);
router.post("/sync", users_obj.process_sync);

module.exports = router;
