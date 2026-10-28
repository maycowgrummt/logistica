/*
=========================================
MÓDULO REGIÕES LOGÍSTICAS
=========================================

Responsável por:

- Identificar região logística
- Agrupar pedidos WMS
- Auxiliar na roteirização

=========================================
*/

const REGIOES_LOGISTICAS = {

    EXTERIOR: [
        "EX"
    ],

    RMC: [
        "CURITIBA",
        "ARAUCARIA",
        "PINHAIS",
        "COLOMBO",
        "CAMPO LARGO",
        "CAMPO MAGRO",
        "FAZENDA RIO GRANDE",
        "SAO JOSE DOS PINHAIS",
        "QUATRO BARRAS",
        "ALMIRANTE TAMANDARE",
        "RIO BRANCO DO SUL",
        "PIRAQUARA",
        "MANDIRITUBA",
        "ITAPERUCU"
    ],

    LITORAL_PR: [
        "PARANAGUA",
        "GUARATUBA",
        "MATINHOS",
        "PONTAL DO PARANA",
        "MORRETES",
        "ANTONINA"
    ],

    CAMPOS_GERAIS: [
        "PONTA GROSSA",
        "CASTRO",
        "PALMEIRA",
        "IRATI",
        "TELEMACO BORBA",
        "JAGUARIAIVA",
        "ORTIGUEIRA"
    ],

    NORTE_PR: [
        "LONDRINA",
        "MARINGA",
        "CAMBE",
        "ARAPONGAS",
        "ROLANDIA",
        "APUCARANA",
        "PARANAVAI",
        "CIANORTE",
        "SARANDI"
    ],

    OESTE_PR: [
        "CASCAVEL",
        "TOLEDO",
        "FOZ DO IGUACU",
        "MEDIANEIRA",
        "PALOTINA",
        "MARECHAL CANDIDO RONDON",
        "ASSIS CHATEAUBRIAND"
    ],

    SC_NORTE: [
        "JOINVILLE",
        "JARAGUA DO SUL",
        "BLUMENAU",
        "BRUSQUE",
        "INDAIAL",
        "POMERODE",
        "SAO BENTO DO SUL",
        "RIO NEGRINHO"
    ],

    SC_LITORAL: [
        "ITAJAI",
        "NAVEGANTES",
        "BALNEARIO CAMBORIU",
        "CAMBORIU",
        "ITAPEMA",
        "PORTO BELO"
    ],

    SC_SUL: [
        "CRICIUMA",
        "TUBARAO",
        "ARARANGUA",
        "ICARA",
        "LAGUNA"
    ],

    SP_CAPITAL: [
        "SAO PAULO",
        "OSASCO",
        "BARUERI",
        "CARAPICUIBA",
        "TABOAO DA SERRA",
        "SANTO ANDRE",
        "SAO BERNARDO DO CAMPO",
        "DIADEMA"
    ],

    SP_INTERIOR: [
        "CAMPINAS",
        "JUNDIAI",
        "LIMEIRA",
        "PIRACICABA",
        "SOROCABA",
        "RIBEIRAO PRETO",
        "BAURU",
        "SAO JOSE DOS CAMPOS",
        "AMERICANA",
        "SUMARE",
        "HORTOLANDIA"
    ],

    RS: [
        "CAXIAS DO SUL",
        "BENTO GONCALVES",
        "PORTO ALEGRE",
        "NOVO HAMBURGO",
        "SAO LEOPOLDO",
        "GRAVATAI"
    ]
};

function identificarRegiao(cidade) {

    if (!cidade)
        return "SEM REGIAO";

    const cidadeNormalizada = cidade
        .toString()
        .trim()
        .toUpperCase();

    for (const regiao in REGIOES_LOGISTICAS) {

        if (
            REGIOES_LOGISTICAS[regiao]
                .includes(cidadeNormalizada)
        ) {
            return regiao;
        }

    }

    return "NAO MAPEADA";
}

console.log("REGIOES CARREGADAS");