
// admin/sales.js — list and void sales
(function(){
  const body = $('#salesTable tbody');
  function render(){
    const rows = Store.data().sales.slice().reverse().map(s=>{
      const items = s.items.map(it=> it.name + ' x' + it.qty).join(', ');
      return `<tr>
        <td>${s.id}</td>
        <td>${new Date(s.timestamp).toLocaleString()}</td>
        <td>${s.cashier||'-'}</td>
        <td>${items}</td>
        <td>₱${UI.money(s.total)}</td>
        <td>${s.status==='OK' ? '<span class="badge ok">OK</span>' : '<span class="badge danger">VOID</span>'}</td>
        <td>${s.status==='OK' ? '<button class="btn danger" data-void="'+s.id+'">Void</button>' : ''}</td>
      </tr>`;
    }).join('');
    body.innerHTML = rows || '<tr><td colspan="7">No sales yet.</td></tr>';
  }
  body?.addEventListener('click', (e)=>{
    const id = e.target.getAttribute('data-void');
    if(!id) return;
    if(confirm('Void this sale? Inventory will be returned.')){
      // return stock
      const s = Store.data().sales.find(x=>x.id===id);
      if(s){
        s.items.forEach(it=>{
          const p = Store.data().products.find(x=>x.id===it.productId);
          if(p) p.stock += it.qty;
        });
        Store.voidSale(id);
        Store.save();
        render(); renderTracking(); renderInventory(); renderSearchTables();
      }
    }
  });
  window.renderSales = render;
  render();
})();
