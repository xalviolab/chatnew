// Xalvion - Kimlik Doğrulama İşlevselliği

document.addEventListener('DOMContentLoaded', function () {
    // DOM Elementleri
    const menuToggle = document.getElementById('menuToggle');
    const menu = document.getElementById('menu');
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const passwordInput = document.getElementById('password');
    const passwordConfirmInput = document.getElementById('password_confirm');
    const upgradeButton = document.getElementById('upgradePremium');

    // Mobil menü toggle
    if (menuToggle && menu) {
        menuToggle.addEventListener('click', function () {
            menu.classList.toggle('show');
        });
    }

    // Kayıt formu doğrulama
    if (registerForm) {
        registerForm.addEventListener('submit', function (e) {
            // Şifre kontrolü
            if (passwordInput && passwordConfirmInput) {
                if (passwordInput.value !== passwordConfirmInput.value) {
                    e.preventDefault();
                    alert('Şifreler eşleşmiyor!');
                    return false;
                }

                // Şifre uzunluğu kontrolü
                if (passwordInput.value.length < 6) {
                    e.preventDefault();
                    alert('Şifre en az 6 karakter olmalıdır!');
                    return false;
                }
            }

            return true;
        });
    }

    // Premium yükseltme butonu
    if (upgradeButton) {
        upgradeButton.addEventListener('click', function (e) {
            e.preventDefault();
            // Burada ödeme sayfasına yönlendirme yapılabilir
            alert('Ödeme sayfasına yönlendiriliyorsunuz...');
            // window.location.href = '/payment';
        });
    }

    // Flash mesajlarını otomatik kapat
    const flashMessages = document.querySelectorAll('.alert');
    if (flashMessages) {
        flashMessages.forEach(message => {
            setTimeout(() => {
                message.style.opacity = '0';
                setTimeout(() => {
                    message.style.display = 'none';
                }, 500);
            }, 5000);
        });
    }
});