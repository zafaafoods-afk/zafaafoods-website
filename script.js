const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('.main-nav');
if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}));}
const chips=document.querySelectorAll('.category-chip');const cards=document.querySelectorAll('.card');
chips.forEach(chip=>chip.addEventListener('click',()=>{const f=chip.dataset.filter;chips.forEach(c=>c.classList.remove('active'));chip.classList.add('active');cards.forEach(card=>card.classList.toggle('hidden',!(f==='all'||card.dataset.category===f)));}));
document.querySelectorAll('.faq-list details').forEach(item=>item.addEventListener('toggle',()=>{if(item.open)document.querySelectorAll('.faq-list details').forEach(other=>{if(other!==item)other.open=false;});}));

const PHONE='919971099947';
const cart=new Map();
const cartFab=document.querySelector('.cart-fab');
const cartDrawer=document.querySelector('.cart-drawer');
const cartBackdrop=document.querySelector('.cart-backdrop');
const cartClose=document.querySelector('.cart-close');
const cartItems=document.querySelector('.cart-items');
const cartEmpty=document.querySelector('.cart-empty');
const cartCount=document.querySelector('.cart-count');
const cartTotalItems=document.querySelector('.cart-total-items');
const cartTotal=document.querySelector('.cart-total');
const checkoutBtn=document.querySelector('.checkout-btn');
const clearCartBtn=document.querySelector('.clear-cart');

function openCart(){cartDrawer.classList.add('open');cartDrawer.setAttribute('aria-hidden','false');cartBackdrop.hidden=false;document.body.classList.add('cart-open');}
function closeCart(){cartDrawer.classList.remove('open');cartDrawer.setAttribute('aria-hidden','true');cartBackdrop.hidden=true;document.body.classList.remove('cart-open');}
function saveCart(){localStorage.setItem('zafaaCart',JSON.stringify([...cart.entries()]));}
function loadCart(){try{const saved=JSON.parse(localStorage.getItem('zafaaCart')||'[]');saved.forEach(([name,item])=>cart.set(name,item));}catch(e){localStorage.removeItem('zafaaCart');}}
function money(n){return `₹${n}`;}
function renderCart(){
  cartItems.innerHTML='';let items=0,total=0;
  cart.forEach((item,name)=>{items+=item.qty;total+=item.price*item.qty;const row=document.createElement('div');row.className='cart-item';row.innerHTML=`<div><h3>${name}</h3><div class="cart-item-price">${money(item.price*item.qty)}</div><button class="remove-item" data-action="remove" data-name="${name}">Remove</button></div><div class="qty-controls"><button data-action="minus" data-name="${name}" aria-label="Decrease ${name}">−</button><strong>${item.qty}</strong><button data-action="plus" data-name="${name}" aria-label="Increase ${name}">+</button></div>`;cartItems.appendChild(row);});
  cartEmpty.hidden=cart.size>0;cartCount.textContent=items;cartTotalItems.textContent=items;cartTotal.textContent=money(total);checkoutBtn.disabled=cart.size===0;clearCartBtn.disabled=cart.size===0;saveCart();
}
function addItem(name,price){const current=cart.get(name)||{price,qty:0};current.qty+=1;cart.set(name,current);renderCart();openCart();}
document.querySelectorAll('.add-to-cart').forEach(btn=>btn.addEventListener('click',()=>addItem(btn.dataset.name,Number(btn.dataset.price))));
cartItems.addEventListener('click',e=>{const btn=e.target.closest('button[data-action]');if(!btn)return;const name=btn.dataset.name;const item=cart.get(name);if(!item)return;if(btn.dataset.action==='plus')item.qty+=1;if(btn.dataset.action==='minus')item.qty-=1;if(btn.dataset.action==='remove'||item.qty<=0)cart.delete(name);else cart.set(name,item);renderCart();});
cartFab.addEventListener('click',openCart);cartClose.addEventListener('click',closeCart);cartBackdrop.addEventListener('click',closeCart);document.addEventListener('keydown',e=>{if(e.key==='Escape')closeCart();});
clearCartBtn.addEventListener('click',()=>{cart.clear();renderCart();});
checkoutBtn.addEventListener('click',()=>{
  if(!cart.size)return;let total=0;const lines=[];cart.forEach((item,name)=>{const subtotal=item.price*item.qty;total+=subtotal;lines.push(`• ${name} x ${item.qty} = ₹${subtotal}`);});
  const message=[`Hi Zafaa Foods,`,``,`I would like to order:`,...lines,``,`Estimated Total: ₹${total}`,``,`Customer Name:`,`Delivery Address:`,`Landmark:`,`Preferred Delivery Time:`,`Payment: UPI / Cash`,``,`Please confirm availability, delivery charges and final total.`].join('\n');
  window.open(`https://wa.me/${PHONE}?text=${encodeURIComponent(message)}`,'_blank','noopener');
});
loadCart();renderCart();
