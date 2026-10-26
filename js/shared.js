/*
=========================

Funções compartilhadas entre setores.

=========================================
*/

function carregarSelectsGerais() {
            const selAg = document.getElementById('agNotaSelect');
            const selFat = document.getElementById('fatSelectPedido');
            const selCom = document.getElementById('comSelectPedido');
            const selOp = document.getElementById('opSelectPedido');
            const selTrc = document.getElementById('trcNotaSelect');

            if (selAg) selAg.innerHTML = '<option value="">-- Selecione um pedido na lista --</option>';
            if (selFat) selFat.innerHTML = '<option value="">-- Selecione um pedido na lista --</option>';
            if (selCom) selCom.innerHTML = '<option value="">-- Selecione um pedido na lista --</option>';
            if (selOp) selOp.innerHTML = '<option value="">-- Selecione um pedido na lista --</option>';
            if (selTrc) selTrc.innerHTML = '<option value="">-- Selecione um pedido na lista --</option>';

            dadosApp.pedidos.forEach(p => {
                const identificador = p.numeroPedido || p.nota;
                const etapa = calcularStatusEtapa(identificador);
                
                if (etapa.id < 6) {
                    const tipoTexto = (p.tipoCarga === 'dedicada') ? '[DEDICADA]' : '[WMS]';
                    const texto = `${tipoTexto} Pedido: ${identificador} | Cliente: ${p.cliente} (${etapa.nome})`;
                    if (selAg) { const opt = document.createElement('option'); opt.value = identificador; opt.textContent = texto; selAg.appendChild(opt); }
                    if (selFat) { const opt = document.createElement('option'); opt.value = identificador; opt.textContent = texto; selFat.appendChild(opt); }
                    if (selCom) { const opt = document.createElement('option'); opt.value = identificador; opt.textContent = texto; selCom.appendChild(opt); }
                    if (selOp) { const opt = document.createElement('option'); opt.value = identificador; opt.textContent = texto; selOp.appendChild(opt); }
                    if (selTrc) { const opt = document.createElement('option'); opt.value = identificador; opt.textContent = texto; selTrc.appendChild(opt); }
                }
            });
        }