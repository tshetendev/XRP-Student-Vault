let rippleAddress;

async function submitRecord() {
    const studentId = document.getElementById("studentId").value;
    const name = document.getElementById("name").value;
    const year = document.getElementById("year").value;
    const course = document.getElementById("course").value;
    const grade = document.getElementById("grade").value;

    const rippleAddress = getRippleAddress();

    if (!rippleAddress || !studentId || !name || !course || !grade || !year) {
        alert('Please enter valid data in all fields.');
        return;
    }

    const requestBody = {
        rippleAddress,
        studentId,
        name,
        year,
        course,
        grade
    };

    const confirmed = confirm('Are you sure you want to submit this record?');

    if (!confirmed) {
        return;
    }

    try {
        const response = await fetch('/create-record', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestBody),
        });

        const result = await response.json();

        if (result.success) {
            alert(`Record submitted successfully!\nDetails:
            \nRecord ID: ${result.recordId}
            \nRipple Address: ${rippleAddress}
            \nStudent ID: ${studentId}
            \nName: ${name}
            \nYear: ${year}
            \nCourse: ${course}
            \nGrade: ${grade}`
            );
        } else {
            alert(`Record submission failed!\nError: ${result.error}`);
        }

    } catch (error) {
        console.error('Error:', error);
    }
}


// Function to get the Ripple address (replace with your actual method)
// function getRippleAddress() {
//     // Implement the logic to obtain the Ripple address from the user
//     // Return the Ripple address as a string
//     return 'rYourRippleAddress';
// }

function isValidRippleAddress(address) {
    // Regular expression for a Ripple address
    const rippleAddressRegex = /^r[1-9A-HJ-NP-Za-km-z]{25,34}$/;

    // Check if the address matches the regular expression
    return rippleAddressRegex.test(address);
}

function getStoredRippleAddress() {
    // Retrieve the Ripple address from localStorage
    return localStorage.getItem('rippleAddress');
}

function setStoredRippleAddress(address) {
    // Store the Ripple address in localStorage
    localStorage.setItem('rippleAddress', address);
}

function getRippleAddress() {
    // Get the stored Ripple address
    const storedRippleAddress = getStoredRippleAddress();

    // If the Ripple address is already stored and valid, return it
    if (storedRippleAddress && isValidRippleAddress(storedRippleAddress)) {
        return storedRippleAddress;
    }

    // Prompt the user for their Ripple address
    let rippleAddress;
    do {
        rippleAddress = prompt('Please enter your Ripple address:');
        if (!isValidRippleAddress(rippleAddress)) {
            alert('Invalid Ripple address. Please enter a valid address.');
        }
    } while (!isValidRippleAddress(rippleAddress));

    // Store the Ripple address for future use
    setStoredRippleAddress(rippleAddress);

    return rippleAddress;
}

// Call getRippleAddress as soon as the page loads
window.onload = function () {
    const rippleAddress = getRippleAddress();

    // Use the rippleAddress as needed
    console.log('Ripple Address:', rippleAddress);
};

async function fetchRecordHistory() {
    try {
        const response = await fetch('/history');
        const history = await response.json();

        // Display the history in the UI as a table
        const historyContainer = document.getElementById('historyContainer');
        historyContainer.innerHTML = '<h2>Grade Record History</h2>';

        if (history.length === 0) {
            historyContainer.innerHTML += '<p>No records available.</p>';
        } else {
            // Create a table
            const table = document.createElement('table');
            table.border = '1';

            // Create table headers
            const headers = ['Record ID', 'Ripple Address', 'Student ID', 'Name', 'Year', 'Course', 'Grade'];
            const headerRow = document.createElement('tr');
            headers.forEach(headerText => {
                const header = document.createElement('th');
                header.appendChild(document.createTextNode(headerText));
                headerRow.appendChild(header);
            });
            table.appendChild(headerRow);

            // Populate the table with record data
            history.forEach(record => {
                const row = document.createElement('tr');
                const data = [
                    record.recordId,
                    record.rippleAddress,
                    record.studentId,
                    record.name,
                    record.year,
                    record.course,
                    record.grade
                ];

                data.forEach(cellData => {
                    const cell = document.createElement('td');
                    cell.appendChild(document.createTextNode(cellData));
                    row.appendChild(cell);
                });

                table.appendChild(row);
            });

            historyContainer.appendChild(table);
        }
    } catch (error) {
        console.error('Error fetching record history:', error);
    }
}

fetchRecordHistory();
