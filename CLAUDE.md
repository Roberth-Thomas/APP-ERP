# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

# EstudosAPP — regras do projeto

App de estudos (ensino médio + concurso + redação) para um adulto de 26 anos.
JS puro (sem módulos, sem build, sem npm), namespace global `window.App`, localStorage, PWA.
Publicado no Cloudflare Pages (https://estudos-rt.pages.dev), que publica sozinho a cada push na `main` (repositório privado).
O celular é o aparelho principal. Interface e comentários do código em pt-BR.

**Não mexer no projeto Bolt.** Este projeto é individual.

## Comandos
- Testes (todos): `node testes/validar.js`. É um script único, sem framework: cada `teste('nome', fn)` roda em ordem e o primeiro `assert` que falha para tudo.
  Não há filtro por nome; para isolar um teste, comente os outros temporariamente. Os testes da entrada também rodam sozinhos: `node testes/acesso.mjs`.
- Servidor local sem cache: `python .claude/servidor.py 8080 .` (ou `preview_start` com o nome `estudos`, em `.claude/launch.json`).
- Conferir a versão publicada sem login: `curl -s https://estudos-rt.pages.dev/sw.js | grep VERSAO`.

## Arquitetura
- **Ordem dos scripts importa.** `index.html` carrega tudo com `<script>` em sequência: `util.js` → dados (`js/dados/*`, `topicos/*`)
  → `armazenamento.js`/`calculos.js` → `componentes.js`/`caderno.js` → `nuvem.js` → telas → `app.js` por último. Os dados se juntam por
  `Object.assign(App.dados.conteudos, {...})`, então um arquivo de tópico precisa vir depois de `conteudos.js`.
- **Abas (barra de baixo)**: Hoje (`#hoje`) · Estudar (`#assuntos`) · Praticar (`#exercicios`) · Simulados (`#simulados`) · Eu (`#progresso`).
  Telas sem aba própria dizem qual acender com `aba` (ex.: redação/caderno → assuntos, enem → simulados, config → progresso).
  Visual das listas: classes `.tarefas`/`.tarefa` (linha com ícone, texto e ›), um só botão de destaque por tela, detalhes em `<details>`.
- **Roteador por hash** (`js/app.js`): `#nome/param` chama `App.telas[nome].render(el, param)`; a tela pode ter `sair()` (salvar pendências),
  `titulo` e `aba` (qual aba acende). Cada tela registra os ouvintes em `el.onclick/onchange/...`, que o roteador zera ao trocar de tela.
- **Estado único** em `App.store` (`js/armazenamento.js`): um objeto salvo em `localStorage['estudosapp:estado']`. Altere o objeto de
  `App.store.get()` e chame `App.store.salvar()`. `normalizar()` completa campos que faltam e acrescenta matérias novas; ao criar um campo
  novo no estado, inclua-o em `estadoInicial()` e em `normalizar()`. `js/nuvem.js` sincroniza esse estado com o Google Drive.
- **Assuntos**: `js/dados/assuntos.js` gera os ids `materia-fase-índice` (ex.: `ingles-1-0`); o conteúdo de estudo usa o mesmo id como chave.
  Mudar a ordem ou o título de uma lista já publicada quebra o progresso salvo (use `assuntosSubstituidos` para migrar).
- **Leitura** (`js/telas/estudar.js`): desenha os blocos do conteúdo (`etapa`, `texto`, `pergunta`, `checagem`, `tabela`, `codigo`, `escuta`...).
  Bloco novo exige um `case` em `bloco()` e o tipo na lista `tipos` de `testes/validar.js`.
- **Service worker** (`sw.js`): rede primeiro, cache só como reserva sem internet. `VERSAO` do `sw.js` e `VERSAO_PAGINA` do `index.html`
  andam juntas (o teste confere); a página apaga a cópia velha quando elas diferem. `/limpar` é a página de socorro que apaga a cópia offline.
- **Entrada**: `functions/_middleware.js` (Cloudflare Pages Function) protege todo o site. Só `PUBLICOS` (`js/acesso.js`, `sw.js`, `limpar`)
  passam sem login; `/_acesso/*` são as rotas de entrada.

## Como trabalhar
- **Um tópico por vez.** Refaça, mostre no navegador e espere a aprovação antes de seguir.
- Commit e push só quando o usuário pedir (ele diz "faça o commit e envie para o GitHub").
- Antes de commitar: `node testes/validar.js` (todos devem passar).
- Ao adicionar arquivo novo: incluir em `index.html` (ordem dos scripts), em `sw.js` (`ARQUIVOS`) e na lista de `testes/validar.js`.
  A cada publicação, subir `VERSAO` (sw.js) e `VERSAO_PAGINA` (index.html) juntas.
- Não pensar em Kindle/e-reader agora. Primeiro fazer funcionar no celular e no PC.
- Teste local: servidor sem cache na porta 8080 (configuração em `.claude/launch.json`).
- Não sujar o progresso do usuário (localStorage) em testes. Se mexer, restaure.

## Conteúdo (js/dados/conteudos.js e js/dados/topicos/<materia>.js)
- Português e Matemática ficam em `conteudos.js`. As outras matérias ficam cada uma em `js/dados/topicos/<materia>.js`, com textos, checagens extras e termos (`App.dados.adicionarTermos`).
- Seguir a **BNCC/MEC**, com os códigos oficiais conferidos. Resumos próprios + links oficiais/abertos. Nunca copiar apostilas.
- Formato `metodo: 'freire'`, com `prerequisitos`. Cada tópico usa o **jeito de explicar que combina com ele**, sem pressa, como se fosse do zero.
- Referências aos gostos do usuário (RPG, Zelda, Pokémon, hardware, IA, música, museus, anime) **só quando forem naturais**, nunca em tudo.
- **Não criar tirinhas.** Quadrinhos só livres de verdade (ex.: Agostini, domínio público), e só se fizer sentido. Mafalda/Calvin só como indicação, sem a imagem.
- Termos técnicos: `[[termo]]` ou `[[mostrado|chave]]`, e o termo precisa existir em `App.dados.glossarios` (js/dados/apoio.js) da matéria.
- Cada checagem precisa de variações em `js/dados/checagens.js` (conceito, `outraExplicacao`).

## Tópicos já aprovados no formato novo
- Português: Classes de palavras, Acentuação, Ortografia.

## Auditoria (feita em 2026-10-18, relatório em `docs/auditoria.md`)
- Todo tópico novo precisa ser **conferido** antes de ir para o usuário: fatos e datas com fontes confiáveis, todas as contas refeitas,
  cada gabarito de teste conferido e o texto de cada habilidade BNCC comparado palavra por palavra com o PDF oficial do MEC.
- Depois de conferir, acrescente o id em `App.dados.auditoria.topicos` (fim de `js/dados/conteudos.js`): a tela de estudo mostra o selo "✅ Conferido".
  Sem isso, o tópico aparece como "⚠️ Ainda não conferido".
- Os 17 tópicos com apostila já foram conferidos. Já não há tirinhas criadas no app.

## Próximos passos
1. Preencher as questões reais do ENEM (`js/dados/vestibular.js`, hoje vazio), conferindo cada uma no PDF e no gabarito do Inep.
   Provas inteiras como simulado ficam em `js/dados/simulados-enem.js` (só gabarito, páginas e tema da redação; o caderno é o PDF do Inep)
   e na tela `#enem` (js/telas/enem.js), aberta pela aba Simulados (js/telas/simulados.js; FUVEST aparece como "Em breve"). Já entrou: 2026, 1º dia, caderno Azul, interativo (certeza/chute/ver a correta/por quê).
   Explicações próprias conferidas nas 90 questões (e nas duas línguas). Falta o 2º dia, quando o arquivo estiver disponível.
2. Os demais tópicos de cada matéria, um por vez, com auditoria antes de mostrar.

## Correção por IA
- O prompt fica em `App.comp.pedidoDeCorrecao` (js/componentes.js): contexto do app, modo (estudo, prova, redacao, plano),
  momento do estudante (`momentoNoApp`, só desempenho) e duas etapas: modo socrático primeiro, correção completa depois.

## Entrada no site (Cloudflare Pages)
- `functions/_middleware.js` protege tudo: tela de entrada própria, cookie assinado de 30 dias, digital (passkey/WebAuthn)
  e usuário/senha como reserva. Sem banco: o passe da digital volta assinado (HMAC) para o celular (`js/acesso.js`).
- A senha fica só nas variáveis do Cloudflare (ACESSO_USUARIO / ACESSO_SENHA). Nunca no código.
- "Entrar com o Google": aparece quando ACESSO_EMAIL (texto) existe no Cloudflare; só essa conta entra.
  O servidor confere assinatura do Google, aud (cliente OAuth do Drive), iss, validade, e-mail verificado e nonce (desafio nosso).
- Testes da entrada: `testes/acesso.mjs` (rodam dentro de `node testes/validar.js`).

## Inglês e cursos de fora
- Inglês: objetivo é a **fluência** (dia a dia, trabalho/tecnologia, filmes/jogos, provas), 30 a 40 min por dia, sem obrigação.
  Trilha B1 → B2 → C1 em `js/dados/ingles-trilha.js` (unidades, vocabulário dos cartões, nivelamento) e tela `#ingles` (js/telas/ingles.js).
  As 12 unidades do B1 são os tópicos `ingles-*`; B2/C1 entram quando forem escritas. Apostilas em `js/dados/topicos/ingles.js`.
  Cada unidade: apostila Freire + vocabulário (cartões com revisão espaçada) + escuta (bloco `escuta`, voz do celular) + escrita + teste.
  **Conversação (fala) fica para depois**, por pedido do usuário. **Uma unidade por vez**, conferida e aprovada antes da próxima.
  Sempre escrito para o app. **Nunca copiar material de cursos pagos** (ex.: Hashtag Treinamentos).
- **Agentes de IA** (matéria `agentes`, `tipo: 'curso'`): curso livre escrito para o app a partir da grade pública do tecnólogo
  Agentes Inteligentes da FIAP (o usuário não é aluno; nunca usar material da FIAP). 12 unidades em `js/dados/assuntos.js`,
  apostilas em `js/dados/topicos/agentes.js`, sem BNCC, prática no Google Colab. Bloco `codigo` (com Copiar) para código.
  Curso livre fica fora de Exercícios e Provas até ter questões. **Uma unidade por vez**, conferida e aprovada antes da próxima.
- Planos de estudo dos três cursos da FIAP: `docs/planos-fiap.md` e `js/dados/planos-cursos.js` (planos prontos em #cursos).
- `#cursos` (js/telas/cursos.js): o usuário cadastra cursos de fora só com o nome das aulas e o link; marca aulas assistidas e anota no caderno.
