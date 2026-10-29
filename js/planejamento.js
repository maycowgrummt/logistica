if (typeof dadosApp !== 'undefined') {
    if (!dadosApp.rotasPlanejadas) {
        dadosApp.rotasPlanejadas = {};
    }
}

// NOVO: armazena somente os marcadores das cidades das rotas.
let marcadoresRota = [];

/* =========================================================
   SEQUÊNCIA OPERACIONAL DA ROTA
   A ordem é definida manualmente pelo Planejador.
   Não utiliza GPS, distâncias ou marcadores do mapa.
   ========================================================= */

function normalizarCidadeSequencia(cidade) {
    return String(cidade || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .trim()
        .toUpperCase();
}

function escaparHtmlSequencia(valor) {
    return String(valor ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

function garantirEstruturaSequenciasRota() {
    if (typeof dadosApp === 'undefined' || !dadosApp) {
        return false;
    }

    if (
        !dadosApp.sequenciasRota ||
        typeof dadosApp.sequenciasRota !== 'object' ||
        Array.isArray(dadosApp.sequenciasRota)
    ) {
        dadosApp.sequenciasRota = {};
    }

    return true;
}

function adicionarParadaSequencia(regiao, cidade) {
    if (!garantirEstruturaSequenciasRota()) {
        return false;
    }

    const regiaoChave = String(regiao || '').trim();
    const cidadeOriginal = String(cidade || '').trim();
    const cidadeNormalizada = normalizarCidadeSequencia(cidadeOriginal);

    if (!regiaoChave || !cidadeNormalizada) {
        return false;
    }

    if (!Array.isArray(dadosApp.sequenciasRota[regiaoChave])) {
        dadosApp.sequenciasRota[regiaoChave] = [];
    }

    const sequencia = dadosApp.sequenciasRota[regiaoChave];

    const jaExiste = sequencia.some(
        parada => normalizarCidadeSequencia(parada) === cidadeNormalizada
    );

    if (jaExiste) {
        mostrarToast('Essa cidade já está na sequência.', 'aviso');
        return false;
    }

    // Salva o nome da cidade como veio dos pedidos.
    sequencia.push(cidadeOriginal);

    if (typeof salvarDados === 'function') {
        salvarDados();
    }

    return true;
}

function removerParadaSequencia(regiao, cidade) {
    if (!garantirEstruturaSequenciasRota()) {
        return false;
    }

    const regiaoChave = String(regiao || '').trim();
    const sequencia = dadosApp.sequenciasRota[regiaoChave];

    if (!Array.isArray(sequencia)) {
        return false;
    }

    const cidadeNormalizada = normalizarCidadeSequencia(cidade);

    const indice = sequencia.findIndex(
        parada => normalizarCidadeSequencia(parada) === cidadeNormalizada
    );

    if (indice === -1) {
        return false;
    }

    sequencia.splice(indice, 1);

    if (typeof salvarDados === 'function') {
        salvarDados();
    }

    return true;
}

// Atualiza somente o card da sequência, sem recriar o painel nem o mapa.
function atualizarSequenciaRotaUI(regiao) {
    const container = document.getElementById('sequenciaOperacionalConteudo');

    if (!container) {
        return;
    }

    const cidadesDaRota = (dadosApp && Array.isArray(dadosApp.pedidos)
        ? dadosApp.pedidos
        : [])
        .filter(p => p && p.tipoCarga === 'itinerante' && p.regiao === regiao)
        .map(p => String(p.cidade || '').trim())
        .filter(Boolean);

    container.innerHTML = renderizarSequenciaRota(regiao, cidadesDaRota);
}

function adicionarParadaSequenciaUI() {
    const select = document.getElementById('sequenciaCidadeSelect');

    if (!select) {
        mostrarToast('Seletor de cidades não encontrado.', 'erro');
        return;
    }

    const regiao = select.dataset.regiao;
    const cidade = select.value;

    if (!cidade) {
        mostrarToast('Selecione uma cidade para adicionar.', 'aviso');
        return;
    }

    if (adicionarParadaSequencia(regiao, cidade)) {
        atualizarSequenciaRotaUI(regiao);
        mostrarToast('Cidade adicionada à sequência operacional.', 'sucesso');
    }
}

function removerParadaSequenciaUI(indice) {
    const select = document.getElementById('sequenciaCidadeSelect');

    if (!select) {
        mostrarToast('Seletor de cidades não encontrado.', 'erro');
        return;
    }

    const regiao = select.dataset.regiao;
    const sequencia = dadosApp?.sequenciasRota?.[regiao];

    if (!Array.isArray(sequencia) || !sequencia[indice]) {
        mostrarToast('Parada não encontrada.', 'aviso');
        return;
    }

    const cidade = sequencia[indice];

    if (removerParadaSequencia(regiao, cidade)) {
        atualizarSequenciaRotaUI(regiao);
        mostrarToast('Cidade removida da sequência.', 'sucesso');
    }
}

function subirParadaSequencia(regiao, indice) {

    if (
        !dadosApp.sequenciasRota ||
        !Array.isArray(
            dadosApp.sequenciasRota[regiao]
        )
    ) {
        return;
    }

    const sequencia =
        dadosApp.sequenciasRota[regiao];

    if (indice <= 0) {
        return;
    }

    [
        sequencia[indice - 1],
        sequencia[indice]
    ] =
    [
        sequencia[indice],
        sequencia[indice - 1]
    ];

    salvarDados();

    atualizarSequenciaRotaUI(regiao);

}

function descerParadaSequencia(regiao, indice) {

    if (
        !dadosApp.sequenciasRota ||
        !Array.isArray(
            dadosApp.sequenciasRota[regiao]
        )
    ) {
        return;
    }

    const sequencia =
        dadosApp.sequenciasRota[regiao];

    if (
        indice >=
        sequencia.length - 1
    ) {
        return;
    }

    [
        sequencia[indice + 1],
        sequencia[indice]
    ] =
    [
        sequencia[indice],
        sequencia[indice + 1]
    ];

    salvarDados();

    atualizarSequenciaRotaUI(regiao);

}

function renderizarSequenciaRota(regiao, cidadesDisponiveis = []) {
    if (!garantirEstruturaSequenciasRota()) {
        return '<p class="text-sm text-slate-500 py-3">Dados indisponíveis.</p>';
    }

    const sequencia = Array.isArray(dadosApp.sequenciasRota[regiao])
        ? dadosApp.sequenciasRota[regiao]
        : [];

    const cidadesUnicas = new Map();

    cidadesDisponiveis.forEach(cidade => {
        const nome = String(cidade || '').trim();
        const chave = normalizarCidadeSequencia(nome);

        if (chave && !cidadesUnicas.has(chave)) {
            cidadesUnicas.set(chave, nome);
        }
    });

    const cidadesDisponiveisHtml = Array.from(cidadesUnicas.entries())
        .filter(([chave]) => !sequencia.some(
            parada => normalizarCidadeSequencia(parada) === chave
        ))
        .sort((a, b) => a[1].localeCompare(b[1], 'pt-BR'))
        .map(([, cidade]) => `
            <option value="${escaparHtmlSequencia(cidade)}">
                ${escaparHtmlSequencia(cidade)}
            </option>
        `)
        .join('');

    const listaHtml = sequencia.length > 0
        ? sequencia.map((cidade, index) => `
            <div class="flex items-center gap-3 py-3 border-b border-slate-100 dark:border-slate-700 last:border-b-0">
                <div class="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-300 flex items-center justify-center font-bold text-sm">
                    ${index + 1}
                </div>

            <div class="flex-1 min-w-0 font-semibold text-sm text-slate-800 dark:text-slate-100 break-words">
    ${escaparHtmlSequencia(cidade)}
</div>

<div class="flex items-center gap-1">

    ${
        index > 0
            ? `
            <button
                type="button"
                onclick="subirParadaSequencia('${regiao}', ${index})"
                class="px-2 py-1 text-xs rounded bg-slate-200 hover:bg-slate-300">
                🔼
            </button>
            `
            : ''
    }

    ${
        index < sequencia.length - 1
            ? `
            <button
                type="button"
                onclick="descerParadaSequencia('${regiao}', ${index})"
                class="px-2 py-1 text-xs rounded bg-slate-200 hover:bg-slate-300">
                🔽
            </button>
            `
            : ''
    }

    <button
        type="button"
        onclick="removerParadaSequenciaUI(${index})"
        class="px-2 py-1 text-xs rounded bg-red-100 hover:bg-red-200 text-red-700">
        ❌
    </button>

</div>
                <button
                    type="button"
                    onclick="removerParadaSequenciaUI(${index})"
                    class="flex-shrink-0 px-3 py-1.5 text-xs font-semibold rounded-lg bg-red-100 text-red-700 hover:bg-red-200 dark:bg-red-900/40 dark:text-red-300"
                    aria-label="Remover ${escaparHtmlSequencia(cidade)}">
                    Remover
                </button>
            </div>
        `).join('')
        : `
            <p class="text-sm text-slate-500 dark:text-slate-400 py-3">
                Nenhuma cidade adicionada à sequência.
            </p>
        `;

    return `
        <div class="flex flex-col sm:flex-row gap-2 mb-4">
            <select
                id="sequenciaCidadeSelect"
                data-regiao="${escaparHtmlSequencia(regiao)}"
                class="min-w-0 flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-100">
                <option value="">Selecione uma cidade da rota</option>
                ${cidadesDisponiveisHtml}
            </select>

            <button
                type="button"
                onclick="adicionarParadaSequenciaUI()"
                class="px-4 py-2 text-sm font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-700">
                + Adicionar cidade
            </button>
        </div>

        ${cidadesDisponiveisHtml
            ? ''
            : `<p class="text-xs text-amber-600 dark:text-amber-400 mb-3">
                Todas as cidades disponíveis já foram adicionadas ou não há cidades cadastradas nesta rota.
            </p>`
        }

        <div>
            ${listaHtml}
        </div>
    `;
}

function salvarCargaDedicada(e) {
    e.preventDefault();

    if (setorAutenticado !== 'planejamento' && setorAutenticado !== 'admin') {
        mostrarToast('Acesso negado. Desbloqueie com a senha do Planejamento.', 'erro');
        return;
    }

    const pesoVal = Number(document.getElementById('dedPeso').value) || 0;

    if (pesoVal <= 0) {
        mostrarToast('O peso deve ser maior que zero.', 'erro');
        return;
    }

    const rawData = document.getElementById('dedDataEntrega').value;
    let dataBR = formatarDataParaExibicao(rawData);

    const novoPedido = {
        id: Date.now(),
        tipoCarga: 'dedicada',
        nota: (document.getElementById('dedNotaFiscal').value.trim() || '-').toUpperCase(),
        numeroPedido: document.getElementById('dedNumPedido').value.trim().toUpperCase(),
        destinoCidade: document.getElementById('dedDestino').value.trim(),
        dataSaida: dataBR,
        dataOriginalPlanejamento: dataBR,
        cliente: document.getElementById('dedCliente').value.trim(),
        tipoVeiculo: document.getElementById('dedTipoVeiculo').value,
        paletes: '-',
        peso: pesoVal,
        metroCubico: Number(document.getElementById('dedMetroCubico').value) || 0,
        observacao: document.getElementById('dedObservacao').value.trim() || '-',
        status: 'Aguardando Faturamento',
        sequenciaRota: 0
    };

    dadosApp.pedidos.push(novoPedido);
    salvarDados();
    atualizarInterfaceGeral();
    mostrarToast('Carga dedicada cadastrada na esteira!', 'sucesso');
    document.getElementById('formCargaDedicada').reset();
}

function identificarRegiao(cidade) {
    if (!cidade) return "NAO MAPEADA";

    const cidadeNormalizada = String(cidade)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim()
        .toUpperCase();

    for (const regiao in REGIOES_LOGISTICAS) {
        if (REGIOES_LOGISTICAS[regiao].includes(cidadeNormalizada)) {
            return regiao;
        }
    }

    return "NAO MAPEADA";
}

function importarPlanilhaWMS() {
    if (setorAutenticado !== 'planejamento' && setorAutenticado !== 'admin') {
        mostrarToast('Acesso negado. Desbloqueie com a senha do Planejamento.', 'erro');
        return;
    }

    const input = document.getElementById('inputArquivoWMS');

    if (!input || !input.files || input.files.length === 0) {
        mostrarToast('Selecione uma planilha do WMS para importar.', 'aviso');
        return;
    }

    mostrarToast('Processando planilha WMS...', 'aviso');

    const arquivo = input.files[0];
    const reader = new FileReader();

    reader.onload = function(e) {
        try {
            const data = new Uint8Array(e.target.result);
            const workbook = XLSX.read(data, {
                type: 'array',
                cellDates: false
            });

            const nomeAba = workbook.SheetNames.find(
                n => n.trim().toLowerCase() === 'consulta1'
            ) || workbook.SheetNames[0];

            const worksheet = workbook.Sheets[nomeAba];

            if (!worksheet) {
                mostrarToast('Aba válida não encontrada na planilha.', 'erro');
                return;
            }

            const linhas = XLSX.utils.sheet_to_json(worksheet, {
                header: 1
            });

            if (!linhas || linhas.length <= 1) {
                mostrarToast('A planilha está vazia ou contém apenas o cabeçalho.', 'erro');
                return;
            }

            const cabecalhos = (linhas[0] || []).map(h => String(h || '').trim());
            console.log("CABECALHOS:", cabecalhos);

            const encontrarIndiceExatoOuTermo = (termosExatos, termosContidos) => {
                let idx = cabecalhos.findIndex(h => {
                    const hClean = String(h)
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .toUpperCase()
                        .replace(/[^A-Z0-9]/g, "");

                    return termosExatos.some(termo => hClean === termo);
                });

                if (idx !== -1) return idx;

                return cabecalhos.findIndex(h => {
                    const hClean = String(h)
                        .normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .toUpperCase()
                        .replace(/[^A-Z0-9]/g, "");

                    return termosContidos.some(
                        termo => hClean.includes(termo) &&
                            !hClean.includes("STATUS") &&
                            !hClean.includes("PEDIDO")
                    );
                });
            };

            const idxNomeCliente =
             cabecalhos.findIndex(h => {

            const hClean = String(h)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, "");

        return hClean === 'NOME';

    });

            const idxCidade = encontrarIndiceExatoOuTermo(
                ['CIDADE'],
                ['CIDADE']
            );

            const idxEstado = encontrarIndiceExatoOuTermo(
                ['ESTADO', 'UF'],
                ['ESTADO', 'UF']
            );

            const idxFrete = encontrarIndiceExatoOuTermo(
                ['FRETE'],
                ['FRETE']
            );

            const idxDataEntrega = cabecalhos.findIndex(h => {
            const hClean = String(h)
                    .normalize("NFD")
                    .replace(/[\u0300-\u036f]/g, "")
                    .toUpperCase()
                    .replace(/[^A-Z0-9]/g, "");

                return hClean === 'DATAENTREGA';
            });

            const idxPedido = encontrarIndiceExatoOuTermo(
                ['PEDIDO', 'NUMEROPEDIDO', 'NOPEDIDO'],
                ['PEDIDO']
            );

            const idxStatusWMS = cabecalhos.findIndex(cabecalho => {
            const hClean = String(cabecalho)
            .normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .toUpperCase()
            .replace(/[^A-Z0-9]/g, "");

            return hClean === 'STATUSWMS';
        });

            const idxPesoTotal = encontrarIndiceExatoOuTermo(
                ['PESOTOTAL', 'PESO'],
                ['PESO']
            );

            const idxVolumeTotal = encontrarIndiceExatoOuTermo(
                ['VOLUMETOTAL', 'VOLUME', 'QTD', 'QUANTIDADE'],
                ['VOLUME', 'QTD', 'QUANTIDADE']
            );

            if (idxCidade === -1 || idxEstado === -1 || idxPesoTotal === -1) {
                mostrarToast(
                    'Colunas obrigatórias (Cidade, Estado ou PesoTotal) não encontradas.',
                    'erro'
                );
                return;
            }

            // Janela operacional de importação WMS: hoje e os 6 dias anteriores.
            const DIAS_IMPORTACAO_WMS = 7;
            const hoje = new Date();
            hoje.setHours(0, 0, 0, 0);

            const dataLimite = new Date(hoje);
            dataLimite.setDate(hoje.getDate() - (DIAS_IMPORTACAO_WMS - 1));

            let novosPedidosLote = [];
            let importedCount = 0;

            for (let i = 1; i < linhas.length; i++) {
                const row = linhas[i];

                if (!row || !Array.isArray(row) || row.length === 0) continue;

                const getVal = (idx) =>
                    (idx !== -1 && row[idx] !== undefined && row[idx] !== null)
                        ? String(row[idx]).trim()
                        : '';
                        

                const statusWMS = getVal(idxStatusWMS)
                    ? getVal(idxStatusWMS).toUpperCase()
                    : 'AGUARDANDO';

                    const frete = getVal(idxFrete)
                    ? getVal(idxFrete).toUpperCase().trim()
                    : '';
                    
                    // Importa apenas pedidos publicados
                    if (statusWMS !== 'PUBLICADO') {
                        continue;
                    }

                    if (frete === 'FOB') {
                        continue;
                    }

                console.log("STATUS ENCONTRADO:", statusWMS);

                const numPedido = getVal(idxPedido)
                    ? getVal(idxPedido).toUpperCase()
                    : `PED-${i}`;

                const nomeCliente = getVal(idxNomeCliente) || `Cliente ${i}`;

                let cidadeRaw = getVal(idxCidade);
                let estadoRaw = getVal(idxEstado);

                if (cidadeRaw.length === 2 && estadoRaw.length > 2) {
                    const temp = cidadeRaw;
                    cidadeRaw = estadoRaw;
                    estadoRaw = temp;
                }

                const cidade = cidadeRaw
                    ? cidadeRaw.normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .trim()
                    : '';

                const estado = estadoRaw
                    ? estadoRaw.normalize("NFD")
                        .replace(/[\u0300-\u036f]/g, "")
                        .trim()
                        .toUpperCase()
                    : '';

                const destino = (cidade && estado)
                    ? `${cidade} - ${estado}`
                    : (cidade || estado || 'Curitiba - PR');

                let dataReqBR = '';
                let dataObjComparacao = null;

                if (
                    idxDataEntrega !== -1 &&
                    row[idxDataEntrega] !== undefined &&
                    row[idxDataEntrega] !== null &&
                    row[idxDataEntrega] !== ''
                ) {
                    const valData = row[idxDataEntrega];

                    if (typeof valData === 'number' && valData > 36000) {
                        const utcDays = Math.floor(valData - 25569);
                        const utcValue = utcDays * 86400 * 1000;
                        const dateInfo = new Date(utcValue);

                        const d = String(dateInfo.getUTCDate()).padStart(2, '0');
                        const m = String(dateInfo.getUTCMonth() + 1).padStart(2, '0');
                        const a = dateInfo.getUTCFullYear();

                        if (a >= 2024 && a <= 2035) {
                            dataReqBR = `${d}/${m}/${a}`;
                            dataObjComparacao = new Date(
                                a,
                                dateInfo.getUTCMonth(),
                                dateInfo.getUTCDate()
                            );
                        }
                    } else if (valData instanceof Date && !isNaN(valData.getTime())) {
                        const d = String(valData.getDate()).padStart(2, '0');
                        const m = String(valData.getMonth() + 1).padStart(2, '0');
                        const a = valData.getFullYear();

                        if (a >= 2024 && a <= 2035) {
                            dataReqBR = `${d}/${m}/${a}`;
                            dataObjComparacao = new Date(
                                a,
                                valData.getMonth(),
                                valData.getDate()
                            );
                        }
                    } else {
                        const strData = String(valData).trim();

                        if (
                            strData &&
                            !strData.includes('1899') &&
                            !strData.includes('1900')
                        ) {
                            const formatada = formatarDataBR(strData);

                            if (formatada) {
                                const partesF = formatada.split('/');
                                const anoF = Number(partesF[2]);

                                if (
                                    anoF >= 2024 &&
                                    anoF <= 2035 &&
                                    !formatada.startsWith('00/')
                                ) {
                                    dataReqBR = formatada;
                                    dataObjComparacao = new Date(
                                        anoF,
                                        Number(partesF[1]) - 1,
                                        Number(partesF[0])
                                    );
                                }
                            }
                        }
                    }
                }

                if (
                    !dataReqBR ||
                    dataReqBR.includes('1899') ||
                    dataReqBR.includes('1900') ||
                    dataReqBR.startsWith('00/')
                ) {
                    const hojeData = new Date();
                    const d = String(hojeData.getDate()).padStart(2, '0');
                    const m = String(hojeData.getMonth() + 1).padStart(2, '0');
                    const a = hojeData.getFullYear();

                    dataReqBR = `${d}/${m}/${a}`;
                    dataObjComparacao = new Date(
                        a,
                        hojeData.getMonth(),
                        hojeData.getDate()
                    );
                }

                if (dataObjComparacao) {
                    dataObjComparacao.setHours(0, 0, 0, 0);

                    if (dataObjComparacao < dataLimite) {
                        continue;
                    }
                }

                let rawPeso = idxPesoTotal !== -1 ? row[idxPesoTotal] : 0;
                let pesoTotal = 0;

                if (rawPeso !== undefined && rawPeso !== null) {
                    if (typeof rawPeso === 'number') {
                        pesoTotal = rawPeso;
                    } else {
                        let limpo = String(rawPeso)
                            .replace(/\./g, '')
                            .replace(',', '.')
                            .replace(/[^\d.-]/g, '');

                        pesoTotal = Number(limpo) || 0;
                    }
                }

                let rawVolume = idxVolumeTotal !== -1 ? row[idxVolumeTotal] : 1;
                let qtdPedido = 1;

                if (rawVolume !== undefined && rawVolume !== null) {
                    if (typeof rawVolume === 'number') {
                        qtdPedido = rawVolume;
                    } else {
                        let limpoVol = String(rawVolume)
                            .replace(/\./g, '')
                            .replace(',', '.')
                            .replace(/[^\d.-]/g, '');

                        qtdPedido = Number(limpoVol) || 1;
                    }
                }

                const regiao = identificarRegiao(cidade);

                const novoPedido = {
                    id: Date.now() + i,
                    tipoCarga: 'itinerante',
                    numeroPedido: numPedido,
                    nota: '-',
                    qtdPedido: `${qtdPedido} Paletes`,
                    statusWMS: statusWMS,
                    cliente: nomeCliente,
                    destinoCidade: destino,
                    cidade: cidade,
                    estado: estado,
                    regiao: regiao,
                    peso: Number(pesoTotal),
                    volumeTotal: Number(qtdPedido),
                    dataSaida: dataReqBR,
                    dataOriginalPlanejamento: dataReqBR,
                    observacao: '-',
                    status: statusWMS,
                    sequenciaRota: 0
                };

                novosPedidosLote.push(novoPedido);
                importedCount++;
            }

            if (importedCount > 0) {
                if (!dadosApp.pedidos) dadosApp.pedidos = [];

                dadosApp.pedidos.push(...novosPedidosLote);
                salvarDados();
                atualizarInterfaceGeral();
                gerarResumoRegioes();

                mostrarToast(
                    `${importedCount} pedidos WMS importados com sucesso!`,
                    'sucesso'
                );

                input.value = '';
            } else {
                mostrarToast(
                    'Nenhum pedido compatível encontrado dentro da janela operacional.',
                    'aviso'
                );
            }
        } catch (err) {
            console.error("ERRO WMS:", err);
            mostrarToast('Erro ao ler a planilha WMS.', 'erro');
        }
    };

    reader.readAsArrayBuffer(arquivo);
}

        function mudarSubTab(sub) {
    subTabAtiva = sub;

    const subDed = document.getElementById('subsecao-dedicada');
    const subItin = document.getElementById('subsecao-itinerante');
    const btnDed = document.getElementById('btn-sub-dedicada');
    const btnItin = document.getElementById('btn-sub-itinerante');
    const tituloTabela = document.getElementById('tituloTabelaPedidos');

    if (sub === 'dedicada') {
        subDed.classList.remove('hidden');
        subItin.classList.add('hidden');

        btnDed.className = "px-4 py-2 text-xs font-bold uppercase rounded-lg bg-emerald-600 text-white shadow transition flex items-center space-x-1.5";
        btnItin.className = "px-4 py-2 text-xs font-bold uppercase rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 transition flex items-center space-x-1.5";

        if (tituloTabela) {
            tituloTabela.textContent = "Cargas Dedicadas Cadastradas";
        }
    } else {
        subDed.classList.add('hidden');
        subItin.classList.remove('hidden');

        btnItin.className = "px-4 py-2 text-xs font-bold uppercase rounded-lg bg-emerald-600 text-white shadow transition flex items-center space-x-1.5";
        btnDed.className = "px-4 py-2 text-xs font-bold uppercase rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 transition flex items-center space-x-1.5";

        if (tituloTabela) {
            tituloTabela.textContent = "Cargas Consolidadas por Cliente (WMS)";
        }

        setTimeout(() => {
            if (mapaObj) mapaObj.invalidateSize();
        }, 200);
    }

    renderizarTabelasPedidos();
}

function aplicarFiltrosCombinados() {
    renderizarTabelasPedidos();
}

function limparFiltrosCombinados() {
    document.getElementById('filtroDataInicio').value = '';
    document.getElementById('filtroDataFim').value = '';
    document.getElementById('filtroRegiao').value = 'TODAS';

    renderizarTabelasPedidos();
}

function gerarResumoRegioes() {
    const painel = document.getElementById('painelResumoRegioes');
    if (!painel) return;

    const resumo = {};

    if (dadosApp && dadosApp.pedidos) {
        dadosApp.pedidos
            .filter(p => p && p.tipoCarga === 'itinerante')
            .forEach(pedido => {
                const regiao = pedido.regiao || 'NAO MAPEADA';
                const dataEntrega = pedido.dataSaida || '';

                if (!resumo[regiao]) {
                    resumo[regiao] = {
                        pedidos: 0,
                        clientes: new Set(),
                        peso: 0,
                        datas: []
                    };
                }

                resumo[regiao].pedidos++;

                if (pedido.cliente) {
                    resumo[regiao].clientes.add(pedido.cliente);
                }

                resumo[regiao].peso += Number(pedido.peso || 0);

                if (dataEntrega) {
                    resumo[regiao].datas.push(dataEntrega);
                }
            });
    }

    const parseDataBRParaTimestamp = (dataStr) => {
        if (!dataStr || typeof dataStr !== 'string') return 8640000000000;

        const partes = dataStr.split('/');
        if (partes.length !== 3) return 8640000000000;

        const [dia, mes, ano] = partes;
        const timestamp = new Date(`${ano}-${mes}-${dia}`).getTime();

        return isNaN(timestamp) ? 8640000000000 : timestamp;
    };

    const regioesArray = Object.entries(resumo).map(([regiao, dados]) => {
        let menorData = '-';
        let menorTimestamp = 8640000000000;

        if (dados.datas.length > 0) {
            dados.datas.forEach(d => {
                const ts = parseDataBRParaTimestamp(d);

                if (ts < menorTimestamp) {
                    menorTimestamp = ts;
                    menorData = d;
                }
            });
        }

        const veiculos = Math.ceil(dados.pedidos / 30);

        if (typeof dadosApp !== 'undefined' && !dadosApp.rotasPlanejadas) {
            dadosApp.rotasPlanejadas = {};
        }

        const planejada = (
            typeof dadosApp !== 'undefined' &&
            dadosApp.rotasPlanejadas &&
            dadosApp.rotasPlanejadas[regiao] === true
        );

        return {
            regiao,
            pedidos: dados.pedidos,
            clientes: dados.clientes.size,
            peso: dados.peso,
            dataPrioridade: menorData,
            timestampPrioridade: menorTimestamp,
            veiculos,
            planejada
        };
    });

    regioesArray.sort((a, b) => a.timestampPrioridade - b.timestampPrioridade);

    painel.innerHTML = regioesArray
        .map((item, index) => {
            const numeroRota = String(index + 1).padStart(3, '0');

            const iconePrioridade = index === 0
                ? "🥇"
                : index === 1
                    ? "🥈"
                    : index === 2
                        ? "🥉"
                        : "📍";

            const corBorda = item.planejada
                ? "border-emerald-500 dark:border-emerald-500 bg-emerald-50/30 dark:bg-emerald-950/20"
                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800";

            const statusBadge = item.planejada
                ? `<span class="inline-block px-2 py-0.5 text-xs font-bold bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-200 rounded-full mb-2">🟢 Planejada</span>`
                : `<span class="inline-block px-2 py-0.5 text-xs font-bold bg-amber-100 text-amber-800 dark:bg-amber-900 dark:text-amber-200 rounded-full mb-2">🟡 Pendente</span>`;

            return `
                <div onclick="abrirRota('${item.regiao}')" class="${corBorda} border rounded-xl p-4 shadow-sm cursor-pointer hover:border-blue-500 transition">
                    <div class="flex justify-between items-start mb-1">
                        <div class="font-bold text-blue-600">
                            ${iconePrioridade} PRIORIDADE ${index + 1}
                        </div>
                        <div>
                            ${statusBadge}
                        </div>
                    </div>
                    <div class="font-bold text-emerald-600 dark:text-emerald-400 mb-1">
                        🚛 ROTA ${numeroRota}
                    </div>
                    <div class="font-bold text-slate-800 dark:text-slate-100 mb-2">
                        📍 ${item.regiao}
                    </div>
                    <div class="text-sm">
                        📅 <strong>${item.dataPrioridade}</strong>
                        <br>
                        Pedidos: ${item.pedidos}
                        <br>
                        Clientes: ${item.clientes}
                        <br>
                        Peso: ${Math.round(item.peso).toLocaleString('pt-BR')} Kg
                        <br>
                        Veículos: ${item.veiculos}
                    </div>
                </div>
            `;
        }).join('') + '<div id="containerPainelOperacionalRota" class="col-span-full"></div>';
}

/* =========================================================
   NOVO: MARCADORES DINÂMICOS DAS ROTAS NO MAPA LEAFLET
   Não remove o marcador fixo da fábrica.
   Não desenha linhas nem calcula trajetos.
   ========================================================= */
function mostrarRotaNoMapa(regiao) {
    if (
        typeof mapaObj === 'undefined' ||
        !mapaObj ||
        typeof L === 'undefined' ||
        typeof COORDENADAS_CIDADES === 'undefined'
    ) {
        console.warn(
            'Não foi possível exibir a rota: mapaObj, Leaflet ou COORDENADAS_CIDADES indisponível.'
        );
        return;
    }

    // Remove somente os marcadores criados por esta função.
    marcadoresRota.forEach(function(marcador) {
        if (mapaObj.hasLayer(marcador)) {
            mapaObj.removeLayer(marcador);
        }
    });

    marcadoresRota = [];

    // Obtém os pedidos itinerantes pertencentes à região selecionada.
    const pedidosRegiao = dadosApp && Array.isArray(dadosApp.pedidos)
        ? dadosApp.pedidos.filter(function(pedido) {
            return pedido &&
                pedido.tipoCarga === 'itinerante' &&
                pedido.regiao === regiao;
        })
        : [];

    // Normaliza nomes para remover acentos e evitar cidades duplicadas.
    const normalizarNomeCidade = function(nome) {
        return String(nome || '')
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .trim()
            .toUpperCase();
    };

    const cidadesUnicas = new Map();

    pedidosRegiao.forEach(function(pedido) {
        const cidadeOriginal = String(pedido.cidade || '').trim();

        if (!cidadeOriginal) return;

        const chaveCidade = normalizarNomeCidade(cidadeOriginal);

        if (!cidadesUnicas.has(chaveCidade)) {
            cidadesUnicas.set(chaveCidade, cidadeOriginal);
        }
    });

    const pontosRota = [];

    // Cria um marcador por cidade e guarda os marcadores da rota.
    cidadesUnicas.forEach(function(nomeCidade, chaveCidade) {
        const coordenadas = COORDENADAS_CIDADES[chaveCidade];

        if (
            !coordenadas ||
            !Number.isFinite(Number(coordenadas.lat)) ||
            !Number.isFinite(Number(coordenadas.lng))
        ) {
            console.warn(
                'Coordenadas não encontradas para a cidade:',
                nomeCidade,
                'Chave consultada:',
                chaveCidade
            );
            return;
        }

        const lat = Number(coordenadas.lat);
        const lng = Number(coordenadas.lng);
        const sequencia =
         dadosApp?.sequenciasRota?.[regiao] || [];

        const posicao =
        sequencia.findIndex(
        parada =>
            normalizarNomeCidade(parada) === chaveCidade
    );
        let marcador;

if (posicao >= 0) {

    const iconeNumero = L.divIcon({
        className: '',
        html: `
            <div style="
                width:32px;
                height:32px;
                border-radius:50%;
                background:#2563eb;
                color:white;
                font-weight:bold;
                display:flex;
                align-items:center;
                justify-content:center;
                border:2px solid white;
            ">
                ${posicao + 1}
            </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
    });

    marcador =
        L.marker(
            [lat, lng],
            {
                icon: iconeNumero
            }
        );

} else {

    marcador =
        L.marker([lat, lng]);

}

// Integra o clique no marcador à sequência operacional manual.
marcador.on('click', function () {
    const adicionada = adicionarParadaSequencia(regiao, nomeCidade);

    if (!adicionada) {
        return;
    }

    const containerSequencia = document.getElementById(
        'sequenciaOperacionalConteudo'
    );

    if (containerSequencia) {
        const cidadesDaRota = pedidosRegiao
            .map(pedido => String(pedido.cidade || '').trim())
            .filter(Boolean);

        containerSequencia.innerHTML = renderizarSequenciaRota(
            regiao,
            cidadesDaRota
        );
    }
    // Atualiza os marcadores numerados
    mostrarRotaNoMapa(regiao);
    mostrarToast(
        `${nomeCidade} adicionada à sequência operacional.`,
        'sucesso'
    );
});

        // Monta o popup como texto para não interpretar nomes como HTML.
        const popup = document.createElement('div');

        const tituloCidade = document.createElement('strong');
        tituloCidade.textContent = nomeCidade;

        const textoRegiao = document.createElement('div');
        textoRegiao.textContent = 'Região: ' + regiao;

        popup.appendChild(tituloCidade);
        popup.appendChild(textoRegiao);

        marcador.bindPopup(popup);
        marcador.addTo(mapaObj);

        marcadoresRota.push(marcador);
        pontosRota.push([lat, lng]);
    });

    // Enquadra somente as cidades da rota selecionada.
    // O marcador fixo da fábrica permanece no mapa, sem ser removido.
    if (pontosRota.length === 1) {
        mapaObj.setView(pontosRota[0], 11);
    } else if (pontosRota.length > 1) {
        const limites = L.latLngBounds(pontosRota);

        if (limites.isValid()) {
            mapaObj.fitBounds(limites, {
                padding: [30, 30],
                maxZoom: 12
            });
        }
    }
}

/* =========================================================
   PAINEL OPERACIONAL DA ROTA
   Inclui Top Clientes, Top Cidades e Sequência Operacional.
   ========================================================= */
function abrirRota(regiao) {
    let container = document.getElementById('painelOperacionalRotaModal');

    if (!container) {
        container = document.createElement('div');
        container.id = 'painelOperacionalRotaModal';
        container.className = 'mt-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 shadow-md col-span-full';

        const painelResumo = document.getElementById('painelResumoRegioes');

        if (painelResumo && painelResumo.parentNode) {
            painelResumo.parentNode.insertBefore(container, painelResumo.nextSibling);
        } else {
            document.body.appendChild(container);
        }
    }

    const pedidosRegiao = dadosApp && dadosApp.pedidos
        ? dadosApp.pedidos.filter(
            p => p &&
                p.tipoCarga === 'itinerante' &&
                p.regiao === regiao
        )
        : [];

    const totalPedidos = pedidosRegiao.length;
    const clientesSet = new Set(pedidosRegiao.map(p => p.cliente).filter(Boolean));
    const totalClientes = clientesSet.size;
    const totalPeso = pedidosRegiao.reduce(
        (acc, p) => acc + Number(p.peso || 0),
        0
    );
    const totalVolume = pedidosRegiao.reduce(
    (acc, p) => acc + Number(p.volumeTotal || 0),
    0
);
    const veiculosSugeridos = Math.ceil(totalPedidos / 30);

    const cidadesSet = new Set(
        pedidosRegiao
            .map(p => p.cidade)
            .filter(Boolean)
    );

    const listaCidades = Array.from(cidadesSet);
    const qtdCidades = listaCidades.length;
    const cidadesFormatadas = listaCidades.length > 0
        ? listaCidades.join(', ')
        : '-';

    /*
     * TOP 5 CLIENTES
     * Agrupa os pedidos por cliente, conta a quantidade,
     * calcula o percentual sobre os pedidos da rota e
     * ordena do maior para o menor.
     */
    const clientesResumo = {};

    pedidosRegiao.forEach(pedido => {
        const nomeOriginal = String(pedido.cliente || '').trim();
        const nomeExibicao = nomeOriginal || 'Cliente não informado';
        const chave = nomeExibicao
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toUpperCase();

        if (!clientesResumo[chave]) {
            clientesResumo[chave] = {
                nome: nomeExibicao,
                quantidade: 0
            };
        }

        clientesResumo[chave].quantidade++;
    });

    const topClientes = Object.values(clientesResumo)
        .sort((a, b) => {
            if (b.quantidade !== a.quantidade) {
                return b.quantidade - a.quantidade;
            }

            return a.nome.localeCompare(b.nome, 'pt-BR');
        })
        .slice(0, 5);

    const clientesHtml = topClientes.length > 0
        ? topClientes.map((cliente, index) => {
            const percentual = totalPedidos > 0
                ? (cliente.quantidade / totalPedidos) * 100
                : 0;

            return `
                <div class="flex items-center justify-between gap-3 py-3 border-b border-slate-100 dark:border-slate-700 last:border-b-0">
                    <div class="flex items-center gap-3 min-w-0">
                        <div class="flex-shrink-0 w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 flex items-center justify-center font-bold text-sm">
                            ${index + 1}
                        </div>
                        <div class="min-w-0">
                            <div class="font-semibold text-sm text-slate-800 dark:text-slate-100 break-words">
                                ${cliente.nome.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')}
                            </div>
                            <div class="text-xs text-slate-500 dark:text-slate-400">
                                ${percentual.toLocaleString('pt-BR', {
                                    minimumFractionDigits: 1,
                                    maximumFractionDigits: 1
                                })}% dos pedidos da rota
                            </div>
                        </div>
                    </div>
                    <div class="flex-shrink-0 text-right">
                        <div class="font-bold text-slate-800 dark:text-slate-100">
                            ${cliente.quantidade}
                        </div>
                        <div class="text-xs text-slate-500 dark:text-slate-400">
                            ${cliente.quantidade === 1 ? 'pedido' : 'pedidos'}
                        </div>
                    </div>
                </div>
            `;
        }).join('')
        : `<p class="text-sm text-slate-500 dark:text-slate-400 py-3">Nenhum cliente encontrado nesta rota.</p>`;

    /*
     * TOP 5 CIDADES
     * Agrupa os pedidos por cidade e ordena pela
     * quantidade de pedidos, do maior para o menor.
     */
    const cidadesResumo = {};

    pedidosRegiao.forEach(pedido => {
        const cidadeOriginal = String(pedido.cidade || '').trim();
        const nomeExibicao = cidadeOriginal || 'Cidade não informada';
        const chave = nomeExibicao
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toUpperCase();

        if (!cidadesResumo[chave]) {
            cidadesResumo[chave] = {
                nome: nomeExibicao,
                quantidade: 0
            };
        }

        cidadesResumo[chave].quantidade++;
    });

    const topCidades = Object.values(cidadesResumo)
        .sort((a, b) => {
            if (b.quantidade !== a.quantidade) {
                return b.quantidade - a.quantidade;
            }

            return a.nome.localeCompare(b.nome, 'pt-BR');
        })
        .slice(0, 5);

    const cidadesHtml = topCidades.length > 0
        ? topCidades.map((cidade, index) => `
            <div class="flex items-center justify-between gap-3 py-3 border-b border-slate-100 dark:border-slate-700 last:border-b-0">
                <div class="flex items-center gap-3 min-w-0">
                    <div class="flex-shrink-0 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 flex items-center justify-center font-bold text-sm">
                        ${index + 1}
                    </div>
                    <div class="font-semibold text-sm text-slate-800 dark:text-slate-100 break-words">
                        ${cidade.nome.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#39;')}
                    </div>
                </div>
                <div class="flex-shrink-0 text-right">
                    <div class="font-bold text-slate-800 dark:text-slate-100">
                        ${cidade.quantidade}
                    </div>
                    <div class="text-xs text-slate-500 dark:text-slate-400">
                        ${cidade.quantidade === 1 ? 'pedido' : 'pedidos'}
                    </div>
                </div>
            </div>
        `).join('')
        : `<p class="text-sm text-slate-500 dark:text-slate-400 py-3">Nenhuma cidade encontrada nesta rota.</p>`;

    let menorData = '-';
    let menorTs = 8640000000000;

    pedidosRegiao.forEach(p => {
        if (p.dataSaida) {
            const partes = p.dataSaida.split('/');

            if (partes.length === 3) {
                const ts = new Date(
                    `${partes[2]}-${partes[1]}-${partes[0]}`
                ).getTime();

                if (!isNaN(ts) && ts < menorTs) {
                    menorTs = ts;
                    menorData = p.dataSaida;
                }
            }
        }
    });

    let numeroRotaStr = "001";

    const resumo = {};

    if (dadosApp && dadosApp.pedidos) {
        dadosApp.pedidos
            .filter(p => p && p.tipoCarga === 'itinerante')
            .forEach(pedido => {
                const reg = pedido.regiao || 'NAO MAPEADA';
                const dt = pedido.dataSaida || '';

                if (!resumo[reg]) {
                    resumo[reg] = {
                        datas: []
                    };
                }

                if (dt) {
                    resumo[reg].datas.push(dt);
                }
            });
    }

    const parseDataBRParaTimestamp = (dataStr) => {
        if (!dataStr || typeof dataStr !== 'string') {
            return 8640000000000;
        }

        const partes = dataStr.split('/');
        if (partes.length !== 3) return 8640000000000;

        const [dia, mes, ano] = partes;
        const timestamp = new Date(`${ano}-${mes}-${dia}`).getTime();

        return isNaN(timestamp) ? 8640000000000 : timestamp;
    };

    const arrRegioesOrdenadas = Object.entries(resumo)
        .map(([reg, dados]) => {
            let minTs = 8640000000000;

            dados.datas.forEach(d => {
                const ts = parseDataBRParaTimestamp(d);

                if (ts < minTs) {
                    minTs = ts;
                }
            });

            return {
                regiao: reg,
                timestamp: minTs
            };
        })
        .sort((a, b) => a.timestamp - b.timestamp);

    const indexRota = arrRegioesOrdenadas.findIndex(
        r => r.regiao === regiao
    );

    if (indexRota !== -1) {
        numeroRotaStr = String(indexRota + 1).padStart(3, '0');
    }

    if (typeof dadosApp !== 'undefined' && !dadosApp.rotasPlanejadas) {
        dadosApp.rotasPlanejadas = {};
    }

    const isPlanejada = (
        typeof dadosApp !== 'undefined' &&
        dadosApp.rotasPlanejadas &&
        dadosApp.rotasPlanejadas[regiao] === true
    );

    const textoBotaoPlanejar = isPlanejada
        ? "✅ Rota Planejada"
        : "✅ Marcar Rota como Planejada";

    const corBotaoPlanejar = isPlanejada
        ? "bg-emerald-600 text-white"
        : "bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600";

    let linhasHtml = '';

    if (pedidosRegiao.length === 0) {
        linhasHtml = `
            <tr>
                <td colspan="5" class="py-4 text-center text-slate-500">
                    Nenhum pedido encontrado para esta região.
                </td>
            </tr>
        `;
    } else {
        linhasHtml = pedidosRegiao.map(p => `
            <tr class="border-b border-slate-100 dark:border-slate-700">
                <td class="py-2 px-3 text-sm font-semibold">${p.numeroPedido || '-'}</td>
                <td class="py-2 px-3 text-sm">${p.cliente || '-'}</td>
                <td class="py-2 px-3 text-sm">${p.cidade || '-'}</td>
                <td class="py-2 px-3 text-sm">${p.estado || '-'}</td>
                <td class="py-2 px-3 text-sm">${p.dataSaida || '-'}</td>
            </tr>
        `).join('');
    }

    // Renderiza a sequência usando as cidades dos pedidos da região.
    // (renderizarSequenciaRota já garante a estrutura de dados internamente.)
    const sequenciaOperacionalHtml = renderizarSequenciaRota(
        regiao,
        listaCidades
    );

    container.innerHTML = `
        <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-4">
            <div>
                <h3 class="text-lg font-bold text-slate-800 dark:text-slate-100">
                    Painel Operacional da Rota: ${regiao} (ROTA ${numeroRotaStr})
                </h3>
            </div>

            <div class="flex flex-wrap items-center gap-2">
                <button
                    onclick="alternarPlanejamentoRota('${regiao}')"
                    class="text-sm px-3 py-1.5 ${corBotaoPlanejar} rounded-lg transition font-medium">
                    ${textoBotaoPlanejar}
                </button>

                <button
                    onclick="exportarRota('${regiao}')"
                    class="text-sm px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition font-medium">
                    📤 Exportar Rota
                </button>

                <button
                    onclick="exportarRotaPDF('${regiao}')"
                    class="text-sm px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium">
                    📄 Exportar PDF
                </button>

                <button
                    onclick="document.getElementById('painelOperacionalRotaModal').remove()"
                    class="text-sm px-3 py-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg hover:bg-slate-300 transition">
                    Fechar
                </button>
            </div>
        </div>

        <!-- RESUMO DA ROTA -->
        <div class="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg p-4 mb-4">
            <h4 class="text-sm font-bold text-blue-600 uppercase mb-3">
                Resumo da Rota (ROTA ${numeroRotaStr})
            </h4>

            <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 text-sm mb-3">
                <div>
                    <span class="text-slate-500 block">Região</span>
                    <strong class="text-slate-800 dark:text-slate-100">${regiao}</strong>
                </div>

                <div>
                    <span class="text-slate-500 block">Pedidos</span>
                    <strong class="text-slate-800 dark:text-slate-100">${totalPedidos}</strong>
                </div>

                <div>
                    <span class="text-slate-500 block">Clientes</span>
                    <strong class="text-slate-800 dark:text-slate-100">${totalClientes}</strong>
                </div>

                <div>
                    <span class="text-slate-500 block">Peso Total</span>
                    <strong class="text-slate-800 dark:text-slate-100">
                        ${Math.round(totalPeso).toLocaleString('pt-BR')} Kg
                    </strong>
                </div>
                <div>
                <span class="text-slate-500 block">Volume Total</span>
                <strong class="text-slate-800 dark:text-slate-100">
                    ${totalVolume.toLocaleString('pt-BR', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })} m³
                </strong>
            </div>

                <div>
                    <span class="text-slate-500 block">Veículos</span>
                    <strong class="text-slate-800 dark:text-slate-100">${veiculosSugeridos}</strong>
                </div>

                <div>
                    <span class="text-slate-500 block">Data Prioritária</span>
                    <strong class="text-slate-800 dark:text-slate-100">${menorData}</strong>
                </div>
            </div>

            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm border-t border-slate-200 dark:border-slate-700 pt-3">
                <div>
                    <span class="text-slate-500 block">Cidades atendidas</span>
                    <strong class="text-slate-800 dark:text-slate-100">${qtdCidades}</strong>
                </div>

                <div>
                    <span class="text-slate-500 block">Cidades da Rota</span>
                    <strong class="text-slate-800 dark:text-slate-100">${cidadesFormatadas}</strong>
                </div>
            </div>
        </div>

        <!-- NOVO CARD: SEQUÊNCIA OPERACIONAL DA ROTA -->
        <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm mb-5">
            <div class="flex items-center justify-between gap-2 mb-2">
                <div>
                    <h4 class="font-bold text-slate-800 dark:text-slate-100">
                        🛣️ Sequência Operacional
                    </h4>
                    <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                        Ordem manual definida pelo Planejador
                    </p>
                </div>
            </div>

            <div id="sequenciaOperacionalConteudo">
                ${sequenciaOperacionalHtml}
            </div>
        </div>

        <!-- NOVOS CARDS: TOP CLIENTES E TOP CIDADES -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">

            <!-- TOP 5 CLIENTES -->
            <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm">
                <div class="flex items-center justify-between gap-2 mb-2">
                    <div>
                        <h4 class="font-bold text-slate-800 dark:text-slate-100">
                            🏆 Top Clientes da Rota
                        </h4>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Clientes com mais pedidos
                        </p>
                    </div>

                    <span class="text-xs font-bold px-2 py-1 rounded-full bg-amber-100 text-amber-800 dark:bg-amber-900/40 dark:text-amber-300">
                        TOP 5
                    </span>
                </div>

                <div>
                    ${clientesHtml}
                </div>
            </div>

            <!-- TOP 5 CIDADES -->
            <div class="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 shadow-sm">
                <div class="flex items-center justify-between gap-2 mb-2">
                    <div>
                        <h4 class="font-bold text-slate-800 dark:text-slate-100">
                            🏙️ Top Cidades da Rota
                        </h4>
                        <p class="text-xs text-slate-500 dark:text-slate-400 mt-1">
                            Cidades com mais pedidos
                        </p>
                    </div>

                    <span class="text-xs font-bold px-2 py-1 rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300">
                        TOP 5
                    </span>
                </div>

                <div>
                    ${cidadesHtml}
                </div>
            </div>

        </div>

        <!-- TOTAIS -->
        <div class="flex gap-4 mb-3 text-sm font-semibold text-slate-700 dark:text-slate-300">
            <div>
                Totais -> Pedidos: ${totalPedidos}
                | Clientes: ${totalClientes}
                | Peso: ${Math.round(totalPeso).toLocaleString('pt-BR')} Kg
                | Cidades: ${qtdCidades}
            </div>
        </div>

        <!-- TABELA DE PEDIDOS -->
        <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
                <thead>
                    <tr class="border-b border-slate-200 dark:border-slate-700 text-xs uppercase text-slate-500">
                        <th class="py-2 px-3">Pedido</th>
                        <th class="py-2 px-3">Cliente</th>
                        <th class="py-2 px-3">Cidade</th>
                        <th class="py-2 px-3">Estado</th>
                        <th class="py-2 px-3">DataEntrega</th>
                    </tr>
                </thead>

                <tbody>
                    ${linhasHtml}
                </tbody>
            </table>
        </div>
    `;

    // Mantido sem alterações: atualiza os marcadores do mapa para a rota aberta.
    mostrarRotaNoMapa(regiao);
}

function alternarPlanejamentoRota(regiao) {
    if (typeof dadosApp !== 'undefined') {
        if (!dadosApp.rotasPlanejadas) {
            dadosApp.rotasPlanejadas = {};
        }

        dadosApp.rotasPlanejadas[regiao] = !dadosApp.rotasPlanejadas[regiao];
    }

    if (typeof salvarDados === 'function') {
        salvarDados();
    }

    gerarResumoRegioes();
    abrirRota(regiao);

    mostrarToast(`Status da rota ${regiao} atualizado!`, 'sucesso');
}



    function exportarRotaPDF(regiao) {
    try {
        const todosPedidos = (
            typeof dadosApp !== 'undefined' &&
            Array.isArray(dadosApp.pedidos)
        ) ? dadosApp.pedidos : [];

        const pedidosRegiao = todosPedidos.filter(p =>
            p &&
            p.tipoCarga === 'itinerante' &&
            p.regiao === regiao
        );

        if (pedidosRegiao.length === 0) {
            mostrarToast('Nenhum pedido para exportar nesta rota.', 'aviso');
            return;
        }

        const escapar = valor => String(valor ?? '-')
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');

        const formatarNumero = (valor, casas = 0) =>
            Number(valor || 0).toLocaleString('pt-BR', {
                minimumFractionDigits: casas,
                maximumFractionDigits: casas
            });

        const dataParaTimestamp = data => {
            if (!data) return Number.MAX_SAFE_INTEGER;

            const partes = String(data).split('/');
            if (partes.length !== 3) {
                return Number.MAX_SAFE_INTEGER;
            }

            const [dia, mes, ano] = partes.map(Number);
            const dataObj = new Date(ano, mes - 1, dia);

            if (
                dataObj.getFullYear() !== ano ||
                dataObj.getMonth() !== mes - 1 ||
                dataObj.getDate() !== dia
            ) {
                return Number.MAX_SAFE_INTEGER;
            }

            return dataObj.getTime();
        };

        // Determina o número da rota pela data prioritária.
        const resumoRegioes = {};

        todosPedidos
            .filter(p => p && p.tipoCarga === 'itinerante')
            .forEach(p => {
                const nomeRegiao = p.regiao || 'NAO MAPEADA';

                if (!resumoRegioes[nomeRegiao]) {
                    resumoRegioes[nomeRegiao] = {
                        datas: []
                    };
                }

                if (p.dataSaida) {
                    resumoRegioes[nomeRegiao].datas.push(p.dataSaida);
                }
            });

        const regioesOrdenadas = Object.entries(resumoRegioes)
            .map(([nomeRegiao, dados]) => ({
                regiao: nomeRegiao,
                dataPrioritaria: dados.datas.length
                    ? Math.min(...dados.datas.map(dataParaTimestamp))
                    : Number.MAX_SAFE_INTEGER
            }))
            .sort((a, b) =>
                a.dataPrioritaria - b.dataPrioritaria ||
                a.regiao.localeCompare(b.regiao, 'pt-BR')
            );

        const indiceRota = regioesOrdenadas.findIndex(
            item => item.regiao === regiao
        );

        const numeroRota = indiceRota >= 0
            ? String(indiceRota + 1).padStart(3, '0')
            : '001';

        // Indicadores gerais da rota.
        const totalPedidos = pedidosRegiao.length;

        const clientes = new Set(
            pedidosRegiao
                .map(p => String(p.cliente || '').trim())
                .filter(Boolean)
        );

        const totalClientes = clientes.size;

        const pesoTotal = pedidosRegiao.reduce(
            (total, p) => total + (Number(p.peso) || 0),
            0
        );

        const volumeTotal = pedidosRegiao.reduce(
            (total, p) => total + (Number(p.volumeTotal) || 0),
            0
        );

        const veiculosSugeridos = Math.ceil(totalPedidos / 30);

        const datasValidas = pedidosRegiao
            .map(p => ({
                texto: String(p.dataSaida || '').trim(),
                timestamp: dataParaTimestamp(p.dataSaida)
            }))
            .filter(item =>
                item.texto &&
                item.timestamp !== Number.MAX_SAFE_INTEGER
            )
            .sort((a, b) => a.timestamp - b.timestamp);

        const dataPrioritaria = datasValidas.length
            ? datasValidas[0].texto
            : '-';

        // Mantém a sequência manual definida pelo Planejador.
        const sequencia = (
            typeof dadosApp !== 'undefined' &&
            dadosApp.sequenciasRota &&
            Array.isArray(dadosApp.sequenciasRota[regiao])
        ) ? dadosApp.sequenciasRota[regiao] : [];

        const sequenciaHtml = sequencia.length
            ? sequencia.map((cidade, index) => `
                <tr>
                    <td class="numero-sequencia">${index + 1}</td>
                    <td>${escapar(cidade)}</td>
                </tr>
            `).join('')
            : `
                <tr>
                    <td colspan="2" class="sem-dados">
                        Sequência operacional ainda não definida.
                    </td>
                </tr>
            `;

        // Agrupa os pedidos por cliente.
        // Cada cliente aparece uma única vez no PDF.
        const clientesAgrupados = {};

        pedidosRegiao.forEach(p => {
            const nomeOriginal = String(p.cliente || '').trim();
            const nomeCliente = nomeOriginal || 'Cliente não informado';

            // Agrupa nomes iguais sem diferenciar maiúsculas/minúsculas.
            const chaveCliente = nomeCliente.toLocaleLowerCase('pt-BR');

            if (!clientesAgrupados[chaveCliente]) {
                clientesAgrupados[chaveCliente] = {
                    cliente: nomeCliente,
                    cidade: String(p.cidade || '').trim() || '-',
                    estado: String(p.estado || '').trim() || '-',
                    quantidadePedidos: 0,
                    pesoTotal: 0,
                    dataTimestamp: Number.MAX_SAFE_INTEGER
                };
            }

            const cliente = clientesAgrupados[chaveCliente];

            cliente.quantidadePedidos++;
            cliente.pesoTotal += Number(p.peso) || 0;

            // Mantém a primeira cidade/UF informada para o cliente.
            // Se estiverem vazias, aproveita dados de outro pedido.
            if (cliente.cidade === '-' && p.cidade) {
                cliente.cidade = String(p.cidade).trim();
            }

            if (cliente.estado === '-' && p.estado) {
                cliente.estado = String(p.estado).trim();
            }

            const timestamp = dataParaTimestamp(p.dataSaida);

            if (timestamp < cliente.dataTimestamp) {
                cliente.dataTimestamp = timestamp;
            }
        });

        // Ordena os clientes pela data de entrega mais próxima.
        const listaClientes = Object.values(clientesAgrupados)
            .sort((a, b) =>
                a.dataTimestamp - b.dataTimestamp ||
                a.cliente.localeCompare(b.cliente, 'pt-BR')
            );

        const clientesHtml = listaClientes.map(cliente => `
            <tr>
                <td>${escapar(cliente.cliente)}</td>
                <td>${escapar(cliente.cidade)}</td>
                <td>${escapar(cliente.estado)}</td>
                <td class="quantidade">
                    ${formatarNumero(cliente.quantidadePedidos)}
                </td>
                <td class="peso">
                    ${formatarNumero(cliente.pesoTotal, 2)} kg
                </td>
            </tr>
        `).join('');

        const dataEmissao = new Date().toLocaleDateString('pt-BR');

        const janelaPDF = window.open('', '_blank');

        if (!janelaPDF) {
            mostrarToast(
                'A janela do PDF foi bloqueada. Permita pop-ups para este site e tente novamente.',
                'erro'
            );
            return;
        }

        const htmlPDF = `
            <!DOCTYPE html>
            <html lang="pt-BR">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">

                <title>ROTA_${numeroRota}.pdf</title>

                <style>
                    @page {
                        size: A4 portrait;
                        margin: 14mm 12mm 16mm;
                    }

                    * {
                        box-sizing: border-box;
                    }

                    body {
                        margin: 0;
                        color: #1e293b;
                        font-family: Arial, Helvetica, sans-serif;
                        font-size: 10px;
                        line-height: 1.45;
                    }

                    .cabecalho {
                        padding-bottom: 14px;
                        margin-bottom: 18px;
                        border-bottom: 3px solid #0f766e;
                    }

                    .empresa {
                        margin: 0;
                        color: #0f766e;
                        font-size: 22px;
                        font-weight: 800;
                        letter-spacing: 1.2px;
                    }

                    .subtitulo {
                        margin: 5px 0 0;
                        color: #475569;
                        font-size: 12px;
                    }

                    .identificacao {
                        display: flex;
                        justify-content: space-between;
                        align-items: flex-start;
                        gap: 12px;
                        margin-top: 15px;
                    }

                    .numero-rota {
                        margin: 0;
                        font-size: 20px;
                        font-weight: 800;
                        color: #0f172a;
                    }

                    .etiqueta {
                        display: inline-block;
                        margin-top: 5px;
                        padding: 4px 8px;
                        border: 1px solid #cbd5e1;
                        border-radius: 4px;
                        color: #334155;
                        font-size: 9px;
                    }

                    .data-emissao {
                        color: #64748b;
                        text-align: right;
                        font-size: 9px;
                    }

                    .secao {
                        margin-top: 18px;
                    }

                    .titulo-secao {
                        margin: 0 0 9px;
                        padding-bottom: 6px;
                        border-bottom: 1px solid #cbd5e1;
                        color: #0f172a;
                        font-size: 12px;
                        font-weight: 800;
                        text-transform: uppercase;
                        letter-spacing: .4px;
                    }

                    .indicadores {
                        display: grid;
                        grid-template-columns: repeat(3, 1fr);
                        gap: 8px;
                    }

                    .indicador {
                        min-height: 57px;
                        padding: 9px;
                        border: 1px solid #dbe3ea;
                        border-radius: 5px;
                        page-break-inside: avoid;
                    }

                    .indicador span {
                        display: block;
                        margin-bottom: 5px;
                        color: #64748b;
                        font-size: 9px;
                    }

                    .indicador strong {
                        display: block;
                        color: #0f172a;
                        font-size: 13px;
                        overflow-wrap: anywhere;
                    }

                    table {
                        width: 100%;
                        border-collapse: collapse;
                        table-layout: fixed;
                    }

                    thead {
                        display: table-header-group;
                    }

                    tfoot {
                        display: table-footer-group;
                    }

                    th {
                        padding: 8px 6px;
                        background: #eaf2f5;
                        border: 1px solid #cbd5e1;
                        color: #1e293b;
                        text-align: left;
                        font-size: 9px;
                    }

                    td {
                        padding: 7px 6px;
                        border: 1px solid #e2e8f0;
                        overflow-wrap: anywhere;
                        vertical-align: top;
                    }

                    tbody tr:nth-child(even) {
                        background: #f8fafc;
                    }

                    tr {
                        page-break-inside: avoid;
                    }

                    .tabela-sequencia .numero-sequencia {
                        width: 42px;
                        text-align: center;
                        font-weight: 700;
                    }

                    /* Larguras ajustadas para a relação de clientes. */
                    .tabela-clientes th:nth-child(1) {
                        width: 38%;
                    }

                    .tabela-clientes th:nth-child(2) {
                        width: 25%;
                    }

                    .tabela-clientes th:nth-child(3) {
                        width: 10%;
                    }

                    .tabela-clientes th:nth-child(4) {
                        width: 12%;
                        text-align: center;
                    }

                    .tabela-clientes th:nth-child(5) {
                        width: 15%;
                        text-align: right;
                    }

                    .tabela-clientes .quantidade {
                        text-align: center;
                        white-space: nowrap;
                    }

                    .tabela-clientes .peso {
                        text-align: right;
                        white-space: nowrap;
                    }

                    .sem-dados {
                        padding: 12px;
                        color: #64748b;
                        text-align: center;
                    }

                    .rodape {
                        margin-top: 20px;
                        padding-top: 8px;
                        border-top: 1px solid #cbd5e1;
                        color: #64748b;
                        font-size: 8px;
                        display: flex;
                        justify-content: space-between;
                        gap: 10px;
                    }

                    .observacao {
                        margin-top: 12px;
                        color: #64748b;
                        font-size: 9px;
                    }

                    @media screen {
                        body {
                            max-width: 800px;
                            margin: 24px auto;
                            padding: 24px;
                            background: #fff;
                        }
                    }

                    @media print {
                        body {
                            -webkit-print-color-adjust: exact;
                            print-color-adjust: exact;
                        }

                        .secao {
                            page-break-inside: auto;
                        }
                    }
                </style>
            </head>

            <body>
                <header class="cabecalho">
                    <h1 class="empresa">LOGÍSTICA DARNEL</h1>
                    <p class="subtitulo">Planejamento Operacional de Rota</p>

                    <div class="identificacao">
                        <div>
                            <h2 class="numero-rota">ROTA ${numeroRota}</h2>
                            <span class="etiqueta">
                                Região: ${escapar(regiao)}
                            </span>
                        </div>

                        <div class="data-emissao">
                            <strong>Documento operacional</strong><br>
                            Emitido em ${dataEmissao}
                        </div>
                    </div>
                </header>

                <section class="secao">
                    <h3 class="titulo-secao">Resumo operacional</h3>

                    <div class="indicadores">
                        <div class="indicador">
                            <span>Região</span>
                            <strong>${escapar(regiao)}</strong>
                        </div>

                        <div class="indicador">
                            <span>Data prioritária</span>
                            <strong>${escapar(dataPrioritaria)}</strong>
                        </div>

                        <div class="indicador">
                            <span>Total de pedidos</span>
                            <strong>${formatarNumero(totalPedidos)}</strong>
                        </div>

                        <div class="indicador">
                            <span>Clientes distintos</span>
                            <strong>${formatarNumero(totalClientes)}</strong>
                        </div>

                        <div class="indicador">
                            <span>Peso total</span>
                            <strong>${formatarNumero(pesoTotal)} kg</strong>
                        </div>

                        <div class="indicador">
                            <span>Veículos sugeridos</span>
                            <strong>${formatarNumero(veiculosSugeridos)}</strong>
                        </div>
                    </div>

                    <p class="observacao">
                        Volume total registrado: ${formatarNumero(volumeTotal, 2)} m³.
                        A quantidade de veículos é uma estimativa baseada em
                        30 pedidos por veículo, conforme a regra atual do sistema.
                    </p>
                </section>

                <section class="secao">
                    <h3 class="titulo-secao">Sequência operacional</h3>

                    <table class="tabela-sequencia">
                        <thead>
                            <tr>
                                <th style="width: 42px;">Ordem</th>
                                <th>Cidade / parada</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${sequenciaHtml}
                        </tbody>
                    </table>
                </section>

                <section class="secao">
                    <h3 class="titulo-secao">
                        Relação de Clientes (${formatarNumero(totalClientes)})
                    </h3>

                    <table class="tabela-clientes">
                        <thead>
                            <tr>
                                <th>Cliente</th>
                                <th>Cidade</th>
                                <th>Estado</th>
                                <th>Pedidos</th>
                                <th>Peso Total</th>
                            </tr>
                        </thead>

                        <tbody>
                            ${clientesHtml}
                        </tbody>
                    </table>
                </section>

                <footer class="rodape">
                    <span>LOGÍSTICA DARNEL | Planejamento Operacional</span>
                    <span>ROTA ${numeroRota} — ${escapar(regiao)}</span>
                </footer>

                <script>
                    window.onload = function () {
                        window.focus();
                        window.print();
                    };
                <\/script>
            </body>
            </html>
        `;

        janelaPDF.document.open();
        janelaPDF.document.write(htmlPDF);
        janelaPDF.document.close();

    } catch (erro) {
        console.error('Erro ao gerar PDF da rota:', erro);

        mostrarToast(
            'Não foi possível preparar o PDF desta rota.',
            'erro'
        );
    }
}



function exportarRota(regiao) {
    const pedidosRegiao = dadosApp.pedidos.filter(
        p => p &&
            p.tipoCarga === 'itinerante' &&
            p.regiao === regiao
    );

    if (pedidosRegiao.length === 0) {
        mostrarToast('Nenhum pedido para exportar nesta rota.', 'aviso');
        return;
    }

    const dadosExcel = pedidosRegiao.map(p => ({
        Pedido: p.numeroPedido || '',
        Cliente: p.cliente || '',
        Cidade: p.cidade || '',
        Estado: p.estado || '',
        DataEntrega: p.dataSaida || '',
        Região: p.regiao || '',
        Peso: Number(p.peso || 0)
    }));

    const worksheet = XLSX.utils.json_to_sheet(dadosExcel);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Rota");

    const resumoStr = {};

    dadosApp.pedidos
        .filter(p => p && p.tipoCarga === 'itinerante')
        .forEach(pedido => {
            const reg = pedido.regiao || 'NAO MAPEADA';
            const dt = pedido.dataSaida || '';

            if (!resumoStr[reg]) {
                resumoStr[reg] = {
                    datas: []
                };
            }

            if (dt) {
                resumoStr[reg].datas.push(dt);
            }
        });

    const parseDataBRParaTimestamp = (dataStr) => {
        if (!dataStr || typeof dataStr !== 'string') {
            return 8640000000000;
        }

        const partes = dataStr.split('/');
        if (partes.length !== 3) return 8640000000000;

        const [dia, mes, ano] = partes;
        const timestamp = new Date(`${ano}-${mes}-${dia}`).getTime();

        return isNaN(timestamp) ? 8640000000000 : timestamp;
    };

    const arrRegioesOrdenadas = Object.entries(resumoStr)
        .map(([reg, dados]) => {
            let minTs = 8640000000000;

            dados.datas.forEach(d => {
                const ts = parseDataBRParaTimestamp(d);

                if (ts < minTs) {
                    minTs = ts;
                }
            });

            return {
                regiao: reg,
                timestamp: minTs
            };
        })
        .sort((a, b) => a.timestamp - b.timestamp);

    const indexRota = arrRegioesOrdenadas.findIndex(
        r => r.regiao === regiao
    );

    const numeroRotaStr = indexRota !== -1
        ? String(indexRota + 1).padStart(3, '0')
        : '001';

    const nomeArquivo = `ROTA_${numeroRotaStr}.xlsx`;

    XLSX.writeFile(workbook, nomeArquivo);

    mostrarToast(`Arquivo ${nomeArquivo} exportado com sucesso!`, 'sucesso');
}

function limparRotasWMS() {

    if (!confirm(
        "Deseja realmente remover todas as rotas WMS importadas?"
    )) {
        return;
    }

    // Remove apenas pedidos itinerantes
    dadosApp.pedidos =
        dadosApp.pedidos.filter(
            p => p.tipoCarga !== 'itinerante'
        );

    // Limpa rotas planejadas
    dadosApp.rotasPlanejadas = {};

    // Limpa sequências
    dadosApp.sequenciasRota = {};

    salvarDados();

    atualizarInterfaceGeral();

    mostrarToast(
        "Rotas WMS removidas com sucesso.",
        "sucesso"
    );

}