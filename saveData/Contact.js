// Backup configuration for Contact messages
const defaultContactMessages = [];

if (!localStorage.getItem('contact_messages')) {
    localStorage.setItem('contact_messages', JSON.stringify(defaultContactMessages));
}

// Function to export messages
function exportMessages() {
    const messages = JSON.parse(localStorage.getItem('contact_messages')) || [];
    const dataStr = JSON.stringify(messages, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(dataBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'contact_messages.json';
    a.click();
    URL.revokeObjectURL(url);
}