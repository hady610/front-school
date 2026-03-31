/**
 * Service d'authentification
 */
class AuthService {
    
    static async login(email, password) {
        try {
            const response = await fetch(CONFIG.API_BASE_URL + CONFIG.ENDPOINTS.LOGIN, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Erreur de connexion');
            }
            
            const data = await response.json();
            
            // Stocker les tokens et user
            localStorage.setItem(CONFIG.STORAGE_KEYS.TOKEN, data.access);
            localStorage.setItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN, data.refresh);
            localStorage.setItem(CONFIG.STORAGE_KEYS.USER, JSON.stringify(data.user));
            
            return data;
        } catch (error) {
            throw error;
        }
    }
    
    static logout() {
        localStorage.removeItem(CONFIG.STORAGE_KEYS.TOKEN);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.USER);
        localStorage.removeItem(CONFIG.STORAGE_KEYS.ECOLE);
        window.location.href = 'login.html';
    }
    
    static getToken() {
        return localStorage.getItem(CONFIG.STORAGE_KEYS.TOKEN);
    }
    
    static getUser() {
        const user = localStorage.getItem(CONFIG.STORAGE_KEYS.USER);
        return user ? JSON.parse(user) : null;
    }
    
    static isAuthenticated() {
        return !!this.getToken();
    }
    
    static requireAuth() {
        if (!this.isAuthenticated()) {
            window.location.href = 'login.html';
            return false;
        }
        return true;
    }
}