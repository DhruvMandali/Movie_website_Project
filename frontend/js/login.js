
const loginForm = document.getElementById("loginForm");
const message = document.getElementById("message");

loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();

  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  message.textContent = "Logging in...";

  try {
    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Login failed");
    }

    if (!data.token) {
      throw new Error("Login response ma token malyo nathi.");
    }

    // JWT token save karo
    sessionStorage.setItem("token", data.token);

    // Login thayela user ni basic information save karo
    if (data.user) {
      sessionStorage.setItem("user", JSON.stringify(data.user));
    }

    message.textContent = "Login successful!";

    // setTimeout(() => {
    //   window.location.href = "index.html";
    // }, 800);

    setTimeout(() => {
  if (data.user && data.user.role === "admin") {
    window.location.href = "admin.html";
  } else {
    window.location.href = "index.html";
  }
}, 800);

  } catch (error) {
    message.textContent = error.message;
  }
});

// window.location.href = "index.html";
