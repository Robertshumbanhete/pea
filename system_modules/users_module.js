const conn = require("./_db_connection");
const validation_obj = require("./_validation");
const global_obj = require("./_global_scripts");
const mysql = require("mysql");

// AUTH********************
function signout(req, res) {
  req.session.destroy();
  res.redirect("/signin");
}
// *******************

async function render_users(req, res) {
  const users = await _get_users();

  const select_user_role = await global_obj.get_select("user_roles", "name");
  const select_access_level = [
    { id: 1, name: "Level 1" },
    { id: 2, name: "Level 2" },
    { id: 3, name: "Level 3" },
  ];

  res.render("users/users_list", {
    users,
    select_user_role,
    select_access_level,
  });
}

async function _get_users() {
  try {
    const sql_1 =
      "SELECT users.id,  users.username, CONCAT(users.first_name,' ', users.last_name) as full_name FROM users ;";
    const parameters_1 = [];
    const results = await conn.db_conn(sql_1, parameters_1);

    return results;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function render_user_details(req, res) {
  const param_user_id = req.params.param_user_id;

  const user_details = await _get_user_details(param_user_id);

  res.render("users/users_details", { user_details, param_user_id });
}
async function _get_user_details(param_user_id) {
  try {
    const sql_1 =
      "SELECT  users.first_name, users.last_name, users.username, users.email, users.password, users.status FROM users WHERE users.id = ?;";
    const parameters_1 = [param_user_id];
    const results = await conn.db_conn(sql_1, parameters_1);

    return results[0];
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function render_user_account_access(req, res) {
  const param_user_id = req.params.param_user_id;

  const select_user_role = await global_obj.get_select("user_roles", "name");
  const select_access_level = [
    { id: 1, name: "Level 1" },
    { id: 2, name: "Level 2" },
    { id: 3, name: "Level 3" },
  ];

  const user_account_access_details = await _get_user_account_access_details(
    param_user_id
  );

  res.render("users/users_account_access", {
    param_user_id,
    select_user_role,
    select_access_level,
    user_account_access_details,
  });
}

async function _get_user_account_access_details(param_user_id) {
  try {
    const sql_1 =
      "SELECT users.user_role, users.access_level FROM users WHERE users.id = ?;";
    const parameters_1 = [param_user_id];
    const results = await conn.db_conn(sql_1, parameters_1);

    return results[0];
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function update_account_details(req, res) {
  const param_user_id = req.params.param_user_id;

  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const username = req.body.username;
  const email = req.body.email;
  const acc_status = req.body.acc_status;

  if (
    await _validate_user_details(
      first_name,
      last_name,
      username,
      email,
      acc_status
    )
  ) {
  } else if (
    await _validate_username_existance_update(username, param_user_id)
  ) {
    response_obj = {
      success: false,
      msg: "Username is in use!",
      data: { label_id: "label_username", input_id: "username" },
    };
  } else {
    if (
      await _update_user_details(
        first_name,
        last_name,
        username,
        email,
        acc_status,
        param_user_id
      )
    ) {
      response_obj = { success: true, msg: "Success" };
    } else {
      response_obj = { success: false, msg: "Server Error" };
    }
  }

  res.send(response_obj);
}

async function _validate_username_existance_update(username, param_user_id) {
  try {
    const sql_1 =
      "SELECT users.id FROM users WHERE users.username = ? AND users.id != ?;";
    const parameters_1 = [username, param_user_id];
    const results = await conn.db_conn(sql_1, parameters_1);

    return results[0];
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function _validate_user_details(
  first_name,
  last_name,
  username,
  email,
  acc_status
) {
  // validation

  acc_status = global_obj.format_number_by_validation(acc_status);

  if (validation_obj.check_empty_string(first_name)) {
    response_obj = {
      success: false,
      msg: "Field is required!",
      data: { label_id: "label_first_name", input_id: "first_name" },
    };
  } else if (validation_obj.check_empty_string(last_name)) {
    response_obj = {
      success: false,
      msg: "Field is required!",
      data: { label_id: "label_last_name", input_id: "last_name" },
    };
  } else if (validation_obj.check_empty_string(username)) {
    response_obj = {
      success: false,
      msg: "Field is required!",
      data: { label_id: "label_username", input_id: "username" },
    };
  } else if (email && validation_obj.validate_email(email)) {
    response_obj = {
      success: false,
      msg: "Invalid Email!",
      data: { label_id: "label_email", input_id: "email" },
    };
  } else if (!(acc_status === 1 || acc_status === 0)) {
    response_obj = {
      success: false,
      msg: "Invalid Status!",
      data: { label_id: "label_acc_status", input_id: "acc_status" },
    };
  } else {
    response_obj = 0;
  }

  return response_obj;
}

async function _update_user_details(
  first_name,
  last_name,
  username,
  email,
  acc_status,
  param_user_id
) {
  try {
    const sql_1 =
      "UPDATE `users` SET  `first_name`= ?,`last_name`= ?,`username`= ?,`email`= ?, `status`= ?  WHERE users.id = ?;";
    const parameters_1 = [
      first_name,
      last_name,
      username,
      email,
      acc_status,
      param_user_id,
    ];
    const results = await conn.db_conn(sql_1, parameters_1);

    console.log(results);

    return results.affectedRows;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function change_password(req, res) {
  const param_user_id = req.params.param_user_id;

  const new_password = req.body.new_password;
  const confirm_password = req.body.confirm_password;

  if (!new_password) {
    response_obj = {
      success: false,
      msg: "Field is required!",
      data: { label_id: "label_new_password", input_id: "new_password" },
    };
  } else if (!confirm_password) {
    response_obj = {
      success: false,
      msg: "Field is required!",
      data: {
        label_id: "label_confirm_password",
        input_id: "confirm_password",
      },
    };
  } else if (new_password !== confirm_password) {
    response_obj = {
      success: false,
      msg: "Paswwords do not match!",
      data: {
        label_id: "label_confirm_password",
        input_id: "confirm_password",
      },
    };
  } else if (validation_obj.validate_password(new_password)) {
    response_obj = {
      success: false,
      msg: "Invalid password. Your password must be at least 8 characters!",
      data: {
        label_id: "label_confirm_password",
        input_id: "confirm_password",
      },
    };
  } else {
    if (await _update_password(new_password, param_user_id)) {
      response_obj = { success: true, msg: "Success" };
    } else {
      response_obj = { success: false, msg: "False" };
    }
  }

  res.send(response_obj);
}

async function _update_password(password, param_user_id) {
  try {
    const sql_1 = "UPDATE `users` SET  `password`= ? WHERE  users.id = ?;";
    const parameters_1 = [password, param_user_id];
    const results = await conn.db_conn(sql_1, parameters_1);

    return results.affectedRows;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function update_account_access(req, res) {
  const param_user_id = req.params.param_user_id;

  var access_level = req.body.access_level;
  const user_role = req.body.user_role;

  if (await _validate_account_accesss(access_level, user_role)) {
  } else {
    if (await _update_account_access(user_role, access_level, param_user_id)) {
      response_obj = { success: true, msg: "Success" };
    } else {
      response_obj = { success: false, msg: "False" };
    }
  }

  res.send(response_obj);
}

async function _validate_account_accesss(access_level, user_role) {
  access_level = global_obj.format_number_by_validation(access_level);

  if (
    !(await validation_obj.query_record_existance(
      "user_roles",
      "id",
      user_role
    ))
  ) {
    response_obj = {
      success: false,
      msg: "Invalid User Role!",
      data: { label_id: "label_user_role", input_id: "user_role" },
    };
  } else if (
    !(access_level === 1 || access_level === 2 || access_level === 3)
  ) {
    response_obj = {
      success: false,
      msg: "Invalid Access Level (only valid for 1-3 range)!",
      data: { label_id: "label_access_level", input_id: "access_level" },
    };
  } else {
    response_obj = 0;
  }

  return response_obj;
}

async function _update_account_access(user_role, access_level, param_user_id) {
  try {
    const sql_1 =
      "UPDATE users SET `user_role`=?,`access_level`=? WHERE users.id = ?;";
    const parameters_1 = [user_role, access_level, param_user_id];
    const results = await conn.db_conn(sql_1, parameters_1);

    return results.affectedRows;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function add_user(req, res) {
  const first_name = req.body.first_name;
  const last_name = req.body.last_name;
  const username = req.body.username;
  const email = req.body.email;
  const acc_status = req.body.acc_status;

  const user_role = req.body.user_role;
  const access_level = req.body.access_level;

  const new_password = req.body.new_password;
  const confirm_password = req.body.confirm_password;

  if (
    await _validate_user_details(
      first_name,
      last_name,
      username,
      email,
      acc_status
    )
  ) {
  } else if (
    await validation_obj.query_record_existance("users", "username", username)
  ) {
    response_obj = {
      success: false,
      msg: "Username is in use!",
      data: { label_id: "label_username", input_id: "username" },
    };
  } else if (await _validate_account_accesss(access_level, user_role)) {
  } else if (validation_obj.check_empty_string(new_password)) {
    response_obj = {
      success: false,
      msg: "Field is required!",
      data: { label_id: "label_new_password", input_id: "new_password" },
    };
  } else if (validation_obj.check_empty_string(confirm_password)) {
    response_obj = {
      success: false,
      msg: "Field is required!",
      data: {
        label_id: "label_confirm_password",
        input_id: "confirm_password",
      },
    };
  } else if (confirm_password !== new_password) {
    response_obj = {
      success: false,
      msg: "Passwords do not match!",
      data: {
        label_id: "label_confirm_password",
        input_id: "confirm_password",
      },
    };
  } else {
    if (
      await _insert_user(
        first_name,
        last_name,
        username,
        email,
        new_password,
        acc_status,
        user_role,
        access_level
      )
    ) {
      response_obj = { success: true, msg: "Success" };
    } else {
      response_obj = { success: false, msg: "Server Error" };
    }
  }

  res.send(response_obj);
}

async function _insert_user(
  first_name,
  last_name,
  username,
  email,
  new_password,
  acc_status,
  user_role,
  access_level
) {
  try {
    const sql_1 =
      "INSERT INTO `users`(`first_name`, `last_name`, `username`, `email`, `password`, `status`, `user_role`, `access_level`) VALUES ( ?,?,?,?,?,?,?,?);";
    const parameters_1 = [
      first_name,
      last_name,
      username,
      email,
      new_password,
      acc_status,
      user_role,
      access_level,
    ];
    const results = await conn.db_conn(sql_1, parameters_1);

    return results.insertId;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function signin(req, res) {
  res.render("auth/signin");
}

async function process_signin(req, res) {
  username = req.body.username;
  password = req.body.password;

  var response_obj;

  var user_id;

  // validation
  if (validation_obj.check_empty_string(username)) {
    response_obj = {
      success: false,
      msg: "Field is required!",
      data: { label_id: "label_username", input_id: "username" },
    };
  } else if (validation_obj.check_empty_string(password)) {
    response_obj = {
      success: false,
      msg: "Field is required!",
      data: { label_id: "label_password", input_id: "password" },
    };
  } else {
    q_res = await _check_user_detail_from_db(username, password);

    if (q_res) {
      user_id = q_res.id;
      account_status = q_res.account_status;

      if (account_status === 0) {
        response_obj = {
          success: false,
          msg: "Your account is pending verification!",
          data: { label_id: "label_username", input_id: "username" },
        };
      } else if (account_status === 2) {
        response_obj = {
          success: false,
          msg: "Your account has been suspended!",
          data: { label_id: "label_username", input_id: "username" },
        };
      } else {
        req.session.user_id = user_id;
        response_obj = { success: true, msg: "Success" };
      }
    } else {
      response_obj = {
        success: false,
        msg: "An account with the credential you provided does not exist!",
        data: { label_id: "label_username", input_id: "username" },
      };
    }
  }

  res.send(response_obj);
}

async function _check_user_detail_from_db(username, password) {
  try {
    const sql_1 =
      "SELECT users.id, users.status FROM users WHERE (users.username = ? OR users.email = ?) AND users.password = ?;";
    const parameters_1 = [username, username, password];
    const results = await conn.db_conn(sql_1, parameters_1);

    if (results.length) {
      return results[0];
    } else {
      return 0;
    }
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> SYNC
async function sync(req, res) {
  res.render("users/sync");
}

async function process_sync(req, res) {
  var response_obj;

  try {
    // Remote Host

    if (
      (await _sync_loans()) &&
      (await _sync_loan_payments()) &&
      (await _sync_loans_billing()) &&
      (await _sync_customers()) &&
      (await _sync_orders()) &&
      (await _sync_orders_amount_in_hand()) &&
      (await _sync_orders_billing()) &&
      (await _sync_orders_interest())
    ) {
      response_obj = { success: true, msg: "Sync Completed" };
    } else {
      response_obj = {
        success: false,
        msg: "Processing Failed. Please check the quality of your network!",
      };
    }
  } catch (error) {
    console.log(error);
    response_obj = { success: false, msg: "Server Error!" };
  }

  res.send(response_obj);
}

async function _sync_loans() {
  try {
    // Fetch remote server last insert
    var sql_1 =
      "SELECT loans.id FROM `loans` WHERE 1 ORDER BY loans.id DESC LIMIT 1;";
    var parameters_1 = [];
    var results = await conn.db_conn_remote(sql_1, parameters_1);

    var last_id = 0;

    if (results.length) {
      last_id = parseInt(results[0].id);
    }

    // Fetch local Server
    sql_1 = "SELECT * FROM `loans` WHERE  loans.id > ?;";
    parameters_1 = [last_id];
    results = await conn.db_conn(sql_1, parameters_1);

    results.forEach(async (element) => {
      // Insert into Remote Server
      sql_1 =
        "INSERT INTO `loans`(`id`, `customer_name`, `customer_id`, `customer_address`, `customer_phone_number`, `loan_date`, `due_date`, `loan_amount`, `interest_percentage`, `interest_amount`, `payment_due`, `status`, `user`, `date_settled`) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?);";
      parameters_1 = [
        element.id,
        element.customer_name,
        element.customer_id,
        element.customer_address,
        element.customer_phone_number,
        element.loan_date,
        element.due_date,
        element.loan_amount,
        element.interest_percentage,
        element.interest_amount,
        element.payment_due,
        element.status,
        element.user,
        element.date_settled,
      ];
      await conn.db_conn_remote(sql_1, parameters_1);
    });

    return 1;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

async function _sync_loan_payments() {
  try {
    // Fetch remote server last insert
    var sql_1 =
      "SELECT loan_payments.id FROM loan_payments WHERE 1 ORDER BY loan_payments.id DESC LIMIT 1";
    var parameters_1 = [];
    var results = await conn.db_conn_remote(sql_1, parameters_1);

    var last_id = 0;

    if (results.length) {
      last_id = parseInt(results[0].id);
    }

    // Fetch local Server
    sql_1 = "SELECT * FROM loan_payments WHERE loan_payments.id > ?;";
    parameters_1 = [last_id];
    results = await conn.db_conn(sql_1, parameters_1);

    results.forEach(async (element) => {
      // Insert into Remote Server
      sql_1 =
        "INSERT INTO `loan_payments`(`id`, `loan_id`, `description`, `prev_balance`, `new_balance`, `amount_paid`, `interest_charged`, `date`, `next_due_date`, `user_id`) VALUES ( ?,?,?,?,?,?,?,?,?,?);";
      parameters_1 = [
        element.id,
        element.loan_id,
        element.description,
        element.prev_balance,
        element.new_balance,
        element.amount_paid,
        element.interest_charged,
        element.date,
        element.next_due_date,
        element.user_id,
      ];
      await conn.db_conn_remote(sql_1, parameters_1);
    });

    return 1;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

async function _sync_loans_billing() {
  try {
    // Fetch remote server last insert
    var sql_1 =
      "SELECT loans_billing.id FROM loans_billing WHERE 1 ORDER BY loans_billing.id DESC LIMIT 1";
    var parameters_1 = [];
    var results = await conn.db_conn_remote(sql_1, parameters_1);

    var last_id = 0;

    if (results.length) {
      last_id = parseInt(results[0].id);
    }

    // Fetch local Server
    sql_1 = "SELECT * FROM loans_billing WHERE loans_billing.id > ?;";
    parameters_1 = [last_id];
    results = await conn.db_conn(sql_1, parameters_1);

    results.forEach(async (element) => {
      // Insert into Remote Server
      sql_1 =
        "INSERT INTO `loans_billing`(`id`, `date`, `time`, `user_id`) VALUES ( ?,?,?,?);";
      parameters_1 = [element.id, element.date, element.time, element.user_id];
      await conn.db_conn_remote(sql_1, parameters_1);
    });

    return 1;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

async function _sync_customers() {
  try {
    // Fetch remote server last insert
    var sql_1 =
      "SELECT customers.id FROM customers WHERE 1 ORDER BY customers.id DESC LIMIT 1";
    var parameters_1 = [];
    var results = await conn.db_conn_remote(sql_1, parameters_1);

    var last_id = 0;

    if (results.length) {
      last_id = parseInt(results[0].id);
    }

    // Fetch local Server
    sql_1 = "SELECT * FROM customers WHERE customers.id > ?;";
    parameters_1 = [last_id];
    results = await conn.db_conn(sql_1, parameters_1);

    results.forEach(async (element) => {
      // Insert into Remote Server
      sql_1 =
        "INSERT INTO `customers`(`id`, `customer_name`, `nat_id`, `phone`, `address`, `cerated_by`, `date`) VALUES ( ?,?,?,?,?,?,?);";
      parameters_1 = [
        element.id,
        element.customer_name,
        element.nat_id,
        element.phone,
        element.address,
        element.cerated_by,
        element.date,
      ];
      await conn.db_conn_remote(sql_1, parameters_1);
    });

    return 1;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

async function _sync_orders() {
  try {
    // Fetch remote server last insert
    var sql_1 =
      "SELECT orders.id FROM orders WHERE 1 ORDER BY orders.id DESC LIMIT 1";
    var parameters_1 = [];
    var results = await conn.db_conn_remote(sql_1, parameters_1);

    var last_id = 0;

    if (results.length) {
      last_id = parseInt(results[0].id);
    }

    // Fetch local Server
    sql_1 = "SELECT * FROM orders WHERE orders.id > ?;";
    parameters_1 = [last_id];
    results = await conn.db_conn(sql_1, parameters_1);

    results.forEach(async (element) => {
      // Insert into Remote Server
      sql_1 =
        "INSERT INTO `orders`(`id`, `customer_id`, `items`, `quantity`, `amount`, `status`, `date`) VALUES ( ?,?,?,?,?,?,?);";
      parameters_1 = [
        element.id,
        element.customer_id,
        element.items,
        element.quantity,
        element.amount,
        element.status,
        element.date,
      ];
      await conn.db_conn_remote(sql_1, parameters_1);
    });

    return 1;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

async function _sync_orders_amount_in_hand() {
  try {
    // Fetch remote server last insert
    var sql_1 =
      "SELECT orders_amount_in_hand.id FROM orders_amount_in_hand WHERE 1 ORDER BY orders_amount_in_hand.id DESC LIMIT 1";
    var parameters_1 = [];
    var results = await conn.db_conn_remote(sql_1, parameters_1);

    var last_id = 0;

    if (results.length) {
      last_id = parseInt(results[0].id);
    }

    // Fetch local Server
    sql_1 =
      "SELECT * FROM orders_amount_in_hand WHERE orders_amount_in_hand.id > ?;";
    parameters_1 = [last_id];
    results = await conn.db_conn(sql_1, parameters_1);

    results.forEach(async (element) => {
      // Insert into Remote Server
      sql_1 =
        "INSERT INTO `orders_amount_in_hand`(`id`, `customer_id`, `description`, `amount`, `prev_balance`, `new_balance`, `date`) VALUES ( ?,?,?,?,?,?,?);";
      parameters_1 = [
        element.id,
        element.customer_id,
        element.description,
        element.amount,
        element.prev_balance,
        element.new_balance,
        element.date,
      ];
      await conn.db_conn_remote(sql_1, parameters_1);
    });

    return 1;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

async function _sync_loans_billing() {
  try {
    // Fetch remote server last insert
    var sql_1 =
      "SELECT loans_billing.id FROM loans_billing WHERE 1 ORDER BY loans_billing.id DESC LIMIT 1";
    var parameters_1 = [];
    var results = await conn.db_conn_remote(sql_1, parameters_1);

    var last_id = 0;

    if (results.length) {
      last_id = parseInt(results[0].id);
    }

    // Fetch local Server
    sql_1 = "SELECT * FROM loans_billing WHERE loans_billing.id > ?;";
    parameters_1 = [last_id];
    results = await conn.db_conn(sql_1, parameters_1);

    results.forEach(async (element) => {
      // Insert into Remote Server
      sql_1 =
        "INSERT INTO `loans_billing`(`id`, `date`, `time`, `user_id`) VALUES (?,?,?,?)";
      parameters_1 = [element.id, element.date, element.time, element.user_id];
      await conn.db_conn_remote(sql_1, parameters_1);
    });

    return 1;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

async function _sync_orders_billing() {
  try {
    // Fetch remote server last insert
    var sql_1 =
      "SELECT orders_billing.id FROM orders_billing WHERE 1 ORDER BY orders_billing.id DESC LIMIT 1";
    var parameters_1 = [];
    var results = await conn.db_conn_remote(sql_1, parameters_1);

    var last_id = 0;

    if (results.length) {
      last_id = parseInt(results[0].id);
    }

    // Fetch local Server
    sql_1 = "SELECT * FROM orders_billing WHERE orders_billing.id > ?;";
    parameters_1 = [last_id];
    results = await conn.db_conn(sql_1, parameters_1);

    results.forEach(async (element) => {
      // Insert into Remote Server
      sql_1 =
        "INSERT INTO `orders_billing`(`id`, `date`, `time`, `user_id`) VALUES (?,?,?,?)";
      parameters_1 = [element.id, element.date, element.time, element.user_id];
      await conn.db_conn_remote(sql_1, parameters_1);
    });

    return 1;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

async function _sync_orders_interest() {
  try {
    // Fetch remote server last insert
    var sql_1 =
      "SELECT orders_interest.id FROM orders_interest WHERE 1 ORDER BY orders_interest.id DESC LIMIT 1";
    var parameters_1 = [];
    var results = await conn.db_conn_remote(sql_1, parameters_1);

    var last_id = 0;

    if (results.length) {
      last_id = parseInt(results[0].id);
    }

    // Fetch local Server
    sql_1 = "SELECT * FROM orders_interest WHERE orders_interest.id > ?;";
    parameters_1 = [last_id];
    results = await conn.db_conn(sql_1, parameters_1);

    results.forEach(async (element) => {
      // Insert into Remote Server
      sql_1 =
        "INSERT INTO `orders_interest`(`id`, `customer_id`, `description`, `date`, `amount_owing`, `interest_charged`, `amount_added`, `total_owing`) VALUES ( ?,?,?,?,?,?,?,?)";
      parameters_1 = [
        element.id,
        element.customer_id,
        element.description,
        element.date,
        element.amount_owing,
        element.interest_charged,
        element.amount_added,
        element.total_owing,
      ];
      await conn.db_conn_remote(sql_1, parameters_1);
    });

    return 1;
  } catch (error) {
    console.log(error);
    return 0;
  }
}
// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>> SYNC

module.exports = {
  render_users,
  render_user_details,
  render_user_account_access,
  update_account_details,
  change_password,
  update_account_access,
  add_user,
  signout,
  signin,
  process_signin,
  sync,
  process_sync,
};
