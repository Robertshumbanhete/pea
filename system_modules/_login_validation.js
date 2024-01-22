function _check_user(req, res, next) {
  // if (typeof req.session.full_name == "undefined" || typeof req.session.email == "undefined") {
  //   res.redirect("/signin");
  // } else {
  //   res.locals.full_name = req.session.full_name;
  //   res.locals.email = req.session.email;
  //   next();
  // }

  next();
}

module.exports = { _check_user };
