// Add event listener for form submission
document.querySelector('form').addEventListener('submit', async function (event) {
    event.preventDefault(); // Prevent form submission from refreshing the page

    // Get the birth date input
    const birthDateInput = document.getElementById('birth-date').value;
    if (!birthDateInput) {
        alert('Please enter a valid birth date.');
        return;
    }

    // Check if any filters are toggled
    const activeFilters = Array.from(document.querySelectorAll('.filter-toggle.active'))
        .map(button => button.getAttribute('data-filter'));
    if (activeFilters.length === 0) {
        alert('Please select at least one milestone category.');
        return;
    }

    // Calculate the baby's age in months
    const birthDate = new Date(birthDateInput); // Get the birth date
    const today = new Date(); // Get today's date
    const ageInMonths = today.getMonth() - birthDate.getMonth() + 
        (12 * (today.getFullYear() - birthDate.getFullYear())); // Calculate age in months

    // Fetch milestones from data.json
    let milestonesData;
    try {
        const response = await fetch('./data.json'); // Adjust path if needed
        if (!response.ok) {
            throw new Error('Failed to load milestones data.');
        }
        milestonesData = await response.json();
        console.log('Milestones data loaded:', milestonesData); // Debugging log
    } catch (error) {
        console.error(error);
        alert('Could not load milestones data. Please check the data.json file.');
        return;
    }

    // Filter milestones based on active filters and baby's age
    const filteredMilestones = milestonesData
        .filter(category => activeFilters.includes(category.category)) // Filter by active categories
        .flatMap(category => category.milestones) // Flatten milestones
        .filter(item => item.age === ageInMonths); // Filter by exact age

    console.log('Filtered Milestones:', filteredMilestones); // Debugging log

    // Handle case where no milestones are found
    if (filteredMilestones.length === 0) {
        alert('No milestones found for the selected filters and calculated age.');
        console.log('No milestones found for the selected filters and calculated age.');
        return;
    }

    // Populate table with filtered milestones
    const table = document.getElementById('milestone-table');
    const tbody = table.querySelector('tbody');

    // Clear existing rows
    tbody.innerHTML = '';

    filteredMilestones.forEach(item => {
        const row = document.createElement('tr');
        const categoryCell = document.createElement('td');
        const ageCell = document.createElement('td');
        const milestoneCell = document.createElement('td');

        // Find the category for the current milestone
        const category = milestonesData.find(category =>
            category.milestones.includes(item)
        )?.category;

        categoryCell.textContent = category || 'Unknown'; // Add category name
        ageCell.textContent = item.age;

        // Handle milestone being a string or an array of strings
        if (Array.isArray(item.milestone)) {
            const ul = document.createElement('ul');
            item.milestone.forEach(milestone => {
                const li = document.createElement('li');
                li.textContent = milestone;
                ul.appendChild(li);
            });
            milestoneCell.appendChild(ul);
        } else {
            milestoneCell.textContent = item.milestone;
        }

        // Append cells to the row
        row.appendChild(categoryCell);
        row.appendChild(ageCell);
        row.appendChild(milestoneCell);

        // Append the row to the table body
        tbody.appendChild(row);
        console.log('Row added to table:', row); // Debugging log
    });

    // Show the table
    table.style.display = 'table';

    // Show the table container
    const tableContainer = document.getElementById('milestone-table-container');
    tableContainer.classList.add('visible');
    console.log('Table container made visible.'); // Debugging log
});


// Function to update the "Choose Milestones" button text with the selected filter count
function updateFilterCount() {
    const activeFilters = document.querySelectorAll('.filter-toggle.active').length; // Count active filters
    const filterButton = document.querySelector('.dropdown-toggle'); // Get the "Choose Milestones" button

    // Update the button text based on the number of active filters
    if (activeFilters > 0) {
        filterButton.textContent = `Milestones Chosen (${activeFilters})`; // Show count if filters are selected
    } else {
        filterButton.textContent = `Choose Milestones`; // Default text if no filters are selected
    }
}

// Handle filter toggle buttons
document.querySelectorAll('.filter-toggle').forEach(button => {
    button.addEventListener('click', () => {
        button.classList.toggle('active'); // Toggle the active state
        updateFilterCount(); // Update the filter count whenever a toggle is clicked
    });
});

// Handle "Clear Filter" button
document.getElementById('clear-filter').addEventListener('click', (event) => {
    event.stopPropagation(); // Prevent event bubbling
    // Remove the "active" class from all filter toggle buttons
    document.querySelectorAll('.filter-toggle').forEach(button => button.classList.remove('active'));

    // Update the "Choose Milestones" button text
    updateFilterCount();
});

// Initialize the filter count on page load
updateFilterCount();

// Handle "Select All" button for filters
document.getElementById('select-all').addEventListener('click', () => {
    document.querySelectorAll('.filter-toggle').forEach(button => button.classList.add('active'));
    updateMilestoneTable(); // Update the table after selecting all filters
});

// Handle "Deselect All" button for filters
document.getElementById('deselect-all').addEventListener('click', () => {
    document.querySelectorAll('.filter-toggle').forEach(button => button.classList.remove('active'));
    updateMilestoneTable(); // Update the table after deselecting all filters
});

// Function to update the milestone table based on active filters
async function updateMilestoneTable() {
    const activeFilters = Array.from(document.querySelectorAll('.filter-toggle.active'))
        .map(button => button.getAttribute('data-filter'));

    // Fetch milestones from data.json
    let milestonesData;
    try {
        const response = await fetch('./data.json'); // Adjust path if needed
        if (!response.ok) {
            throw new Error('Failed to load milestones data.');
        }
        milestonesData = await response.json();
        console.log('Milestones data loaded:', milestonesData); // Debugging log
    } catch (error) {
        console.error(error);
        alert('Could not load milestones data. Please check the data.json file.');
        return;
    }

    // Get the baby's age in months from the form input
    const birthDateInput = document.getElementById('birth-date').value;
    if (!birthDateInput) {
        alert('Please enter a valid birth date.');
        return;
    }
    const birthDate = new Date(birthDateInput);
    const today = new Date();
    const ageInMonths = today.getMonth() - birthDate.getMonth() + 
        (12 * (today.getFullYear() - birthDate.getFullYear()));

    // Filter milestones based on active filters and baby's age
    const filteredMilestones = milestonesData
        .filter(category => activeFilters.includes(category.category)) // Filter by active categories
        .flatMap(category => category.milestones) // Flatten milestones
        .filter(item => item.age === ageInMonths); // Filter by exact age

    console.log('Filtered Milestones:', filteredMilestones); // Debugging log

    // Handle case where no milestones are found
    if (filteredMilestones.length === 0) {
        alert('No milestones found for the selected filters and calculated age.');
        console.log('No milestones found for the selected filters and calculated age.');
        return;
    }

    // Populate table with filtered milestones
    const table = document.getElementById('milestone-table');
    const tbody = table.querySelector('tbody');

    // Clear existing rows
    tbody.innerHTML = '';

    filteredMilestones.forEach(item => {
        const row = document.createElement('tr');
        const categoryCell = document.createElement('td');
        const ageCell = document.createElement('td');
        const milestoneCell = document.createElement('td');

        // Find the category for the current milestone
        const category = milestonesData.find(category =>
            category.milestones.includes(item)
        )?.category;

        categoryCell.textContent = category || 'Unknown'; // Add category name
        ageCell.textContent = item.age;

        // Handle milestone being a string or an array of strings
        if (Array.isArray(item.milestone)) {
            const ul = document.createElement('ul');
            item.milestone.forEach(milestone => {
                const li = document.createElement('li');
                li.textContent = milestone;
                ul.appendChild(li);
            });
            milestoneCell.appendChild(ul);
        } else {
            milestoneCell.textContent = item.milestone;
        }

        // Append cells to the row
        row.appendChild(categoryCell);
        row.appendChild(ageCell);
        row.appendChild(milestoneCell);

        // Append the row to the table body
        tbody.appendChild(row);
        console.log('Row added to table:', row); // Debugging log
    });

    // Show the table container
    const tableContainer = document.getElementById('milestone-table-container');
    tableContainer.classList.add('visible');
    console.log('Table container made visible.'); // Debugging log
}

// Test function for age calculation
function testAgeCalculation() {
    const testCases = [
        { birthDate: '2025-03-07', expectedAge: 0 }, // Less than one month
        { birthDate: '2025-03-05', expectedAge: 1 }, // Exactly one month
        { birthDate: '2024-07-04', expectedAge: 9 }, // Nine months
        { birthDate: '2024-03-04', expectedAge: 12 }, // One year
        { birthDate: '2023-03-04', expectedAge: 24 }  // Two years
    ];

    const today = new Date();

    testCases.forEach(({ birthDate, expectedAge }) => {
        const birthDateObj = new Date(birthDate);
        let ageInMonths = (today.getFullYear() - birthDateObj.getFullYear()) * 12;
        ageInMonths += today.getMonth() - birthDateObj.getMonth();
        if (today.getDate() < birthDateObj.getDate()) {
            ageInMonths--; // Adjust if the current day is before the birth day
        }

        console.assert(
            ageInMonths === expectedAge,
            `Test failed for birth date ${birthDate}: expected ${expectedAge}, got ${ageInMonths}`
        );
    });

    console.log('All age calculation tests completed.');
}

// Call the test function
testAgeCalculation();