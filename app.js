import { db, collection, onSnapshot } from "./firebase-config.js";

const CATEGORY_IMAGES = {
  "beleza-fem": "imagens/SIMBOLOS/menu-beleza-feminina.png",
  "beleza-masc": "imagens/SIMBOLOS/menu-beleza-masculina.png",
  "eletrodomestico": "imagens/SIMBOLOS/menu-eletrodomesticos.png",
  "ferramentas": "imagens/SIMBOLOS/menu-ferramentas.avif",
  "informatica": "imagens/SIMBOLOS/menu-informatica.jpg",
  "moveis": "imagens/SIMBOLOS/menu-moveis.png",
  "pet": "imagens/SIMBOLOS/menu-pet.png",
  "automotivos": "imagens/SIMBOLOS/menu-automotivos.png",
  "utensilios": "imagens/SIMBOLOS/menu-utensilios.png",
  "vestuario-masc": "imagens/SIMBOLOS/menu-vestuario-masculino.png",
  "vestuario-fem": "imagens/SIMBOLOS/menu-vestuario-feminino.png"
};

let produtos = [];
let categoriaAtiva = "todas";
let buscaAtiva = "";
let imagensCategorias = {};
let paginaAtual=1;
const PRODUTOS_POR_PAGINA=20;

// As imagens personalizadas de categoria ficam no Firestore (coleção
// "categoriaImagens"), assim aparecem pra todos os visitantes e não somem
// quando o cache do navegador é limpo.
function escutarImagensCategoriasEmTempoReal() {
  onSnapshot(collection(db, "categoriaImagens"), snapshot => {
    const novasImagens = {};
    snapshot.docs.forEach(item => {
      const dados = item.data();
      if (dados && dados.imagem) novasImagens[item.id] = dados.imagem;
    });
    imagensCategorias = novasImagens;
    montarCategorias();
  }, erro => {
    console.error("Não foi possível carregar as imagens das categorias:", erro);
  });
}

// Escuta o banco de dados (Firestore) em tempo real: assim que um produto é
// cadastrado, editado ou excluído no painel admin, o site atualiza sozinho,
// sem precisar recarregar a página nem subir nenhum arquivo.
function escutarProdutosEmTempoReal() {
  onSnapshot(collection(db, "produtos"), snapshot => {
    produtos = snapshot.docs.map(item => item.data());
    montarCategorias();
    renderizarProdutos();
    if (typeof atualizarBannerAchadinhos === "function") atualizarBannerAchadinhos();
  }, erro => {
    console.error("Não foi possível carregar os produtos do banco de dados:", erro);
  });
}

function formatarPreco(valor) {
  const numero = Number(valor);
  if (!Number.isFinite(numero)) return "";
  return numero.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL"
  });
}

function iconeDaCategoria(categoria) {
  const imagem = imagensCategorias[categoria.id] || CATEGORY_IMAGES[categoria.id];
  if (imagem) return `<img src="${imagem}" alt="" onerror="this.style.display='none'">`;
  return categoria.icone;
}

function montarCategorias() {
  const nav = document.getElementById("categoryNav");
  const todas = `
    <button class="category-button ${(!buscaAtiva && categoriaAtiva === "todas") ? "active" : ""}" data-category="todas">
      <span class="category-icon">🛍️</span>
      Todas
    </button>`;

  nav.innerHTML = todas + CATEGORIAS.map(categoria => `
    <button class="category-button ${(!buscaAtiva && categoriaAtiva === categoria.id) ? "active" : ""}" data-category="${categoria.id}">
      <span class="category-icon">${iconeDaCategoria(categoria)}</span>
      ${categoria.nome}
    </button>
  `).join("");

  nav.querySelectorAll("[data-category]").forEach(botao => {
    botao.addEventListener("click", () => {
      categoriaAtiva = botao.dataset.category;
      buscaAtiva = "";
      paginaAtual=1;
      const campoPesquisa = document.getElementById("searchInput");
      if(campoPesquisa) campoPesquisa.value = "";
      const productsArea = document.getElementById("productsArea");
      if(productsArea){
        const header = document.querySelector(".site-header");
        const offset = (header ? header.offsetHeight : 0) + 10;
        const top = productsArea.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({top, behavior:"smooth"});
      }
      montarCategorias();
      renderizarProdutos();

    });
  });
}

function dadosDasLojas(produto) {
  return [
    { nome: "Amazon", classe: "store-amazon", dados: produto.amazon },
    { nome: "Magalu", classe: "store-magalu", dados: produto.magalu },
    { nome: "Mercado Livre", classe: "store-ml", dados: produto.ml },
    { nome: "Shopee", classe: "store-shopee", dados: produto.shopee }
  ]
    .filter(loja => loja.dados && loja.dados.preco !== null && loja.dados.preco !== "")
    .sort((a, b) => a.nome.localeCompare(b.nome, "pt-BR"));
}

function emojiDoProduto(produto) {
  const emojis = {
    "beleza-fem": "💄",
    "beleza-masc": "🧔",
    eletrodomestico: "🍳",
    ferramentas: "🛠️",
    informatica: "💻",
    moveis: "🛋️",
    pet: "🐾",
    automotivos: "🚗",
    utensilios: "🍴",
    "vestuario-masc": "👕",
    "vestuario-fem": "👗"
  };
  return emojis[produto.categoria] || "🛍️";
}

function criarCard(produto) {
  const lojas = dadosDasLojas(produto);
  const menorPreco = lojas.length ? Math.min(...lojas.map(loja => Number(loja.dados.preco))) : null;
  const imagem = produto.imagem
    ? `<img class="product-image" src="${produto.imagem}" alt="${produto.nome}" loading="lazy" onerror="this.onerror=null;this.src=this.src.replace(/\.png$/i,'.PNG');">`
    : `<span class="product-placeholder">${emojiDoProduto(produto)}</span>`;

  const precos = lojas.map(loja => {
    const melhor = Number(loja.dados.preco) === menorPreco;
    const tag = loja.dados.link ? "a" : "div";
    const linkAttributes = loja.dados.link
      ? ` href="${loja.dados.link}" target="_blank" rel="noopener sponsored" aria-label="Comprar ${produto.nome} na ${loja.nome}"`
      : "";
    return `
      <${tag} class="price-item ${loja.classe} ${melhor ? "best" : ""}"${linkAttributes}>
        <span class="store-name">${loja.nome}</span>
        <span class="price-value">${formatarPreco(loja.dados.preco)}</span>
      </${tag}>`;
  }).join("");

  const detalhe = produto.descricao
    ? `<div class="product-detail-box"><p class="product-detail-desc">${produto.descricao}</p></div>`
    : "";

  return `
    <article class="product-card">
      <div class="product-image-wrap">
        ${imagem}
      </div>
      ${menorPreco !== null ? '<div class="best-badge">💰 MELHOR PREÇO</div>' : ""}
      <div class="product-body">
        ${categoriaAtiva === "melhores" ? `<span class="product-brand" style="color:#F57C00;">🔥 ACHADINHO</span><span class="product-brand">${produto.marca || "Oferta GR"}</span>` : `<span class="product-brand">${produto.marca || "Oferta GR"}</span>`}
        <h3 class="product-name">${produto.nome}</h3>
        <div class="price-list">${precos || '<span style="font-size:12px;color:#69758a">Preços em atualização</span>'}</div>
      </div>
      ${detalhe}
    </article>`;
}

// Normaliza texto para comparar subcategorias sem se confundir com
// diferenças de maiúsculas/minúsculas, espaços extras ou acentuação
// (ex.: "Depurador de Ar" e "depurador de ar " são a mesma coisa).
function normalizarChave(texto) {
  return (texto || "")
    .toString()
    .trim()
    .toLocaleLowerCase("pt-BR")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, " ");
}

// Retorna a lista de "Melhores Achadinhos do Site": um produto por
// subcategoria (o de menor preço), reunidos de todas as categorias.
// Essa é a MESMA lista que aparece na página de Achadinhos, e agora
// também é a fonte usada pelo banner (hero) para garantir consistência.
function obterMelhoresAchadinhos() {
  const melhores = [];
  CATEGORIAS.forEach(cat => {
    if(cat.id==="pedido-cliente") return;
    const itensCategoria = produtos.filter(p => p.categoria === cat.id);
    const grupos = {};
    itensCategoria.forEach(p=>{
      const chave=normalizarChave(p.subcategoria || p.nome || "Outros");
      if(!grupos[chave]) grupos[chave]=[];
      grupos[chave].push(p);
    });
    Object.values(grupos).forEach(itens=>{
      itens.sort((a,b)=>{
        const pa=Math.min(...dadosDasLojas(a).map(l=>Number(l.dados.preco)||999999));
        const pb=Math.min(...dadosDasLojas(b).map(l=>Number(l.dados.preco)||999999));
        return pa-pb;
      });
      melhores.push(itens[0]);
    });
  });
  return melhores;
}

function listaFiltrada() {
  if (categoriaAtiva === "melhores") {
    return obterMelhoresAchadinhos();
  }
  return produtos.filter(produto => {
    const correspondeCategoria = categoriaAtiva === "todas" ? produto.categoria !== "pedido-cliente" : produto.categoria === categoriaAtiva;
    const texto = `${produto.marca || ""} ${produto.nome || ""} ${produto.subcategoria || ""}`.toLocaleLowerCase("pt-BR");
    return correspondeCategoria && texto.includes(buscaAtiva);
  });
}

function atualizarCabecalho(lista) {
  const categoria = CATEGORIAS.find(item => item.id === categoriaAtiva);
  const titulo = buscaAtiva
    ? "Resultados da pesquisa"
    : categoriaAtiva === "melhores"
      ? "🏆 Melhores Achadinhos do Site"
      : categoria
      ? categoria.nome
      : "Todos os Produtos";

  const dicaHover = "";
  document.getElementById("sectionTitle").textContent = titulo;
  document.getElementById("sectionSubtitle").innerHTML = buscaAtiva
    ? `Produtos encontrados para “${document.getElementById("searchInput").value.trim()}”.`
    : categoriaAtiva === "melhores"
    ? "Selecionamos automaticamente os menores preços por categoria e subcategoria entre Magalu, Mercado Livre e Shopee. " + dicaHover
    : categoriaAtiva === "pedido-cliente"
    ? "Produtos pesquisados e cadastrados a pedido dos nossos clientes."
    : "Encontre o melhor preço entre as lojas pesquisadas. " + dicaHover;
  document.getElementById("resultCount").textContent = `${lista.length} ${lista.length === 1 ? "oferta" : "ofertas"}`;
}


function scrollParaResultados(){
  const alvo=document.querySelector('.section-header')||document.getElementById('productsArea');
  if(!alvo) return;
  const header=document.querySelector('.site-header');
  const offset=(header?header.offsetHeight:0)+20;
  const y=alvo.getBoundingClientRect().top+window.pageYOffset-offset;
  window.scrollTo({top:y,behavior:'smooth'});
}
function injetarDadosEstruturados(lista) {
  const ID = 'structured-data-produtos';
  let script = document.getElementById(ID);
  if (!lista || !lista.length) {
    if (script) script.remove();
    return;
  }

  const itens = lista.slice(0, 20).map((produto, i) => {
    const lojas = dadosDasLojas(produto);
    const precosNumericos = lojas.map(l => Number(l.dados.preco)).filter(Number.isFinite);
    const menorPreco = precosNumericos.length ? Math.min(...precosNumericos) : null;
    const lojaMenorPreco = lojas.find(l => Number(l.dados.preco) === menorPreco);
    let imagemAbsoluta;
    try {
      imagemAbsoluta = produto.imagem ? new URL(produto.imagem, window.location.origin).href : undefined;
    } catch (e) { imagemAbsoluta = undefined; }

    const product = {
      "@type": "Product",
      "name": produto.nome,
      ...(produto.marca ? { "brand": { "@type": "Brand", "name": produto.marca } } : {}),
      ...(imagemAbsoluta ? { "image": imagemAbsoluta } : {}),
      ...(menorPreco !== null ? {
        "offers": {
          "@type": "Offer",
          "priceCurrency": "BRL",
          "price": menorPreco,
          "availability": "https://schema.org/InStock",
          "url": (lojaMenorPreco && lojaMenorPreco.dados.link) || "https://ofertasgr.com/"
        }
      } : {})
    };

    return { "@type": "ListItem", "position": i + 1, "item": product };
  });

  const dados = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "itemListElement": itens
  };

  if (!script) {
    script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = ID;
    document.head.appendChild(script);
  }
  script.textContent = JSON.stringify(dados);
}

function renderizarProdutos() {
  const area = document.getElementById("productsArea");
  const lista = listaFiltrada().sort((a, b) => {
    const sub = (a.subcategoria || "").localeCompare((b.subcategoria || ""), "pt-BR", { sensitivity: "base" });
    if (sub) return sub;
    const marca = (a.marca || "").localeCompare((b.marca || ""), "pt-BR", { sensitivity: "base" });
    if (marca) return marca;
    return (a.nome || "").localeCompare((b.nome || ""), "pt-BR", { sensitivity: "base" });
  });
  atualizarCabecalho(lista);
  injetarDadosEstruturados(lista);

  if (!lista.length) {
    area.innerHTML = `
      <div class="empty-state">
        <span>🔎</span>
        <h3>Nenhuma oferta encontrada</h3>
        <p>Tente outro termo ou escolha uma categoria diferente.</p>
      </div>`;
    return;
  }

  if (categoriaAtiva === "melhores") {
    const gruposCat = new Map();
    lista.forEach(produto => {
      const catNome = CATEGORIAS.find(c=>c.id===produto.categoria)?.nome || produto.categoria;
      if(!gruposCat.has(catNome)) gruposCat.set(catNome, []);
      gruposCat.get(catNome).push(produto);
    });

    area.innerHTML = [...gruposCat.entries()].sort((a,b)=>a[0].localeCompare(b[0],"pt-BR",{sensitivity:"base"})).map(([nome,itens]) => `
      <div class="category-showcase">
        <h3 class="subcat-title">${nome}</h3>
        <div class="product-grid">${itens.map(criarCard).join("")}</div>
      </div>
    `).join("");
    return;
  }

  if (categoriaAtiva !== "melhores" && categoriaAtiva !== "pedido-cliente") {
    const totalPaginas=Math.max(1,Math.ceil(lista.length/PRODUTOS_POR_PAGINA));
    if(paginaAtual>totalPaginas) paginaAtual=totalPaginas;
    const inicio=(paginaAtual-1)*PRODUTOS_POR_PAGINA;
    const pagina=lista.slice(inicio,inicio+PRODUTOS_POR_PAGINA);
    const botoes=Array.from({length:totalPaginas},(_,i)=>`<button class="page-btn ${paginaAtual===i+1?"active":""}" data-page="${i+1}" style="${paginaAtual===i+1?"background:#1976D2;color:#fff;border-color:#1976D2;":""}">${i+1}</button>`).join("");
    area.innerHTML=`<div class="product-grid">${pagina.map(criarCard).join("")}</div>
    <div class="pagination" style="display:flex;gap:8px;justify-content:center;align-items:center;margin:30px 0;flex-wrap:wrap">
    <button class="page-prev" ${paginaAtual===1?"disabled":""}>◀ Anterior</button>
    ${botoes}
    <button class="page-next" ${paginaAtual===totalPaginas?"disabled":""}>Próxima ▶</button></div>`;
    area.querySelector(".page-prev")?.addEventListener("click",()=>{paginaAtual--;renderizarProdutos();scrollParaResultados();});
    area.querySelector(".page-next")?.addEventListener("click",()=>{paginaAtual++;renderizarProdutos();scrollParaResultados();});
    area.querySelectorAll("[data-page]").forEach(b=>b.onclick=()=>{paginaAtual=Number(b.dataset.page);renderizarProdutos();scrollParaResultados();});
    return;
  }

  if (categoriaAtiva === "pedido-cliente") {
    area.innerHTML = `
      <div class="empty-state">
        <span>📝</span>
        <h3>Pedido do Cliente</h3>
        <p>Produtos pesquisados e cadastrados a pedido dos nossos clientes.</p>
        <p>Não encontrou o que procura? Entre em contato pelo WhatsApp e faremos uma pesquisa nas principais lojas parceiras para ajudar você a encontrar a melhor oferta.</p>
      </div>`;
  }

  const grupos = new Map();
  lista.forEach(produto => {
    const nome = produto.subcategoria || "Outros";
    if (!grupos.has(nome)) grupos.set(nome, []);
    grupos.get(nome).push(produto);
  });

  area.innerHTML = [...grupos.entries()].sort((a,b)=>a[0].localeCompare(b[0],"pt-BR",{sensitivity:"base"})).map(([nome, itens]) => `
    <h3 class="subcat-title">${nome}</h3>
    <div class="product-grid">${itens.map(criarCard).join("")}</div>
  `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  escutarImagensCategoriasEmTempoReal();
  montarCategorias();
  renderizarProdutos();
  escutarProdutosEmTempoReal();

  document.getElementById("year").textContent = new Date().getFullYear();
  const mensagem = encodeURIComponent("Olá! Obrigado por entrar em contato. Recebi sua mensagem e em breve vou responder. Enquanto isso, já pode me falar no que posso te ajudar?");
  document.getElementById("whatsLink").href = `https://wa.me/5511971718646?text=${mensagem}`;
  document.getElementById("searchInput").addEventListener("input", evento => {
    buscaAtiva = evento.target.value.trim().toLocaleLowerCase("pt-BR");
    paginaAtual=1;
    if (buscaAtiva) categoriaAtiva = "todas";
    montarCategorias();
    renderizarProdutos();
  });
});


document.addEventListener("DOMContentLoaded",()=>{
 const cfg=JSON.parse(localStorage.getItem("ofertasgr_site_config_v1")||"{}");

 const logo=document.querySelector(".brand-logo");
 if(logo && cfg.logo) logo.src=cfg.logo;

 const nome=document.querySelector(".brand-name");
 if(nome && cfg.nameSize) nome.style.fontSize=cfg.nameSize+"px";

 const cargo=document.querySelector(".brand-role");
 if(cargo && cfg.roleSize) cargo.style.fontSize=cfg.roleSize+"px";
});


document.addEventListener("DOMContentLoaded", () => {
  const searchInput = document.getElementById("searchInput");
  if(searchInput){
    searchInput.addEventListener("keydown", function(e){
      if(e.key === "Enter"){
        e.preventDefault();
        this.value = "";
        this.blur();
        setTimeout(() => {
          const header = document.querySelector(".site-header");
          const section = document.querySelector(".section-header");
          if(section){
            const offset = (header ? header.offsetHeight : 0) + 10;
            const top = section.getBoundingClientRect().top + window.pageYOffset - offset;
            window.scrollTo({top, behavior:"smooth"});
          }
        }, 100);
      }
    });
  }
});



document.addEventListener('DOMContentLoaded',()=>{
 const nav=document.getElementById('categoryNav');
 const left=document.getElementById('catLeft');
 const right=document.getElementById('catRight');

 if(nav && left && right){
   let currentIndex = 0;

   const getButtons = () => [...nav.querySelectorAll('.category-button')];

   right.addEventListener('click',()=>{
      const buttons = getButtons();
      if(currentIndex < buttons.length - 1){
         currentIndex++;
         buttons[currentIndex].scrollIntoView({
            behavior:'smooth',
            inline:'start',
            block:'nearest'
         });
      }
   });

   left.addEventListener('click',()=>{
      const buttons = getButtons();
      if(currentIndex > 0){
         currentIndex--;
         buttons[currentIndex].scrollIntoView({
            behavior:'smooth',
            inline:'start',
            block:'nearest'
         });
      }
   });
 }
});


document.addEventListener("DOMContentLoaded",()=>{
 const heroBtn=document.querySelector('.hero-action');
 if(heroBtn){
   heroBtn.addEventListener('click',function(e){
     e.preventDefault();
     categoriaAtiva='melhores';
     buscaAtiva='';
     const s=document.getElementById('searchInput');
     if(s) s.value='';
     montarCategorias();
     renderizarProdutos();
     const section=document.querySelector('.section-header');
     const header=document.querySelector('.site-header');
     if(section){
       const offset=(header ? header.offsetHeight : 0)+10;
       const top=section.getBoundingClientRect().top + window.pageYOffset - offset;
       window.scrollTo({top,behavior:'smooth'});
     }
   });
 }
});


document.addEventListener("DOMContentLoaded",()=>{
  const nav=document.getElementById("categoryNav");
  if(nav){
    nav.addEventListener("click",()=>{
      setTimeout(()=>{
        const header=document.querySelector(".site-header");
        const section=document.querySelector(".section-header");
        if(section){
          const offset=(header?header.offsetHeight:0)+10;
          const top=section.getBoundingClientRect().top+window.pageYOffset-offset;
          window.scrollTo({top,behavior:"smooth"});
        }
      },120);
    });
  }
});


function construirCardAchadinho(prod){
  const lojas=dadosDasLojas(prod);
  if(!lojas.length) return '';
  let melhor=lojas.reduce((a,b)=>Number(a.dados.preco)<=Number(b.dados.preco)?a:b);
  const img=prod.imagem||prod.foto||'';
  const CORES_LOJA = {
    'Magalu': { bg: '#0086FF', cor: '#fff' },
    'Mercado Livre': { bg: '#FFE600', cor: '#000' },
    'Shopee': { bg: '#EE4D2D', cor: '#fff' },
    'Amazon': { bg: '#131921', cor: '#FF9900' }
  };
  const estiloLoja = CORES_LOJA[melhor.nome] || { bg: '#EE4D2D', cor: '#fff' };
  return `<a class="visual-card" href="${melhor.dados.link||'#'}" target="_blank" rel="noopener sponsored" style="text-decoration:none;color:inherit">
<div class="visual-top">${img?'<img src="'+img+'" style="width:100%;height:80px;object-fit:contain">':'📸'}</div>
<div style="font-size:13px;font-weight:700;color:#25324a">${prod.nome}</div>
<div class="visual-price"><strong style="color:#0a9d4a;font-size:20px">${formatarPreco(melhor.dados.preco)}</strong><span style="display:inline-block;padding:4px 10px;border-radius:999px;font-weight:700;background:${estiloLoja.bg};color:${estiloLoja.cor}">${melhor.nome}</span></div>
</a>`;
}

let heroCarouselTimer=null;
let heroCarouselResizeHandler=null;
let heroCarouselResizeObserver=null;

// Gera um número "aleatório" que é sempre o mesmo para a mesma semente (seed).
// Assim, usando a data como semente, TODOS os visitantes veem o mesmo sorteio
// no mesmo dia, e o sorteio muda sozinho quando o dia (local) vira — sem
// depender de localStorage nem de cache do navegador.
function criarGeradorComSemente(semente) {
  let estado = 0;
  for (let i = 0; i < semente.length; i++) {
    estado = (estado * 31 + semente.charCodeAt(i)) >>> 0;
  }
  return function () {
    estado |= 0; estado = (estado + 0x6D2B79F5) | 0;
    let t = Math.imul(estado ^ (estado >>> 15), 1 | estado);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

// Embaralha um array de forma determinística usando o gerador acima
// (substitui o antigo `.sort(() => Math.random() - 0.5)`).
function embaralharComSemente(lista, aleatorio) {
  const copia = [...lista];
  for (let i = copia.length - 1; i > 0; i--) {
    const j = Math.floor(aleatorio() * (i + 1));
    [copia[i], copia[j]] = [copia[j], copia[i]];
  }
  return copia;
}

function atualizarBannerAchadinhos(){
 const box=document.getElementById('heroDeals');
 if(!box) return;
 if(!produtos || !produtos.length) return;

 // Data local (não UTC), para a virada acontecer na meia-noite daqui.
 const agora=new Date();
 const hoje=`${agora.getFullYear()}-${String(agora.getMonth()+1).padStart(2,'0')}-${String(agora.getDate()).padStart(2,'0')}`;
 const aleatorioDoDia=criarGeradorComSemente(hoje);
 const POR_CATEGORIA=4;
 let escolhidos=[];

 // Número inteiro que aumenta 1 a cada dia (dia 0, dia 1, dia 2...).
 // É usado para GIRAR a lista de produtos a cada dia, em vez de sortear
 // aleatoriamente. Isso garante que o mesmo produto só volta a aparecer
 // depois de passar pela vez de todos os outros da mesma subcategoria —
 // ou seja, nunca se repete de um dia para o outro (a menos que só exista
 // 1 produto naquela subcategoria, aí não tem outro pra variar).
 const [anoDoDia, mesDoDia, diaDoDia] = hoje.split('-').map(Number);
 const diaIndex = Math.floor(Date.UTC(anoDoDia, mesDoDia - 1, diaDoDia) / 86400000);

 {
   // O banner usa a MESMA lista de "Melhores Achadinhos do Site" (um
   // produto por subcategoria, já o de menor preço). O que gira a cada dia
   // é QUAIS achadinhos daquela categoria aparecem: hoje pode ser
   // air fryer + batedeira, amanhã espremedor + geladeira, etc., andando
   // por uma janela de subcategorias diferentes até passar por todas.
   const achadinhos=obterMelhoresAchadinhos();
   CATEGORIAS.forEach(cat=>{
     if(cat.id==='pedido-cliente') return;
     const itensCategoria=achadinhos.filter(p=>p.categoria===cat.id && dadosDasLojas(p).length);
     if(!itensCategoria.length) return;

     // Ordem ESTÁVEL (sempre a mesma, não sorteada) das subcategorias dentro
     // da categoria. É a partir dessa ordem fixa que giramos o ponto de
     // partida a cada dia — se a ordem mudasse toda hora, a rotação perderia
     // a garantia de não repetir.
     const ordenados = [...itensCategoria].sort((a,b) =>
       (a.subcategoria||'').localeCompare(b.subcategoria||'','pt-BR')
     );

     const total=ordenados.length;
     const quantidade=Math.min(POR_CATEGORIA, total);

     // Janela de "quantidade" achadinhos, andando em BLOCOS a cada dia:
     // dia 1 mostra os itens 1-4, dia 2 mostra 5-8, dia 3 mostra 9-12...
     // e quando os blocos acabam, volta pro bloco inicial (item 1) e
     // recomeça o ciclo. Assim nenhum achadinho se repete até que todos
     // os outros já tenham aparecido no banner.
     const inicio = (diaIndex * quantidade) % total;
     const selecionados=[];
     for(let k=0;k<quantidade;k++){
       selecionados.push(ordenados[(inicio+k)%total]);
     }

     escolhidos.push(...selecionados);
   });
   // A ORDEM de exibição no carrossel (visual) pode continuar sorteada —
   // isso não muda QUAIS produtos foram escolhidos, só a ordem deles na tela.
   escolhidos=embaralharComSemente(escolhidos, aleatorioDoDia);
 }

 const cardsHTML=escolhidos.map(construirCardAchadinho).filter(Boolean);
 if(!cardsHTML.length) return;

 if(heroCarouselTimer) clearInterval(heroCarouselTimer);
 if(heroCarouselResizeHandler) window.removeEventListener('resize', heroCarouselResizeHandler);
 if(heroCarouselResizeObserver) heroCarouselResizeObserver.disconnect();

 box.innerHTML=`<div class="hero-carousel">
<div class="hero-carousel-viewport" id="heroCarouselViewport"><div class="hero-carousel-track" id="heroCarouselTrack"></div></div>
<div class="hero-carousel-dots" id="heroCarouselDots"></div>
</div>`;

 const viewport=document.getElementById('heroCarouselViewport');
 const track=document.getElementById('heroCarouselTrack');
 const dotsBox=document.getElementById('heroCarouselDots');
 const carouselEl=box.querySelector('.hero-carousel');
 const heroEl=document.querySelector('.hero');

 const total=cardsHTML.length;
 const cloneCount=Math.min(4,total);
 track.innerHTML=cardsHTML.join('')+cardsHTML.slice(0,cloneCount).join('');
 dotsBox.innerHTML=cardsHTML.map(()=>'<span></span>').join('');
 const dots=[...dotsBox.children];

 let index=0;
 const GAP=14;
 let isDragging=false;
 let dragStartX=0;
 let dragDeltaX=0;
 let dragCardW=0;

 function visivelPorVez(){
   const w=window.innerWidth;
   if(w<=700) return 1;
   if(w<=980) return 3;
   return 4;
 }

 function larguraDisponivel(){
   if(heroEl){
     const cs=getComputedStyle(heroEl);
     const padL=parseFloat(cs.paddingLeft)||0;
     const padR=parseFloat(cs.paddingRight)||0;
     const livre=heroEl.clientWidth-padL-padR;
     if(livre>0) return livre;
   }
   return carouselEl.parentElement.clientWidth||320;
 }

 function aplicarLargura(){
   const vc=visivelPorVez();
   const disponivel=larguraDisponivel();
   const largura=Math.min(980, disponivel);
   carouselEl.style.width=largura+'px';
   carouselEl.style.marginLeft=Math.max(0,(disponivel-largura)/2)+'px';
   const vpWidth=viewport.clientWidth||320;
   const cardW=Math.max(140,(vpWidth-GAP*(vc-1))/vc);
   [...track.children].forEach(card=>{ card.style.flex='0 0 '+cardW+'px'; });
   return cardW;
 }

 function irPara(i, comTransicao){
   const cardW=aplicarLargura();
   track.style.transition= comTransicao===false ? 'none' : 'transform .6s cubic-bezier(.4,0,.2,1)';
   track.style.transform=`translateX(-${i*(cardW+GAP)}px)`;
 }

 function atualizarDots(){
   const real=index % total;
   dots.forEach((d,i)=>d.classList.toggle('active', i===real));
 }

 irPara(0,false);
 atualizarDots();

 function avancar(){
   index++;
   irPara(index,true);
   atualizarDots();
   if(index>=total){
     track.addEventListener('transitionend', function resetar(){
       track.removeEventListener('transitionend', resetar);
       index=0;
       irPara(0,false);
     }, {once:true});
   }
 }

 function pausarAuto(){
   clearInterval(heroCarouselTimer);
 }
 function retomarAuto(){
   clearInterval(heroCarouselTimer);
   heroCarouselTimer=setInterval(avancar, 2800);
 }

 function voltar(){
   index=Math.max(0, index-1);
   irPara(index, true);
   atualizarDots();
 }

 retomarAuto();
 viewport.addEventListener('mouseenter', pausarAuto);
 viewport.addEventListener('mouseleave', retomarAuto);

 // --- Navegação manual: arraste com mouse e toque (PC, tablet e celular) ---
 viewport.style.cursor='grab';
 viewport.style.touchAction='pan-y';
 viewport.style.userSelect='none';

 function posX(e){
   return (e.touches && e.touches.length) ? e.touches[0].clientX : e.clientX;
 }

 function iniciarArraste(e){
   isDragging=true;
   dragStartX=posX(e);
   dragDeltaX=0;
   dragCardW=aplicarLargura();
   track.style.transition='none';
   viewport.style.cursor='grabbing';
   pausarAuto();
 }

 function moverArraste(e){
   if(!isDragging) return;
   dragDeltaX=posX(e)-dragStartX;
   const base=-(index*(dragCardW+GAP));
   track.style.transform=`translateX(${base+dragDeltaX}px)`;
   if(e.cancelable) e.preventDefault();
 }

 function finalizarArraste(){
   if(!isDragging) return;
   isDragging=false;
   viewport.style.cursor='grab';
   const limiar=dragCardW*0.18;
   if(dragDeltaX<=-limiar){
     avancar();
   }else if(dragDeltaX>=limiar){
     voltar();
   }else{
     irPara(index,true);
   }
   dragDeltaX=0;
   setTimeout(retomarAuto,1500);
 }

 viewport.addEventListener('mousedown', iniciarArraste);
 window.addEventListener('mousemove', moverArraste);
 window.addEventListener('mouseup', finalizarArraste);

 viewport.addEventListener('touchstart', iniciarArraste, {passive:true});
 viewport.addEventListener('touchmove', moverArraste, {passive:false});
 viewport.addEventListener('touchend', finalizarArraste);
 viewport.addEventListener('touchcancel', finalizarArraste);

 dots.forEach((d,i)=>{
   d.style.cursor='pointer';
   d.addEventListener('click', ()=>{
     pausarAuto();
     index=i;
     irPara(index,true);
     atualizarDots();
     setTimeout(retomarAuto,1500);
   });
 });

 let resizeTO;
 heroCarouselResizeHandler=()=>{
   clearTimeout(resizeTO);
   resizeTO=setTimeout(()=>irPara(index,false),150);
 };
 window.addEventListener('resize', heroCarouselResizeHandler);
 if(window.ResizeObserver){
   heroCarouselResizeObserver=new ResizeObserver(()=>{
     clearTimeout(resizeTO);
     resizeTO=setTimeout(()=>irPara(index,false),150);
   });
   heroCarouselResizeObserver.observe(heroEl||carouselEl.parentElement);
 }
}
document.addEventListener('DOMContentLoaded',()=>setTimeout(atualizarBannerAchadinhos,500));

// Em celulares/tablets não existe "passar o mouse", então um toque na imagem
// do produto abre a caixinha de detalhe; tocar em qualquer outro lugar fecha.
document.addEventListener('click', (evento) => {
  if (window.innerWidth <= 640) return; // no celular a caixinha fica desativada

  const imagemTocada = evento.target.closest('.product-image-wrap');
  const cardTocado = imagemTocada ? imagemTocada.closest('.product-card') : null;

  document.querySelectorAll('.product-card.detail-open').forEach(card => {
    if (card !== cardTocado) card.classList.remove('detail-open');
  });

  if (cardTocado) {
    evento.preventDefault();
    cardTocado.classList.toggle('detail-open');
  }
});
