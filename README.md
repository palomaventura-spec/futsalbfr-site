# Futsal BFR — Categorias de Base

Site (projeto não-oficial) para as categorias de base do futsal do Botafogo,
inspirado visualmente em botafogo.com.br, com uma seção de notícias
alimentada pelos posts públicos do Instagram **@futsalbfr**.

## Arquivos

- `index.html` — estrutura da página (todas as seções)
- `styles.css` — identidade visual (preto/branco + trajetória das categorias)
- `script.js` — carrega `posts.json` e renderiza os embeds do Instagram
- `posts.json` — **lista de posts a exibir** (edite este arquivo para atualizar as notícias)

## Como testar localmente

Navegadores bloqueiam a leitura de `posts.json` quando você abre o
`index.html` direto com duplo-clique (protocolo `file://`). Rode um
servidor local simples na pasta do projeto:

```bash
python3 -m http.server 8000
```

Depois abra **http://localhost:8000** no navegador.

> **Porta já em uso?** Se você já usa a porta 8000 para outro projeto
> (ou o navegador não abrir), é só escolher outra porta:
>
> ```bash
> python3 -m http.server 8001
> ```
>
> E abrir **http://localhost:8001** no lugar. Qualquer número livre
> entre 1024 e 65535 funciona. Para checar se uma porta está livre
> antes de usar:
>
> ```bash
> lsof -i :8001
> ```
>
> Se não retornar nada, a porta está livre.

## Como atualizar as notícias (modo manual — sem acesso à conta)

O Instagram permite incorporar qualquer post público no seu site sem
precisar de login, senha ou permissão da conta. É esse recurso que o
site usa.

1. Abra o post público em `instagram.com/futsalbfr`
2. Copie o link do post (ex: `https://www.instagram.com/p/ABC123XYZ/`)
3. Abra `posts.json` e adicione um novo item **no topo** da lista `posts`:

```json
{
  "url": "https://www.instagram.com/p/ABC123XYZ/",
  "titulo": "Sub-15 vence a final estadual",
  "categoria": "Sub-15",
  "data": "2026-07-01"
}
```

4. Salve o arquivo. Ao recarregar a página, o post aparece automaticamente
   formatado e com o conteúdo oficial (foto, vídeo, legenda) direto do
   Instagram.

Não é necessário editar HTML ou CSS — só o `posts.json`.

## Upgrade futuro: atualização 100% automática

Quando (e se) vocês tiverem acesso à conta `@futsalbfr` como
Business/Creator vinculada a uma Página do Facebook, é possível trocar
a atualização manual por uma automática de verdade, usando a
**Instagram Graph API** (oficial, da Meta):

1. Transformar a conta em Business/Creator e vincular a uma Página do Facebook
2. Criar um app em developers.facebook.com e gerar um token de acesso de longa duração
3. Consultar periodicamente o endpoint `/{ig-user-id}/media` para obter os posts mais recentes
4. Gravar o resultado no mesmo formato usado em `posts.json`
   (`url`, `titulo`, `categoria`, `data`) — assim nada mais no site
   precisa mudar, só a origem dos dados

Isso normalmente é feito com uma função agendada (cron job / serverless
function) que roda a cada X horas e regrava o `posts.json` (ou um
endpoint equivalente), mantendo o restante do site intacto.

## Personalização pendente

Itens marcados com `[ ... ]` no site são placeholders reais que
precisam ser substituídos antes de publicar:

- Endereço e nome da sede de treinos
- Telefone / WhatsApp de contato
- E-mail de contato
- Mapa incorporado (Google Maps) na seção "Onde treinamos"
- Foto/vídeo na seção "Sobre"
- Dias e horários reais de treino de cada categoria
- Idades oficiais de corte de cada categoria (as usadas aqui são de referência)
