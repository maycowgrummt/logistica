
/*
=========================================
MÓDULO COORDENADAS
=========================================

Coordenadas geográficas das cidades
utilizadas pela roteirização.

=========================================
*/

const COORDENADAS_CIDADES = {

    // =====================================
    // PARANÁ - REGIÃO METROPOLITANA
    // =====================================

    "CURITIBA": {lat:-25.4284,lng:-49.2733},
    "ARAUCARIA": {lat:-25.5854,lng:-49.4044},
    "PINHAIS": {lat:-25.4442,lng:-49.1927},
    "COLOMBO": {lat:-25.2925,lng:-49.2242},
    "CAMPO LARGO": {lat:-25.4597,lng:-49.5285},
    "SAO JOSE DOS PINHAIS": {lat:-25.5313,lng:-49.2031},
    "FAZENDA RIO GRANDE": {lat:-25.6623,lng:-49.3078},
    "PIRAQUARA": {lat:-25.4428,lng:-49.0635},
    "QUATRO BARRAS": {lat:-25.3656,lng:-49.0757},
    "ALMIRANTE TAMANDARE": {lat:-25.3108,lng:-49.3131},
    "BOCAIUVA DO SUL": {lat:-25.2060,lng:-49.1140},
    "TIJUCAS DO SUL": {lat:-25.9313,lng:-49.1760},
    "CAMPINA GRANDE DO SUL": {lat:-25.3056,lng:-49.0553},
    "MANDIRITUBA": {lat:-25.7770,lng:-49.3280},
    "CONTENDA": {lat:-25.6788,lng:-49.5350},
    "RIO BRANCO DO SUL": {lat:-25.1908,lng:-49.3140},
    "ITAPERUCU": {lat:-25.2200,lng:-49.3470},
    "LAPA": {lat:-25.7697,lng:-49.7158},

    // =====================================
    // PARANÁ - LITORAL
    // =====================================

    "PARANAGUA": {lat:-25.5163,lng:-48.5225},
    "GUARATUBA": {lat:-25.8752,lng:-48.5757},
    "MATINHOS": {lat:-25.8177,lng:-48.5424},
    "PONTAL DO PARANA": {lat:-25.6731,lng:-48.5118},
    "MORRETES": {lat:-25.4765,lng:-48.8342},
    "ANTONINA": {lat:-25.4333,lng:-48.7119},

    // =====================================
    // PARANÁ - NORTE E NOROESTE
    // =====================================

    "LONDRINA": {lat:-23.3103,lng:-51.1628},
    "MARINGA": {lat:-23.4205,lng:-51.9331},
    "CAMBE": {lat:-23.2768,lng:-51.2791},
    "ARAPONGAS": {lat:-23.4180,lng:-51.4210},
    "ROLANDIA": {lat:-23.3096,lng:-51.3693},
    "APUCARANA": {lat:-23.5504,lng:-51.4614},
    "PARANAVAI": {lat:-23.0816,lng:-52.4617},
    "CIANORTE": {lat:-23.6635,lng:-52.6054},
    "SARANDI": {lat:-23.4437,lng:-51.8738},
    "IBIPORA": {lat:-23.2690,lng:-51.0481},
    "UMUARAMA": {lat:-23.7661,lng:-53.3206},
    "CAMPO MOURAO": {lat:-24.0463,lng:-52.3780},
    "PATO BRANCO": {lat:-26.2292,lng:-52.6706},
    "FRANCISCO BELTRAO": {lat:-26.0811,lng:-53.0535},
    "DOIS VIZINHOS": {lat:-25.7460,lng:-53.0570},
    "GUAIRACA": {lat:-22.9340,lng:-52.6910},
    "LOANDA": {lat:-22.9230,lng:-53.1370},
    "ASTORGA": {lat:-23.2320,lng:-51.6650},
    "MANDAGUARI": {lat:-23.5470,lng:-51.6700},
    "PALMAS": {lat:-26.4840,lng:-51.9900},

    // =====================================
    // PARANÁ - OESTE
    // =====================================

    "CASCAVEL": {lat:-24.9555,lng:-53.4552},
    "TOLEDO": {lat:-24.7246,lng:-53.7417},
    "FOZ DO IGUACU": {lat:-25.5478,lng:-54.5882},
    "MEDIANEIRA": {lat:-25.2975,lng:-54.0931},
    "PALOTINA": {lat:-24.2865,lng:-53.8404},
    "MARECHAL CANDIDO RONDON": {lat:-24.5575,lng:-54.0554},
    "ASSIS CHATEAUBRIAND": {lat:-24.4167,lng:-53.5219},
    "TERRA ROXA": {lat:-24.1576,lng:-54.0985},
    "MATELANDIA": {lat:-25.2423,lng:-53.9960},
    "GUAIRA": {lat:-24.0800,lng:-54.2567},
    "SANTA TEREZA DO OESTE": {lat:-25.0540,lng:-53.6280},
    "CORBELIA": {lat:-24.7980,lng:-53.3060},

    // =====================================
    // SANTA CATARINA
    // =====================================

    "JOINVILLE": {lat:-26.3044,lng:-48.8487},
    "JARAGUA DO SUL": {lat:-26.4851,lng:-49.0665},
    "BLUMENAU": {lat:-26.9194,lng:-49.0661},
    "BRUSQUE": {lat:-27.0973,lng:-48.9202},
    "CHAPECO": {lat:-27.1004,lng:-52.6152},
    "CONCORDIA": {lat:-27.2333,lng:-52.0261},
    "LAGES": {lat:-27.8150,lng:-50.3259},
    "ITAJAI": {lat:-26.9101,lng:-48.6705},
    "NAVEGANTES": {lat:-26.8986,lng:-48.6540},
    "BALNEARIO CAMBORIU": {lat:-26.9920,lng:-48.6350},
    "ITAPEMA": {lat:-27.0863,lng:-48.6114},
    "FLORIANOPOLIS": {lat:-27.5949,lng:-48.5482},
    "PALHOCA": {lat:-27.6453,lng:-48.6678},
    "SAO JOSE": {lat:-27.6136,lng:-48.6380},
    "BIGUACU": {lat:-27.4960,lng:-48.6556},
    "CRICIUMA": {lat:-28.6775,lng:-49.3697},
    "TUBARAO": {lat:-28.4667,lng:-49.0069},
    "ARARANGUA": {lat:-28.9358,lng:-49.4954},
    "SAO BENTO DO SUL": {lat:-26.2500,lng:-49.3780},
    "MAFRA": {lat:-26.1114,lng:-49.8054},
    "RIO DO SUL": {lat:-27.2140,lng:-49.6430},
    "INDAIAL": {lat:-26.8978,lng:-49.2310},
    "TIMBO": {lat:-26.8246,lng:-49.2690},
    "CACADOR": {lat:-26.7757,lng:-51.0150},
    "VIDEIRA": {lat:-27.0086,lng:-51.1517},
    "XANXERE": {lat:-26.8769,lng:-52.4030},
    "SAO MIGUEL DO OESTE": {lat:-26.7250,lng:-53.5170},
    "IMBITUBA": {lat:-28.2400,lng:-48.6700},
    "LAGUNA": {lat:-28.4840,lng:-48.7800},
    "PORTO UNIAO": {lat:-26.2380,lng:-51.0780},

    // =====================================
    // RIO GRANDE DO SUL
    // =====================================

    "PORTO ALEGRE": {lat:-30.0346,lng:-51.2177},
    "CAXIAS DO SUL": {lat:-29.1678,lng:-51.1794},
    "NOVO HAMBURGO": {lat:-29.6783,lng:-51.1305},
    "CANOAS": {lat:-29.9172,lng:-51.1833},
    "PELOTAS": {lat:-31.7654,lng:-52.3376},
    "SANTA MARIA": {lat:-29.6868,lng:-53.8149},
    "PASSO FUNDO": {lat:-28.2628,lng:-52.4068},
    "BENTO GONCALVES": {lat:-29.1714,lng:-51.5190},
    "ERECHIM": {lat:-27.6346,lng:-52.2754},
    "RIO GRANDE": {lat:-32.0350,lng:-52.0986},
    "URUGUAIANA": {lat:-29.7614,lng:-57.0853},
    "SANTA CRUZ DO SUL": {lat:-29.7175,lng:-52.4258},
    "LAJEADO": {lat:-29.4590,lng:-51.9640},
    "GRAVATAI": {lat:-29.9420,lng:-50.9910},
    "VIAMAO": {lat:-30.0810,lng:-51.0230},
    "SAPUCAIA DO SUL": {lat:-29.8290,lng:-51.1450},
    "GUAIBA": {lat:-30.1130,lng:-51.3250},
    "BAGE": {lat:-31.3314,lng:-54.1069},

    // =====================================
    // SÃO PAULO - CAPITAL E GRANDE SP
    // =====================================

    "SAO PAULO": {lat:-23.5505,lng:-46.6333},
    "OSASCO": {lat:-23.5329,lng:-46.7916},
    "BARUERI": {lat:-23.5057,lng:-46.8790},
    "GUARULHOS": {lat:-23.4543,lng:-46.5333},
    "MOGI DAS CRUZES": {lat:-23.5208,lng:-46.1854},
    "SUZANO": {lat:-23.5425,lng:-46.3116},
    "ARUJA": {lat:-23.3965,lng:-46.3206},
    "MAIRIPORA": {lat:-23.3180,lng:-46.5868},
    "SANTO ANDRE": {lat:-23.6639,lng:-46.5383},
    "SAO BERNARDO DO CAMPO": {lat:-23.6914,lng:-46.5646},
    "SAO CAETANO DO SUL": {lat:-23.6230,lng:-46.5510},
    "DIADEMA": {lat:-23.6860,lng:-46.6230},
    "MAUA": {lat:-23.6670,lng:-46.4610},
    "RIBEIRAO PIRES": {lat:-23.7100,lng:-46.4130},
    "ITAPEVI": {lat:-23.5480,lng:-46.9340},
    "COTIA": {lat:-23.6030,lng:-46.9190},
    "CARAPICUIBA": {lat:-23.5230,lng:-46.8350},
    "TABOAO DA SERRA": {lat:-23.6010,lng:-46.7520},
    "EMBU DAS ARTES": {lat:-23.6480,lng:-46.8520},
    "ITAQUAQUECETUBA": {lat:-23.4860,lng:-46.3480},
    "POA": {lat:-23.5280,lng:-46.3450},
    "FERRAZ DE VASCONCELOS": {lat:-23.5410,lng:-46.3680},

    // =====================================
    // SÃO PAULO - INTERIOR E LITORAL
    // =====================================

    "CAMPINAS": {lat:-22.9099,lng:-47.0626},
    "JUNDIAI": {lat:-23.1857,lng:-46.8978},
    "LIMEIRA": {lat:-22.5654,lng:-47.4018},
    "PIRACICABA": {lat:-22.7338,lng:-47.6476},
    "SOROCABA": {lat:-23.5015,lng:-47.4526},
    "RIBEIRAO PRETO": {lat:-21.1775,lng:-47.8103},
    "BAURU": {lat:-22.3145,lng:-49.0587},
    "SAO JOSE DOS CAMPOS": {lat:-23.2237,lng:-45.9009},
    "BARRETOS": {lat:-20.5570,lng:-48.5674},
    "ARACATUBA": {lat:-21.2081,lng:-50.4322},
    "DRACENA": {lat:-21.4848,lng:-51.5356},
    "SAO CARLOS": {lat:-22.0174,lng:-47.8860},
    "ARARAQUARA": {lat:-21.7845,lng:-48.1780},
    "FRANCA": {lat:-20.5380,lng:-47.4000},
    "PRESIDENTE PRUDENTE": {lat:-22.1207,lng:-51.3925},
    "MARILIA": {lat:-22.2171,lng:-49.9501},
    "OURINHOS": {lat:-22.9797,lng:-49.8700},
    "BOTUCATU": {lat:-22.8837,lng:-48.4437},
    "ITAPETININGA": {lat:-23.5886,lng:-48.0483},
    "TAUBATE": {lat:-23.0264,lng:-45.5553},
    "JACAREI": {lat:-23.3053,lng:-45.9658},
    "PINDAMONHANGABA": {lat:-22.9239,lng:-45.4617},
    "ATIBAIA": {lat:-23.1171,lng:-46.5563},
    "BRAGANCA PAULISTA": {lat:-22.9527,lng:-46.5419},
    "INDAIATUBA": {lat:-23.0816,lng:-47.2101},
    "SUMARE": {lat:-22.8219,lng:-47.2669},
    "HORTOLANDIA": {lat:-22.8583,lng:-47.2142},
    "AMERICANA": {lat:-22.7374,lng:-47.3331},
    "VALINHOS": {lat:-22.9706,lng:-46.9958},
    "VINHEDO": {lat:-23.0302,lng:-46.9833},
    "ITU": {lat:-23.2642,lng:-47.2992},
    "SALTO": {lat:-23.2008,lng:-47.2868},
    "VOTORANTIM": {lat:-23.5448,lng:-47.4388},
    "ITANHAEM": {lat:-24.1835,lng:-46.7889},
    "SANTOS": {lat:-23.9608,lng:-46.3336},
    "SAO VICENTE": {lat:-23.9600,lng:-46.3960},
    "PRAIA GRANDE": {lat:-24.0058,lng:-46.4028},
    "GUARUJA": {lat:-23.9931,lng:-46.2564},
    "CUBATAO": {lat:-23.8911,lng:-46.4240},
    "CARAGUATATUBA": {lat:-23.6203,lng:-45.4132},
    "UBATUBA": {lat:-23.4330,lng:-45.0834},
    "ILHABELA": {lat:-23.7781,lng:-45.3581},
    "SAO SEBASTIAO": {lat:-23.7951,lng:-45.4143},
    "SAO JOAO DA BOA VISTA": {lat:-21.9690,lng:-46.7980},
    "MOGI GUACU": {lat:-22.3675,lng:-46.9420},
    "MOCOCA": {lat:-21.4678,lng:-47.0045},
    "CATANDUVA": {lat:-21.1378,lng:-48.9728},
    "SAO JOSE DO RIO PRETO": {lat:-20.8113,lng:-49.3758},
    "VOTUPORANGA": {lat:-20.4237,lng:-49.9781},
    "FERNANDOPOLIS": {lat:-20.2839,lng:-50.2464},
    "JALES": {lat:-20.2686,lng:-50.5455},
    "ANDRADINA": {lat:-20.8961,lng:-51.3795},
    "PENAPOLIS": {lat:-21.4197,lng:-50.0775},
    "TUPA": {lat:-21.9347,lng:-50.5136},

    // =====================================
    // MINAS GERAIS
    // =====================================

    "BELO HORIZONTE": {lat:-19.9167,lng:-43.9345},
    "CONTAGEM": {lat:-19.9321,lng:-44.0539},
    "BETIM": {lat:-19.9681,lng:-44.1983},
    "UBERLANDIA": {lat:-18.9186,lng:-48.2772},
    "UBERABA": {lat:-19.7470,lng:-47.9382},
    "JUIZ DE FORA": {lat:-21.7595,lng:-43.3398},
    "MONTES CLAROS": {lat:-16.7282,lng:-43.8578},
    "GOVERNADOR VALADARES": {lat:-18.8549,lng:-41.9559},
    "IPATINGA": {lat:-19.4680,lng:-42.5360},
    "POCOS DE CALDAS": {lat:-21.7878,lng:-46.5619},
    "VARGINHA": {lat:-21.5556,lng:-45.4364},
    "POUSO ALEGRE": {lat:-22.2290,lng:-45.9360},
    "DIVINOPOLIS": {lat:-20.1436,lng:-44.8906},
    "SETE LAGOAS": {lat:-19.4560,lng:-44.2410},
    "OURO PRETO": {lat:-20.3856,lng:-43.5035},
    "LAVRAS": {lat:-21.2450,lng:-44.9990},
    "PASSOS": {lat:-20.7190,lng:-46.6090},
    "PATOS DE MINAS": {lat:-18.5789,lng:-46.5180},
    "ARAXA": {lat:-19.5933,lng:-46.9400},
    "ITUIUTABA": {lat:-18.9740,lng:-49.4630},
    "PARACATU": {lat:-17.2220,lng:-46.8740},
    "TEOFILO OTONI": {lat:-17.8590,lng:-41.5090},
    "BARBACENA": {lat:-21.2250,lng:-43.7730},
    "CONSELHEIRO LAFAIETE": {lat:-20.6600,lng:-43.7860},
    "NOVA LIMA": {lat:-19.9850,lng:-43.8460},
    "RIBEIRAO DAS NEVES": {lat:-19.7660,lng:-44.0860},
    "SABARA": {lat:-19.8860,lng:-43.8060},
    "VESPASIANO": {lat:-19.6920,lng:-43.9230},
    "ITABIRA": {lat:-19.6230,lng:-43.2310},
    "CARATINGA": {lat:-19.7890,lng:-42.1390},
    "MANHUACU": {lat:-20.2580,lng:-42.0340},
    "MURIAE": {lat:-21.1300,lng:-42.3660},
    "UNAI": {lat:-16.3590,lng:-46.9060},

    // =====================================
    // RIO DE JANEIRO
    // =====================================

    "RIO DE JANEIRO": {lat:-22.9068,lng:-43.1729},
    "NITEROI": {lat:-22.8832,lng:-43.1034},
    "DUQUE DE CAXIAS": {lat:-22.7858,lng:-43.3049},
    "NOVA IGUACU": {lat:-22.7592,lng:-43.4510},
    "SAO GONCALO": {lat:-22.8268,lng:-43.0634},
    "NILOPOLIS": {lat:-22.8075,lng:-43.4137},
    "BELFORD ROXO": {lat:-22.7640,lng:-43.3990},
    "MESQUITA": {lat:-22.7820,lng:-43.4290},
    "PETROPOLIS": {lat:-22.5112,lng:-43.1779},
    "TERESOPOLIS": {lat:-22.4165,lng:-42.9752},
    "NOVA FRIBURGO": {lat:-22.2810,lng:-42.5311},
    "CAMPOS DOS GOYTACAZES": {lat:-21.7622,lng:-41.3181},
    "MACAE": {lat:-22.3768,lng:-41.7869},
    "CABO FRIO": {lat:-22.8894,lng:-42.0286},
    "ARARUAMA": {lat:-22.8728,lng:-42.3430},
    "RIO DAS OSTRAS": {lat:-22.5269,lng:-41.9450},
    "ANGRA DOS REIS": {lat:-23.0067,lng:-44.3181},
    "VOLTA REDONDA": {lat:-22.5202,lng:-44.0996},
    "BARRA MANSA": {lat:-22.5481,lng:-44.1752},
    "RESENDE": {lat:-22.4689,lng:-44.4469},
    "ITAPERUNA": {lat:-21.2050,lng:-41.8870},
    "ITABORAI": {lat:-22.7440,lng:-42.8590},

    // =====================================
    // ESPÍRITO SANTO
    // =====================================

    "VITORIA": {lat:-20.3155,lng:-40.3128},
    "VILA VELHA": {lat:-20.3297,lng:-40.2925},
    "SERRA": {lat:-20.1289,lng:-40.3070},
    "CARIACICA": {lat:-20.2632,lng:-40.4165},
    "CACHOEIRO DE ITAPEMIRIM": {lat:-20.8489,lng:-41.1128},
    "LINHARES": {lat:-19.3946,lng:-40.0643},
    "COLATINA": {lat:-19.5395,lng:-40.6306},
    "GUARAPARI": {lat:-20.6772,lng:-40.5093},
    "ARACRUZ": {lat:-19.8200,lng:-40.2730},
    "SAO MATEUS": {lat:-18.7201,lng:-39.8589},
    "VIANA": {lat:-20.3900,lng:-40.4960},
    "NOVA VENECIA": {lat:-18.7100,lng:-40.4000},
    "DOMINGOS MARTINS": {lat:-20.3630,lng:-40.6590},
    "BARRA DE SAO FRANCISCO": {lat:-18.7550,lng:-40.8960},
    "ALEGRE": {lat:-20.7630,lng:-41.5330},
    "MARATAIZES": {lat:-21.0430,lng:-40.8240},
    "VENDA NOVA DO IMIGRANTE": {lat:-20.3270,lng:-41.1350},

    // =====================================
    // GOIÁS
    // =====================================

    "GOIANIA": {lat:-16.6869,lng:-49.2648},
    "ANAPOLIS": {lat:-16.3286,lng:-48.9534},
    "JATAI": {lat:-17.8810,lng:-51.7149},
    "MINEIROS": {lat:-17.5650,lng:-52.5510},
    "ITABERAI": {lat:-16.0200,lng:-49.8060},
    "APARECIDA DE GOIANIA": {lat:-16.8198,lng:-49.2469},
    "RIO VERDE": {lat:-17.7923,lng:-50.9192},
    "LUZIANIA": {lat:-16.2520,lng:-47.9500},
    "CALDAS NOVAS": {lat:-17.7440,lng:-48.6270},
    "CATALAO": {lat:-18.1650,lng:-47.9440},
    "FORMOSA": {lat:-15.5370,lng:-47.3340},
    "ITUMBIARA": {lat:-18.4190,lng:-49.2150},
    "TRINDADE": {lat:-16.6510,lng:-49.4930},
    "SENADOR CANEDO": {lat:-16.7080,lng:-49.0910},
    "QUIRINOPOLIS": {lat:-18.4480,lng:-50.4510},
    "PORANGATU": {lat:-13.4400,lng:-49.1480},
    "GOIANESIA": {lat:-15.3170,lng:-49.1170},
    "CERES": {lat:-15.3080,lng:-49.5980},
    "IPORA": {lat:-16.4410,lng:-51.1180},
    "URUACU": {lat:-14.5240,lng:-49.1400},
    "POSSE": {lat:-14.0930,lng:-46.3690},
    "NIQUELANDIA": {lat:-14.4670,lng:-48.4600},
    "CRISTALINA": {lat:-16.7680,lng:-47.6130},
    "INHUMAS": {lat:-16.3570,lng:-49.4960},
    "GOIATUBA": {lat:-18.0120,lng:-49.3540},
    "PALMEIRAS DE GOIAS": {lat:-16.8050,lng:-49.9250},

    // =====================================
    // MATO GROSSO
    // =====================================

    "CUIABA": {lat:-15.6010,lng:-56.0974},
    "VARZEA GRANDE": {lat:-15.6467,lng:-56.1325},
    "RONDONOPOLIS": {lat:-16.4708,lng:-54.6356},
    "SINOP": {lat:-11.8604,lng:-55.5091},
    "SORRISO": {lat:-12.5450,lng:-55.7110},
    "LUCAS DO RIO VERDE": {lat:-13.0580,lng:-55.9040},
    "TANGARA DA SERRA": {lat:-14.6229,lng:-57.4933},
    "BARRA DO GARCAS": {lat:-15.8917,lng:-52.2567},
    "PRIMAVERA DO LESTE": {lat:-15.5561,lng:-54.2966},
    "ALTA FLORESTA": {lat:-9.8756,lng:-56.0868},
    "CACERES": {lat:-16.0764,lng:-57.6818},
    "JUINA": {lat:-11.3728,lng:-58.7483},
    "PONTES E LACERDA": {lat:-15.2261,lng:-59.3353},
    "NOVA MUTUM": {lat:-13.8374,lng:-56.0743},
    "CAMPO NOVO DO PARECIS": {lat:-13.6750,lng:-57.8900},
    "CAMPO VERDE": {lat:-15.5450,lng:-55.1620},
    "AGUA BOA": {lat:-14.0510,lng:-52.1600},
    "SAPEZAL": {lat:-12.9890,lng:-58.7640},
    "JUARA": {lat:-11.2580,lng:-57.5260},
    "COLIDER": {lat:-10.8130,lng:-55.4550},
    "GUARANTA DO NORTE": {lat:-9.9620,lng:-54.9120},
    "PEIXOTO DE AZEVEDO": {lat:-10.2260,lng:-54.9790},
    "DIAMANTINO": {lat:-14.4080,lng:-56.4460},
    "NOBRES": {lat:-14.7200,lng:-56.3280},
    "JACIARA": {lat:-15.9650,lng:-54.9680},
    "BARRA DO BUGRES": {lat:-15.0720,lng:-57.1820},
    "VILA RICA": {lat:-10.0130,lng:-51.1180},

    // =====================================
    // MATO GROSSO DO SUL
    // =====================================

    "CAMPO GRANDE": {lat:-20.4697,lng:-54.6201},
    "DOURADOS": {lat:-22.2208,lng:-54.8056},
    "TRES LAGOAS": {lat:-20.7849,lng:-51.7007},
    "CORUMBA": {lat:-19.0081,lng:-57.6510},
    "PONTA PORA": {lat:-22.5361,lng:-55.7256},
    "NAVIRAI": {lat:-23.0618,lng:-54.1997},
    "NOVA ANDRADINA": {lat:-22.2380,lng:-53.3430},
    "AQUIDAUANA": {lat:-20.4710,lng:-55.7870},
    "SIDROLANDIA": {lat:-20.9310,lng:-54.9610},
    "MARACAJU": {lat:-21.6140,lng:-55.1680},
    "COXIM": {lat:-18.5060,lng:-54.7600},
    "PARANAIBA": {lat:-19.6770,lng:-51.1900},
    "CHAPADAO DO SUL": {lat:-18.7880,lng:-52.6260},
    "BONITO": {lat:-21.1260,lng:-56.4830},

    // =====================================
    // DISTRITO FEDERAL
    // =====================================

    "BRASILIA": {lat:-15.7939,lng:-47.8828},
    "TAGUATINGA": {lat:-15.8360,lng:-48.0560},
    "CEILANDIA": {lat:-15.8170,lng:-48.1080},
    "GAMA": {lat:-16.0180,lng:-48.0670},
    "SOBRADINHO": {lat:-15.6500,lng:-47.7920},

    // =====================================
    // BAHIA
    // =====================================

    "SALVADOR": {lat:-12.9777,lng:-38.5016},
    "FEIRA DE SANTANA": {lat:-12.2664,lng:-38.9663},
    "VITORIA DA CONQUISTA": {lat:-14.8619,lng:-40.8444},
    "ILHEUS": {lat:-14.7936,lng:-39.0460},
    "ITABUNA": {lat:-14.7876,lng:-39.2781},
    "BARREIRAS": {lat:-12.1439,lng:-44.9968},
    "LUIS EDUARDO MAGALHAES": {lat:-12.0965,lng:-45.7898},
    "JUAZEIRO": {lat:-9.4167,lng:-40.5033},
    "PORTO SEGURO": {lat:-16.4435,lng:-39.0643},
    "EUNAPOLIS": {lat:-16.3717,lng:-39.5803},

    // =====================================
    // TOCANTINS
    // =====================================

    "PALMAS": {lat:-10.1840,lng:-48.3336},
    "ARAGUAINA": {lat:-7.1920,lng:-48.2040},
    "GURUPI": {lat:-11.7280,lng:-49.0680},
    "PORTO NACIONAL": {lat:-10.7080,lng:-48.4170},

    // =====================================
    // PARÁ
    // =====================================

    "BELEM": {lat:-1.4558,lng:-48.5039},
    "ANANINDEUA": {lat:-1.3656,lng:-48.3722},
    "MARABA": {lat:-5.3686,lng:-49.1178},
    "SANTAREM": {lat:-2.4385,lng:-54.6996},
    "PARAUAPEBAS": {lat:-6.0678,lng:-49.9037},
    "REDENCAO": {lat:-8.0253,lng:-50.0317},

    // =====================================
    // AMAZONAS
    // =====================================

    "MANAUS": {lat:-3.1190,lng:-60.0217},
    "ITACOATIARA": {lat:-3.1430,lng:-58.4440},
    "PARINTINS": {lat:-2.6280,lng:-56.7350},

    // =====================================
    // MARANHÃO
    // =====================================

    "SAO LUIS": {lat:-2.5307,lng:-44.3068},
    "IMPERATRIZ": {lat:-5.5264,lng:-47.4797},
    "BALSAS": {lat:-7.5320,lng:-46.0370},

    // =====================================
    // PIAUÍ
    // =====================================

    "TERESINA": {lat:-5.0919,lng:-42.8034},
    "PARNAIBA": {lat:-2.9050,lng:-41.7760},

    // =====================================
    // CEARÁ
    // =====================================

    "FORTALEZA": {lat:-3.7319,lng:-38.5267},
    "JUAZEIRO DO NORTE": {lat:-7.2130,lng:-39.3150},
    "SOBRAL": {lat:-3.6880,lng:-40.3490},
    "MARACANAU": {lat:-3.8760,lng:-38.6250},

    // =====================================
    // RIO GRANDE DO NORTE
    // =====================================

    "NATAL": {lat:-5.7793,lng:-35.2009},
    "MOSSORO": {lat:-5.1870,lng:-37.3440},

    // =====================================
    // PARAÍBA
    // =====================================

    "JOAO PESSOA": {lat:-7.1195,lng:-34.8450},
    "CAMPINA GRANDE": {lat:-7.2306,lng:-35.8811},

    // =====================================
    // PERNAMBUCO
    // =====================================

    "RECIFE": {lat:-8.0476,lng:-34.8770},
    "CARUARU": {lat:-8.2830,lng:-35.9760},
    "PETROLINA": {lat:-9.3891,lng:-40.5030},
    "GARANHUNS": {lat:-8.8900,lng:-36.4960},

    // =====================================
    // ALAGOAS
    // =====================================

    "MACEIO": {lat:-9.6498,lng:-35.7089},
    "ARAPIRACA": {lat:-9.7520,lng:-36.6610},

    // =====================================
    // SERGIPE
    // =====================================

    "ARACAJU": {lat:-10.9472,lng:-37.0731},
    "ITABAIANA": {lat:-10.6850,lng:-37.4250},

    // =====================================
    // ACRE
    // =====================================

    "RIO BRANCO": {lat:-9.9754,lng:-67.8249},

    // =====================================
    // RONDÔNIA
    // =====================================

    "PORTO VELHO": {lat:-8.7612,lng:-63.9004},
    "JI PARANA": {lat:-10.8853,lng:-61.9517},
    "ARIQUEMES": {lat:-9.9057,lng:-63.0325},
    "VILHENA": {lat:-12.7400,lng:-60.1450},

    // =====================================
    // RORAIMA
    // =====================================

    "BOA VISTA": {lat:2.8235,lng:-60.6758},

    // =====================================
    // AMAPÁ
    // =====================================

    "MACAPA": {lat:0.0349,lng:-51.0694}

};

console.log("COORDENADAS CARREGADAS");
