
// ===== PARTICLES =====
function createParticles() {
    // Disable particles entirely on mobile devices for performance
    if (window.innerWidth < 768) return;
    
    const container = document.getElementById('particles');
    if (!container) return;
    
    const count = 30; // Only runs on desktop
    for (let i = 0; i < count; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');
        const size = Math.random() * 6 + 2;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.animationDuration = (Math.random() * 15 + 10) + 's';
        particle.style.animationDelay = (Math.random() * 10) + 's';
        particle.style.opacity = Math.random() * 0.3 + 0.1;
        container.appendChild(particle);
    }
}
createParticles();

// ===== HEADER SCROLL =====
const header = document.getElementById('header');
const backToTop = document.getElementById('backToTop');
let isScrolling = false;

window.addEventListener('scroll', () => {
    if (!isScrolling) {
        window.requestAnimationFrame(() => {
            const scrollY = window.scrollY;
            if (header) header.classList.toggle('scrolled', scrollY > 50);
            if (backToTop) backToTop.classList.toggle('show', scrollY > 600);
            isScrolling = false;
        });
        isScrolling = true;
    }
}, { passive: true });

backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ===== MOBILE NAV =====
const navToggle = document.getElementById('navToggle');
const navMenu = document.getElementById('navMenu');

navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close menu on link click
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navMenu.classList.remove('active');
    });
});

// ===== ACTIVE NAV LINK =====
const sections = document.querySelectorAll('section[id]');
let isNavScroll = false;
window.addEventListener('scroll', () => {
    if (!isNavScroll) {
        window.requestAnimationFrame(() => {
            const scrollY = window.scrollY + 200;
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.offsetHeight;
                const sectionId = section.getAttribute('id');
                const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
                if (navLink) {
                    if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                        navLink.classList.add('active');
                    }
                }
            });
            isNavScroll = false;
        });
        isNavScroll = true;
    }
}, { passive: true });

// ===== SCROLL ANIMATIONS =====
const observerOptions = {
    root: null,
    rootMargin: '0px 0px -60px 0px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.animate-on-scroll').forEach(el => {
    observer.observe(el);
});

// ===== COUNTER ANIMATION =====
function animateCounters() {
    const counters = document.querySelectorAll('[data-target]');
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000;
        const start = 0;
        const startTime = performance.now();

        function updateCounter(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            // Ease out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            const current = Math.floor(start + (target - start) * eased);
            counter.textContent = current.toLocaleString();
            if (progress < 1) {
                requestAnimationFrame(updateCounter);
            }
        }
        // Observe when counter section becomes visible
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    requestAnimationFrame(updateCounter);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.3 });
        counterObserver.observe(counter);
    });
}
animateCounters();

// ===== FORM HANDLING =====
const contactForm = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');

const heroContactForm = document.getElementById('heroContactForm');
const heroSubmitBtn = document.getElementById('heroSubmitBtn');

function handleFormSubmit(form, btn) {
    if (form && btn) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            btn.innerHTML = '<span>Submitting...</span><i class="fas fa-spinner fa-spin"></i>';
            btn.disabled = true;

            const formData = new FormData(form);
            
            fetch(form.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    btn.innerHTML = '<span>Submitted Successfully!</span><i class="fas fa-check"></i>';
                    btn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
                    setTimeout(() => {
                        form.reset();
                        btn.innerHTML = '<span>Get OTP</span>';
                        btn.style.background = '';
                        btn.disabled = false;
                    }, 3000);
                } else {
                    throw new Error('Form submission failed');
                }
            })
            .catch(error => {
                btn.innerHTML = '<span>Error! Try Again</span>';
                btn.style.background = '#ef4444';
                btn.disabled = false;
                setTimeout(() => {
                    btn.innerHTML = '<span>Get OTP</span>';
                    btn.style.background = '';
                }, 3000);
            });
        });
    }
}

handleFormSubmit(contactForm, submitBtn);
handleFormSubmit(heroContactForm, heroSubmitBtn);

// ===== MODAL HANDLING =====
const enrollModal = document.getElementById('enrollModal');
const closeModalBtn = document.getElementById('closeModal');
const ctaButtons = document.querySelectorAll('a[href="#contact"]');

if (enrollModal && closeModalBtn) {
    ctaButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            enrollModal.classList.add('active');
            document.body.style.overflow = 'hidden';

            // Close mobile menu if opened via CTA
            const navToggle = document.getElementById('navToggle');
            const navMenu = document.getElementById('navMenu');
            if (navToggle && navMenu) {
                navToggle.classList.remove('active');
                navMenu.classList.remove('active');
            }
        });
    });

    closeModalBtn.addEventListener('click', () => {
        enrollModal.classList.remove('active');
        document.body.style.overflow = '';
    });

    enrollModal.addEventListener('click', (e) => {
        if (e.target === enrollModal) {
            enrollModal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    const modalContactForm = document.getElementById('modalContactForm');
    const modalSubmitBtn = document.getElementById('modalSubmitBtn');

    if (modalContactForm) {
        modalContactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            modalSubmitBtn.innerHTML = '<span>Submitting...</span><i class="fas fa-spinner fa-spin"></i>';
            modalSubmitBtn.disabled = true;

            const formData = new FormData(modalContactForm);

            fetch(modalContactForm.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    modalSubmitBtn.innerHTML = '<span>Submitted Successfully!</span><i class="fas fa-check"></i>';
                    modalSubmitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';

                    setTimeout(() => {
                        modalContactForm.reset();
                        modalSubmitBtn.innerHTML = '<span>Submit Enquiry</span><i class="fas fa-paper-plane"></i>';
                        modalSubmitBtn.style.background = '';
                        modalSubmitBtn.disabled = false;

                        enrollModal.classList.remove('active');
                        document.body.style.overflow = '';
                    }, 3000);
                } else {
                    throw new Error('Modal form submission failed');
                }
            })
            .catch(error => {
                modalSubmitBtn.innerHTML = '<span>Error! Try Again</span>';
                modalSubmitBtn.style.background = '#ef4444';
                modalSubmitBtn.disabled = false;
                setTimeout(() => {
                    modalSubmitBtn.innerHTML = '<span>Submit Enquiry</span><i class="fas fa-paper-plane"></i>';
                    modalSubmitBtn.style.background = '';
                }, 3000);
            });
        });
    }
}

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        // Skip links meant for modals
        if (this.getAttribute('href') === '#contact') return;

        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ===== TILT EFFECT ON CARDS (DESKTOP ONLY) =====
if (window.innerWidth > 1024) {
    document.querySelectorAll('.feature-card, .who-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });
}

// ===== PARALLAX ON HERO SHAPES =====
if (window.innerWidth > 768) {
    let parallaxTicking = false;
    window.addEventListener('scroll', () => {
        if (!parallaxTicking) {
            window.requestAnimationFrame(() => {
                const scrollY = window.scrollY;
                document.querySelectorAll('.hero-shape').forEach((shape, i) => {
                    const speed = (i + 1) * 0.03;
                    shape.style.transform = `translateY(${scrollY * speed}px)`;
                });
                parallaxTicking = false;
            });
            parallaxTicking = true;
        }
    }, { passive: true });
}


