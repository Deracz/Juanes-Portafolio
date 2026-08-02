const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const revealItems = document.querySelectorAll('.reveal');

if (menuToggle && siteNav) {
    menuToggle.addEventListener('click', () => {
        siteNav.classList.toggle('open');
    });

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            siteNav.classList.remove('open');
        });
    });
}

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, {
    threshold: 0.15
});

revealItems.forEach(item => observer.observe(item));
