
(() => {
  const registrationForm = document.getElementById(
    "registrationForm"
  ) as HTMLFormElement;
  const submitButton = document.getElementById(
    "submitButton"
  ) as HTMLButtonElement;

  if (!registrationForm || !submitButton) {
    console.error("Form elements not found.");
    return;
  }

  registrationForm.addEventListener("submit", async (event: Event) => {
    event.preventDefault();

    const emailInput = (document.getElementById("email") as HTMLInputElement)
      .value;
    const passwordInput = (
      document.getElementById("password") as HTMLInputElement
    ).value;

    if (!emailInput  || !passwordInput) {
      alert("Both fields are required.");
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

        // Check if the error is due to invalid credentials
        if (response.status === 401) {
          alert("Invalid credentials. Please try again.");
        } else {
          throw new Error(
            errorData.message || "An error occurred. Please try again."
          );
        }

        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("userId", data.user.id);
      alert("Successfully logged in!");

      setTimeout(() => {
        window.location.href =
          "/fitness_tracking_app_2024_25/client/dashboard.html";
      }, 2000);
    } catch (err) {
      console.error(err);
      alert("An error occurred. Please try again.");
    }
  });
})();
