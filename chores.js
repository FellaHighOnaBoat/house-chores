// List of chores and housemates
const chores = [
    "Clean Toilet",
    "Clean Bathroom",
    "Clean Kitchen",
    "Clean Stairs/Landing",
    "Empty the Bins (1st half of the week)",
    "Empty the Bins (2nd half of the week)"
];

const housemates = ["Araeya", "Bailey", "Jamie", "Jodie", "Olly", "Tyler"]; // Add more names if needed

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

// Function to load chores from local storage or create a new one if not existing
function loadChores() {
    const lastWeekChores = JSON.parse(localStorage.getItem('lastWeekChores')) || [];
    let newChoresAssignment = [];

    do {
        newChoresAssignment = shuffle([...chores]); // Shuffle chores each week
    } while (newChoresAssignment.some((chore, index) => chore === lastWeekChores[index]));

    localStorage.setItem('lastWeekChores', JSON.stringify(newChoresAssignment)); // Save the new assignment
    return newChoresAssignment;
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
        localStorage.removeItem('lastWeekChores'); // Clear stored chores
        displayChores(); // Refresh the table with new assignments
    } else {
        alert("Incorrect password! Access denied.");
    }
}

// Update the chores every week (this example uses a daily reset for testing)
setInterval(displayChores, 7 * 24 * 60 * 60 * 1000); // Weekly update in milliseconds (1 week)
window.onload = displayChores;
