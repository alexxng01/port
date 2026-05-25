// Backup configuration for Services section
const defaultServicesData = [
    {
        id: 1,
        icon: 'bx bx-code',
        title: 'Web Development',
        description: 'Great code comes from collaboration. I love working with others to solve problems, share ideas, and build clean, innovative solutions.'
    },
    {
        id: 2,
        icon: 'bx bx-crop',
        title: 'UI/UX Design',
        description: 'I love working side-by-side with a team — sharing ideas, solving problems, and turning code into something we\'re proud of.'
    },
    {
        id: 3,
        icon: 'bx bxl-apple',
        title: 'App Design',
        description: 'I enjoy sitting with a team, turning ideas into designs, and watching them come alive on the screen.'
    }
];

if (!localStorage.getItem('portfolio_services')) {
    localStorage.setItem('portfolio_services', JSON.stringify(defaultServicesData));
}