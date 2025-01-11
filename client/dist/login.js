"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
(() => {
    const loginForm = document.getElementById("registrationForm");
    const submitButton = document.getElementById("submitButton");
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
    function showMessage(message, type) {
        messageElement.textContent = message;
        messageElement.style.color = "white";
        if (type === "success") {
            messageElement.style.backgroundColor = "green";
        }
        else {
            messageElement.style.backgroundColor = "red";
        }
    }
    loginForm.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        const emailInput = document.getElementById("email")
            .value;
        const passwordInput = document.getElementById("password").value;
        if (!emailInput || !passwordInput) {
            showMessage("Both fields are required.", "error");
            return;
        }
        const requestData = new URLSearchParams();
        requestData.append("email", emailInput);
        requestData.append("password", passwordInput);
        try {
            const response = yield fetch("http://localhost:4000/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: requestData.toString(),
            });
            if (!response.ok) {
                const errorData = yield response.json();
                // Check if the error is due to invalid credentials (401)
                if (response.status === 401) {
                    showMessage("Invalid credentials. Please try again.", "error");
                }
                else {
                    // If it's any other type of error, throw it
                    showMessage(errorData.message || "An error occurred. Please try again.", "error");
                }
                return;
            }
            const data = yield response.json();
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.user.id);
            localStorage.setItem("username", data.user.username);
            showMessage("Successfully logged in!", "success");
            // Automatically redirect to the dashboard after 3 seconds
            setTimeout(() => {
                window.location.href =
                    "/fitness_tracking_app_2024_25/client/dashboard.html";
            }, 3000); // Delay of 3 seconds
        }
        catch (err) {
            console.error(err);
            showMessage("An error occurred. Please try again.", "error");
        }
    }));
    const passwordInput = document.getElementById("password");
    const togglePassword = document.getElementById("togglePassword");
    togglePassword.addEventListener("click", () => {
        // Toggle password visibility
        if (passwordInput.type === "password") {
            passwordInput.type = "text"; // Show the password
            togglePassword.src = "/fitness_tracking_app_2024_25/client/assets/img/eye_open.png";
        }
        else {
            passwordInput.type = "password"; // Hide the password
            togglePassword.src =
                "/fitness_tracking_app_2024_25/client/assets/img/eye_closed.png";
        }
    });
})();
