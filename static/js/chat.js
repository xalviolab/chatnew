// Xalvion - Chat İşlevselliği

document.addEventListener('DOMContentLoaded', function () {
    // DOM Elementleri
    const chatMessages = document.getElementById('chatMessages');
    const messageInput = document.getElementById('messageInput');
    const sendButton = document.getElementById('sendButton');
    const modelSelect = document.getElementById('modelSelect');
    const useRagCheckbox = document.getElementById('useRag');
    const tokenRemainingElement = document.getElementById('tokenRemaining');
    const tokenProgressElement = document.getElementById('tokenProgress');
    const ragRemainingElement = document.getElementById('ragRemaining');
    const ragProgressElement = document.getElementById('ragProgress');
    const menuToggle = document.getElementById('menuToggle');
    const menu = document.getElementById('menu');

    // Mobil menü toggle
    if (menuToggle && menu) {
        menuToggle.addEventListener('click', function () {
            menu.classList.toggle('show');
        });
    }

    // Enter tuşu ile mesaj gönderme
    messageInput.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    // Gönder butonu ile mesaj gönderme
    sendButton.addEventListener('click', sendMessage);

    // Mesaj gönderme fonksiyonu
    function sendMessage() {
        const message = messageInput.value.trim();
        if (!message) return;

        // Kullanıcı mesajını ekrana ekle
        addMessage('user', message);
        messageInput.value = '';

        // Yazıyor göstergesi ekle
        const typingIndicator = document.createElement('div');
        typingIndicator.className = 'typing-indicator';
        typingIndicator.innerHTML = '<span></span><span></span><span></span>';
        chatMessages.appendChild(typingIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // AI durum göstergesini ekle
        const aiStatusIndicator = document.createElement('div');
        aiStatusIndicator.className = 'ai-status-indicator';
        aiStatusIndicator.innerHTML = '<div class="ai-status-text">AI düşünüyor...</div>';
        chatMessages.appendChild(aiStatusIndicator);
        chatMessages.scrollTop = chatMessages.scrollHeight;

        // Seçilen model ve RAG durumunu al
        const selectedModel = modelSelect.value;
        const useRag = useRagCheckbox.checked;

        // RAG kullanılıyorsa durum göstergesini güncelle
        if (useRag) {
            aiStatusIndicator.innerHTML = '<div class="ai-status-text">AI veritabanında arama yapıyor...</div>';
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }

        // API'ye istek gönder
        fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                model: selectedModel,
                use_rag: useRag
            })
        })
            .then(response => {
                if (!response.ok) {
                    return response.json().then(data => {
                        throw new Error(data.error || 'Bir hata oluştu');
                    });
                }
                return response.json();
            })
            .then(data => {
                // Yazıyor göstergesini ve AI durum göstergesini kaldır
                typingIndicator.remove();
                const statusIndicator = document.querySelector('.ai-status-indicator');
                if (statusIndicator) statusIndicator.remove();

                // RAG durumunu kontrol et ve mesaja ekle
                let messageContent = data.message;

                // RAG kullanıldıysa ve sonuç varsa bilgi ekle
                if (useRag) {
                    const ragInfo = data.rag_info || {};
                    let ragStatusHtml = '';

                    if (ragInfo.found_results === true) {
                        ragStatusHtml = '<div class="rag-status rag-success">✓ Veritabanında ilgili bilgiler bulundu</div>';
                    } else if (ragInfo.found_results === false) {
                        ragStatusHtml = '<div class="rag-status rag-warning">⚠ Veritabanında ilgili bilgi bulunamadı</div>';
                    }

                    if (ragStatusHtml) {
                        messageContent = ragStatusHtml + messageContent;
                    }
                }

                // Asistan mesajını ekle
                addMessage('assistant', messageContent);

                // Kullanıcı limitlerini güncelle
                updateUserLimits(data);
            })
            .catch(error => {
                // Yazıyor göstergesini ve AI durum göstergesini kaldır
                typingIndicator.remove();
                const statusIndicator = document.querySelector('.ai-status-indicator');
                if (statusIndicator) statusIndicator.remove();

                // Hata mesajını göster
                const errorMessage = error.message || 'Bir hata oluştu. Lütfen daha sonra tekrar deneyin.';

                // Eğer limit hatası ise yükseltme önerisi göster
                if (errorMessage.includes('limit')) {
                    showUpgradePrompt(errorMessage);
                } else {
                    addMessage('assistant', `Hata: ${errorMessage}`);
                }
            });
    }

    // Mesaj ekleme fonksiyonu
    function addMessage(role, content) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message message-${role}`;

        const messageContent = document.createElement('div');
        // HTML içeriğini güvenli bir şekilde ayarla
        if (role === 'assistant') {
            // AI yanıtları için HTML içeriğini kullan
            messageContent.innerHTML = content;
        } else {
            // Kullanıcı mesajları için düz metin kullan
            messageContent.textContent = content;
        }
        messageContent.className = 'message-content';
        messageDiv.appendChild(messageContent);

        const messageTime = document.createElement('div');
        messageTime.className = 'message-time';
        messageTime.textContent = 'Şimdi';
        messageDiv.appendChild(messageTime);

        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Kullanıcı limitlerini güncelleme fonksiyonu
    function updateUserLimits(data) {
        if (tokenRemainingElement && data.tokens_remaining !== undefined) {
            tokenRemainingElement.textContent = data.tokens_remaining;
            const tokenLimit = parseInt(document.getElementById('tokenLimit').textContent);
            const tokenPercentage = (1 - (data.tokens_remaining / tokenLimit)) * 100;
            tokenProgressElement.style.width = `${tokenPercentage}%`;
        }

        if (ragRemainingElement && data.rag_remaining !== undefined) {
            ragRemainingElement.textContent = data.rag_remaining;
            const ragLimit = parseInt(document.getElementById('ragLimit').textContent);
            const ragPercentage = (1 - (data.rag_remaining / ragLimit)) * 100;
            ragProgressElement.style.width = `${ragPercentage}%`;
        }
    }

    // Yükseltme önerisi gösterme fonksiyonu
    function showUpgradePrompt(message) {
        const upgradePrompt = document.createElement('div');
        upgradePrompt.className = 'upgrade-prompt';
        upgradePrompt.innerHTML = `
            <h3>Limit Aşıldı</h3>
            <p>${message}</p>
            <a href="/pricing" class="btn btn-primary">Premium'a Yükselt</a>
        `;

        chatMessages.appendChild(upgradePrompt);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    // Kullanıcı limitlerini periyodik olarak güncelle
    function fetchUserLimits() {
        fetch('/api/user/limits')
            .then(response => response.json())
            .then(data => {
                updateUserLimits(data);
            })
            .catch(error => {
                console.error('Kullanıcı limitleri alınamadı:', error);
            });
    }

    // Sayfa yüklendiğinde ve her 5 dakikada bir limitleri güncelle
    fetchUserLimits();
    setInterval(fetchUserLimits, 5 * 60 * 1000);
});