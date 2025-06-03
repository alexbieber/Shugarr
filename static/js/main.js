document.addEventListener('DOMContentLoaded', () => {
    // --- Show Password Toggle ---
    const showPasswordCheckbox = document.getElementById('showPassword');
    const passwordField = document.getElementById('password');
    // TODO: Add logic for a confirm password field if it exists, e.g., id="confirm_password"

    if (showPasswordCheckbox && passwordField) {
        showPasswordCheckbox.addEventListener('change', () => {
            if (passwordField.type === 'password') {
                passwordField.type = 'text';
            } else {
                passwordField.type = 'password';
            }
            // If there's a confirm password field, its type should also be toggled
            // const confirmPasswordField = document.getElementById('confirm_password');
            // if (confirmPasswordField) {
            //     confirmPasswordField.type = passwordField.type;
            // }
        });
    }

    // Other global JavaScript can go here, for example:
    // --- Auto-dismiss flash messages after a delay ---
    const flashMessages = document.querySelectorAll('.alert-dismissible');
    flashMessages.forEach(flashMessage => {
        // Check if Bootstrap's alert component is available
        if (typeof(bootstrap) !== 'undefined' && bootstrap.Alert) {
            // Find the close button, if it exists
            const closeButton = flashMessage.querySelector('.close');
            if (closeButton) { // Only proceed if it's meant to be dismissible by user
                 setTimeout(() => {
                    // Use Bootstrap's Alert instance to dismiss
                    const alertInstance = bootstrap.Alert.getInstance(flashMessage) || new bootstrap.Alert(flashMessage);
                    alertInstance.close();
                }, 5000); // Dismiss after 5 seconds
            }
        } else { // Fallback if Bootstrap JS not fully loaded or alert component not found
            if (flashMessage.querySelector('.close')) { // Only if it has a close button
                setTimeout(() => {
                    flashMessage.style.display = 'none';
                }, 5000);
            }
        }
    });

});

// Note: For the Bootstrap auto-dismiss to work reliably,
// ensure Bootstrap's JS (bootstrap.bundle.min.js or bootstrap.js + popper.js) is loaded
// and that alerts are correctly structured for the Alert component.
// The `templates/base.html` already includes Bootstrap JS.
// The `bootstrap.Alert.getInstance(flashMessage)` is the preferred way to get an existing instance.
// If it doesn't exist, `new bootstrap.Alert(flashMessage)` initializes it.
// The fallback `flashMessage.style.display = 'none'` is a simpler way if Bootstrap's JS components aren't active.
