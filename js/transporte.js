/*
=========================================
MÓDULO: TRANSPORTE
=========================================

Responsável por:

- Agendamentos
- Transportadoras
- Placas
- Motoristas

Funções:
- salvarAgendamento()

=========================================
*/

function salvarAgendamento(e) {
            e.preventDefault();
            if (setorAutenticado !== 'transporte' && setorAutenticado !== 'admin') {
                mostrarToast('Acesso negado. Desbloqueie com a senha do Transporte.', 'erro');
                return;
            }

            const numPedido = document.getElementById('agNumPedido').value.trim().toUpperCase();
            const nf = document.getElementById('agNotaFiscal').value.trim().toUpperCase();
            const rawData = document.getElementById('agDataEntrega').value;
            const horaEntrega = document.getElementById('agHoraEntrega').value;
            const dataFormatadaBR = formatarDataParaExibicao(rawData);

            const ped = dadosApp.pedidos.find(p => (p.numeroPedido?.trim().toUpperCase() === numPedido || p.nota?.trim().toUpperCase() === numPedido));
            if (ped && ped.dataSaida && ped.dataSaida !== dataFormatadaBR) {
                registrarAlertaAlteracaoData(numPedido, 'TRANSPORTE', ped.dataSaida, dataFormatadaBR);
                ped.dataSaida = dataFormatadaBR;
                ped.temAlertaData = true;
            }

            dadosApp.agendamentos.push({
                id: Date.now(),
                numPedido: numPedido,
                nota: nf,
                ticket: document.getElementById('agTicket').value.trim().toUpperCase(),
                dataEntrega: dataFormatadaBR,
                horaEntrega: horaEntrega,
                transportadora: document.getElementById('agTransportadora').value,
                placa: document.getElementById('agPlaca').value.trim().toUpperCase(),
                motorista: document.getElementById('agMotorista').value.trim(),
                observacao: document.getElementById('agObservacao').value.trim() || '-'
            });
            salvarDados();
            atualizarInterfaceGeral();
            mostrarToast('Agendamento salvo!', 'sucesso');
            document.getElementById('formAgendamento').reset();
            document.getElementById('agNotaSelect').value = '';
            document.getElementById('agInputNumPedidoBusca').value = '';
        }