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
let bmiData = [];
let activityData = [];
let activityLabels = [];
let currentActivityId = null; // To track the activity being updated
// Retrieve userId from localStorage after login
const userId = localStorage.getItem("userId");
if (!userId) {
    alert("User not logged in");
    // Optionally, redirect to login page if the user is not logged in
    window.location.href = "/fitness_tracking_app_2024_25/client/login.html";
}
else {
    // Use the userId to fetch the relevant data
    fetchPreviousData(parseInt(userId)); // Fetch activity and BMI data
    fetchProgress(parseInt(userId)); // Fetch progress summary
}
function fetchPreviousData(userId) {
    fetch(`http://localhost:4000/activities/${userId}`)
        .then((response) => response.json())
        .then((data) => {
        activityData = data;
        activityLabels = data.map((activity) => new Date(activity.date).toLocaleDateString());
        populateActivitiesTable();
    })
        .catch((error) => console.error("Error fetching activities:", error));
    fetch(`http://localhost:4000/progress/${userId}`)
        .then((response) => response.json())
        .then((data) => {
        bmiData = data.bmiData;
        activityLabels = data.labels;
    })
        .catch((error) => console.error("Error fetching BMI progress:", error));
}
function populateActivitiesTable() {
    var _a;
    const tableBody = (_a = document
        .getElementById("activitiesTable")) === null || _a === void 0 ? void 0 : _a.getElementsByTagName("tbody")[0];
    if (!tableBody)
        return;
    tableBody.innerHTML = ""; // Clear the table before repopulating
    activityData.forEach((activity) => {
        const row = tableBody.insertRow();
        row.insertCell(0).textContent = activity.type;
        row.insertCell(1).textContent = activity.duration.toString();
        row.insertCell(2).textContent = activity.caloriesBurned.toString();
        // Update button
        const updateButton = document.createElement("button");
        updateButton.textContent = "Update";
        updateButton.addEventListener("click", () => {
            currentActivityId = activity.id;
            document.getElementById("workout").value =
                activity.type;
            document.getElementById("duration").value =
                activity.duration.toString();
            document.getElementById("caloriesBurned").value =
                activity.caloriesBurned.toString();
        });
        // Delete button
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.addEventListener("click", () => {
            if (activity.id)
                deleteActivity(activity.id);
        });
        const actionsCell = row.insertCell(3);
        actionsCell.appendChild(updateButton);
        actionsCell.appendChild(deleteButton);
    });
}
function deleteActivity(activityId) {
    fetch(`http://localhost:4000/activities/${activityId}`, {
        method: "DELETE",
    })
        .then((response) => response.json())
        .then(() => {
        console.log("Activity deleted successfully");
        // Remove from the local data
        activityData = activityData.filter((activity) => activity.id !== activityId);
        if (userId) {
            fetchProgress(parseInt(userId));
        }
        populateActivitiesTable();
    })
        .catch((error) => console.error("Error deleting activity:", error));
}
const addActivityForm = document.getElementById("addActivityForm");
addActivityForm.addEventListener("submit", function (event) {
    event.preventDefault();
    console.log("Form submitted"); // Debugging line
    const workout = document.getElementById("workout")
        .value;
    const duration = parseInt(document.getElementById("duration").value);
    const caloriesBurned = parseInt(document.getElementById("caloriesBurned").value);
    const date = new Date().toLocaleDateString();
    console.log(workout, duration, caloriesBurned); // Log form values for debugging
    const activity = { type: workout, duration, caloriesBurned, date };
    if (currentActivityId) {
        // Update existing activity
        fetch(`http://localhost:4000/activities/${currentActivityId}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(activity),
        })
            .then((response) => response.json())
            .then(() => {
            console.log("Activity updated successfully");
            currentActivityId = null;
            addActivityForm.reset();
            if (userId) {
                fetchPreviousData(parseInt(userId));
                fetchProgress(parseInt(userId));
            }
            // Refresh the activity list
        })
            .catch((error) => console.error("Error updating activity:", error));
    }
    else {
        // Add new activity
        fetch(`http://localhost:4000/activities/${userId}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(activity),
        })
            .then((response) => response.json())
            .then(() => {
            console.log("Activity added successfully");
            addActivityForm.reset();
            if (userId) {
                fetchPreviousData(parseInt(userId));
                fetchProgress(parseInt(userId));
            } // Refresh the activity list
        })
            .catch((error) => console.error("Error adding activity:", error));
    }
});
const bmiForm = document.getElementById("bmiForm");
bmiForm.addEventListener("submit", function (event) {
    event.preventDefault();
    const weight = parseFloat(document.getElementById("weight").value);
    const height = parseFloat(document.getElementById("height").value);
    if (weight <= 0 || height <= 0) {
        alert("Please provide valid weight and height.");
        return;
    }
    const bmi = weight / (height * height);
    let bmiLabel = "Normal";
    if (bmi < 18.5) {
        bmiLabel = "Underweight";
    }
    else if (bmi >= 25 && bmi < 30) {
        bmiLabel = "Overweight";
    }
    else if (bmi >= 30) {
        bmiLabel = "Obese";
    }
    bmiData.push(bmi);
    activityLabels.push(new Date().toLocaleDateString());
    document.getElementById("bmiResult").innerText = `Your BMI: ${bmi.toFixed(2)} (${bmiLabel})`;
});
// fetchPreviousData(parseInt(userId));
// Function to calculate kilograms lost based on total calories burned
function calculateKilogramsLost() {
    var _a;
    // Get the total calories burned from the progress summary
    const progressSummary = document.getElementById("progressSummary");
    if (!progressSummary) {
        console.error('Progress summary element not found');
        return;
    }
    const totalCaloriesText = ((_a = progressSummary.querySelector("p:nth-child(2)")) === null || _a === void 0 ? void 0 : _a.innerText) || '';
    const totalCalories = parseInt(totalCaloriesText
        .replace("Total Calories Burned: ", "")
        .replace(" kcal", ""));
    if (isNaN(totalCalories)) {
        console.error('Total calories is not a valid number');
        return;
    }
    // Convert calories to kilograms lost
    const kilogramsLost = totalCalories / 7700; // 1 kg of fat is roughly equivalent to 7700 calories
    // Display the result next to the button
    const resultElement = document.getElementById("kilogramsLostResult");
    if (resultElement) {
        resultElement.innerText = `Kilograms Lost: ${kilogramsLost.toFixed(2)} kg`;
    }
}
// Function to fetch and display progress summary
function fetchProgress(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch(`http://localhost:4000/progress/${userId}`);
            const progressData = yield response.json();
            // Display Progress Summary
            const progressSummary = document.getElementById("progressSummary");
            if (progressSummary) {
                progressSummary.innerHTML = `
          <p><strong>Total Duration:</strong> ${progressData.totalDuration} minutes</p>
          <p><strong>Total Calories Burned:</strong> ${progressData.totalCaloriesBurned} kcal</p>
          <p><strong>Average BMI:</strong> ${progressData.averageBMI.toFixed(2)}</p>
        `;
            }
        }
        catch (error) {
            console.error("Error fetching progress data:", error);
        }
    });
}
// Fetch progress for user with ID 1 (You can change the user ID as needed)
if (userId) {
    fetchProgress(parseInt(userId));
}
document.addEventListener("DOMContentLoaded", () => {
    // Get the logout button element
    const logoutButton = document.getElementById("logoutButton");
    // Ensure the element is found and is an HTMLAnchorElement
    if (logoutButton) {
        // Add an event listener to the logout button
        logoutButton.addEventListener("click", (event) => {
            event.preventDefault(); // Prevent the default link behavior
            // Remove the token from local storage
            localStorage.removeItem("token");
            localStorage.removeItem("userId");
            window.location.href = "/fitness_tracking_app_2024_25/client/login.html";
        });
    }
});
