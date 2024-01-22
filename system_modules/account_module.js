const conn = require("./_db_connection");
const validation_obj = require("./_validation");
const global_obj = require("./_global_scripts");

async function render_dashboard(req, res) {
  res.render("account/dashboard", {});
}

async function render_reports(req, res) {
  res.render("account/reports", {});
}

async function render_employees(req, res) {
  res.render("account/employees", {});
}

async function render_posts(req, res) {
  res.render("account/posts", {});
}

async function render_home(req, res) {
  res.render("account/home", {});
}

async function render_global_config(req, res) {
  res.render("account/global_config", {});
}
async function render_room_type(req, res) {
  res.render("account/gc_room_type", {});
}
async function render_payment_type(req, res) {
  res.render("account/gc_payment_type", {});
}
async function render_vat(req, res) {
  res.render("account/gc_vat", {});
}
async function render_currency(req, res) {
  res.render("account/gc_currency", {});
}

// employers
async function render_employers(req, res) {
  // var guests = [];
  // try {
  //   const sql_1 = "SELECT * FROM `guests` WHERE 1;";
  //   const parameters_1 = [];
  //   guests = await conn.db_conn(sql_1, parameters_1);
  // } catch (error) {
  //   console.log(error);
  // }

  //res.render("account/employers", { guests });
  res.render("account/employers");
}

async function register_new_guest(req, res) {
  console.log(req.body);
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var gender = req.body.gender;
  var natonality = req.body.natonality;
  var national_id = req.body.national_id;
  var call_number = req.body.call_number;
  var email = req.body.email;
  var address_line_1 = req.body.address_line_1;
  var address_line_2 = req.body.address_line_2;
  var address_city = req.body.address_city;
  var address_country = req.body.address_country;

  var response_obj;
  // validation
  if (validation_obj.check_empty_string(first_name)) {
    response_obj = {
      success: false,
      msg: "Field is required!",
      data: { input_id: "first_name", label_id: "label_first_name" },
    };
  } else if (validation_obj.check_empty_string(last_name)) {
    response_obj = {
      success: false,
      msg: "Field is required!",
      data: { input_id: "last_name", label_id: "label_last_name" },
    };
  } else if (!(gender === "Male" || gender === "Female")) {
    response_obj = {
      success: false,
      msg: "Invalid Input!",
      data: { input_id: "gender", label_id: "label_gender" },
    };
  } else if (validation_obj.check_empty_string(natonality)) {
    response_obj = {
      success: false,
      msg: "Field is required!",
      data: { input_id: "natonality", label_id: "label_natonality" },
    };
  } else if (validation_obj.check_empty_string(national_id)) {
    response_obj = {
      success: false,
      msg: "Field is required!",
      data: { input_id: "national_id", label_id: "label_national_id" },
    };
  } else if (
    await validation_obj.query_record_existance(
      "guests",
      "national_id",
      national_id
    )
  ) {
    response_obj = {
      success: false,
      msg: "A record with an existing ID is already registered!",
      data: { input_id: "national_id", label_id: "label_national_id" },
    };
  } else if (validation_obj.check_empty_string(call_number)) {
    response_obj = {
      success: false,
      msg: "Field is required!",
      data: { input_id: "call_number", label_id: "label_call_number" },
    };
  } else if (validation_obj.validate_email(email)) {
    response_obj = {
      success: false,
      msg: "Invalid Input!",
      data: { input_id: "email", label_id: "label_email" },
    };
  } else if (validation_obj.check_empty_string(address_line_1)) {
    response_obj = {
      success: false,
      msg: "Field is required!",
      data: { input_id: "address_line_1", label_id: "label_address_line_1" },
    };
  } else if (validation_obj.check_empty_string(address_line_2)) {
    response_obj = {
      success: false,
      msg: "Field is required!",
      data: { input_id: "address_line_2", label_id: "label_address_line_2" },
    };
  } else if (validation_obj.check_empty_string(address_city)) {
    response_obj = {
      success: false,
      msg: "Field is required!",
      data: { input_id: "address_city", label_id: "label_address_city" },
    };
  } else if (validation_obj.check_empty_string(address_country)) {
    response_obj = {
      success: false,
      msg: "Field is required!",
      data: { input_id: "address_country", label_id: "label_address_country" },
    };
  } else {
    try {
      const sql_1 =
        "INSERT INTO `guests`(  `first_name`, `last_name`, `address_line_1`, `address_line_2`, `address_city`, `address_country`,`gender`,    `nationality`,`national_id`,`call_number`,  `email` )  VALUES ( ?,?,?,?,?,?,?,?,?,?,?);";
      const parameters_1 = [
        first_name,
        last_name,
        address_line_1,
        address_line_2,
        address_city,
        address_country,
        gender,
        natonality,
        national_id,
        call_number,
        email,
      ];
      await conn.db_conn(sql_1, parameters_1);

      response_obj = { success: true, msg: "Success!" };
    } catch (error) {
      console.log(error);
      response_obj = { success: false, msg: "Server Error!" };
    }
  }

  res.send(response_obj);
}

async function render_guest_profile(req, res) {
  var guest_details;
  var guest_id = req.params.guest_id;

  var first_name;
  var last_name;
  var gender;
  var nationality;
  var national_id;
  var address_line_1;
  var address_line_2;
  var address_city;
  var address_country;
  var call_number;
  var email;
  var account_status;

  var reservations;

  try {
    var sql_1 = "SELECT * FROM `guests` WHERE guests.id = ?;";
    var parameters_1 = [guest_id];
    guest_details = await conn.db_conn(sql_1, parameters_1);

    sql_1 = "SELECT * FROM `reservations` WHERE reservations.guest_id = ?;";
    parameters_1 = [guest_id];
    reservations = await conn.db_conn(sql_1, parameters_1);

    first_name = guest_details[0].first_name;
    last_name = guest_details[0].last_name;
    gender = guest_details[0].gender;
    nationality = guest_details[0].nationality;
    national_id = guest_details[0].national_id;
    address_line_1 = guest_details[0].address_line_1;
    address_line_2 = guest_details[0].address_line_2;
    address_city = guest_details[0].address_city;
    address_country = guest_details[0].address_country;
    call_number = guest_details[0].call_number;
    email = guest_details[0].email;
    account_status = guest_details[0].account_status;
    // End of try
  } catch (error) {
    console.log(error);
  }

  res.render("account/guest_profile", {
    first_name,
    last_name,
    gender,
    nationality,
    national_id,
    address_line_1,
    address_line_2,
    address_city,
    address_country,
    call_number,
    email,
    account_status,
    reservations,
  });
}
async function render_room_calender(req, res) {
  res.render("account/r_room_calender");
}

async function render_about(req,res) {
  res.render("account/about");
}
async function render_blog(req,res) {
  res.render("account/blog");
}
async function render_categories(req,res) {
  res.render("account/categories");
}
async function render_contact(req,res) {
  res.render("account/contact");
}

module.exports = {
  render_dashboard,
  render_reports,
  render_employers,
  render_employees,
  render_posts,
  render_home,
  render_global_config,
  render_room_type,
  render_payment_type,
  render_vat,
  render_currency,
  register_new_guest,
  render_guest_profile,
  render_room_calender,
  render_about,
  render_categories,
  render_blog,
  render_contact,
};
