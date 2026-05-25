// Backup configuration for Professional Experience
const defaultExperienceData = [
    {
        id: 1,
        title: 'Full Stack Developer',
        company: 'Tech Solutions Inc.',
        period: '2023 - Present',
        description: 'Developing web applications using React and Node.js. Collaborating with cross-functional teams to deliver high-quality software.'
    },
    {
        id: 2,
        title: 'Frontend Developer',
        company: 'Creative Agency',
        period: '2022 - 2023',
        description: 'Built responsive websites for various clients. Implemented modern UI/UX designs and optimized performance.'
    },
    {
        id: 3,
        title: 'Intern Web Developer',
        company: 'Digital Solutions',
        period: '2021 - 2022',
        description: 'Assisted in developing client websites. Learned industry best practices and version control with Git.'
    }
];

if (!localStorage.getItem('portfolio_experience')) {
    localStorage.setItem('portfolio_experience', JSON.stringify(defaultExperienceData));
}