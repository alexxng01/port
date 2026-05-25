// Contact form handling
function submitContactForm(event) {
    event.preventDefault();
    
    const name = document.getElementById('contactName')?.value;
    const email = document.getElementById('contactEmail')?.value;
    const message = document.getElementById('contactMessage')?.value;
    
    if (name && email && message) {
        const messages = JSON.parse(localStorage.getItem('contact_messages')) || [];
        messages.push({
            id: Date.now(),
            name: name,
            email: email,
            message: message,
            date: new Date().toISOString()
        });
        localStorage.setItem('contact_messages', JSON.stringify(messages));
        
        alert('Thank you for your message! I will get back to you soon.');
        event.target.reset();
    } else {
        alert('Please fill in all fields.');
    }
}

// Attach event listener when DOM loads
document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.querySelector('#contact form');
    if (contactForm) {
        contactForm.addEventListener('submit', submitContactForm);
    }
});