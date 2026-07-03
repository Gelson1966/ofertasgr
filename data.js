/* Arquivo público gerado pelo painel local Ofertas GR.
   CATEGORIAS é usado normalmente pelo site.
   PRODUTOS_INICIAIS agora só serve de backup para o botão
   "Migrar produtos do data.js" no painel admin (envio único para a nuvem). */

const CATEGORIAS = [
  {
    "id": "beleza-fem",
    "nome": "Beleza Feminina",
    "linha1": "FEM.",
    "linha2": "BELEZA",
    "icone": "<svg viewBox=\"0 0 64 64\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"27\" y=\"6\" width=\"10\" height=\"20\" rx=\"4\" fill=\"#f06292\"/><rect x=\"29\" y=\"2\" width=\"6\" height=\"8\" rx=\"2\" fill=\"#ec407a\"/><circle cx=\"32\" cy=\"40\" r=\"17\" fill=\"#fce4ec\"/><circle cx=\"32\" cy=\"40\" r=\"17\" fill=\"none\" stroke=\"#f06292\" stroke-width=\"2\"/><circle cx=\"25\" cy=\"36\" r=\"3.4\" fill=\"#ad1457\"/><circle cx=\"39\" cy=\"36\" r=\"3.4\" fill=\"#ad1457\"/><path d=\"M24 47c2.8 3 5.3 4.4 8 4.4s5.2-1.4 8-4.4\" stroke=\"#ad1457\" stroke-width=\"2.4\" fill=\"none\" stroke-linecap=\"round\"/></svg>"
  },
  {
    "id": "beleza-masc",
    "nome": "Beleza Masculina",
    "linha1": "MASC.",
    "linha2": "BELEZA",
    "icone": "<svg viewBox=\"0 0 64 64\" xmlns=\"http://www.w3.org/2000/svg\"><circle cx=\"32\" cy=\"28\" r=\"16\" fill=\"#ffe0b2\"/><path d=\"M16 30c0-12 7-20 16-20s16 8 16 20c0 2-1 5-2 7-1-6-3-9-6-9-4 0-4 4-8 4s-4-4-8-4c-3 0-5 3-6 9-1-2-2-5-2-7z\" fill=\"#4e342e\"/><rect x=\"20\" y=\"44\" width=\"24\" height=\"14\" rx=\"6\" fill=\"#37474f\"/><circle cx=\"27\" cy=\"29\" r=\"1.6\" fill=\"#3e2723\"/><circle cx=\"37\" cy=\"29\" r=\"1.6\" fill=\"#3e2723\"/></svg>"
  },
  {
    "id": "eletrodomestico",
    "nome": "Eletrodoméstico",
    "linha1": "",
    "linha2": "ELETRODOMÉSTICO",
    "icone": "<svg viewBox=\"0 0 64 64\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"16\" y=\"6\" width=\"32\" height=\"52\" rx=\"5\" fill=\"#eceff1\" stroke=\"#90a4ae\" stroke-width=\"2\"/><rect x=\"16\" y=\"6\" width=\"32\" height=\"18\" rx=\"5\" fill=\"#cfd8dc\"/><line x1=\"16\" y1=\"24\" x2=\"48\" y2=\"24\" stroke=\"#90a4ae\" stroke-width=\"2\"/><rect x=\"40\" y=\"11\" width=\"3\" height=\"8\" rx=\"1.5\" fill=\"#607d8b\"/><rect x=\"40\" y=\"30\" width=\"3\" height=\"8\" rx=\"1.5\" fill=\"#607d8b\"/><circle cx=\"24\" cy=\"40\" r=\"6\" fill=\"#b0bec5\"/><circle cx=\"24\" cy=\"40\" r=\"3\" fill=\"#78909c\"/></svg>"
  },
  {
    "id": "ferramentas",
    "nome": "Ferramentas",
    "linha1": "",
    "linha2": "FERRAMENTAS",
    "icone": "<svg viewBox=\"0 0 64 64\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M40 8l16 16-5 5-4-4-9 9 12 12-7 7-12-12-9 9-4-4 28-28z\" fill=\"#ffb300\"/><path d=\"M14 36l5-5 4 4-14 14-4-4 9-9z\" fill=\"#ff8f00\"/><rect x=\"6\" y=\"44\" width=\"14\" height=\"14\" rx=\"2\" transform=\"rotate(45 13 51)\" fill=\"#5d4037\"/><circle cx=\"46\" cy=\"18\" r=\"4\" fill=\"#37474f\"/></svg>"
  },
  {
    "id": "informatica",
    "nome": "Informática",
    "linha1": "",
    "linha2": "INFORMÁTICA",
    "icone": "<svg viewBox=\"0 0 64 64\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"8\" y=\"12\" width=\"48\" height=\"30\" rx=\"3\" fill=\"#37474f\"/><rect x=\"12\" y=\"16\" width=\"40\" height=\"22\" rx=\"1\" fill=\"#4fc3f7\"/><path d=\"M22 48h20l3 8H19z\" fill=\"#90a4ae\"/><rect x=\"10\" y=\"54\" width=\"44\" height=\"4\" rx=\"2\" fill=\"#607d8b\"/></svg>"
  },
  {
    "id": "moveis",
    "nome": "Móveis",
    "linha1": "",
    "linha2": "MÓVEIS",
    "icone": "<svg viewBox=\"0 0 64 64\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"8\" y=\"28\" width=\"48\" height=\"18\" rx=\"6\" fill=\"#5c6bc0\"/><rect x=\"8\" y=\"22\" width=\"14\" height=\"16\" rx=\"5\" fill=\"#7986cb\"/><rect x=\"42\" y=\"22\" width=\"14\" height=\"16\" rx=\"5\" fill=\"#7986cb\"/><rect x=\"10\" y=\"44\" width=\"6\" height=\"12\" rx=\"2\" fill=\"#3949ab\"/><rect x=\"48\" y=\"44\" width=\"6\" height=\"12\" rx=\"2\" fill=\"#3949ab\"/><rect x=\"8\" y=\"40\" width=\"48\" height=\"6\" rx=\"2\" fill=\"#3949ab\"/></svg>"
  },
  {
    "id": "pet",
    "nome": "Pet",
    "linha1": "",
    "linha2": "PET",
    "icone": "<svg viewBox=\"0 0 64 64\" xmlns=\"http://www.w3.org/2000/svg\"><ellipse cx=\"32\" cy=\"40\" rx=\"16\" ry=\"14\" fill=\"#bcaaa4\"/><path d=\"M16 22c-4-4-8-2-8 4s6 8 12 6z\" fill=\"#8d6e63\"/><path d=\"M48 22c4-4 8-2 8 4s-6 8-12 6z\" fill=\"#8d6e63\"/><circle cx=\"25\" cy=\"36\" r=\"2.4\" fill=\"#3e2723\"/><circle cx=\"39\" cy=\"36\" r=\"2.4\" fill=\"#3e2723\"/><ellipse cx=\"32\" cy=\"44\" rx=\"3.4\" ry=\"2.4\" fill=\"#3e2723\"/><path d=\"M28 47c1.5 1.6 2.5 2 4 2s2.5-.4 4-2\" stroke=\"#3e2723\" stroke-width=\"1.8\" fill=\"none\" stroke-linecap=\"round\"/></svg>"
  },
  {
    "id": "automotivos",
    "nome": "Produtos Automotivos",
    "linha1": "PRODUTOS",
    "linha2": "AUTOMOTIVOS",
    "icone": "<svg viewBox=\"0 0 64 64\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M10 38l4-12c1-3 4-5 7-5h22c3 0 6 2 7 5l4 12v10a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3v-2H18v2a3 3 0 0 1-3 3h-2a3 3 0 0 1-3-3z\" fill=\"#e53935\"/><path d=\"M14 38l3-10c.6-1.6 2-2.6 3.6-2.6h22.8c1.6 0 3 1 3.6 2.6l3 10z\" fill=\"#ef5350\"/><circle cx=\"19\" cy=\"42\" r=\"4\" fill=\"#263238\"/><circle cx=\"45\" cy=\"42\" r=\"4\" fill=\"#263238\"/><rect x=\"13\" y=\"36\" width=\"38\" height=\"4\" fill=\"#ffee58\"/></svg>"
  },
  {
    "id": "utensilios",
    "nome": "Utensílios",
    "linha1": "",
    "linha2": "UTENSÍLIOS",
    "icone": "<svg viewBox=\"0 0 64 64\" xmlns=\"http://www.w3.org/2000/svg\"><rect x=\"13\" y=\"6\" width=\"4\" height=\"26\" rx=\"2\" fill=\"#90a4ae\"/><path d=\"M10 6h3v14h-3zM18 6h3v14h-3z\" fill=\"#90a4ae\"/><path d=\"M10 20c0 6 2.5 9 5.5 9s5.5-3 5.5-9\" stroke=\"#90a4ae\" stroke-width=\"2\" fill=\"none\"/><rect x=\"14\" y=\"30\" width=\"3\" height=\"26\" rx=\"1.5\" fill=\"#90a4ae\"/><path d=\"M38 6c-6 0-9 6-9 14 0 6 3 10 7 11v25h4V31c4-1 7-5 7-11 0-8-3-14-9-14z\" fill=\"#b0bec5\"/></svg>"
  },
  {
    "id": "vestuario-masc",
    "nome": "Vestuário Masculino",
    "linha1": "MASC.",
    "linha2": "VESTUÁRIO",
    "icone": "<svg viewBox=\"0 0 64 64\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M22 12l-12 8 6 9 4-2.5V56h24V26.5l4 2.5 6-9-12-8c0 4-4 7-10 7s-10-3-10-7z\" fill=\"#1976d2\"/><path d=\"M27 12c1 2.5 3 4 5 4s4-1.5 5-4\" stroke=\"#0d47a1\" stroke-width=\"1.6\" fill=\"none\"/><rect x=\"30\" y=\"20\" width=\"4\" height=\"36\" fill=\"#0d47a1\"/></svg>"
  },
  {
    "id": "vestuario-fem",
    "nome": "Vestuário Feminino",
    "linha1": "FEM.",
    "linha2": "VESTUÁRIO",
    "icone": "<svg viewBox=\"0 0 64 64\" xmlns=\"http://www.w3.org/2000/svg\"><path d=\"M26 8l6 5 6-5 6 9-5 5-3-2v6c8 1 13 9 13 19v8H15v-8c0-10 5-18 13-19v-6l-3 2-5-5z\" fill=\"#ab47bc\"/><path d=\"M30 8h4l-2 5z\" fill=\"#fff\"/></svg>"
  },
  {
    "id": "pedido-cliente",
    "nome": "Pedido do Cliente",
    "linha1": "PEDIDO",
    "linha2": "CLIENTE",
    "icone": "📝"
  }
];

const PRODUTOS_INICIAIS = [
  {
    "id": "p_1782178633608_9",
    "categoria": "eletrodomestico",
    "subcategoria": "Ferro de Passar",
    "marca": "Arno",
    "nome": "Ferro de Passar a Vapor Steamgliss - Arno",
    "imagem": "imagens/ELETRODOMESTICOS/FERRO DE PASSAR/FERRO ARNO.png",
    "magalu": {
      "preco": 107.9,
      "link": "https://magazineluiza.onelink.me/589508454/1cunaz2g"
    },
    "ml": {
      "preco": 93.06,
      "link": "https://meli.la/2aofDRR"
    },
    "shopee": {
      "preco": 104.11,
      "link": "https://s.shopee.com.br/6pyYchgoL5"
    }
  },
  {
    "id": "p_1782176837572_6190",
    "categoria": "eletrodomestico",
    "subcategoria": "Ferro de Passar",
    "marca": "Black+Decker",
    "nome": "Ferro de Passar a Vapor Black+Decker - 1200W",
    "imagem": "imagens/ELETRODOMESTICOS/FERRO DE PASSAR/FERRO BLACK DECKER.png",
    "magalu": {
      "preco": 122.44,
      "link": "https://magazineluiza.onelink.me/589508454/msphyb38"
    },
    "ml": {
      "preco": 100.55,
      "link": "https://meli.la/1UpbKmQ"
    },
    "shopee": {
      "preco": 122.55,
      "link": "https://s.shopee.com.br/4AxnPkKSmL"
    }
  },
  {
    "id": "p_1782176271307_2432",
    "categoria": "eletrodomestico",
    "subcategoria": "Ferro de Passar",
    "marca": "Electrolux",
    "nome": "Ferro de Passar a Vapor Electrolux",
    "imagem": "imagens/ELETRODOMESTICOS/FERRO DE PASSAR/FERRO ELECTROLUX.png",
    "magalu": {
      "preco": 89.21,
      "link": "https://magazineluiza.onelink.me/589508454/qdu60ten"
    },
    "ml": {
      "preco": 93.74,
      "link": "https://meli.la/2um1iDS"
    },
    "shopee": {
      "preco": 109.66,
      "link": "https://s.shopee.com.br/gNvEeSYc0"
    }
  },
  {
    "id": "p_1782175881951_8289",
    "categoria": "eletrodomestico",
    "subcategoria": "Ferro de Passar",
    "marca": "Mondial",
    "nome": "Ferro de Passar a Vapor Mondial",
    "imagem": "imagens/ELETRODOMESTICOS/FERRO DE PASSAR/FERRO MONDIAL.png",
    "magalu": {
      "preco": 79,
      "link": "https://magazineluiza.onelink.me/589508454/4ky9scbc"
    },
    "ml": {
      "preco": 85.35,
      "link": "https://meli.la/2Ho5JnV"
    },
    "shopee": {
      "preco": 98.13,
      "link": "https://s.shopee.com.br/BRedIo67A"
    }
  },
  {
    "id": "p_1782172678786_5218",
    "categoria": "eletrodomestico",
    "subcategoria": "Cafeteira",
    "marca": "Britânia",
    "nome": "Cafeteira Elétrica Britânia Inox - 18X",
    "imagem": "imagens/ELETRODOMESTICOS/CAFETEIRA/CAFETEIRA BRITANIA.png",
    "magalu": {
      "preco": 149,
      "link": "https://magazineluiza.onelink.me/589508454/r6gegazv"
    },
    "ml": {
      "preco": 129.9,
      "link": "https://meli.la/1JYWYxg"
    },
    "shopee": {
      "preco": 179.91,
      "link": "https://s.shopee.com.br/70HyiBNn1j"
    }
  },
  {
    "id": "p_1782170001072_1324",
    "categoria": "eletrodomestico",
    "subcategoria": "Cafeteira",
    "marca": "Electrolux",
    "nome": "Cafeteira Electrolux Efficient Jarra Inox - 30X",
    "imagem": "imagens/ELETRODOMESTICOS/CAFETEIRA/CAFETEIRA ELECTROLUX.png",
    "magalu": {
      "preco": 199,
      "link": "https://magazineluiza.onelink.me/589508454/89kidiij"
    },
    "ml": {
      "preco": 184.34,
      "link": "https://meli.la/2LXb6fK"
    },
    "shopee": {
      "preco": 224.98,
      "link": "https://s.shopee.com.br/6VLi47PKw5"
    }
  },
  {
    "id": "p_1782168780251_2974",
    "categoria": "eletrodomestico",
    "subcategoria": "Cafeteira",
    "marca": "Mondial",
    "nome": "Cafeteira Elétrica Dolce Arome Mondial - 30X inox",
    "imagem": "imagens/ELETRODOMESTICOS/CAFETEIRA/CAFETEIRA MONDIAL.png",
    "magalu": {
      "preco": 151.19,
      "link": "https://magazineluiza.onelink.me/589508454/e31p45py"
    },
    "ml": {
      "preco": 215,
      "link": "https://meli.la/1dcH8ug"
    },
    "shopee": {
      "preco": 238.5,
      "link": "https://s.shopee.com.br/4qDU3kWR0W"
    }
  },
  {
    "id": "p_1782007001267_579",
    "categoria": "eletrodomestico",
    "subcategoria": "Cafeteira",
    "marca": "Philco",
    "nome": "Cafeteira Philco 1L Jarra Térmica 30 Cafezinhos - 700W",
    "imagem": "imagens/ELETRODOMESTICOS/CAFETEIRA/CAFETEIRA PHILCO.png",
    "magalu": {
      "preco": 179.91,
      "link": "https://magazineluiza.onelink.me/589508454/lsgt2753"
    },
    "ml": {
      "preco": 184.42,
      "link": "https://meli.la/1eQdmfM"
    },
    "shopee": {
      "preco": 247.41,
      "link": "https://s.shopee.com.br/3LOdHdpo3l"
    }
  },
  {
    "id": "p_1782006079851_2380",
    "categoria": "eletrodomestico",
    "subcategoria": "Batedeira",
    "marca": "Philco",
    "nome": "Batedeira Philco Preta 12 Velocidade 5L - 800W",
    "imagem": "imagens/ELETRODOMESTICOS/BATEDEIRA/BATEDEIRA PHILCO.png",
    "magalu": {
      "preco": 329,
      "link": "https://magazineluiza.onelink.me/589508454/2gazkjq2"
    },
    "ml": {
      "preco": 321.21,
      "link": "https://meli.la/1Wk42Ad"
    },
    "shopee": {
      "preco": 373.16,
      "link": "https://s.shopee.com.br/9UzGc3gYWh"
    }
  },
  {
    "id": "p_1782004274579_3676",
    "categoria": "eletrodomestico",
    "subcategoria": "Batedeira",
    "marca": "Electrolux",
    "nome": "Batedeira Electrolux com Tigela 5L - 750W",
    "imagem": "imagens/ELETRODOMESTICOS/BATEDEIRA/BATEDEIRA ELECTROLUX.png",
    "magalu": {
      "preco": 418.41,
      "link": "https://magazineluiza.onelink.me/589508454/9rj103o8"
    },
    "ml": {
      "preco": 469.77,
      "link": "https://meli.la/1eB6VH8"
    },
    "shopee": {
      "preco": 404.91,
      "link": "https://s.shopee.com.br/50WrDk1YRh"
    }
  },
  {
    "id": "p_1781993377431_6691",
    "categoria": "eletrodomestico",
    "subcategoria": "Batedeira",
    "marca": "Britânia",
    "nome": "Batedeira Britânia Preta 12 Velocidades - 700W",
    "imagem": "imagens/ELETRODOMESTICOS/BATEDEIRA/BATEDEIRA BRITÂNIA.png",
    "magalu": {
      "preco": 299,
      "link": "https://magazineluiza.onelink.me/589508454/c4ff6udu"
    },
    "ml": {
      "preco": 314.74,
      "link": "https://meli.la/1GS9tSw"
    },
    "shopee": {
      "preco": 278.91,
      "link": "https://s.shopee.com.br/1gGP3A8LhA"
    }
  },
  {
    "id": "p_1781888532278_7525",
    "categoria": "eletrodomestico",
    "subcategoria": "Batedeira",
    "marca": "Mondial",
    "nome": "Batedeira Mondial 500W",
    "imagem": "imagens/ELETRODOMESTICOS/BATEDEIRA/BATEDEIRA MONDIAL.png",
    "magalu": {
      "preco": 129.11,
      "link": "https://magazineluiza.onelink.me/589508454/w2wz2nxc"
    },
    "ml": {
      "preco": 100.07,
      "link": "https://meli.la/27CfB83"
    },
    "shopee": {
      "preco": 137.66,
      "link": "https://s.shopee.com.br/2qSKVAPVKT"
    }
  },
  {
    "id": "p_1781832336373_5264",
    "categoria": "eletrodomestico",
    "subcategoria": "Aspirador de pó",
    "marca": "Philco",
    "nome": "Aspirador de pó Vertical Philco - 1450W",
    "imagem": "imagens/ELETRODOMESTICOS/ASPIRADOR DE PO/PHILCO.png",
    "magalu": {
      "preco": 179,
      "link": "https://magazineluiza.onelink.me/589508454/vmj0igbx"
    },
    "ml": {
      "preco": 189.91,
      "link": "https://meli.la/1dErAhe"
    },
    "shopee": {
      "preco": 136.78,
      "link": "https://s.shopee.com.br/3LOa3u7Pb0"
    }
  },
  {
    "id": "p_1781831136204_8957",
    "categoria": "eletrodomestico",
    "subcategoria": "Aspirador de pó",
    "marca": "Mondial",
    "nome": "Aspirador de pó 2 em 1 Mondial - 1500W",
    "imagem": "imagens/ELETRODOMESTICOS/ASPIRADOR DE PO/MONDIAL.png",
    "magalu": {
      "preco": 170.05,
      "link": "https://magazineluiza.onelink.me/589508454/uws1wv9a"
    },
    "ml": {
      "preco": 149,
      "link": "https://meli.la/2JxkgHx"
    },
    "shopee": {
      "preco": 179.01,
      "link": "https://s.shopee.com.br/1884HDfh5"
    }
  },
  {
    "id": "p_1781825450375_7719",
    "categoria": "eletrodomestico",
    "subcategoria": "Aspirador de pó",
    "marca": "Electrolux",
    "nome": "Aspirador de pó Vertical Electrolux - 1450W",
    "imagem": "imagens/ELETRODOMESTICOS/ASPIRADOR DE PO/ELECTROLUX.png",
    "magalu": {
      "preco": 179,
      "link": "https://magazineluiza.onelink.me/589508454/x2itrj4k"
    },
    "ml": {
      "preco": 189,
      "link": "https://meli.la/2RHWCAW"
    },
    "shopee": {
      "preco": 224.91,
      "link": "https://s.shopee.com.br/9zvTsGiXPG"
    }
  },
  {
    "id": "p_1781814245694_5115",
    "categoria": "eletrodomestico",
    "subcategoria": "Aspirador de pó",
    "marca": "Britânia",
    "nome": "Aspirador de pó Britânia 2 em 1 - 1250W",
    "imagem": "imagens/ELETRODOMESTICOS/ASPIRADOR DE PO/BRITANIA.png",
    "magalu": {
      "preco": 149,
      "link": "https://magazineluiza.onelink.me/589508454/zbmjprb8"
    },
    "ml": {
      "preco": 119.92,
      "link": "https://meli.la/188yTBB"
    },
    "shopee": {
      "preco": 143.91,
      "link": "https://s.shopee.com.br/8V6fsgfc6W"
    }
  },
  {
    "id": "p1",
    "categoria": "eletrodomestico",
    "subcategoria": "Air Fryer",
    "marca": "Britânia",
    "nome": "Air Fryer Britânia - 5L - 1500W - Inox ou Preto",
    "imagem": "imagens/ELETRODOMESTICOS/AIR FRYER/AIR FRYER BRITANIA.png",
    "magalu": {
      "preco": 259,
      "link": "https://www.magazinevoce.com.br/SEU-LINK-AQUI"
    },
    "ml": {
      "preco": 344.85,
      "link": "https://www.mercadolivre.com.br/SEU-LINK-AQUI"
    },
    "shopee": {
      "preco": 260.91,
      "link": "https://shopee.com.br/SEU-LINK-AQUI"
    }
  },
  {
    "id": "p2",
    "categoria": "eletrodomestico",
    "subcategoria": "Air Fryer",
    "marca": "Electrolux",
    "nome": "Air Fryer Electrolux - 5,6L - 1400W - Inox ou Preto",
    "imagem": "imagens/ELETRODOMESTICOS/AIR FRYER/AIR FRYER ELECTROLUX.png",
    "magalu": {
      "preco": 329.9,
      "link": "https://www.magazinevoce.com.br/SEU-LINK-AQUI"
    },
    "ml": {
      "preco": 384.59,
      "link": "https://www.mercadolivre.com.br/SEU-LINK-AQUI"
    },
    "shopee": {
      "preco": 415.21,
      "link": "https://shopee.com.br/SEU-LINK-AQUI"
    }
  },
  {
    "id": "p3",
    "categoria": "eletrodomestico",
    "subcategoria": "Air Fryer",
    "marca": "Mondial",
    "nome": "Air Fryer Mondial - 5l - 1900W",
    "imagem": "imagens/ELETRODOMESTICOS/AIR FRYER/AIR FRYER MONDIAL.png",
    "magalu": {
      "preco": 312.55,
      "link": "https://www.magazinevoce.com.br/SEU-LINK-AQUI"
    },
    "ml": {
      "preco": 329,
      "link": "https://www.mercadolivre.com.br/SEU-LINK-AQUI"
    },
    "shopee": {
      "preco": 305.91,
      "link": "https://shopee.com.br/SEU-LINK-AQUI"
    }
  },
  {
    "id": "p4",
    "categoria": "eletrodomestico",
    "subcategoria": "Air Fryer",
    "marca": "Philco",
    "nome": "Air Fryer Philco - 5,5l - 1500W",
    "imagem": "imagens/ELETRODOMESTICOS/AIR FRYER/AIR FRYER PHILCO.png",
    "magalu": {
      "preco": 397.01,
      "link": "https://www.magazinevoce.com.br/SEU-LINK-AQUI"
    },
    "ml": {
      "preco": 314.89,
      "link": "https://www.mercadolivre.com.br/SEU-LINK-AQUI"
    },
    "shopee": {
      "preco": 419,
      "link": "https://shopee.com.br/SEU-LINK-AQUI"
    }
  }
];
