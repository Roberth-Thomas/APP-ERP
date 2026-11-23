/* =========================================================
   telas/assuntos.js — checklist de assuntos por fase e matéria
   Rotas:
     #assuntos            → aba Estudar: matérias em grupos, inglês, redação e atalhos
     #assuntos/<materia>  → assuntos da matéria: marcar, estudar, adicionar, renomear e remover
   ========================================================= */
App.telas = App.telas || {};

App.telas.assuntos = (function () {
  const U = App.util;
  const D = App.dados;
  // Ícones de linha (mesmo traço dos ícones das abas)
  const ICONE_LAPIS = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4z"/></svg>';
  const ICONE_LIXO = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18M8 6V4h8v2M6 6l1 14h10l1-14"/></svg>';
  const ICONES = {
    portugues: '<path d="M2 5h7a3 3 0 0 1 3 3v12a2 2 0 0 0-2-2H2z"/><path d="M22 5h-7a3 3 0 0 0-3 3v12a2 2 0 0 1 2-2h8z"/>',
    matematica: '<path d="M7 4v6M4 7h6M14 7h6M5 15l4 4M9 15l-4 4M14 16h6M14 19h6"/>',
    biologia: '<path d="M5 19c0-9 6-14 15-14 0 9-5 15-14 15"/><path d="M5 19l8-8"/>',
    historia: '<path d="M6 3h12M6 21h12M7 3c0 5 5 6 5 9s-5 4-5 9M17 3c0 5-5 6-5 9s5 4 5 9"/>',
    geografia: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18"/>',
    filosofia: '<circle cx="12" cy="12" r="9"/><path d="M9.5 9a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14M12 17.5v.01"/>',
    sociologia: '<circle cx="9" cy="8" r="3"/><path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6"/><circle cx="17" cy="9" r="2.5"/><path d="M16 14c2.8 0 5 2.2 5 5"/>',
    ingles: '<path d="M4 5h16v11H9l-5 4z"/><path d="M8 9h8M8 12h5"/>',
    logica: '<circle cx="6" cy="6" r="2.5"/><circle cx="18" cy="6" r="2.5"/><circle cx="12" cy="18" r="2.5"/><path d="M7 8.3l4 7.4M17 8.3l-4 7.4M8.5 6h7"/>',
    informatica: '<rect x="3" y="4" width="18" height="12" rx="1.5"/><path d="M8 20h8M12 16v4"/>',
    administracao: '<rect x="3" y="7" width="18" height="13" rx="1.5"/><path d="M9 7V4h6v3M3 12h18"/>',
    agentes: '<rect x="5" y="8" width="14" height="11" rx="2"/><path d="M12 8V4M9 13v.01M15 13v.01M9.5 16.5h5M2 13h3M19 13h3"/>',
  };
  const ICONE_PADRAO = '<path d="M4 4h16v16H4z"/><path d="M8 9h8M8 13h8M8 17h5"/>';
  let faseEscolhida = null; // null = ainda não escolhida (usa a fase atual)
  let editando = false;     // "Editar lista": mostra renomear, remover e adicionar

  function icone(materia) {
    return `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONES[materia] || ICONE_PADRAO}</svg>`;
  }

  /** Pílulas de fase + progresso da fase, numa linha compacta */
  function seletorFase(estado, fase, soPilulas) {
    const prog = App.calc.progressoAssuntos(estado, null, fase);
    const pilulas = D.fases.map((f) =>
      `<button class="pilula ${f.numero === fase ? 'ativa' : ''}" data-fase="${f.numero}" role="tab" aria-selected="${f.numero === fase}">${f.nome}</button>`).join('');
    return `
      <div class="estudar-fase">
        <div class="pilulas" role="tablist" aria-label="Fase">${pilulas}</div>
        ${soPilulas ? '' : `<div class="item-barra">
          <div class="linha entre"><span class="suave pequeno">${U.esc(D.fases[fase - 1].descricao.split('·')[0].trim())}</span><strong class="pequeno">${prog.feitos}/${prog.total} · ${prog.pct}%</strong></div>
          <div class="barra"><div style="width:${prog.pct}%"></div></div>
        </div>`}
      </div>`;
  }

  /** Um bloco da grade. `href` muda para matérias com tela própria (inglês). */
  function blocoMateria(estado, fase, m, href, sub) {
    const itens = estado.assuntos.filter((a) => a.materia === m.id && a.fase === fase);
    const feitos = itens.filter((a) => a.estudado).length;
    const pct = U.porcentagem(feitos, itens.length);
    const completo = itens.length && feitos === itens.length;
    return `
      <a class="materia-bloco ${completo ? 'completo' : ''}" href="${href || '#assuntos/' + U.esc(m.id)}">
        <span class="materia-icone">${icone(m.id)}</span>
        <span class="materia-nome">${U.esc(m.nome)}</span>
        <span class="suave pequeno">${sub || (itens.length ? `${feitos} de ${itens.length}` : 'Sem assuntos')}</span>
        <span class="barra"><span style="width:${pct}%"></span></span>
      </a>`;
  }

  /** Linha de atalho (mesmo desenho da lista da tela Hoje) */
  function atalho(svg, titulo, sub, href) {
    return `
      <li class="tarefa"><a href="${href}">
        <span class="tarefa-icone"><svg viewBox="0 0 24 24" aria-hidden="true">${svg}</svg></span>
        <span class="tarefa-texto"><strong>${titulo}</strong><small>${sub}</small></span>
        <span class="tarefa-seta" aria-hidden="true">›</span>
      </a></li>`;
  }

  /* ---------- Grade de matérias (aba Estudar) ---------- */
  function telaGrade(el, estado, fase) {
    const grupo = (titulo, lista) => lista.length ? `
      <h2 class="hoje-titulo estudar-grupo">${titulo}</h2>
      <nav class="grade-materias" aria-label="${titulo}">${lista.join('')}</nav>` : '';
    const base = [], concurso = [], extras = [];
    D.materias.forEach((m) => {
      if (m.tipo === 'concurso') concurso.push(blocoMateria(estado, fase, m));
      else if (m.tipo === 'curso') extras.push(blocoMateria(estado, fase, m, null, 'Curso livre'));
      else if (m.id === 'ingles') extras.unshift(blocoMateria(estado, fase, m, '#ingles', 'Trilha B1 → C1'));
      else base.push(blocoMateria(estado, fase, m));
    });
    // Redação tem tela própria (plano de 12 semanas e escrita)
    extras.splice(1, 0, `
      <a class="materia-bloco" href="#redacao">
        <span class="materia-icone">${ICONE_LAPIS}</span>
        <span class="materia-nome">Redação</span>
        <span class="suave pequeno">Plano de 12 semanas</span>
      </a>`);

    el.innerHTML = `
      <div class="estudar">
        <h1 class="estudar-h1">Estudar</h1>
        ${seletorFase(estado, fase)}
        ${grupo('Ensino médio', base)}
        ${grupo('Concurso', concurso)}
        ${grupo('Inglês, redação e cursos', extras)}
        <h2 class="hoje-titulo estudar-grupo">Também</h2>
        <ul class="tarefas cartao estudar-atalhos">
          ${atalho('<path d="M4 4h6v16H4zM14 4h6v16h-6z"/>', 'Apostilas', 'Cada matéria como um livro', '#apostila')}
          ${atalho('<rect x="3" y="5" width="18" height="12" rx="2"/><path d="m10 9 5 2-5 2z"/><path d="M8 21h8"/>', 'Meus cursos', 'Aulas de cursos de fora', '#cursos')}
          ${atalho('<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 3v18M12 8h4M12 12h4"/>', 'Caderno', 'Suas anotações ligadas', '#caderno')}
        </ul>
      </div>`;
  }

  /* ---------- Uma matéria ---------- */
  function telaMateria(el, estado, fase, m) {
    const itens = estado.assuntos.filter((a) => a.materia === m.id && a.fase === fase);
    const feitos = itens.filter((a) => a.estudado).length;
    const proximo = itens.find((a) => !a.estudado && D.conteudos[a.id]);
    const lis = itens.map((a) => `
      <li data-id="${U.esc(a.id)}">
        <input type="checkbox" data-acao="marcar" ${a.estudado ? 'checked' : ''} aria-label="Estudado: ${U.esc(a.titulo)}">
        ${D.conteudos[a.id]
          ? `<a class="assunto-titulo ${a.estudado ? 'feito' : ''}" href="#estudar/${U.esc(a.id)}">${U.esc(a.titulo)}<span aria-hidden="true">›</span></a>`
          : `<span class="assunto-titulo ${a.estudado ? 'feito' : ''}">${U.esc(a.titulo)} <span class="suave pequeno">· sem apostila</span></span>`}
        ${editando ? `<span class="acoes">
          <button data-acao="editar" title="Renomear" aria-label="Renomear ${U.esc(a.titulo)}">${ICONE_LAPIS}</button>
          <button data-acao="remover" title="Remover" aria-label="Remover ${U.esc(a.titulo)}">${ICONE_LIXO}</button>
        </span>` : ''}
      </li>`).join('');
    el.innerHTML = `
      <div class="estudar">
        <a href="#assuntos" class="voltar-link">‹ Estudar</a>
        <h1 class="estudar-h1"><span class="titulo-com-icone">${icone(m.id)}${U.esc(m.nome)}</span></h1>
        ${seletorFase(estado, fase, true)}
        ${proximo ? `<a class="botao primario estudar-continuar" href="#estudar/${U.esc(proximo.id)}">Continuar: ${U.esc(proximo.titulo)}</a>` : ''}
        <section class="cartao">
          <div class="materia-titulo">
            <span class="selo ${itens.length && feitos === itens.length ? 'ok' : 'info'}">${feitos} de ${itens.length} estudados</span>
            <button class="link-botao pequeno" data-acao="alternar-edicao">${editando ? 'Pronto' : 'Editar lista'}</button>
          </div>
          ${m.id === 'ingles' ? '<a class="pequeno" href="#ingles">Abrir a trilha de inglês (níveis, cartões e nivelamento) →</a>' : ''}
          <ul class="lista-assuntos">${lis || '<li class="suave pequeno">Nenhum assunto desta matéria nesta fase.</li>'}</ul>
          ${editando ? `<form class="form-inline" data-materia="${m.id}">
            <input type="text" name="titulo" placeholder="Novo assunto…" aria-label="Novo assunto de ${U.esc(m.nome)}" required>
            <button class="botao" type="submit">Adicionar</button>
          </form>` : ''}
        </section>
        <a class="pequeno" href="#apostila/${U.esc(m.id)}">Ler como apostila (todas as fases) →</a>
      </div>`;
  }

  function render(el, param) {
    const estado = App.store.get();
    if (faseEscolhida === null) faseEscolhida = Math.min(3, Math.max(1, App.calc.faseAtual(estado)));
    const fase = faseEscolhida;
    const materia = param && D.materias.find((m) => m.id === param);
    if (!materia) editando = false;
    if (materia) telaMateria(el, estado, fase, materia); else telaGrade(el, estado, fase);

    // Um único "ouvinte" para a tela toda (delegação de eventos)
    el.onclick = (ev) => {
      const botaoFase = ev.target.closest('[data-fase]');
      if (botaoFase) { faseEscolhida = Number(botaoFase.dataset.fase); render(el, param); return; }

      const acao = ev.target.closest('[data-acao]');
      if (!acao) return;
      if (acao.dataset.acao === 'alternar-edicao') { editando = !editando; render(el, param); return; }
      const li = acao.closest('li[data-id]');
      const assunto = li && estado.assuntos.find((a) => a.id === li.dataset.id);
      if (!assunto) return;

      if (acao.dataset.acao === 'editar') {
        const novo = prompt('Novo nome do assunto:', assunto.titulo);
        if (novo && novo.trim()) { assunto.titulo = novo.trim(); App.store.salvar(); render(el, param); }
      } else if (acao.dataset.acao === 'remover') {
        if (confirm('Remover "' + assunto.titulo + '"?')) {
          estado.assuntos = estado.assuntos.filter((a) => a !== assunto);
          App.store.salvar();
          render(el, param);
        }
      }
    };

    el.onchange = (ev) => {
      if (ev.target.dataset.acao !== 'marcar') return;
      const li = ev.target.closest('li[data-id]');
      const assunto = estado.assuntos.find((a) => a.id === li.dataset.id);
      App.calc.marcarEstudado(estado, assunto, ev.target.checked); // também agenda as revisões
      App.store.salvar();
      render(el, param);
    };

    el.onsubmit = (ev) => {
      ev.preventDefault();
      const form = ev.target;
      const titulo = form.titulo.value.trim();
      if (!titulo) return;
      estado.assuntos.push({ id: U.novoId(), materia: form.dataset.materia, fase, titulo, estudado: false });
      App.store.salvar();
      render(el, param);
      U.aviso('Assunto adicionado');
    };
  }

  return { render, titulo: 'Estudar' };
})();
