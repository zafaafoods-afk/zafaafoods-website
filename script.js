const toggle=document.querySelector('.menu-toggle');const nav=document.querySelector('.main-nav');
if(toggle&&nav){toggle.addEventListener('click',()=>{const open=nav.classList.toggle('open');toggle.setAttribute('aria-expanded',String(open));});nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');toggle.setAttribute('aria-expanded','false');}));}
const chips=document.querySelectorAll('.category-chip');const cards=document.querySelectorAll('.card');
chips.forEach(chip=>chip.addEventListener('click',()=>{const f=chip.dataset.filter;chips.forEach(c=>c.classList.remove('active'));chip.classList.add('active');cards.forEach(card=>card.classList.toggle('hidden',!(f==='all'||card.dataset.category===f)));}));
document.querySelectorAll('.faq-list details').forEach(item=>item.addEventListener('toggle',()=>{if(item.open)document.querySelectorAll('.faq-list details').forEach(other=>{if(other!==item)other.open=false;});}));
