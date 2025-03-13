(() => {
  const registrationForm = document.getElementById(
    "registrationForm"
  ) as HTMLFormElement;
  const submitButton = document.getElementById(
    "submitButton"
  ) as HTMLButtonElement;

  // Create a message element
  const messageElement = document.createElement("div");
  registrationForm.insertBefore(messageElement, submitButton); // Insert it above the submit button

  // Style for the message element
  messageElement.style.marginBottom = "15px";
  messageElement.style.padding = "10px";
  messageElement.style.borderRadius = "5px";
  messageElement.style.fontWeight = "bold";

  if (!registrationForm || !submitButton) {
    console.error("Form elements not found.");
    return;
  }

  // Function to show message
  function showMessage(message: string, type: "success" | "error") {
    messageElement.textContent = message;
    messageElement.style.color = "white"; // Set the text color to white for better contrast

    if (type === "success") {
      messageElement.style.backgroundColor = "green"; // Success message color
    } else {
      messageElement.style.backgroundColor = "red"; // Error message color
    }
  }

  registrationForm.addEventListener("submit", async (event: Event) => {
    event.preventDefault();

    const usernameInput = (
      document.getElementById("username") as HTMLInputElement
    ).value;
    const emailInput = (document.getElementById("email") as HTMLInputElement)
      .value;
    const passwordInput = (
      document.getElementById("password") as HTMLInputElement
    ).value;

    // Ensure all fields are filled
    if (!usernameInput || !emailInput || !passwordInput) {
      showMessage("All fields are required.", "error");
      return;
    }

    // Validate email format
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!emailPattern.test(emailInput)) {
      showMessage("Please enter a valid email address.", "error");
      return;
    }

    // Ensure password is at least 6 characters
    if (passwordInput.length < 6) {
      showMessage("Password must be at least 6 characters long.", "error");
      return;
    }

    // Prepare form data
    const formData = new URLSearchParams();
    formData.append("username", usernameInput);
    formData.append("email", emailInput);
    formData.append("password", passwordInput);

    try {
      const response = await fetch("https://fitnessback-22sb5vjxa-kalkidanzabrehams-projects.vercel.app/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      const errorData = await response.json();

      // Check if the response is successful or not
      if (!response.ok) {
        if (errorData.message === "Email address is already taken.") {
          showMessage(
            "This email is already registered. Please use another email.",
            "error"
          );
        } else if (errorData.message === "Username is already taken.") {
          showMessage(
            "This username is already taken. Please choose another username.",
            "error"
          );
        } else {
          showMessage("An error occurred. Please try again.", "error");
        }
        return;
      }

      // Registration was successful
      showMessage(
        "Registered successfully! Redirecting to login...",
        "success"
      );

      // Redirect to the login page after a short delay
      setTimeout(() => {
        window.location.href =
          "/fitness_tracking_app_2024_25/client/login.html";
      }, 2000); // Delay of 2 seconds
    } catch (error) {
      console.log(error);
      showMessage("An error occurred. Please try again.", "error");
    }
  });

  // Password visibility toggle
  const passwordInput = document.getElementById("password") as HTMLInputElement;
  const togglePassword = document.getElementById(
    "togglePassword"
  ) as HTMLImageElement;

  togglePassword.addEventListener("click", () => {
    // Toggle password visibility
    if (passwordInput.type === "password") {
      passwordInput.type = "text"; // Show the password
      togglePassword.src =
        "/fitness_tracking_app_2024_25/client/assets/img/eye_open.png"; // Open eye icon
    } else {
      passwordInput.type = "password"; // Hide the password
      togglePassword.src =
        "/fitness_tracking_app_2024_25/client/assets/img/eye_closed.png"; // Closed eye icon
    }
  });
})();
