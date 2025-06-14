
document.addEventListener('DOMContentLoaded', () => {
    fetchTeams();
});

function fetchTeams() {
    fetch('/api/teams')
        .then(response => response.json())
        .then(data => {
            const teamsContainer = document.getElementById('teamsContainer');
            teamsContainer.innerHTML = '';

            if (data.length === 0) {
                teamsContainer.innerHTML = `<p>No teams yet. Add your first team above!</p>`;
            } else {
                data.forEach(team => {
                    console.log('Team:', team); // Debugging line to check team data
                    const teamElement = document.createElement('div');
                    teamElement.className = 'table-container';

                    teamElement.innerHTML = `
                        <div contenteditable="true" class="table-title" onblur="updateTeam(${team.id}, 'name', this.innerText)">${team.name}</div>
                        <table>
                            <thead>
                                <tr>
                                    <th>Roles</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr><td contenteditable="true" class="teamTop" onblur="updateTeam(${team.id}, 'top', this.innerText)">${team.top}</td></tr>
                                <tr><td contenteditable="true" class="teamJungle" onblur="updateTeam(${team.id}, 'jungle', this.innerText)">${team.jungle}</td></tr>
                                <tr><td contenteditable="true" class="teamMid" onblur="updateTeam(${team.id}, 'mid', this.innerText)">${team.mid}</td></tr>
                                <tr><td contenteditable="true" class="teamBottom" onblur="updateTeam(${team.id}, 'bottom', this.innerText)">${team.bottom}</td></tr>
                                <tr><td contenteditable="true" class="teamSupport" onblur="updateTeam(${team.id}, 'support', this.innerText)">${team.support}</td></tr>
                            </tbody>
                        </table>
                        <button class="delete-btn" onclick="deleteTeam(${team.id})">🗑️ Delete Team</button>
                    `;
                    teamsContainer.appendChild(teamElement);
                });
            }
        })
        .catch(error => console.error('Error fetching teams:', error));
}

function addTeam() {
    const userId = localStorage.getItem('userId');
    if (!userId) {
        console.error('User ID not found. Please log in first.');
        return;
    }

    const tableTitle = document.getElementById('tableTitle').value.trim();
    if (!tableTitle) return;

    fetch('/api/teams', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: tableTitle, userId })
    })
    .then(response => response.json())
    .then(() => {
        document.getElementById('tableTitle').value = '';
        fetchTeams();
    })
    .catch(error => console.error('Error adding team:', error));
}

function deleteTeam(teamId) {
    fetch(`/api/teams/${teamId}`, { method: 'DELETE' })
        .then(() => fetchTeams())
        .catch(error => console.error('Error deleting team:', error));
}

function updateTeam(teamId, field, value) {
    fetch(`/api/teams/${teamId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ field, value })
    })
    .then(() => console.log(`Updated team ${teamId}: ${field} = ${value}`))
    .catch(error => console.error('Error updating team:', error));
}
