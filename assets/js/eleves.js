// Vérifier auth
AuthService.requireAuth();

// Afficher utilisateur
const user = AuthService.getUser();
document.getElementById('userName').textContent = `${user.prenom} ${user.nom}`;

let elevesTable;

// Charger les élèves
async function loadEleves() {
    try {
        const response = await APIService.get(CONFIG.ENDPOINTS.ELEVES);
        
        // L'API peut renvoyer un objet avec "results" (pagination) ou une liste directe
        const eleves = response.results || response;
        
        const tbody = document.getElementById('elevesBody');
        
        if (!eleves || eleves.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="text-center">Aucun élève</td></tr>';
            return;
        }
        
        tbody.innerHTML = eleves.map(eleve => `
            <tr>
                <td>
                    ${eleve.photo ? `<img src="${eleve.photo}" class="rounded-circle" width="40" height="40">` : '<i class="fas fa-user-circle fa-2x text-muted"></i>'}
                </td>
                <td>${eleve.nom}</td>
                <td>${eleve.prenom}</td>
                <td><span class="badge bg-info">${eleve.classe_nom || '-'}</span></td>
                <td>${eleve.parent_nom || '-'}</td>
                <td><code class="small">${eleve.qr_code ? eleve.qr_code.substring(0, 20) + '...' : '-'}</code></td>
                <td>
                    ${eleve.actif ? '<span class="badge bg-success">Actif</span>' : '<span class="badge bg-secondary">Inactif</span>'}
                </td>
                <td>
                    <button class="btn btn-sm btn-primary" onclick="viewEleve('${eleve.id}')">
                        <i class="fas fa-eye"></i>
                    </button>
                    <button class="btn btn-sm btn-warning" onclick="editEleve('${eleve.id}')">
                        <i class="fas fa-edit"></i>
                    </button>
                </td>
            </tr>
        `).join('');
        
        // Initialiser DataTable
        if (elevesTable) {
            elevesTable.destroy();
        }
        elevesTable = $('#elevesTable').DataTable({
            language: {
                url: 'https://cdn.datatables.net/plug-ins/1.13.6/i18n/fr-FR.json'
            }
        });
        
    } catch (error) {
        console.error('Erreur chargement élèves:', error);
        document.getElementById('elevesBody').innerHTML = 
            '<tr><td colspan="8" class="text-center text-danger">Erreur: ' + error.message + '</td></tr>';
    }
}

function viewEleve(id) {
    alert('Détails élève : ' + id);
}

function editEleve(id) {
    alert('Modifier élève : ' + id);
}

// Init
loadEleves();