/**
 * Dashboard Logic avec graphiques
 */

AuthService.requireAuth();

const user = AuthService.getUser();
document.getElementById('userName').textContent = `${user.prenom} ${user.nom}`;

let evolutionChart = null;

async function loadStats() {
    try {
        let ecoleId = user.ecole;
        
        if (!ecoleId) {
            const ecoles = await APIService.get(CONFIG.ENDPOINTS.ECOLES);
            if (ecoles.length === 0) {
                console.log('Aucune école créée');
                return;
            }
            ecoleId = ecoles[0].id;
        }
        
        const stats = await APIService.get(`${CONFIG.ENDPOINTS.STATS_DASHBOARD}${ecoleId}/dashboard/`);
        
        // Stats cards
        document.getElementById('totalEleves').textContent = stats.general.total_eleves;
        document.getElementById('totalPresents').textContent = stats.presences_today.presents;
        document.getElementById('totalRetards').textContent = stats.presences_today.retards;
        document.getElementById('totalAbsents').textContent = stats.presences_today.absents;
        
        // Graphique évolution 7 jours
        createEvolutionChart(stats.evolution_7_jours);
        
        // Absents par classe
        displayAbsentsParClasse(stats.absents_par_classe);
        
    } catch (error) {
        console.error('Erreur chargement stats:', error);
    }
}

function createEvolutionChart(data) {
    const ctx = document.getElementById('evolutionChart').getContext('2d');
    
    if (evolutionChart) {
        evolutionChart.destroy();
    }
    
    const labels = data.map(d => {
        const date = new Date(d.date);
        return date.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric' });
    });
    
    evolutionChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [
                {
                    label: 'Présents',
                    data: data.map(d => d.presents),
                    borderColor: '#10b981',
                    backgroundColor: 'rgba(16, 185, 129, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Retards',
                    data: data.map(d => d.retards),
                    borderColor: '#f59e0b',
                    backgroundColor: 'rgba(245, 158, 11, 0.1)',
                    tension: 0.4
                },
                {
                    label: 'Absents',
                    data: data.map(d => d.absents),
                    borderColor: '#ef4444',
                    backgroundColor: 'rgba(239, 68, 68, 0.1)',
                    tension: 0.4
                }
            ]
        },
        options: {
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: {
                    position: 'top',
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        stepSize: 1
                    }
                }
            }
        }
    });
}

function displayAbsentsParClasse(data) {
    const container = document.getElementById('absentsParClasseContainer');
    
    if (data.length === 0) {
        container.innerHTML = '<p class="text-muted">Aucune donnée</p>';
        return;
    }
    
    container.innerHTML = data.map(item => {
        const progressWidth = item.taux_absence;
        const colorClass = progressWidth > 30 ? 'bg-danger' : progressWidth > 15 ? 'bg-warning' : 'bg-success';
        
        return `
            <div class="mb-3">
                <div class="d-flex justify-content-between mb-1">
                    <span><strong>${item.classe}</strong></span>
                    <span class="badge ${colorClass}">${item.absents}/${item.total_eleves} (${item.taux_absence}%)</span>
                </div>
                <div class="progress" style="height: 20px;">
                    <div class="progress-bar ${colorClass}" role="progressbar" style="width: ${progressWidth}%" 
                         aria-valuenow="${progressWidth}" aria-valuemin="0" aria-valuemax="100">
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

async function loadAlertes() {
    try {
        const alertes = await APIService.get(CONFIG.ENDPOINTS.ALERTES);
        const container = document.getElementById('alertesContainer');
        
        if (!alertes.results || alertes.results.length === 0) {
            container.innerHTML = '<p class="text-muted">Aucune alerte</p>';
            return;
        }
        
        container.innerHTML = alertes.results.slice(0, 5).map(alerte => {
            const iconClass = alerte.gravite === 'urgent' ? 'fa-exclamation-circle text-danger' : 
                            alerte.gravite === 'important' ? 'fa-exclamation-triangle text-warning' : 
                            'fa-info-circle text-info';
            
            return `
                <div class="d-flex align-items-start mb-3 pb-3 border-bottom">
                    <div class="me-3">
                        <i class="fas ${iconClass} fa-2x"></i>
                    </div>
                    <div class="small">
                        <strong>${alerte.message}</strong><br>
                        <span class="text-muted">${new Date(alerte.date_creation).toLocaleString('fr-FR')}</span>
                    </div>
                </div>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Erreur chargement alertes:', error);
        document.getElementById('alertesContainer').innerHTML = '<p class="text-muted">Erreur de chargement</p>';
    }
}

// Init
loadStats();
loadAlertes();

// Rafraîchir toutes les 30 secondes
setInterval(() => {
    loadStats();
    loadAlertes();
}, 30000);