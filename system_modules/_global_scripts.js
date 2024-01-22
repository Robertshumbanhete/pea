const conn = require("./_db_connection");
const nodemailer = require("nodemailer");
const shared_obj = require("./_shared_module");

const crypto = require("crypto");

async function get_value_from_record_id(table, column, value) {
  try {
    const sql_1 = `SELECT ${table}.${column} FROM ${table} WHERE ${table}.id = ?`;
    const parameters_1 = [value];
    const res_message_1 = await conn.db_conn(sql_1, parameters_1);

    if (res_message_1.length > 0) {
      value = res_message_1[0];
      value = Object.values(value)[0];

      return value;
    } else {
      return 0;
    }
  } catch (error) {
    console.log(error);
    return 0;
  }
}

async function send_email(email_to, subject, text) {
  return new Promise((resolve, reject) => {
    try {
      const transporter = nodemailer.createTransport({
        service: "outlook",
        port: 587,
        auth: {
          user: process.env.EMAIL_USERNAME,
          pass: process.env.EMAIL_PASSWORD,
        },
      });

      const options = {
        from: "Aplimac Pensions <aplimacpensions@outlook.com>", // sender address
        to: email_to, // list of receivers
        subject: subject, // Subject line
        text: text, // plain text body
      };

      transporter.sendMail(options, (err, info) => {
        if (err) {
          console.log(err);
          console.log(">>>>>>>>>>1");
          resolve(0);
        } else {
          console.log("Sent:" + info.response);
          console.log(">>>>>>>>>>2");
          resolve(info.response);
        }
      });
    } catch (error) {
      console.log(error);
      console.log(">>>>>>>>>>3");
      resolve(0);
    }
  });
}

function generate_random_string(length) {
  var result = "";
  var characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function generate_random_number(length) {
  var result = "";
  var characters = "0123456789";
  var charactersLength = characters.length;
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function generate_random_number_crypto(min, max) {
  try {
    const range = max - min + 1;
    const bytesNeeded = Math.ceil(Math.log2(range) / 8);
    if (bytesNeeded > 6) {
      throw new Error("Too many bytes needed to represent the range");
    }
    const randomBytes = crypto.randomBytes(bytesNeeded);
    let randomValue = 0n;
    for (let i = 0n; i < bytesNeeded; i++) {
      randomValue |= BigInt(randomBytes[i]) << (8n * i);
    }
    randomValue = randomValue % BigInt(range);
    return parseInt(randomValue.toString());
  } catch (error) {
    return undefined;
  }
}

function get_date_only(date) {
  try {
    date = new Date(date);

    yyyy = date.getFullYear();
    mm = date.getMonth() + 1;
    dd = date.getDate();

    result = `${yyyy}-${mm}-${dd}`;
  } catch (error) {
    result = 0;
  }

  return result;
}

function get_day_and_month(date) {
  try {
    date = new Date(date);

    yyyy = date.getFullYear();
    mm = date.getMonth() + 1;

    if (mm === 1) {
      month = "January";
    } else if (mm === 2) {
      month = "February";
    } else if (mm === 3) {
      month = "March";
    } else if (mm === 4) {
      month = "April";
    } else if (mm === 5) {
      month = "May";
    } else if (mm === 6) {
      month = "June";
    } else if (mm === 7) {
      month = "July";
    } else if (mm === 8) {
      month = "August";
    } else if (mm === 9) {
      month = "September";
    } else if (mm === 10) {
      month = "October ";
    } else if (mm === 11) {
      month = "November";
    } else if (mm === 12) {
      month = "December";
    }

    result = `${month} ${yyyy} `;
  } catch (error) {
    result = 0;
  }

  return result;
}

function get_time_only() {
  try {
    date = new Date(date);

    sec = date.getSeconds();
    min = date.getMinutes();
    hr = date.getHours();

    result = `${hr}:${min}:${sec}`;
  } catch (error) {
    result = 0;
  }

  return result;
}

function get_current_date_time() {
  date = new Date();

  yyyy = date.getFullYear();
  mm = date.getMonth() + 1;
  dd = date.getDate();

  sec = date.getSeconds();
  min = date.getMinutes();
  hr = date.getHours();

  return `${yyyy}-${mm}-${dd} ${hr}:${min}:${sec}`;
}

function getEndOfWeekDate(date) {
  const currentDate = new Date(date); // Create a new Date object with the given date
  const dayOfWeek = currentDate.getDay(); // Get the current day of the week (0-6, where 0 is Sunday)

  // Calculate the number of days remaining until the end of the week (Saturday)
  const daysUntilEndOfWeek = 6 - dayOfWeek;

  // Set the date to the end of the week by adding the remaining days
  const endOfWeekDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate() + daysUntilEndOfWeek
  );

  return endOfWeekDate;
}

function _check_select_status(res_message) {
  if (res_message.length > 0) {
    return 1;
  } else {
    return 0;
  }
}

async function get_value_from_id(table, column, value) {
  try {
    const sql_1 = `SELECT ${table}.${column} FROM ${table} WHERE ${table}.id = ?`;
    const parameters_1 = [value];
    const res_message_1 = await conn.db_conn(sql_1, parameters_1);

    if (res_message_1.length > 0) {
      value = res_message_1[0];
      value = Object.values(value)[0];

      return value;
    } else {
      return 0;
    }
  } catch (error) {
    console.log(error);
    return 0;
  }
}

// >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

async function get_select(table, column) {
  try {
    const sql_1 = `SELECT ${table}.id, ${table}.${column} FROM ${table}  `;
    const parameters_1 = [];
    const res_message_1 = await conn.db_conn(sql_1, parameters_1);

    return res_message_1;
  } catch (error) {
    console.log(error);
    return 0;
  }
}

function format_number_by_validation(number) {
  try {
    number = parseInt(number);
  } catch (error) {
    number = 0;
  }

  return number;
}
function format_float_by_validation(number) {
  try {
    number = parseFloat(number);
  } catch (error) {
    number = 0;
  }

  return number;
}

function get_person_age(birth_date) {
  var today = new Date();
  var birthDate = new Date(birth_date);

  var age = today.getFullYear() - birthDate.getFullYear();
  var m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
}

async function generate_invoice_number() {
  const last_invoice = _search_for_last_invoice();

  if (!last_invoice) {
    new_inovice = 1;
  } else {
    new_inovice = last_invoice + 1;
  }

  return new_inovice;
}

async function _search_for_last_invoice() {
  try {
    const sql_1 =
      "SELECT invoice.id FROM invoice  ORDER BY invoice.id DESC LIMIT 1;";
    const parameters_1 = [];
    const res_message_1 = await conn.db_conn(sql_1, parameters_1);

    if (res_message_1.length > 0) {
      return res_message_1[0].invoice_number;
    } else {
      return 0;
    }
  } catch (error) {
    console.log(error);
    return undefined;
  }
}

module.exports = {
  generate_random_string,
  generate_random_number,
  get_date_only,
  get_time_only,
  get_current_date_time,
  send_email,
  _check_select_status,
  get_day_and_month,
  get_value_from_id,
  get_select,
  get_value_from_record_id,
  format_number_by_validation,
  format_float_by_validation,
  get_person_age,
  generate_invoice_number,
  generate_random_number_crypto,
  getEndOfWeekDate,
};
