const loginForm = document.getElementById("login-form");
if (loginForm) {
  loginForm.addEventListener("submit", handleLogin);
}

const logoutOption = document.getElementById("logout-option");
if (logoutOption) {
  logoutOption.addEventListener("click", handleLogout);
}

const userIcon = document.querySelector(".user-icon-container")
if (userIcon) {
  if (isLoggedIn()) {
    userIcon.classList.add("user-icon-container-active")
  }
  userIcon.addEventListener("click", showUserOptionsList)
}

function handleLogin(event) {
  event.preventDefault();
  let email = event.target.email.value;
  let password = event.target.password.value;

  let users = localStorage.getItem("users");
  if (users) {
    users = JSON.parse(users);

    for (user of users) {
      if (user.email == email && user.password == password) {
        addToCookies("email", email);
        location.assign("/index.html");
        return;
      }
    }
  }

  showError("Email or password is incorrect");
}

function handleLogout(event) {
  event.preventDefault();
  removeFromCookies("email");
  location.assign("/pages/login.html");
}

function showError(msg) {
  const errorContainer = document.getElementById("error-container");
  errorContainer.textContent = msg;
}

function addToCookies(key, value) {
  let date = new Date();
  date.setDate(date.getDate() + 1);
  document.cookie = `${key}=${value};expires=${date}`;
}

function removeFromCookies(key, value) {
  let date = new Date();
  date.setDate(date.getDate() - 1);
  document.cookie = `${key}=${value};expires=${date}`;
}

function isLoggedIn() {
  try {
    let cookies = document.cookie.split(";");
    for (let c of cookies) {
      c = c.split("=");
      if (c[0] == "email" && c[1]) {
        return true;
      }
    }
    return false;
  } catch (error) {
    return false;
  }
}

function showUserOptionsList(event) {
  let userOptions = document.getElementsByClassName("user-options")[0]
  userOptions.classList.toggle("show-user-options")
  if(isLoggedIn()) {
    document.getElementById("login-option").style.display = "none"
    document.getElementById("signup-option").style.display = "none"
  }
  else {
    document.getElementById("logout-option").style.display = "none"
  }
}