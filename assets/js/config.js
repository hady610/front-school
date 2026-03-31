/**
 * Configuration globale de l'application
 */
const CONFIG = {
    API_BASE_URL: 'http://127.0.0.1:8000/api/v1',
    
    // Endpoints
    ENDPOINTS: {
        // Auth
        LOGIN: '/auth/login/',
        REGISTER: '/auth/register/',
        ME: '/auth/me/',
        LOGOUT: '/auth/logout/',
        
        // Schools
        ECOLES: '/schools/ecoles/',
        HORAIRES: '/schools/horaires/',
        CONFIG_ECOLE: '/schools/config/',
        STATS_DASHBOARD: '/schools/stats/',
        
        // Students
        CLASSES: '/students/classes/',
        ELEVES: '/students/eleves/',
        PARENTS: '/students/parents/',
        
        // Attendance
        PRESENCES: '/attendance/presences/',
        SCAN: '/attendance/scan/',
        JOURS_SANS_ECOLE: '/attendance/jours-sans-ecole/',
        
        // Notifications
        SMS: '/notifications/sms/',
        TEMPLATES: '/notifications/templates/',
        ALERTES: '/notifications/alertes/',
    },
    
    // Stockage
    STORAGE_KEYS: {
        TOKEN: 'sc_access_token',
        REFRESH_TOKEN: 'sc_refresh_token',
        USER: 'sc_user',
        ECOLE: 'sc_ecole_active'
    }
};