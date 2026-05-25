// Load feature achievements data
function loadFeatureData() {
    const features = JSON.parse(localStorage.getItem('portfolio_features')) || [
        {
            icon: 'bx bx-trophy',
            title: 'Best Project Award',
            description: 'Won first place in college project competition for E-Commerce Dashboard'
        },
        {
            icon: 'bx bx-certification',
            title: 'Certified Developer',
            description: 'Completed Full Stack Development certification from recognized platform'
        },
        {
            icon: 'bx bx-line-chart',
            title: '100+ Contributions',
            description: 'Active contributor to open-source projects on GitHub'
        },
        {
            icon: 'bx bx-users',
            title: 'Team Leadership',
            description: 'Led a team of 5 developers for successful project delivery'
        }
    ];
    
    const container = document.querySelector('.features-grid');
    if (container) {
        container.innerHTML = features.map(feature => `
            <div class="feature-card">
                <div class="feature-icon"><i class="${feature.icon}"></i></div>
                <h3>${feature.title}</h3>
                <p>${feature.description}</p>
            </div>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', loadFeatureData);