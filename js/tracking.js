/*
=========================================
MÓDULO: TRACKING
=========================================

Responsável por:

- Confirmação de entrega
- Avarias
- Recusas
- Baixas

Funções:
- salvarTracking()

=========================================
*/

function salvarTracking(e) {
            e.preventDefault();
            if (setorAutenticado !== 'tracking' && setorAutenticado !== 'admin') {
                mostrarToast('Acesso negado.', 'erro');
                return;
            }
            const numPed = document.getElementById('trcNumPedido').value.trim().toUpperCase();
            const statusFinalVal = document.getElementById('trcStatus').value;
            const motivoAvariaVal = (statusFinalVal !== 'ENTREGUE (OK)') ? document.getElementById('trcMotivoAvaria').value : '-';

            if (statusFinalVal !== 'ENTREGUE (OK)' && !motivoAvariaVal) {
                mostrarToast('Selecione o motivo da avaria ou recusa.', 'erro');
                return;
            }

            dadosApp.tracking.push({
                id: Date.now(),
                numPedido: numPed,
                nota: obterNFDoPedido(numPed),
                ticket: obterTicketDoPedido(numPed),
                statusFinal: statusFinalVal,
                motivoAvaria: motivoAvariaVal,
                observacao: document.getElementById('trcObservacao').value.trim() || '-'
            });
            salvarDados();
            atualizarInterfaceGeral();
            mostrarToast('Entrega confirmada!', 'sucesso');
            document.getElementById('formTracking').reset();
            document.getElementById('containerMotivoAvaria').classList.add('hidden');
            document.getElementById('trcNotaSelect').value = '';
            document.getElementById('trcInputNumPedidoBusca').value = '';
        }