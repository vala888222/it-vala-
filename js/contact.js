document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contact-form');
    const status = document.getElementById('form-status');
    const submitBtn = document.getElementById('submit-btn');

    if (contactForm) {
        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const data = new FormData(e.target);
            
            submitBtn.innerHTML = "Sending...";
            submitBtn.disabled = true;

            fetch(e.target.action, {
                method: contactForm.method,
                body: data,
                headers: { 'Accept': 'application/json' }
            }).then(response => {
                if (response.ok) {
                    status.innerHTML = "Success! Details mere mail pe aa gayi hain. ⚡";
                    status.style.color = "#D4E95E";
                    submitBtn.innerHTML = "Message Sent!";
                    contactForm.reset();
                } else {
                    status.innerHTML = "Oops! Kuch galti hui hai.";
                    status.style.color = "#ff4444";
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = "Try Again";
                }
            }).catch(error => {
                status.innerHTML = "Oops! Connection error.";
                status.style.color = "#ff4444";
                submitBtn.disabled = false;
            });
        });
    }
});