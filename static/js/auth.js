document.addEventListener('DOMContentLoaded', function() {
    // Role switching in login
    const roleTabs = document.querySelectorAll('.role-tab');
    const loginForms = document.querySelectorAll('.login-form');
    const switchLinks = document.querySelectorAll('.switch-role');

    roleTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const role = this.dataset.role;
            
            // Update active tab
            roleTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Show correct form
            loginForms.forEach(form => {
                form.classList.remove('active');
                if (form.classList.contains(`${role}-form`)) {
                    form.classList.add('active');
                }
            });
        });
    });

    switchLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const currentForm = this.closest('.login-form');
            const otherRole = currentForm.classList.contains('student-form') ? 'teacher' : 'student';
            
            document.querySelector(`.${otherRole}-tab`).click();
        });
    });

    // Login form submission
    document.getElementById('student-login-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin('student');
    });

    document.getElementById('teacher-login-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        handleLogin('teacher');
    });

    // Registration role switching
    const registerTabs = document.querySelectorAll('.register-tab');
    registerTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            registerTabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            document.getElementById('role').value = this.dataset.role;
        });
    });

    // Registration form submission
    document.getElementById('register-form')?.addEventListener('submit', function(e) {
        e.preventDefault();
        handleRegister();
    });
});

function handleLogin(role) {
    const username = document.getElementById(`${role}-username`).value;
    const password = document.getElementById(`${role}-password`).value;

    fetch(`/auth/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            password,
            role
        })
    })
    .then(response => {
        if (!response.ok) throw new Error('Login failed');
        return response.json();
    })
    .then(data => {
        // Redirect based on role
        if (role === 'student') {
            window.location.href = '/dashboard';
        } else {
            window.location.href = '/teacher_dashboard';
        }
    })
    .catch(error => {
        alert(error.message);
    });
}

function handleRegister() {
    const role = document.getElementById('role').value;
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (password !== confirmPassword) {
        alert("Passwords don't match!");
        return;
    }

    fetch(`/auth/register`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            username,
            password,
            role
        })
    })
    .then(response => {
        if (!response.ok) throw new Error('Registration failed');
        return response.json();
    })
    .then(data => {
        alert('Registration successful! Please login.');
        window.location.href = '/login';
    })
    .catch(error => {
        alert(error.message);
    });
}