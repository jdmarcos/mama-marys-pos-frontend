
// employee/tracking.js — live stock table with low-stock badge
(function(){
  const body = $('#trackTable tbody');
  function render(){
    const t = Store.data().meta.lowThreshold || 5;
    const rows = Store.data().products.map(p=>{
      const alert = p.stock<=t ? '<span class="badge danger">LOW</span>' : '<span class="badge ok">OK</span>';
      return `<tr><td>${p.name}</td><td>${p.category||''}</td><td>${p.barcode||''}</td><td>₱${UI.money(p.price)}</td><td>${p.stock}</td><td>${alert}</td></tr>`;
    }).join('');
    body.innerHTML = rows || '<tr><td colspan="6">No products.</td></tr>';
  }
  window.renderTracking = render;
  render();
})();
