document.addEventListener('DOMContentLoaded', function () {
    console.log("main.js loaded and DOM fully parsed.");

    // 1. Mobile Navigation Toggle
    const navToggle = document.querySelector('.nav-mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            navLinks.classList.toggle('nav-active');
            // ARIA attribute for accessibility
            const isExpanded = navLinks.classList.contains('nav-active');
            navToggle.setAttribute('aria-expanded', isExpanded);
            // Optional: Animate hamburger icon
            this.classList.toggle('is-active');
        });
    } else {
        console.log("Mobile navigation elements not found.");
    }

    // 2. Client-Side Form Validation Feedback (Enhancement)
    // This targets forms with the class 'auth-form' as used in login/register/edit_profile
    const formsToValidate = document.querySelectorAll('form.auth-form');

    formsToValidate.forEach(form => {
        const inputs = form.querySelectorAll('input[required], input[type="email"], input[minlength]'); // Add other selectors as needed

        inputs.forEach(input => {
            // Function to handle validation feedback
            const handleValidation = (event) => {
                // Check native HTML5 validity
                if (!input.validity.valid) {
                    input.classList.add('is-invalid-client');
                    // You could also find a sibling/parent element to show a generic client-side message
                    // e.g. if (event.type === 'blur') input.reportValidity(); // Shows native browser error popup on blur
                } else {
                    input.classList.remove('is-invalid-client');
                }

                // Special handling for password confirmation if fields exist
                if (input.id === 'password' || input.id === 'confirm_password') {
                    const passwordField = form.querySelector('#password');
                    const confirmPasswordField = form.querySelector('#confirm_password');
                    if (passwordField && confirmPasswordField && confirmPasswordField.value) { // only validate if confirm has a value
                        if (passwordField.value !== confirmPasswordField.value) {
                            confirmPasswordField.classList.add('is-invalid-client');
                            // Could set a custom validity message for the confirm field
                            // confirmPasswordField.setCustomValidity("Passwords do not match.");
                        } else {
                            confirmPasswordField.classList.remove('is-invalid-client');
                            // confirmPasswordField.setCustomValidity("");
                        }
                    }
                }
            };

            input.addEventListener('input', handleValidation); // Validate as user types
            input.addEventListener('blur', handleValidation);  // Validate when user leaves the field
        });
    });

    // 3. Subtle Hover Effects / Transitions (Example)
    // This can often be done purely in CSS. JS is useful for more complex interactions.
    // For example, adding a class to trigger a more complex animation on card hover:
    const cards = document.querySelectorAll('.user-card, .dashboard-card, .feature-item');
    cards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            // card.classList.add('card-hover-enhanced'); // CSS would define .card-hover-enhanced
        });
        card.addEventListener('mouseleave', () => {
            // card.classList.remove('card-hover-enhanced');
        });
    });

    // Add more JS interactivity as needed for the application.
    // For example, dismissing flash messages after a timeout or with a click.
    const flashMessages = document.querySelectorAll('.alert');
    flashMessages.forEach(flash => {
        // Example: Make flash messages dismissible after a delay (and add a close button)
        // This is a more complex example that would require adding HTML for a close button.
        // For simplicity, we'll just log that they are found.
        if (flash.textContent.trim().length > 0) { // Check if there is actual text content
             console.log("Flash message found:", flash.textContent.trim());
        }

        // setTimeout(() => {
        //     flash.style.transition = 'opacity 0.5s ease';
        //     flash.style.opacity = '0';
        //     setTimeout(()_ => flash.remove(), 500);
        // }, 5000); // Remove after 5 seconds
    });

});

// Optional: Add a class to the hamburger icon itself for animation
// CSS for .nav-mobile-toggle.is-active span could transform into an X
/* Example CSS for hamburger toggle animation (add to style.css)
.nav-mobile-toggle.is-active span:nth-child(1) {
    transform: translateY(8px) rotate(45deg);
}
.nav-mobile-toggle.is-active span:nth-child(2) {
    opacity: 0;
}
.nav-mobile-toggle.is-active span:nth-child(3) {
    transform: translateY(-8px) rotate(-45deg);
}
*/

// CSS for client-side invalid input (add to style.css)
/*
.form-control.is-invalid-client {
    border-color: var(--error-red); // Or a different color to distinguish from server-side
    box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.2); // Error focus ring
}
*/
