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
        console.log('✅ Data file exists');
    } catch (error) {
        console.log('📝 Creating new data file...');
        await fs.writeFile(DATA_FILE, JSON.stringify({ missions: [], usedCombinations: {} }));
        console.log('✅ Data file created');
    }
}

// Read data from file
async function readData() {
    try {
        const data = await fs.readFile(DATA_FILE, 'utf8');
        console.log('📖 Data read successfully');
        return JSON.parse(data);
    } catch (error) {
        console.error('❌ Error reading data:', error);
        return { missions: [], usedCombinations: {} };
    }
}

// Write data to file
async function writeData(data) {
    try {
        await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2));
        console.log('💾 Data saved successfully');
    } catch (error) {
        console.error('❌ Error saving data:', error);
        throw error;
    }
}

// API Routes

// Get all missions
app.get('/api/missions', async (req, res) => {
    try {
        console.log('📡 GET /api/missions');
        const data = await readData();
        res.json(data.missions);
    } catch (error) {
        console.error('❌ Error fetching missions:', error);
        res.status(500).json({ error: 'Failed to fetch missions' });
    }
});

// Get used combinations
app.get('/api/used-combinations', async (req, res) => {
    try {
        console.log('📡 GET /api/used-combinations');
        const data = await readData();
        res.json(data.usedCombinations);
    } catch (error) {
        console.error('❌ Error fetching used combinations:', error);
        res.status(500).json({ error: 'Failed to fetch used combinations' });
    }
});

// Add new mission
app.post('/api/missions', async (req, res) => {
    try {
        console.log('📡 POST /api/missions');
        console.log('📦 Request body:', req.body);
        
        const data = await readData();
        const newMission = req.body;
        
        // Add timestamp and ID if not present
        if (!newMission.id) {
            newMission.id = 'mission_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
        }
        if (!newMission.timestamp) {
            newMission.timestamp = new Date().toISOString();
        }
        
        console.log('🆕 New mission:', newMission);
        data.missions.push(newMission);
        await writeData(data);
        
        console.log('✅ Mission saved successfully');
        res.json({ success: true, mission: newMission });
    } catch (error) {
        console.error('❌ Error saving mission:', error);
        res.status(500).json({ error: 'Failed to save mission' });
    }
});

// Update mission status
app.put('/api/missions/:id', async (req, res) => {
    try {
        console.log('📡 PUT /api/missions/' + req.params.id);
        const data = await readData();
        const missionId = req.params.id;
        const { status } = req.body;
        
        const missionIndex = data.missions.findIndex(m => m.id === missionId);
        if (missionIndex === -1) {
            console.log('❌ Mission not found:', missionId);
            return res.status(404).json({ error: 'Mission not found' });
        }
        
        data.missions[missionIndex].status = status;
        await writeData(data);
        
        console.log('✅ Mission status updated');
        res.json({ success: true, mission: data.missions[missionIndex] });
    } catch (error) {
        console.error('❌ Error updating mission:', error);
        res.status(500).json({ error: 'Failed to update mission' });
    }
});

// Delete mission
app.delete('/api/missions/:id', async (req, res) => {
    try {
        console.log('📡 DELETE /api/missions/' + req.params.id);
        const data = await readData();
        const missionId = req.params.id;
        
        const missionIndex = data.missions.findIndex(m => m.id === missionId);
        if (missionIndex === -1) {
            console.log('❌ Mission not found:', missionId);
            return res.status(404).json({ error: 'Mission not found' });
        }
        
        data.missions.splice(missionIndex, 1);
        await writeData(data);
        
        console.log('✅ Mission deleted');
        res.json({ success: true });
    } catch (error) {
        console.error('❌ Error deleting mission:', error);
        res.status(500).json({ error: 'Failed to delete mission' });
    }
});

// Save used combination
app.post('/api/used-combinations', async (req, res) => {
    try {
        console.log('📡 POST /api/used-combinations');
        const data = await readData();
        const { combinations } = req.body;
        
        // Merge new combinations with existing ones
        data.usedCombinations = { ...data.usedCombinations, ...combinations };
        await writeData(data);
        
        console.log('✅ Used combinations saved');
        res.json({ success: true });
    } catch (error) {
        console.error('❌ Error saving used combinations:', error);
        res.status(500).json({ error: 'Failed to save used combinations' });
    }
});

// Clear all data
app.delete('/api/clear-all', async (req, res) => {
    try {
        console.log('📡 DELETE /api/clear-all');
        await writeData({ missions: [], usedCombinations: {} });
        console.log('✅ All data cleared');
        res.json({ success: true });
    } catch (error) {
        console.error('❌ Error clearing data:', error);
        res.status(500).json({ error: 'Failed to clear data' });
    }
});

// Initialize and start server
initializeDataFile().then(() => {
    app.listen(PORT, () => {
        console.log('\n🚀 Turno Server running successfully!');
        console.log(`📱 Main App: http://localhost:${PORT}`);
        console.log(`🛡️ Admin Panel: http://localhost:${PORT}/admin.html`);
        console.log('📊 Server logs will appear below...\n');
    });
}).catch(error => {
    console.error('❌ Failed to start server:', error);
});