const { response } = require("express");
const conn = require("./_db_connection");

async function query_record_existance(table, column, value) {
  try {
    const sql_1 = `SELECT ${table}.id FROM ${table} WHERE ${table}.${column} = ?`;
    const parameters_1 = [value];
    const res_message_1 = await conn.db_conn(sql_1, parameters_1);

    if (res_message_1.length > 0) {
      ret_id = res_message_1[0].id;

      ret_id = parseInt(ret_id);
      var_response = ret_id;
    } else {
      var_response = false;
    }
  } catch (error) {
    console.log(error);
    var_response = false;
  }

  return var_response;
}

async function query_record_existance_fund(table, column, value, fund_id) {
  try {
    const sql_1 = `SELECT ${table}.id FROM ${table} WHERE ${table}.${column} = ? AND ${table}.fund_id = ?`;
    const parameters_1 = [value, fund_id];
    const res_message_1 = await conn.db_conn(sql_1, parameters_1);

    if (res_message_1.length > 0) {
      ret_id = res_message_1[0].id;

      ret_id = parseInt(ret_id);
      var_response = ret_id;
    } else {
      var_response = false;
    }
  } catch (error) {
    console.log(error);
    var_response = false;
  }

  return var_response;
}

function check_empty_string(variable) {
  if (variable) {
    return 0;
  } else {
    return 1;
  }
}

function check_variable_length(variable, length) {
  if (variable === undefined) {
    variable = 0;
  }
  if (variable.length >= length) {
    return 0;
  } else {
    return 1;
  }
}

function validate_number_format(number) {
  if (number === undefined) {
    number = 0;
  }
  try {
    number = parseInt(number);
  } catch (error) {
    number = 0;
  }

  if (typeof number === "number") {
    return 0;
  } else {
    return 1;
  }
}

function validate_amount(variable, min_amount) {
  flag = false;

  if (Number.isNaN(Number(variable))) {
    // Input is not a number

    flag = true;
  } else if (variable < min_amount) {
    flag = true;
  }

  return flag;
}

function validate_email(email) {
  if (email) {
    return 0;
  } else {
    return 1;
  }
}

function validate_date(variable) {
  if (variable) {
    return 0;
  } else {
    return 1;
  }
}

function account_number(variable) {
  if (variable) {
    return 0;
  } else {
    return 1;
  }
}

function validate_phone_number(variable) {
  if (variable === undefined) {
    variable = 0;
  }
  if (variable.length >= 8) {
    return 0;
  } else {
    return 1;
  }
}
function validate_file(file) {
  if (file) {
    return 0;
  } else {
    return 1;
  }
}
function validate_drivers_licence(variable) {
  if (variable === undefined) {
    variable = 0;
  }
  if (variable.length >= 5) {
    return 0;
  } else {
    return 1;
  }
}

function validate_national_id(variable) {
  variable += "";

  if (variable === undefined) {
    variable = 0;
  }
  if (variable.length >= 11) {
    return 0;
  } else {
    return 1;
  }
}

function validate_passport_number(variable) {
  if (variable === undefined) {
    variable = 0;
  }
  if (variable.length >= 5) {
    return 0;
  } else {
    return 1;
  }
}

function min_amount(amount, min) {
  try {
    amount = parseInt(amount);

    if (amount < min) {
      return 1;
    } else {
      return 0;
    }
  } catch (error) {
    console.log(error);
    return 1;
  }
}

function max_amount(amount, max) {
  try {
    amount = parseInt(amount);

    if (amount > max) {
      return 1;
    } else {
      return 0;
    }
  } catch (error) {
    console.log(error);
    return 1;
  }
}

async function validate_product_code_existance(product_code, mode, product_id) {
  var sql_1;
  var parameters_1;

  if (mode === "add") {
    sql_1 = "SELECT products.id FROM products WHERE products.code = ?";
    parameters_1 = [product_code];
  } else if (mode === "update") {
    sql_1 = "SELECT products.id FROM products WHERE products.code = ? AND products.id != ?";
    parameters_1 = [product_code, product_id];
  } else {
    return 1;
  }

  try {
    const res_message_1 = await conn.db_conn(sql_1, parameters_1);

    if (res_message_1.length > 0) {
      return 1;
    } else {
      return 0;
    }
  } catch (error) {
    console.log(error);
    return 1;
  }
}

function validate_password(password) {
  try {
    if (password.length < 8) {
      return 1;
    } else {
      return 0;
    }
  } catch (error) {
    return undefined;
  }
}

module.exports = { query_record_existance, check_empty_string, check_variable_length, validate_email, account_number, validate_file, validate_national_id, validate_date, validate_phone_number, validate_drivers_licence, validate_passport_number, validate_amount, query_record_existance_fund, validate_number_format, min_amount, max_amount, validate_product_code_existance, validate_password };
