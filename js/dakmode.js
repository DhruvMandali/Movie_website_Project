// dakmode logic

let toggleBtn = document.getElementById("toggleMode");

toggleBtn.addEventListener("click", () => {
  let body = document.body;

  if (body.classList.contains("dark")) {
    body.classList.remove("dark");
    body.classList.add("light");
    
    toggleBtn.innerText = "☀️";
  } else {
    body.classList.remove("light");
    body.classList.add("dark");
    toggleBtn.innerText = "🌙";
  }
});


