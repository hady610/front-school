/* ========================================
   SCHOOLCONNECT V1 - COMPOSANTS JS
   Génération dynamique sidebar et topbar
   ======================================== */

// ============ CONFIGURATION ============
const APP_NAME = 'SchoolConnect';
const APP_VERSION = 'v1.0';

// Utilisateur fictif (remplacé par vraies données API plus tard)
let currentUser = {
    nom: 'Diallo',
    prenom: 'Mamadou Hady',
    type: 'super_admin', // ou 'admin_ecole' ou 'surveillant'
    email: 'superadmin@schoolconnect.gn',
    ecole: null // pour super_admin, sinon objet {nom: "École Lavoisier"}
};

// ============ GÉNÉRATION SIDEBAR ============
function generateSidebar(userType = 'super_admin') {
    let menuItems = [];
    
    if (userType === 'super_admin') {
        // Menu Super Admin
        menuItems = [
            { icon: 'fa-tachometer-alt', label: 'Dashboard', href: 'super-admin-dashboard.html', active: true },
            { icon: 'fa-school', label: 'Écoles', href: 'ecoles.html' },
            { icon: 'fa-chart-bar', label: 'Statistiques', href: 'statistiques.html' },
            { icon: 'fa-cog', label: 'Paramètres', href: 'parametres.html' }
        ];
    } else if (userType === 'admin_ecole') {
        // Menu Admin École
        menuItems = [
            { icon: 'fa-tachometer-alt', label: 'Dashboard', href: 'admin-ecole-dashboard.html', active: true },
            { icon: 'fa-user-graduate', label: 'Élèves', href: 'eleves.html' },
            { icon: 'fa-chalkboard', label: 'Classes', href: 'classes.html' },
            { icon: 'fa-users', label: 'Parents', href: 'parents.html' },
            { icon: 'fa-clipboard-check', label: 'Présences', href: 'presences.html' },
            { icon: 'fa-sms', label: 'SMS', href: 'sms.html' },
            { icon: 'fa-bell', label: 'Alertes', href: 'alertes.html' },
            { icon: 'fa-cog', label: 'Paramètres', href: 'parametres-ecole.html' }
        ];
    }
    
    const menuHTML = menuItems.map(item => `
        <li class="nav-item">
            <a href="${item.href}" class="nav-link ${item.active ? 'active' : ''}">
                <i class="fas ${item.icon}"></i>
                <span>${item.label}</span>
            </a>
        </li>
    `).join('');
    
    const roleLabel = userType === 'super_admin' ? 'Super Administrateur' : 'Admin École';
    const ecoleName = currentUser.ecole ? currentUser.ecole.nom : '';
    
    return `
        <div class="sidebar">
            <div class="sidebar-brand">
                <div class="logo-circle">
                    <i class="fas fa-graduation-cap"></i>
                </div>
                <h5>${APP_NAME}</h5>
                <small>${roleLabel}</small>
                ${ecoleName ? `<small style="display:block; margin-top:5px; color:#60a5fa;">${ecoleName}</small>` : ''}
            </div>
            <ul class="sidebar-menu nav flex-column">
                ${menuHTML}
                <li class="nav-item" style="margin-top: 30px;">
                    <a href="../login.html" class="nav-link" onclick="logout()">
                        <i class="fas fa-sign-out-alt"></i>
                        <span>Déconnexion</span>
                    </a>
                </li>
            </ul>
        </div>
        <div class="sidebar-overlay" onclick="toggleSidebar()"></div>
    `;
}

// ============ GÉNÉRATION TOPBAR ============
function generateTopbar(pageTitle = 'Dashboard') {
    const today = new Date().toLocaleDateString('fr-FR', { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
    });
    
    const initials = `${currentUser.prenom.charAt(0)}${currentUser.nom.charAt(0)}`;
    
    return `
        <div class="topbar">
            <div class="topbar-left">
                <button class="sidebar-toggle d-md-none" onclick="toggleSidebar()">
                    <i class="fas fa-bars"></i>
                </button>
                <h4>${pageTitle}</h4>
            </div>
            <div class="topbar-right">
                <div class="topbar-date">
                    <i class="far fa-calendar-alt"></i>
                    ${today}
                </div>
                <div class="topbar-user" onclick="openProfileModal()">
                    <div class="user-avatar">${initials}</div>
                    <div class="user-info">
                        <span class="user-name">${currentUser.prenom} ${currentUser.nom}</span>
                        <span class="user-role">${currentUser.type === 'super_admin' ? 'Super Admin' : 'Admin École'}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ============ GÉNÉRATION MODAL PROFIL ============
function generateProfileModal() {
    const initials = `${currentUser.prenom.charAt(0)}${currentUser.nom.charAt(0)}`;
    const fullName = `${currentUser.prenom} ${currentUser.nom}`;
    const roleLabel = currentUser.type === 'super_admin' ? 'Super Administrateur' : 'Administrateur École';
    const now = new Date();
    const lastConnection = now.toLocaleDateString('fr-FR') + ' à ' + now.toLocaleTimeString('fr-FR', {hour: '2-digit', minute: '2-digit'});
    
    return `
        <!-- Modal Profil -->
        <div class="modal fade" id="profileModal" tabindex="-1" aria-labelledby="profileModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="profileModalLabel">
                            <i class="fas fa-user-circle me-2"></i>
                            Mon Profil
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="text-center mb-4">
                            <div class="user-avatar" style="width: 80px; height: 80px; font-size: 28px; margin: 0 auto 15px;">
                                ${initials}
                            </div>
                            <h4 class="mb-1">${fullName}</h4>
                            <p class="text-muted mb-0">${currentUser.email}</p>
                        </div>
                        
                        <hr class="my-4">
                        
                        <div class="row mb-3">
                            <div class="col-5 text-muted">
                                <i class="fas fa-user-tag me-2"></i>Rôle :
                            </div>
                            <div class="col-7">
                                <span class="badge badge-primary">${roleLabel}</span>
                            </div>
                        </div>
                        
                        ${currentUser.ecole ? `
                        <div class="row mb-3">
                            <div class="col-5 text-muted">
                                <i class="fas fa-school me-2"></i>École :
                            </div>
                            <div class="col-7">
                                <strong>${currentUser.ecole.nom}</strong>
                            </div>
                        </div>
                        ` : ''}
                        
                        <div class="row mb-3">
                            <div class="col-5 text-muted">
                                <i class="far fa-clock me-2"></i>Connexion :
                            </div>
                            <div class="col-7">
                                <small>${lastConnection}</small>
                            </div>
                        </div>
                        
                        <hr class="my-4">
                        
                        <div class="d-grid gap-2">
                            <button class="btn btn-warning" onclick="goToPasswordChange()">
                                <i class="fas fa-key me-2"></i>
                                Changer le mot de passe
                            </button>
                            <button class="btn btn-danger" onclick="confirmLogout()">
                                <i class="fas fa-sign-out-alt me-2"></i>
                                Se déconnecter
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    `;
}

// ============ INITIALISATION PAGE ============
function initPage(config = {}) {
    const {
        userType = 'super_admin',
        pageTitle = 'Dashboard',
        user = null
    } = config;
    
    // Mettre à jour l'utilisateur si fourni
    if (user) {
        currentUser = { ...currentUser, ...user };
    }
    
    // Mettre à jour le type d'utilisateur
    currentUser.type = userType;
    
    // Générer et insérer la sidebar
    const sidebarHTML = generateSidebar(userType);
    document.body.insertAdjacentHTML('afterbegin', sidebarHTML);
    
    // Générer et insérer la topbar dans main-content
    const mainContent = document.querySelector('.main-content');
    if (mainContent) {
        const topbarHTML = generateTopbar(pageTitle);
        mainContent.insertAdjacentHTML('afterbegin', topbarHTML);
    }
    
    // Générer et insérer le modal profil
    const modalHTML = generateProfileModal();
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    
    // Activer le lien correspondant à la page actuelle
    highlightActiveMenu();
}

// ============ HIGHLIGHT MENU ACTIF ============
function highlightActiveMenu() {
    const currentPage = window.location.pathname.split('/').pop();
    const menuLinks = document.querySelectorAll('.sidebar-menu .nav-link');
    
    menuLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPage) {
            link.classList.add('active');
        }
    });
}

// ============ MODAL PROFIL ============
function openProfileModal() {
    const modal = new bootstrap.Modal(document.getElementById('profileModal'));
    modal.show();
}

function goToPasswordChange() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('profileModal'));
    if (modal) modal.hide();
    
    // Rediriger vers page paramètres selon type user
    setTimeout(() => {
        if (currentUser.type === 'super_admin') {
            window.location.href = 'parametres.html#security';
        } else {
            window.location.href = 'parametres-ecole.html#profil';
        }
    }, 300);
}

function confirmLogout() {
    const modal = bootstrap.Modal.getInstance(document.getElementById('profileModal'));
    if (modal) modal.hide();
    
    setTimeout(() => {
        logout();
    }, 300);
}

// ============ LOGOUT ============
function logout() {
    // Simulation logout
    if (confirm('Voulez-vous vraiment vous déconnecter ?')) {
        // Plus tard: appel API pour invalider le token
        localStorage.removeItem('sc_user');
        localStorage.removeItem('sc_token');
        window.location.href = '../login.html';
    }
    return false;
}

// ============ TOGGLE SIDEBAR MOBILE ============
function toggleSidebar() {
    const sidebar = document.querySelector('.sidebar');
    if (sidebar) {
        sidebar.classList.toggle('active');
    }
}

// ============ UTILITAIRES ============

// Formater un nombre avec séparateur de milliers
function formatNumber(num) {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

// Formater une date
function formatDate(date) {
    return new Date(date).toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
    });
}

// Formater une heure
function formatTime(time) {
    return new Date(`2000-01-01 ${time}`).toLocaleTimeString('fr-FR', {
        hour: '2-digit',
        minute: '2-digit'
    });
}

// Afficher un toast de notification
function showToast(message, type = 'success') {
    const toast = document.createElement('div');
    toast.className = `alert alert-${type} fade-in`;
    toast.style.position = 'fixed';
    toast.style.top = '20px';
    toast.style.right = '20px';
    toast.style.zIndex = '9999';
    toast.style.minWidth = '300px';
    toast.innerHTML = message;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

// Confirm action avec modal Bootstrap
function confirmAction(message, callback) {
    if (confirm(message)) {
        callback();
    }
}

// ============ EXPORT (si module) ============
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        generateSidebar,
        generateTopbar,
        generateProfileModal,
        initPage,
        openProfileModal,
        logout,
        toggleSidebar,
        formatNumber,
        formatDate,
        formatTime,
        showToast,
        confirmAction
    };
}