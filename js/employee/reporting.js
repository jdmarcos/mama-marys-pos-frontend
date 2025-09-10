
// employee/reporting.js — personal sales & EOD submit
(function(){
  const body = $('#mySalesTable tbody');
  const eodCash = $('#eodCash'), eodNotes = $('#eodNotes'), eodList = $('#eodList');
  function myName(){ return sessionStorage.getItem('cashier') || 'Employee'; }
  function renderMy(){
    const me = myName();
    const rows = Store.data().sales.filter(s=>s.cashier===me && s.status==='OK').slice().reverse()
      .map(s=>`<tr><td>${new Date(s.timestamp).toLocaleString()}</td><td>${s.id}</td>
      <td>${s.items.map(it=>it.name+' x'+it.qty).join(', ')}</td><td>₱${UI.money(s.total)}</td></tr>`).join('');
    body.innerHTML = rows || '<tr><td colspan="4">No sales yet.</td></tr>';
    // EOD list
    const today = new Date().toISOString().slice(0,10);
    const list = Store.data().eods.filter(e=>e.cashier===me).slice().reverse()
      .map(e=>`<div>📄 ${e.date} — ₱${UI.money(e.totalCash)} — ${e.notes||''}</div>`).join('');
    eodList.innerHTML = list || '<div>No EOD reports yet.</div>';
  }
  $('#submitEOD')?.addEventListener('click', ()=>{
    const totalCash = Number(eodCash.value)||0;
    const notes = eodNotes.value.trim();
    const date = new Date().toISOString().slice(0,10);
    Store.addEOD({cashier: myName(), date, totalCash, notes});
    eodCash.value=''; eodNotes.value=''; renderMy(); UI.toast('EOD submitted');
  });
  window.renderMySales = renderMy;
  renderMy();
})();
