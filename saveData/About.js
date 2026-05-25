// Backup configuration for About section
const defaultAboutData = {
    mainText: 'Full Stack Developer',
    paragraphs: [
        "I'm a Computer Science student at Techspire College in Kathmandu, Nepal, with a deep passion for full-stack development and UI/UX design. I love turning complex problems into simple, beautiful, and intuitive solutions.",
        "My journey in technology started with curiosity about how things work behind the scenes. Now, I'm focused on building web applications that not only function well but also provide exceptional user experiences.",
        "When I'm not coding, you can find me exploring new design trends, contributing to open-source projects, or learning about emerging technologies in the tech ecosystem."
    ]
};

// Initialize if not exists
if (!localStorage.getItem('portfolio_about')) {
    localStorage.setItem('portfolio_about', JSON.stringify(defaultAboutData));
}