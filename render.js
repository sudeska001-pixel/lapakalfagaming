// Helper format tanggal indo (diletakkan di luar untuk efisiensi)
const formatDate = (dateString) => {
    const options = { day: 'numeric', month: 'long', year: 'numeric' };
    return new Date(dateString).toLocaleDateString('id-ID', options);
};

// Gunakan async/await untuk kode lebih bersih
(async () => {
    try {
        const res = await fetch('/articles.json');
        const articles = await res.json();
        
        const container = document.getElementById('articles');
        const loading = document.getElementById('loading');
        if (!container) return;

        // Hapus loading segera
        if (loading) loading.remove();

        // Urutkan artikel terbaru di atas
        articles.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Gunakan DocumentFragment untuk batch DOM insertion (lebih cepat)
        const fragment = document.createDocumentFragment();

        articles.forEach((article, index) => {
            const card = document.createElement('article');
            card.className = 'article-card';

            // Badge HOT untuk artikel terbaru (index 0)
            const hotBadge = index === 0 ? '<div class="hot-badge">🔥 TRENDING</div>' : '';

            // Pastikan link valid
            const linkUrl = article.link.startsWith('/') ? article.link : `/article.html?id=${article.id}`;

            card.innerHTML = `
                <a href="${linkUrl}" class="article-link-wrapper">
                    ${hotBadge}
                    <img src="${article.image}" alt="${article.title}" loading="lazy" decoding="async">
                    <div class="card-content">
                        <div class="article-category">${article.category || 'General'}</div>
                        <h3>${article.title}</h3>
                        <p>${article.excerpt}</p>
                        <div class="article-meta">
                            <span>✍️ ${article.author || 'Tim Alfa'}</span>
                            <span>🗓️ ${formatDate(article.date)}</span>
                        </div>
                    </div>
                </a>
            `;

            fragment.appendChild(card);
        });

        // Satu kali DOM update (lebih cepat dari appendChild berulang)
        container.appendChild(fragment);
    } catch (err) {
        console.error('Gagal load artikel:', err);
    }
})();
