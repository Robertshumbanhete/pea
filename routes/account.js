const express = require("express");
const router = express.Router();

account_obj = require("../system_modules/account_module");

router.get("/", account_obj.render_dashboard);

// front desk
router.get("/employers", account_obj.render_employers);
router.post("/guests/register_new", account_obj.register_new_guest);
router.get("/guest/:guest_id", account_obj.render_guest_profile);

//employees
router.get("/employees", account_obj.render_employees);
router.get("/employees/:room_id/room_calender", account_obj.render_room_calender);



router.get("/posts", account_obj.render_posts);

// room service
router.get("/dashboard/home", account_obj.render_home);

// system admin
router.get("/global_config", account_obj.render_global_config);
router.get("/global_config/room_type", account_obj.render_room_type);
router.get("/global_config/payment_type", account_obj.render_payment_type);
router.get("/global_config/vat", account_obj.render_vat);
router.get("/global_config/currency", account_obj.render_currency);

// reports
router.get("/reports", account_obj.render_reports);



//about page
router.get("/about", account_obj.render_about);


//categories page
router.get("/categories", account_obj.render_categories);

//blog page
router.get("/blog", account_obj.render_blog);

//contact page
router.get("/contact", account_obj.render_contact);



module.exports = router;
