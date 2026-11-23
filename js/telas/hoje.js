/* =========================================================
   telas/hoje.js — tela inicial: só o que fazer hoje
   Um botão principal (o estudo do dia), uma lista curta do resto
   e o plano da semana guardado num "ver mais".
   ========================================================= */
App.telas = App.telas || {};

App.telas.hoje = (function () {
  const U = App.util;
  const D = App.dados;
  /** Semana começando na segunda (números do Date.getDay(): 1 = seg … 0 = dom) */
  const ORDEM_SEMANA = [1, 2, 3, 4, 5, 6, 0];

  /** Ícones simples (mesmo traço das abas) */
  const ICONES = {
    certo: '<rect x="3" y="3" width="18" height="18" rx="3"/><path d="m8 12 3 3 5-6"/>',
    revisar: '<path d="M3 12a9 9 0 1 0 3-6.7L3 8"/><path d="M3 3v5h5"/>',
    prova: '<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M9 8h6M9 12h6M9 16h3"/>',
    lingua: '<circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a14 14 0 0 1 0 18M12 3a14 14 0 0 0 0 18"/>',
    aula: '<rect x="3" y="5" width="18" height="12" rx="2"/><path d="m10 9 5 2-5 2z"/><path d="M8 21h8"/>'
  };
  const icone = (nome) => `<svg viewBox="0 0 24 24" aria-hidden="true">${ICONES[nome]}</svg>`;

  function textoFase(estado) {
    const fase = App.calc.faseAtual(estado);
    if (fase === 0) return 'O plano começa em ' + U.dataCurta(App.calc.inicio(estado));
    if (fase === 4) return 'Plano de 6 meses concluído: hora de revisar';
    return 'Fase ' + fase + ' · mês ' + App.calc.mesAtual(estado) + ' de 6';
  }

  /** Próximos assuntos ainda não estudados das matérias do dia, na fase atual */
  function proximosAssuntos(estado, materias) {
    const fase = Math.min(3, Math.max(1, App.calc.faseAtual(estado)));
    return estado.assuntos
      .filter((a) => materias.includes(a.materia) && !a.estudado && a.fase <= fase)
      .sort((a, b) => a.fase - b.fase);
  }

  /** Para onde leva um item do cronograma (estudo da base ou do concurso) */
  function destino(estado, item) {
    if (item.acao === 'simulado') return { href: '#exercicios/simulado', sub: 'Simulado da semana' };
    if (item.acao === 'redacao') return { href: '#redacao', sub: 'Texto curto de sábado' };
    const topico = proximosAssuntos(estado, item.materias).find((a) => D.conteudos[a.id]);
    if (topico) return { href: '#estudar/' + topico.id, sub: topico.titulo, topico };
    if (item.materias.length) return { href: '#exercicios/' + item.materias[0], sub: 'Exercícios de ' + D.materia(item.materias[0]).nome };
    return { href: '#assuntos', sub: 'Escolher um assunto' };
  }

  /** Uma linha da lista "Também hoje". `extra` é um botão opcional à direita. */
  function tarefa(ic, titulo, sub, href, extra) {
    const fora = /^https?:/.test(href) ? ' target="_blank" rel="noopener noreferrer"' : '';
    return `
      <li class="tarefa">
        <a href="${U.esc(href)}"${fora}>
          <span class="tarefa-icone">${icone(ic)}</span>
          <span class="tarefa-texto"><strong>${titulo}</strong>${sub ? `<small>${sub}</small>` : ''}</span>
          ${extra ? '' : '<span class="tarefa-seta" aria-hidden="true">›</span>'}
        </a>
        ${extra || ''}
      </li>`;
  }

  /** Inglês do dia: cartões que vencem, a unidade da vez e a próxima aula do curso de fora */
  function tarefasIngles(estado) {
    const devidos = App.telas.ingles.cartoesDoDia(estado).length;
    const daVez = App.telas.ingles.unidadeDaVez(estado);
    const topico = daVez && estado.assuntos.find((a) => a.id === daVez.assunto);
    const partes = [];
    if (devidos) partes.push(devidos + ' cartões');
    if (topico) partes.push(U.esc(topico.titulo));
    const href = devidos ? '#ingles/cartoes' : (topico && D.conteudos[topico.id] ? '#estudar/' + topico.id : '#ingles');
    let html = tarefa('lingua', 'Inglês · 30 a 40 min', partes.join(' · ') || 'Trilha de inglês', href);

    const prox = App.telas.cursos.proximaDaMateria(estado, 'ingles');
    if (prox) {
      html += tarefa('aula', 'Aula do curso', U.esc(prox.aula.titulo) + ' · ' + U.esc(prox.curso.nome),
        prox.curso.url || '#cursos/' + prox.curso.id,
        `<button class="botao pequeno" data-aula-feita="${U.esc(prox.curso.id + '/' + prox.aula.id)}" aria-label="Marcar a aula como assistida">✓</button>`);
    }
    return html;
  }

  function tabelaSemana(diaHoje) {
    const linhas = ORDEM_SEMANA.map((n) => {
      const d = D.cronograma[n];
      const classe = n === diaHoje ? ' class="hoje-linha"' : '';
      const base = d.descanso ? 'Descanso' : U.esc(d.base.titulo);
      const conc = d.descanso ? '—' : U.esc(d.concurso.titulo);
      return `<tr${classe}><td>${d.nome.slice(0, 3)}</td><td>${base}</td><td>${conc}</td></tr>`;
    }).join('');
    return `
      <table class="hoje-tabela">
        <thead><tr><th>Dia</th><th>Ensino médio</th><th>Concurso</th></tr></thead>
        <tbody>${linhas}</tbody>
      </table>`;
  }

  function render(el) {
    const estado = App.store.get();
    const hoje = U.hoje();
    const chave = U.iso(hoje);
    const feito = Boolean(estado.diasConcluidos[chave]);
    // A semana é uma fila: o plano de hoje é o seguinte ao último dia estudado
    const planoHoje = App.calc.planoDoDia(estado.diasConcluidos, hoje);
    const descanso = hoje.getDay() === 0 && !feito;   // domingo sem estudo = descanso
    const diaHoje = descanso ? 0 : planoHoje;
    // No descanso, a lista mostra o próximo da fila para quem quiser estudar mesmo assim
    const plano = D.cronograma[planoHoje];

    const naSemana = Object.keys(estado.diasConcluidos)
      .filter((k) => estado.diasConcluidos[k] && k > U.iso(U.somarDias(hoje, -7)) && k <= chave).length;
    const geral = App.calc.progressoAssuntos(estado);
    const ritmo = App.calc.ritmo(estado, hoje);
    const textoRitmo = ritmo.status === 'adiantado' ? 'Adiantado' : ritmo.status === 'atrasado' ? 'No seu ritmo' : 'Em dia';

    // Topo: o dia e o estudo principal (um único botão de destaque na tela)
    const principal = destino(estado, plano.base);
    const topo = descanso ? `
      <section class="cartao destaque hoje-topo">
        <div class="hoje-data">${U.esc(U.dataLonga(hoje))}</div>
        <h1>Bom descanso</h1>
        <p class="hoje-sub">Domingo não conta nem quebra a sequência.</p>
        <a class="botao hoje-principal-botao" href="${U.esc(principal.href)}">Estudar mesmo assim</a>
      </section>` : `
      <section class="cartao destaque hoje-topo">
        <div class="hoje-data">${U.esc(U.dataLonga(hoje))} · ${U.esc(textoFase(estado))}</div>
        <h1>${U.esc(plano.base.titulo)}</h1>
        <p class="hoje-sub">${principal.topico ? 'Próximo assunto: ' : ''}${U.esc(principal.sub)} · meta ${U.esc(D.metaDiaria)}</p>
        <a class="botao primario hoje-principal-botao" href="${U.esc(principal.href)}">${principal.topico ? 'Estudar agora' : 'Começar'}</a>
      </section>`;

    // Também hoje: concurso, revisões, prova quinzenal e inglês
    const linhas = [];
    if (!plano.descanso) {
      const conc = destino(estado, plano.concurso);
      linhas.push(tarefa('certo', U.esc(plano.concurso.titulo), 'Concurso · ' + U.esc(conc.sub), conc.href));
    }
    App.calc.revisoesPendentes(estado, hoje).forEach((r) => {
      const href = D.conteudos[r.assunto.id] ? '#estudar/' + r.assunto.id : '#assuntos';
      linhas.push(tarefa('revisar', 'Revisar: ' + U.esc(r.assunto.titulo),
        U.esc(D.materia(r.assunto.materia).nome) + ' · ' + r.numero + 'ª de ' + r.total + (r.atraso > 0 ? ' · ' + r.atraso + ' dia(s) de atraso' : ''),
        href, `<button class="botao pequeno" data-revisar="${U.esc(r.assunto.id)}">Revisei</button>`));
    });
    const prova = App.calc.provaPendente(estado, hoje);
    if (prova) linhas.push(tarefa('prova', 'Prova quinzenal nº ' + prova.numero, 'O que ficou das duas semanas', '#provas'));
    if (!descanso) linhas.push(tarefasIngles(estado));

    const botaoDia = feito
      ? '<button class="botao feito hoje-marcar" data-acao="alternar-dia">✓ Dia concluído · desfazer</button>'
      : `<button class="botao hoje-marcar" data-acao="alternar-dia">${descanso ? 'Estudei hoje' : 'Terminei por hoje'}</button>`;

    el.innerHTML = `
      <div class="hoje">
        ${topo}

        <section class="cartao">
          <h2 class="hoje-titulo">${descanso ? 'Se quiser estudar' : 'Também hoje'}</h2>
          <ul class="tarefas">${linhas.join('')}</ul>
          ${botaoDia}
        </section>

        <a class="cartao hoje-resumo" href="#progresso">
          <span><strong>${naSemana}</strong> de 7 dias</span>
          <span><strong>${geral.pct}%</strong> dos assuntos</span>
          <span>${textoRitmo}</span>
          <span class="tarefa-seta" aria-hidden="true">›</span>
        </a>

        <details class="cartao hoje-semana">
          <summary>Plano da semana</summary>
          <p class="suave pequeno">Uma fila, sem dia fixo: se faltar um dia, o plano espera e vira o do próximo dia em que você estudar.</p>
          ${tabelaSemana(diaHoje)}
        </details>
      </div>`;

    el.onclick = (ev) => {
      const aulaFeita = ev.target.closest('[data-aula-feita]');
      if (aulaFeita) {
        App.telas.cursos.marcarAula(estado, aulaFeita.dataset.aulaFeita, true);
        App.store.salvar();
        U.aviso('Aula assistida ✓');
        render(el);
        return;
      }
      const botaoRevisar = ev.target.closest('[data-revisar]');
      if (botaoRevisar) {
        App.calc.registrarRevisao(estado, botaoRevisar.dataset.revisar, hoje);
        App.store.salvar();
        U.aviso('Revisão registrada');
        render(el);
        return;
      }
      if (ev.target.closest('[data-acao="alternar-dia"]')) {
        if (estado.diasConcluidos[chave]) delete estado.diasConcluidos[chave];
        else {
          estado.diasConcluidos[chave] = planoHoje;  // guarda qual plano foi feito
          U.aviso('Boa! Dia marcado como concluído');
        }
        App.store.salvar();
        render(el);
      }
    };
  }

  return { render, titulo: 'Hoje' };
})();
