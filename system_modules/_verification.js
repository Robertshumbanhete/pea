const { response } = require("express");
const conn = require("./_db_connection");

// Branches
async function render_branches(req, res, next) {
  _verify(req, res, next, "render_branches", "http");
}

// Sales
async function render_sales(req, res, next) {
  _verify(req, res, next, "render_sales", "http");
}
async function render_invoice_details(req, res, next) {
  _verify(req, res, next, "render_invoice_details", "http");
}

async function process_invoice_payment(req, res, next) {
  _verify(req, res, next, "process_invoice_payment", "api");
}
async function void_transaction(req, res, next) {
  _verify(req, res, next, "void_transaction", "api");
}

// ******************************************************************
async function _verify(req, res, next, operation, req_type) {
  const user_id = req.session.user_id;

  const user_role = await _get_user_role(user_id);
  const user_previledges = await _get_user_role_privileges(user_id);

  console.log(user_role);

  if (user_role === "Developer" || user_previledges.includes(operation)) {
    next();
  } else if (req_type === "api") {
    let response_obj = { success: false, msg: "You are not authorized to perform this action. Please contact your supervisor" };
    res.send(response_obj);
  } else if (req_type === "http") {
    res.render("error/forbidden");
  } else {
    res.render("error/error");
  }
}

async function _get_user_role(user_id) {
  try {
    const sql_1 = "SELECT user_roles.name FROM user_roles INNER JOIN users ON users.user_role = user_roles.id WHERE users.id = ?;";
    const parameters_1 = [user_id];
    const results = await conn.db_conn(sql_1, parameters_1);

    return results[0].name;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

async function _get_user_role_privileges(user_id) {
  try {
    const sql_1 = "SELECT system_modules.operation FROM user_roles_permissions INNER JOIN system_modules ON system_modules.id = user_roles_permissions.system_module INNER JOIN user_roles ON user_roles.id = user_roles_permissions.user_role INNER JOIN users ON users.user_role = user_roles.id  WHERE users.id = ?;";
    const parameters_1 = [user_id];
    const results = await conn.db_conn(sql_1, parameters_1);

    var privileges = [];

    for (let i = 0; i < results.length; i++) {
      privileges.push(results[i].operation);
    }

    return privileges;
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

module.exports = { render_branches, render_sales, render_invoice_details, process_invoice_payment, void_transaction };
