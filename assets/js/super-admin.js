// Vérifier auth super admin
AuthService.requireAuth();

const user = AuthService.getUser();
if (user.type_utilisateur !== 'super_admin') {
    alert('Accès refusé : Réservé aux super administrateurs');
    window.location.href = '../login.html';
}

document.getElementById('userName').textContent = `${user.prenom} ${user.nom}`;

let ecolesTable;

// Charger stats
async function loadStats() {
    try {
        const ecoles = await APIService.get(CONFIG.ENDPOINTS.ECOLES);
        const ecolesData = ecoles.results || ecoles;
        
        document.getElementById('totalEcoles').textContent = ecolesData.length;
        
        // TODO: Charger total élèves et admins
        document.getElementById('totalEleves').textContent = '0';
        document.getElementById('totalAdmins').textContent = ecolesData.length;
        
    } catch (error) {
        console.error('Erreur chargement stats:', error);
    }
}

// Charger liste écoles
async function loadEcoles() {
    try {
        const response = await APIService.get(CONFIG.ENDPOINTS.ECOLES);
        const ecoles = response.results || response;
        const tbody = document.getElementById('ecolesBody');
        
        if (!ecoles || ecoles.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="text-center">Aucune école</td></tr>';
            return;
        }
        
        tbody.innerHTML = ecoles.map(ecole => `
            <tr>
                <td><strong>${ecole.identifiant_unique}</strong></td>
                <td>${ecole.nom}</td>
                <td>${ecole.telephone || '-'}</td>
                <td>${ecole.email || '-'}</td>
                <td>
                    ${ecole.statut === 'active' ? 
                        '<span class="badge bg-success">Active</span>' : 
                        '<span class="badge bg-danger">Suspendue</span>'}
                </td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="viewEcole('${ecole.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
        if (ecolesTable) {
            ecolesTable.destroy();
        }
        ecolesTable = $('#ecolesTable').DataTable({
            language: { url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/fr-FR.json' }
        });
        
    } catch (error) {
        console.error('Erreur:', error);
        document.getElementById('ecolesBody').innerHTML = 
            '<tr><td colspan="6" class="text-center text-danger">Erreur: ' + error.message + '</td></tr>';
    }
}

function viewEcole(id) {
    alert('Détails école: ' + id);
}

// Formulaire ajout école
document.getElementById('addEcoleForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const errorAlert = document.getElementById('errorAlertEcole');
    errorAlert.classList.add('d-none');
    
    try {
        const codeEcole = document.getElementById('codeEcole').value;
        
        // 1. Créer l'école
        const ecoleData = {
            identifiant_unique: codeEcole,
            nom: document.getElementById('nomEcole').value,
            adresse: document.getElementById('adresseEcole').value,
            telephone: document.getElementById('telephoneEcole').value,
            email: document.getElementById('emailEcole').value,
            statut: 'active',
            annee_scolaire_active: document.getElementById('anneeScolaire').value
        };
        
        const ecole = await APIService.post(CONFIG.ENDPOINTS.ECOLES, ecoleData);
        
        // 2. Créer l'admin école automatiquement
        const adminData = {
            ecole: ecole.id,
            nom: 'Admin',
            prenom: ecoleData.nom,
            email: `admin@${codeEcole.toLowerCase()}.schoolconnect.gn`,
            password_hash: codeEcole, // Password = code école
            telephone: ecoleData.telephone || '',
            actif: true
        };
        
        await APIService.post(CONFIG.ENDPOINTS.ECOLES + ecole.id + '/admins/', adminData);
        
        // Fermer modal et recharger
        bootstrap.Modal.getInstance(document.getElementById('addEcoleModal')).hide();
        this.reset();
        loadEcoles();
        loadStats();
        
        alert(`✅ École créée avec succès !\n\n📧 Email admin : ${adminData.email}\n🔑 Mot de passe : ${codeEcole}\n\n⚠️ L'admin peut modifier ses identifiants dans ses paramètres.`);
        
    } catch (error) {
        errorAlert.textContent = error.message;
        errorAlert.classList.remove('d-none');
    }
});

// Init
loadStats();
loadEcoles();