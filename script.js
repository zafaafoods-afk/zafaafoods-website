const WHATSAPP_NUMBER = "919971099947";
const CART_KEY = "zafaaFoodsFullMenuCart";
const menu = window.ZAFAA_MENU || [];
let cart = JSON.parse(localStorage.getItem(CART_KEY) || "{}");
let activeCategory = "All";
let searchTerm = "";

const cardsEl = document.getElementById("cards");
const categoryRow = document.getElementById("category-row");
const resultsEl = document.getElementById("menu-results");
const searchEl = document.getElementById("menu-search");

const categories = ["All", ...new Set(menu.map(item => item.category))];

function saveCart(){ localStorage.setItem(CART_KEY, JSON.stringify(cart)); }
function cartEntries(){ return Object.values(cart); }
function totalQty(){ return cartEntries().reduce((s,i)=>s+i.quantity,0); }
function totalAmount(){ return cartEntries().reduce((s,i)=>s+i.price*i.quantity,0); }

function renderCategories(){
  categoryRow.innerHTML = categories.map(category => `
    <button class="category-chip ${category === activeCategory ? "active" : ""}" data-category="${category}">
      ${category}
    </button>`).join("");
}

function placeholderLabel(item){
  const icon = item.dietary === "egg" ? "🥚" :
    item.category === "Beverages" ? "🥤" :
    item.category === "Sweet" ? "🍬" :
    item.category === "Meals Combos" ? "🍱" :
    item.category === "Breakfast" ? "🍳" : "🍛";
  return `${icon}<br>${item.name}`;
}

function filteredMenu(){
  const q = searchTerm.toLowerCase();
  return menu.filter(item => {
    const categoryOk = activeCategory === "All" || item.category === activeCategory;
    const text = `${item.name} ${item.category} ${item.subcategory} ${item.description} ${item.tags}`.toLowerCase();
    return categoryOk && (!q || text.includes(q));
  });
}

function renderMenu(){
  const list = filteredMenu();
  resultsEl.textContent = `${list.length} item${list.length === 1 ? "" : "s"} found`;

  cardsEl.innerHTML = list.map(item => {
    const image = item.image ? `<img src="${item.image}" alt="${item.name}" loading="lazy" onload="this.parentElement.classList.add('has-image')" onerror="this.remove()">` : "";
    const inCart = cart[item.item_id]?.quantity || 0;
    return `
    <article class="card">
      <div class="image-wrap">
        ${image}
        <div class="image-placeholder">${placeholderLabel(item)}</div>
      </div>
      <div class="card-content">
        <div class="card-topline">
          <span class="diet-badge ${item.dietary}">${item.dietary === "egg" ? "● Egg" : "● Veg"}</span>
          <span class="price">₹${item.price}</span>
        </div>
        <span class="category-label">${item.category}</span>
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <div class="item-meta"><span>Item ${item.item_id}</span><span>GST ${item.gst}%</span></div>
        <button class="order-btn ${inCart ? "added" : ""}" data-add="${item.item_id}" type="button">
          ${inCart ? `IN CART · ${inCart}` : "ADD ＋"}
        </button>
      </div>
    </article>`;
  }).join("");
}

categoryRow.addEventListener("click", event => {
  const btn = event.target.closest("[data-category]");
  if(!btn) return;
  activeCategory = btn.dataset.category;
  renderCategories();
  renderMenu();
});

searchEl.addEventListener("input", () => {
  searchTerm = searchEl.value.trim();
  renderMenu();
});

cardsEl.addEventListener("click", event => {
  const btn = event.target.closest("[data-add]");
  if(!btn) return;
  const item = menu.find(i => i.item_id === btn.dataset.add);
  if(!item) return;
  if(cart[item.item_id]) cart[item.item_id].quantity += 1;
  else cart[item.item_id] = {id:item.item_id,name:item.name,price:item.price,quantity:1};
  saveCart(); renderMenu(); renderCart(); openCart();
});

const cartDrawer = document.getElementById("cart-drawer");
const backdrop = document.getElementById("cart-backdrop");
const cartItemsEl = document.getElementById("cart-items");
const cartEmpty = document.getElementById("cart-empty");
const cartCount = document.getElementById("cart-count");
const totalItemsEl = document.getElementById("cart-total-items");
const totalEl = document.getElementById("cart-total");
const checkoutBtn = document.getElementById("checkout-btn");
const clearBtn = document.getElementById("clear-cart");

function openCart(){ cartDrawer.classList.add("open"); backdrop.hidden=false; cartDrawer.setAttribute("aria-hidden","false"); }
function closeCart(){ cartDrawer.classList.remove("open"); backdrop.hidden=true; cartDrawer.setAttribute("aria-hidden","true"); }

document.querySelectorAll(".open-cart").forEach(btn => btn.addEventListener("click", openCart));
document.getElementById("cart-close").addEventListener("click", closeCart);
backdrop.addEventListener("click", closeCart);

function renderCart(){
  const entries = cartEntries();
  const qty = totalQty();
  cartCount.textContent = qty;
  totalItemsEl.textContent = qty;
  totalEl.textContent = `₹${totalAmount()}`;
  cartEmpty.hidden = entries.length > 0;
  checkoutBtn.disabled = entries.length === 0;
  clearBtn.disabled = entries.length === 0;

  cartItemsEl.innerHTML = entries.map(item => `
    <div class="cart-item">
      <div><h4>${item.name}</h4><p>₹${item.price} × ${item.quantity} = ₹${item.price*item.quantity}</p><button class="remove-item" data-remove="${item.id}" type="button">Remove</button></div>
      <div class="quantity-controls"><button data-change="-1" data-id="${item.id}" type="button">−</button><strong>${item.quantity}</strong><button data-change="1" data-id="${item.id}" type="button">＋</button></div>
    </div>`).join("");
}

cartItemsEl.addEventListener("click", event => {
  const change = event.target.closest("[data-change]");
  const remove = event.target.closest("[data-remove]");
  if(change){
    const item = cart[change.dataset.id];
    if(item){ item.quantity += Number(change.dataset.change); if(item.quantity <= 0) delete cart[item.id]; }
  }
  if(remove) delete cart[remove.dataset.remove];
  saveCart(); renderCart(); renderMenu();
});

clearBtn.addEventListener("click", () => { cart = {}; saveCart(); renderCart(); renderMenu(); });

checkoutBtn.addEventListener("click", () => {
  if(!cartEntries().length) return;
  const name = document.getElementById("customer-name").value.trim();
  const phone = document.getElementById("customer-phone").value.trim();
  const address = document.getElementById("customer-address").value.trim();
  const landmark = document.getElementById("customer-landmark").value.trim();
  const payment = document.getElementById("payment-method").value;
  if(!name || !phone || !address){ alert("Please enter customer name, phone number and delivery address."); return; }

  const lines = cartEntries().map(i => `• ${i.name} x ${i.quantity} = ₹${i.price*i.quantity}`);
  const message = [
    "Hi Zafaa Foods,","","I would like to place this order:",...lines,"",
    `Estimated Total: ₹${totalAmount()}`,"",
    `Customer Name: ${name}`,`Phone: ${phone}`,`Delivery Address: ${address}`,
    `Landmark: ${landmark || "-"}`,`Payment: ${payment}`,"",
    "Please confirm availability, delivery charges and final total."
  ].join("\n");
  window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,"_blank","noopener");
});

const toggle=document.querySelector(".menu-toggle"), nav=document.querySelector(".main-nav");
toggle?.addEventListener("click",()=>{const open=nav.classList.toggle("open");toggle.setAttribute("aria-expanded",String(open));});
nav?.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>nav.classList.remove("open")));
document.querySelectorAll(".faq-list details").forEach(item=>item.addEventListener("toggle",()=>{if(item.open)document.querySelectorAll(".faq-list details").forEach(other=>{if(other!==item)other.open=false;});}));

renderCategories();
renderMenu();
renderCart();
