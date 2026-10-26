/*
=========================================
MÓDULO: OPERAÇÃO LOGÍSTICA
=========================================

Responsável por:

- Registro de carregamento
- Controle operacional
- Equipes
- Horários

Funções:
- salvarOperacao()

=========================================
*/

function salvarOperacao(e) {
            e.preventDefault();
            if (setorAutenticado !== 'operacao' && setorAutenticado !== 'admin') {
                mostrarToast('Acesso negado.', 'erro');
                return;
            }
            const numPed = document.getElementById('opNumPedido').value.trim().toUpperCase() || '-';
            dadosApp.operacao.push({
                id: Date.now(),
                numCarga: document.getElementById('opNumCarga').value.trim().toUpperCase(),
                numPedido: numPed,
                nota: (document.getElementById('opNotaFiscal').value.trim() || obterNFDoPedido(numPed)).toUpperCase(),
                horaInicio: document.getElementById('opHoraInicio').value,
                horaFim: document.getElementById('opHoraFim').value,
                equipe: document.getElementById('opEquipe').value.trim(),
                observacao: document.getElementById('opObservacao').value.trim() || '-'
            });
            salvarDados();
            atualizarInterfaceGeral();
            mostrarToast('Carregamento registrado!', 'sucesso');
            document.getElementById('formOperacao').reset();
            document.getElementById('opSelectPedido').value = '';
        }