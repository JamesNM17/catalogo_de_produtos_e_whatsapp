const params = new URLSearchParams(window.location.search);
const product = getStoreProduct(params.get("id"));
const detail = document.getElementById("product-detail");
const notFound = document.getElementById("not-found");

if (!product) {
  detail.hidden = true;
  notFound.hidden = false;
  document.title = "Produto não encontrado | Vitrine Store";
} else {
  document.title = `${product.name} | Vitrine Store`;
  document.getElementById("breadcrumb-product").textContent = product.name;
  document.getElementById("detail-image").src = product.image;
  document.getElementById("detail-image").alt = product.name;
  document.getElementById("detail-image").addEventListener("error", event => {
    event.currentTarget.style.visibility = "hidden";
    event.currentTarget.parentElement.style.background = "linear-gradient(135deg,#e6f7ed,#f1ecff)";
  });
  document.getElementById("detail-tag").textContent = product.tag;
  document.getElementById("detail-name").textContent = product.name;
  document.getElementById("detail-description").textContent = `${product.description} ${product.details}`;
  document.getElementById("detail-price").textContent = money(product.price);
  document.getElementById("add-to-cart").addEventListener("click", () => addProductToCart(product.id));
}
