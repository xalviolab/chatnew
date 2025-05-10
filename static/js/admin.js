// Xalvion - Admin Panel İşlevselliği

document.addEventListener('DOMContentLoaded', function () {
    // DOM Elementleri
    const menuToggle = document.getElementById('menuToggle');
    const menu = document.getElementById('menu');
    const editButtons = document.querySelectorAll('.edit-user');
    const deleteButtons = document.querySelectorAll('.delete-user');
    const deleteDocButtons = document.querySelectorAll('.delete-document');
    const editModal = document.getElementById('editUserModal');
    const deleteModal = document.getElementById('deleteUserModal');
    const deleteDocModal = document.getElementById('deleteDocumentModal');
    const closeButtons = document.querySelectorAll('.close');
    const cancelDeleteButtons = document.querySelectorAll('.cancel-delete');

    // Mobil menü toggle
    if (menuToggle && menu) {
        menuToggle.addEventListener('click', function () {
            menu.classList.toggle('show');
        });
    }

    // Kullanıcı düzenleme modal
    if (editButtons && editModal) {
        editButtons.forEach(button => {
            button.addEventListener('click', function () {
                const userId = this.getAttribute('data-id');
                const role = this.getAttribute('data-role');
                const tokenLimit = this.getAttribute('data-token-limit');
                const ragLimit = this.getAttribute('data-rag-limit');

                // Form değerlerini ayarla
                document.getElementById('role').value = role;
                document.getElementById('token_limit').value = tokenLimit;
                document.getElementById('rag_limit').value = ragLimit;

                // Form action URL'sini ayarla
                document.getElementById('editUserForm').action = `/admin/users/${userId}/update`;

                // Modal'ı göster
                editModal.style.display = 'block';
            });
        });
    }

    // Kullanıcı silme modal
    if (deleteButtons && deleteModal) {
        deleteButtons.forEach(button => {
            button.addEventListener('click', function () {
                const userId = this.getAttribute('data-id');

                // Form action URL'sini ayarla
                document.getElementById('deleteUserForm').action = `/admin/users/${userId}/delete`;

                // Modal'ı göster
                deleteModal.style.display = 'block';
            });
        });
    }

    // Doküman silme modal
    if (deleteDocButtons && deleteDocModal) {
        deleteDocButtons.forEach(button => {
            button.addEventListener('click', function () {
                const docId = this.getAttribute('data-id');

                // Form action URL'sini ayarla
                document.getElementById('deleteDocumentForm').action = `/admin/documents/${docId}/delete`;

                // Modal'ı göster
                deleteDocModal.style.display = 'block';
            });
        });
    }

    // Modal kapatma
    if (closeButtons) {
        closeButtons.forEach(button => {
            button.addEventListener('click', function () {
                const modal = this.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }

    // İptal butonları
    if (cancelDeleteButtons) {
        cancelDeleteButtons.forEach(button => {
            button.addEventListener('click', function () {
                const modal = this.closest('.modal');
                if (modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }

    // Modal dışına tıklayınca kapatma
    window.addEventListener('click', function (event) {
        if (event.target.classList.contains('modal')) {
            event.target.style.display = 'none';
        }
    });
});