/*
=========================================
MÓDULO PLANEJAMENTO
=========================================

Funções do Planejamento.

=========================================
*/

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
            if (!cidade) return 'NAO MAPEADA';
            const c = String(cidade)
                .normalize("NFD")
                .replace(/[\u0300-\u036f]/g, "")
                .trim()
                .toLowerCase();

            const rmc = ['curitiba', 'araucaria', 'pinhais', 'colombo', 'campo largo', 'sao jose dos pinhais', 'fazenda rio grande'];
            const litoral = ['paranagua', 'matinhos', 'guaratuba', 'pontal do parana'];
            const norte = ['londrina', 'maringa', 'apucarana', 'arapongas', 'cambe'];
            const oeste = ['cascavel', 'toledo', 'marechal candido rondon', 'foz do iguacu'];
            const scNorte = ['joinville', 'blumenau', 'jaragua do sul', 'brusque'];
            const scVale = ['itajai', 'navegantes', 'balneario camboriu'];
            const spCapital = ['sao paulo', 'osasco', 'barueri', 'santo andre'];
            const spInterior = ['campinas', 'jundiai', 'ribeirao preto', 'sao jose dos campos'];
            const exterior = ['ex'];

            if (rmc.some(item => c.includes(item))) return 'RMC';
            if (litoral.some(item => c.includes(item))) return 'LITORAL_PR';
            if (norte.some(item => c.includes(item))) return 'NORTE_PR';
            if (oeste.some(item => c.includes(item))) return 'OESTE_PR';
            if (scNorte.some(item => c.includes(item))) return 'SC_NORTE';
            if (scVale.some(item => c.includes(item))) return 'SC_VALE';
            if (spCapital.some(item => c.includes(item))) return 'SP_CAPITAL';
            if (spInterior.some(item => c.includes(item))) return 'SP_INTERIOR';
            if (exterior.some(item => c.includes(item))) return 'EXTERIOR';

            return 'NAO MAPEADA';
        }

        function importarPlanilhaWMS() {
            if (setorAutenticado !== 'planejamento' && setorAutenticado !== 'admin') {
                mostrarToast('Acesso negado. Desbloqueie com a senha do Planejamento.', 'erro');
                return;
            }

            const input = document.getElementById('inputArquivoWMS');
            if (!input.files || input.files.length === 0) {
                mostrarToast('Selecione uma planilha do WMS para importar.', 'aviso');
                return;
            }

            mostrarToast('Processando planilha WMS...', 'aviso');

            const arquivo = input.files[0];
            const reader = new FileReader();

            reader.onload = function(e) {
                try {
                    const data = new Uint8Array(e.target.result);
                    const workbook = XLSX.read(data, { type: 'array', cellDates: true });

                    const worksheet = workbook.Sheets["Consulta1"] || workbook.Sheets[workbook.SheetNames[0]];
                    if (!worksheet) {
                        mostrarToast('Aba Consulta1 não encontrada na planilha.', 'erro');
                        return;
                    }

                    const linhas = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

                    if (!linhas || linhas.length <= 1) {
                        mostrarToast('A planilha está vazia ou contém apenas o cabeçalho.', 'erro');
                        return;
                    }

                    const cabecalhos = (linhas[0] || []).map(h => String(h || '').trim());

                    const encontrarIndice = (termos) => {
                        return cabecalhos.findIndex(h => {
                            const hClean = String(h).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toUpperCase().replace(/[^A-Z0-9]/g, "");
                            return termos.some(termo => hClean === termo || hClean.includes(termo));
                        });
                    };

                    const idxCliente = encontrarIndice(['CLIENTE', 'NOMEDOCLIENTE', 'NOME']);
                    const idxCidade = encontrarIndice(['CIDADE']);
                    const idxEstado = encontrarIndice(['ESTADO', 'UF']);
                    const idxDataEntrega = encontrarIndice(['DATAENTREGA', 'ENTREGA']);
                    const idxPedido = encontrarIndice(['PEDIDO', 'NUMEROPEDIDO']);
                    const idxStatusWMS = encontrarIndice(['STATUSWMS', 'STATUS']);
                    const idxPesoTotal = encontrarIndice(['PESOTOTAL', 'PESO']);
                    const idxVolumeTotal = encontrarIndice(['VOLUMETOTAL', 'VOLUME', 'QTD', 'QUANTIDADE']);

                    if (idxCidade === -1 || idxEstado === -1 || idxPesoTotal === -1) {
                        mostrarToast('Colunas obrigatórias (Cidade, Estado ou PesoTotal) não encontradas.', 'erro');
                        return;
                    }

                    let novosPedidosLote = [];
                    let importedCount = 0;

                    for (let i = 1; i < linhas.length; i++) {
                        const row = linhas[i];
                        if (!row || row.length === 0) continue;

                        const getVal = (idx) => (idx !== -1 && row[idx] !== undefined && row[idx] !== null) ? String(row[idx]).trim() : '';

                        const statusWMS = getVal(idxStatusWMS) ? getVal(idxStatusWMS).toUpperCase() : 'AGUARDANDO';
                        const numPedido = getVal(idxPedido) ? getVal(idxPedido).toUpperCase() : `PED-${i}`;
                        const nomeCliente = getVal(idxCliente) || `Cliente ${i}`;
                        
                        let cidadeRaw = getVal(idxCidade);
                        let estadoRaw = getVal(idxEstado);

                        if (cidadeRaw.length === 2 && estadoRaw.length > 2) {
                            const temp = cidadeRaw;
                            cidadeRaw = estadoRaw;
                            estadoRaw = temp;
                        }

                        const cidade = cidadeRaw ? cidadeRaw.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim() : '';
                        const estado = estadoRaw ? estadoRaw.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().toUpperCase() : '';

                        const destino = (cidade && estado)
                            ? `${cidade} - ${estado}`
                            : (cidade || estado || 'Curitiba - PR');

                        let dataReqBR = '';
                        if (idxDataEntrega !== -1 && row[idxDataEntrega] !== undefined) {
                            dataReqBR = formatarDataBR(row[idxDataEntrega]);
                        } else {
                            dataReqBR = formatarDataBR(new Date());
                        }

                        let rawPeso = idxPesoTotal !== -1 ? row[idxPesoTotal] : 0;
                        let pesoTotal = 0;
                        if (rawPeso !== undefined && rawPeso !== null) {
                            if (typeof rawPeso === 'number') {
                                pesoTotal = rawPeso;
                            } else {
                                let limpo = String(rawPeso).replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, '');
                                pesoTotal = Number(limpo) || 0;
                            }
                        }

                        let rawVolume = idxVolumeTotal !== -1 ? row[idxVolumeTotal] : 1;
                        let qtdPedido = 1;
                        if (rawVolume !== undefined && rawVolume !== null) {
                            if (typeof rawVolume === 'number') {
                                qtdPedido = rawVolume;
                            } else {
                                let limpoVol = String(rawVolume).replace(/\./g, '').replace(',', '.').replace(/[^\d.-]/g, '');
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
                            'Nenhum pedido compatível encontrado.',
                            'aviso'
                        );
                    }

                } catch (err) {
                    mostrarToast(
                        'Erro ao ler a planilha WMS.',
                        'erro'
                    );
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
                if (tituloTabela) tituloTabela.textContent = "Cargas Dedicadas Cadastradas";
            } else {
                subDed.classList.add('hidden');
                subItin.classList.remove('hidden');
                btnItin.className = "px-4 py-2 text-xs font-bold uppercase rounded-lg bg-emerald-600 text-white shadow transition flex items-center space-x-1.5";
                btnDed.className = "px-4 py-2 text-xs font-bold uppercase rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-300 transition flex items-center space-x-1.5";
                if (tituloTabela) tituloTabela.textContent = "Cargas Consolidadas por Cliente (WMS)";
                setTimeout(() => { if (mapaObj) mapaObj.invalidateSize(); }, 200);
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

            dadosApp.pedidos
                .filter(p => p.tipoCarga === 'itinerante')
                .forEach(pedido => {
                    const regiao = pedido.regiao || 'NAO MAPEADA';

                    if (!resumo[regiao]) {
                        resumo[regiao] = {
                            pedidos: 0,
                            clientes: new Set(),
                            peso: 0
                        };
                    }

                    resumo[regiao].pedidos++;
                    if (pedido.cliente) {
                        resumo[regiao].clientes.add(pedido.cliente);
                    }
                    resumo[regiao].peso += Number(pedido.peso || 0);
                });

            Object.keys(resumo).forEach(regiao => {
                resumo[regiao].veiculos = Math.ceil(resumo[regiao].pedidos / 30);
            });

            painel.innerHTML = Object.entries(resumo)
                .sort((a, b) => b[1].pedidos - a[1].pedidos)
                .map(([regiao, dados]) => `
                    <div class="bg-white dark:bg-slate-800
                                border border-slate-200
                                dark:border-slate-700
                                rounded-xl p-4 shadow-sm">
                        <div class="font-bold text-blue-600 mb-2">
                            📍 ${regiao}
                        </div>
                        <div class="text-sm">
                            Pedidos: ${dados.pedidos}
                            <br>
                            Clientes: ${dados.clientes.size}
                            <br>
                            Peso: ${Math.round(dados.peso).toLocaleString('pt-BR')} Kg
                            <br>
                            Veículos sugeridos: ${dados.veiculos}
                        </div>
                    </div>
                `).join('');
        }