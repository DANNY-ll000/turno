// API utility functions for client-side communication
class TurnoAPI {
    constructor() {
        this.baseURL = window.location.origin;
    }

    async fetchMissions() {
        try {
            const response = await fetch(`${this.baseURL}/api/missions`);
            if (!response.ok) throw new Error('Failed to fetch missions');
            return await response.json();
        } catch (error) {
            console.error('Error fetching missions:', error);
            return [];
        }
    }

    async fetchUsedCombinations() {
        try {
            const response = await fetch(`${this.baseURL}/api/used-combinations`);
            if (!response.ok) throw new Error('Failed to fetch used combinations');
            return await response.json();
        } catch (error) {
            console.error('Error fetching used combinations:', error);
            return {};
        }
    }

    async submitMission(missionData) {
        try {
            const response = await fetch(`${this.baseURL}/api/missions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(missionData)
            });
            
            if (!response.ok) throw new Error('Failed to submit mission');
            return await response.json();
        } catch (error) {
            console.error('Error submitting mission:', error);
            throw error;
        }
    }

    async updateMissionStatus(missionId, status) {
        try {
            const response = await fetch(`${this.baseURL}/api/missions/${missionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status })
            });
            
            if (!response.ok) throw new Error('Failed to update mission');
            return await response.json();
        } catch (error) {
            console.error('Error updating mission:', error);
            throw error;
        }
    }

    async deleteMission(missionId) {
        try {
            const response = await fetch(`${this.baseURL}/api/missions/${missionId}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) throw new Error('Failed to delete mission');
            return await response.json();
        } catch (error) {
            console.error('Error deleting mission:', error);
            throw error;
        }
    }

    async saveUsedCombinations(combinations) {
        try {
            const response = await fetch(`${this.baseURL}/api/used-combinations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ combinations })
            });
            
            if (!response.ok) throw new Error('Failed to save used combinations');
            return await response.json();
        } catch (error) {
            console.error('Error saving used combinations:', error);
            throw error;
        }
    }

    async clearAllData() {
        try {
            const response = await fetch(`${this.baseURL}/api/clear-all`, {
                method: 'DELETE'
            });
            
            if (!response.ok) throw new Error('Failed to clear data');
            return await response.json();
        } catch (error) {
            console.error('Error clearing data:', error);
            throw error;
        }
    }
}

// Create global API instance
window.turnoAPI = new TurnoAPI();