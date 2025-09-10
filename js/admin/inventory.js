
// admin/inventory.js — CRUD inventory + CSV export
(function(){
  const form = $('#invForm');
  const tableBody = $('#invTable tbody');
  const search = $('#invSearch');
  const resetBtn = $('#invReset');
  const thresholdInput = $('#lowThreshold');

  const render = ()=>{
    const q = (search.value||'').toLowerCase();
    const rows = Store.data().products
      .filter(p => [p.name,p.category,p.barcode].join(' ').toLowerCase().includes(q))
      .map(p=>`<tr>
        <td>${p.name}</td>
        <td>${p.category||''}</td>
        <td>${p.barcode||'<span class="badge danger">none</span>'}</td>
        <td>₱${UI.money(p.price)}</td>
        <td>${p.stock}</td>
        <td class="hstack gap">
          <button class="btn" data-edit="${p.id}">Edit</button>
          <button class="btn danger" data-del="${p.id}">Delete</button>
        </td>
      </tr>`).join('');
    tableBody.innerHTML = rows || '<tr><td colspan="6">No products yet.</td></tr>';
  };

  const clearForm = ()=>{ form.reset(); $('#invId').value=''; };

  form?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const id = $('#invId').value || undefined;
    const p = {
      id,
      name: $('#invName').value.trim(),
      category: $('#invCategory').value.trim(),
      price: Number($('#invPrice').value),
      stock: Number($('#invStock').value),
      barcode: $('#invBarcode').value.trim() || undefined
    };
    if(!p.name){ UI.toast('Name required'); return; }
    Store.upsertProduct(p);
    UI.toast('Saved');
    clearForm(); render(); refreshBarcodeOptions();
    refreshQuickProducts(); renderTracking(); renderSearchTables();
  });

  resetBtn?.addEventListener('click', clearForm);

  tableBody?.addEventListener('click', (e)=>{
    const id = e.target.getAttribute('data-edit') || e.target.getAttribute('data-del');
    if(!id) return;
    if(e.target.hasAttribute('data-edit')){
      const p = Store.data().products.find(x=>x.id===id);
      if(!p) return;
      $('#invId').value=p.id; $('#invName').value=p.name; $('#invCategory').value=p.category||'';
      $('#invPrice').value=p.price; $('#invStock').value=p.stock; $('#invBarcode').value=p.barcode||'';
    }else if(e.target.hasAttribute('data-del')){
      if(confirm('Delete this product?')){
        Store.deleteProduct(id); render(); refreshBarcodeOptions();
        refreshQuickProducts(); renderTracking(); renderSearchTables();
      }
    }
  });

  search?.addEventListener('input', render);

  $('#exportInventory')?.addEventListener('click', ()=>{
    const headers = ['Name','Category','Barcode','Price','Stock'];
    const rows = Store.data().products.map(p=>[p.name,p.category||'',p.barcode||'',p.price,p.stock]);
    downloadCSV([headers, ...rows], 'inventory.csv');
  });

  $('#seedSample')?.addEventListener('click', ()=>{
    if(!confirm('Seed sample items? This adds to your current list.')) return;
    const samples = [
      {name:'Chicken Skin', category:'Butcheron', price:20, stock:50},
      {name:'Pork Intestine', category:'Isaw', price:25, stock:40},
      {name:'Chicken Gizzard', category:'Atay/Balunbalunan', price:22, stock:30},
      {name:'Rice', category:'Add-on', price:10, stock:100}
    ];
    samples.forEach(s=>Store.upsertProduct(s));
    render(); refreshBarcodeOptions(); refreshQuickProducts(); renderTracking(); renderSearchTables();
  });

  thresholdInput?.addEventListener('change', ()=>{
    Store.setLowThreshold(thresholdInput.value);
    renderTracking();
  });

  // helpers
  window.downloadCSV = function(rows, filename){
    const csv = rows.map(r => r.map(v=>`"${String(v).replaceAll('"','""')}"`).join(',')).join('\n');
    const blob = new Blob([csv], {type:'text/csv'});
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob); a.download = filename; a.click();
  };

  // expose renders for other modules
  window.renderInventory = render;

  // initial
  render();
})();
