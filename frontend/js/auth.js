
function getToken() {
  return sessionStorage.getItem("token");
}

function getLoggedInUser() {
  const user = sessionStorage.getItem("user");

  try {
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
}

function logout() {
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  window.location.href = "login.html";
}

function updateAuthUI() {
  const authArea = document.getElementById("authArea");
  if (!authArea) return;

  authArea.replaceChildren();

  const token = sessionStorage.getItem("token");

  let user = null;
  try {
    user = JSON.parse(sessionStorage.getItem("user") || "null");
  } catch {
    user = null;
  }

  if (token) {
    const welcome = document.createElement("span");
    welcome.textContent = `Welcome, ${user?.name || "User"} `;

    const logoutButton = document.createElement("button");
    logoutButton.type = "button";
    logoutButton.textContent = "Logout";
    logoutButton.addEventListener("click", () => {
      sessionStorage.removeItem("token");
      sessionStorage.removeItem("user");
      window.location.href = "login.html";
    });

    authArea.append(welcome, logoutButton);
  } else {
    const loginLink = document.createElement("a");
    loginLink.href = "login.html";
    loginLink.textContent = "Login";

    const registerLink = document.createElement("a");
    registerLink.href = "register.html";
    registerLink.textContent = "Register";

    authArea.append(loginLink, registerLink);
  }
}
document.addEventListener("DOMContentLoaded", updateAuthUI);

// function updateAuthUI() {
//   const authArea = document.getElementById("authArea");

//   if (!authArea) return;

//   const token = getToken();
//   const user = getLoggedInUser();

//   if (token) {
//     authArea.innerHTML = `
//       <span>Welcome, ${user?.name || "User"}</span>
//       <button type="button" id="logoutButton">Logout</button>
//     `;

//     document
//       .getElementById("logoutButton")
//       .addEventListener("click", logout);
//   } else {
//     authArea.innerHTML = `
//       <a href="login.html">Login</a>
//       <a href="register.html">Register</a>
//     `;
//   }
// }