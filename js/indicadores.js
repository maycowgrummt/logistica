/*
=========================================
MÓDULO INDICADORES
=========================================

Indicadores logísticos do sistema.

=========================================
*/

function atualizarIndicadores() {

    const totalPedidos = dadosApp.pedidos.length;

    const totalEntregues = dadosApp.tracking.length;

    const totalPendentes =
        totalPedidos - totalEntregues;

    const pesoTotal = dadosApp.pedidos.reduce(
        (total, pedido) => total + Number(pedido.peso || 0),
        0
    );

    document.getElementById('indPedidosCriados').textContent =
        totalPedidos;

    document.getElementById('indEntregues').textContent =
        totalEntregues;

    document.getElementById('indPendentes').textContent =
        totalPendentes;

    document.getElementById('indPesoTotal').textContent =
        pesoTotal.toLocaleString('pt-BR') + ' Kg';
}