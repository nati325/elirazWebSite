document.addEventListener('DOMContentLoaded', () => {
    const contactModal = document.getElementById('contactModal');
    const closeModal = document.getElementById('closeModal');
    const toast = document.getElementById('toast');

    function showThanks() {
        if (toast) {
            toast.classList.add('show');
            
            // Wait 5 seconds for the message to be read
            setTimeout(() => {
                toast.classList.remove('show');
                
                // After the message animation finishes (0.6s), redirect back
                setTimeout(() => {
                    if (document.referrer && document.referrer !== window.location.href) {
                        window.location.href = document.referrer;
                    } else {
                        window.history.back();
                    }
                }, 600);
            }, 5000);
        }
    }

    function handleFormSubmit(formElement, e) {
        e.preventDefault();
        
        // Show success message immediately
        showThanks();
        
        const action = formElement.getAttribute('action');
        const formData = new FormData(formElement);

        if (action && action.includes('formsubmit.co')) {
            fetch(action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => console.log('Success'))
            .catch(error => console.error('Error:', error));
        }

        formElement.reset();
        if (contactModal) contactModal.classList.remove('active');
    }

    // Attach to all forms
    document.querySelectorAll('form').forEach(form => {
        form.addEventListener('submit', (e) => handleFormSubmit(form, e));
    });

    // Modal logic
    if (closeModal && contactModal) {
        closeModal.addEventListener('click', () => contactModal.classList.remove('active'));
    }

    if (contactModal) {
        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) contactModal.classList.remove('active');
        });
    }

    document.addEventListener('click', (e) => {
        const btn = e.target.closest('#openHeroModal') || e.target.closest('.btn-open-modal');
        if (btn && contactModal) contactModal.classList.add('active');
    });
});
