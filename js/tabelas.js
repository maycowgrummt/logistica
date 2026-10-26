/*
=========================================
MÓDULO TABELAS
=========================================

Responsável por:

- Renderização das tabelas
- Atualização visual das listas
- Exibição dos registros

=========================================
*/

        function renderizarTabelasPedidos() {
            const tbody = document.getElementById('tabelaPedidosBody');
            const trHead = document.getElementById('tabelaCabecalhoTr');
            if(!tbody || !trHead) return;

            let pedidosFiltrados = dadosApp.pedidos.filter(p => (p.tipoCarga || 'dedicada') === subTabAtiva);

            if (subTabAtiva === 'dedicada') {
                trHead.innerHTML = `
                    <th class="p-3.5 text-center"><input type="checkbox"></th>
                    <th class="p-3.5">Nº Pedido</th><th class="p-3.5">NF</th><th class="p-3.5">Destino</th>
                    <th class="p-3.5">Data Agendada</th><th class="p-3.5">Cliente</th><th class="p-3.5">Veículo</th>
                    <th class="p-3.5">Paletes / Batida</th><th class="p-3.5">Status na Esteira</th><th class="p-3.5 text-center">Ações</th>
                `;
                tbody.innerHTML = pedidosFiltrados.length === 0
                    ? `<tr><td colspan="10" class="p-6 text-center text-slate-400">Nenhuma carga dedicada.</td></tr>`
                    : pedidosFiltrados.map(item => `
                        <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 ${item.temAlertaData ? 'bg-rose-50 dark:bg-rose-950/20' : ''}">
                            <td class="p-3.5 text-center"><input type="checkbox"></td>
                            <td class="p-3.5 font-mono font-bold">${item.numeroPedido || '-'}</td>
                            <td class="p-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">${obterNFDoPedido(item.numeroPedido || item.nota)}</td>
                            <td class="p-3.5 text-xs font-bold">${item.destinoCidade || '-'}</td>
                            <td class="p-3.5 font-mono font-bold ${item.temAlertaData ? 'text-rose-600 dark:text-rose-500 animate-pulse' : 'text-blue-600 dark:text-blue-400'}">
                                ${item.dataSaida || '-'}
                                ${item.temAlertaData ? '<span class="block text-[10px] text-rose-500 font-bold">⚠️ Alterada</span>' : ''}
                            </td>
                            <td class="p-3.5 font-medium">${item.cliente}</td>
                            <td class="p-3.5 text-xs font-semibold text-blue-600 dark:text-blue-400">${item.tipoVeiculo || '-'}</td>
                            <td class="p-3.5 font-mono font-bold text-slate-700 dark:text-slate-300">${item.paletes || '-'}</td>
                            <td class="p-3.5">${renderizarBadgeStatus(item.numeroPedido || item.nota)}</td>
                            <td class="p-3.5 text-center">
                                <div class="flex items-center justify-center space-x-2">
                                    <button onclick="abrirModalEdicao('pedidos', ${item.id})" class="text-blue-600 dark:text-blue-400 font-bold text-xs hover:underline flex items-center space-x-1">
                                        <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                                        <span>Editar</span>
                                    </button>
                                    <button onclick="deletarItem('pedidos', ${item.id})" class="text-red-500 font-bold text-xs hover:underline flex items-center space-x-1">
                                        <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                        <span>Excluir</span>
                                    </button>
                                </div>
                            </td>
                        </tr>
                    `).join('');
            } else {
                trHead.innerHTML = `<th class="p-3.5">Cliente</th><th class="p-3.5">Qtd</th><th class="p-3.5">Cidade</th><th class="p-3.5">Data Requerida</th><th class="p-3.5">Pedidos / NF</th><th class="p-3.5">Status na Esteira</th><th class="p-3.5 text-center">Ações</th>`;
                tbody.innerHTML = pedidosFiltrados.map(cli => `
                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td class="p-3.5 font-bold">${cli.cliente}</td>
                        <td class="p-3.5 font-mono">${cli.qtdPedido || 1}</td>
                        <td class="p-3.5 text-xs">${cli.destinoCidade}</td>
                        <td class="p-3.5 font-mono text-blue-600 dark:text-blue-400">${cli.dataSaida}</td>
                        <td class="p-3.5 font-mono text-xs">${cli.numeroPedido} | NF: ${obterNFDoPedido(cli.numeroPedido)}</td>
                        <td class="p-3.5">${renderizarBadgeStatus(cli.numeroPedido)}</td>
                        <td class="p-3.5 text-center">
                            <div class="flex items-center justify-center space-x-2">
                                <button onclick="abrirModalEdicao('pedidos', ${cli.id})" class="text-blue-600 dark:text-blue-400 font-bold text-xs hover:underline flex items-center space-x-1">
                                    <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                                    <span>Editar</span>
                                </button>
                                <button onclick="deletarItem('pedidos', ${cli.id})" class="text-red-500 text-xs font-bold hover:underline flex items-center space-x-1">
                                    <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                    <span>Excluir</span>
                                </button>
                            </div>
                        </td>
                    </tr>
                `).join('');
            }
            lucide.createIcons();
        }

                function renderizarTabelasAgendamentos() {
            const tbody = document.getElementById('tabelaAgendamentosBody');
            if(!tbody) return;
            tbody.innerHTML = dadosApp.agendamentos.map(i => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td class="p-3.5 font-mono font-bold">${i.numPedido || '-'}</td>
                    <td class="p-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">${obterNFDoPedido(i.numPedido || i.nota)}</td>
                    <td class="p-3.5 font-mono text-indigo-600 dark:text-indigo-400 font-bold">${i.ticket}</td>
                    <td class="p-3.5 font-mono text-blue-600 dark:text-blue-400 font-bold">${i.dataEntrega || '-'} ${i.horaEntrega || ''}</td>
                    <td class="p-3.5">${i.transportadora}</td>
                    <td class="p-3.5 font-mono text-xs">${i.placa} / ${i.motorista}</td>
                    <td class="p-3.5">${renderizarBadgeStatus(i.numPedido)}</td>
                    <td class="p-3.5 text-center">
                        <div class="flex items-center justify-center space-x-2">
                            <button onclick="abrirModalEdicao('agendamentos', ${i.id})" class="text-blue-600 dark:text-blue-400 font-bold text-xs hover:underline flex items-center space-x-1">
                                <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                                <span>Editar</span>
                            </button>
                            <button onclick="deletarItem('agendamentos', ${i.id})" class="text-red-500 text-xs font-bold hover:underline flex items-center space-x-1">
                                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                <span>Excluir</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
            lucide.createIcons();
        }

                function renderizarTabelasOperacao() {
            const tbody = document.getElementById('tabelaOperacaoBody');
            if(!tbody) return;
            tbody.innerHTML = (dadosApp.operacao || []).map(i => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td class="p-3.5 font-mono font-bold text-blue-600 dark:text-blue-400">${i.numCarga || '-'}</td>
                    <td class="p-3.5 font-mono">${i.numPedido || '-'}</td>
                    <td class="p-3.5 font-mono font-bold text-emerald-600 dark:text-emerald-400">${i.nota && i.nota !== '-' ? i.nota : obterNFDoPedido(i.numPedido)}</td>
                    <td class="p-3.5 font-mono">${i.horaInicio} às ${i.horaFim}</td>
                    <td class="p-3.5">${i.equipe}</td>
                    <td class="p-3.5">${renderizarBadgeStatus(i.numPedido)}</td>
                    <td class="p-3.5 text-center">
                        <div class="flex items-center justify-center space-x-2">
                            <button onclick="abrirModalEdicao('operacao', ${i.id})" class="text-blue-600 dark:text-blue-400 font-bold text-xs hover:underline flex items-center space-x-1">
                                <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                                <span>Editar</span>
                            </button>
                            <button onclick="deletarItem('operacao', ${i.id})" class="text-red-500 text-xs font-bold hover:underline flex items-center space-x-1">
                                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                <span>Excluir</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
            lucide.createIcons();
        }

               function renderizarTabelasFaturamento() {
            const tbody = document.getElementById('tabelaFaturamentoBody');
            if(!tbody) return;
            tbody.innerHTML = (dadosApp.faturamento || []).map(item => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td class="p-3.5 font-mono font-bold">${item.numPedido || '-'}</td>
                    <td class="p-3.5 font-mono font-bold text-cyan-600 dark:text-cyan-400">${item.notaFiscal}</td>
                    <td class="p-3.5 font-mono text-blue-600 dark:text-blue-400">${item.dataFaturamento}</td>
                    <td class="p-3.5 font-semibold">${item.estrechado}</td>
                    <td class="p-3.5 font-mono">${item.qtdPaletes}</td>
                    <td class="p-3.5 font-mono">${Number(item.totalKg).toLocaleString('pt-BR')} Kg</td>
                    <td class="p-3.5">${renderizarBadgeStatus(item.numPedido)}</td>
                    <td class="p-3.5 text-center">
                        <div class="flex items-center justify-center space-x-2">
                            <button onclick="abrirModalEdicao('faturamento', ${item.id})" class="text-blue-600 dark:text-blue-400 font-bold text-xs hover:underline flex items-center space-x-1">
                                <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                                <span>Editar</span>
                            </button>
                            <button onclick="deletarItem('faturamento', ${item.id})" class="text-red-500 text-xs font-bold hover:underline flex items-center space-x-1">
                                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                <span>Excluir</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
            lucide.createIcons();
        }

                function renderizarTabelasComercial() {
            const tbody = document.getElementById('tabelaComercialBody');
            if(!tbody) return;
            tbody.innerHTML = (dadosApp.comercial || []).map(item => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td class="p-3.5 font-mono font-bold text-teal-600 dark:text-teal-400">${item.numPedido}</td>
                    <td class="p-3.5 font-mono font-bold">${obterNFDoPedido(item.numPedido || item.nota)}</td>
                    <td class="p-3.5 font-mono">${item.dataSolicitacao}</td>
                    <td class="p-3.5 font-mono text-emerald-600 dark:text-emerald-400 font-bold">${item.dataAgendaConfirmada}</td>
                    <td class="p-3.5 font-mono text-indigo-600 dark:text-indigo-400 font-bold">${item.ticket}</td>
                    <td class="p-3.5">${renderizarBadgeStatus(item.numPedido)}</td>
                    <td class="p-3.5 text-center">
                        <div class="flex items-center justify-center space-x-2">
                            <button onclick="abrirModalEdicao('comercial', ${item.id})" class="text-blue-600 dark:text-blue-400 font-bold text-xs hover:underline flex items-center space-x-1">
                                <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                                <span>Editar</span>
                            </button>
                            <button onclick="deletarItem('comercial', ${item.id})" class="text-red-500 text-xs font-bold hover:underline flex items-center space-x-1">
                                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                <span>Excluir</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
            lucide.createIcons();
        }

                function renderizarTabelasTracking() {
            const tbody = document.getElementById('tabelaTrackingBody');
            if(!tbody) return;
            tbody.innerHTML = dadosApp.tracking.map(i => `
                <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50 ${i.statusFinal !== 'ENTREGUE (OK)' ? 'bg-rose-50 dark:bg-rose-950/20' : ''}">
                    <td class="p-3.5 font-mono font-bold">${i.numPedido || '-'}</td>
                    <td class="p-3.5 font-mono font-bold text-purple-600 dark:text-purple-400">${obterNFDoPedido(i.numPedido || i.nota)}</td>
                    <td class="p-3.5 font-mono font-bold text-indigo-600 dark:text-indigo-400">${i.ticket || obterTicketDoPedido(i.numPedido) || '-'}</td>
                    <td class="p-3.5 font-semibold ${i.statusFinal === 'ENTREGUE (OK)' ? 'text-purple-600 dark:text-purple-400' : 'text-rose-600 dark:text-rose-400'}">${i.statusFinal}</td>
                    <td class="p-3.5 text-xs font-medium text-slate-700 dark:text-slate-300">${i.motivoAvaria && i.motivoAvaria !== '-' ? i.motivoAvaria : '<span class="text-slate-400">-</span>'}</td>
                    <td class="p-3.5">${renderizarBadgeStatus(i.numPedido)}</td>
                    <td class="p-3.5 text-center">
                        <div class="flex items-center justify-center space-x-2">
                            <button onclick="abrirModalEdicao('tracking', ${i.id})" class="text-blue-600 dark:text-blue-400 font-bold text-xs hover:underline flex items-center space-x-1">
                                <i data-lucide="edit-3" class="w-3.5 h-3.5"></i>
                                <span>Editar</span>
                            </button>
                            <button onclick="deletarItem('tracking', ${i.id})" class="text-red-500 text-xs font-bold hover:underline flex items-center space-x-1">
                                <i data-lucide="trash-2" class="w-3.5 h-3.5"></i>
                                <span>Excluir</span>
                            </button>
                        </div>
                    </td>
                </tr>
            `).join('');
            lucide.createIcons();
        }