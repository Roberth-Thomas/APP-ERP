/* =========================================================
   telas/progresso.js — porcentagens, ritmo, acertos e calendário
   ========================================================= */
App.telas = App.telas || {};

App.telas.progresso = (function () {
  const U = App.util;
  const D = App.dados;
  let deslocamentoMes = 0; // 0 = mês atual, -1 = mês anterior...

  function barra(rotulo, feitos, total, extra = '') {
    const pct = U.porcentagem(feitos, total);
    return `
      <div class="item-barra">
        <div class="linha"><span>${rotulo}</span><span><strong>${pct}%</strong> <span class="suave pequeno">${feitos}/${total}${extra}</span></span></div>
        <div class="barra"><div style="width:${pct}%"></div></div>
      </div>`;
  }

  function cartaoRitmo(estado) {
    const fase = App.calc.faseAtual(estado);
    const r = App.calc.ritmo(estado);
    let titulo;
    if (fase === 0) titulo = 'O plano ainda não começou';
    else if (fase === 4) titulo = 'Os 6 meses do plano terminaram';
    else titulo = `Você está na fase ${fase} (${fase}º ano) — mês ${App.calc.mesAtual(estado)} de 6`;

    const selo = r.status === 'adiantado' ? `<span class="selo ok">Adiantado em ${r.diferenca} assunto(s)</span>`
      : r.status === 'atrasado' ? `<span class="selo info">No seu ritmo</span>
          <span class="suave pequeno">A referência de 6 meses previa ${Math.abs(r.diferenca)} assunto(s) a mais até hoje. É só um guia, não uma cobrança: siga quando puder.</span>`
      : '<span class="selo info">Em dia</span>';

    const fases = D.fases.map((f) => {
      const p = App.calc.progressoAssuntos(estado, null, f.numero);
      const { ini, fim } = App.calc.periodoFase(estado, f.numero);
      const periodo = ` · ${U.dataCurta(ini)} a ${U.dataCurta(U.somarDias(fim, -1))}`;
      return barra(`${f.nome} <span class="suave pequeno">(${f.descricao.split('·')[1].trim()})</span>`, p.feitos, p.total, periodo);
    }).join('');

    return `
      <details class="cartao hoje-semana">
        <summary>Fases do plano</summary>
        <p style="margin:.6rem 0 .3rem"><strong>${titulo}</strong></p>
        <p>${selo}</p>
        <p class="suave pequeno">Pelo calendário, até hoje seriam cerca de <strong>${r.esperado}</strong> assuntos. Você estudou <strong>${r.feitos}</strong>. (Margem de 10% conta como "em dia".)</p>
        <div class="grade">${fases}</div>
      </details>`;
  }

  function calendario(estado) {
    const base = U.hoje();
    const primeiro = new Date(base.getFullYear(), base.getMonth() + deslocamentoMes, 1);
    const diasNoMes = new Date(primeiro.getFullYear(), primeiro.getMonth() + 1, 0).getDate();
    const nomeMes = primeiro.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })
      .replace(/^./, (c) => c.toUpperCase());
    const hojeISO = U.iso(base);

    let celulas = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].map((d) => `<div class="cab">${d}</div>`).join('');
    for (let i = 0; i < primeiro.getDay(); i++) celulas += '<div class="dia vazio"></div>';
    let estudados = 0;
    for (let d = 1; d <= diasNoMes; d++) {
      const data = new Date(primeiro.getFullYear(), primeiro.getMonth(), d);
      const chave = U.iso(data);
      const estudou = Boolean(estado.diasConcluidos[chave]);
      if (estudou) estudados++;
      const classes = ['dia', estudou ? 'estudou' : '', data.getDay() === 0 ? 'domingo' : '', chave === hojeISO ? 'hoje' : ''].join(' ');
      celulas += `<div class="${classes}" title="${U.dataCurta(data)}${estudou ? ' — estudou' : ''}">${d}</div>`;
    }

    return `
      <section class="cartao">
        <div class="linha entre">
          <h2 style="margin:0">Dias de estudo</h2>
          <div class="linha">
            <button class="botao pequeno" data-mes="-1" aria-label="Mês anterior">‹</button>
            <span style="min-width:9rem;text-align:center">${nomeMes}</span>
            <button class="botao pequeno" data-mes="1" aria-label="Próximo mês" ${deslocamentoMes >= 0 ? 'disabled' : ''}>›</button>
          </div>
        </div>
        <div class="calendario" style="margin-top:.8rem" aria-label="${estudados} dia(s) estudados neste mês">${celulas}</div>
      </section>`;
  }

  function render(el) {
    const estado = App.store.get();
    const geral = App.calc.progressoAssuntos(estado);
    const ritmo = App.calc.ritmo(estado);
    const textoRitmo = ritmo.status === 'adiantado' ? 'Adiantado' : ritmo.status === 'atrasado' ? 'No seu ritmo' : 'Em dia';
    const hoje = U.hoje();
    const mesISO = U.iso(hoje).slice(0, 7);
    const diasMes = Object.keys(estado.diasConcluidos).filter((k) => estado.diasConcluidos[k] && k.startsWith(mesISO)).length;
    let certas = 0, respondidas = 0;
    Object.values(estado.respostas || {}).forEach((r) => { certas += r.acertos || 0; respondidas += r.total || 0; });

    const porMateria = D.materias.map((m) => {
      const p = App.calc.progressoAssuntos(estado, m.id);
      return barra(`${U.esc(m.nome)}`, p.feitos, p.total);
    }).join('');

    const acertos = D.materias.map((m) => {
      const r = estado.respostas[m.id];
      return r && r.total ? barra(`${U.esc(m.nome)}`, r.acertos, r.total, ' acertos') : '';
    }).join('');

    el.innerHTML = `
      <div class="estudar">
        <h1 class="estudar-h1">Eu</h1>

        <section class="cartao eu-resumo">
          <div><span class="numero">${geral.pct}%</span><span class="suave pequeno">dos assuntos</span></div>
          <div><span class="numero">${diasMes}</span><span class="suave pequeno">dias neste mês</span></div>
          <div><span class="numero">${respondidas ? U.porcentagem(certas, respondidas) + '%' : '—'}</span><span class="suave pequeno">de acertos</span></div>
          <p class="eu-ritmo"><span class="selo ${ritmo.status === 'adiantado' ? 'ok' : 'info'}">${textoRitmo}</span>
            <span class="suave pequeno">${geral.feitos} de ${geral.total} assuntos estudados</span></p>
        </section>

        ${calendario(estado)}
        ${cartaoRitmo(estado)}
        <details class="cartao hoje-semana">
          <summary>Assuntos por matéria</summary>
          <div class="grade" style="margin-top:.6rem">${porMateria}</div>
        </details>
        <details class="cartao hoje-semana">
          <summary>Acertos por matéria</summary>
          ${acertos ? '<div class="grade" style="margin-top:.6rem">' + acertos + '</div>' : '<p class="suave pequeno">Responda algumas questões na aba Praticar para ver seus acertos aqui.</p>'}
        </details>

        <h2 class="hoje-titulo estudar-grupo">Configurações</h2>
        <ul class="tarefas cartao estudar-atalhos">
          <li class="tarefa"><a href="#config">
            <span class="tarefa-icone"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M4 6h9M17 6h3M4 12h3M11 12h9M4 18h11M19 18h1"/><circle cx="15" cy="6" r="2"/><circle cx="9" cy="12" r="2"/><circle cx="17" cy="18" r="2"/></svg></span>
            <span class="tarefa-texto"><strong>Configurações</strong><small>Tema, Google Drive, backup e versão</small></span>
            <span class="tarefa-seta" aria-hidden="true">›</span>
          </a></li>
        </ul>
      </div>`;

    el.onclick = (ev) => {
      const botao = ev.target.closest('[data-mes]');
      if (!botao) return;
      deslocamentoMes = Math.min(0, deslocamentoMes + Number(botao.dataset.mes));
      render(el);
    };
  }

  return { render, titulo: 'Eu' };
})();
