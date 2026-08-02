// ==========================================
// Portfolio behavior and interactions
// ==========================================

const menuToggle = document.querySelector('.menu-toggle');
const siteNav = document.querySelector('.site-nav');
const navLinks = document.querySelectorAll('.site-nav a');
const revealItems = document.querySelectorAll('.reveal');
const scrollTopBtn = document.getElementById('scrollTopBtn');
const languageButtons = document.querySelectorAll('.lang-btn');
const themeToggle = document.querySelector('.theme-toggle');
const themeLabel = document.querySelector('.theme-label');
const themeIcon = document.querySelector('.theme-icon');
const typewriterTarget = document.getElementById('typewriter-text');
const counters = document.querySelectorAll('.counter');

const typewriterPhrases = [
    'Java Full Stack Developer',
    'Software Developer',
    'Problem Solver',
    'Future ASIR Student',
    'Tech Enthusiast'
];

let currentPhraseIndex = 0;
let currentCharIndex = 0;
let isDeleting = false;

// ==========================================
// Language detection and manual switch
// ==========================================
const defaultLanguage = navigator.language.startsWith('es') ? 'es' : 'en';
const storedLanguage = localStorage.getItem('portfolio-language') || defaultLanguage;
const storedTheme = localStorage.getItem('portfolio-theme') || 'light';
let currentLanguage = storedLanguage;

function setTheme(theme) {
    document.body.classList.toggle('dark-mode', theme === 'dark');
    if (themeLabel && themeIcon) {
        const translations = window.translations?.[currentLanguage] || window.translations?.en;
        if (theme === 'dark') {
            themeIcon.textContent = '🌙';
            themeLabel.textContent = translations?.theme?.dark || '🌙 Dark Mode';
        } else {
            themeIcon.textContent = '☀️';
            themeLabel.textContent = translations?.theme?.light || '☀️ Light Mode';
        }
    }
    localStorage.setItem('portfolio-theme', theme);
}

function applyLanguage(language) {
    currentLanguage = language;
    const translationMap = window.translations?.[language] || window.translations?.en;

    document.documentElement.lang = language;

    if (!translationMap) return;

    document.querySelectorAll('[data-i18n]').forEach(element => {
        const keyPath = element.getAttribute('data-i18n');
        const value = keyPath.split('.').reduce((obj, key) => obj?.[key], translationMap);

        if (typeof value === 'string') {
            element.textContent = value;
        }
    });

    languageButtons.forEach(button => {
        button.classList.toggle('active', button.dataset.lang === language);
    });

    localStorage.setItem('portfolio-language', language);
    setTheme(localStorage.getItem('portfolio-theme') || 'light');
}

// ==========================================
// Menu behavior for mobile
// ==========================================
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

// ==========================================
// Scroll animations with Intersection Observer
// ==========================================
const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.18
});

revealItems.forEach(item => revealObserver.observe(item));

// ==========================================
// Typewriter effect in hero section
// ==========================================
function typewriterLoop() {
    const currentPhrase = typewriterPhrases[currentPhraseIndex];

    if (!isDeleting) {
        currentCharIndex++;
        typewriterTarget.textContent = currentPhrase.slice(0, currentCharIndex);

        if (currentCharIndex === currentPhrase.length) {
            isDeleting = true;
            setTimeout(typewriterLoop, 1200);
            return;
        }
    } else {
        currentCharIndex--;
        typewriterTarget.textContent = currentPhrase.slice(0, currentCharIndex);

        if (currentCharIndex === 0) {
            isDeleting = false;
            currentPhraseIndex = (currentPhraseIndex + 1) % typewriterPhrases.length;
        }
    }

    const typingDelay = isDeleting ? 40 : 90;
    setTimeout(typewriterLoop, typingDelay);
}

// ==========================================
// Animated counters
// ==========================================
function animateCounter(element) {
    const target = Number(element.dataset.target || 0);
    const duration = 1400;
    const startTime = performance.now();

    function tick(now) {
        const progress = Math.min((now - startTime) / duration, 1);
        const value = Math.floor(progress * target);
        element.textContent = value;

        if (progress < 1) {
            requestAnimationFrame(tick);
        } else {
            element.textContent = target;
        }
    }

    requestAnimationFrame(tick);
}

const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateCounter(entry.target);
            counterObserver.unobserve(entry.target);
        }
    });
}, {
    threshold: 0.4
});

counters.forEach(counter => counterObserver.observe(counter));

// ==========================================
// Scroll to top button
// ==========================================
window.addEventListener('scroll', () => {
    if (window.scrollY > 320) {
        scrollTopBtn?.classList.add('visible');
    } else {
        scrollTopBtn?.classList.remove('visible');
    }
});

scrollTopBtn?.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ==========================================
// Theme switch
// ==========================================
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const nextTheme = document.body.classList.contains('dark-mode') ? 'light' : 'dark';
        setTheme(nextTheme);
    });
}

// ==========================================
// Manual language switch
// ==========================================
languageButtons.forEach(button => {
    button.addEventListener('click', () => {
        applyLanguage(button.dataset.lang);
    });
});

// ==========================================
// Initialize the portfolio UI
// ==========================================
setTheme(storedTheme);
applyLanguage(storedLanguage);

typewriterTarget && typewriterLoop();

