// ============================================================
// DADOS GEOLOCALIZADOS REAIS COM BIFURCAÇÃO
// ============================================================
const TRONCO_CENTRO = [
  { id: 'recife', nome: 'Recife', lat: -8.0645, lng: -34.8778 },
  { id: 'joana_bezerra', nome: 'Joana Bezerra', lat: -8.0804, lng: -34.8947 },
  { id: 'afogados', nome: 'Afogados', lat: -8.0772, lng: -34.9083 },
  { id: 'ipiranga', nome: 'Ipiranga', lat: -8.0784, lng: -34.9201 },
  { id: 'mangueira', nome: 'Mangueira', lat: -8.0795, lng: -34.9312 },
  { id: 'santa_luzia', nome: 'Santa Luzia', lat: -8.0825, lng: -34.9430 },
  { id: 'werneck', nome: 'Werneck', lat: -8.0848, lng: -34.9545 },
  { id: 'barro', nome: 'Barro', lat: -8.0925, lng: -34.9660 },
  { id: 'tejipio', nome: 'Tejipió', lat: -8.0935, lng: -34.9755 },
  { id: 'coqueiral', nome: 'Coqueiral', lat: -8.0938, lng: -34.9850 }
];

const RAMAL_CAMARAGIBE = [
  { id: 'alto_do_ceu', nome: 'Alto do Céu', lat: -8.0820, lng: -34.9960 },
  { id: 'curado', nome: 'Curado', lat: -8.0700, lng: -35.0040 },
  { id: 'rodoviaria', nome: 'Rodoviária', lat: -8.0515, lng: -35.0150 },
  { id: 'cosme_damiao', nome: 'Cosme e Damião', lat: -8.0350, lng: -35.0210 },
  { id: 'camaragibe', nome: 'Camaragibe', lat: -8.0215, lng: -35.0250 }
];

const RAMAL_JABOATAO = [
  { id: 'cavaleiro', nome: 'Cavaleiro', lat: -8.0900, lng: -34.9980 },
  { id: 'floriano', nome: 'Floriano', lat: -8.0930, lng: -35.0080 },
  { id: 'engenho_velho', nome: 'Engenho Velho', lat: -8.0980, lng: -35.0190 },
  { id: 'jaboatao', nome: 'Jaboatão', lat: -8.1060, lng: -35.0250 }
];

const LINHA_SUL = [
  { id: 'recife', nome: 'Recife', lat: -8.0645, lng: -34.8778 },
  { id: 'joana_bezerra', nome: 'Joana Bezerra', lat: -8.0804, lng: -34.8947 },
  { id: 'largo_paz', nome: 'Largo da Paz', lat: -8.0910, lng: -34.9015 },
  { id: 'imbiribeira', nome: 'Imbiribeira', lat: -8.1065, lng: -34.9050 },
  { id: 'antonio_falcao', nome: 'Antônio Falcão', lat: -8.1190, lng: -34.9070 },
  { id: 'shopping', nome: 'Shopping', lat: -8.1315, lng: -34.9085 },
  { id: 'tancredo_neves', nome: 'Tancredo Neves', lat: -8.1420, lng: -34.9100 },
  { id: 'aeroporto', nome: 'Aeroporto', lat: -8.1565, lng: -34.9140 },
  { id: 'porta_larga', nome: 'Porta Larga', lat: -8.1695, lng: -34.9165 },
  { id: 'monte_guararapes', nome: 'Monte dos Guararapes', lat: -8.1810, lng: -34.9185 },
  { id: 'prazeres', nome: 'Prazeres', lat: -8.1925, lng: -34.9210 },
  { id: 'cajueiro_seco', nome: 'Cajueiro Seco', lat: -8.2045, lng: -34.9235 }
];

const ESTACOES = {
  L1C: [...TRONCO_CENTRO, ...RAMAL_CAMARAGIBE],
  L1J: [...TRONCO_CENTRO, ...RAMAL_JABOATAO],
  L2: LINHA_SUL
};

function gerarHorarios(inicio, fim, intervalo) {
  const h = [];
  for (let t = inicio; t <= fim; t += intervalo) h.push(t);
  return h;
}

const HORARIOS = {
  L1C: {
    IDA:   gerarHorarios(5*60, 23*60, 20),
    VOLTA: gerarHorarios(5*60+10, 23*60+10, 20),
    TEMPOS: [3, 3, 2, 2, 2, 2, 3, 2, 2, 3, 3, 3, 3, 3] 
  },
  L1J: {
    IDA:   gerarHorarios(5*60+5, 23*60+5, 20),
    VOLTA: gerarHorarios(5*60+15, 23*60+15, 20),
    TEMPOS: [3, 3, 2, 2, 2, 2, 3, 2, 2, 4, 3, 4, 3] 
  },
  L2: {
    IDA:   gerarHorarios(5*60, 23*60, 15),
    VOLTA: gerarHorarios(5*60+12, 23*60+12, 15),
    TEMPOS: [3, 3, 3, 3, 3, 2, 3, 3, 3, 3, 3]
  }
};

// ============================================================
// LÓGICA DO MAPA (LEAFLET)
// ============================================================
let map;
let layerTrens;

function iniciarMapa() {
  // Inicializa o mapa focado em Recife/Jaboatão
  map = L.map('map').setView([-8.11, -34.94], 12);

  // Tema Dark Matter do CartoDB (Combina com o seu CSS)
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 19
  }).addTo(map);

  // Desenhando as linhas no mapa
  const coordL1C = ESTACOES.L1C.map(e => [e.lat, e.lng]);
  const coordL1J = ESTACOES.L1J.map(e => [e.lat, e.lng]);
  const coordL2  = ESTACOES.L2.map(e => [e.lat, e.lng]);

  L.polyline(coordL1C, {color: '#E84528', weight: 4, opacity: 0.8}).addTo(map);
  L.polyline(coordL1J, {color: '#f08b7a', weight: 4, opacity: 0.8}).addTo(map);
  L.polyline(coordL2,  {color: '#1A72E8', weight: 4, opacity: 0.8}).addTo(map);

  // Adicionando as estações (pequenos pontos brancos)
  const iconEstacao = L.divIcon({ className: 'station-marker', iconSize: [10, 10] });
  const todasEstacoes = [...new Set([...ESTACOES.L1C, ...ESTACOES.L1J, ...ESTACOES.L2])];
  todasEstacoes.forEach(est => {
    L.marker([est.lat, est.lng], {icon: iconEstacao}).addTo(map).bindPopup(`<b style="font-family:'Syne',sans-serif">${est.nome}</b>`);
  });

  // Layer que guardará os trens se movendo
  layerTrens = L.layerGroup().addTo(map);
}

function atualizarMapa(trens) {
  if (!map || !layerTrens) return;
  layerTrens.clearLayers();

  trens.forEach(tr => {
    if(!tr.pos || tr.status === 'terminal') return; // Oculta quem está no terminal
    
    // Define a cor baseada na linha
    let classeCor = 'marker-l1c';
    if(tr.linha === 'L1J') classeCor = 'marker-l1j';
    if(tr.linha === 'L2') classeCor = 'marker-l2';

    const iconTrem = L.divIcon({
      className: `trem-marker ${classeCor}`,
      iconSize: [14, 14]
    });

    const sentidoTexto = tr.sentido === 'IDA' ? 'Recife' : 'Subúrbio';
    const htmlPopup = `
      <div style="font-family:'DM Sans',sans-serif;">
        <strong style="color:var(--text);font-size:14px;font-family:'Syne',sans-serif">${tr.linha}</strong>
        <br>
        <span style="color:var(--muted);font-size:12px;">Sentido: ${sentidoTexto}</span><br>
        <span style="color:var(--verde);font-size:12px;">Próxima: ${tr.proxEst}</span>
      </div>
    `;

    L.marker([tr.pos.lat, tr.pos.lng], {icon: iconTrem})
     .bindPopup(htmlPopup)
     .addTo(layerTrens);
  });
}

// ============================================================
// MOTOR DE INTERPOLAÇÃO
// ============================================================
function minAgora() {
  const n = new Date();
  return n.getHours()*60 + n.getMinutes() + n.getSeconds()/60;
}

function calcAcumulados(tempos) {
  const ac = [0];
  for (const t of tempos) ac.push(ac.at(-1) + t);
  return ac;
}

function calcularTrens(linha, sentido) {
  const cfg = HORARIOS[linha];
  const horarios = cfg[sentido];
  const tempos = cfg.TEMPOS;
  
  const ests = sentido === 'IDA' ? [...ESTACOES[linha]].reverse() : ESTACOES[linha];
  const ac = calcAcumulados(tempos);
  const total = ac.at(-1);
  const agora = minAgora();
  const trens = [];

  for (const partida of horarios) {
    const elapsed = agora - partida;
    if (elapsed < 0 || elapsed > total + 3) continue;

    let seg = -1;
    for (let i = 0; i < ac.length - 1; i++) {
      if (elapsed >= ac[i] && elapsed <= ac[i+1]) { seg = i; break; }
    }

    let pos, status, estAtual, proxEst, progresso;

    if (seg === -1) {
      const ult = ests.at(-1);
      pos = { lat: ult.lat, lng: ult.lng };
      status = 'terminal';
      estAtual = ult.nome;
      proxEst = null;
      progresso = 100;
    } else {
      const A = ests[seg], B = ests[seg+1];
      const t = Math.min(1, (elapsed - ac[seg]) / (ac[seg+1] - ac[seg]));
      progresso = Math.round(t * 100);
      pos = { lat: A.lat + (B.lat - A.lat)*t, lng: A.lng + (B.lng - A.lng)*t };
      status = t < 0.15 ? 'na_estacao' : 'em_transito';
      estAtual = A.nome;
      proxEst = B.nome;
    }

    const minParaProx = seg !== -1 ? Math.max(0, Math.round(ac[seg+1] - elapsed)) : 0;
    const hh = String(Math.floor(partida/60)).padStart(2,'0');
    const mm = String(Math.round(partida%60)).padStart(2,'0');

    trens.push({ linha, sentido, partida:`${hh}:${mm}`, pos, status, estAtual, proxEst, minParaProx, progresso, seg });
  }
  return trens;
}

function getTodosTrens() {
  return [
    ...calcularTrens('L1C','IDA'), ...calcularTrens('L1C','VOLTA'),
    ...calcularTrens('L1J','IDA'), ...calcularTrens('L1J','VOLTA'),
    ...calcularTrens('L2','IDA'), ...calcularTrens('L2','VOLTA'),
  ];
}

// ============================================================
// RENDER
// ============================================================
function renderTabela(trens, tbodyId) {
  const tb = document.getElementById(tbodyId);
  if (!trens.length) {
    tb.innerHTML = `<tr><td colspan="6" class="empty">Nenhum trem ativo neste período</td></tr>`;
    return;
  }

  tb.innerHTML = trens.map(tr => {
    const statusHtml = tr.status === 'em_transito'
      ? `<span class="badge badge-transito">Em trânsito</span>`
      : tr.status === 'na_estacao'
      ? `<span class="badge badge-estacao">Na estação</span>`
      : `<span class="badge badge-terminal">Terminal</span>`;

    const sentidoHtml = tr.sentido === 'IDA'
      ? `<span class="sentido ida">↗ IDA</span>`
      : `<span class="sentido">↙ VOLTA</span>`;

    const proxHtml = tr.proxEst
      ? `${tr.proxEst} <span style="color:var(--verde);font-family:var(--mono);font-size:11px">(${tr.minParaProx}min)</span>`
      : `<span style="color:var(--muted)">—</span>`;

    return `<tr class="trem-row">
      <td><span class="trem-hora">${tr.partida}</span></td>
      <td>${sentidoHtml}</td>
      <td class="trem-local">${tr.estAtual}</td>
      <td class="trem-prox">${proxHtml}</td>
      <td>
        <div class="seg-bar"><div class="seg-fill fill-${tr.linha.toLowerCase()}" style="width:${tr.progresso}%"></div></div>
        <div style="font-family:var(--mono);font-size:10px;color:var(--muted);margin-top:3px">${tr.progresso}%</div>
      </td>
      <td>${statusHtml}</td>
    </tr>`;
  }).join('');
}

let countdown = 10;
function atualizar() {
  const todos = getTodosTrens();
  const l1c = todos.filter(t => t.linha === 'L1C');
  const l1j = todos.filter(t => t.linha === 'L1J');
  const l2 = todos.filter(t => t.linha === 'L2');
  const transit = todos.filter(t => t.status === 'em_transito');

  document.getElementById('stat-total').textContent = todos.length;
  document.getElementById('stat-transit').textContent = transit.length;
  document.getElementById('stat-l2').textContent = l2.length;

  renderTabela(l1c, 'tbody-l1c');
  renderTabela(l1j, 'tbody-l1j');
  renderTabela(l2, 'tbody-l2');
  
  // Atualiza os marcadores do mapa interativo!
  atualizarMapa(todos);
  
  countdown = 10;
}

function atualizarRelogio() {
  const n = new Date();
  document.getElementById('clock').textContent = n.toLocaleTimeString('pt-BR', {hour12:false});
  countdown--;
  if (countdown <= 0) atualizar();
  document.getElementById('stat-next').textContent = countdown + 's';
}

function atualizarSelectsETA() {
  const linha = document.getElementById('eta-linha').value;
  const sel = document.getElementById('eta-estacao');
  sel.innerHTML = ESTACOES[linha].map(e => `<option value="${e.nome}">${e.nome}</option>`).join('');
}

function calcularETA() {
  const linha = document.getElementById('eta-linha').value;
  const sentido = document.getElementById('eta-sentido').value;
  const estacao = document.getElementById('eta-estacao').value;

  const ests = sentido === 'IDA' ? [...ESTACOES[linha]].reverse() : ESTACOES[linha];
  const idxDest = ests.findIndex(e => e.nome === estacao);
  const cfg = HORARIOS[linha];
  const ac = calcAcumulados(cfg.TEMPOS);
  const agora = minAgora();

  const trens = calcularTrens(linha, sentido);
  let melhor = null;

  for (const trem of trens) {
    if (trem.seg === undefined || trem.seg === -1 || trem.seg >= idxDest) continue;
    const partMin = parseInt(trem.partida.split(':')[0])*60 + parseInt(trem.partida.split(':')[1]);
    const eta = Math.round(ac[idxDest] - (agora - partMin));
    if (eta > 0 && (!melhor || eta < melhor.eta)) melhor = { trem, eta };
  }

  const res = document.getElementById('eta-result');
  res.classList.add('show');

  if (!melhor) {
    document.getElementById('eta-num').textContent = '--';
    document.getElementById('eta-res-trem').textContent = 'Nenhum trem a caminho';
  } else {
    const elNum = document.getElementById('eta-num');
elNum.textContent = String(melhor.eta).padStart(2);
elNum.style.fontFamily = 'var(--mono)';    // Usa a JetBrains Mono
elNum.style.letterSpacing = '-1px';        // Estiliza o espaçamento
    document.getElementById('eta-num').style.color = linha === 'L2' ? 'var(--l2)' : (linha === 'L1J' ? 'var(--l1-jab)' : 'var(--l1)');
    document.getElementById('eta-res-trem').textContent = `Partiu às ${melhor.trem.partida}`;
  }
  document.getElementById('eta-res-est').textContent = estacao;
  
  let nomeLinhaStr = 'Linha Sul';
  if(linha === 'L1C') nomeLinhaStr = 'Centro (Camaragibe)';
  if(linha === 'L1J') nomeLinhaStr = 'Centro (Jaboatão)';

  document.getElementById('eta-res-linha').textContent = nomeLinhaStr;
  document.getElementById('eta-res-sent').textContent = sentido === 'IDA' ? 'Sentido Recife' : 'Sentido Subúrbio';
}

function showTab(name, el) {
  document.querySelectorAll('.section').forEach(s => s.classList.remove('on'));
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('on'));
  document.getElementById('tab-' + name).classList.add('on');
  el.classList.add('on');
  
  // Conserta o tamanho do mapa caso a aba estivesse escondida
  if(name === 'monitor' && map) {
    setTimeout(() => map.invalidateSize(), 100);
  }
}

function localizarUsuario() {
  if (!navigator.geolocation) {
    alert("Seu navegador não suporta geolocalização.");
    return;
  }

  // Opções para maior precisão
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0
  };

  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const lat = pos.coords.latitude;
      const lng = pos.coords.longitude;

      // Centraliza o mapa na posição do usuário
      map.setView([lat, lng], 15);

      // Cria um marcador especial para o usuário
      const userIcon = L.divIcon({
        className: 'user-marker',
        html: '<div class="user-dot"></div>',
        iconSize: [20, 20]
      });

      L.marker([lat, lng], { icon: userIcon })
        .addTo(map)
        .bindPopup("Você está aqui")
        .openPopup();
    },
    (err) => {
      console.warn(`Erro ao obter localização: ${err.message}`);
      alert("Não foi possível obter sua localização. Verifique as permissões do navegador.");
    },
    options
  );
}

// Função para calcular a distância em metros entre duas coordenadas
function calcularDistancia(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Raio da Terra em metros
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
}

function encontrarEstacaoMaisProxima(userLat, userLng) {
    let estacaoProxima = null;
    let menorDistancia = Infinity;

    // Percorre todas as linhas e estações
    Object.keys(ESTACOES).forEach(linha => {
        ESTACOES[linha].forEach(estacao => {
            const dist = calcularDistancia(userLat, userLng, estacao.lat, estacao.lng);
            if (dist < menorDistancia) {
                menorDistancia = dist;
                estacaoProxima = { ...estacao, distancia: dist, linhaOrigem: linha };
            }
        });
    });

    return estacaoProxima;
}

// Atualize sua função localizarUsuario para incluir a busca da estação
// (Substitua a parte do sucesso da geolocalização no localizarUsuario anterior por esta)
navigator.geolocation.getCurrentPosition((pos) => {
    const lat = pos.coords.latitude;
    const lng = pos.coords.longitude;
    
    // ... (seu código de colocar o marcador do usuário)

    const maisProxima = encontrarEstacaoMaisProxima(lat, lng);
    
    if (maisProxima) {
        const infoDiv = document.getElementById('info-proximidade');
        const distKm = (maisProxima.distancia / 1000).toFixed(1);
        
        infoDiv.innerHTML = `
            <div class="prox-card">
                <label>Estação mais próxima</label>
                <strong>${maisProxima.nome}</strong>
                <span>Aproximadamente ${distKm} km de você</span>
            </div>
        `;
        infoDiv.style.display = 'block';
    }
});

// Objeto para controlar quais linhas estão visíveis
let filtrosAtivos = {
    L1C: true,
    L1J: true,
    L2: true
};

function toggleLinha(linha) {
    // Inverte o estado do filtro
    filtrosAtivos[linha] = document.getElementById(`chk-${linha.toLowerCase()}`).checked;
    
    // Esconde ou mostra os blocos de tabela
    const bloco = document.getElementById(`${linha.toLowerCase()}-block`);
    if (bloco) {
        bloco.style.display = filtrosAtivos[linha] ? 'block' : 'none';
    }

    // Força uma atualização imediata do mapa e tabelas
    atualizar();
}

// AGORA, modifique sua função getTodosTrens() para respeitar os filtros:
function getTodosTrens() {
    let todos = [];
    
    if (filtrosAtivos.L1C) {
        todos = [...todos, ...calcularTrens('L1C','IDA'), ...calcularTrens('L1C','VOLTA')];
    }
    if (filtrosAtivos.L1J) {
        todos = [...todos, ...calcularTrens('L1J','IDA'), ...calcularTrens('L1J','VOLTA')];
    }
    if (filtrosAtivos.L2) {
        todos = [...todos, ...calcularTrens('L2','IDA'), ...calcularTrens('L2','VOLTA')];
    }
    
    return todos;
}

// Inicializações
iniciarMapa();
atualizarSelectsETA();
atualizar();
setInterval(atualizarRelogio, 1000);
