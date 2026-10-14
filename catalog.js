const productList = document.getElementById("product-list");
const searchInput = document.getElementById("search");

function renderProducts(filter = "") {
  const term = filter.trim().toLocaleLowerCase("pt-BR");
  const filtered = STORE_PRODUCTS.filter(product =>
    `${product.name} ${product.description} ${product.tag}`.toLocaleLowerCase("pt-BR").includes(term)
  );

  if (!filtered.length) {
    productList.innerHTML = '<div class="empty-search">Nenhum produto encontrado. Tente outra busca.</div>';
    return;
  }

  productList.innerHTML = filtered.map(product => `
    <article class="product-card">
      <a class="product-card-link" href="produto.html?id=${product.id}" aria-label="Ver detalhes de ${product.name}">
        <div class="product-image">
          <img src="${product.image}" alt="${product.name}" loading="lazy" onerror="this.style.display='none'; this.parentElement.style.background='linear-gradient(135deg,#e6f7ed,#f1ecff)';">
          <span class="product-tag">${product.tag}</span>
        </div>
        <div class="product-info">
          <h3>${product.name}</h3>
          <p class="product-description">${product.description}</p>
          <div class="product-bottom"><span class="price">${money(product.price)}</span><span aria-hidden="true">Ver detalhes →</span></div>
        </div>
      </a>
      <div class="product-add-wrap">
        <button class="add-button" type="button" data-add="${product.id}" aria-label="Adicionar ${product.name} ao carrinho">＋ Adicionar ao carrinho</button>
      </div>
    </article>
  `).join("");
}

productList.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (button) addProductToCart(Number(button.dataset.add));
});
searchInput.addEventListener("input", event => renderProducts(event.target.value));
renderProducts();
