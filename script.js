const cartButton = document.getElementById("cart-button");
const sidebar = document.getElementById("sidebar");
const productButtons = document.querySelectorAll('.add-to-cart');
const cartContainer = document.getElementById("cart-container");
const totalPriceDisplay = document.getElementById("total-price");

cartButton.addEventListener("click", () => {
  sidebar.classList.add("show");
});

document.addEventListener("click", (e) => {
  if (!sidebar.contains(e.target) && !cartButton.contains(e.target) && sidebar.classList.contains("show")) {
    sidebar.classList.remove("show");
  }
});

productButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    let productCard = btn.closest('.col');
    let image = productCard.dataset.image;
    let title = productCard.dataset.title;
    let price = parseFloat(productCard.dataset.price);

    addProductToCart({ image, title, price, quantity: 1 });
  });
});

function addProductToCart(product) {
  const existingItem = document.querySelector(`.cart-item[data-title="${product.title}"]`);
  
  if (existingItem) {
    const quantityEl = existingItem.querySelector(".quantity-display");
    const priceEl = existingItem.querySelector(".price-tag");
    let count = parseInt(quantityEl.textContent);
    count++;
    quantityEl.textContent = count;
    priceEl.textContent = `$${(product.price * count).toFixed(2)}`;
  } else {
    let div = document.createElement("div");
    div.classList.add("cart-item");
    div.setAttribute("data-title", product.title);

    div.innerHTML = `
        <img src="${product.image}" alt="${product.title}">
        <div class="cart-item-details">
            <h4>${product.title}</h4>
            <span class="price-tag" data-price="${product.price}">$${product.price.toFixed(2)}</span>
            <div class="cart-item-controls">
                <i class="fa-solid fa-minus minus-btn"></i>
                <span class="quantity-display">${product.quantity}</span>
                <i class="fa-solid fa-plus plus-btn"></i>
            </div>
        </div>
        <i class="fa-solid fa-xmark remove-item"></i>
    `;
    cartContainer.appendChild(div);
  }

  updateTotal();
  saveCart();
}

cartContainer.addEventListener("click", (e) => {
  const item = e.target.closest(".cart-item");
  if (!item) return;

  const productPrice = parseFloat(item.querySelector(".price-tag").dataset.price);
  let quantityEl = item.querySelector(".quantity-display");
  let priceTag = item.querySelector(".price-tag");
  let count = parseInt(quantityEl.textContent);
  
  if (e.target.classList.contains("plus-btn")) {
    count++;
    quantityEl.textContent = count;
    priceTag.textContent = `$${(productPrice * count).toFixed(2)}`;
  }

  if (e.target.classList.contains("minus-btn")) {
    if (count > 1) {
      count--;
      quantityEl.textContent = count;
      priceTag.textContent = `$${(productPrice * count).toFixed(2)}`;
    }
  }

  
  if (e.target.classList.contains("remove-item")) {
    item.remove();
  }

  updateTotal();
  saveCart();
});

function updateTotal() {
  let total = 0;
  document.querySelectorAll(".cart-item").forEach(item => {
    const price = parseFloat(item.querySelector(".price-tag").dataset.price);
    const quantity = parseInt(item.querySelector(".quantity-display").textContent);
    total += price * quantity;
  });
  totalPriceDisplay.textContent = `Total: $${total.toFixed(2)}`;
}

function saveCart() {
  const cartData = [];
  document.querySelectorAll(".cart-item").forEach(item => {
    const title = item.getAttribute("data-title");
    const image = item.querySelector("img").src;
    const price = parseFloat(item.querySelector(".price-tag").dataset.price);
    const quantity = parseInt(item.querySelector(".quantity-display").textContent);
    cartData.push({ title, image, price, quantity });
  });
  localStorage.setItem("cart", JSON.stringify(cartData));
}

function loadCart() {
  const cartData = JSON.parse(localStorage.getItem("cart")) || [];
  cartData.forEach(item => {
    const div = document.createElement("div");
    div.classList.add("cart-item");
    div.setAttribute("data-title", item.title);

    div.innerHTML = `
      <img src="${item.image}" alt="${item.title}">
      <div class="cart-item-details">
        <h4>${item.title}</h4>
        <span class="price-tag" data-price="${item.price}">$${(item.price * item.quantity).toFixed(2)}</span>
        <div class="cart-item-controls">
          <i class="fa-solid fa-minus minus-btn"></i>
          <span class="quantity-display">${item.quantity}</span>
          <i class="fa-solid fa-plus plus-btn"></i>
        </div>
      </div>
      <i class="fa-solid fa-xmark remove-item"></i>
    `;
    cartContainer.appendChild(div);
  });
  updateTotal();
}


document.addEventListener("DOMContentLoaded", loadCart);