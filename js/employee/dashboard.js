
// employee/dashboard.js — set cashier name in session
(function(){
  const input = $('#cashierName'); const btn = $('#saveCashier');
  btn?.addEventListener('click', ()=>{
    const name = input.value.trim();
    if(!name) return UI.toast('Enter your name');
    sessionStorage.setItem('cashier', name);
    UI.toast('Saved');
    renderMySales();
  });
})();
