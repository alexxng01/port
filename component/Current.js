// Load current projects data
function loadCurrentData() {
    const currentData = JSON.parse(localStorage.getItem('portfolio_current')) || [
        {
            title: 'Portfolio CMS',
            description: 'Building a complete CMS for portfolio management with LocalStorage',
            icon: 'bx bx-code-curly',
            progress: 85
        },
        {
            title: 'Database Design',
            description: 'Learning advanced MySQL and database optimization techniques',
            icon: 'bx bx-data',
            progress: 70
        },
        {
            title: 'Cloud Computing',
            description: 'Exploring AWS services and deployment strategies for scaling applications',
            icon: 'bx bx-cloud',
            progress: 60
        }
    ];
    
    const container = document.querySelector('.current-content');
    if (container) {
        container.innerHTML = currentData.map(item => `
            <div class="current-card">
                <i class="${item.icon}"></i>
                <h3>${item.title}</h3>
                <p>${item.description}</p>
                <div class="progress-bar" style="margin-top: 15px;">
                    <div class="progress-fill" style="width: ${item.progress}%; background: #0ef; height: 8px; border-radius: 10px;"></div>
                    <div style="text-align: right; margin-top: 5px;">${item.progress}% Complete</div>
                </div>
            </div>
        `).join('');
    }
}

document.addEventListener('DOMContentLoaded', loadCurrentData);