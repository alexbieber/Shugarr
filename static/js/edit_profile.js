document.addEventListener('DOMContentLoaded', () => {
    // NOTE_TO_BACKEND:
    // This file handles client-side validation for the edit profile form (/edit_profile).
    // It aims to provide immediate feedback to the user. However, all validations
    // performed here MUST also be performed on the backend (e.g., in app.py using EditProfileForm from forms.py)
    // as client-side validation can be bypassed. The backend validation is the primary source of truth
    // for data integrity and security.
    //
    // This script also includes a character counter for the 'About Me' field.

    const editProfileForm = document.querySelector('form[action="/edit_profile"]'); // More specific selector

    if (editProfileForm) {
        const ageField = editProfileForm.querySelector('#age');
        const locationField = edit_profile_form.querySelector('#location'); // Assuming ID 'location'
        const interestsField = editProfileForm.querySelector('#interests');
        const profilePictureUrlField = editProfileForm.querySelector('#profile_picture_url');
        const aboutMeField = editProfileForm.querySelector('#about_me'); // Assuming ID 'about_me' for bio

        // --- Character Counter for Bio (About Me) ---
        if (aboutMeField) {
            const maxLength = parseInt(aboutMeField.getAttribute('maxlength') || '140', 10);
            const charCountDisplay = document.createElement('div');
            charCountDisplay.classList.add('char-counter');
            charCountDisplay.textContent = `${aboutMeField.value.length}/${maxLength}`;
            // Insert after the textarea
            aboutMeField.parentNode.insertBefore(charCountDisplay, aboutMeField.nextSibling);

            aboutMeField.addEventListener('input', () => {
                charCountDisplay.textContent = `${aboutMeField.value.length}/${maxLength}`;
                if (aboutMeField.value.length > maxLength) {
                    charCountDisplay.classList.add('text-danger'); // Bootstrap class for error
                    aboutMeField.classList.add('is-invalid');
                } else {
                    charCountDisplay.classList.remove('text-danger');
                    aboutMeField.classList.remove('is-invalid');
                }
            });
        }

        // --- Client-Side Validation ---
        editProfileForm.addEventListener('submit', (event) => {
            let isValid = true;
            clearAllErrorMessages(editProfileForm);

            // 1. Age Validation
            if (ageField && ageField.value) {
                const age = parseInt(ageField.value, 10);
                if (isNaN(age) || age < 13 || age > 120) {
                    isValid = false;
                    displayErrorMessage(ageField, 'Please enter a valid age (13-120).');
                }
            }

            // 2. Location Validation (Example: required)
            // For this example, let's assume location is not strictly required by client-side validation
            // but if a backend makes it required, this is where you'd add:
            // if (locationField && locationField.value.trim() === '') {
            //     isValid = false;
            //     displayErrorMessage(locationField, 'Location cannot be empty.');
            // }


            // 3. Interests Validation (Example: max length)
            if (interestsField && interestsField.value.length > 200) { // Matches form validator
                isValid = false;
                displayErrorMessage(interestsField, 'Interests should not exceed 200 characters.');
            }

            // 4. Profile Picture URL Validation
            if (profilePictureUrlField && profilePictureUrlField.value) {
                const urlPattern = /^(ftp|http|https):\/\/[^ "]+$/;
                if (!urlPattern.test(profilePictureUrlField.value)) {
                    isValid = false;
                    displayErrorMessage(profilePictureUrlField, 'Please enter a valid URL (e.g., http://example.com/image.png).');
                }
            }

            // 5. About Me / Bio character limit (already has visual feedback from counter)
            if (aboutMeField && aboutMeField.value.length > (parseInt(aboutMeField.getAttribute('maxlength') || '140', 10))) {
                 isValid = false;
                 // Error message might be redundant if char counter is clear enough, but good for consistency
                 displayErrorMessage(aboutMeField, `Bio should not exceed ${parseInt(aboutMeField.getAttribute('maxlength') || '140', 10)} characters.`);
            }


            if (!isValid) {
                event.preventDefault(); // Prevent form submission
                // Optionally, scroll to the first error or show a summary message
                const firstError = editProfileForm.querySelector('.is-invalid');
                if (firstError) {
                    firstError.focus();
                }
            }
        });

        function displayErrorMessage(field, message) {
            field.classList.add('is-invalid'); // Bootstrap class for styling
            let errorDiv = field.parentNode.querySelector('.invalid-feedback-custom');
            if (!errorDiv) {
                errorDiv = document.createElement('div');
                errorDiv.classList.add('invalid-feedback-custom', 'text-danger', 'small', 'mt-1');
                // Insert after the field or its .char-counter if it exists
                const nextSibling = field.nextElementSibling && field.nextElementSibling.classList.contains('char-counter')
                                    ? field.nextElementSibling.nextSibling
                                    : field.nextSibling;
                field.parentNode.insertBefore(errorDiv, nextSibling);
            }
            errorDiv.textContent = message;
        }

        function clearAllErrorMessages(form) {
            form.querySelectorAll('.is-invalid').forEach(field => field.classList.remove('is-invalid'));
            form.querySelectorAll('.invalid-feedback-custom').forEach(errorDiv => errorDiv.remove());
        }
    }
});
