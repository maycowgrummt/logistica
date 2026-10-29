/*
=========================================
MÓDULO REGIÕES LOGÍSTICAS
=========================================

Responsável por:

- Base de dados de regiões logísticas
- Agrupar pedidos WMS
- Auxiliar na roteirização

=========================================
*/

const REGIOES_LOGISTICAS = {

    EXTERIOR: [
        "EX",
        "EXTERIOR"
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
        "ITAPERUCU",
        "BOCAIUVA DO SUL",
        "CONTENDA",
        "LAPA",
        "TIJUCAS DO SUL"
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
        "ORTIGUEIRA",
        "GUARAPUAVA",
        "CARAMBEI"
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
        "SARANDI",
        "IBIPORA",
        "JAGUAPITA",
        "SANTO INACIO",
        "MANDAGUACU",
        "PAICANDU",
        "PRUDENTOPOLIS",
        "CPA",
        "COLORADO",
        "PARAISO DO NORTE",
        "CIDADE GAUCHA",
        "JAPURA",
        "RONDON",
        "JOAQUIM TAVORA",
        "BANDEIRANTES"
    ],

    OESTE_PR: [
        "CASCAVEL",
        "TOLEDO",
        "FOZ DO IGUACU",
        "MEDIANEIRA",
        "PALOTINA",
        "MARECHAL CANDIDO RONDON",
        "ASSIS CHATEAUBRIAND",
        "TERRA ROXA",
        "MATELANDIA",
        "GUAIRA",
        "MISSAL",
        "CAFELANDIA",
        "UBIRATA",
        "CAARAPO",
        "SANTO ANTONIO DO SUDOESTE",
        "DOIS VIZINHOS",
        "PATO BRANCO",
        "CAPINZAL",
        "JOACABA"
    ],

    SC_NORTE: [
        "JOINVILLE",
        "JARAGUA DO SUL",
        "BLUMENAU",
        "BRUSQUE",
        "INDAIAL",
        "POMERODE",
        "SAO BENTO DO SUL",
        "RIO NEGRINHO",
        "CHAPECO",
        "CORUPA",
        "XANXERE",
        "CONCORDIA",
        "CURITIBANOS",
        "LAGES"
    ],

    SC_LITORAL: [
        "ITAJAI",
        "NAVEGANTES",
        "BALNEARIO CAMBORIU",
        "CAMBORIU",
        "ITAPEMA",
        "PORTO BELO",
        "FLORIANOPOLIS",
        "SAO JOSE",
        "PALHOCA",
        "BIGUACU",
        "PENHA",
        "BALNEARIO PICARRAS",
        "SAO FRANCISCO DO SUL",
        "ANITAPOLIS",
        "GOVERNADOR CELSO RAMOS",
        "NOVA VENEZA"
    ],

    SC_SUL: [
        "CRICIUMA",
        "TUBARAO",
        "ARARANGUA",
        "ICARA",
        "LAGUNA",
        "RIO DO SUL"
    ],

    SP_CAPITAL: [
        "SAO PAULO",
        "OSASCO",
        "BARUERI",
        "CARAPICUIBA",
        "TABOAO DA SERRA",
        "SANTO ANDRE",
        "SAO BERNARDO DO CAMPO",
        "DIADEMA",
        "MAUA",
        "GUARULHOS",
        "MOGI DAS CRUZES",
        "SUZANO",
        "SAO CAETANO DO SUL",
        "ARUJA",
        "MAIRIPORA",
        "ITAQUAQUECETUBA",
        "SANTANA DE PARNAIBA",
        "ITAPEVI",
        "EMBU",
        "ITAPECERICA DA SERRA",
        "BIRITIBA-MIRIM",
        "COTIA",
        "VARZEA PAULISTA",
        "JANDIRA",
        "MAIRINQUE"
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
        "HORTOLANDIA",
        "PRESIDENTE PRUDENTE",
        "MARILIA",
        "ARARAQUARA",
        "SAO CARLOS",
        "FRANCA",
        "RIO CLARO",
        "SANTOS",
        "SAO VICENTE",
        "PRAIA GRANDE",
        "GUARUJA",
        "IBIUNA",
        "CAPIVARI",
        "MIRANDOPOLIS",
        "SALTO DE PIRAPORA",
        "ITUPEVA",
        "ITUPEVA",
        "SERTAOZINHO",
        "ITAPETININGA",
        "ITAPUI",
        "BARIRI",
        "SAO JOAO DA BOA VISTA",
        "GUARATINGUETA",
        "PIRAJU",
        "MOGI GUACU",
        "CAPAO BONITO",
        "PIEDADE",
        "SAO ROQUE",
        "ANDRADINA",
        "AMPARO",
        "GUAPIACU",
        "JARINU",
        "INDAIATUBA",
        "BOITUVA",
        "MOGI MIRIM",
        "ITAPEVA",
        "VINHEDO",
        "INUBIA PAULISTA",
        "ITAI",
        "IPEUNA",
        "TUPA",
        "SANTA CRUZ DO RIO PARDO",
        "IACANGA",
        "REGINOPOLIS",
        "CANDIDO MOTA",
        "PENAPOLIS",
        "ARACATUBA",
        "AVARE",
        "JARDINOPOLIS",
        "BEBEDOURO",
        "MONTE ALTO",
        "JABOTICABAL",
        "ARARAS",
        "ELDORADO",
        "SANTA FE DO SUL",
        "ITAPEJARA D OESTE",
        "JOSE BONIFACIO",
        "ADAMANTINA",
        "DRACENA",
        "SAO JOSE DO RIO PRETO",
        "UMUARAMA",
        "PATO BRANCO",
        "BURITAMA",
        "PIRATINIGUINA",
        "PIRATININGA",
        "ARACOIABA DA SERRA",
        "BARRETOS"
    ],

    RS: [
        "PORTO ALEGRE",
        "CAXIAS DO SUL",
        "BENTO GONCALVES",
        "NOVO HAMBURGO",
        "SAO LEOPOLDO",
        "GRAVATAI",
        "CANOAS",
        "PELOTAS",
        "SANTA MARIA",
        "RIO GRANDE",
        "PASSO FUNDO",
        "SANTA CRUZ DO SUL",
        "URUGUAIANA",
        "VILA MARIA",
        "ARVOREZINHA",
        "FARROUPILHA",
        "BAGE",
        "MAQUINE",
        "TAQUARI",
        "QUARAI",
        "VERANOPOLIS",
        "FLORES DA CUNHA",
        "ERECHIM",
        "SAO JOSE DOS AUSENTES",
        "FELIZ",
        "LAJEADO",
        "GARIBALDI",
        "JULIO DE CASTILHOS",
        "GETULIO VARGAS",
        "SAO JERONIMO",
        "PRESIDENTE LUCENA",
        "ALVORADA",
        "CARAZINHO",
        "SAO LUIZ GONZAGA",
        "TAPEJARA",
        "VENANCIO AIRES",
        "VIAMAO",
        "ARROIO DO MEIO",
        "TRINDADE DO SUL",
        "TRES PASSOS",
        "MIRAGUAI",
        "VERA CRUZ",
        "HORIZONTINA",
        "SANTA ROSA",
        "IBIRUBA",
        "AUREA",
        "TRES FORQUILHAS",
        "SAO FRANCISCO DE ASSIS",
        "SANT ANA DO LIVRAMENTO"
    ],

    MG: [
        "BELO HORIZONTE",
        "CONTAGEM",
        "BETIM",
        "UBERLANDIA",
        "UBERABA",
        "JUIZ DE FORA",
        "MONTES CLAROS",
        "GOVERNADOR VALADARES",
        "IPATINGA",
        "DIVINOPOLIS",
        "POCOS DE CALDAS",
        "SETE LAGOAS",
        "SANTA LUZIA",
        "RIBEIRAO DAS NEVES",
        "CASTELO",
        "BORDA DA MATA",
        "CAMBUI",
        "BOM REPOUSO",
        "PASSOS",
        "ARCEBURGO"
    ],

    RJ: [
        "RIO DE JANEIRO",
        "SAO GONCALO",
        "DUQUE DE CAXIAS",
        "NOVA IGUACU",
        "NITEROI",
        "CABO FRIO",
        "CAMPOS DOS GOYTACAZES",
        "VOLTA REDONDA",
        "PETROPOLIS",
        "MACAEE",
        "ANGRA DOS REIS",
        "BARRA MANSA",
        "SANTO ANTONIO DE PADUA",
        "NOVA FRIBURGO"
    ],

    ES: [
        "VITORIA",
        "VILA VELHA",
        "SERRA",
        "CARIACICA",
        "GUARAPARI",
        "CACHOEIRO DE ITAPEMIRIM",
        "LINHARES",
        "COLATINA",
        "SAO MATEUS"
    ],

    GO: [
        "GOIANIA",
        "APARECIDA DE GOIANIA",
        "ANAPOLIS",
        "RIO VERDE",
        "LUZIANIA",
        "AGUAS LINDAS DE GOIAS",
        "VALPARAISO DE GOIAS",
        "TRINDADE",
        "FORMOSA",
        "ITUMBIARA",
        "PALMEIRAS DE GOIAS",
        "CATALAO",
        "IPORA",
        "GOIATUBA",
        "MORRINHOS",
        "CRISTALINA",
        "QUIRINOPOLIS",
        "PIRACANJUBA",
        "JARAGUA",
        "PIRES DO RIO"
    ],

    MT: [
        "CUIABA",
        "VARZEA GRANDE",
        "RONDONOPOLIS",
        "SINOP",
        "TANGARA DA SERRA",
        "CACERES",
        "SORRISO",
        "LUCAS DO RIO VERDE",
        "BARRA DO GARCAS",
        "CONFRESA",
        "JUARA"
    ],

    MS: [
        "CAMPO GRANDE",
        "DOURADOS",
        "TRES LAGOAS",
        "CORUMBA",
        "PONTAPORA",
        "NAVIRAI",
        "NOVA ANDRADINA",
        "SIDROLANDIA"
    ],

    BA: [
        "SALVADOR",
        "FEIRA DE SANTANA",
        "VITORIA DA CONQUISTA",
        "CAMACARI",
        "ITABUNA",
        "JUAZEIRO",
        "LAURO DE FREITAS",
        "ILHEUS",
        "JEQUIE",
        "ALAGOINHAS",
        "BARREIRAS",
        "PORTO SEGURO"
    ],

    PE: [
        "RECIFE",
        "JABOATAO DOS GUARARAPES",
        "OLINDA",
        "CARUARU",
        "PETROLINA",
        "PAULISTA",
        "CABO DE SANTO AGOSTINHO",
        "CAMARAGIBE",
        "GARANHUNS",
        "VITORIA DE SANTO ANTAO",
        "SAO BENTO DO UNA"
    ],

    CE: [
        "FORTALEZA",
        "CAUCAIA",
        "JUAZEIRO DO NORTE",
        "MARACANAU",
        "SOBRAL",
        "CRATO",
        "ITAPIPOCA",
        "MARANGUAPE",
        "BARBALHA",
        "ARACOIABA",
        "TIANGUA"
    ],

    PA: [
        "BELEM",
        "ANANINDEUA",
        "SANTAREM",
        "MARABA",
        "PARAUAPEBAS",
        "CASTANHAL",
        "ABAETETUBA",
        "CAMETA",
        "MARITUBA",
        "ARAGUAINA"
    ],

    AM: [
        "MANAUS",
        "PARINTINS",
        "ITACOATIARA",
        "MANACAPURU",
        "COARI",
        "TEFEE"
    ],

    RO: [
        "PORTO VELHO",
        "JI-PARANA",
        "ARIQUEMES",
        "VILHENA",
        "CACOAL",
        "JARU",
        "CEREJEIRAS"
    ],

    AC: [
        "RIO BRANCO",
        "CRUZEIRO DO SUL",
        "SENA MADUREIRA",
        "TARAUACA"
    ],

    AL: [
        "MACEIO",
        "ARAPIRACA",
        "RIO LARGO",
        "PALMEIRA DOS INDIOS",
        "PENEDO",
        "UNIAO DOS PALMARES"
    ],

    PB: [
        "JOAO PESSOA",
        "CAMPINA GRANDE",
        "SANTA RITA",
        "PATOS",
        "BAYEUX",
        "SOUSA",
        "CAJAZEIRAS"
    ],

    RN: [
        "NATAL",
        "MOSSORO",
        "PARNAMIRIM",
        "SAO GONCALO DO AMARANTE",
        "MACAIBA",
        "CEARA-MIRIM",
        "CAICO"
    ],

    PI: [
        "TERESINA",
        "PARNAIBA",
        "PICOS",
        "FLORIANO",
        "CAMPO MAYOR",
        "BRASILEIRA"
    ],

    MA: [
        "SAO LUIS",
        "IMPERATRIZ",
        "SAO JOSE DE RIBAMAR",
        "PACO DO LUMIAR",
        "TIMON",
        "CAXIAS",
        "BACABAL",
        "BACABEIRA"
    ],

    DF: [
        "BRASILIA",
        "CEILANDIA",
        "TAGUATINGA",
        "PLANALTINA",
        "SAMAMBAIA",
        "GAMA",
        "GUARÁ",
        "SOBRADINHO",
        "CRISTALINA"
    ],

    SE: [
        "ARACAJU"
    ]
};

console.log("REGIOES CARREGADAS");