// List of chores and housemates
const chores = [
    "Clean Toilet",
    "Clean Bathroom",
    "Clean Kitchen",
    "Clean Stairs/Landing",
    "Empty the Bins (1st half of the week)",
    "Empty the Bins (2nd half of the week)"
];

const housemates = ["Araeya", "Bailey", "Jamie", "Jodie", "Ollie", "Tyler"]; // Add more names if needed

// Admin password (for demonstration purposes, this is stored securely on the real version)
const adminPassword = "admin!";

// Function to shuffle an array (Fisher-Yates algorithm)
function shuffle(array) {
    let currentIndex = array.length, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        // Swap it with the current element.
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex], array[currentIndex]];
    }

    return array;
}

// Function to check if a week has passed
function isWeekPassed() {
    const lastUpdated = localStorage.getItem('lastUpdated');
    console.log("Last Updated: ", lastUpdated);

    if (!lastUpdated) {
        console.log("No last updated date found. Need to shuffle.");
        return true; // No last update means it’s the first time, so we need to shuffle
    }

    const oneWeek = 7 * 24 * 60 * 60 * 1000; // One week in milliseconds
    const now = new Date().getTime();
    const weekPassed = now - parseInt(lastUpdated, 10) > oneWeek;
    console.log("Has a week passed? ", weekPassed);
    
    return weekPassed;
}

// Function to load chores from local storage or shuffle if not set or week has passed
function loadChores() {
    let savedChores = JSON.parse(localStorage.getItem('currentWeekChores'));
    console.log("Saved chores: ", savedChores);

    // If no saved chores or if a week has passed, shuffle and save new list
    if (!savedChores || isWeekPassed()) {
        console.log("Shuffling new chores");
        let newChoresAssignment = shuffle([...chores]);
        localStorage.setItem('currentWeekChores', JSON.stringify(newChoresAssignment));
        localStorage.setItem('lastUpdated', new Date().getTime()); // Save current time as last updated
        return newChoresAssignment;
    }

    console.log("Returning saved chores");
    return savedChores; // Return saved chores if it's still within the week
}

// Function to display chores
function displayChores() {
    const tableBody = document.getElementById('choresTableBody');
    const currentChores = loadChores();

    tableBody.innerHTML = ''; // Clear previous rows
    housemates.forEach((housemate, index) => {
        const row = document.createElement('tr');
        const housemateCell = document.createElement('td');
        const choreCell = document.createElement('td');

        housemateCell.textContent = housemate;
        choreCell.textContent = currentChores[index % currentChores.length]; // Assign chores

        row.appendChild(housemateCell);
        row.appendChild(choreCell);
        tableBody.appendChild(row);
    });
}

// Admin refresh function
function adminRefresh() {
    const enteredPassword = prompt("Please enter the admin password to refresh the list:");

    if (enteredPassword === adminPassword) {
        alert("Password correct! Refreshing the chore assignments...");
        localStorage.removeItem('currentWeekChores'); // Clear stored chores
        localStorage.setItem('lastUpdated', new Date().getTime()); // Reset last updated time
        displayChores(); // Refresh the table with new assignments
    } else {
        alert("Incorrect password! Access denied.");
    }
}

// Initial display of chores
window.onload = displayChores;
