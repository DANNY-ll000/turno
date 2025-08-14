const express = require('express');
const cors = require('cors');
const fs = require('fs').promises;
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;
const DATA_FILE = path.join(__dirname, 'missions-data.json');

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static('.'));

// Initialize data file if it doesn't exist
async function initializeDataFile() {
    try {
        await fs.access(DATA_FILE);
    } catch (error) {
        await fs.writeFile(DATA_FILE, JSON.stringify({ missions: [], usedCombinations: {} }));
    }
}

// Read data from file
async function readData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        return { missions: [], usedCombinations: {} };
    }
}

// Write data to file
async function writeData(data) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
}

// API Routes

// Get all missions
app.get('/api/missions', async (req, res) => {
    try {
        const data = await readData();
        res.json(data.missions);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch missions' });
    }
});

// Get used combinations
app.get('/api/used-combinations', async (req, res) => {
    try {
        const data = await readData();
        res.json(data.usedCombinations);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch used combinations' });
    }
});

// Add new mission
app.post('/api/missions', async (req, res) => {
    try {
        const data = await readData();
        const newMission = req.body;
        
        // Add timestamp and ID if not present
        if (!newMission.id) {
            newMission.id = 'mission_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
        if (!newMission.timestamp) {
            newMission.timestamp = new Date().toISOString();
        }
        
        data.missions.push(newMission);
        await writeData(data);
        
        res.json({ success: true, mission: newMission });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save mission' });
    }
});

// Update mission status
app.put('/api/missions/:id', async (req, res) => {
    try {
        const data = await readData();
        const missionId = req.params.id;
        const { status } = req.body;
        
        const missionIndex = data.missions.findIndex(m => m.id === missionId);
        if (missionIndex === -1) {
            return res.status(404).json({ error: 'Mission not found' });
        }
        
        data.missions[missionIndex].status = status;
        await writeData(data);
        
        res.json({ success: true, mission: data.missions[missionIndex] });
    } catch (error) {
        res.status(500).json({ error: 'Failed to update mission' });
    }
});

// Delete mission
app.delete('/api/missions/:id', async (req, res) => {
    try {
        const data = await readData();
        const missionId = req.params.id;
        
        const missionIndex = data.missions.findIndex(m => m.id === missionId);
        if (missionIndex === -1) {
            return res.status(404).json({ error: 'Mission not found' });
        }
        
        data.missions.splice(missionIndex, 1);
        await writeData(data);
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to delete mission' });
    }
});

// Save used combination
app.post('/api/used-combinations', async (req, res) => {
    try {
        const data = await readData();
        const { combinations } = req.body;
        
        // Merge new combinations with existing ones
        data.usedCombinations = { ...data.usedCombinations, ...combinations };
        await writeData(data);
        
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to save used combinations' });
    }
});

// Clear all data
app.delete('/api/clear-all', async (req, res) => {
    try {
        await writeData({ missions: [], usedCombinations: {} });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: 'Failed to clear data' });
    }
});

// Initialize and start server
initializeDataFile().then(() => {
    app.listen(PORT, () => {
        console.log(`🚀 Turno Server running on http://localhost:${PORT}`);
        console.log(`📱 Main App: http://localhost:${PORT}`);
        console.log(`🛡️ Admin Panel: http://localhost:${PORT}/admin.html`);
    });
});