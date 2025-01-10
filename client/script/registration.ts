
(() => {
  const registrationForm = document.getElementById(
    "registrationForm"
  ) as HTMLFormElement;
  const submitButton = document.getElementById(
    "submitButton"
  ) as HTMLButtonElement;

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
    if (!usernameInput  || !emailInput  || !passwordInput) {
      alert("All fields are required.");
      return;
    }

    // Validate email format
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zAZ]{2,6}$/;
    if (!emailPattern.test(emailInput)) {
      alert("Please enter a valid email address.");
      return;
    }

    // Ensure password is at least 6 characters
    if (passwordInput.length < 6) {
      alert("Password must be at least 6 characters long.");
      return;
    }

    // Prepare form data
    const formData = new URLSearchParams();
    formData.append("username", usernameInput);
    formData.append("email", emailInput);
    formData.append("password", passwordInput);

    try {
      const response = await fetch("http://localhost:4000/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: formData.toString(),
      });

      // Check if the response is successful
      if (response.status !== 200) {
        const errorData = await response.json();
        if (errorData.message === "Email is taken") {
          alert("This email is already registered. Please use another email.");
        } else if (errorData.message === "Username taken") {
          alert(
            "This username is already taken. Please choose another username."
          );
        } else {
          alert("Registered sucessfully");
          window.location.href = "./login.html";
        }
        return;
      }

      // Registration was successful
      setTimeout(() => {
        window.location.href = "/client/login.html";
      }, 2000);
    } catch (error) {
      console.log(error);
      alert("An error occurred. Please try again.");
    }
  });
})();
