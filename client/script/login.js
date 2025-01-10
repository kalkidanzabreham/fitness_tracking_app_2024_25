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
    if (!registrationForm || !submitButton) {
        console.error("Form elements not found.");
        return;
    }
    registrationForm.addEventListener("submit", (event) => __awaiter(void 0, void 0, void 0, function* () {
        event.preventDefault();
        const emailInput = document.getElementById("email")
            .value;
        const passwordInput = document.getElementById("password").value;
        if (!emailInput || !passwordInput) {
            alert("Both fields are required.");
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
                // Check if the error is due to invalid credentials
                if (response.status === 401) {
                    alert("Invalid credentials. Please try again.");
                }
                else {
                    throw new Error(errorData.message || "An error occurred. Please try again.");
                }
                return;
            }
            const data = yield response.json();
            localStorage.setItem("token", data.token);
            localStorage.setItem("userId", data.user.id);
            alert("Successfully logged in!");
            setTimeout(() => {
                window.location.href =
                    "/fitness_tracking_app_2024_25/client/dashboard.html";
            }, 2000);
        }
        catch (err) {
            console.error(err);
            alert("An error occurred. Please try again.");
        }
    }));
})();
