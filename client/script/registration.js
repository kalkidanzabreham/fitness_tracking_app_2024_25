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
    const registrationForm = document.getElementById("registrationForm");
    const submitButton = document.getElementById("submitButton");
    registrationForm.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        const usernameInput = document.getElementById("username").value;
        const emailInput = document.getElementById("email")
            .value;
        const passwordInput = document.getElementById("password").value;
        // Ensure all fields are filled
        if (!usernameInput || !emailInput || !passwordInput) {
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
            const response = yield fetch("http://localhost:4000/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                },
                body: formData.toString(),
            });
            // Check if the response is successful
            if (response.status !== 200) {
                const errorData = yield response.json();
                if (errorData.message === "Email is taken") {
                    alert("This email is already registered. Please use another email.");
                }
                else if (errorData.message === "Username taken") {
                    alert("This username is already taken. Please choose another username.");
                }
                else {
                    alert("Registered sucessfully");
                    window.location.href = "./login.html";
                }
                return;
            }
            // Registration was successful
            setTimeout(() => {
                window.location.href = "/client/login.html";
            }, 2000);
        }
        catch (error) {
            console.log(error);
            alert("An error occurred. Please try again.");
        }
    }));
})();
