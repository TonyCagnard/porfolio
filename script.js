document.addEventListener('DOMContentLoaded', () => {

    // --- Gestion du mode sombre ---
    const themeToggleBtn = document.getElementById('theme-toggle-btn');
    const htmlElement = document.documentElement;
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Vérifier s'il y a un thème enregistré dans le localStorage
    const currentTheme = localStorage.getItem('theme') || 'light';
    htmlElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);
    
    // Fonction pour mettre à jour l'icône du thème
    function updateThemeIcon(theme) {
        if (theme === 'dark') {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        } else {
            themeIcon.classList.remove('fa-sun');
            themeIcon.classList.add('fa-moon');
        }
    }
    
    // Fonction pour basculer le thème
    function toggleTheme() {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        updateThemeIcon(newTheme);
    }
    
    // Ajouter un écouteur d'événements au bouton de bascule
    themeToggleBtn.addEventListener('click', toggleTheme);

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
    
    // Observer pour la timeline
    const timelineWrapper = document.querySelector('.timeline-wrapper');
    if (timelineWrapper) {
        observer.observe(timelineWrapper);
        
        // Animation pour les événements de la timeline
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                }
            });
        }, {
            threshold: 0.1
        });
        
        const timelineEvents = document.querySelectorAll('.timeline-event');
        timelineEvents.forEach((event, index) => {
            // Ajouter un délai d'animation progressif
            event.style.transitionDelay = `${index * 0.1}s`;
            timelineObserver.observe(event);
        });
    }
    
    // Observer pour le formulaire de contact
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        const contactObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                }
            });
        }, {
            threshold: 0.1
        });
        
        contactObserver.observe(contactForm);
    }
    
    // Observer pour les centres d'intérêt
    const interestsGrid = document.querySelector('.interests-grid');
    if (interestsGrid) {
        const interestsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                }
            });
        }, {
            threshold: 0.1
        });
        
        interestsObserver.observe(interestsGrid);
    }
    
    // Observer pour le footer
    const footer = document.querySelector('footer');
    if (footer) {
        const footerObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                }
            });
        }, {
            threshold: 0.1
        });
        
        footerObserver.observe(footer);
    }

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

// --- Script amélioré pour les flèches du carrousel ---
    const wrapper = document.querySelector('.projects-wrapper');
    const prevButton = document.querySelector('.scroll-arrow.prev');
    const nextButton = document.querySelector('.scroll-arrow.next');
    const scrollDots = document.querySelectorAll('.scroll-dot');
    const projectsContainer = document.querySelector('.projects-container');

    if (wrapper && prevButton && nextButton) {
        // Calcul du scrollAmount
        function calculateScrollAmount() {
            const projectCard = wrapper.querySelector('.project-card');
            if (!projectCard) return 0;
            
            const cardStyle = window.getComputedStyle(projectCard);
            const wrapperStyle = window.getComputedStyle(wrapper);
            const cardWidth = projectCard.offsetWidth;
            const gap = parseFloat(wrapperStyle.gap) || 30;
            
            return cardWidth + gap;
        }

        // Mise à jour des indicateurs de défilement
        function updateScrollIndicators() {
            const scrollAmount = calculateScrollAmount();
            const currentIndex = Math.round(wrapper.scrollLeft / scrollAmount);
            
            scrollDots.forEach((dot, index) => {
                if (index === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        // Gestion du clic sur les flèches
        nextButton.addEventListener('click', () => {
            const scrollAmount = calculateScrollAmount();
            wrapper.scrollBy({
                left: scrollAmount,
                behavior: 'smooth'
            });
        });

        prevButton.addEventListener('click', () => {
            const scrollAmount = calculateScrollAmount();
            wrapper.scrollBy({
                left: -scrollAmount,
                behavior: 'smooth'
            });
        });

        // Gestion du clic sur les indicateurs
        scrollDots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                const scrollAmount = calculateScrollAmount();
                wrapper.scrollTo({
                    left: index * scrollAmount,
                    behavior: 'smooth'
                });
            });
        });

        // Écouteur d'événement pour le défilement
        wrapper.addEventListener('scroll', updateScrollIndicators);
        
        // Initialisation des indicateurs
        setTimeout(updateScrollIndicators, 100);
        
        // Gestion du redimensionnement de la fenêtre
        window.addEventListener('resize', () => {
            setTimeout(updateScrollIndicators, 100);
        });
    }

    // --- SCRIPT AMÉLIORÉ POUR LE DRAG-TO-SCROLL ---
    if (wrapper) {
        let isDown = false;
        let startX;
        let scrollLeft;
        let velocity = 0;
        let animationFrame = null;

        wrapper.addEventListener('mousedown', (e) => {
            isDown = true;
            wrapper.classList.add('grabbing');
            
            // Position de départ du clic
            startX = e.pageX - wrapper.offsetLeft;
            
            // Position de départ du scroll
            scrollLeft = wrapper.scrollLeft;
            
            // Réinitialise la vélocité
            velocity = 0;
            
            // Annule toute animation en cours
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
            
            // Empêche le drag par défaut sur les images, etc.
            e.preventDefault();
        });

        wrapper.addEventListener('mouseleave', () => {
            if (!isDown) return;
            
            isDown = false;
            wrapper.classList.remove('grabbing');
            
            // Applique l'inertie
            applyInertia();
        });

        wrapper.addEventListener('mouseup', () => {
            if (!isDown) return;
            
            isDown = false;
            wrapper.classList.remove('grabbing');
            
            // Applique l'inertie
            applyInertia();
        });

        wrapper.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            
            e.preventDefault();
            const x = e.pageX - wrapper.offsetLeft;
            const walk = (x - startX) * 2; // Le *2 rend le scroll plus rapide
            
            // Calcule la vélocité pour l'inertie
            velocity = walk;
            
            wrapper.scrollLeft = scrollLeft - walk;
        });

        // Fonction pour appliquer l'inertie
        function applyInertia() {
            if (Math.abs(velocity) > 0.5) {
                wrapper.scrollLeft -= velocity;
                velocity *= 0.95; // Décélération
                
                animationFrame = requestAnimationFrame(applyInertia);
            } else {
                // Alignement automatique sur la carte la plus proche
                snapToNearestCard();
            }
        }

        // Fonction pour aligner sur la carte la plus proche
        function snapToNearestCard() {
            const scrollAmount = calculateScrollAmount();
            const currentIndex = Math.round(wrapper.scrollLeft / scrollAmount);
            
            wrapper.scrollTo({
                left: currentIndex * scrollAmount,
                behavior: 'smooth'
            });
        }
    }

    // --- Fonction utilitaire pour calculer le scrollAmount ---
    function calculateScrollAmount() {
        if (!wrapper) return 0;
        
        const projectCard = wrapper.querySelector('.project-card');
        if (!projectCard) return 0;
        
        const cardStyle = window.getComputedStyle(projectCard);
        const wrapperStyle = window.getComputedStyle(wrapper);
        const cardWidth = projectCard.offsetWidth;
        const gap = parseFloat(wrapperStyle.gap) || 30;
        
        return cardWidth + gap;
    }

    // --- AJOUT D'EFFETS VISUELS SUPPLÉMENTAIRES ---
    // Observer les cartes de projet pour des animations au scroll
    const projectCards = document.querySelectorAll('.project-card');
    const projectObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, {
        threshold: 0.2,
        root: wrapper
    });

    projectCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        projectObserver.observe(card);
    });

    // --- AMÉLIORATION DE L'ACCESSIBILITÉ ---
    // Gestion du focus clavier pour les flèches
    if (prevButton && nextButton) {
        [prevButton, nextButton].forEach(button => {
            button.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    button.click();
                }
            });
        });
    }