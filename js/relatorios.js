        function aplicarFiltroRelatorio() {
            const valData = document.getElementById('filtroRelatorioData').value;
            const valMes = document.getElementById('filtroRelatorioMes').value;

            if (valData) {
                relatorioFiltroAtivo = { tipo: 'data', valorData: formatarDataParaExibicao(valData), valorMes: '' };
            } else if (valMes) {
                relatorioFiltroAtivo = { tipo: 'mes', valorData: '', valorMes: valMes };
            } else {
                relatorioFiltroAtivo = { tipo: 'hoje', valorData: obterDataAtualBrasil(), valorMes: '' };
            }
            renderizarCalendario();
        }

                function resetarFiltroRelatorio() {
            document.getElementById('filtroRelatorioData').value = '';
            document.getElementById('filtroRelatorioMes').value = '';
            relatorioFiltroAtivo = { tipo: 'hoje', valorData: obterDataAtualBrasil(), valorMes: '' };
            renderizarCalendario();
        }

                function obterPedidosFiltradosRelatorio() {
            if (!relatorioFiltroAtivo.tipo) {
                relatorioFiltroAtivo = { tipo: 'hoje', valorData: obterDataAtualBrasil(), valorMes: '' };
            }

            const hojeStr = obterDataAtualBrasil();
            if (relatorioFiltroAtivo.tipo === 'hoje') {
                return dadosApp.pedidos.filter(item => (item.dataSaida || '') === hojeStr);
            } else if (relatorioFiltroAtivo.tipo === 'data') {
                return dadosApp.pedidos.filter(item => (item.dataSaida || '') === relatorioFiltroAtivo.valorData);
            } else if (relatorioFiltroAtivo.tipo === 'mes') {
                const [anoFiltro, mesFiltro] = relatorioFiltroAtivo.valorMes.split('-');
                return dadosApp.pedidos.filter(item => {
                    if (!item.dataSaida || !item.dataSaida.includes('/')) return false;
                    const partes = item.dataSaida.split('/');
                    if (partes.length !== 3) return false;
                    return partes[1] === mesFiltro && partes[2] === anoFiltro;
                });
            }
            return [];
        }

                function renderizarCalendario() {
            const pedidosExibicao = obterPedidosFiltradosRelatorio();
            document.getElementById('contadorConsolidado').textContent = `${pedidosExibicao.length} registro(s)`;
            
            let totalPeds = pedidosExibicao.length;
            let totalEntregues = 0;
            let totalPalNum = 0;
            let temBatida = false;
            let totalKg = 0;

            pedidosExibicao.forEach(item => {
                const num = item.numeroPedido || item.nota;
                const est = calcularStatusEtapa(num);
                if (est.id === 6) totalEntregues++;
                
                const palStr = String(item.paletes || item.qtdPedido || '0');
                if (palStr.toUpperCase().includes('BATIDA')) {
                    temBatida = true;
                } else {
                    const numP = parseInt(palStr) || 0;
                    totalPalNum += numP;
                }
                totalKg += Number(item.peso || 0);
            });

            const textoPaletes = temBatida ? (totalPalNum > 0 ? `${totalPalNum} Paletes + Batida` : 'Carga Batida') : totalPalNum;

            document.getElementById('resumoTotalPedidos').textContent = totalPeds;
            document.getElementById('resumoTotalEntregues').textContent = totalEntregues;
            document.getElementById('resumoTotalPaletes').textContent = textoPaletes;
            document.getElementById('resumoTotalPeso').textContent = totalKg.toLocaleString('pt-BR') + ' Kg';

            const tbody = document.getElementById('tabelaConsolidadaBody');
            if(!tbody) return;

            if (pedidosExibicao.length === 0) {
                tbody.innerHTML = `<tr><td colspan="4" class="p-6 text-center text-slate-400 italic">Nenhum pedido encontrado no período.</td></tr>`;
                return;
            }

            tbody.innerHTML = pedidosExibicao.map(item => {
                const num = item.numeroPedido || item.nota;
                return `
                    <tr class="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                        <td class="p-3.5">
                            <span class="font-mono font-bold block text-sm">${num}</span>
                            <span class="text-xs font-mono text-emerald-600 dark:text-emerald-400">NF: ${obterNFDoPedido(num)}</span>
                        </td>
                        <td class="p-3.5">
                            <span class="font-bold block">${item.cliente}</span>
                            <span class="text-xs text-slate-500">${item.destinoCidade || '-'}</span>
                        </td>
                        <td class="p-3.5 text-center">
                            <div class="flex justify-center">
                                ${renderizarStepperProgresso(num)}
                            </div>
                        </td>
                        <td class="p-3.5">
                            ${renderizarBadgeStatus(num)}
                        </td>
                    </tr>
                `;
            }).join('');
        }

               function exportarRelatorioExcelFiltrado() {
            const pedidosExibicao = obterPedidosFiltradosRelatorio();
            if (pedidosExibicao.length === 0) {
                mostrarToast('Não há dados filtrados para exportar.', 'aviso');
                return;
            }

            const dadosFormatados = pedidosExibicao.map(item => {
                const num = item.numeroPedido || item.nota || '-';
                const nf = obterNFDoPedido(num);
                const ticket = obterTicketDoPedido(num);
                const etapa = calcularStatusEtapa(num);
                const garg = verificarGargaloSLA(num);
                const trcItem = (dadosApp.tracking || []).find(t => String(t.numPedido || '').trim().toLowerCase() === String(num).trim().toLowerCase());

                return {
                    "Nº Pedido": num,
                    "Nota Fiscal (NF)": nf,
                    "Cliente": item.cliente || '-',
                    "Destino / Cidade": item.destinoCidade || '-',
                    "Data Agendada": item.dataSaida || '-',
                    "Tipo de Carga": (item.tipoCarga || 'dedicada').toUpperCase(),
                    "Paletes / Batida": item.paletes || item.qtdPedido || '-',
                    "Peso Total (Kg)": item.peso || 0,
                    "Ticket Transporte": ticket || '-',
                    "Status Atual na Esteira": etapa.badge,
                    "SLA / Gargalo (>24h)": garg.estagnado ? `SIM (${garg.horas}h no ${garg.setor})` : "OK",
                    "Status Entrega / Ocorrência": trcItem ? trcItem.statusFinal : "Pendente",
                    "Motivo Técnico da Avaria": trcItem ? (trcItem.motivoAvaria || '-') : '-'
                };
            });

            const wb = XLSX.utils.book_new();
            const ws = XLSX.utils.json_to_sheet(dadosFormatados);

            ws['!cols'] = [
                { wch: 16 }, { wch: 18 }, { wch: 28 }, { wch: 22 }, { wch: 15 },
                { wch: 15 }, { wch: 16 }, { wch: 16 }, { wch: 18 }, { wch: 35 },
                { wch: 25 }, { wch: 25 }, { wch: 35 }
            ];

            XLSX.utils.book_append_sheet(wb, ws, "Relatorio_Logistica");
            XLSX.writeFile(wb, "Relatorio_Logistica_Darnel_Filtrado.xlsx");
            mostrarToast('Planilha Excel exportada com sucesso!', 'sucesso');
        }