document.addEventListener('DOMContentLoaded', () => {
    // 0. Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 20) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // 1. Initialize Lucide Icons
    lucide.createIcons();

    // 2. Mobile Menu Toggle Logic
    const menuBtn = document.getElementById('mob-menu-btn');
    const navMenu = document.getElementById('nav-menu');

    if (menuBtn && navMenu) {
        menuBtn.addEventListener('click', () => {
            navMenu.classList.toggle('mobile-active');
            menuBtn.classList.toggle('toggle-anim');
        });
    }

    // 3. Close Menu when any link is clicked
    const links = document.querySelectorAll('.nav-links a, .login-btn');
    links.forEach(link => {
        link.addEventListener('click', () => {
            if(navMenu) navMenu.classList.remove('mobile-active');
            if(menuBtn) menuBtn.classList.remove('toggle-anim');
        });
    });

    // 4. Subtle Parallax for Custom elements
    window.addEventListener('mousemove', (e) => {
        const floaters = document.querySelectorAll('.circular-badge');
        floaters.forEach((floater, index) => {
            if (floater) {
                let factor = (index + 1) * 20;
                let x = (window.innerWidth / 2 - e.pageX) / factor;
                let y = (window.innerHeight / 2 - e.pageY) / factor;
                floater.style.transform = `translate(${x}px, ${y}px)`;
            }
        });
    });

    // 5. Portfolio Filter Logic
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projects = document.querySelectorAll('.project-card');

    if (filterBtns.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filter = btn.getAttribute('data-filter');

                projects.forEach(card => {
                    const category = card.getAttribute('data-category');
                    if (filter === 'all' || category === filter) {
                        card.style.display = 'block';
                        setTimeout(() => card.style.opacity = '1', 10);
                    } else {
                        card.style.opacity = '0';
                        setTimeout(() => card.style.display = 'none', 300);
                    }
                });
            });
        });
    }

    // 6. Scroll Spy for Navbar
    const sections = document.querySelectorAll('header, section');
    const navItems = document.querySelectorAll('.nav-links a:not(.login-btn)');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                current = section.getAttribute('id');
            }
        });

        if (current) {
            navItems.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        }
    });

    // 7. Login Popup Logic
    const loginOpenBtn = document.getElementById('login-open-btn');
    const loginModal = document.getElementById('login-modal');
    const loginCloseBtn = document.getElementById('login-close-btn');

    if (loginOpenBtn && loginModal && loginCloseBtn) {
        loginOpenBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.classList.add('active');
        });

        loginCloseBtn.addEventListener('click', () => {
            loginModal.classList.remove('active');
        });

        loginModal.addEventListener('click', (e) => {
            if (e.target === loginModal) {
                loginModal.classList.remove('active');
            }
        });
    }

    // 8. Project About Modal Logic
    const projectCards = document.querySelectorAll('.project-card');
    const projectModal = document.getElementById('project-modal');
    const projectCloseBtn = document.getElementById('project-close-btn');
    
    const pmImg = document.getElementById('pm-img');
    const pmTag = document.getElementById('pm-tag');
    const pmTitle = document.getElementById('pm-title');

    if(projectCards.length > 0 && projectModal) {
        projectCards.forEach(card => {
            card.addEventListener('click', () => {
                const img = card.querySelector('img').src;
                const tag = card.querySelector('.tag').innerText;
                const title = card.querySelector('h3').innerText;
                const desc = card.getAttribute('data-desc');
                const link = card.getAttribute('data-link');
                
                pmImg.src = img;
                pmTag.innerText = tag;
                pmTitle.innerText = title;
                
                const pmDescElem = document.getElementById('pm-desc');
                if (pmDescElem && desc) pmDescElem.innerText = desc;
                
                const pmLinkElem = document.getElementById('pm-link');
                if (pmLinkElem && link) pmLinkElem.href = link;
                
                projectModal.classList.add('active');
            });
        });

        projectCloseBtn.addEventListener('click', () => {
            projectModal.classList.remove('active');
        });

        projectModal.addEventListener('click', (e) => {
            if (e.target === projectModal) {
                projectModal.classList.remove('active');
            }
        });
    }

    // 9. Contact Form AJAX intercept
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(contactForm);
            const data = Object.fromEntries(formData.entries());
            
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerText;
            submitBtn.innerText = "Sending...";
            
            fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data)
            })
            .then(res => res.json())
            .then(resData => {
                submitBtn.innerText = "Successfully Sent!";
                submitBtn.style.background = "linear-gradient(90deg, #67d670, #1f8a70)";
                contactForm.reset();
                setTimeout(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.style.background = "";
                }, 3000);
            })
            .catch(err => {
                submitBtn.innerText = "Failed";
                submitBtn.style.background = "red";
                setTimeout(() => {
                    submitBtn.innerText = originalText;
                    submitBtn.style.background = "";
                }, 3000);
            });
        });
    }
});