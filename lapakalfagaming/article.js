// ambil id dari URL (?id=komunitas-alfagaming-untung)
const params = new URLSearchParams(window.location.search);
const articleId = params.get('id'); // STRING

fetch('/articles.json')
    .then(res => res.json())
    .then(articles => {
        const article = articles.find(a => a.id === articleId);

        if (!article) {
            document.body.innerHTML = '<p>Artikel tidak ditemukan.</p>';
            return;
        }

        // isi judul & gambar
        document.getElementById('article-title').textContent = article.title;

        const img = document.getElementById('article-image');
        img.src = article.image;
        img.alt = article.title;

        const dateEl = document.getElementById('article-date');

        const options = { day: 'numeric', month: 'long', year: 'numeric' };
        const formattedDate = new Date(article.date).toLocaleDateString('id-ID', options);

        dateEl.textContent = 'Diposting pada ' + formattedDate;
        dateEl.setAttribute('datetime', article.date);

        // render content flexible (support html tags in json)
        const contentContainer = document.getElementById('article-content');
        contentContainer.innerHTML = "";

        article.content.forEach(block => {
            // Check if block is a raw HTML tag (header, list, etc)
            if (block.trim().startsWith('<')) {
                const tempWrapper = document.createElement('div');
                tempWrapper.innerHTML = block;
                while (tempWrapper.firstChild) {
                    contentContainer.appendChild(tempWrapper.firstChild);
                }
            } else {
                // Regular paragraph
                const p = document.createElement('p');
                p.innerHTML = block;
                contentContainer.appendChild(p);
            }
        });
    })
    .catch(err => {
        console.error('Gagal load artikel:', err);
    });
