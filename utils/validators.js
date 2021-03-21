module.exports.validateRegisterInput = (
  username,
  email,
  password,
  confirmPassword
) => {
  const errors = {};
  if (!username || username.trim() === "") {
    errors.username = "Username must not be empty.";
  }
  if (!email || email.trim() === "") {
    errors.email = "Email must not be empty.";
  } else {
    const regex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
    if (!email.match(regex)) {
      errors.email = "Email must be a valid email address";
    }
  }
  if (!password || password.trim() === "") {
    errors.password = "Password must not be empty";
  } else if (password !== confirmPassword) {
    errors.confirmPassword = "Password must match";
  }

  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};

module.exports.validateLoginInput = (username, password) => {
  const errors = {};
  if (!username || username.trim() === "") {
    errors.username = "Username must not be empty.";
  }
  if (!password || password.trim() === "") {
    errors.password = "Password must not be empty.";
  }
  return {
    errors,
    valid: Object.keys(errors).length < 1,
  };
};
