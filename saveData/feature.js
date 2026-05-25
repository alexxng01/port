// Backup configuration for Features/Achievements
const defaultFeaturesData = [
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

if (!localStorage.getItem('portfolio_features')) {
    localStorage.setItem('portfolio_features', JSON.stringify(defaultFeaturesData));
}