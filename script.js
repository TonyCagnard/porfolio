document.addEventListener('DOMContentLoaded', () => {

    // --- Animation de frappe ---
    const typingElement = document.getElementById('typing-effect');
    if (typingElement) {
        const words = ["Étudiant en BTS SIO.", "Passionné d'informatique.", "À la recherche d'une alternance."];
        let wordIndex = 0;
        let charIndex = 0;
        let isDeleting = false;

        function type() {
            const currentWord = words[wordIndex];
            if (isDeleting) {
                typingElement.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typingElement.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }

            if (!isDeleting && charIndex === currentWord.length) {
                setTimeout(() => isDeleting = true, 2000);
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
            }
            const typingSpeed = isDeleting ? 100 : 150;
            setTimeout(type, typingSpeed);
        }
        setTimeout(type, 1000);
    }

    // --- Animations au défilement ---
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                
                // Animation pour les barres de progression
                if (entry.target.classList.contains('skill-category')) {
                    const progressBars = entry.target.querySelectorAll('.progress-bar');
                    progressBars.forEach(bar => {
                        const width = bar.style.width;
                        bar.style.width = '0';
                        setTimeout(() => {
                            bar.style.width = width;
                        }, 200);
                    });
                }
            }
        });
    }, {
        threshold: 0.1
    });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach(el => observer.observe(el));
    
    // Observer spécifique pour les catégories de compétences
    const skillCategories = document.querySelectorAll('.skill-category');
    skillCategories.forEach(category => {
        observer.observe(category);
    });

    // --- NOUVELLE LOGIQUE POUR LE FORMULAIRE DE CONTACT (AJAX) ---
    const form = document.getElementById('contact-form');

    async function handleSubmit(event) {
        event.preventDefault(); // Empêche la redirection de la page
        const data = new FormData(event.target);
        
        try {
            const response = await fetch(event.target.action, {
                method: form.method,
                body: data,
                headers: {
                    'Accept': 'application/json'
                }
            });

            if (response.ok) {
                showNotification("Merci ! Votre message a été envoyé.", "success");
                form.reset(); // Vide le formulaire après l'envoi
            } else {
                // Gère les erreurs si Formspree renvoie un problème
                showNotification("Oops! Une erreur s'est produite.", "error");
            }
        } catch (error) {
            // Gère les erreurs réseau (ex: pas de connexion internet)
            showNotification("Oops! Une erreur réseau s'est produite.", "error");
        }
    }

    if (form) {
        form.addEventListener("submit", handleSubmit);
    }

    // Fonction pour afficher la notification
    function showNotification(message, type) {
        // Crée l'élément de notification
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        notification.textContent = message;
        document.body.appendChild(notification);

        // Fait apparaître la notification
        setTimeout(() => {
            notification.classList.add('show');
        }, 10);

        // Fait disparaître la notification après 4 secondes
        setTimeout(() => {
            notification.classList.remove('show');
            // Supprime l'élément du DOM après la transition pour ne pas polluer la page
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 500);
        }, 4000);
    }
});

// --- Script pour les flèches du carrousel (VOTRE CODE EXISTANT) ---
    const wrapper = document.querySelector('.projects-wrapper');
    const prevButton = document.querySelector('.scroll-arrow.prev');
    const nextButton = document.querySelector('.scroll-arrow.next');

    if (wrapper && prevButton && nextButton) {
        // ... votre code pour les boutons next/prev
        const projectCard = wrapper.querySelector('.project-card');
        const cardStyle = window.getComputedStyle(projectCard);
        const cardMarginRight = parseFloat(cardStyle.marginRight) || 0;
        const cardWidth = projectCard.offsetWidth;
        const wrapperStyle = window.getComputedStyle(wrapper);
        const gap = parseFloat(wrapperStyle.gap) || 32;
        const scrollAmount = cardWidth + gap;

        nextButton.addEventListener('click', () => {
            wrapper.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        prevButton.addEventListener('click', () => {
            wrapper.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    }

    // --- NOUVEAU SCRIPT POUR LE DRAG-TO-SCROLL ---
    if (wrapper) {
        let isDown = false;
        let startX;
        let scrollLeft;

        wrapper.addEventListener('mousedown', (e) => {
            isDown = true;
            wrapper.classList.add('grabbing');
            // Position de départ du clic
            startX = e.pageX - wrapper.offsetLeft;
            // Position de départ du scroll
            scrollLeft = wrapper.scrollLeft;
            // Empêche le drag par défaut sur les images, etc.
            e.preventDefault();
        });

        wrapper.addEventListener('mouseleave', () => {
            isDown = false;
            wrapper.classList.remove('grabbing');
        });

        wrapper.addEventListener('mouseup', () => {
            isDown = false;
            wrapper.classList.remove('grabbing');
        });

        wrapper.addEventListener('mousemove', (e) => {
            if (!isDown) return; // Ne fait rien si le bouton n'est pas cliqué
            
            e.preventDefault();
            const x = e.pageX - wrapper.offsetLeft;
            const walk = (x - startX) * 2; // Le *2 rend le scroll plus rapide
            wrapper.scrollLeft = scrollLeft - walk;
        });
    }
    // --- FIN DU NOUVEAU SCRIPT ---

