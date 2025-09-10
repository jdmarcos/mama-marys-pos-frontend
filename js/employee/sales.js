
// employee/sales.js — barcode-driven cart & checkout
(function(){
  const scan = $('#scanInput');
  const cartEl = $('#cart');
  const totalEl = $('#cartTotal');
  const quickArea = $('#quickProducts');
  const checkoutBtn = $('#checkoutBtn');

  let cart = []; // {productId, name, price, qty}

  function addToCartByBarcode(code){
    const p = Store.data().products.find(x=>x.barcode===code);
    if(!p){ UI.toast('Unknown barcode'); return; }
    addToCart(p);
  }
  function addToCart(p){
    const item = cart.find(i=>i.productId===p.id);
    if(item) item.qty++;
    else cart.push({productId:p.id, name:p.name, price:p.price, qty:1});
    renderCart();
  }
  function renderCart(){
    cartEl.innerHTML = cart.map(i=>`<div class="cart-item">
      <div>${i.name} <small>₱${UI.money(i.price)}</small></div>
      <div class="qty hstack gap">
        <button class="btn" data-dec="${i.productId}">-</button>
        <input type="number" min="1" value="${i.qty}" data-qty="${i.productId}" />
        <button class="btn" data-inc="${i.productId}">+</button>
        <button class="btn danger" data-rem="${i.productId}">✕</button>
      </div>
    </div>`).join('') || '<div class="hint">Cart empty. Scan a barcode to add items.</div>';
    const total = cart.reduce((a,i)=>a+i.price*i.qty,0);
    totalEl.textContent = UI.money(total);
  }

  cartEl?.addEventListener('click', (e)=>{
    const id = e.target.getAttribute('data-inc')||e.target.getAttribute('data-dec')||e.target.getAttribute('data-rem');
    if(!id) return;
    if(e.target.hasAttribute('data-inc')){
      const it = cart.find(x=>x.productId===id); if(it) it.qty++;
    }else if(e.target.hasAttribute('data-dec')){
      const it = cart.find(x=>x.productId===id); if(it && it.qty>1) it.qty--;
    }else if(e.target.hasAttribute('data-rem')){
      cart = cart.filter(x=>x.productId!==id);
    }
    renderCart();
  });
  cartEl?.addEventListener('input', (e)=>{
    const id = e.target.getAttribute('data-qty'); if(!id) return;
    const it = cart.find(x=>x.productId===id);
    if(it){ it.qty = Math.max(1, Number(e.target.value)||1); renderCart(); }
  });

  scan?.addEventListener('keydown', (e)=>{
    if(e.key==='Enter'){ e.preventDefault(); const code = scan.value.trim(); scan.value=''; addToCartByBarcode(code); }
  });

  function renderQuick(){
    const items = Store.data().products.slice(0,12);
    quickArea.innerHTML = items.map(p=>`<span class="chip" data-quick="${p.id}">${p.name}</span>`).join('');
  }
  quickArea?.addEventListener('click', (e)=>{
    const id = e.target.getAttribute('data-quick'); if(!id) return;
    const p = Store.data().products.find(x=>x.id===id); if(p) addToCart(p);
  });

  checkoutBtn?.addEventListener('click', ()=>{
    if(!cart.length) return UI.toast('Cart is empty');
    const cashier = sessionStorage.getItem('cashier') || 'Employee';
    // verify stock
    for(const it of cart){
      const p = Store.data().products.find(x=>x.id===it.productId);
      if(!p || p.stock < it.qty){ return UI.toast('Insufficient stock for '+ (p?.name||'item')); }
    }
    // deduct
    cart.forEach(it=>{
      const p = Store.data().products.find(x=>x.id===it.productId);
      p.stock -= it.qty;
    });
    const total = cart.reduce((a,i)=>a+i.price*i.qty,0);
    const sale = { items: cart.map(i=>({...i})), total, cashier, timestamp: Date.now() };
    Store.addSale(sale); Store.save();
    UI.toast('Sale completed');
    cart = []; renderCart(); renderTracking(); renderSearchTables(); renderSales(); renderMySales();
  });

  window.refreshQuickProducts = renderQuick;
  window.renderCart = renderCart;

  renderQuick(); renderCart();
})();
