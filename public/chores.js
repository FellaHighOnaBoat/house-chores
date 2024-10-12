// List of chores and housemates
const chores = [
    "Clean Toilet",
    "Clean Bathroom",
    "Clean Kitchen",
    "Clean Stairs/Landing",
    "Empty the Bins (1st half of the week)",
    "Empty the Bins (2nd half of the week)"
];

const housemates = ["Araeya", "Bailey", "Jamie", "Jodie", "Ollie", "Tyler"];

// I am aware this in unsecure, I do not fucking care (:
const adminPassword = "admin!";

// Version identifier for the chore list
const version = "v1.0";

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

// Function to fetch chores from the server
async function fetchChores() {
    try {
        const response = await fetch('/api/chores');
        if (!response.ok) throw new Error('Chore list not found');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching chores:', error);
        return [];  // Return an empty array if there's an error
    }
}

// Function to save the new chore list to the server
async function saveChores(newChores) {
    try {
        const response = await fetch('/api/chores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password: 'admin!', newChores })
        });

        if (response.ok) {
            console.log('Chores updated successfully');
        } else {
            console.error('Failed to update chores');
        }
    } catch (error) {
        console.error('Error saving chores:', error);
    }
}

// Function to load chores from the server, or shuffle if necessary
async function loadChores() {
    const serverChores = await fetchChores();
    const savedVersion = localStorage.getItem('choreVersion');

    // If no saved chores or version has changed, shuffle and save new list
    if (!serverChores.length || savedVersion !== version) {
        const newChoresAssignment = shuffle([...chores]);
        await saveChores(newChoresAssignment); // Save to the server
        localStorage.setItem('choreVersion', version); // Save the current version
        return newChoresAssignment;
    }

    return serverChores; // Return saved chores from the server
}

// Function to display chores
async function displayChores() {
    const tableBody = document.getElementById('choresTableBody');
    const currentChores = await fetchChores();

    if (currentChores.length === 0) {
        console.error('No chores available to display.');
        return;
    }

    tableBody.innerHTML = '';  // Clear previous rows
    housemates.forEach((housemate, index) => {
        const row = document.createElement('tr');
        const housemateCell = document.createElement('td');
        const choreCell = document.createElement('td');

        housemateCell.textContent = housemate;
        choreCell.textContent = currentChores[index % currentChores.length];  // Assign chores

        row.appendChild(housemateCell);
        row.appendChild(choreCell);
        tableBody.appendChild(row);
    });
}

// Admin refresh function
async function adminRefresh() {
    const enteredPassword = prompt("Please enter the admin password to refresh the list:");

    if (enteredPassword === 'admin!') {
        alert("Password correct! Refreshing the chore assignments...");

        // Shuffle the chores for a new assignment
        const shuffledChores = shuffle([...chores]);
        await saveChores(shuffledChores);  // Save new assignment to the server
        displayChores();  // Update the display with the new chores
    } else {
        alert("Incorrect password! Access denied.");
    }
}

// Load the chores when the page is loaded
window.onload = displayChores;
