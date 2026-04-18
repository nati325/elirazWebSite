// ============================================================
//  ELEMENTS
// ============================================================
const popupOverlay = document.getElementById('popupOverlay');
const contactOverlay = document.getElementById('contactOverlay');
const thanksOverlay = document.getElementById('thanksOverlay');
const closePopup = document.getElementById('closePopup');
const closeContact = document.getElementById('closeContact');
const closeThanks = document.getElementById('closeThanks');
const screeningForm = document.getElementById('screeningForm');
const contactForm = document.getElementById('contactForm');

// ============================================================
//  OPEN SCREENING
// ============================================================
document.querySelectorAll('#openScreening, #openScreening2').forEach(btn => {
    btn.addEventListener('click', () => {
        popupOverlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    });
});

// ============================================================
//  CLOSE ALL
// ============================================================
closePopup.addEventListener('click', closeAll);
closeContact.addEventListener('click', closeAll);
closeThanks.addEventListener('click', closeAll);
popupOverlay.addEventListener('click', e => { if (e.target === popupOverlay) closeAll(); });
contactOverlay.addEventListener('click', e => { if (e.target === contactOverlay) closeAll(); });
thanksOverlay.addEventListener('click', e => { if (e.target === thanksOverlay) closeAll(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeAll(); });

function closeAll() {
    popupOverlay.classList.remove('active');
    contactOverlay.classList.remove('active');
    thanksOverlay.classList.remove('active');
    document.body.style.overflow = '';
}

// ============================================================
//  SCREENING FORM → advance to contact form
// ============================================================
screeningForm.addEventListener('submit', e => {
    e.preventDefault();

    const q1 = document.querySelector('input[name="q1"]:checked')?.value || '';
    const q2 = document.querySelector('input[name="q2"]:checked')?.value || '';
    const q3 = document.querySelector('input[name="q3"]:checked')?.value || '';

    document.getElementById('hiddenQ1').value = q1;
    document.getElementById('hiddenQ2').value = q2;
    document.getElementById('hiddenQ3').value = q3;

    popupOverlay.classList.remove('active');
    setTimeout(() => {
        contactOverlay.classList.add('active');
    }, 180);
});

// ============================================================
//  CONTACT FORM SUBMIT
// ============================================================
contactForm.addEventListener('submit', async e => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const submitBtn = contactForm.querySelector('button[type="submit"]');

    submitBtn.disabled = true;
    submitBtn.textContent = 'שולח...';

    try {
        const res = await fetch(contactForm.action, {
            method: 'POST',
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        if (res.ok || res.status === 200) {
            contactOverlay.classList.remove('active');
            contactForm.reset();
            screeningForm.reset();
            setTimeout(() => {
                thanksOverlay.classList.add('active');
            }, 180);
        } else {
            throw new Error('שגיאה');
        }
    } catch {
        // Fallback: open mailto
        const name = formData.get('שם') || '';
        const phone = formData.get('טלפון') || '';
        const q1 = formData.get('עבירה') || '';
        const q2 = formData.get('מועד_דיון') || '';
        const q3 = formData.get('עבר_קודם') || '';
        const body = encodeURIComponent(
            `שם: ${name}\nטלפון: ${phone}\n\nעבירה: ${q1}\nמועד דיון: ${q2}\nעבר קודם: ${q3}`
        );
        window.location.href =
            `mailto:ali.law.israel@gmail.com?subject=פנייה חדשה מהאתר&body=${body}`;
        contactOverlay.classList.remove('active');
        contactForm.reset();
        screeningForm.reset();
        setTimeout(() => {
            thanksOverlay.classList.add('active');
        }, 180);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'שלח פרטים ✓';
    }
});

// ============================================================
//  SCROLL REVEAL
// ============================================================
const revealEls = document.querySelectorAll('.step, .why-card');

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.15 });

revealEls.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = `opacity 0.5s ${i * 0.08}s ease, transform 0.5s ${i * 0.08}s ease`;
    observer.observe(el);
});
