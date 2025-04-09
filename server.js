// server.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(bodyParser.json());
app.use(cors());

// Load milestones from a JSON file
const milestones = JSON.parse(fs.readFileSync('./data.json', 'utf-8'));

// Endpoint to get milestones
app.get('/milestones', (req, res) => {
    res.json(milestones);
});

// Endpoint to add a new milestone
app.post('/milestones', (req, res) => {
    const newMilestone = req.body;

    if (!newMilestone.age || !newMilestone.milestone) {
        return res.status(400).json({ error: "Age and milestone are required" });
    }

    // Ensure milestone is either a string or an array of strings
    if (
        typeof newMilestone.milestone !== 'string' &&
        !Array.isArray(newMilestone.milestone)
    ) {
        return res.status(400).json({ error: "Milestone must be a string or an array of strings" });
    }

    milestones.push(newMilestone);

    // Save the updated milestones to the JSON file
    fs.writeFileSync('./data.json', JSON.stringify(milestones, null, 2), 'utf-8');

    res.status(201).json(newMilestone);
});

// Endpoint to get all categories
app.get('/categories', (req, res) => {
    const categories = milestones.map(category => category.category);
    res.json(categories);
});

// Endpoint to get milestones for a specific category
app.get('/categories/:category', (req, res) => {
    const categoryName = req.params.category;
    const category = milestones.find(c => c.category === categoryName);

    if (!category) {
        return res.status(404).json({ error: "Category not found" });
    }

    res.json(category.milestones);
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));