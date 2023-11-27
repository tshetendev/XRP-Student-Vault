const express = require('express');
const bodyParser = require('body-parser');
const xrpl = require('xrpl');
const { v4: uuidv4 } = require('uuid'); // Import the uuid library

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));
const recordHistory = [];

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); // Change 'index.html' to 'login.html'
});

app.get('/frontend.js', (req, res) => {
    res.sendFile(__dirname + '/frontend.js');
});

app.get('/history', (req, res) => {
    res.json(recordHistory);
});

app.post('/create-record', async (req, res) => {
    let api; // Declare the RippleAPI variable outside the try block

    try {
        api = new xrpl.Client('wss://s.altnet.rippletest.net:51233');
        await api.connect();

        // Extract student information from the request body
        const { studentId, name, course, grade, year, rippleAddress } = req.body;

        // Validation
        if (!studentId || !name || !course || !grade || !year || !rippleAddress) {
            res.status(400).json({ success: false, error: 'Invalid data. Please check your input.' });
            return;
        }

        // Store the record in the history (replace with database insertion in a real application)
        const recordId = generateRandomId(); // Generate a random ID
        recordHistory.push({ recordId, studentId, name, course, grade, year, rippleAddress });

        // Create a transaction object or perform actions based on the new data
        // For simplicity, let's just log the data for now
        console.log('Record Data:', { recordId, studentId, name, course, grade, year, rippleAddress });

        // The following is a placeholder; replace it with your Ripple-specific transaction creation logic
        const result = { success: true, recordId, transactionResult: { result: 'tesSUCCESS' } };

        res.json(result);
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, error: error.message });
    } finally {
        if (api) {
            await api.disconnect();
        }
    }
});

// Function to generate a random ID (replace with your actual method)
function generateRandomId() {
    return Math.random().toString(36).substring(7);
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
