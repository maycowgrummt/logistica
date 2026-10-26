        const firebaseConfig = {
            apiKey: "AIzaSyD-1Q--NP9_SBSSLtcXEgrTfNoJ3pE0ync",
            authDomain: "logisticadarnel.firebaseapp.com",
            databaseURL: "https://logisticadarnel-default-rtdb.firebaseio.com",
            projectId: "logisticadarnel",
            storageBucket: "logisticadarnel.appspot.com",
            messagingSenderId: "227856231222",
            appId: "1:227856231222:web:f65791030086e4290e2197"
        };

                function atualizarBadgeConexao(statusText, bgClass) {
            const statusBadge = document.getElementById('statusConexao');
            if (statusBadge) {
                statusBadge.className = `inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border shadow-sm ${bgClass}`;
                statusBadge.innerHTML = `<span class="w-2 h-2 mr-2 rounded-full animate-pulse bg-current"></span>${statusText}`;
            }
        }

                function salvarDados() {
            localStorage.setItem('dados_logistica_darnel', JSON.stringify(dadosApp));
            if (db) {
                const obj = { pedidos: {}, agendamentos: {}, operacao: {}, faturamento: {}, comercial: {}, tracking: {}, alertasAlteracao: {}, logsAuditoria: {} };
                dadosApp.pedidos.forEach(p => obj.pedidos[p.id] = p);
                dadosApp.agendamentos.forEach(a => obj.agendamentos[a.id] = a);
                dadosApp.operacao.forEach(o => obj.operacao[o.id] = o);
                dadosApp.faturamento.forEach(f => obj.faturamento[f.id] = f);
                dadosApp.comercial.forEach(c => obj.comercial[c.id] = c);
                dadosApp.tracking.forEach(t => obj.tracking[t.id] = t);
                (dadosApp.alertasAlteracao || []).forEach(al => obj.alertasAlteracao[al.id] = al);
                (dadosApp.logsAuditoria || []).forEach(lg => obj.logsAuditoria[lg.id] = lg);

                db.ref('logistica_darnel').set(obj).catch(err => console.warn(err));
            }
        }

                function inicializarFirebase() {
            try {
                if (typeof firebase !== 'undefined') {
                    firebase.initializeApp(firebaseConfig);
                    db = firebase.database();

                    db.ref('.info/connected').on('value', (snap) => {
                        if (snap.val() === true) {
                            firebaseConectado = true;
                            atualizarBadgeConexao('Conectado (Nuvem)', 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30');
                        } else {
                            firebaseConectado = false;
                            atualizarBadgeConexao('Modo Local (Offline)', 'bg-amber-500/20 text-amber-400 border-amber-500/30');
                        }
                    });

                    db.ref('logistica_darnel').on('value', (snapshot) => {
                        const data = snapshot.val();
                        if (data) {
                            dadosApp.pedidos = Object.values(data.pedidos || {});
                            dadosApp.agendamentos = Object.values(data.agendamentos || {});
                            dadosApp.operacao = Object.values(data.operacao || {});
                            dadosApp.faturamento = Object.values(data.faturamento || {});
                            dadosApp.comercial = Object.values(data.comercial || {});
                            dadosApp.tracking = Object.values(data.tracking || {});
                            dadosApp.alertasAlteracao = Object.values(data.alertasAlteracao || {});
                            dadosApp.logsAuditoria = Object.values(data.logsAuditoria || {});
                            localStorage.setItem('dados_logistica_darnel', JSON.stringify(dadosApp));
                        }
                        atualizarInterfaceGeral();
                    });
                } else {
                    atualizarBadgeConexao('Modo Local (Offline)', 'bg-amber-500/20 text-amber-400 border-amber-500/30');
                    atualizarInterfaceGeral();
                }
            } catch (e) {
                atualizarBadgeConexao('Modo Local (Offline)', 'bg-amber-500/20 text-amber-400 border-amber-500/30');
                atualizarInterfaceGeral();
            }
        }