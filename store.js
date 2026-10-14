// Dados e funções compartilhados pelas páginas da Vitrine Store.
// Personalize o número abaixo com código do país + DDD + número, sem símbolos.
const WHATSAPP_NUMBER = "5511932507655";
const CART_STORAGE_KEY = "vitrine-store-cart-v1";

const STORE_PRODUCTS = [
  { id: 1, name: "Tênis Urban", description: "Conforto para acompanhar sua rotina.", price: 189.90, tag: "Mais vendido", image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=85", details: "Um tênis versátil para acompanhar você no dia a dia, com visual urbano e foco no conforto." },
  { id: 2, name: "Fone Premium", description: "Som envolvente para o dia a dia.", price: 129.90, tag: "Destaque", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=85", details: "Curta suas músicas, podcasts e chamadas com um design moderno que combina com sua rotina." },
  { id: 3, name: "Relógio Classic", description: "Um visual atemporal para qualquer ocasião.", price: 159.90, tag: "Novo", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=85", details: "Um acessório elegante e fácil de combinar, ideal para looks casuais ou ocasiões especiais." },
  { id: 4, name: "Mochila Everyday", description: "Praticidade para trabalho, estudo e viagens.", price: 119.90, tag: "Versátil", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=85", details: "Uma mochila prática para organizar seus itens e acompanhar sua rotina de trabalho, estudo ou viagem." },
  { id: 5, name: "Óculos Solar", description: "Um toque de estilo para os dias de sol.", price: 79.90, tag: "Estilo", image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=85", details: "Complete seu visual com um acessório marcante para passeios e dias ensolarados." },
  { id: 6, name: "Perfume Essencial", description: "Fragrância marcante para todos os momentos.", price: 99.90, tag: "Favorito", image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=85", details: "Uma fragrância para deixar sua presença marcante, seja no cotidiano ou em momentos especiais." }
];

function money(value) {
  return Number(value).toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

function getStoreProduct(id) {
  return STORE_PRODUCTS.find(product => product.id === Number(id));
}

function readCart() {
  try {
    const stored = JSON.parse(localStorage.getItem(CART_STORAGE_KEY) || "{}");
    const cart = new Map();
    for (const [rawId, rawQuantity] of Object.entries(stored)) {
      const id = Number(rawId);
      const quantity = Number(rawQuantity);
      if (getStoreProduct(id) && Number.isInteger(quantity) && quantity > 0) cart.set(id, quantity);
    }
    return cart;
  } catch (error) {
    return new Map();
  }
}

function writeCart(cart) {
  const data = Object.fromEntries(cart.entries());
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(data));
  updateCartBadges();
  window.dispatchEvent(new CustomEvent("vitrine-cart-updated"));
}

function cartItemCount(cart = readCart()) {
  return Array.from(cart.values()).reduce((sum, quantity) => sum + quantity, 0);
}

function cartSubtotal(cart = readCart()) {
  return Array.from(cart.entries()).reduce((sum, [id, quantity]) => {
    const product = getStoreProduct(id);
    return sum + (product ? product.price * quantity : 0);
  }, 0);
}

function updateCartBadges() {
  const count = cartItemCount();
  document.querySelectorAll("[data-cart-count]").forEach(node => { node.textContent = count; });
}

function showToast(message) {
  const toast = document.getElementById("toast");
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  window.clearTimeout(showToast.timeout);
  showToast.timeout = window.setTimeout(() => toast.classList.remove("show"), 2200);
}

function addProductToCart(id) {
  const product = getStoreProduct(id);
  if (!product) return;
  const cart = readCart();
  cart.set(product.id, (cart.get(product.id) || 0) + 1);
  writeCart(cart);
  showToast(`${product.name} adicionado ao carrinho`);
}

function setCurrentYear() {
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();
}

window.addEventListener("storage", event => {
  if (event.key === CART_STORAGE_KEY) {
    updateCartBadges();
    window.dispatchEvent(new CustomEvent("vitrine-cart-external-update"));
  }
});

document.addEventListener("DOMContentLoaded", () => {
  updateCartBadges();
  setCurrentYear();
});
