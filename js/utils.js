/*
=========================================
UTILS - FUNÇÕES COMPARTILHADAS
=========================================

Funções reutilizadas por todo sistema.

=========================================
*/

function formatarDataParaExibicao(valData) {
            if (!valData) return '-';
            if (valData.includes('-')) {
                const p = valData.split('-');
                if (p.length === 3) return `${p[2]}/${p[1]}/${p[0]}`;
            }
            return valData;
        }

function mostrarToast(mensagem, tipo = 'sucesso') {
            const container = document.getElementById('toastContainer');
            const toast = document.createElement('div');
            let bgClass = 'bg-emerald-600 text-white';
            let icone = 'check-circle';
            if (tipo === 'erro') { bgClass = 'bg-red-600 text-white'; icone = 'alert-circle'; }
            else if (tipo === 'aviso') { bgClass = 'bg-amber-600 text-white'; icone = 'alert-triangle'; }
            else if (tipo === 'alerta_data') { bgClass = 'bg-rose-700 text-white border border-rose-500 shadow-2xl'; icone = 'bell-ring'; }

            toast.className = `pointer-events-auto flex items-center space-x-2 px-4 py-3 rounded-xl shadow-xl text-sm font-medium transition transform translate-y-2 opacity-0 ${bgClass}`;
            toast.innerHTML = `<i data-lucide="${icone}" class="w-5 h-5 flex-shrink-0"></i><span>${mensagem}</span>`;
            container.appendChild(toast);
            lucide.createIcons();

            setTimeout(() => { toast.classList.remove('translate-y-2', 'opacity-0'); }, 10);
            setTimeout(() => {
                toast.classList.add('translate-y-2', 'opacity-0');
                setTimeout(() => toast.remove(), 300);
            }, 5000);
        }

function obterDataAtualBrasil() {
            const options = { timeZone: 'America/Sao_Paulo', year: 'numeric', month: '2-digit', day: '2-digit' };
            return new Intl.DateTimeFormat('pt-BR', options).format(new Date());
        }

function obterNFDoPedido(identificador) {
            if (!identificador || identificador === '-') return 'Pendente';
            const idNorm = String(identificador).trim().toLowerCase();
            const fat = (dadosApp.faturamento || []).find(f => String(f.numPedido || '').trim().toLowerCase() === idNorm || String(f.notaFiscal || '').trim().toLowerCase() === idNorm);
            if (fat && fat.notaFiscal && fat.notaFiscal !== '-') return fat.notaFiscal;
            
            const ped = (dadosApp.pedidos || []).find(p => String(p.numeroPedido || '').trim().toLowerCase() === idNorm || String(p.nota || '').trim().toLowerCase() === idNorm);
            if (ped && ped.nota && ped.nota !== '-') return ped.nota;
            
            return 'Pendente';
        }

                function obterTicketDoPedido(identificador) {
            if (!identificador) return '';
            const idNorm = String(identificador).trim().toLowerCase();
            const com = (dadosApp.comercial || []).find(c => String(c.numPedido || '').trim().toLowerCase() === idNorm);
            if (com && com.ticket && com.ticket !== '-') return com.ticket;
            
            const ag = (dadosApp.agendamentos || []).find(a => String(a.numPedido || '').trim().toLowerCase() === idNorm);
            if (ag && ag.ticket && ag.ticket !== '-') return ag.ticket;
            
            return 'Pendente';
        }