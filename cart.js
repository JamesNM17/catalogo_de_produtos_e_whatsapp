let cart = readCart();
const cartItems = document.getElementById("cart-items");
const deliverySelect = document.getElementById("delivery");
const addressInput = document.getElementById("address");
const addressGroup = document.getElementById("address-group");
const checkoutForm = document.getElementById("checkout-form");
const checkoutButton = document.getElementById("checkout-button");

function renderCart() {
  cart = readCart();
  const entries = Array.from(cart.entries());
  const count = cartItemCount(cart);
  const subtotal = cartSubtotal(cart);

  document.getElementById("cart-count").textContent = count;
  document.getElementById("subtotal").textContent = money(subtotal);
  document.getElementById("total").textContent = money(subtotal);
  checkoutButton.disabled = count === 0;

  if (!entries.length) {
    cartItems.innerHTML = '<div class="cart-empty">Seu carrinho está vazio.<br>Adicione um produto para começar.</div>';
    return;
  }

  cartItems.innerHTML = entries.map(([id, quantity]) => {
    const product = getStoreProduct(id);
    return `
      <div class="cart-item">
        <img class="cart-thumb" src="${product.image}" alt="" loading="lazy" onerror="this.style.visibility='hidden'">
        <div>
          <div class="cart-item-name">${product.name}</div>
          <div class="cart-item-price">${money(product.price)} cada · Total: <strong>${money(product.price * quantity)}</strong></div>
          <div class="cart-item-actions">
            <div class="quantity" aria-label="Quantidade de ${product.name}">
              <button type="button" data-change="${id}" data-amount="-1" aria-label="Diminuir quantidade de ${product.name}">−</button>
              <span>${quantity}</span>
              <button type="button" data-change="${id}" data-amount="1" aria-label="Aumentar quantidade de ${product.name}">+</button>
            </div>
            <button type="button" class="remove-button" data-remove="${id}">Remover</button>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

cartItems.addEventListener("click", event => {
  const changeButton = event.target.closest("[data-change]");
  const removeButton = event.target.closest("[data-remove]");
  const currentCart = readCart();

  if (changeButton) {
    const id = Number(changeButton.dataset.change);
    const next = (currentCart.get(id) || 0) + Number(changeButton.dataset.amount);
    if (next <= 0) currentCart.delete(id);
    else currentCart.set(id, next);
    writeCart(currentCart);
    renderCart();
  }

  if (removeButton) {
    currentCart.delete(Number(removeButton.dataset.remove));
    writeCart(currentCart);
    renderCart();
  }
});

function updateAddressRequirement() {
  const needsAddress = deliverySelect.value === "Entrega";
  addressGroup.hidden = !needsAddress;
  addressInput.required = needsAddress;
  if (!needsAddress) addressInput.value = "";
}

deliverySelect.addEventListener("change", updateAddressRequirement);
window.addEventListener("vitrine-cart-updated", renderCart);
window.addEventListener("vitrine-cart-external-update", renderCart);

checkoutForm.addEventListener("submit", event => {
  event.preventDefault();
  cart = readCart();
  if (!cart.size) {
    showToast("Adicione pelo menos um produto ao carrinho.");
    return;
  }

  // Número de exemplo bloqueado para evitar o envio acidental de pedidos.
  const phone = WHATSAPP_NUMBER.replace(/\D/g, "");
  if (phone.length < 10 || phone.length > 15 || phone === "5511999999999") {
    alert("Configure o número de WhatsApp da sua loja em store.js, na variável WHATSAPP_NUMBER.");
    return;
  }

  const name = document.getElementById("customer-name").value.trim();
  const delivery = deliverySelect.value;
  const address = addressInput.value.trim();
  const payment = document.getElementById("payment").value;
  const notes = document.getElementById("notes").value.trim();

  if (!name || (delivery === "Entrega" && !address)) {
    checkoutForm.reportValidity();
    return;
  }

  const entries = Array.from(cart.entries());
  const subtotal = cartSubtotal(cart);
  const lines = entries.map(([id, quantity]) => {
    const product = getStoreProduct(id);
    return `• ${product.name} — ${quantity} x ${money(product.price)} = ${money(product.price * quantity)}`;
  });

  const message = [
    "🛍️ *NOVO PEDIDO — VITRINE STORE*",
    "",
    `*Cliente:* ${name}`,
    "",
    "*Produtos:*",
    ...lines,
    "",
    `*Subtotal dos produtos:* ${money(subtotal)}`,
    "*Frete:* a combinar",
    `*Total dos produtos:* ${money(subtotal)}`,
    "",
    `*Recebimento:* ${delivery}`,
    ...(delivery === "Entrega" ? [`*Endereço:* ${address}`] : []),
    `*Pagamento desejado:* ${payment}`,
    ...(notes ? ["", `*Observações:* ${notes}`] : []),
    "",
    "Olá! Gostaria de confirmar a disponibilidade e finalizar este pedido."
  ].join("\n");

  const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
  window.location.href = whatsappUrl;
});

updateAddressRequirement();
renderCart();
