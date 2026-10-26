        function salvarComercial(e) {
            e.preventDefault();
            if (setorAutenticado !== 'comercial' && setorAutenticado !== 'admin') {
                mostrarToast('Acesso negado.', 'erro');
                return;
            }
            const numPedido = document.getElementById('comNumPedido').value.trim().toUpperCase();
            const dataConfirmadaBR = formatarDataParaExibicao(document.getElementById('comDataAgendaConfirmada').value);

            const ped = dadosApp.pedidos.find(p => (p.numeroPedido?.trim().toUpperCase() === numPedido || p.nota?.trim().toUpperCase() === numPedido));
            if (ped && ped.dataSaida && ped.dataSaida !== dataConfirmadaBR) {
                registrarAlertaAlteracaoData(numPedido, 'COMERCIAL', ped.dataSaida, dataConfirmadaBR);
                ped.dataSaida = dataConfirmadaBR;
                ped.temAlertaData = true;
            }

            dadosApp.comercial.push({
                id: Date.now(),
                numPedido: numPedido,
                nota: obterNFDoPedido(numPedido),
                dataSolicitacao: formatarDataParaExibicao(document.getElementById('comDataSolicitacao').value),
                dataAgendaSolicitada: formatarDataParaExibicao(document.getElementById('comDataAgendaSolicitada').value),
                dataAgendaConfirmada: dataConfirmadaBR,
                horario: document.getElementById('comHorario').value,
                ticket: document.getElementById('comTicket').value.trim().toUpperCase(),
                observacao: document.getElementById('comObservacao').value.trim() || '-'
            });
            salvarDados();
            atualizarInterfaceGeral();
            mostrarToast('Tratativa salva!', 'sucesso');
            document.getElementById('formComercial').reset();
        }