/* =========================================================
   telas/simulados.js — aba Simulados: provas inteiras de vestibular
   (ENEM pronto; FUVEST quando a prova entrar no app; SISU usa a nota do ENEM)
   Rota: #simulados
   ========================================================= */
App.telas = App.telas || {};

App.telas.simulados = (function () {
  const U = App.util;
  const D = App.dados;

  const ICONES = {
    relogio: '<circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2.5M9 2h6"/>',
    prova: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>',
    escola: '<path d="M2 9l10-5 10 5-10 5z"/><path d="M6 11v5c3 2 9 2 12 0v-5"/>',
    lista: '<path d="M9 6h11M9 12h11M9 18h11M4 6h.01M4 12h.01M4 18h.01"/>'
  };
  const svg = (ic) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONES[ic]}</svg>`;

  /** Linha de lista; sem `href` vira só informação (sem toque) */
  function linha(ic, titulo, sub, href, selo) {
    const miolo = `
        <span class="tarefa-icone">${svg(ic)}</span>
        <span class="tarefa-texto"><strong>${titulo}</strong>${sub ? `<small>${sub}</small>` : ''}</span>
        ${selo || ''}${href ? '<span class="tarefa-seta" aria-hidden="true">›</span>' : ''}`;
    return href
      ? `<li class="tarefa"><a href="${href}">${miolo}</a></li>`
      : `<li class="tarefa tarefa-info"><div>${miolo}</div></li>`;
  }

  function render(el) {
    const estado = App.store.get();
    const enem = estado.enem || { atual: null, feitos: [] };
    const provas = D.simuladosEnem || [];
    const sim = provas[0];
    const ultimo = enem.feitos[enem.feitos.length - 1];
    let ultimoTexto = '';
    if (ultimo) {
      const s = provas.find((x) => x.id === ultimo.sim);
      if (s) {
        const r = App.telas.enem.corrigir(s, ultimo);
        ultimoTexto = `Último: ${r.acertos} de ${r.total} acertos · ${U.dataCurta(U.lerISO(ultimo.data))}`;
      }
    }

    const destaque = sim ? `
      <section class="cartao destaque hoje-topo">
        <div class="hoje-data">ENEM ${sim.ano} · ${sim.dia}º dia · caderno ${U.esc(sim.caderno)}</div>
        <h2 style="margin:.2rem 0">${enem.atual ? 'Simulado em andamento' : 'Prova inteira do ENEM'}</h2>
        <p class="hoje-sub">${enem.atual ? `${Object.keys(enem.atual.respostas || {}).length} de ${App.telas.enem.questoes(sim, enem.atual.parte).length} questões marcadas` : (ultimoTexto || 'Cronometrada, com certeza ou chute em cada questão')}</p>
        <a class="botao primario hoje-principal-botao" href="${enem.atual ? '#enem/fazer' : '#enem'}">${enem.atual ? 'Continuar' : 'Começar'}</a>
      </section>` : '';

    const qtdSoltas = (D.vestibular || []).length;
    el.innerHTML = `
      <div class="estudar">
        <h1 class="estudar-h1">Simulados</h1>
        ${destaque}

        <h2 class="hoje-titulo estudar-grupo">ENEM</h2>
        <ul class="tarefas cartao estudar-atalhos">
          ${linha('relogio', 'Provas e resultados', `${provas.length} prova(s) no app${enem.feitos.length ? ` · ${enem.feitos.length} feita(s)` : ''}`, '#enem')}
          ${qtdSoltas ? linha('lista', 'Questões soltas', qtdSoltas + ' questões reais', '#vestibular') : ''}
        </ul>

        <h2 class="hoje-titulo estudar-grupo">FUVEST</h2>
        <ul class="tarefas cartao estudar-atalhos">
          ${linha('prova', '1ª fase', '90 questões', null, '<span class="selo info">Em breve</span>')}
        </ul>

        <h2 class="hoje-titulo estudar-grupo">SISU</h2>
        <ul class="tarefas cartao estudar-atalhos">
          ${linha('escola', 'Usa a nota do ENEM', 'Sem prova própria: treine com o ENEM', '#enem')}
        </ul>
      </div>`;
  }

  return { render, titulo: 'Simulados' };
})();
