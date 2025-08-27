// Mobile menu toggle
function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

// Smooth scrolling
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Animated counters
function animateCounter(id, target, duration = 2000) {
    const element = document.getElementById(id);
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            current = target;
            clearInterval(timer);
        }
        element.textContent = Math.floor(current).toLocaleString();
    }, 16);
}

// Start counters when page loads
window.addEventListener('load', () => {
    setTimeout(() => {
        animateCounter('dogs-rescued', 2547);
        animateCounter('meals-served', 45230);
        animateCounter('treatments', 1876);
        animateCounter('adoptions', 1923);
    }, 1000);
});

// Carousel functionality
let currentSlide = 0;
const slides = document.querySelectorAll('.carousel-slide');
const totalSlides = slides.length;

function showSlide(index) {
    const track = document.getElementById('carousel-track');
    track.style.transform = `translateX(-${index * 100}%)`;
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    showSlide(currentSlide);
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    showSlide(currentSlide);
}

// Auto-advance carousel
setInterval(nextSlide, 5000);

// Scroll animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver(function(entries) {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in-up').forEach(el => {
    observer.observe(el);
});

// Modal functions
function openModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
}

// Close modal when clicking outside
window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// Donation function
function donate(amount) {
    alert(`Thank you for your generous donation of ₹${amount}! 🐾\n\nYour contribution will directly help save animal lives. In a real implementation, you would be redirected to a secure payment gateway.\n\nThis donation is eligible for 80G tax benefits.`);
}

// Contact functions
function openWhatsApp() {
    window.open('https://wa.me/918386818441?text=Hello%20Paw%20Safety!%20I%20would%20like%20to%20help.', '_blank');
}

function openEmail() {
    window.location.href = 'mailto:info@pawsafety.org?subject=Inquiry%20from%20Website';
}

// Form handlers
async function handleContactForm(e) {
    e.preventDefault();

    // Get form elements
    const form = e.target;
    const name = document.getElementById("contact-name").value;
    const email = document.getElementById("contact-email").value;
    const phone = document.getElementById("contact-phone").value;
    const subject = form.querySelector("select").value;
    const message = document.getElementById("contact-message").value;

    const data = {
        name: name,
        email: email,
        phone: phone,
        subject: subject,
        message: message
    };

    try {
        const res = await fetch("http://localhost:5001/contact", {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                "Accept": "application/json"
            },
            body: JSON.stringify(data),
        });

        const result = await res.json();

        if (result.success) {
            alert('Thank you for your message! 🐾\n\nWe\'ve received your inquiry and will get back to you within 24 hours. Your support means the world to us!');
            form.reset();
        } else {
            alert("⚠️ Failed to send your message: " + (result.message || "Please try again."));
        }
    } catch (err) {
        console.error("Frontend error:", err);
        alert("⚠️ Error sending your message. Please check your connection and try again.");
    }
}

function handleNewsletterSignup(e) {
    e.preventDefault();
    alert('Welcome to our Paw Family! 🐾\n\nYou\'ve successfully subscribed to our newsletter. You\'ll receive heartwarming updates about our rescue work and ways to make a difference.');
    e.target.reset();
}

// Navigation link handling
document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href').substring(1);
        scrollToSection(targetId);
    });
});

// Close mobile menu when clicking on a link
document.querySelectorAll('#mobile-menu a').forEach(link => {
    link.addEventListener('click', function() {
        document.getElementById('mobile-menu').classList.add('hidden');
    });
});

// Add bounce effect to donation buttons
document.querySelectorAll('.donation-btn').forEach(btn => {
    btn.addEventListener('mouseenter', function() {
        this.classList.add('bounce-soft');
    });
    btn.addEventListener('animationend', function() {
        this.classList.remove('bounce-soft');
    });
});

// Page load animation
window.addEventListener('load', function() {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease-in-out';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});