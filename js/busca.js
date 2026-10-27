/*
=========================================
MÓDULO BUSCA
=========================================

Responsável por:

- Busca global
- Navegação por resultados

=========================================
*/

        function navegarParaTabGlobal(tab, subtab) {
            mudarTab(tab);
            if (tab === 'pedidos' && subtab) {
                mudarSubTab(subtab);
            }
            document.getElementById('dropdownBuscaGlobal').classList.add('hidden');
            document.getElementById('inputBuscaGlobal').value = '';
        }

                function executarBuscaGlobal(termo) {
            const drop = document.getElementById('dropdownBuscaGlobal');
            const termoNorm = termo.trim().toLowerCase();

            if (!termoNorm || termoNorm.length < 2) {
                drop.classList.add('hidden');
                drop.innerHTML = '';
                return;
            }

            let resultados = [];

            (dadosApp.pedidos || []).forEach(p => {
                const num = (p.numeroPedido || '').toLowerCase();
                const nota = (p.nota || '').toLowerCase();
                const cli = (p.cliente || '').toLowerCase();
                const dest = (p.destinoCidade || '').toLowerCase();

                if (num.includes(termoNorm) || nota.includes(termoNorm) || cli.includes(termoNorm) || dest.includes(termoNorm)) {
                    resultados.push({
                        titulo: `Pedido: ${p.numeroPedido || '-'} (NF: ${p.nota || '-'})`,
                        detalhe: `Cliente: ${p.cliente} | Destino: ${p.destinoCidade}`,
                        tab: 'pedidos',
                        subtab: p.tipoCarga || 'dedicada'
                    });
                }
            });

            (dadosApp.faturamento || []).forEach(f => {
                const num = (f.numPedido || '').toLowerCase();
                const nota = (f.notaFiscal || '').toLowerCase();

                if (num.includes(termoNorm) || nota.includes(termoNorm)) {
                    resultados.push({
                        titulo: `Faturamento - Pedido: ${f.numPedido} | NF: ${f.notaFiscal}`,
                        detalhe: `Data: ${f.dataFaturamento} | Total: ${f.totalKg} Kg`,
                        tab: 'faturamento'
                    });
                }
            });

            (dadosApp.comercial || []).forEach(c => {
                const num = (c.numPedido || '').toLowerCase();
                const tkt = (c.ticket || '').toLowerCase();

                if (num.includes(termoNorm) || tkt.includes(termoNorm)) {
                    resultados.push({
                        titulo: `Comercial - Pedido: ${c.numPedido} | Ticket: ${c.ticket}`,
                        detalhe: `Agenda Conf: ${c.dataAgendaConfirmada}`,
                        tab: 'comercial'
                    });
                }
            });

            (dadosApp.agendamentos || []).forEach(a => {
                const num = (a.numPedido || '').toLowerCase();
                const tkt = (a.ticket || '').toLowerCase();
                const placa = (a.placa || '').toLowerCase();
                const mot = (a.motorista || '').toLowerCase();

                if (num.includes(termoNorm) || tkt.includes(termoNorm) || placa.includes(termoNorm) || mot.includes(termoNorm)) {
                    resultados.push({
                        titulo: `Transporte - Pedido: ${a.numPedido} | Placa: ${a.placa}`,
                        detalhe: `Transp: ${a.transportadora} | Motorista: ${a.motorista}`,
                        tab: 'agendamentos'
                    });
                }
            });

            (dadosApp.operacao || []).forEach(o => {
                const carga = (o.numCarga || '').toLowerCase();
                const num = (o.numPedido || '').toLowerCase();
                const nota = (o.nota || '').toLowerCase();

                if (carga.includes(termoNorm) || num.includes(termoNorm) || nota.includes(termoNorm)) {
                    resultados.push({
                        titulo: `Operação - Carga: ${o.numCarga} | Pedido: ${o.numPedido}`,
                        detalhe: `Equipe: ${o.equipe} | Horário: ${o.horaInicio} às ${o.horaFim}`,
                        tab: 'operacao'
                    });
                }
            });

            (dadosApp.tracking || []).forEach(t => {
                const num = (t.numPedido || '').toLowerCase();
                const tkt = (t.ticket || '').toLowerCase();

                if (num.includes(termoNorm) || tkt.includes(termoNorm)) {
                    resultados.push({
                        titulo: `Tracking - Pedido: ${t.numPedido} | Status: ${t.statusFinal}`,
                        detalhe: `Ticket: ${t.ticket}`,
                        tab: 'tracking'
                    });
                }
            });

            if (resultados.length === 0) {
                drop.innerHTML = `<div class="p-2 text-slate-400 italic text-center">Nenhum registro encontrado.</div>`;
            } else {
                drop.innerHTML = resultados.slice(0, 8).map(r => `
                    <div onclick="navegarParaTabGlobal('${r.tab}', '${r.subtab || ''}')" class="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg cursor-pointer transition">
                        <div class="font-bold text-blue-600 dark:text-blue-400">${r.titulo}</div>
                        <div class="text-[11px] text-slate-500 dark:text-slate-400">${r.detalhe} &bull; <span class="uppercase font-semibold text-indigo-500">Ir para ${r.tab}</span></div>
                    </div>
                `).join('');
            }
            drop.classList.remove('hidden');
        }