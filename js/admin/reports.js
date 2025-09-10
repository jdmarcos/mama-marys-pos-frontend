
// admin/reports.js — run and export sales report
(function(){
  const from = $('#repFrom'), to = $('#repTo'), area = $('#reportSummary');

  function run(){
    const start = from.value? new Date(from.value) : new Date(0);
    const end = to.value? new Date(to.value+'T23:59:59') : new Date();
    const sales = Store.data().sales.filter(s=>{
      const d = new Date(s.timestamp);
      return d>=start && d<=end && s.status==='OK';
    });

    const total = sales.reduce((a,s)=>a+s.total,0);
    const count = sales.length;
    const byItem = {};
    sales.forEach(s=>s.items.forEach(it=>{
      byItem[it.name] = (byItem[it.name]||0) + it.qty;
    }));

    const top = Object.entries(byItem).sort((a,b)=>b[1]-a[1]).slice(0,5);
    area.innerHTML = `
      <div><b>Total Sales:</b> ₱${UI.money(total)} (${count} txns)</div>
      <div><b>Top Items:</b> ${top.map(([n,q])=>n+' x'+q).join(', ') || '—'}</div>
    `;
    return {sales,total,count,byItem};
  }

  $('#runReport')?.addEventListener('click', run);

  $('#exportReport')?.addEventListener('click', ()=>{
    const {sales} = run();
    const headers = ['ID','Date','Cashier','Items','Total'];
    const rows = sales.map(s=>[s.id,new Date(s.timestamp).toLocaleString(),s.cashier,
      s.items.map(it=>`${it.name} x${it.qty}`).join('; '), s.total]);
    downloadCSV([headers,...rows], 'sales_report.csv');
  });

  window.runReport = run;
})();
