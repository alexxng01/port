// Load teamwork data from localStorage
function loadTeamworkData() {
    const teamwork = JSON.parse(localStorage.getItem('portfolio_teamwork')) || [
        {
            id: 1,
            title: 'Open Source Contribution',
            description: 'Collaborated with global developers on open-source projects, contributing to documentation and bug fixes.',
            image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=400&h=250&fit=crop'
        },
        {
            id: 2,
            title: 'Hackathon Winner',
            description: 'Team project that won first place at college hackathon, developing a solution for local business challenges.',
            image: 'https://images.unsplash.com/photo-1504384764586-bb4cdc1707b0?w=400&h=250&fit=crop'
        },
        {
            id: 3,
            title: 'Group Project Excellence',
            description: 'Successfully delivered full-stack application as a team, receiving recognition for exceptional collaboration.',
            image: 'https://images.unsplash.com/photo-1515187029135-18ee286d815b?w=400&h=250&fit=crop'
        }
    ];
    
    const container = document.getElementById('teamworkList');
    if (container) {
        container.innerHTML = teamwork.map(team => `
            <div class="row">
                <img src="${team.image}" alt="${team.title}">
                <div class="layer">
                    <h5>${team.title}</h5>
                    <p>${team.description}</p>
                </div>
            </div>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', loadTeamworkData);