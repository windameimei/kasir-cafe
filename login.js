// ===== LOGIN LOGIC =====
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    const togglePassword = document.getElementById('togglePassword');
    const btnLogin = document.getElementById('btnLogin');
    const toast = document.getElementById('toast');
    const toastMessage = document.getElementById('toastMessage');
    const rememberMe = document.getElementById('rememberMe');

    // Default credentials
    const ADMIN_USER = 'admin';
    const ADMIN_PASS = 'admin123';

    // Check if already logged in
    const session = localStorage.getItem('kasir_session');
    if (session) {
        window.location.href = 'dashboard.html';
        return;
    }

    // Load remembered username
    const remembered = localStorage.getItem('kasir_remember');
    if (remembered) {
        usernameInput.value = remembered;
        rememberMe.checked = true;
    }

    // Toggle password visibility
    togglePassword.addEventListener('click', () => {
        const type = passwordInput.type === 'password' ? 'text' : 'password';
        passwordInput.type = type;
        togglePassword.innerHTML = type === 'password' 
            ? '<i class="fas fa-eye"></i>' 
            : '<i class="fas fa-eye-slash"></i>';
    });

    // Show toast
    function showToast(message, isSuccess = false) {
        toastMessage.textContent = message;
        toast.className = isSuccess ? 'toast success show' : 'toast show';
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // Handle login
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // Validation
        if (!username || !password) {
            showToast('Username dan password wajib diisi');
            return;
        }

        // Loading state
        btnLogin.classList.add('loading');
        const originalText = btnLogin.querySelector('.btn-text').textContent;
        btnLogin.querySelector('.btn-text').textContent = 'Memverifikasi';

        // Simulate API call
        setTimeout(() => {
            if (username === ADMIN_USER && password === ADMIN_PASS) {
                // Success
                if (rememberMe.checked) {
                    localStorage.setItem('kasir_remember', username);
                } else {
                    localStorage.removeItem('kasir_remember');
                }

                localStorage.setItem('kasir_session', JSON.stringify({
                    username: username,
                    loginAt: new Date().toISOString()
                }));

                showToast('Login berhasil! Mengalihkan...', true);

                setTimeout(() => {
                    window.location.href = 'dashboard.html';
                }, 800);
            } else {
                // Failed
                btnLogin.classList.remove('loading');
                btnLogin.querySelector('.btn-text').textContent = originalText;
                showToast('Username atau password salah');
                passwordInput.value = '';
                passwordInput.focus();
            }
        }, 800);
    });

    // Enter key on username -> focus password
    usernameInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            passwordInput.focus();
        }
    });
});
