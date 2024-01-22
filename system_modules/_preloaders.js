const conn = require("./_db_connection");

function _login_validation(req, res, next) {
  if (!req.session.user_id) {
    res.redirect("/signout");
  } else {
    next();
  }
}

async function _user_access_level(req, res, next) {
  const user_id = req.session.user_id;
  try {
    const sql_1 =
      "SELECT user_roles.name FROM user_roles INNER JOIN users ON users.user_role = user_roles.id WHERE users.id = ?;";
    const parameters_1 = [user_id];
    const results = await conn.db_conn(sql_1, parameters_1);

    if (results.length) {
      if (results[0].name === "Manager") {
        res.locals.manager_mode = 1;
      }
    }
  } catch (error) {
    console.log(error);
  }

  next();
}

module.exports = { _login_validation, _user_access_level };
