document.addEventListener('DOMContentLoaded', () => {
    const openHeroModal = document.getElementById('openHeroModal');
    const contactModal = document.getElementById('contactModal');
    const closeModal = document.getElementById('closeModal');
    const heroForm = document.getElementById('heroForm');
    const midForm = document.getElementById('midForm');
    const toast = document.getElementById('toast');

    function handleFormSubmit(formElement, e) {
        e.preventDefault(); 
        
        const action = formElement.getAttribute('action');
        if (action) {
            const formData = new FormData(formElement);
            fetch(action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            }).then(response => {
                showThanks();
            }).catch(error => {
                console.error('Error:', error);
                showThanks(); 
            });
        } else {
            showThanks();
        }
        
        formElement.reset();
    }

    function showThanks() {
        if (toast) {
            toast.classList.add('show');
            setTimeout(() => toast.classList.remove('show'), 3000);
        }
    }
    
    if (openHeroModal && contactModal) {
        openHeroModal.addEventListener('click', () => {
            contactModal.classList.add('active');
        });
    }

    if (closeModal && contactModal) {
        closeModal.addEventListener('click', () => {
            contactModal.classList.remove('active');
        });
    }

    // Close on overlay click
    if (contactModal) {
        contactModal.addEventListener('click', (e) => {
            if (e.target === contactModal) {
                contactModal.classList.remove('active');
            }
        });
    }

    if (heroForm) {
        heroForm.addEventListener('submit', (e) => {
            handleFormSubmit(heroForm, e);
            contactModal.classList.remove('active');
        });
    }
    
    if (midForm) {
        midForm.addEventListener('submit', (e) => handleFormSubmit(midForm, e));
    }
});
