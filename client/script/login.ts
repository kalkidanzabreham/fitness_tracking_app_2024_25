(() => {
  const loginForm = document.getElementById(
    "registrationForm"
  ) as HTMLFormElement;
  const submitButton = document.getElementById(
    "submitButton"
  ) as HTMLButtonElement;

  // Create a message element
  const messageElement = document.createElement("div");
  loginForm.insertBefore(messageElement, submitButton); 

  // Style for the message element
  messageElement.style.marginBottom = "15px"; 
  messageElement.style.padding = "10px"; 
  messageElement.style.borderRadius = "5px"; 
  messageElement.style.fontWeight = "bold"; 

  if (!loginForm || !submitButton) {
    console.error("Form elements not found.");
    return;
  }

  // Function to show message
  function showMessage(message: string, type: "success" | "error") {
    messageElement.textContent = message;
    messageElement.style.color = "white"; 

    if (type === "success") {
      messageElement.style.backgroundColor = "green"; 
    } else {
      messageElement.style.backgroundColor = "red"; 
    }
  }

  loginForm.addEventListener("submit", async (event: Event) => {
    event.preventDefault();

    const emailInput = (document.getElementById("email") as HTMLInputElement)
      .value;
    const passwordInput = (
      document.getElementById("password") as HTMLInputElement
    ).value;

    if (!emailInput || !passwordInput) {
      showMessage("Both fields are required.", "error");
      return;
    }

    const requestData = new URLSearchParams();
    requestData.append("email", emailInput);
    requestData.append("password", passwordInput);

    try {
      const response = await fetch("http://localhost:4000/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: requestData.toString(),
      });

      if (!response.ok) {
        const errorData = await response.json();

        // Check if the error is due to invalid credentials (401)
        if (response.status === 401) {
          showMessage("Invalid credentials. Please try again.", "error");
        } else {
          // If it's any other type of error, throw it
          showMessage(
            errorData.message || "An error occurred. Please try again.",
            "error"
          );
        }

        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      localStorage.setItem("username", data.user.username);
      showMessage("Successfully logged in!", "success");

      // Automatically redirect to the dashboard after 3 seconds
      setTimeout(() => {
        window.location.href =
          "/fitness_tracking_app_2024_25/client/dashboard.html";
      }, 3000); // Delay of 3 seconds
    } catch (err) {
      console.error(err);
      showMessage("An error occurred. Please try again.", "error");
    }
  });

  const passwordInput = document.getElementById("password") as HTMLInputElement;
  const togglePassword = document.getElementById(
    "togglePassword"
  ) as HTMLImageElement;

  togglePassword.addEventListener("click", () => {
    // Toggle password visibility
    if (passwordInput.type === "password") {
      passwordInput.type = "text"; // Show the password
      togglePassword.src = "/fitness_tracking_app_2024_25/client/assets/img/eye_open.png"; 
    } else {
      passwordInput.type = "password"; // Hide the password
      togglePassword.src =
        "/fitness_tracking_app_2024_25/client/assets/img/eye_closed.png"; 
    }
  });
})();
