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

// Function to save the new chore list to the server (Admin only)
async function saveChores(newChores) {
    const enteredPassword = prompt("Please enter the admin password:");

    try {
        const response = await fetch('/api/chores', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-admin-password': enteredPassword  // Send password in the header
            },
            body: JSON.stringify({ newChores })
        });

        if (response.ok) {
            console.log('Chores updated successfully');
        } else if (response.status === 403) {
            alert("Incorrect password! Access denied.");
        } else {
            console.error('Failed to update chores');
        }
    } catch (error) {
        console.error('Error saving chores:', error);
    }
}

// Function to display chores from the server
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
    const shuffledChores = shuffle([...chores]);
    await saveChores(shuffledChores);  // Save new assignment to the server
    displayChores();  // Update the display with the new chores
}

// Load the chores when the page is loaded
window.onload = displayChores;
