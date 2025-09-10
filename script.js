document.addEventListener('DOMContentLoaded', () => {

    // --- Animation de frappe ---
    const typingElement = document.getElementById('typing-effect');
    if (typingElement) {
        const words = ["Étudiant en BTS SIO.", "Passionné d'infrastructure.", "À la recherche d'une alternance."];
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
            }
        });
    }, {
        threshold: 0.1
    });

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach(el => observer.observe(el));

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