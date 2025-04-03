document.addEventListener('DOMContentLoaded', function() {
    const forms = document.querySelectorAll('.form-size, #newsletter-form');

    forms.forEach(form => {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        }, false);
    });
});