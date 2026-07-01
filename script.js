/* =========================================================
   FUTSAL BFR — carregamento das notícias (posts do Instagram)
   -----------------------------------------------------------
   Lê posts.json e renderiza um embed oficial do Instagram para
   cada post. Não faz scraping nem chama nenhuma API paga —
   usa o mesmo recurso de "incorporar post" que o próprio
   Instagram oferece publicamente.

   COMO ATUALIZAR AS NOTÍCIAS (versão manual, sem acesso à conta):
   1. Abra o post público em instagram.com/futsalbfr
   2. Copie o link do post (ex: https://www.instagram.com/p/ABC123/)
   3. Adicione um novo item no topo da lista "posts" em posts.json
   4. Salve o arquivo — o site já mostra o post novo automaticamente

   QUANDO TIVEREM ACESSO À CONTA (upgrade futuro):
   Essa função loadPosts() é o único lugar que precisa mudar.
   Basta trocar o fetch('posts.json') por uma chamada à Instagram
   Graph API (endpoint /me/media de uma conta Business/Creator
   com token de acesso), mantendo o mesmo formato de dados
   { url, titulo, categoria, data } para não precisar tocar no
   resto do site.
   ========================================================= */

async function loadPosts() {
  const grid = document.getElementById('news-grid');
  if (!grid) return;

  let data;
  try {
    const res = await fetch('posts.json', { cache: 'no-store' });
    if (!res.ok) throw new Error('posts.json não encontrado');
    data = await res.json();
  } catch (err) {
    grid.innerHTML = `
      <div class="news-empty">
        Não foi possível carregar posts.json.<br>
        Se você abriu este arquivo direto no navegador (file://),
        rode um servidor local simples, ex: <code>python3 -m http.server</code>,
        pois o navegador bloqueia leitura de arquivos locais por segurança (CORS).
      </div>`;
    return;
  }

  const posts = (data && data.posts) || [];
  if (posts.length === 0) {
    grid.innerHTML = `<div class="news-empty">Nenhum post cadastrado ainda em posts.json.</div>`;
    return;
  }

  grid.innerHTML = posts.map(postCardHTML).join('');

  // Pede ao script do Instagram para processar os embeds recém-inseridos
  if (window.instgrm && window.instgrm.Embeds) {
    window.instgrm.Embeds.process();
  } else {
    // O embed.js pode ainda não ter carregado; tenta de novo em breve
    setTimeout(() => {
      if (window.instgrm && window.instgrm.Embeds) window.instgrm.Embeds.process();
    }, 1200);
  }
}

function postCardHTML(post) {
  const dataFormatada = formatDate(post.data);
  return `
    <article class="news-card">
      <div class="news-embed-holder">
        <blockquote class="instagram-media" data-instgrm-permalink="${escapeAttr(post.url)}" data-instgrm-version="14" style="width:100%; margin:0;">
          <div class="fallback">
            Carregando post do Instagram…<br>
            <a href="${escapeAttr(post.url)}" target="_blank" rel="noopener" style="text-decoration:underline;">Ver no Instagram</a>
          </div>
        </blockquote>
      </div>
      <div class="meta">
        <span class="tag">${escapeHTML(post.categoria || 'Notícia')}</span>
        <span class="date">${dataFormatada}</span>
      </div>
      <p class="cap">${escapeHTML(post.titulo || '')}</p>
    </article>
  `;
}

function formatDate(iso) {
  if (!iso) return '';
  const d = new Date(iso + 'T00:00:00');
  if (isNaN(d)) return iso;
  return d.toLocaleDateString('pt-BR', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
}

function escapeHTML(str) {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
function escapeAttr(str) {
  return escapeHTML(str).replace(/"/g, '&quot;');
}

document.addEventListener('DOMContentLoaded', loadPosts);

/* Menu mobile simples */
document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.querySelector('.nav-toggle');
  const nav = document.querySelector('.main-nav');
  if (!toggle || !nav) return;
  toggle.addEventListener('click', () => {
    const isOpen = nav.style.display === 'flex';
    nav.style.display = isOpen ? 'none' : 'flex';
    nav.style.flexDirection = 'column';
    nav.style.position = 'absolute';
    nav.style.top = '76px';
    nav.style.right = '24px';
    nav.style.background = '#121212';
    nav.style.border = '1px solid #2a2a2a';
    nav.style.padding = '16px 20px';
    nav.style.gap = '14px';
  });
});
