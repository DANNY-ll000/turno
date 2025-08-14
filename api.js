// API utility functions for client-side communication
class TurnoAPI {
    constructor() {
        this.baseURL = window.location.origin;
        console.log('🔗 API Base URL:', this.baseURL);
    }

    async fetchMissions() {
        try {
            console.log('📡 Fetching missions...');
            const response = await fetch(`${this.baseURL}/api/missions`);
            if (!response.ok) {
                console.error('❌ Failed to fetch missions:', response.status, response.statusText);
                throw new Error('Failed to fetch missions');
            }
            const data = await response.json();
            console.log('✅ Missions fetched:', data.length, 'missions');
            return data;
        } catch (error) {
            console.error('Error fetching missions:', error);
            return [];
        }
    }

    async fetchUsedCombinations() {
        try {
            console.log('📡 Fetching used combinations...');
            const response = await fetch(`${this.baseURL}/api/used-combinations`);
            if (!response.ok) {
                console.error('❌ Failed to fetch used combinations:', response.status, response.statusText);
                throw new Error('Failed to fetch used combinations');
            }
            const data = await response.json();
            console.log('✅ Used combinations fetched');
            return data;
        } catch (error) {
            console.error('Error fetching used combinations:', error);
            return {};
        }
    }

    async submitMission(missionData) {
        try {
            console.log('📡 Submitting mission...', missionData);
            const response = await fetch(`${this.baseURL}/api/missions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(missionData)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error('❌ Failed to submit mission:', response.status, response.statusText, errorText);
                throw new Error(`Failed to submit mission: ${response.status} ${response.statusText}`);
            }
            const result = await response.json();
            console.log('✅ Mission submitted successfully:', result);
            return result;
        } catch (error) {
            console.error('Error submitting mission:', error);
            throw error;
        }
    }

    async updateMissionStatus(missionId, status) {
        try {
            console.log('📡 Updating mission status...', missionId, status);
            const response = await fetch(`${this.baseURL}/api/missions/${missionId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ status })
            });
            
            if (!response.ok) {
                console.error('❌ Failed to update mission:', response.status, response.statusText);
                throw new Error('Failed to update mission');
            }
            const result = await response.json();
            console.log('✅ Mission status updated');
            return result;
        } catch (error) {
            console.error('Error updating mission:', error);
            throw error;
        }
    }

    async deleteMission(missionId) {
        try {
            console.log('📡 Deleting mission...', missionId);
            const response = await fetch(`${this.baseURL}/api/missions/${missionId}`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                console.error('❌ Failed to delete mission:', response.status, response.statusText);
                throw new Error('Failed to delete mission');
            }
            const result = await response.json();
            console.log('✅ Mission deleted');
            return result;
        } catch (error) {
            console.error('Error deleting mission:', error);
            throw error;
        }
    }

    async saveUsedCombinations(combinations) {
        try {
            console.log('📡 Saving used combinations...', combinations);
            const response = await fetch(`${this.baseURL}/api/used-combinations`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ combinations })
            });
            
            if (!response.ok) {
                console.error('❌ Failed to save used combinations:', response.status, response.statusText);
                throw new Error('Failed to save used combinations');
            }
            const result = await response.json();
            console.log('✅ Used combinations saved');
            return result;
        } catch (error) {
            console.error('Error saving used combinations:', error);
            throw error;
        }
    }

    async clearAllData() {
        try {
            console.log('📡 Clearing all data...');
            const response = await fetch(`${this.baseURL}/api/clear-all`, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                console.error('❌ Failed to clear data:', response.status, response.statusText);
                throw new Error('Failed to clear data');
            }
            const result = await response.json();
            console.log('✅ All data cleared');
            return result;
        } catch (error) {
            console.error('Error clearing data:', error);
            throw error;
        }
    }
}

// Create global API instance
console.log('🔧 Initializing Turno API...');
window.turnoAPI = new TurnoAPI();