/*
=========================================
MÓDULO ALERTAS
=========================================

Responsável por:

- Alertas de alteração de data
- Gargalos SLA
- Painel de alertas
- Auditoria
- Limpeza de alertas

=========================================
*/

        function alternarPainelAlertas() {
            document.getElementById('painelAlertas').classList.toggle('hidden');
        }

                function mudarSubPainelAlerta(tipo) {
            subPainelAlertaAtivo = tipo;
            const btnGargalos = document.getElementById('btnSubPainelGargalos');
            const btnAvarias = document.getElementById('btnSubPainelAvarias');
            const btnDatas = document.getElementById('btnSubPainelDatas');
            const btnAuditoria = document.getElementById('btnSubPainelAuditoria');
            const secGargalos = document.getElementById('conteudoPainelGargalos');
            const secAvarias = document.getElementById('conteudoPainelAvarias');
            const secDatas = document.getElementById('conteudoPainelDatas');
            const secAuditoria = document.getElementById('conteudoPainelAuditoria');

            [btnGargalos, btnAvarias, btnDatas, btnAuditoria].forEach(b => {
                b.className = "px-3 py-1.5 text-xs font-bold rounded-lg bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 transition flex items-center space-x-1.5";
            });
            [secGargalos, secAvarias, secDatas, secAuditoria].forEach(s => s.classList.add('hidden'));

            if (tipo === 'gargalos') {
                btnGargalos.className = "px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-600 text-white transition flex items-center space-x-1.5";
                secGargalos.classList.remove('hidden');
            } else if (tipo === 'avarias') {
                btnAvarias.className = "px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-600 text-white transition flex items-center space-x-1.5";
                secAvarias.classList.remove('hidden');
            } else if (tipo === 'datas') {
                btnDatas.className = "px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-600 text-white transition flex items-center space-x-1.5";
                secDatas.classList.remove('hidden');
            } else {
                btnAuditoria.className = "px-3 py-1.5 text-xs font-bold rounded-lg bg-rose-600 text-white transition flex items-center space-x-1.5";
                secAuditoria.classList.remove('hidden');
            }
        }

                function renderizarPainelAlertas() {
            const containerGargalos = document.getElementById('conteudoPainelGargalos');
            const containerAvarias = document.getElementById('conteudoPainelAvarias');
            const containerDatas = document.getElementById('conteudoPainelDatas');
            const containerAuditoria = document.getElementById('conteudoPainelAuditoria');
            const badge = document.getElementById('badgeQtdAlertas');
            if(!containerGargalos || !containerAvarias || !containerDatas || !containerAuditoria) return;

            let gargalosLista = [];
            (dadosApp.pedidos || []).forEach(p => {
                const num = p.numeroPedido || p.nota;
                const garg = verificarGargaloSLA(num);
                if (garg.estagnado) {
                    gargalosLista.push({ num, cliente: p.cliente, horas: garg.horas, setor: garg.setor });
                }
            });

            let avariasLista = (dadosApp.tracking || []).filter(t => t.statusFinal && t.statusFinal !== 'ENTREGUE (OK)');
            const alertas = dadosApp.alertasAlteracao || [];
            const auditas = dadosApp.logsAuditoria || [];
            const totalNotifs = gargalosLista.length + avariasLista.length + alertas.length + auditas.length;

            if(badge) {
                badge.textContent = totalNotifs;
                if(totalNotifs > 0) badge.classList.remove('hidden');
                else badge.classList.add('hidden');
            }

            if (gargalosLista.length === 0) {
                containerGargalos.innerHTML = `<p class="text-slate-500 dark:text-slate-400 italic">Nenhum pedido estagnado acima do SLA de 24h.</p>`;
            } else {
                containerGargalos.innerHTML = gargalosLista.map(g => `
                    <div class="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-500/30 p-2.5 rounded-xl flex items-center justify-between">
                        <div>
                            <span class="font-bold text-rose-800 dark:text-rose-300">Pedido ${g.num} (${g.cliente})</span>
                            <div class="text-[11px] text-slate-600 dark:text-slate-300 mt-0.5">
                                Estagnado há <span class="font-bold text-rose-600 dark:text-rose-400">${g.horas} horas</span> no setor <span class="font-semibold text-blue-600 dark:text-blue-400">${g.setor}</span>.
                            </div>
                        </div>
                    </div>
                `).join('');
            }

            if (avariasLista.length === 0) {
                containerAvarias.innerHTML = `<p class="text-slate-500 dark:text-slate-400 italic">Nenhuma avaria ou recusa registrada.</p>`;
            } else {
                containerAvarias.innerHTML = avariasLista.map(av => `
                    <div class="bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-500/30 p-2.5 rounded-xl space-y-1">
                        <div class="flex justify-between items-center font-bold text-rose-800 dark:text-rose-300">
                            <span>Pedido ${av.numPedido} (NF: ${av.nota})</span>
                            <span class="px-2 py-0.5 bg-rose-600 text-white rounded text-[10px]">${av.statusFinal}</span>
                        </div>
                        <div class="text-[11px] text-slate-700 dark:text-slate-300">
                            <b>Motivo:</b> ${av.motivoAvaria || 'Não especificado'}
                        </div>
                    </div>
                `).join('');
            }

            if(alertas.length === 0) {
                containerDatas.innerHTML = `<p class="text-slate-500 dark:text-slate-400 italic">Nenhum alerta de data registrado.</p>`;
            } else {
                containerDatas.innerHTML = alertas.map(al => `
                    <div class="bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-500/30 p-2.5 rounded-xl flex items-center justify-between">
                        <div>
                            <span class="font-bold text-rose-800 dark:text-rose-300">Pedido ${al.numPedido}</span>
                            <span class="text-slate-700 dark:text-slate-300"> alterado pelo setor </span>
                            <span class="font-bold text-blue-600 dark:text-blue-400">${al.setorResponsavel}</span>.
                        </div>
                    </div>
                `).join('');
            }

            if(auditas.length === 0) {
                containerAuditoria.innerHTML = `<p class="text-slate-500 dark:text-slate-400 italic">Nenhuma edição administrativa registrada.</p>`;
            } else {
                containerAuditoria.innerHTML = auditas.map(lg => `
                    <div class="bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-500/30 p-2.5 rounded-xl space-y-1">
                        <div class="flex justify-between items-center font-bold text-blue-800 dark:text-blue-300">
                            <span>[${lg.colecao}] Item: ${lg.identificador}</span>
                            <span class="text-[10px] text-slate-400">${lg.dataHora}</span>
                        </div>
                        <ul class="list-disc list-inside text-[11px] text-slate-600 dark:text-slate-300 space-y-0.5">
                            ${lg.alteracoes.map(alt => `<li>${alt}</li>`).join('')}
                        </ul>
                    </div>
                `).join('');
            }
        }

                function limparAlertasLidos() {
            dadosApp.alertasAlteracao = [];
            dadosApp.logsAuditoria = [];
            salvarDados();
            renderizarPainelAlertas();
            atualizarKPIs();
            mostrarToast('Registros limpos.', 'sucesso');
        }

               function registrarAlertaAlteracaoData(numPedido, setorResponsavel, dataOriginal, dataNova) {
            if (!dadosApp.alertasAlteracao) dadosApp.alertasAlteracao = [];
            dadosApp.alertasAlteracao.unshift({
                id: Date.now(),
                numPedido: numPedido,
                setorResponsavel: setorResponsavel.toUpperCase(),
                dataOriginal: dataOriginal || 'Não informada',
                dataNova: dataNova,
                dataHoraRegistro: new Date().toLocaleString('pt-BR'),
                lido: false
            });
            if (dadosApp.alertasAlteracao.length > 50) {
                dadosApp.alertasAlteracao = dadosApp.alertasAlteracao.slice(0, 50);
            }
            salvarDados();
            renderizarPainelAlertas();
        }