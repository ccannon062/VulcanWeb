

function removeErrorMessage(input) {
    input.classList.remove('is-invalid');
    const errorMessage = input.parentNode.querySelector('.invalid-feedback');
    if (errorMessage) {
        errorMessage.remove();
    }
}

function validateFormField(input) {
    const value = input.value.trim();
    let isValid = true;
    let errorMessage = '';
    removeErrorMessage(input);

    if (input.hasAttribute('required') && value === '') {
        isValid = false;
        errorMessage = 'This field is required';
    }
    else if (input.type === 'email' && value !== '') {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            errorMessage = 'Please enter a valid email address';
        }
    }

    if (!isValid) {
        input.classList.add('is-invalid');

        const errorDiv = document.createElement('div');
        errorDiv.className = 'invalid-feedback';
        errorDiv.textContent = errorMessage;
        input.parentNode.appendChild(errorDiv);
    } else {
        input.classList.remove('is-invalid');
        input.classList.add('is-valid');
    }

    return isValid;
}

function validateInput(event) {
    return validateFormField(event.target);
}

function showFormMessage(form, type, message) {
    const existingAlert = form.parentNode.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }

    const alertDiv = document.createElement('div');
    alertDiv.className = "alert alert-" + type + " alert-dismissible fade show mt-3";
    alertDiv.setAttribute('role', 'alert');
    alertDiv.innerHTML = message +
        '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';

    form.insertAdjacentElement('afterend', alertDiv);

    setTimeout(() => {
        alertDiv.classList.remove('show');
        setTimeout(() => alertDiv.remove(), 150);
    }, 5000);
}

function handleContactFormSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const submitButton = form.querySelector('button[type="submit"]');
    const formData = new FormData(form);
    let isValid = true;

    form.querySelectorAll('input, textarea').forEach(input => {
        if (!validateFormField(input)) {
            isValid = false;
        }
    });

    if (!isValid) {
        return;
    }

    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Submitting...';
    submitButton.disabled = true;

    const encodedData = new URLSearchParams(formData).toString();

    const actionUrl = form.getAttribute('action');

    fetch(actionUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: encodedData
    })
        .then(response => {
            if (response.redirected) {
                window.location.href = response.url;
                return null;
            }

            const contentType = response.headers.get('content-type');
            if (contentType && contentType.includes('application/json')) {
                return response.json().catch(e => {
                    return { success: true };
                });
            } else {
                return { success: true };
            }
        })
        .then(data => {
            if (data === null) return;

            showFormMessage(form, 'success', 'Your message has been sent successfully!');

            form.reset();
            form.querySelectorAll('.is-valid').forEach(element => {
                element.classList.remove('is-valid');
            });
        })
        .catch(error => {
            showFormMessage(form, 'danger', 'There was a problem sending your message. Please try again.');
            console.error('Error:', error);
        })
        .finally(() => {
            // Reset button state
            submitButton.innerHTML = 'Submit Your Information';
            submitButton.disabled = false;
        });
}

function handleNewsletterSubmit(event) {
    event.preventDefault();

    const form = event.target;
    const emailInput = form.querySelector('input[type="email"]');
    const submitButton = form.querySelector('button[type="submit"]');

    if (!validateFormField(emailInput)) {
        return;
    }

    const originalButtonText = submitButton.textContent;
    submitButton.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>';
    submitButton.disabled = true;

    const formData = new FormData(form);
    const encodedData = new URLSearchParams(formData).toString();

    const actionUrl = form.getAttribute('action');

    fetch(actionUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-Requested-With': 'XMLHttpRequest'
        },
        body: encodedData
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const footerSection = document.querySelector('footer');
            if (footerSection) {
                const alertDiv = document.createElement('div');
                alertDiv.className = 'alert alert-success alert-dismissible fade show';
                alertDiv.setAttribute('role', 'alert');
                alertDiv.innerHTML = 'Thank you for subscribing to our newsletter!' +
                    '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';

                footerSection.insertAdjacentElement('beforebegin', alertDiv);

                setTimeout(() => {
                    alertDiv.classList.remove('show');
                    setTimeout(() => alertDiv.remove(), 150);
                }, 5000);
            }

            form.reset();
            emailInput.classList.remove('is-valid');
        })
        .catch(error => {
            const footerSection = document.querySelector('footer');
            if (footerSection) {
                const alertDiv = document.createElement('div');
                alertDiv.className = 'alert alert-danger alert-dismissible fade show';
                alertDiv.setAttribute('role', 'alert');
                alertDiv.innerHTML = 'There was a problem with your subscription. Please try again.' +
                    '<button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>';

                footerSection.insertAdjacentElement('beforebegin', alertDiv);

                setTimeout(() => {
                    alertDiv.classList.remove('show');
                    setTimeout(() => alertDiv.remove(), 150);
                }, 5000);
            }
            console.error('Error:', error);
        })
        .finally(() => {
            submitButton.innerHTML = originalButtonText;
            submitButton.disabled = false;
        });
}

document.addEventListener('DOMContentLoaded', function() {
    const contactForms = document.querySelectorAll('form:not(#newsletter-form)');
    const newsletterForm = document.getElementById('newsletter-form');

    contactForms.forEach(form => {
        form.addEventListener('submit', handleContactFormSubmit);
    });

  
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', handleNewsletterSubmit);
    }

    const formInputs = document.querySelectorAll('form input, form textarea');
    formInputs.forEach(input => {
        input.addEventListener('blur', validateInput);
    });

    const anchorLinks = document.querySelectorAll('a[href^="#"]');

    anchorLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const targetId = this.getAttribute('href');

            if (targetId === '#' || !targetId) {
                return;
            }

            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                e.preventDefault();

                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                history.pushState(null, null, targetId);
            }
        });
    });
});
