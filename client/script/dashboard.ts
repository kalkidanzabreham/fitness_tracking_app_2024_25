
/*  check user login */
// Retrieve userId from localStorage after login
const userId = localStorage.getItem("userId");

if (!userId) {
  // If the user is not logged in, show the message and clear the content
  document.body.innerHTML = `
    <div style="text-align: center; margin-top: 20vh;">
      <h1 style="font-size: 4rem; color: red;">ERROR</h1>
      <h2 style="font-size: 3rem; color: red;">You must log in to see your dashboard</h2>
    </div>
  `;

  // Redirect to the login page after 3 seconds
  setTimeout(() => {
    window.location.href = "/fitness_tracking_app_2024_25/client/login.html";
  }, 4000); // 3 seconds delay
} else {
  // Use the userId to fetch the relevant data
  fetchPreviousData(parseInt(userId)); // Fetch activity and BMI data
  fetchProgress(parseInt(userId)); // Fetch progress summary
}



document.addEventListener("DOMContentLoaded", () => {
  // Fetch username from local storage
  const username: string | null = localStorage.getItem("username");

  // Get the div where the username will be displayed
  const usernameDisplay = document.getElementById(
    "usernameDisplay"
  ) as HTMLDivElement;

  if (username) {
    usernameDisplay.textContent = `Hello, ${username}!`;
  } else {
    usernameDisplay.textContent = "Hello, Guest!";
  }
});

/*  activity crud from */

const addActivityForm = document.getElementById(
  "addActivityForm"
) as HTMLFormElement;
addActivityForm.addEventListener("submit", function (event) {
  event.preventDefault();
  console.log("Form submitted"); // Debugging line

  const workout = (document.getElementById("workout") as HTMLSelectElement)
    .value;
  const duration = parseInt(
    (document.getElementById("duration") as HTMLInputElement).value
  );
  const caloriesBurned = parseInt(
    (document.getElementById("caloriesBurned") as HTMLInputElement).value
  );
  const date = new Date().toLocaleDateString();

  console.log(workout, duration, caloriesBurned); // Log form values for debugging

  const activity = { type: workout, duration, caloriesBurned, date };

  if (currentActivityId) {
    // Update existing activity
    fetch(`https://fitnessback-22sb5vjxa-kalkidanzabrehams-projects.vercel.app/activities/${currentActivityId}`, {
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
  } else {
    // Add new activity
    fetch(`https://fitnessback-22sb5vjxa-kalkidanzabrehams-projects.vercel.app/activities/${userId}`, {
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

/* activity adding form */

let activityData: {
  id: number;
  type: string;
  duration: number;
  caloriesBurned: number;
  date: string;
}[] = [];
let activityLabels: string[] = [];
let currentActivityId: number | null = null; // To track the activity being updated


function fetchPreviousData(userId: number): void {
  fetch(`https://fitnessback-22sb5vjxa-kalkidanzabrehams-projects.vercel.app/activities/${userId}`)
    .then((response) => response.json())
    .then(
      (
        data: {
          id: number;
          type: string;
          duration: number;
          caloriesBurned: number;
          date: string;
        }[]
      ) => {
        activityData = data;
        activityLabels = data.map((activity) =>
          new Date(activity.date).toLocaleDateString()
        );
        populateActivitiesTable();
      }
    )
    .catch((error) => console.error("Error fetching activities:", error));

  fetch(`https://fitnessback-22sb5vjxa-kalkidanzabrehams-projects.vercel.app/progress/${userId}`)
    .then((response) => response.json())
    .then((data: { bmiData: number[]; labels: string[] }) => {
      bmiData = data.bmiData;
      activityLabels = data.labels;
    })
    .catch((error) => console.error("Error fetching BMI progress:", error));
}

function populateActivitiesTable(): void {
  const tableBody = document
    .getElementById("activitiesTable")
    ?.getElementsByTagName("tbody")[0];
  if (!tableBody) return;

  tableBody.innerHTML = ""; // Clear the table before repopulating

  activityData.forEach((activity) => {
    const row = tableBody.insertRow();
    row.insertCell(0).textContent = activity.type;
    row.insertCell(1).textContent = activity.duration.toString();
    row.insertCell(2).textContent = activity.caloriesBurned.toString();

    // Update button
    const updateButton = document.createElement("button");
    updateButton.textContent = "Edit";
    updateButton.style.backgroundColor = "blue";
    updateButton.style.color = "white";
    updateButton.style.fontSize ="18px"
    updateButton.style.fontWeight = "600"
    updateButton.style.marginRight = "8px";
    updateButton.style.paddingLeft = "17px"
    updateButton.style.paddingRight = "20px"
    updateButton.style.marginBottom = "10px"
    updateButton.classList.add("action-button");

    updateButton.addEventListener("click", () => {
      currentActivityId = activity.id;
      (document.getElementById("workout") as HTMLSelectElement).value =
        activity.type;
      (document.getElementById("duration") as HTMLInputElement).value =
        activity.duration.toString();
      (document.getElementById("caloriesBurned") as HTMLInputElement).value =
        activity.caloriesBurned.toString();
    });

    // Delete button
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Delete";
    deleteButton.style.backgroundColor = "darkred";
    deleteButton.style.fontSize = "18px"
    deleteButton.style.fontWeight = "600"
    deleteButton.style.color = "white";
    deleteButton.style.paddingLeft = "11px";
    deleteButton.classList.add("action-button");

    deleteButton.addEventListener("click", () => {
      if (activity.id) deleteActivity(activity.id);
    });

    const actionsCell = row.insertCell(3);
    actionsCell.appendChild(updateButton);
    actionsCell.appendChild(deleteButton);
  });
}

function deleteActivity(activityId: number): void {
  fetch(`https://fitnessback-22sb5vjxa-kalkidanzabrehams-projects.vercel.app/activities/${activityId}`, {
    method: "DELETE",
  })
    .then((response) => response.json())
    .then(() => {
      console.log("Activity deleted successfully");
      // Remove from the local data
      activityData = activityData.filter(
        (activity) => activity.id !== activityId
      );
      if (userId) {
        fetchProgress(parseInt(userId));
      }
      populateActivitiesTable();
    })
    .catch((error) => console.error("Error deleting activity:", error));
}

/* bmi calculator */ 
let bmiData: number[] = [];
const bmiForm = document.getElementById("bmiForm") as HTMLFormElement;
bmiForm.addEventListener("submit", function (event: Event) {
  event.preventDefault();

  const weight = parseFloat(
    (document.getElementById("weight") as HTMLInputElement).value
  );
  const height = parseFloat(
    (document.getElementById("height") as HTMLInputElement).value
  );

  if (weight <= 0 || height <= 0) {
    alert("Please provide valid weight and height.");
    return;
  }

  const bmi = weight / (height * height);
  let bmiLabel = "Normal";

  if (bmi < 18.5) {
    bmiLabel = "Underweight";
  } else if (bmi >= 25 && bmi < 30) {
    bmiLabel = "Overweight";
  } else if (bmi >= 30) {
    bmiLabel = "Obese";
  }

  bmiData.push(bmi);
  activityLabels.push(new Date().toLocaleDateString());

  (
    document.getElementById("bmiResult") as HTMLElement
  ).innerText = `Your BMI: ${bmi.toFixed(2)} (${bmiLabel})`;
});

// Interface for the progress data structure returned from the API
interface ProgressData {
  totalDuration: number;
  totalCaloriesBurned: number;
}


/* Progress Tracker */

// Function to fetch and display progress summary
async function fetchProgress(userId: number): Promise<void> {
  try {
    const response: Response = await fetch(
      `https://fitnessback-22sb5vjxa-kalkidanzabrehams-projects.vercel.app/progress/${userId}`
    );
    const progressData: ProgressData = await response.json();

    // Display Progress Summary
    const progressSummary: HTMLElement | null =
      document.getElementById("progressSummary");
    if (progressSummary) {
      progressSummary.innerHTML = `
          <p><strong>Total Duration:</strong> ${progressData.totalDuration} minutes</p>
          <p><strong>Total Calories Burned:</strong> ${progressData.totalCaloriesBurned} kcal</p>
        `;
    }
  } catch (error) {
    console.error("Error fetching progress data:", error);
  }
}


/*  lost kilogram calculator */

// fetchPreviousData(parseInt(userId));
// Function to calculate kilograms lost based on total calories burned
function calculateKilogramsLost(): void {
  // Get the total calories burned from the progress summary
  const progressSummary: HTMLElement | null =
    document.getElementById("progressSummary");
  if (!progressSummary) {
    console.error("Progress summary element not found");
    return;
  }

  const totalCaloriesText: string =
    (progressSummary.querySelector("p:nth-child(2)") as HTMLElement)
      ?.innerText || "";

  const totalCalories: number = parseInt(
    totalCaloriesText
      .replace("Total Calories Burned: ", "")
      .replace(" kcal", "")
  );

  if (isNaN(totalCalories)) {
    console.error("Total calories is not a valid number");
    return;
  }

  // Convert calories to kilograms lost
  const kilogramsLost: number = totalCalories / 7700; // 1 kg of fat is roughly equivalent to 7700 calories

  // Display the result next to the button
  const resultElement: HTMLElement | null = document.getElementById(
    "kilogramsLostResult"
  );
  if (resultElement) {
    resultElement.innerText = ` You Lost: ${kilogramsLost.toFixed(2)} kg`;
  }
}


if (userId) {
  fetchProgress(parseInt(userId));
}

document.addEventListener("DOMContentLoaded", () => {
  // Get the logout button element
  const logoutButton = document.getElementById(
    "logoutButton"
  ) as HTMLAnchorElement;

  // Ensure the element is found and is an HTMLAnchorElement
  if (logoutButton) {
    // Add an event listener to the logout button
    logoutButton.addEventListener("click", (event: MouseEvent) => {
      event.preventDefault(); // Prevent the default link behavior

      // Remove the token from local storage
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      window.location.href = "/fitness_tracking_app_2024_25/client/login.html";
    });
  }
});
