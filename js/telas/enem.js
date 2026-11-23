/* =========================================================
   telas/enem.js — simulado interativo com a prova inteira do ENEM
   Rotas:
     #enem          → escolher a prova, a língua e a parte (e ver os anteriores)
     #enem/fazer    → uma questão por vez, com o enunciado recortado do PDF oficial do Inep
     #enem/<id>     → resultado: acertos, certeza x chute e o que revisar
   Em cada questão há 4 botões: marcar com certeza, marcar chutando,
   ver a correta e "por que é a X?" (explicação própria ou pedido à IA).
   Depois de ver a correta, a questão fica travada (não dá para trocar).
   O simulado em andamento fica salvo (estado.enem.atual): dá para
   fechar o app e voltar. O relógio conta só com a tela aberta.
   A nota real do ENEM usa TRI; aqui aparece só o número de acertos.
   ========================================================= */
App.telas = App.telas || {};

App.telas.enem = (function () {
  const U = App.util;
  const D = App.dados;
  const LETRAS = ['A', 'B', 'C', 'D', 'E'];
  const LINGUAS = { ingles: 'Inglês', espanhol: 'Espanhol' };
  const CONFIANCA = { certeza: 'com certeza', chute: 'no chute' };
  const MIN_POR_QUESTAO = 3; // ritmo de referência quando a prova não é inteira

  let inicioTrecho = null; // quando começou o trecho de tempo atual (tela aberta)
  let relogio = null;      // setInterval que atualiza o tempo na tela
  let selecionada = null;  // letra tocada na questão atual, ainda sem certeza/chute
  let painel = '';         // 'porque' quando a explicação está aberta na questão atual

  /* ---------- Enunciado: recorte desenhado direto do PDF oficial do Inep ----------
     O Inep libera o PDF para outros sites (CORS). O pdf.js (cdnjs) baixa o caderno uma vez
     e desenha só o pedaço da página onde está a questão. Nada da prova fica no código do app. */
  const PDFJS = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/';
  let pdfjsPromessa = null;
  const documentos = {}; // url do caderno → promessa do PDF aberto
  const desenhos = {};   // "sim|lingua|n|largura" → canvases prontos (evita redesenhar a cada toque)

  function carregarPdfjs() {
    if (window.pdfjsLib) return Promise.resolve(window.pdfjsLib);
    if (!pdfjsPromessa) {
      pdfjsPromessa = new Promise((ok, erro) => {
        const s = document.createElement('script');
        s.src = PDFJS + 'pdf.min.js';
        s.onload = () => { window.pdfjsLib.GlobalWorkerOptions.workerSrc = PDFJS + 'pdf.worker.min.js'; ok(window.pdfjsLib); };
        s.onerror = () => { pdfjsPromessa = null; erro(new Error('pdf.js não carregou')); };
        document.head.appendChild(s);
      });
    }
    return pdfjsPromessa;
  }

  function abrirPdf(url) {
    if (!documentos[url]) {
      documentos[url] = carregarPdfjs().then((lib) => lib.getDocument({ url }).promise)
        .catch((e) => { delete documentos[url]; throw e; });
    }
    return documentos[url];
  }

  /** Desenha os recortes da questão n dentro de "alvo" (largura do cartão, nítido na tela do celular) */
  /**
   * Monta o enunciado: cada recorte (canvas) com as alternativas por cima, como áreas tocáveis.
   * marca: { escolha, certa, marcada, vista, tocavel } diz a cor de cada alternativa.
   */
  function montarEnunciado(alvo, sim, n, lingua, canvases, marca) {
    const rects = D.recorteEnem(sim, n, lingua);
    const alts = D.alternativasEnem(sim, n, lingua);
    const blocos = canvases.map((canvas, i) => {
      const [pag, , ry0, , ry1] = rects[i];
      const caixa = document.createElement('div');
      caixa.className = 'enem-recorte';
      caixa.appendChild(canvas);
      alts.forEach(([p, y0, y1], k) => {
        if (p !== pag || y0 < ry0 - 2 || y1 > ry1 + 2) return; // alternativa de outro recorte
        const l = LETRAS[k];
        let classe = '';
        if (marca.vista && l === marca.certa) classe = 'certa';
        else if (marca.vista && l === marca.marcada) classe = 'errada';
        else if (l === marca.escolha) classe = 'marcada';
        const area = document.createElement(marca.tocavel ? 'button' : 'span');
        area.className = 'enem-alt ' + classe;
        area.style.top = ((y0 - ry0) / (ry1 - ry0) * 100) + '%';
        area.style.height = ((y1 - y0) / (ry1 - ry0) * 100) + '%';
        if (marca.tocavel) {
          area.type = 'button';
          area.dataset.letra = l;
          area.disabled = !!marca.vista;
          area.setAttribute('aria-pressed', String(l === marca.escolha));
        }
        area.setAttribute('aria-label', 'Alternativa ' + l);
        caixa.appendChild(area);
      });
      return caixa;
    });
    alvo.replaceChildren(...blocos);
    // Com as alternativas tocáveis na imagem, a fileira de bolinhas A–E não é mais necessária
    const cartao = alvo.closest('.enem-questao');
    if (cartao && alts.length === 5) cartao.classList.add('com-areas');
  }

  async function mostrarEnunciado(alvo, sim, n, lingua, marca) {
    const rects = D.recorteEnem(sim, n, lingua);
    if (!alvo || !rects.length) return;
    marca = marca || {};
    const largura = Math.round(alvo.clientWidth || 320);
    const chave = [sim.id, lingua, n, largura].join('|');
    if (desenhos[chave]) { montarEnunciado(alvo, sim, n, lingua, desenhos[chave], marca); return; }
    alvo.innerHTML = '<p class="suave pequeno">Carregando o enunciado do caderno oficial…</p>';
    try {
      const pdf = await abrirPdf(sim.prova);
      const dpr = Math.min(window.devicePixelRatio || 1, 3);
      const canvases = [];
      for (const [pag, x0, y0, x1, y1] of rects) {
        const pagina = await pdf.getPage(pag);
        const escala = (largura * dpr) / (x1 - x0);
        const canvas = document.createElement('canvas');
        canvas.width = Math.round((x1 - x0) * escala);
        canvas.height = Math.round((y1 - y0) * escala);
        canvas.setAttribute('role', 'img');
        canvas.setAttribute('aria-label', `Questão ${n}, página ${pag} do caderno oficial`);
        await pagina.render({
          canvasContext: canvas.getContext('2d'),
          viewport: pagina.getViewport({ scale: escala }),
          transform: [1, 0, 0, 1, -x0 * escala, -y0 * escala],
        }).promise;
        canvases.push(canvas);
      }
      desenhos[chave] = canvases;
      if (alvo.isConnected) montarEnunciado(alvo, sim, n, lingua, canvases, marca);
    } catch (e) {
      if (alvo.isConnected) {
        alvo.innerHTML = `<p class="suave pequeno">Não consegui abrir o caderno agora (está sem internet?).
          Use o link "Abrir no caderno" acima.</p>`;
      }
    }
  }

  function simulado(id) { return D.simuladosEnem.find((s) => s.id === id); }

  /** Números das questões que entram nesta parte (1 a 90, ou uma área) */
  function questoes(sim, parte) {
    const areas = parte === 'tudo' ? sim.areas : sim.areas.filter((a) => a.id === parte);
    const lista = [];
    areas.forEach((a) => { for (let n = a.de; n <= a.ate; n++) lista.push(n); });
    return lista;
  }

  function areaDe(sim, n) { return sim.areas.find((a) => n >= a.de && n <= a.ate); }

  function nomeParte(sim, parte) {
    if (parte === 'tudo') return 'Prova inteira';
    return 'Só ' + sim.areas.find((a) => a.id === parte).curto;
  }

  function titulo(sim) { return `ENEM ${sim.ano} · ${sim.dia}º dia · caderno ${sim.caderno}`; }

  /** Tempo de referência em minutos: o oficial na prova inteira, 3 min por questão numa área só */
  function referencia(sim, parte) {
    return parte === 'tudo' ? sim.minutos : questoes(sim, parte).length * MIN_POR_QUESTAO;
  }

  function duracao(segundos) {
    const min = Math.floor(segundos / 60);
    return min < 60 ? min + ' min' : Math.floor(min / 60) + 'h' + String(min % 60).padStart(2, '0');
  }

  function num(n) { return String(n).padStart(2, '0'); }

  function linkPagina(sim, n, lingua, texto) {
    const pag = D.paginaEnem(sim, n, lingua);
    return `<a class="pequeno" href="${U.esc(sim.prova)}#page=${pag}" target="_blank" rel="noopener" title="Abrir o caderno na página ${pag}">${texto || 'pág. ' + pag}</a>`;
  }

  /** Campos novos em simulados salvos antes da versão interativa */
  function completar(s) {
    if (!s.confianca) s.confianca = {};
    if (!s.vistas) s.vistas = {};
    if (!Number.isInteger(s.pos)) s.pos = 0;
    return s;
  }

  /**
   * Corrige: acertos por área e no total, e o cruzamento certeza x chute.
   * vistas[n] === 'antes' = viu a correta sem ter marcado (conta como erro).
   */
  function corrigir(sim, s) {
    const nums = questoes(sim, s.parte);
    const conf = s.confianca || {};
    const vistas = s.vistas || {};
    const acertou = (n) => s.respostas[n] === D.gabaritoEnem(sim, n, s.lingua);
    const porArea = sim.areas.map((a) => {
      const daArea = nums.filter((n) => n >= a.de && n <= a.ate);
      return { area: a, total: daArea.length, acertos: daArea.filter(acertou).length };
    }).filter((x) => x.total);
    const grupos = { certezaCerta: [], certezaErrada: [], chuteCerto: [], chuteErrado: [], semMarcar: [], viuAntes: [] };
    nums.forEach((n) => {
      if (vistas[n] === 'antes') grupos.viuAntes.push(n);
      else if (!s.respostas[n]) grupos.semMarcar.push(n);
      else if (conf[n] === 'chute') grupos[acertou(n) ? 'chuteCerto' : 'chuteErrado'].push(n);
      else grupos[acertou(n) ? 'certezaCerta' : 'certezaErrada'].push(n); // sem marcação de confiança conta como certeza
    });
    const acertos = porArea.reduce((t, x) => t + x.acertos, 0);
    return { porArea, acertos, total: nums.length, brancos: grupos.semMarcar.length + grupos.viuAntes.length, grupos };
  }

  /** Pedido para a IA explicar a questão (a pessoa cola o enunciado copiado do PDF) */
  function pedidoExplicacao(sim, s, n) {
    const certa = D.gabaritoEnem(sim, n, s.lingua);
    const minha = s.respostas[n];
    const area = areaDe(sim, n);
    return [
      'Você vai ser meu professor particular. Tenho 26 anos e estou revisando o ensino médio para o ENEM e concursos, num app de estudos que eu mesmo fiz.',
      `Estou fazendo um simulado com a prova oficial do ENEM ${sim.ano}, ${sim.dia}º dia, caderno ${sim.caderno} (PDF do Inep: ${sim.prova} , página ${D.paginaEnem(sim, n, s.lingua)}).`,
      `Questão ${n} (${area.nome}${n <= 5 ? ', ' + LINGUAS[s.lingua] : ''}). O gabarito oficial é a letra ${certa}.`,
      minha ? `Eu marquei a letra ${minha}, ${CONFIANCA[(s.confianca || {})[n]] || 'com certeza'}.` : 'Eu ainda não tinha marcado nenhuma letra.',
      'Vou colar abaixo o enunciado e as alternativas, copiados do PDF. Se eu não tiver colado, peça antes de responder.',
      '\nExplique em português do Brasil, com linguagem simples, como se eu estivesse aprendendo do zero:',
      '1. O que a questão pede (o comando), em uma frase.',
      `2. Por que a ${certa} é a correta, apontando a pista no texto.`,
      '3. Por que cada uma das outras está errada, uma linha para cada.',
      minha && minha !== certa ? `4. Qual raciocínio provavelmente me levou à ${minha}, e como evitar essa armadilha.` : '4. Que armadilha a questão prepara para quem lê com pressa.',
      '5. Que conteúdo devo revisar para acertar questões parecidas.',
      '\nENUNCIADO E ALTERNATIVAS:\n"""\n(cole aqui)\n"""',
    ].join('\n');
  }

  /* ---------- Relógio ---------- */
  function acumular() {
    const s = App.store.get().enem.atual;
    if (s && inicioTrecho) {
      s.segundos += Math.round((Date.now() - inicioTrecho) / 1000);
      inicioTrecho = Date.now();
    }
  }
  if (typeof document !== 'undefined') { // nos testes (node) não há página
    document.addEventListener('visibilitychange', () => {
      if (location.hash !== '#enem/fazer') return;
      if (document.hidden) { acumular(); inicioTrecho = null; App.store.salvar(); }
      else if (!inicioTrecho) inicioTrecho = Date.now();
    });
  }
  function pararRelogio() {
    if (relogio) { clearInterval(relogio); relogio = null; }
  }

  /* ---------- Início ---------- */
  function telaInicio(el) {
    const estado = App.store.get();
    const atual = estado.enem.atual;
    const simAtual = atual && simulado(atual.sim);
    const opcoesProva = D.simuladosEnem.map((s) => `<option value="${s.id}">${U.esc(titulo(s))}</option>`).join('');
    const sim0 = D.simuladosEnem[0];
    const opcoesParte = [['tudo', `Inteira: 90 + redação (${duracao(sim0.minutos * 60)})`]]
      .concat(sim0.areas.map((a) => [a.id, `Só ${a.curto} (${a.ate - a.de + 1})`]))
      .map(([v, t]) => `<option value="${v}">${U.esc(t)}</option>`).join('');

    const anteriores = estado.enem.feitos.slice().reverse().map((f) => {
      const sim = simulado(f.sim);
      if (!sim) return '';
      const r = corrigir(sim, f);
      return `
        <a class="cartao linha entre" href="#enem/${U.esc(f.id)}" style="text-decoration:none;color:inherit">
          <div>
            <strong>${U.esc(titulo(sim))}</strong>
            <div class="suave pequeno">${U.dataCurta(U.lerISO(f.data))} · ${U.esc(nomeParte(sim, f.parte))} · ${r.acertos}/${r.total} acertos · ${duracao(f.segundos)}</div>
          </div>
          <span class="botao pequeno">Ver</span>
        </a>`;
    }).join('');

    el.innerHTML = `
      <section class="cartao">
        <a href="#exercicios" class="pequeno">← Exercícios</a>
        <h1 style="margin-top:.6rem">Simulado ENEM</h1>
        <p class="suave">A prova é a oficial do Inep: cada questão aparece aqui, recortada do caderno em PDF. Responda uma por vez:
          marque a letra <strong>com certeza</strong> ou <strong>no chute</strong>, veja a correta quando quiser e peça a explicação.
          No fim, o app mostra onde a sua certeza falhou e o que revisar.</p>
      </section>
      ${simAtual ? `
        <section class="cartao destaque">
          <h2>Simulado em andamento</h2>
          <p>${U.esc(titulo(simAtual))} · ${U.esc(nomeParte(simAtual, atual.parte))} · ${LINGUAS[atual.lingua]}</p>
          <p class="pequeno">${Object.keys(atual.respostas).length} de ${questoes(simAtual, atual.parte).length} marcadas · ${duracao(atual.segundos)} de prova</p>
          <div class="linha">
            <a class="botao primario" href="#enem/fazer">Continuar</a>
            <button class="botao perigo" data-acao="descartar">Descartar</button>
          </div>
        </section>` : `
        <section class="cartao">
          <h2>Começar um simulado</h2>
          <form id="enem-novo" class="enem-form">
            <label>Prova <select name="sim">${opcoesProva}</select></label>
            <label>Parte <select name="parte">${opcoesParte}</select></label>
            <label>Língua estrangeira (questões 1 a 5) <select name="lingua">
              <option value="ingles">Inglês</option><option value="espanhol">Espanhol</option></select></label>
            <p class="suave pequeno" style="margin:0">Dica: deixe o PDF aberto numa aba (ou no PC) e o app no celular.
              O relógio conta só com esta tela aberta, e você pode sair e voltar sem perder nada.</p>
            <button class="botao primario" type="submit">Começar</button>
          </form>
        </section>`}
      ${anteriores ? `<h2 style="margin:1rem 0 .5rem">Simulados feitos</h2>${anteriores}` : ''}`;
  }

  /* ---------- Uma questão por vez ---------- */
  function painelPorque(sim, s, n) {
    const texto = D.explicacaoEnem(sim, n, s.lingua);
    return `
      <div class="explicacao">
        <strong>Por que é a ${D.gabaritoEnem(sim, n, s.lingua)}?</strong>
        ${texto
          ? `<p style="margin:.4rem 0 0">${App.comp.formatar(texto)}</p>
             <p class="suave pequeno" style="margin:.6rem 0 .3rem">Ainda com dúvida? Pergunte a uma IA (cole o enunciado do PDF lá):</p>`
          : `<p class="suave pequeno" style="margin:.4rem 0 .3rem">Ainda não escrevi a explicação desta questão.
             Uma IA pode explicar: o pedido vai pronto, com a questão, o gabarito e a sua resposta. Lá, cole o enunciado copiado do PDF.</p>`}
        ${App.comp.botoesCorrecao(`data-explicar="${n}"`)}
        <div data-saida-ia></div>
      </div>`;
  }

  function cartaoQuestao(sim, s, nums) {
    const n = nums[s.pos];
    const certa = D.gabaritoEnem(sim, n, s.lingua);
    const marcada = s.respostas[n];
    const vista = !!s.vistas[n];
    const escolha = selecionada || marcada;
    const letras = LETRAS.map((l) => {
      let classe = '';
      if (vista && l === certa) classe = 'certa';
      else if (vista && l === marcada) classe = 'errada';
      else if (l === escolha) classe = 'marcada';
      return `<button type="button" class="enem-letra ${classe}" data-letra="${l}" aria-pressed="${l === escolha}" ${vista ? 'disabled' : ''} aria-label="Letra ${l}">${l}</button>`;
    }).join('');
    let situacao;
    if (vista) situacao = marcada ? `Você marcou ${marcada} ${CONFIANCA[s.confianca[n]] || ''}.` : 'Você viu a correta antes de marcar.';
    else if (selecionada && selecionada !== marcada) situacao = `Letra <strong>${selecionada}</strong> escolhida: agora diga se tem certeza ou se está chutando.`;
    else if (marcada) situacao = `Você marcou <strong>${marcada}</strong> ${CONFIANCA[s.confianca[n]] || ''}.`;
    else situacao = 'Toque numa alternativa.';
    let saida = '';
    if (vista) {
      saida = `<div class="explicacao"><strong>${!marcada ? 'Resposta correta: ' + certa
        : marcada === certa ? '✓ Acertou! A correta é a ' + certa : '✕ Errou. A correta é a ' + certa}</strong></div>`;
      if (painel === 'porque') saida += painelPorque(sim, s, n);
    }
    const area = areaDe(sim, n);
    return `
      <section class="cartao enem-questao">
        <div class="linha entre">
          <h2 style="margin:0">Questão ${num(n)}</h2>
          ${linkPagina(sim, n, s.lingua, 'Abrir no caderno (pág. ' + D.paginaEnem(sim, n, s.lingua) + ') ↗')}
        </div>
        <div class="suave pequeno">${U.esc(area.curto)}${n <= 5 ? ' · ' + LINGUAS[s.lingua] : ''} · toque na alternativa para escolher</div>
        <div class="enem-enunciado" data-enunciado="${n}"></div>
        <div class="enem-letras grande" role="group" aria-label="Alternativas">${letras}</div>
        <p class="pequeno" style="margin:.2rem 0 .6rem">${situacao}</p>
        <div class="enem-acoes">
          <button type="button" class="botao primario" data-acao="certeza" ${vista ? 'disabled' : ''}>✔ Tenho certeza</button>
          <button type="button" class="botao" data-acao="chute" ${vista ? 'disabled' : ''}>🎲 Estou chutando</button>
          <button type="button" class="botao" data-acao="ver" ${vista ? 'disabled' : ''}>👁 Ver a correta</button>
          <button type="button" class="botao" data-acao="porque">💡 Por que é a ${vista ? certa : 'correta'}?</button>
        </div>
        ${saida}
        <div class="linha entre" style="margin-top:.8rem">
          <button type="button" class="botao pequeno" data-acao="anterior" ${s.pos === 0 ? 'disabled' : ''}>← Anterior</button>
          <span class="suave pequeno">${s.pos + 1} de ${nums.length}</span>
          <button type="button" class="botao pequeno ${marcada || vista ? 'primario' : ''}" data-acao="proxima" ${s.pos === nums.length - 1 ? 'disabled' : ''}>Próxima →</button>
        </div>
      </section>`;
  }

  /** Mapa com todas as questões, para pular para qualquer uma */
  function mapa(s, nums) {
    const botoes = nums.map((n, i) => {
      let classe = '';
      if (s.vistas[n] === 'antes') classe = 'vista';
      else if (s.respostas[n]) classe = s.confianca[n] === 'chute' ? 'chute' : 'certeza';
      return `<button type="button" class="enem-mapa-q ${classe} ${i === s.pos ? 'atual' : ''}" data-ir="${i}" aria-label="Ir para a questão ${n}">${num(n)}</button>`;
    }).join('');
    return `
      <details class="cartao enem-mapa">
        <summary><strong>Mapa da prova</strong> <span class="suave pequeno">(azul = certeza, amarelo = chute, cinza = viu antes de marcar)</span></summary>
        <div class="enem-mapa-grade">${botoes}</div>
      </details>`;
  }

  function telaFazer(el) {
    const estado = App.store.get();
    const s = estado.enem.atual;
    const sim = s && simulado(s.sim);
    if (!sim) { location.hash = '#enem'; return; }
    completar(s);
    const nums = questoes(sim, s.parte);
    s.pos = Math.min(Math.max(0, s.pos), nums.length - 1);
    const temRedacao = sim.redacao && (s.parte === 'tudo' || s.parte === 'linguagens');
    const redacao = !temRedacao ? '' : `
      <details class="cartao">
        <summary><strong>Redação</strong> <span class="suave pequeno">(tema e textos motivadores)</span></summary>
        <p>Tema: <strong>${U.esc(sim.redacao.tema)}</strong></p>
        <p class="suave pequeno">Os textos motivadores estão na página ${sim.redacao.pagina} do caderno. Escreva no papel ou na tela Redação do app.</p>
        <div class="linha">
          <a class="botao pequeno" href="${U.esc(sim.prova)}#page=${sim.redacao.pagina}" target="_blank" rel="noopener">Ver a proposta (pág. ${sim.redacao.pagina})</a>
          <button class="botao pequeno" data-acao="redacao">Escrever na tela Redação</button>
        </div>
      </details>`;

    el.innerHTML = `
      <section class="cartao enem-topo">
        <div class="linha entre">
          <strong>${U.esc(titulo(sim))}</strong>
          <span class="selo info" id="enem-tempo"></span>
        </div>
        <div class="suave pequeno">${U.esc(nomeParte(sim, s.parte))} · ${LINGUAS[s.lingua]} · <span id="enem-contagem"></span></div>
        <div class="linha" style="margin-top:.5rem">
          <a class="botao pequeno" href="${U.esc(sim.prova)}" target="_blank" rel="noopener">Caderno (PDF do Inep)</a>
          <a class="botao pequeno" href="#enem">Pausar</a>
          <button class="botao pequeno primario" data-acao="entregar">Entregar</button>
        </div>
      </section>
      ${cartaoQuestao(sim, s, nums)}
      ${mapa(s, nums)}
      ${redacao}`;

    const ref = referencia(sim, s.parte);
    const atualizar = () => {
      const seg = s.segundos + (inicioTrecho ? Math.round((Date.now() - inicioTrecho) / 1000) : 0);
      const t = el.querySelector('#enem-tempo');
      const c = el.querySelector('#enem-contagem');
      if (!t || !c) return;
      t.textContent = `${duracao(seg)} de ${duracao(ref * 60)}`;
      t.className = 'selo ' + (seg > ref * 60 ? 'alerta' : 'info');
      c.textContent = `${Object.keys(s.respostas).length} de ${nums.length} marcadas`;
    };
    if (!inicioTrecho && !document.hidden) inicioTrecho = Date.now();
    atualizar();
    relogio = setInterval(atualizar, 15000);
    const n = nums[s.pos];
    mostrarEnunciado(el.querySelector('[data-enunciado]'), sim, n, s.lingua, {
      escolha: selecionada || s.respostas[n], marcada: s.respostas[n], certa: D.gabaritoEnem(sim, n, s.lingua),
      vista: !!s.vistas[n], tocavel: true,
    });
  }

  /* ---------- Resultado ---------- */
  function itemRevisar(sim, f, n, rotulo) {
    const certa = D.gabaritoEnem(sim, n, f.lingua);
    const texto = D.explicacaoEnem(sim, n, f.lingua);
    return `
      <li>
        <details class="enem-revisar">
          <summary><span class="enem-num">${num(n)}</span>
            ${f.respostas[n] ? `Você: <strong class="${f.respostas[n] === certa ? 'enem-certa' : 'enem-errada'}">${f.respostas[n]}</strong> ·` : ''}
            Gabarito: <strong class="enem-certa">${certa}</strong> <span class="suave pequeno">${rotulo}</span></summary>
          <p class="pequeno" style="margin:.4rem 0">${linkPagina(sim, n, f.lingua, 'Reler no caderno (pág. ' + D.paginaEnem(sim, n, f.lingua) + ') ↗')}</p>
          <div class="enem-enunciado" data-enunciado="${n}"></div>
          ${texto ? `<p style="margin:.2rem 0 .5rem">${App.comp.formatar(texto)}</p>` : '<p class="suave pequeno">Explicação ainda não escrita. Peça a uma IA (cole o enunciado lá):</p>'}
          ${App.comp.botoesCorrecao(`data-explicar="${n}"`)}
          <div data-saida-ia></div>
        </details>
      </li>`;
  }

  function telaResultado(el, id) {
    const estado = App.store.get();
    const f = estado.enem.feitos.find((x) => x.id === id);
    const sim = f && simulado(f.sim);
    if (!sim) { el.innerHTML = '<section class="cartao"><p>Simulado não encontrado.</p><a class="botao" href="#enem">Voltar</a></section>'; return; }
    completar(f);
    const r = corrigir(sim, f);
    const g = r.grupos;
    const areas = r.porArea.map((x) => {
      const pct = U.porcentagem(x.acertos, x.total);
      return `
        <div class="item-barra">
          <div class="linha entre"><span>${U.esc(x.area.nome)}</span><strong>${x.acertos}/${x.total} · ${pct}%</strong></div>
          <div class="barra grossa"><div style="width:${pct}%"></div></div>
        </div>`;
    }).join('');
    const quadro = [
      ['Certeza e acertou', g.certezaCerta.length, 'ok', 'Você domina.'],
      ['Certeza e errou', g.certezaErrada.length, 'erro', 'Falsa certeza: revise primeiro.'],
      ['Chute e acertou', g.chuteCerto.length, 'alerta', 'Sorte: revise também.'],
      ['Chute e errou', g.chuteErrado.length, 'alerta', 'Ponto fraco que você já conhecia.'],
      ['Sem marcar ou viu antes', g.semMarcar.length + g.viuAntes.length, 'info', 'Contam como erro.'],
    ].map(([nome, qtd, cor, dica]) => `
      <div class="enem-quadro-item">
        <span class="selo ${cor}">${qtd}</span>
        <div><strong>${nome}</strong><div class="suave pequeno">${dica}</div></div>
      </div>`).join('');
    const revisar = [
      ...g.certezaErrada.map((n) => itemRevisar(sim, f, n, 'certeza, errou')),
      ...g.chuteCerto.map((n) => itemRevisar(sim, f, n, 'chute, acertou')),
      ...g.chuteErrado.map((n) => itemRevisar(sim, f, n, 'chute, errou')),
      ...g.semMarcar.map((n) => itemRevisar(sim, f, n, 'sem marcar')),
      ...g.viuAntes.map((n) => itemRevisar(sim, f, n, 'viu antes de marcar')),
    ];

    el.innerHTML = `
      <section class="cartao">
        <a href="#enem" class="pequeno">← Simulado ENEM</a>
        <h1 style="margin-top:.6rem">${r.acertos} de ${r.total} acertos</h1>
        <p class="suave">${U.esc(titulo(sim))} · ${U.esc(nomeParte(sim, f.parte))} · ${LINGUAS[f.lingua]} · ${U.dataCurta(U.lerISO(f.data))}</p>
        <p>Tempo: <strong>${duracao(f.segundos)}</strong> (referência: ${duracao(referencia(sim, f.parte) * 60)})</p>
        ${areas}
        <p class="suave pequeno">A nota oficial do ENEM usa a TRI, que pesa cada questão pela dificuldade: com o mesmo número de acertos, a nota pode mudar. Aqui fica só a contagem.</p>
        <a class="pequeno" href="${U.esc(sim.gabaritoUrl)}" target="_blank" rel="noopener">Gabarito oficial do Inep ↗</a>
      </section>
      <section class="cartao">
        <h2>Certeza x chute</h2>
        <div class="enem-quadro">${quadro}</div>
      </section>
      <section class="cartao">
        <h2>Para revisar (${revisar.length})</h2>
        ${revisar.length ? `<p class="suave pequeno">Na ordem do que mais importa. Toque numa questão para ver a explicação.</p>
          <ul class="enem-folha">${revisar.join('')}</ul>` : '<p>Nada para revisar: só acertos com certeza. 🎉</p>'}
      </section>
      <section class="cartao">
        <button class="botao perigo pequeno" data-acao="apagar" data-id="${U.esc(f.id)}">Apagar este simulado</button>
      </section>`;
  }

  function render(el, param) {
    const estado = App.store.get();
    pararRelogio();
    // O roteador só chama sair() ao trocar de tela; dentro de #enem (ex.: Pausar) o tempo fecha aqui
    if (param !== 'fazer' && inicioTrecho) { acumular(); inicioTrecho = null; App.store.salvar(); }
    if (param === 'fazer') telaFazer(el);
    else if (param) telaResultado(el, param);
    else telaInicio(el);

    /** Redesenha a questão atual sem perder a rolagem */
    function redesenhar() {
      const y = window.scrollY;
      render(el, param);
      window.scrollTo(0, y);
    }
    function irPara(pos) {
      estado.enem.atual.pos = pos;
      selecionada = null;
      painel = '';
      App.store.salvar();
      render(el, param);
      window.scrollTo(0, 0);
    }

    el.onsubmit = (ev) => {
      if (ev.target.id !== 'enem-novo') return;
      ev.preventDefault();
      const f = ev.target;
      estado.enem.atual = { sim: f.sim.value, parte: f.parte.value, lingua: f.lingua.value, respostas: {}, confianca: {}, vistas: {},
        pos: 0, segundos: 0, inicio: U.iso(U.hoje()) };
      selecionada = null;
      painel = '';
      App.store.salvar();
      inicioTrecho = null;
      location.hash = '#enem/fazer';
    };

    el.onclick = (ev) => {
      // Pedir explicação a uma IA (direto do clique, senão o navegador bloqueia a nova aba)
      const ia = ev.target.closest('[data-explicar]');
      if (ia) {
        const s = param === 'fazer' ? estado.enem.atual : estado.enem.feitos.find((x) => x.id === param);
        const saida = ia.closest('.explicacao, .enem-revisar').querySelector('[data-saida-ia]');
        App.comp.enviarParaIA(ia.dataset.ia, pedidoExplicacao(simulado(s.sim), completar(s), Number(ia.dataset.explicar)))
          .then((html) => { saida.innerHTML = html; });
        return;
      }
      // Resultado: ao abrir uma questão para revisar, desenha o enunciado dela
      const resumo = ev.target.closest('.enem-revisar > summary');
      if (resumo) {
        const f = estado.enem.feitos.find((x) => x.id === param);
        const caixa = resumo.parentElement.querySelector('[data-enunciado]');
        const q = Number(caixa.dataset.enunciado);
        const sim = simulado(f.sim);
        const marca = { marcada: f.respostas[q], certa: D.gabaritoEnem(sim, q, f.lingua), vista: true, tocavel: false };
        setTimeout(() => { if (resumo.parentElement.open) mostrarEnunciado(caixa, sim, q, f.lingua, marca); }, 0);
        return;
      }
      const letra = ev.target.closest('[data-letra]');
      if (letra) { selecionada = letra.dataset.letra; redesenhar(); return; }
      const ir = ev.target.closest('[data-ir]');
      if (ir) { irPara(Number(ir.dataset.ir)); return; }

      const acao = ev.target.closest('[data-acao]');
      if (!acao) return;
      const tipo = acao.dataset.acao;
      const s = estado.enem.atual;
      const sim = s && simulado(s.sim);
      const n = sim && questoes(sim, s.parte)[s.pos];

      if (tipo === 'certeza' || tipo === 'chute') {
        const l = selecionada || s.respostas[n];
        if (!l) { U.aviso('Toque numa alternativa primeiro'); return; }
        s.respostas[n] = l;
        s.confianca[n] = tipo;
        selecionada = null;
        acumular();
        App.store.salvar();
        redesenhar();
      } else if (tipo === 'ver' || tipo === 'porque') {
        if (!s.vistas[n]) {
          // Letra escolhida, mas sem certeza/chute: fica marcada com certeza antes de mostrar
          if (selecionada) { s.respostas[n] = selecionada; s.confianca[n] = 'certeza'; }
          s.vistas[n] = s.respostas[n] ? 'depois' : 'antes';
        }
        selecionada = null;
        if (tipo === 'porque') painel = 'porque';
        acumular();
        App.store.salvar();
        redesenhar();
      } else if (tipo === 'anterior') irPara(s.pos - 1);
      else if (tipo === 'proxima') irPara(s.pos + 1);
      else if (tipo === 'descartar') {
        if (!confirm('Descartar o simulado em andamento? As respostas marcadas serão perdidas.')) return;
        estado.enem.atual = null;
        App.store.salvar();
        render(el, param);
      } else if (tipo === 'entregar') {
        const brancos = questoes(sim, s.parte).filter((q) => !s.respostas[q]).length;
        if (!confirm(brancos ? `Ainda há ${brancos} questões sem marcar. Entregar assim mesmo?` : 'Entregar e ver o resultado?')) return;
        acumular();
        inicioTrecho = null;
        const feito = { id: U.novoId(), sim: s.sim, parte: s.parte, lingua: s.lingua, respostas: s.respostas,
          confianca: s.confianca, vistas: s.vistas, segundos: s.segundos, data: U.iso(U.hoje()) };
        estado.enem.feitos.push(feito);
        estado.enem.atual = null;
        selecionada = null;
        painel = '';
        App.store.salvar();
        location.hash = '#enem/' + feito.id;
      } else if (tipo === 'redacao') {
        const r = estado.rascunho;
        if (r.texto.trim() && r.tema !== sim.redacao.tema &&
          !confirm('Você tem um rascunho de redação com outro tema. Trocar o tema? (o texto continua lá)')) return;
        r.tema = sim.redacao.tema;
        App.store.salvar();
        location.hash = '#redacao';
      } else if (tipo === 'apagar') {
        if (!confirm('Apagar este simulado do histórico?')) return;
        estado.enem.feitos = estado.enem.feitos.filter((x) => x.id !== acao.dataset.id);
        App.store.salvar();
        location.hash = '#enem';
      }
    };
  }

  /** Ao sair da tela: guarda o tempo e para o relógio */
  function sair() {
    acumular();
    inicioTrecho = null;
    selecionada = null;
    pararRelogio();
    App.store.salvar();
  }

  return { render, sair, titulo: 'Simulado ENEM', aba: 'exercicios', questoes, corrigir, pedidoExplicacao };
})();
