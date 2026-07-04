import {
  db, auth,
  collection, doc, setDoc, getDoc, deleteDoc, onSnapshot,
  signInWithEmailAndPassword, onAuthStateChanged, signOut
} from "./firebase-config.js";

let adminProducts = [];

const $ = id => document.getElementById(id);

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function showToast(message) {
  $("toast").textContent = message;
  $("toast").classList.add("show");
  clearTimeout(window.toastTimer);
  window.toastTimer = setTimeout(() => $("toast").classList.remove("show"), 2200);
}

// Fica escutando o banco de dados (Firestore) em tempo real. Assim que
// qualquer alteração acontece (aqui ou em outro computador logado), a
// tabela é atualizada sozinha, sem precisar recarregar a página.
function escutarProdutos() {
  onSnapshot(collection(db, "produtos"), snapshot => {
    adminProducts = snapshot.docs.map(item => item.data());
    renderTable();
  }, erro => {
    console.error("Erro ao carregar produtos:", erro);
    showToast("Não foi possível carregar os produtos");
  });
}

function price(value) {
  if (value === null || value === undefined || value === "") return "—";
  return Number(value).toLocaleString("pt-BR", { style:"currency", currency:"BRL" });
}

function fillCategories() {
  const options = CATEGORIAS.map(category => `<option value="${category.id}">${category.nome}</option>`).join("");
  $("category").innerHTML = options;
  $("categoryFilter").innerHTML = `<option value="">Todas as categorias</option>${options}`;
}

function productFromForm() {
  const store = (priceId, linkId) => ({
    preco: $(priceId).value === "" ? null : Number($(priceId).value),
    link: $(linkId).value.trim()
  });
  return {
    id: $("editingId").value || `p_${Date.now()}_${Math.floor(Math.random() * 10000)}`,
    categoria: $("category").value,
    subcategoria: $("subcategory").value.trim(),
    marca: $("brand").value.trim(),
    nome: $("name").value.trim(),
    descricao: $("description").value.trim(),
    imagem: $("currentImage").value,
    magalu: store("magaluPrice", "magaluLink"),
    ml: store("mlPrice", "mlLink"),
    shopee: store("shopeePrice", "shopeeLink")
  };
}

function resetForm() {
  const categoriaSelecionada = $("category").value;
  $("productForm").reset();
  $("category").value = categoriaSelecionada;
  $("editingId").value = "";
  $("currentImage").value = "";
  $("imageStatus").textContent = "Escolha uma imagem do seu computador. Ela será enviada para a nuvem automaticamente.";
  const pv=$("imagePreview"); if(pv){pv.style.display="none";pv.removeAttribute("src");}
  $("formTitle").textContent = "Adicionar produto";
  $("saveButton").textContent = "Adicionar produto";
  $("cancelButton").classList.add("hidden");
}

function editProduct(id) {
  const product = adminProducts.find(item => item.id === id);
  if (!product) return;
  $("editingId").value = product.id;
  $("category").value = product.categoria;
  $("subcategory").value = product.subcategoria || "";
  $("brand").value = product.marca || "";
  $("name").value = product.nome || "";
  $("description").value = product.descricao || "";
  $("currentImage").value = product.imagem || "";
  $("imageFile").value = "";
  $("imageStatus").textContent = product.imagem
    ? "Imagem atual carregada. Escolha outra foto só se quiser trocar."
    : "Este produto ainda não possui imagem.";
  const pv=$("imagePreview");
  if(pv){
    if(product.imagem){pv.src=product.imagem;pv.style.display="block";}
    else{pv.style.display="none";pv.removeAttribute("src");}
  }
  $("magaluPrice").value = product.magalu?.preco ?? "";
  $("magaluLink").value = product.magalu?.link || "";
  $("mlPrice").value = product.ml?.preco ?? "";
  $("mlLink").value = product.ml?.link || "";
  $("shopeePrice").value = product.shopee?.preco ?? "";
  $("shopeeLink").value = product.shopee?.link || "";
  $("formTitle").textContent = "Editar produto";
  $("saveButton").textContent = "Salvar alterações";
  $("cancelButton").classList.remove("hidden");
  window.scrollTo({ top:0, behavior:"smooth" });
}

async function deleteProduct(id) {
  const product = adminProducts.find(item => item.id === id);
  if (!product || !confirm(`Excluir "${product.nome}"?`)) return;
  try {
    await deleteDoc(doc(db, "produtos", id));
    showToast("Produto excluído");
  } catch (error) {
    console.error(error);
    showToast("Não foi possível excluir. Verifique se você está logado.");
  }
}

function renderTable() {
  const search = $("search").value.trim().toLocaleLowerCase("pt-BR");
  const category = $("categoryFilter").value;
  const list = adminProducts.filter(product => {
    const text = `${product.marca || ""} ${product.nome || ""} ${product.subcategoria || ""}`.toLocaleLowerCase("pt-BR");
    return (!category || product.categoria === category) && text.includes(search);
  }).sort((a,b)=>{
    const cat=(a.categoria||"").localeCompare((b.categoria||""),"pt-BR",{sensitivity:"base"});
    if(cat) return cat;
    const sub=(a.subcategoria||"").localeCompare((b.subcategoria||""),"pt-BR",{sensitivity:"base"});
    if(sub) return sub;
    const marca=(a.marca||"").localeCompare((b.marca||""),"pt-BR",{sensitivity:"base"});
    if(marca) return marca;
    return (a.nome||"").localeCompare((b.nome||""),"pt-BR",{sensitivity:"base"});
  });
  $("count").textContent = `${list.length} ${list.length === 1 ? "produto" : "produtos"}`;
  $("tableBody").innerHTML = list.length ? list.map(product => {
    const categoryName = CATEGORIAS.find(item => item.id === product.categoria)?.nome || product.categoria;
    const thumb = product.imagem
      ? `<img class="thumb" src="${product.imagem}" alt="" onerror="this.style.opacity=.2">`
      : `<div class="thumb"></div>`;
    return `<tr>
      <td>${thumb}</td>
      <td>${categoryName}<br><small>${product.subcategoria || ""}</small></td>
      <td class="product-title"><strong>${product.marca || ""}</strong><span>${product.nome || ""}</span></td>
      <td>${price(product.magalu?.preco)}</td>
      <td>${price(product.ml?.preco)}</td>
      <td>${price(product.shopee?.preco)}</td>
      <td><div class="row-actions">
        <button class="btn" data-edit="${product.id}">Editar</button>
        <button class="btn btn-danger" data-delete="${product.id}">Excluir</button>
      </div></td>
    </tr>`;
  }).join("") : `<tr><td colspan="7" style="padding:30px;text-align:left;color:#69758a">Nenhum produto encontrado.</td></tr>`;

  $("tableBody").querySelectorAll("[data-edit]").forEach(button =>
    button.addEventListener("click", () => editProduct(button.dataset.edit)));
  $("tableBody").querySelectorAll("[data-delete]").forEach(button =>
    button.addEventListener("click", () => deleteProduct(button.dataset.delete)));
}

function download(name, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = name;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  URL.revokeObjectURL(url);
}

// Redimensiona e comprime a foto no navegador, e devolve como base64
// (guardado direto dentro do produto no Firestore). Assim não precisamos
// do Firebase Storage, que exige plano pago.
function enviarImagem(file) {
  return new Promise((resolve, reject) => {
    const leitor = new FileReader();
    leitor.onerror = () => reject(new Error("Não foi possível ler a imagem."));
    leitor.onload = () => {
      const img = new Image();
      img.onerror = () => reject(new Error("Arquivo de imagem inválido."));
      img.onload = () => {
        const larguraMax = 700;
        const escala = Math.min(1, larguraMax / img.width);
        const largura = Math.round(img.width * escala);
        const altura = Math.round(img.height * escala);
        const canvas = document.createElement("canvas");
        canvas.width = largura;
        canvas.height = altura;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0, largura, altura);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      img.src = leitor.result;
    };
    leitor.readAsDataURL(file);
  });
}

function exportBackup() {
  const date = new Date().toISOString().slice(0, 10);
  download(`ofertasgr-backup-${date}.json`, JSON.stringify(adminProducts, null, 2), "application/json");
  showToast("Backup baixado");
}

function importFile(file) {
  const reader = new FileReader();
  reader.onload = () => {
    try {
      let text = reader.result;
      let products;
      if (file.name.toLowerCase().endsWith(".json")) {
        products = JSON.parse(text);
      } else {
        const match = text.match(/const\s+PRODUTOS_INICIAIS\s*=\s*(\[[\s\S]*\])\s*;?\s*$/);
        if (!match) throw new Error();
        products = JSON.parse(match[1]);
      }
      if (!Array.isArray(products)) throw new Error();
      if (!confirm(`Importar ${products.length} produtos para a nuvem? Produtos com o mesmo ID serão substituídos.`)) return;
      migrarProdutosParaNuvem(products);
    } catch {
      alert("Não foi possível importar esse arquivo.");
    }
  };
  reader.readAsText(file, "UTF-8");
}

async function migrarProdutosParaNuvem(lista) {
  showToast(`Enviando ${lista.length} produtos para a nuvem...`);
  try {
    for (const produto of lista) {
      await setDoc(doc(db, "produtos", produto.id), produto);
    }
    showToast("Produtos migrados com sucesso!");
  } catch (error) {
    console.error(error);
    alert("Erro ao migrar produtos. Confira se você está logado e se as regras do Firestore permitem escrita.");
  }
}

function login() {
  const email = $("loginEmail").value.trim();
  const senha = $("loginPassword").value;
  $("loginError").textContent = "";
  signInWithEmailAndPassword(auth, email, senha)
    .catch(() => {
      $("loginError").textContent = "E-mail ou senha incorretos.";
    });
}

document.addEventListener("DOMContentLoaded", () => {
  fillCategories();
  escutarProdutos();

  onAuthStateChanged(auth, user => {
    if (user) {
      $("loginScreen").classList.add("hidden");
      $("adminScreen").classList.remove("hidden");
    } else {
      $("loginScreen").classList.remove("hidden");
      $("adminScreen").classList.add("hidden");
    }
  });

  $("loginButton").addEventListener("click", login);
  $("loginPassword").addEventListener("keydown", event => {
    if (event.key === "Enter") login();
  });
  $("logoutButton").addEventListener("click", () => signOut(auth));

  $("productForm").addEventListener("submit", event => {
    event.preventDefault();
    (async () => {
      const originalText = $("saveButton").textContent;
      try {
        $("saveButton").disabled = true;
        $("saveButton").textContent = "Salvando...";
        const arquivo = $("imageFile").files[0];
        const product = productFromForm();
        if (arquivo) {
          product.imagem = await enviarImagem(arquivo);
        }
        const isEdicao = !!$("editingId").value;
        await setDoc(doc(db, "produtos", product.id), product);
        resetForm();
        showToast(isEdicao ? "Produto atualizado" : "Produto adicionado");
      } catch (error) {
        console.error(error);
        alert("Não foi possível salvar o produto. Verifique sua conexão e se está logado.");
      } finally {
        $("saveButton").disabled = false;
        $("saveButton").textContent = originalText;
      }
    })();
  });
  $("imageFile").addEventListener("change",()=>{const f=$("imageFile").files[0];const pv=$("imagePreview");if(f&&pv){pv.src=URL.createObjectURL(f);pv.style.display="block";}});
  $("cancelButton").addEventListener("click", resetForm);
  $("search").addEventListener("input", renderTable);
  $("categoryFilter").addEventListener("change", renderTable);
  $("backupButton").addEventListener("click", exportBackup);
  $("importButton").addEventListener("click", () => $("importFile").click());
  $("importFile").addEventListener("change", event => {
    if (event.target.files[0]) importFile(event.target.files[0]);
    event.target.value = "";
  });
  $("previewButton").addEventListener("click", () => window.open("index.html", "_blank"));
  $("resetButton").addEventListener("click", () => {
    if (typeof PRODUTOS_INICIAIS === "undefined") {
      alert("Não encontrei a lista PRODUTOS_INICIAIS no data.js.");
      return;
    }
    if (!confirm(`Enviar os ${PRODUTOS_INICIAIS.length} produtos do data.js para a nuvem? Isso substitui produtos com o mesmo ID.`)) return;
    migrarProdutosParaNuvem(clone(PRODUTOS_INICIAIS));
  });
});


const SITE_CONFIG_KEY="ofertasgr_site_config_v1";

document.addEventListener("DOMContentLoaded",()=>{
 const btn=document.getElementById("saveBrandSettings");
 if(!btn) return;

 const cfg=JSON.parse(localStorage.getItem(SITE_CONFIG_KEY)||"{}");
 if(cfg.nameSize) document.getElementById("brandNameSize").value=cfg.nameSize;
 if(cfg.roleSize) document.getElementById("brandRoleSize").value=cfg.roleSize;

 btn.addEventListener("click",()=>{
   const file=document.getElementById("siteLogoFile").files[0];
   const save=(logo)=>{
      const data={
       logo:logo||cfg.logo||"",
       nameSize:document.getElementById("brandNameSize").value,
       roleSize:document.getElementById("brandRoleSize").value
      };
      localStorage.setItem(SITE_CONFIG_KEY,JSON.stringify(data));
      alert("Personalização salva!");
   };
   if(file){
      const r=new FileReader();
      r.onload=e=>save(e.target.result);
      r.readAsDataURL(file);
   }else{
      save();
   }
 });
});




document.addEventListener("DOMContentLoaded",async ()=>{
 const panel=document.getElementById("categoryImagesPanel");
 const saveBtn=document.getElementById("saveCategoryImages");

 if(!panel || typeof CATEGORIAS==="undefined") return;

 // Carrega as imagens já salvas no Firestore (visíveis pra todos os
 // visitantes do site, não só nesse navegador).
 const salvas={};
 try{
   const snap=await new Promise((resolve,reject)=>{
     const unsub=onSnapshot(collection(db,"categoriaImagens"), s=>{ unsub(); resolve(s); }, reject);
   });
   snap.docs.forEach(item=>{
     const dados=item.data();
     if(dados && dados.imagem) salvas[item.id]=dados.imagem;
   });
 }catch(erro){
   console.error("Não foi possível carregar as imagens das categorias salvas:", erro);
 }

 const pendentes={};

 panel.innerHTML=CATEGORIAS.map(c=>`
   <div style="border:1px solid #d8e3f7;padding:10px;border-radius:10px;margin-bottom:10px">
      <label style="display:block;font-weight:bold;margin-bottom:6px">${c.nome}</label>
      <input type="file" data-cat="${c.id}" accept="image/*">
      <div style="margin-top:8px">
        <img id="preview-${c.id}" src="${salvas[c.id]||""}" style="max-width:120px;max-height:80px;display:${salvas[c.id]?"block":"none"}">
      </div>
   </div>`).join("");

 panel.querySelectorAll("input[type=file]").forEach(inp=>{
   inp.addEventListener("change",async e=>{
      const f=e.target.files[0];
      if(!f) return;

      try{
        const imagemComprimida = await enviarImagem(f);
        pendentes[e.target.dataset.cat]=imagemComprimida;
        const p=document.getElementById("preview-"+e.target.dataset.cat);
        p.src=imagemComprimida;
        p.style.display="block";
      }catch(erro){
        console.error("Erro ao processar imagem da categoria:", erro);
        alert("Não foi possível processar essa imagem. Tente outro arquivo.");
      }
   });
 });

 if(saveBtn){
   saveBtn.addEventListener("click",async ()=>{
      const categoriasPendentes=Object.keys(pendentes);
      if(categoriasPendentes.length===0){
        alert("Nenhuma imagem nova selecionada.");
        return;
      }
      saveBtn.disabled=true;
      saveBtn.textContent="Salvando...";
      try{
        await Promise.all(categoriasPendentes.map(catId =>
          setDoc(doc(db,"categoriaImagens",catId), { imagem: pendentes[catId] })
        ));
        alert("Imagens das categorias salvas com sucesso! Já aparecem pra todos os visitantes do site.");
      }catch(erro){
        console.error("Erro ao salvar imagens das categorias:", erro);
        alert("Não foi possível salvar as imagens. Tenta de novo em instantes.");
      }finally{
        saveBtn.disabled=false;
        saveBtn.textContent="Salvar Imagens das Categorias";
      }
   });
 }
});
