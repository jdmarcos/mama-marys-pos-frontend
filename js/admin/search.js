
// admin/search.js — live search table
(function(){
  const box = $('#adminSearchBox');
  const body = $('#adminSearchTable tbody');
  const render = ()=>{
    const q = (box.value||'').toLowerCase();
    const rows = Store.data().products
      .filter(p => [p.name,p.category,p.barcode].join(' ').toLowerCase().includes(q))
      .map(p=>`<tr><td>${p.name}</td><td>${p.category||''}</td><td>${p.barcode||''}</td><td>₱${UI.money(p.price)}</td><td>${p.stock}</td></tr>`).join('');
    body.innerHTML = rows || '<tr><td colspan="5">No matches.</td></tr>';
  };
  box?.addEventListener('input', render);
  window.renderAdminSearch = render;
  render();
})();
