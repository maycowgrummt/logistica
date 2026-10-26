        function salvarFaturamento(e) {
            e.preventDefault();
            if (setorAutenticado !== 'faturamento' && setorAutenticado !== 'admin') {
                mostrarToast('Acesso negado.', 'erro');
                return;
            }
            const numPedido = document.getElementById('fatNumPedido').value.trim().toUpperCase();
            const numNF = document.getElementById('fatNotaFiscal').value.trim().toUpperCase();
            const totalKgVal = Number(document.getElementById('fatTotalKg').value) || 0;

            if (totalKgVal <= 0) {
                mostrarToast('O peso deve ser maior que zero.', 'erro');
                return;
            }

            const rawData = document.getElementById('fatDataFaturamento').value;
            let dataBR = formatarDataParaExibicao(rawData);

            const ped = dadosApp.pedidos.find(p => (p.numeroPedido?.trim().toUpperCase() === numPedido || p.nota?.trim().toUpperCase() === numPedido));
            if (ped) {
                ped.nota = numNF; 
                if (ped.dataSaida && ped.dataSaida !== dataBR) {
                    registrarAlertaAlteracaoData(numPedido, 'FATURAMENTO', ped.dataSaida, dataBR);
                    ped.dataSaida = dataBR;
                    ped.temAlertaData = true;
                }
            }

            dadosApp.faturamento.push({
                id: Date.now(),
                numPedido: numPedido,
                estrechado: document.getElementById('fatEstrechado').value,
                qtdPaletes: document.getElementById('fatQtdPaletes').value.trim().toUpperCase(),
                dataFaturamento: dataBR,
                notaFiscal: numNF,
                totalKg: totalKgVal,
                observacao: document.getElementById('fatObservacao').value.trim() || '-'
            });
            salvarDados();
            atualizarInterfaceGeral();
            mostrarToast('Faturamento registrado!', 'sucesso');
            document.getElementById('formFaturamento').reset();
        }