// Load skills from localStorage
function loadSkillsData() {
    // Load technical skills
    const technicalSkills = JSON.parse(localStorage.getItem('portfolio_skills_technical')) || [
        { name: 'HTML', level: 90, icon: 'bx bxl-html5', color: '#e34c26' },
        { name: 'CSS', level: 85, icon: 'bx bxl-css3', color: '#264de4' },
        { name: 'JavaScript', level: 80, icon: 'bx bxl-javascript', color: '#f0db4f' },
        { name: 'React', level: 75, icon: 'bx bxl-react', color: '#61DAFB' },
        { name: 'Python', level: 85, icon: 'bx bxl-python', color: '#3776AB' },
        { name: 'Node.js', level: 70, icon: 'bx bxl-nodejs', color: '#68A063' }
    ];
    
    const techContainer = document.getElementById('technicalSkills');
    if (techContainer) {
        techContainer.innerHTML = `
            <div class="skill-category animate-slide-up">
                <div class="category-header">
                    <div class="category-dot green"></div>
                    <h3 class="category-title">Technical Skills</h3>
                </div>
                ${technicalSkills.map(skill => `
                    <div class="bar">
                        <i class="${skill.icon}" style="color: ${skill.color}"></i>
                        <div class="indfo"><span>${skill.name}</span></div>
                        <div class="progress-line">
                            <span style="width: ${skill.level}%"></span>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;
    }
    
    // Load professional skills
    const professionalSkills = JSON.parse(localStorage.getItem('portfolio_skills_professional')) || [
        { name: 'Creativity', level: 90 },
        { name: 'Communication', level: 65 },
        { name: 'Problem Solving', level: 85 },
        { name: 'Team Work', level: 89 }
    ];
    
    const profContainer = document.getElementById('professionalSkills');
    if (profContainer) {
        profContainer.innerHTML = professionalSkills.map((skill, index) => {
            const circumference = 502;
            const offset = circumference - (circumference * skill.level / 100);
            return `
                <div class="radial-bar">
                    <svg viewBox="0 0 200 200">
                        <circle class="progress-bar" cx="100" cy="100" r="80"></circle>
                        <circle class="path path-${index + 1}" cx="100" cy="100" r="80" style="stroke-dashoffset: ${offset}"></circle>
                    </svg>
                    <div class="percentage">${skill.level}%</div>
                    <div class="text">${skill.name}</div>
                </div>
            `;
        }).join('');
    }
}

document.addEventListener('DOMContentLoaded', loadSkillsData);