document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;

            const res = await fetch('/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const data = await res.json();
            document.getElementById('msg').textContent = data.message;

            if (res.ok) {
                const role = data.user.role.toLowerCase();
                localStorage.setItem('user_id', data.user.id);
                localStorage.setItem('username', data.user.username);  // ✅ Store username
                localStorage.setItem('role', role);

                if (role === 'teacher') {
                    window.location.href = '/dashboard/teacher';
                } else if (role === 'student') {
                    window.location.href = '/dashboard/student';
                }
            }
        });
    }




    const registerForm = document.getElementById('registerForm');
    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const username = document.getElementById('regUsername').value;
            const password = document.getElementById('regPassword').value;
            const role = document.getElementById('regRole').value;

            const res = await fetch('/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password, role })
            });

            const data = await res.json();
            document.getElementById('regMsg').textContent = data.message;
            if (res.ok) window.location.href = '/login';
        });
    }

    const pollContainer = document.getElementById('pollContainer');
    if (pollContainer) {
        // Dummy placeholder until integrated
        pollContainer.innerHTML = '<p>Polls will appear here after integration.</p>';
    }
});
