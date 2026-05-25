// Backup configuration for Current projects
const defaultCurrentData = [
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

if (!localStorage.getItem('portfolio_current')) {
    localStorage.setItem('portfolio_current', JSON.stringify(defaultCurrentData));
}