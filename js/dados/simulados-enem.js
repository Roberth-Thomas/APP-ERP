/* =========================================================
   dados/simulados-enem.js — provas inteiras do ENEM como simulado
   O caderno fica no PDF oficial do Inep (textos e imagens são dos
   autores); aqui só entram o gabarito oficial, a página de cada
   questão e o tema da redação. Usado por js/telas/enem.js.

   Conferido em 2026-11-23: os dois PDFs têm o mesmo SHA-256 dos
   publicados pelo Inep, e o gabarito foi lido de dois jeitos
   (texto da página e posição das palavras), com resultado igual.

   Formato:
   {
     id, ano, dia, caderno, prova (url do PDF), gabaritoUrl, minutos,
     redacao: { tema, pagina } | null,
     linguas: { ingles: { gabarito: 'ABCDE', paginas: [..5] }, espanhol: {...} },  // questões 1 a 5
     areas: [{ id, nome, curto, de, ate }],
     gabarito: { inicio: 6, letras: '...' },   // da questão "inicio" até a última, em ordem
     paginas: { 6: 5, ... },                   // página do PDF de cada questão
     recortes: { 6: [[pág, x0, y0, x1, y1]], ingles: [...], espanhol: [...] },  // onde o enunciado está na página
     alternativas: { 6: [[pág, y0, y1] x 5], ingles: [...], espanhol: [...] },     // faixa de A a E (áreas tocáveis)
     explicacoes: { 6: 'texto', ingles: [...], espanhol: [...] }
   }
   ========================================================= */
App.dados = App.dados || {};

App.dados.simuladosEnem = [
  {
    id: 'enem-2026-d1-azul',
    ano: 2026,
    dia: 1,
    caderno: 'Azul',
    prova: 'https://download.inep.gov.br/enem/provas_e_gabaritos/2026_PV_impresso_D1_CD1.pdf',
    gabaritoUrl: 'https://download.inep.gov.br/enem/provas_e_gabaritos/2026_GB_impresso_D1_CD1.pdf',
    minutos: 330, // 5h30, com a redação
    redacao: { tema: 'A valorização do Sistema Único de Saúde (SUS) como direito universal', pagina: 18 },
    linguas: {
      ingles: { gabarito: 'BAEDC', paginas: [2, 2, 2, 2, 3] },
      espanhol: { gabarito: 'AACBD', paginas: [3, 3, 4, 4, 4] },
    },
    areas: [
      { id: 'linguagens', nome: 'Linguagens, Códigos e suas Tecnologias', curto: 'Linguagens', de: 1, ate: 45 },
      { id: 'humanas', nome: 'Ciências Humanas e suas Tecnologias', curto: 'Ciências Humanas', de: 46, ate: 90 },
    ],
    gabarito: {
      inicio: 6,
      letras: 'DBCABDBDABEEDBEABCDCECCEAAAADCBABABCDEDE' + // 6 a 45
              'CCCDEBEDDDEAECBAADCABBAEABCDEDBEDABDEECBEACAE', // 46 a 90
    },
    paginas: {
      6: 5, 7: 5, 8: 5, 9: 7, 10: 7, 11: 7, 12: 7, 13: 7, 14: 7, 15: 7, 16: 8, 17: 8, 18: 8,
      19: 9, 20: 9, 21: 9, 22: 10, 23: 10, 24: 10, 25: 11, 26: 11, 27: 11, 28: 12, 29: 12, 30: 12,
      31: 13, 32: 13, 33: 13, 34: 14, 35: 14, 36: 14, 37: 15, 38: 15, 39: 16, 40: 16, 41: 16, 42: 16,
      43: 17, 44: 17, 45: 17, 46: 21, 47: 21, 48: 21, 49: 21, 50: 21, 51: 21, 52: 21, 53: 22, 54: 22,
      55: 22, 56: 22, 57: 23, 58: 23, 59: 23, 60: 23, 61: 24, 62: 24, 63: 24, 64: 25, 65: 25, 66: 25,
      67: 26, 68: 26, 69: 26, 70: 26, 71: 27, 72: 27, 73: 27, 74: 27, 75: 28, 76: 28, 77: 28, 78: 28,
      79: 28, 80: 29, 81: 29, 82: 29, 83: 29, 84: 30, 85: 30, 86: 30, 87: 30, 88: 31, 89: 31, 90: 31,
    },
    // Onde está cada questão no caderno: [página, x0, y0, x1, y1] em pontos do PDF (origem no canto de cima).
    // Gerado com PyMuPDF a partir dos títulos "QUESTÃO NN"; 9 a 13 e 46 a 50 levam antes o texto-base (págs. 6 e 20).
    // A tela desenha esses recortes direto do PDF do Inep: o enunciado não é copiado para o app.
    recortes: {
      ingles: [[[2,27,136,287,362]],[[2,27,363,287,744]],[[2,286,73,550,367]],[[2,286,368,550,744]],[[3,20,73,287,744]]],
      espanhol: [[[3,286,95,542,562]],[[3,286,563,542,744]],[[4,27,73,287,744]],[[4,286,73,550,364]],[[4,286,365,550,744]]],
      6: [[5,20,73,287,608]],
      7: [[5,20,609,287,744],[5,286,71,543,431]],
      8: [[5,286,432,543,744]],
      9: [[6,27,72,549,743],[7,20,73,287,201]],
      10: [[6,27,72,549,743],[7,20,202,287,331]],
      11: [[6,27,72,549,743],[7,20,332,287,473]],
      12: [[6,27,72,549,743],[7,20,474,287,615]],
      13: [[6,27,72,549,743],[7,20,616,287,744]],
      14: [[7,286,73,542,412]],
      15: [[7,286,413,542,744]],
      16: [[8,27,73,287,744]],
      17: [[8,286,73,550,426]],
      18: [[8,286,427,550,744]],
      19: [[9,20,73,287,545]],
      20: [[9,20,546,287,744],[9,286,71,542,343]],
      21: [[9,286,344,542,744]],
      22: [[10,27,73,287,458]],
      23: [[10,27,459,287,744]],
      24: [[10,286,73,550,744]],
      25: [[11,20,73,287,434]],
      26: [[11,20,435,287,659]],
      27: [[11,286,73,542,659]],
      28: [[12,27,73,287,517]],
      29: [[12,27,514,287,744],[12,286,71,550,188]],
      30: [[12,286,189,550,744]],
      31: [[13,20,73,287,520]],
      32: [[13,20,521,287,744],[13,286,71,542,176]],
      33: [[13,286,177,542,744]],
      34: [[14,27,73,287,506]],
      35: [[14,27,507,287,744],[14,286,71,550,294]],
      36: [[14,286,295,550,744]],
      37: [[15,20,73,287,744]],
      38: [[15,286,73,542,744]],
      39: [[16,27,73,287,435]],
      40: [[16,27,436,287,744]],
      41: [[16,286,73,550,358]],
      42: [[16,286,359,550,744]],
      43: [[17,20,73,287,442]],
      44: [[17,20,443,287,744],[17,286,71,542,200]],
      45: [[17,286,201,542,744]],
      46: [[20,27,72,549,744],[21,20,73,287,212]],
      47: [[20,27,72,549,744],[21,20,213,287,354]],
      48: [[20,27,72,549,744],[21,20,355,287,473]],
      49: [[20,27,72,549,744],[21,20,474,287,612]],
      50: [[20,27,72,549,744],[21,20,613,287,744]],
      51: [[21,286,73,542,488]],
      52: [[21,286,489,542,744]],
      53: [[22,27,73,287,331]],
      54: [[22,27,332,287,742]],
      55: [[22,286,73,550,458]],
      56: [[22,286,459,550,742]],
      57: [[23,20,73,287,405]],
      58: [[23,20,406,287,744]],
      59: [[23,286,73,542,324]],
      60: [[23,286,325,542,744]],
      61: [[24,27,73,287,674]],
      62: [[24,286,73,550,367]],
      63: [[24,286,368,550,674]],
      64: [[25,20,73,287,498]],
      65: [[25,20,499,287,744],[25,286,71,543,307]],
      66: [[25,286,308,543,744]],
      67: [[26,27,73,287,548]],
      68: [[26,27,549,287,744],[26,286,71,550,174]],
      69: [[26,286,175,550,406]],
      70: [[26,286,407,550,744]],
      71: [[27,20,73,287,564]],
      72: [[27,20,565,287,744],[27,286,71,542,178]],
      73: [[27,286,179,542,428]],
      74: [[27,286,429,542,744]],
      75: [[28,27,73,287,286]],
      76: [[28,27,287,287,595]],
      77: [[28,27,596,287,744],[28,286,71,550,176]],
      78: [[28,286,177,550,423]],
      79: [[28,286,424,550,744]],
      80: [[29,20,73,287,376]],
      81: [[29,20,377,287,700]],
      82: [[29,286,73,542,324]],
      83: [[29,286,325,542,700]],
      84: [[30,27,73,287,436]],
      85: [[30,27,437,287,744]],
      86: [[30,286,73,550,501]],
      87: [[30,286,502,550,744]],
      88: [[31,20,73,287,376]],
      89: [[31,20,377,287,661]],
      90: [[31,286,73,542,661]],
    },
    // Faixa de cada alternativa (A a E) no caderno: [página, y0, y1]. A largura é a do recorte que a contém.
    // Achadas pelas letras em círculo (fonte própria do caderno). Viram áreas tocáveis sobre o enunciado.
    alternativas: {
      ingles: [[[2,290.2,303.8],[2,303.8,317.4],[2,317.4,330.9],[2,330.9,344.5],[2,344.5,359.9]],[[2,671.5,685.0],[2,685.0,698.6],[2,698.6,712.2],[2,712.2,725.7],[2,725.7,741.1]],[[2,291.9,306.0],[2,306.0,320.1],[2,320.1,334.2],[2,334.2,348.3],[2,348.3,363.7]],[[2,669.4,683.5],[2,683.5,697.6],[2,697.6,711.7],[2,711.7,725.8],[2,725.8,741.1]],[[3,322.2,335.7],[3,335.7,349.1],[3,349.1,362.5],[3,362.5,375.9],[3,375.9,391.3]]],
      espanhol: [[[3,496.2,508.2],[3,508.2,520.2],[3,520.2,532.2],[3,532.2,544.2],[3,544.2,559.5]],[[3,677.6,689.6],[3,689.6,701.6],[3,701.6,713.6],[3,713.6,725.6],[3,725.6,741.0]],[[4,481.2,494.6],[4,494.6,520.0],[4,520.0,545.4],[4,545.4,570.8],[4,570.8,598.2]],[[4,254.6,280.5],[4,280.5,306.4],[4,306.4,332.2],[4,332.2,345.9],[4,345.9,361.2]],[[4,634.5,648.1],[4,648.1,661.8],[4,661.8,687.6],[4,687.6,713.5],[4,713.5,741.1]]],
      6: [[5,541.7,553.8],[5,553.8,565.9],[5,565.9,578.0],[5,578.0,590.1],[5,590.1,605.5]],
      7: [[5,297.1,323.0],[5,323.0,348.9],[5,348.9,374.8],[5,374.8,400.7],[5,400.7,428.3]],
      8: [[5,671.1,684.8],[5,684.8,698.4],[5,698.4,712.1],[5,712.1,725.7],[5,725.7,741.1]],
      9: [[7,127.0,141.1],[7,141.1,155.2],[7,155.2,169.2],[7,169.2,183.3],[7,183.3,198.7]],
      10: [[7,256.3,270.4],[7,270.4,284.5],[7,284.5,298.5],[7,298.5,312.6],[7,312.6,328.0]],
      11: [[7,385.6,399.7],[7,399.7,413.7],[7,413.7,427.8],[7,427.8,441.9],[7,441.9,469.9]],
      12: [[7,540.2,554.3],[7,554.3,568.3],[7,568.3,582.4],[7,582.4,596.4],[7,596.4,611.8]],
      13: [[7,669.5,683.5],[7,683.5,697.6],[7,697.6,711.7],[7,711.7,725.7],[7,725.7,741.1]],
      14: [[7,341.0,354.4],[7,354.4,367.8],[7,367.8,381.3],[7,381.3,394.7],[7,394.7,410.1]],
      15: [[7,618.1,631.5],[7,631.5,644.9],[7,644.9,658.3],[7,658.3,671.7],[7,671.7,687.1]],
      16: [[8,624.8,640.4],[8,640.4,656.1],[8,656.1,684.5],[8,684.5,712.9],[8,712.9,741.1]],
      17: [[8,322.1,335.0],[8,335.0,347.9],[8,347.9,372.3],[8,372.3,396.8],[8,396.8,424.1]],
      18: [[8,673.1,686.0],[8,686.0,698.9],[8,698.9,712.3],[8,712.3,725.7],[8,725.7,741.1]],
      19: [[9,467.2,482.1],[9,482.1,497.1],[9,497.1,512.0],[9,512.0,527.0],[9,527.0,542.4]],
      20: [[9,271.9,285.4],[9,285.4,298.9],[9,298.9,312.4],[9,312.4,325.9],[9,325.9,341.2]],
      21: [[9,671.8,685.3],[9,685.3,698.8],[9,698.8,712.3],[9,712.3,725.7],[9,725.7,741.1]],
      22: [[10,385.6,399.3],[10,399.3,412.9],[10,412.9,426.5],[10,426.5,440.2],[10,440.2,455.6]],
      23: [[10,671.2,684.8],[10,684.8,698.5],[10,698.5,712.1],[10,712.1,725.8],[10,725.8,741.1]],
      24: [[10,600.6,628.6],[10,628.6,656.6],[10,656.6,684.5],[10,684.5,712.5],[10,712.5,741.1]],
      25: [[11,366.4,378.8],[11,378.8,391.2],[11,391.2,403.7],[11,403.7,416.1],[11,416.1,431.5]],
      26: [[11,587.2,600.6],[11,600.6,614.1],[11,614.1,627.5],[11,627.5,640.9],[11,640.9,656.3]],
      27: [[11,481.0,506.4],[11,506.4,531.8],[11,531.8,557.2],[11,557.2,582.6],[11,582.6,610.0]],
      28: [[12,457.3,468.3],[12,468.3,479.4],[12,479.4,490.4],[12,490.4,501.5],[12,501.5,516.8]],
      29: [[12,117.3,130.7],[12,130.7,144.1],[12,144.1,157.5],[12,157.5,171.0],[12,171.0,186.3]],
      30: [[12,538.8,552.2],[12,552.2,565.6],[12,565.6,579.0],[12,579.0,592.5],[12,592.5,607.8]],
      31: [[13,410.8,424.4],[13,424.4,438.0],[13,438.0,463.9],[13,463.9,489.7],[13,489.7,517.3]],
      32: [[13,105.3,118.7],[13,118.7,132.1],[13,132.1,145.5],[13,145.5,159.0],[13,159.0,174.3]],
      33: [[13,522.5,536.0],[13,536.0,549.4],[13,549.4,574.8],[13,574.8,600.2],[13,600.2,627.6]],
      34: [[14,433.2,446.9],[14,446.9,460.7],[14,460.7,474.4],[14,474.4,488.2],[14,488.2,503.6]],
      35: [[14,220.2,234.2],[14,234.2,248.2],[14,248.2,262.1],[14,262.1,276.1],[14,276.1,291.5]],
      36: [[14,669.9,683.8],[14,683.8,697.8],[14,697.8,711.8],[14,711.8,725.7],[14,725.7,741.1]],
      37: [[15,644.2,670.9],[15,670.9,697.6],[15,697.6,711.7],[15,711.7,725.8],[15,725.8,741.1]],
      38: [[15,418.2,443.7],[15,443.7,469.1],[15,469.1,494.5],[15,494.5,519.9],[15,519.9,547.3]],
      39: [[16,366.8,379.3],[16,379.3,391.7],[16,391.7,404.2],[16,404.2,417.6],[16,417.6,433.0]],
      40: [[16,675.9,688.4],[16,688.4,700.8],[16,700.8,713.3],[16,713.3,725.8],[16,725.8,741.1]],
      41: [[16,290.6,303.1],[16,303.1,315.6],[16,315.6,328.1],[16,328.1,340.6],[16,340.6,356.0]],
      42: [[16,675.8,688.3],[16,688.3,700.8],[16,700.8,713.3],[16,713.3,725.8],[16,725.8,741.1]],
      43: [[17,370.5,384.0],[17,384.0,397.5],[17,397.5,410.9],[17,410.9,424.4],[17,424.4,439.8]],
      44: [[17,105.3,118.7],[17,118.7,132.1],[17,132.1,157.5],[17,157.5,182.9],[17,182.9,198.3]],
      45: [[17,516.2,529.6],[17,529.6,543.0],[17,543.0,556.4],[17,556.4,569.8],[17,569.8,585.2]],
      46: [[21,146.3,158.3],[21,158.3,170.3],[21,170.3,182.3],[21,182.3,194.3],[21,194.3,209.7]],
      47: [[21,276.7,288.7],[21,288.7,300.7],[21,300.7,312.7],[21,312.7,324.7],[21,324.7,352.1]],
      48: [[21,407.2,419.2],[21,419.2,431.2],[21,431.2,443.2],[21,443.2,455.2],[21,455.2,470.6]],
      49: [[21,546.8,558.8],[21,558.8,570.8],[21,570.8,582.8],[21,582.8,594.8],[21,594.8,610.2]],
      50: [[21,677.3,689.3],[21,689.3,701.3],[21,701.3,713.3],[21,713.3,725.3],[21,725.3,740.7]],
      51: [[21,422.9,434.9],[21,434.9,446.9],[21,446.9,458.9],[21,458.9,470.9],[21,470.9,486.3]],
      52: [[21,673.3,685.3],[21,685.3,697.3],[21,697.3,709.3],[21,709.3,721.3],[21,721.3,736.7]],
      53: [[22,265.2,277.2],[22,277.2,289.2],[22,289.2,301.2],[22,301.2,313.2],[22,313.2,328.6]],
      54: [[22,675.8,687.8],[22,687.8,699.8],[22,699.8,711.8],[22,711.8,723.8],[22,723.8,739.2]],
      55: [[22,386.9,400.3],[22,400.3,413.7],[22,413.7,427.1],[22,427.1,440.5],[22,440.5,455.9]],
      56: [[22,669.3,682.7],[22,682.7,696.1],[22,696.1,709.5],[22,709.5,723.0],[22,723.0,738.3]],
      57: [[23,332.8,346.5],[23,346.5,360.2],[23,360.2,373.9],[23,373.9,387.6],[23,387.6,403.0]],
      58: [[23,670.8,684.6],[23,684.6,698.3],[23,698.3,712.0],[23,712.0,725.7],[23,725.7,741.1]],
      59: [[23,248.8,263.3],[23,263.3,277.7],[23,277.7,292.2],[23,292.2,306.6],[23,306.6,322.0]],
      60: [[23,671.9,685.4],[23,685.4,698.8],[23,698.8,712.3],[23,712.3,725.7],[23,725.7,741.1]],
      61: [[24,592.2,605.6],[24,605.6,619.0],[24,619.0,632.4],[24,632.4,645.9],[24,645.9,661.2]],
      62: [[24,271.4,284.8],[24,284.8,298.2],[24,298.2,323.7],[24,323.7,349.1],[24,349.1,364.5]],
      63: [[24,541.8,567.2],[24,567.2,592.7],[24,592.7,618.1],[24,618.1,643.5],[24,643.5,670.9]],
      64: [[25,425.6,438.9],[25,438.9,452.3],[25,452.3,465.6],[25,465.6,478.9],[25,478.9,494.3]],
      65: [[25,240.5,252.7],[25,252.7,265.0],[25,265.0,277.2],[25,277.2,289.5],[25,289.5,304.8]],
      66: [[25,676.8,689.0],[25,689.0,701.3],[25,701.3,713.5],[25,713.5,725.8],[25,725.8,741.1]],
      67: [[26,455.5,468.5],[26,468.5,493.0],[26,493.0,517.5],[26,517.5,530.4],[26,530.4,545.8]],
      68: [[26,102.5,115.9],[26,115.9,129.4],[26,129.4,142.8],[26,142.8,156.2],[26,156.2,171.6]],
      69: [[26,334.4,347.8],[26,347.8,361.2],[26,361.2,374.7],[26,374.7,388.1],[26,388.1,403.5]],
      70: [[26,672.0,685.4],[26,685.4,698.9],[26,698.9,712.3],[26,712.3,725.8],[26,725.8,741.1]],
      71: [[27,491.5,505.1],[27,505.1,518.7],[27,518.7,532.2],[27,532.2,545.8],[27,545.8,561.2]],
      72: [[27,105.7,119.3],[27,119.3,132.9],[27,132.9,146.6],[27,146.6,160.2],[27,160.2,175.6]],
      73: [[27,355.9,369.5],[27,369.5,383.1],[27,383.1,396.7],[27,396.7,410.3],[27,410.3,425.7]],
      74: [[27,610.2,636.0],[27,636.0,661.9],[27,661.9,687.7],[27,687.7,713.5],[27,713.5,741.1]],
      75: [[28,213.5,227.2],[28,227.2,240.8],[28,240.8,254.4],[28,254.4,268.1],[28,268.1,283.4]],
      76: [[28,522.5,536.1],[28,536.1,549.7],[28,549.7,563.4],[28,563.4,577.0],[28,577.0,592.4]],
      77: [[28,105.3,118.7],[28,118.7,132.1],[28,132.1,145.5],[28,145.5,158.9],[28,158.9,174.3]],
      78: [[28,351.7,365.1],[28,365.1,378.5],[28,378.5,392.0],[28,392.0,405.4],[28,405.4,420.8]],
      79: [[28,631.7,645.1],[28,645.1,658.6],[28,658.6,672.0],[28,672.0,685.4],[28,685.4,700.8]],
      80: [[29,305.0,318.4],[29,318.4,331.8],[29,331.8,345.3],[29,345.3,358.7],[29,358.7,374.1]],
      81: [[29,567.7,593.1],[29,593.1,618.5],[29,618.5,643.9],[29,643.9,669.3],[29,669.3,696.7]],
      82: [[29,253.0,266.4],[29,266.4,279.8],[29,279.8,293.3],[29,293.3,306.7],[29,306.7,322.1]],
      83: [[29,559.4,572.8],[29,572.8,586.3],[29,586.3,599.7],[29,599.7,613.1],[29,613.1,628.5]],
      84: [[30,364.1,377.7],[30,377.7,391.2],[30,391.2,404.8],[30,404.8,418.3],[30,418.3,433.7]],
      85: [[30,671.6,685.1],[30,685.1,698.7],[30,698.7,712.2],[30,712.2,725.7],[30,725.7,741.1]],
      86: [[30,433.1,445.5],[30,445.5,457.9],[30,457.9,470.2],[30,470.2,482.6],[30,482.6,498.0]],
      87: [[30,676.3,688.6],[30,688.6,701.0],[30,701.0,713.4],[30,713.4,725.7],[30,725.7,741.1]],
      88: [[31,305.0,318.4],[31,318.4,331.8],[31,331.8,345.3],[31,345.3,358.7],[31,358.7,374.1]],
      89: [[31,579.7,593.1],[31,593.1,606.5],[31,606.5,619.9],[31,619.9,633.4],[31,633.4,648.7]],
      90: [[31,588.9,602.4],[31,602.4,615.8],[31,615.8,629.2],[31,629.2,642.6],[31,642.6,658.0]],
    },
    // Explicações próprias, escritas depois de ler cada questão no caderno e conferir com o gabarito.
    // Sem copiar os textos da prova: só o raciocínio. Já cobrem o caderno inteiro: 1 a 90 e as duas línguas.
    explicacoes: {
      ingles: [
        // 1 — B
        'O texto diz que o segredo da amizade é achar pessoas **melhores do que você** (mais gentis, generosas, que perdoam) e aprender com elas. "Teach" (ensinar) mostra que o desafio é **reconhecer e valorizar o que os amigos sabem** e podem nos ensinar.\n\n' +
        'Por que não as outras: o texto não fala de amizade falsa (A), não pede amigos parecidos com você, e sim melhores (C), não manda superar os amigos (D) e não cita amigos autoritários (E).',
        // 2 — A
        'O eu lírico "entra" no livro, vive aventuras (capa, anel, dragão, rei) e, ao sair, tudo em volta continua igual, **mas agora ele carrega um livro dentro de si**. A leitura o mudou por dentro: é o **potencial transformador da leitura**.\n\n' +
        'Pista: o contraste do fim, em que a casa e a cadeira estão iguais, mas ele não. Não há leitura em grupo (B), aula (C), nem defesa de clássicos (D). E a experiência é bem subjetiva, o contrário de "objetiva" (E).',
        // 3 — E
        'A repetição de "one" (um só mundo, um só povo, uma só filha) insiste que **o que acontece com qualquer pessoa acontece com todos nós**. Isso é o **princípio da empatia**: sentir a dor do outro como se fosse nossa.\n\n' +
        'Armadilha: as palavras "daughter, father, mother" fazem pensar em família (A), mas a autora usa a família como imagem de toda a humanidade, e não de um laço de sangue.',
        // 4 — D
        'O eu lírico se apresenta como mistura: caribenho, porto-riquenho, judeu, nascido nos EUA, filho e neto de imigrantes, que pensa em inglês e sente em espanhol, e cuja primeira língua foi o "Spanglish". Tudo isso mostra uma **formação intercultural**.\n\n' +
        'Por que não as outras: ele diz que não é europeu (A). Os guetos e a comida aparecem só como parte da mistura, sem ser o foco (B, C). E ele não prioriza uma cultura sobre a outra (E).',
        // 5 — C
        'O texto fala direto com o leitor ("you"), usa o exemplo do lanche (não escolher não impede que alguém escolha por você) e termina com orientações: prazos, cadastro, onde votar. O objetivo é **convencer o jovem a votar**.\n\n' +
        'Armadilha: as dicas práticas fazem parecer que o texto quer explicar regras eleitorais (A). Mas elas servem ao convite principal, que é votar.',
      ],
      espanhol: [
        // 1 — A
        'Na tirinha, as pessoas compram celular, carro, roupa de grife, fazem plásticas e pilates, tudo "para parecer" alguma coisa. No último quadro, vão ao shopping comprar um livro de autoajuda que diz que "o importante não é o **envase**" (a embalagem), e sim o que está dentro. A contradição entre o que dizem e o que fazem é a **hipocrisia em relação ao valor dado à imagem**.\n\n' +
        'Pista: "envase" é a aparência. A crítica é a todos os quadros juntos, não só à tecnologia (E), ao luxo (D) ou ao envelhecimento (C).',
        // 2 — A
        'O porquinho-da-índia ganha a porta aberta e, em vez de sair, fica agarrado às grades, "tremendo de susto da liberdade". O texto se chama "El miedo": a reflexão é sobre o **medo diante do novo**, de mudar, mesmo quando a mudança é boa.\n\n' +
        'Armadilha: parece um texto sobre bichos (B, D), mas o animal é uma imagem das pessoas que preferem a "jaula" conhecida.',
        // 3 — C
        'A canção diz "eu não cruzei a fronteira, a fronteira me cruzou" e lembra os indígenas e espanhóis que formaram o continente antes dos anglo-saxões. Por isso "somos mais americanos": é a **reafirmação de que o povo hispânico sempre esteve na formação da América**.\n\n' +
        'Armadilha: a canção cita os "oito estados" tirados do México, mas não exige devolvê-los (E). E a crítica à fronteira (D) é só um argumento a serviço da ideia central.',
        // 4 — B
        'Quase todas as palavras do microconto começam com "a" e vêm em fila, sem frases completas. Mesmo assim dá para seguir a história: o advogado sedutor vira agressivo, mata, é preso e absolvido por "legítima defesa". É o **encadeamento de palavras relacionadas que monta a sequência narrativa**.\n\n' +
        'Por que não as outras: há verbos ("arremete, ataca, asesina"), e a mensagem se entende (C). Os adjetivos não exaltam o personagem, pelo contrário (E). O "¡Ay!" final comenta a história, sem mudar o sentido dela (D).',
        // 5 — D
        'A icterícia deixa a pele amarela e é um **sintoma**, que se vê mas ninguém leva a sério. O resenhista diz que a sociedade da Guatemala também "sofre de icterícia" por causa de tanta violência. Então "dias amarelos" e "icterícia social" falam da **condição social de um povo marcado pela violência**.\n\n' +
        'Armadilha: o texto fala de doença de verdade (o alcoolismo do personagem), mas a pergunta é sobre o sentido figurado. Por isso não é a E.',
      ],
      6: 'O texto 2 diz que a dança contemporânea rompeu com o padrão tradicional ao valorizar **corpos não treinados** e ampliar o que conta como "corpo que dança". A foto do texto 1 reforça isso. A resposta é a **diversidade de corpos dançantes**.\n\n' +
         'Por que não as outras: o texto fala em ruptura com o clássico, não em retomada (A). Não fala de palco (B) nem de figurino (E), e não se opõe às danças populares (C).',
      7: 'A artista imprime fotos de cidades em **cartelas de remédio**, um objeto comum, que perde a função de embalagem e vira suporte de arte. A "transformação" de que ela fala é essa: o objeto deixa de ser o que era. Por isso, **objetos do cotidiano retirados da função original e recolocados como arte**.\n\n' +
         'Armadilha: remédio faz pensar em "cidade doente" (A). Mas a pergunta é sobre o modo de fazer arte, e a artista explica que "ruína" para ela é transformação, não destruição.',
      8: 'O texto mostra que cada língua organiza o tempo, o espaço e os números de um jeito próprio, e que muitas estão sumindo. Estudar essas línguas serve para **reconhecer e valorizar a diversidade** que elas guardam.\n\n' +
         'Por que não as outras: a pesquisa não quer diminuir as diferenças (B) nem ensinar outros idiomas (E), que é justamente o que ameaça essas línguas. E não ensina nada aos próprios falantes (A).',
      9: 'No trecho de "Menino de engenho", as mulheres **respondem pelos maridos**, inventam desculpas para protegê-los, ouvem ameaças do coronel, parem em cama de vara e uma delas foi **abandonada** pelo marido logo depois do parto. Tudo mostra mulheres em posição de submissão por serem mulheres: a **persistência da sujeição em função do gênero**.\n\n' +
         'Armadilha: aparecem doença e fome (E), mas a pergunta é sobre os marcadores sociais da condição feminina, não sobre saúde pública.',
      10: 'O "romance de 30" (José Lins do Rego, Graciliano, Rachel de Queiroz) retrata o Nordeste, a seca e as relações de poder no campo. No trecho, o coronel ameaça botar fogo nas casas, os moradores falam de **chapéu na mão** e devem dias de trabalho no "eito". É a **subserviência no latifúndio**.\n\n' +
          'Por que não as outras: quem tem apego às matas é o avô, o dono da terra, e não o trabalhador (A). O texto também não conta a origem dos engenhos (D).',
      11: 'Marca regional é palavra ou expressão típica de uma região. "**Cabra safado**", em que "cabra" quer dizer "sujeito, homem", é bem nordestino.\n\n' +
          'Por que não as outras: "Boto pra fora" e "Estamos morrendo de fome" são informais, mas se falam no Brasil todo. A e E são frases do narrador, em linguagem padrão.',
      12: 'O pretérito imperfeito ("levava", "gostava", "acudia") conta o que **acontecia sempre, por um tempo, no passado**. É o tempo das lembranças: "meu avô me levava…". Por isso ele constrói uma **imagem memorialista**: um adulto recordando a infância no engenho.\n\n' +
          'Dica para outras provas: o imperfeito descreve hábitos e cenários do passado; o perfeito ("levou") conta uma ação que começou e acabou.',
      13: 'O narrador reproduz o jeito de falar dos moradores ("pra semana", "seu coronel", "Santa Luzia me cegue", "danou-se"). A beleza do texto está em **dar voz ao jeito de falar do grupo retratado**.\n\n' +
          'Armadilha: a E fala em avô "idealizado", mas o texto mostra o avô também ameaçando e gritando, sem idealizá-lo.',
      14: 'O texto repete que tudo no futebol se mede por números e retorno financeiro, que "quem comanda é o dinheiro" e que os investidores decidem. O futebol virou negócio: é **regido pelo capital**.\n\n' +
          'Armadilha: a imprensa aparece na lista de agentes (C), mas o texto dá o papel principal ao dinheiro e aos investidores.',
      15: 'O texto apresenta o problema (plástico nos oceanos) e termina com chamadas como "Juntos é possível!" e "Assine a petição!". O objetivo é fazer o leitor **aderir à campanha**.\n\n' +
          'Armadilha: o texto até alerta sobre o plástico (C), mas diz que o problema não se resolve só com atitudes individuais. Ele não pede para usar menos plástico: pede a assinatura.',
      16: 'O infográfico só traz **resultados**: bilhões investidos, milhares de projetos e empresas, e o dado da FGV de que cada R$ 1 investido volta como R$ 1,59 para a sociedade, com um impacto total de R$ 49,8 bilhões. Tudo serve para mostrar o **tamanho dos efeitos positivos** da lei.\n\n' +
          'Armadilha: ele não pede dinheiro a ninguém (A) e não cria nem regula regras (B, D). Os números estão ali para convencer de que a lei funciona.',
      17: 'O texto diz que a motivação para se exercitar vem de uma "interação complexa" de fatores **psicológicos, sociais, ambientais e até genéticos**. Isso é o mesmo que a E: fatores **socioambientais, biológicos e psíquicos**.\n\n' +
          'Armadilha: a B fala só em superação individual, mas o texto insiste que as forças sociais também contam. É o "só" que deixa a alternativa errada.',
      18: 'Resenha é um texto que resume uma obra **e dá opinião** sobre ela. "Ferino" quer dizer afiado, mordaz: chamar o humor de ferino é um **julgamento** do resenhista, e não um fato da história.\n\n' +
          'As outras só informam: quando a obra surgiu (A), o que uma personagem faz (B, C) e o que a geração faz (E).',
      19: 'O poema imita uma **lei ou decreto** ("Nenhum professor ou aluno será obrigado…") para responder, com ironia, a um projeto que tornava obrigatório o ensino de "literatura brasiliense". A conclusão é que poesia obrigatória vira burocracia. O alvo é a **imposição da literatura nas escolas**.\n\n' +
          'Armadilha: o poema não avalia se a literatura de Brasília é boa (A). Ele critica a obrigação.',
      20: 'No texto 1, Clarice diz que gostaria de ser lida por quem tem "alma formada", que se aproxima aos poucos e entende que o livro não tira nada de ninguém, e fala de uma "alegria difícil". No texto 2, um leitor conta que a leitura foi avassaladora e mudou tudo nele. O leitor viveu **exatamente a leitura que a autora desejava**.\n\n' +
          'Armadilha: a C ("seletividade") pega o "apenas por pessoas de alma formada". Mas a pergunta é sobre a aproximação dos dois textos, e o que os une é o desejo da autora realizado no leitor.',
      21: 'O texto explica palavras da região: banzeiro, pororoca, pataqueira, priprioca. Ao usar esse vocabulário nas músicas, Dona Onete **valoriza o jeito de falar e as coisas do Pará**: a **identidade linguística paraense**.\n\n' +
          'Armadilha: a D fala em "reflexão sobre a variedade linguística", mas a música não discute a língua, apenas a usa com orgulho. A regravação por outra cantora (E) é uma consequência, e não o que a pergunta pede.',
      22: 'A função referencial é a que **informa**, com foco no assunto. O artigo diz quais são os **fundamentos** (as bases) do uso de tecnologia por crianças: proteção integral, segurança, educação digital… Ou seja, ele **determina princípios legais**.\n\n' +
          'Armadilha: D e E parecem certas porque falam de lei e tecnologia, mas este artigo não diz o que se pode ou não fazer na internet. Ele lista os princípios que vão guiar as regras.',
      23: 'Quarta capa é a parte de trás do livro. O texto resume a história (o planeta, o baobá, a viagem) e diz por que vale a pena ler ("uma delicada história sobre…"). É para isso que ela serve: **destacar os aspectos que chamam o leitor**.\n\n' +
          'Armadilha: o título lembra "O Pequeno Príncipe", mas o texto não compara as obras (B). O nome do autor e o do personagem até aparecem (A, E), mas não são a característica principal do texto.',
      24: 'O texto 1 conta que Renina Katz não seguiu o concretismo nem o neoconcretismo, os grandes debates sobre arte abstrata dos anos 1950. Ela seguiu a **própria intuição** e fez uma arte "relativamente abstrata", em que só sobram alusões à paisagem. "Dilúvio" mostra isso: manchas, camadas de cor e linhas, com algo que lembra chuva e terra. É uma **construção abstrata guiada pela subjetividade** da artista.\n\n' +
          'Armadilha: a B fala em "desenho de paisagens", mas na obra a paisagem é só sugerida, e não desenhada para ser contemplada.',
      25: 'A narradora olha de pertinho o chão da mata: cogumelos, uma abelha, uma aranha, a saúva, um besouro e uma folha estranha. Tudo é descrito com imagens poéticas (a folha é "uma pequena foice ensanguentada"). A singularidade é a **descrição poética de um mundo minúsculo**: o microcosmo.\n\n' +
          'Armadilha: a cena da aranha e da saúva (D) é só um detalhe. E os seres são reais, mesmo vistos de um jeito fantástico (A).',
      26: 'O texto diz que a técnica dela estava boa e que faltava **velocidade na corrida** antes do salto. Correr mais rápido depende de os músculos das pernas empurrarem o chão com mais potência, ou seja, de **força**. Entre as opções, é a capacidade física ligada à velocidade.\n\n' +
          'Armadilha: coordenação (A) é a técnica, que já estava certa. Resistência aeróbia (B) serve para esforços longos, e o salto dura segundos.',
      27: 'A Bienal de Veneza acontece na Itália, centro da arte europeia, e o tema era "Estrangeiros por toda a parte". Pôr na fachada principal a pintura de um povo indígena que "já foi tratado como estrangeiro no próprio território" dá **visibilidade à arte indígena num espaço historicamente eurocêntrico**.\n\n' +
          'Armadilha: o tamanho da obra (D) e a Amazônia (A) aparecem, mas não são o motivo da relevância.',
      28: 'A mulher do poema retoma Eva, mas não como a culpada do mito. Ela exige "ser dona de seu destino e cantar o próprio hino", escreve a si mesma e grita o próprio nome. É o feminino que **conquista a soberania**, o poder sobre a própria vida.\n\n' +
          'Armadilha: ela fala de ser mãe (B) e de vaidade (E), mas como partes de uma mulher inteira que decide por si, sem idealizar nada.',
      29: 'Em "Calabar" (escrita na ditadura e censurada), o soneto mostra alguém com o coração "sereno" e mãos que golpeiam rápido: há "distância entre intenção e gesto", e a mão executa depressa "senão o coração perdoa". É o retrato de quem **pratica a repressão escondendo de si mesmo o que faz**: dissimular práticas de repressão.\n\n' +
          'Armadilha: a A pensa no Chico Buarque como artista de resistência. Mas a pergunta é sobre o eu lírico do soneto: o comandante Mathias, que está do lado de quem reprime.',
      30: 'Antes da metáfora, a autora diz que os efeitos da conexão o tempo todo "ainda são um mistério". A emergência **sem máscaras de oxigênio** é estar em perigo sem as instruções nem a proteção que existem num avião: ninguém sabe ainda o que fazer. A metáfora mostra a **incerteza sobre as consequências**.\n\n' +
          'Armadilha: a história do Japão (D) é só o começo do texto, e o isolamento (C, E) não é o foco da metáfora.',
      31: 'Para mostrar que o racismo é estrutural, o texto junta vários dados da realidade: a escravidão, o segundo maior contingente negro do mundo, a desvantagem no trabalho e na renda (sobretudo das mulheres negras), a discriminação mesmo com ascensão e as estatísticas de violência. É um **panorama social**.\n\n' +
          'Armadilha: a Nigéria aparece (D), mas só para dar o tamanho da população, sem comparar condições de vida. O texto também cita a omissão do Estado, mas não diz que não há políticas (E).',
      32: 'Na **norma-padrão** do português, o plural masculino ("revisores") vale para grupos mistos. Dar ao evento um nome no feminino, sendo a plateia mista, **foge dessa regra**, por isso causaria estranhamento, mesmo com 82% de mulheres.\n\n' +
          'Armadilha: a C ("exclusão dos homens") é a pergunta que a autora faz no fim, e não a causa do estranhamento.',
      33: 'O texto começa com o que todo mundo faz (redes, vídeos, IA) e mostra o que "nem todo mundo vê": o gasto enorme de **energia e de água** dos data centers. O objetivo é **alertar para o impacto ambiental** desses hábitos.\n\n' +
          'Armadilha: o texto até descreve o crescimento da tecnologia (E), mas para chegar ao alerta. E ele pede máquinas mais eficientes, e não mais potentes (B).',
      34: 'A aluna explica a novidade: os apps que existiam eram para os **pacientes**, que com o tempo perdem a capacidade de usá-los. O HelpAlz foi feito para a **família que cuida** e acompanha a pessoa com Alzheimer. O diferencial é dar **suporte ao acompanhamento** dos pacientes.\n\n' +
          'Armadilha: o app ajuda no diagnóstico precoce (C), mas o que o texto aponta como inovação é o foco nos familiares.',
      35: 'O texto mostra os dois lados: TV e jogos melhoram o foco, e as redes sociais pioram a atenção e o humor. E conclui que "as telas não são o problema em si", o que importa é escolher bem. É a defesa do **equilíbrio no uso**.\n\n' +
          'Armadilha: A, B e E pegam um resultado da pesquisa (TV, jogos, esforço cognitivo) e o transformam em conselho, mas o texto não defende nenhum deles sozinho.',
      36: 'A postagem manda "eliminar expressões capacitistas" e dá exemplos ("se fazer de surdo", "dar uma de João sem braço", "deu mancada"). O objetivo é **alertar que essas falas do dia a dia são pejorativas** com pessoas com deficiência.\n\n' +
          'Armadilha: a A e a C falam em como se referir às pessoas com deficiência ou se comunicar com elas, mas a postagem mostra o que não dizer, e não como dizer.',
      37: 'Nas duas telas, Portinari pinta crianças e jovens **brincando ao ar livre**: na gangorra, num caso, e jogando bola num campo de terra, no outro. São cenas simples, de liberdade, ligadas à infância dele no interior de São Paulo: **vivências infantojuvenis com liberdade e simplicidade**.\n\n' +
          'Armadilha: Portinari é modernista, e não impressionista (B). E o tema comum é a brincadeira, e não a paisagem (E).',
      38: 'A autora faz várias perguntas ("Você já pensou num mundo sem linguagem?", "Por que fazemos isso?", "seria uma questão de tudo ou nada?") e mostra que há quem responda sim e quem responda não. As perguntas servem para **fazer o leitor pensar**, apresentando as opiniões que divergem.\n\n' +
          'Armadilha: o texto não traz as respostas no fim (A), ele termina com outra pergunta. E a autora não está em dúvida (C): pergunta para provocar.',
      39: 'O cartaz junta a palavra "**Desacelere**" com o desenho de um **velocímetro** com o ponteiro baixo e a imagem de um pai com o filho na cadeirinha. Palavra e imagem dizem a mesma coisa: andar devagar protege quem importa. O objetivo é **conscientizar sobre a velocidade**.\n\n' +
          'Armadilha: a criança na cadeirinha leva à B e à D, mas o centro do cartaz é o velocímetro. E o cartaz pede, sem estabelecer uma regra (E).',
      40: 'O texto diz que os detectores analisam a estrutura das frases, a escolha de palavras e o estilo, para "reconhecer **padrões típicos** de textos produzidos por IA". A resposta está escrita no próprio texto: **padrões de escrita**.\n\n' +
          'Armadilha: a originalidade (C) é o que a academia valoriza, e não o que o detector procura.',
      41: 'Harari lembra que a TV foi feita para vermos de longe, mas logo ela vai **nos ver**: as plataformas vão conhecer a nossa personalidade, **manipular as nossas emoções** e até decidir por nós. A reflexão se apoia no uso da tecnologia para **influenciar as pessoas**.\n\n' +
          'Armadilha: o cinema aparece (Tarantino), mas só como exemplo, sem comparação (B).',
      42: 'As mulheres foram deixadas de fora porque, para o idealizador dos Jogos, esporte era "coisa de homens por motivos culturais". Depois só podiam jogar esportes "bonitos", sem contato, e nem ganhavam medalha. São barreiras criadas pela **sociedade e pela época**: **sócio-históricas**.\n\n' +
          'Armadilha: a B ("física") pega o "sem contato físico". Mas a regra vinha de preconceito, e não de alguma limitação do corpo das mulheres.',
      43: 'O texto 1 é um conto angolano com o verbo "**matabichar**" (tomar o café da manhã). O texto 2 explica de onde vem a palavra ("mata-bicho" em Angola). O que marca a variedade angolana nos dois é um **vocábulo específico**.\n\n' +
          'Armadilha: a A ("neologismo") parece certa, mas a palavra já existe e está nos dicionários. Não é uma criação nova.',
      44: 'Para provar que há desigualdade **hoje**, a autora lembra que a ONU precisou criar o Dia Internacional das Mulheres e Meninas na Ciência para buscar uma participação igualitária, e mostra que, mesmo assim, só 30% das universitárias escolhem STEM. A **meta da ONU** é a prova de que o problema existe e foi reconhecido.\n\n' +
          'Armadilha: a frase de Bourdieu (A) fala da ciência fechada em si mesma, e não de gênero. E o texto não diz que as meninas desconhecem as carreiras (B).',
      45: 'A ironia está na inversão: é o **robô** que pergunta se a resposta dele vai ser usada para treinar uma IA, uma preocupação que hoje é **das pessoas**. A charge mostra a máquina preocupada com o uso dos próprios dados e, com isso, ri do nosso comportamento.\n\n' +
          'Armadilha: a D só descreve a cena (um homem e um robô conversando), sem dizer onde está a ironia.',
      // Ciências Humanas. As questões 46 a 50 usam o mesmo texto (Lilia Schwarcz, "O espetáculo das raças"), na página 20.
      46: 'O texto conta que os viajantes vinham buscar coleções de **flora, fauna** e cultura, e que o Brasil era "local privilegiado" para conseguir esse material. O que as colônias tropicais tinham de sobra era **natureza variada**: zona climática com elevada biodiversidade.\n\n' +
          'Armadilha: a B (economia agrícola exportadora) é verdade sobre as colônias, mas não explica por que elas enchiam os museus.',
      47: 'Cientistas pagos por instituições europeias vinham ao Brasil, recolhiam peças e as levavam para museus da Europa. Depois, os museus daqui viraram "casa" para esses viajantes. Isso forma **redes internacionais de circulação de coleções**.\n\n' +
          'Armadilha: a A fala em proteger saberes "locais", mas quem decidia o que coletar eram os estrangeiros.',
      48: 'A autora chama esses cientistas de **"filósofos viajantes"**, que comparam e classificam plantas, animais e povos. Isso lembra os **pré-socráticos**, os primeiros filósofos gregos, que buscavam explicar a natureza (a "physis").\n\n' +
          'Armadilha: a D (tradição cartesiana, método) parece "ciência", mas a comparação do texto é com quem investiga a natureza, e não com quem cria um método.',
      49: 'O texto liga os museus à "memória escrita e figurada" e ao espírito comemorativo, na mesma época em que nascem os Arquivos Nacionais. O Museu Nacional começou como um "arquivo de coleções e curiosidades". Ou seja, os museus **dão outro sentido à ideia de arquivo**: além de papéis, guardam objetos como memória.\n\n' +
          'Armadilha: as outras trazem palavras fortes (eugenia, pluralidade étnica), mas o trecho citado fala de memória e arquivo.',
      50: 'O texto diz que os museus etnológicos organizavam a cultura "submetida a uma **lógica evolutiva**" e guardavam o "mundo extraeuropeu", com a ideia de que essas culturas iam desaparecer. Ver os povos como etapas de uma evolução que termina na Europa é ser **evolucionista e etnocêntrico**.\n\n' +
          'Dica: etnocentrismo é julgar as outras culturas a partir da sua, tomada como medida.',
      51: 'Hobbes e Rousseau são **contratualistas**: para eles, o poder do soberano vem de um acordo (contrato) entre as pessoas. Hobbes fala dos homens que "concordam entre si" em se submeter, e Rousseau discute como a soberania não pode ser dividida. Os dois tratam de **onde vem a legitimidade do poder**.\n\n' +
          'Armadilha: a E (poder divino do rei) é justamente o que os contratualistas rejeitam.',
      52: 'O texto mostra que as associações de trabalhadores eram crime, que a greve era delito e que, com os sindicatos, o movimento operário **exigiu que os direitos valessem de verdade e para mais gente**. Isso é a **promoção de conquistas sociais**.\n\n' +
          'Armadilha: a C ("flexibilização" das leis) quer dizer afrouxar direitos, o contrário do que os operários buscavam.',
      53: 'A energia solar é vendida como **sustentável**, mas os painéis duram de 25 a 30 anos e viram sucata com chumbo e outros poluentes. A contradição é entre o **discurso de sustentabilidade e os impactos ambientais** que ela mesma gera.\n\n' +
          'Armadilha: o texto até lembra que há metais valiosos para reciclar, mas não fala de mercado estagnado (A) nem de falta de recursos (B).',
      54: 'Brecht diz que os grandes criminosos políticos devem ser expostos "**especialmente pelo ridículo**", e Chaplin fez isso com Hitler em "O grande ditador". Ridicularizar desmonta a imagem de "grande homem" e leva o público a **reprovar a conduta de quem está no poder**.\n\n' +
          'Armadilha: Walter Benjamin aparece no texto 2, o que leva à B, mas a pergunta é sobre a função ética do ridículo.',
      55: 'O texto diz que a terra é "**nossa mãe**, que nos acolhe, alimenta, fortalece", e que a vitória deve ajudar outros povos. O argumento é que a terra pertence aos indígenas pelo **vínculo antigo e sagrado** com ela: a ancestralidade do território.\n\n' +
          'Armadilha: "alimenta" pode levar à A (produtividade), mas a terra aqui não é vista como fonte de lucro.',
      56: 'Segundo o texto, o capitalismo precisa se **expandir sempre** e depende da produção de "valor excedente". A natureza vira "meio universal de produção". O objetivo de transformá-la é a **multiplicação do lucro privado**.\n\n' +
          'Dica: "valor excedente" (mais-valia) é o lucro na teoria de Marx, que o autor usa.',
      57: 'O estudo mostra que, na Amazônia, o desmatamento nas florestas dos povos nativos ficou **abaixo de 1%**, contra 7% fora delas, e que a tradição os torna capazes de manejar a floresta. A prática deles está ligada à **conservação da biodiversidade**.\n\n' +
          'Armadilha: a D ("criação de reserva") é algo que o governo faz. O texto fala do modo de viver dos povos.',
      58: 'Antonil critica os senhores que não deixam os escravizados casarem, separam os casados, deixam muitos sem batismo e não ensinam a fé a quem foi batizado. A crítica é à **condição da cultura cristã** numa sociedade de **dominação escravista**, em que o senhor decide até a religião do escravizado.\n\n' +
          'Armadilha: a B fala de "cerimônias de casamento", mas o problema apontado não é a cerimônia, e sim o descaso dos senhores.',
      59: 'Epicteto é **estoico**. Ele ensina a amar as pessoas lembrando que elas são mortais, como uma taça que pode quebrar, para não sofrer quando perdê-las. É um conselho para a **vida prática**, para lidar com a dor e a existência. As filosofias do período helenístico (estoicos, epicuristas) buscavam isso: viver bem e em paz.\n\n' +
          'Armadilha: B e E falam de lógica e dedução formal, que não aparecem no trecho.',
      60: 'O texto 1 é o anúncio de **uma parteira ginecologista diplomada em Medicina** em Boston, com consultório e telefone: uma mulher trabalhando **em público**. O texto 2 diz que a revista ensinava casamento, amor e família, o lugar da mulher em casa, a esfera **privada**. A ordem é pública e privada.\n\n' +
          'Armadilha: a D (política e sentimental) troca a profissão por "política", que o anúncio não tem.',
      61: 'Tecnologia social nasce de quem vive o problema: valoriza saberes locais e ancestrais e serve à população vulnerável, como as cisternas na favela. A ideia é que a própria comunidade resolva seus problemas: **estimular a autonomia dos povos**.\n\n' +
          'Armadilha: a C ("hierarquia dos saberes") é o contrário do texto, que tece saberes ancestrais e acadêmicos juntos.',
      62: 'As ordens mendicantes (franciscanos e dominicanos), nos sermões, divulgavam que "a mulher é um ser **predestinado ao mal**" e que era preciso vigiá-la. É uma **misoginia de base religiosa**, que ligava a mulher à desordem moral.\n\n' +
          'Armadilha: C e D falam de participação política e espaço público, o oposto do controle que o texto descreve.',
      63: 'O texto mostra que os ciganos sobrevivem numa sociedade "que não os deseja", graças a uma visão de mundo parecida e à **proteção mútua**. Incluir sem apagar essa identidade exige **políticas que assegurem a identidade coletiva**.\n\n' +
          'Armadilha: A, B, C e E pedem que eles deixem de ser quem são (largar práticas ancestrais, parar de se deslocar, mudar a língua), e isso é assimilação, não inclusão.',
      64: 'O mapa mostra o petroleiro saindo da rota normal e passando colado no litoral do Irã, e o pesquisador diz que ele devia estar "respondendo a instruções do Irã". Num estreito em guerra, por onde passa o petróleo do mundo, a rota depende de **acordos entre países com interesses estratégicos**.\n\n' +
          'Armadilha: OTAN (A), cortes (B), blocos econômicos (D) e ONU (E) não aparecem no texto.',
      65: 'As duas canções são de 1979. "O bêbado e a equilibrista" fala da "volta do irmão do Henfil" (o sociólogo Betinho, exilado) e de "tanta gente que partiu". "Tô voltando" fala de alguém voltando para casa. Era o tempo da **Lei da Anistia**, quando se esperava a **volta dos exilados** pela ditadura.\n\n' +
          'Armadilha: a D (Constituinte) é de 1987-88, quase dez anos depois.',
      66: 'Os dois textos descrevem **movimentos religiosos indígenas**: no Brasil do século XVI, um "santo" prometia que os velhos ficariam jovens e a comida nasceria sozinha. Na América do Norte do século XIX, Wovoka pregava a dança para trazer de volta a caça e os mortos. Os dois **ressaltam práticas originárias** (dança, ritos próprios) diante da colonização.\n\n' +
          'Armadilha: a C (sincretismo) seria misturar com o cristianismo, e o que os textos mostram são crenças indígenas.',
      67: 'O texto aponta barreiras diferentes: dinheiro, estudo, isolamento e preconceito ("como se eu fosse atrasada por ser indígena"). As universidades aumentaram o acesso, mas não dão conta das **realidades específicas** desses alunos: as **políticas de permanência são insuficientes**.\n\n' +
          'Armadilha: a A ("proficiência linguística") não aparece. A dificuldade citada é preconceito, e não língua.',
      68: 'O autor diz que estudar um gabinete de leitura **não é o mesmo** que estudar uma biblioteca: a biblioteca era só uma parte, e o gabinete também tinha debates, saraus, jornais e sócios. A comparação mostra o **distanciamento de objetivos** entre as duas instituições.\n\n' +
          'Armadilha: a E diz o contrário ("padronização"), e o texto não fala de títulos subversivos (C) nem de religião (D).',
      69: 'Jean Améry, sobrevivente do nazismo, diz que o ressentimento "suspende o tempo" para que o criminoso **fique ligado ao seu crime** e o reconheça. Só assim ele "poderá se relacionar com sua vítima como um semelhante". O ressentimento abre caminho para **reconstruir a relação**.\n\n' +
          'Armadilha: a C (vingança) é a leitura comum de "ressentimento", mas o texto fala em fazer o criminoso enxergar o crime, e não em revidar.',
      70: 'O mar avança porque o Rio Paraíba do Sul chega fraco ao delta, sem força para levar areia e segurar o mar. E ele chega fraco por causa de **desvios de água para cidades, indústrias e agricultura**. Ação humana é **agente antrópico**.\n\n' +
          'Armadilha: B e C (clima, chuva) parecem óbvias quando o assunto é o mar, mas o texto aponta o principal motivo, e é humano.',
      71: 'O texto 1 mostra que a ciência já pode escolher características dos filhos (altura, músculos, sexo). O texto 2 defende aceitar os filhos como vierem, porque as qualidades deles são **imprevisíveis** ("abertura para o inesperado"). O conflito existe porque, até agora, **ninguém escolhe como nasce**: a natureza humana é indeterminada.\n\n' +
          'Armadilha: a A (biotecnologia) é o contexto do debate, e não o pressuposto que o sustenta.',
      72: 'A pesca artesanal é ensinada **de boca em boca** e se firmou na prática. Os instrumentos (caçoeira, jiqui, tarrafa) são feitos para cada tipo de peixe, até com varas de coqueiro. São saberes **alicerçados na interação com a natureza**.\n\n' +
          'Armadilha: as outras (global, comércio, empresas, indústria) falam de ligações com o mercado que o texto não menciona.',
      73: 'Os iluministas (Voltaire, Rousseau, Diderot, D\'Alembert) queriam **educar** e usaram a mídia da época para espalhar ideias. Diderot e D\'Alembert organizaram a **Enciclopédia** (literatura científica), e as ideias corriam também em **panfletos** baratos.\n\n' +
          'Armadilha: sermões religiosos (A) eram o meio da Igreja, que os iluministas criticavam.',
      74: 'Cerca de **três quartos** do lixo vai para aterros sanitários, que são obras de engenharia, com manta no fundo e tratamento do chorume, para não contaminar solo e água. A forma predominante vem do uso de **sistemas técnicos para reduzir a contaminação**.\n\n' +
          'Armadilha: coleta seletiva (A) e reciclagem (B) não aparecem: o texto fala só de onde o lixo é jogado.',
      75: 'Patrimonialismo é quando o governante trata o que é **público como se fosse seu**. Se o poder serve ao interesse pessoal, o resultado é a **subjugação do interesse coletivo**.\n\n' +
          'Armadilha: a A fala em mais democracia, o contrário do que um poder tratado como propriedade produz.',
      76: 'Os centros do MST formam agricultores para levar a agroecologia aos **assentamentos da reforma agrária**, aqui e em países vizinhos. Isso fortalece quem conseguiu terra e ajuda a mudar quem tem terra e como ela é usada: a **transformação da realidade fundiária**.\n\n' +
          'Armadilha: a D (valorizar a propriedade privada) contradiz a reforma agrária, que redistribui terras.',
      77: 'Aristóteles diz que, se depende de nós agir, também depende de nós não agir. Então ser virtuoso ou vicioso **está em nosso poder**. Daí vem a ideia central da ética dele: somos **responsáveis pelas nossas escolhas** e pelas consequências delas.\n\n' +
          'Armadilha: A, B e D jogam a culpa para fora (acaso, outras pessoas, deuses), o contrário do que o texto afirma.',
      78: 'Os mosteiros deveriam ser lugares de fuga do mundo, mas viraram refúgio **da nobreza**, e os humildes entravam só em posição inferior. Dentro deles se repetia a hierarquia de fora: eram **reproduções das relações externas**.\n\n' +
          'Armadilha: a B (devoção ascética) era o motivo de existirem os mosteiros, mas a pergunta é sobre o tratamento desigual.',
      79: 'Tia Eva foi uma mulher ex-escravizada que fundou um **quilombo urbano** em 1905, hoje com 250 famílias descendentes. Tombar o quilombo é reconhecer, em nível nacional, a **memória da resistência negra**.\n\n' +
          'Armadilha: a E (movimento abolicionista) fala da luta pelo fim da escravidão, e o tombamento celebra a comunidade construída pelos próprios ex-escravizados.',
      80: 'O pesquisador explica que o Brasil produz muito, mas sobretudo **commodities para exportação e ração**, e não comida para as pessoas. Quem planta alimento para a mesa é sobretudo a **agricultura familiar**. Dar crédito a ela ajuda a combater a fome.\n\n' +
          'Armadilha: a C (incentivo ao agroexportador) aumentaria justamente o que causa o problema.',
      81: 'A Brazil Railway Company ganhou terras ao longo da ferrovia, trouxe imigrantes e madeireiras, e os **caboclos e posseiros** que viviam ali foram expulsos. Isso ajudou a provocar a Guerra do Contestado. A "modernização" **prejudicou as comunidades locais**.\n\n' +
          'Armadilha: a E cita a imigração, que existiu, mas o centro do conflito foi a expulsão de quem já vivia na região.',
      82: 'O "milagre" e as grandes obras da ditadura foram pagos com **empréstimos estrangeiros**. Quando os juros internacionais subiram (fim dos anos 1970), a dívida explodiu, faltou dinheiro e veio a "década perdida", com inflação alta e indústria parada. A causa é a **ampliação do endividamento externo**.\n\n' +
          'Armadilha: a A (privatizações) aconteceu depois, nos anos 1990.',
      83: 'O texto fala de áreas rurais que foram ganhando **elementos urbanos** na economia, na cultura e nas relações sociais. Uma causa disso é a **evolução da comunicação**: TV, celular e internet levam o modo de vida urbano ao campo, mesmo sem a cidade crescer até lá.\n\n' +
          'Armadilha: a A (conurbação) é quando duas cidades se juntam, e não a mistura entre campo e cidade.',
      84: 'Nos anos 1920-30, a FBPF lutava pelo **direito de votar**. Hoje, as mulheres são 53% do eleitorado, mas minoria nos cargos eleitos. Nos dois momentos, a reivindicação é estar onde se decide: **participação na esfera decisória**.\n\n' +
          'Armadilha: a E (mobilizar a opinião) é um meio usado pelo movimento, e não o que ele reivindica.',
      85: 'Bachelard descreve a casa da cidade grande como "caixas superpostas", localizada por **número e andar**, sem raízes, com elevador no lugar da escada, fora da natureza. É a moradia transformada em espaço geométrico, calculado: a **racionalização dos espaços urbanos**.\n\n' +
          'Armadilha: o elevador pode levar à A (tecnologias assistivas), mas ele aparece como símbolo da casa sem alma, e não como acessibilidade.',
      86: 'O gráfico mostra que as maiores reservas de terras-raras estão na **China, no Brasil e na Índia**, países emergentes. Esses minerais são essenciais para eletrônicos, ímãs e energia limpa. Quem tem as reservas ganha poder nas relações entre países: **soberania geopolítica**.\n\n' +
          'Armadilha: a C diz que o domínio ficaria com os países centrais, mas o gráfico mostra as reservas fora deles (os EUA têm pouco).',
      87: 'Nas reduções jesuíticas, os guaranis passaram a viver em casas fixas, plantar em campos e cuidar do gado. Isso transformou os indígenas em **trabalhadores para a economia colonial**: disponibilizou força produtiva para a economia local.\n\n' +
          'Armadilha: a C ("liberdade de crença") é o contrário: as reduções existiam para catequizar.',
      88: 'No sertão do São Francisco, o clima é quente e seco. Quando se irriga demais, a água **evapora e deixa os sais no solo**, que vai ficando salgado e infértil: é a **salinização**. O gotejamento põe só a água necessária e evita esse acúmulo.\n\n' +
          'Armadilha: a B (arenização) é a formação de areais por erosão, comum no Sul do Brasil, e não está ligada à irrigação.',
      89: 'O texto diz que a feira é livre, a céu aberto, um "labirinto de gentes", e que **recusa o confinamento** em prédios "cartesianos, envidraçados e fechados", como shoppings e supermercados, iguais em todo lugar. A feira resiste à **homogeneização da vida na cidade**.\n\n' +
          'Armadilha: a C diz o contrário: a feira mantém o costume tradicional, em vez de resistir a ele.',
      90: 'O mapa de Harry Beck não mostra as distâncias reais. Ele usa **linhas coloridas retas, ângulos de 45° e 90°** e símbolos simples para as estações. Esse jeito de desenhar virou um padrão no mundo todo: é a **homogeneização da linguagem** cartográfica.\n\n' +
          'Armadilha: a B (escala) é justamente o que o mapa abandona, porque ele não respeita as distâncias reais.',
    },
  },
];

/** Explicação própria de por que o gabarito está certo (ou null, se ainda não foi escrita) */
App.dados.explicacaoEnem = function (sim, numero, lingua) {
  const e = sim.explicacoes || {};
  if (numero <= 5) return (e[lingua] || [])[numero - 1] || null;
  return e[numero] || null;
};

/** Gabarito de uma questão, levando em conta a língua escolhida (questões 1 a 5) */
App.dados.gabaritoEnem = function (sim, numero, lingua) {
  if (numero <= 5) return sim.linguas[lingua].gabarito[numero - 1];
  return sim.gabarito.letras[numero - sim.gabarito.inicio];
};

/** Recortes do caderno onde está o enunciado da questão (ou [] se não houver) */
App.dados.recorteEnem = function (sim, numero, lingua) {
  const r = sim.recortes || {};
  return (numero <= 5 ? (r[lingua] || [])[numero - 1] : r[numero]) || [];
};

/** Faixas das alternativas A a E da questão ([] se não houver) */
App.dados.alternativasEnem = function (sim, numero, lingua) {
  const a = sim.alternativas || {};
  return (numero <= 5 ? (a[lingua] || [])[numero - 1] : a[numero]) || [];
};

/** Página do PDF onde está a questão */
App.dados.paginaEnem = function (sim, numero, lingua) {
  if (numero <= 5) return sim.linguas[lingua].paginas[numero - 1];
  return sim.paginas[numero];
};
