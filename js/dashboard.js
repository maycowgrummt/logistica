function atualizarKPIs() {

    let pendencias = {
        1: 0,
        2: 0,
        3: 0,
        4: 0,
        5: 0,
        6: 0
    };

    let totalGargalos = 0;

    dadosApp.pedidos
        .filter(p => p.tipoCarga !== 'itinerante')
        .forEach(p => {

            const num = p.numeroPedido || p.nota;

            const e = calcularStatusEtapa(num);

            if (e && e.id) {
                pendencias[e.id]++;
            }

            const garg = verificarGargaloSLA(num);

            if (garg && garg.estagnado) {
                totalGargalos++;
            }

        });

    document.getElementById('kpiEtapa1').textContent = pendencias[1];
    document.getElementById('kpiEtapa2').textContent = pendencias[2];
    document.getElementById('kpiEtapa3').textContent = pendencias[3];
    document.getElementById('kpiEtapa4').textContent = pendencias[4];
    document.getElementById('kpiEtapa5').textContent = pendencias[5];
    document.getElementById('kpiEtapa6').textContent = pendencias[6];
    document.getElementById('kpiGargalos').textContent = totalGargalos;

}