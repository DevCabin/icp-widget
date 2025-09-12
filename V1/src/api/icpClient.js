/**
 * IClassPro API Client
 * Handles direct communication with the IClassPro API
 */

const API_BASE = 'https://app.iclasspro.com/api/open/v1';

const DEFAULT_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
    'Accept': 'application/json',
    'Accept-Language': 'en-US,en;q=0.5',
    'Referer': 'https://portal.iclasspro.com/',
    'Origin': 'https://portal.iclasspro.com'
};

/**
 * Formats API errors into a consistent structure
 */
class ICPError extends Error {
    constructor(message, status, details = {}) {
        super(message);
        this.name = 'ICPError';
        this.status = status;
        this.details = details;
    }
}

/**
 * Main API client class
 */
export class ICPClient {
    constructor(config) {
        this.accountName = config.accountName;
        this.locationId = config.locationId || '1';
        this.programId = config.programId;
        this.retryAttempts = config.retryAttempts || 3;
        this.retryDelay = config.retryDelay || 1000;
    }

    /**
     * Fetches class list with retry logic
     */
    async getClasses() {
        let lastError;
        for (let attempt = 0; attempt < this.retryAttempts; attempt++) {
            try {
                return await this._fetchClasses();
            } catch (error) {
                lastError = error;
                if (attempt < this.retryAttempts - 1) {
                    await new Promise(resolve => setTimeout(resolve, this.retryDelay));
                }
            }
        }
        throw lastError;
    }

    /**
     * Internal method to fetch classes
     */
    async _fetchClasses() {
        const queryParams = new URLSearchParams({
            locationId: this.locationId,
            limit: '50',
            page: '1'
        });

        if (this.programId) {
            queryParams.append('programs', this.programId);
        }

        const url = `${API_BASE}/${this.accountName}/classes?${queryParams}`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: DEFAULT_HEADERS
        });

        if (!response.ok) {
            throw new ICPError(
                'Failed to fetch classes',
                response.status,
                { url, status: response.status }
            );
        }

        const data = await response.json();
        return this._transformClassData(data);
    }

    /**
     * Transforms API response into consistent format
     */
    _transformClassData(data) {
        if (!data.data || !Array.isArray(data.data)) {
            throw new ICPError('Invalid API response format', 500);
        }

        return data.data.map(classItem => ({
            id: classItem.id,
            name: classItem.name,
            schedule: classItem.schedule[0] || {},
            openings: classItem.openings,
            allowWaitlist: classItem.allowWaitlist,
            status: this._getStatusDisplay(classItem),
            displaySchedule: this._formatSchedule(classItem.schedule[0] || {}),
            registrationUrl: this._getRegistrationUrl(classItem.id)
        }));
    }

    /**
     * Generates status display text and color
     */
    _getStatusDisplay(classItem) {
        if (classItem.openings > 0) {
            return {
                text: `Open (${classItem.openings} spots)`,
                color: '#4CAF50'
            };
        }
        if (classItem.allowWaitlist) {
            return {
                text: 'Waitlist Available',
                color: '#FFA726'
            };
        }
        return {
            text: 'Full',
            color: '#F44336'
        };
    }

    /**
     * Formats schedule information
     */
    _formatSchedule(schedule) {
        if (!schedule.dayName) return 'Schedule TBD';
        return `${schedule.dayName} ${schedule.startTime || ''} - ${schedule.endTime || ''}`;
    }

    /**
     * Generates registration URL
     */
    _getRegistrationUrl(classId) {
        return `https://portal.iclasspro.com/${this.accountName}/class-details/${classId}`;
    }
}

export default ICPClient; 