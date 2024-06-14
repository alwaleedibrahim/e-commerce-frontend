const registrationForm = document.getElementById("registration-form");
registrationForm.addEventListener("submit", validateForm);

function validateForm(event) {
  event.preventDefault();
  let name = event.target.name.value;
  let email = event.target.email.value;
  let mobileNumber = event.target["mobile-number"].value;
  let password = event.target.password.value;
  let rePassword = event.target["re-password"].value;

  let nameRegExp = /^([a-zA-z]+[\s]?)+[^\s]$/;
  let emailRegExp = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  let mobileNumberRegExp = /^[\+]?[0-9]+$/;
  let passwordRegExp =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

  if (!nameRegExp.test(name)) {
    showError("Invalid name");
    return;
  }
  if (!emailRegExp.test(email)) {
    showError("Invalid E-mail");
    return;
  }

  if (!mobileNumberRegExp.test(mobileNumber)) {
    showError("Invalid mobile number");
    return;
  }

  if (!(password == rePassword)) {
    showError("Passwords must match");
    return;
  }

  if (!passwordRegExp.test(password)) {
    showError(
      " password meets the following criteria: \n- At least 8 characters long \n- Contains at least one uppercase letter \n- Contains at least one lowercase letter \n- Contains at least one digit \n- Contains at least one special character"
    );
    return;
  }

  let user = {
    name: name,
    email: email,
    mobileNumber: mobileNumber,
    password: password,
  };
  showError("");
  handleRegisteration(user);
}

function handleRegisteration(user) {
  let users = localStorage.getItem("users");
  if (users === null) {
    users = "[]";
  }
  users = JSON.parse(users);
  for (existingUser of users) {
    if (existingUser.email == user.email) {
      showError("Email is already registered")
      return;
    }
  }
  users.push(user);
  localStorage.setItem("users", JSON.stringify(users));
  location.assign("./login.html")
}

function showError(msg) {
  const errorContainer = document.getElementById("error-container");
  errorContainer.textContent = msg;
}
