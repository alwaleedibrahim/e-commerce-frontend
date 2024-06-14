const loginForm = document.getElementById("login-form");
loginForm.addEventListener("submit", handleLogin);

function handleLogin(event) {
  event.preventDefault();
  let email = event.target.email.value;
  let password = event.target.password.value;

  let users = localStorage.getItem("users");
  users = JSON.parse(users);

  for (user of users) {
    if (user.email == email && user.password == password) {
      addToCookies("email", email);
      location.assign("./index.html");
    }
  }

  showError("Email or password is incorrect");
}

// const logoutForm = document.getElementById("logout-form");
// logoutForm.addEventListener("submit", handleLogout);

function handleLogout(event) {
    event.preventDefault();
    removeFromCookies("email");
    location.assign("./login.html");
}


function showError(msg) {
  const errorContainer = document.getElementById("error-container");
  errorContainer.textContent = msg;
}

function addToCookies(key, value) {
  let date = new Date();
  date.setDate(date.getDate() + 1);
  document.cookie = `${key}=${value};expire=${date}`;
}

function removeFromCookies(key, value) {
  let date = new Date();
  date.setDate(date.getDate() - 1);
  document.cookie = `${key}=${value};expire=${date}`;
}
