
// admin/barcode.js — assign/generate barcodes
(function(){
  const opt = $('#bcProduct'); const val = $('#bcValue');
  const list = $('#noBarcodeList');

  window.refreshBarcodeOptions = function(){
    const prods = Store.data().products;
    opt.innerHTML = prods.map(p=>`<option value="${p.id}">${p.name}</option>`).join('');
    const no = prods.filter(p=>!p.barcode);
    list.innerHTML = no.length? no.map(p=>`<li>${p.name}</li>`).join('') : '<li>All products have barcodes.</li>';
  };

  $('#bcSave')?.addEventListener('click', ()=>{
    const id = opt.value; const code = val.value.trim();
    if(!id || !code) return UI.toast('Pick a product and enter barcode');
    // ensure uniqueness
    if(Store.data().products.some(p=>p.barcode===code && p.id!==id)) return UI.toast('Barcode already used');
    Store.setBarcode(id, code); UI.toast('Saved');
    refreshBarcodeOptions(); renderSearchTables();
  });

  $('#bcGenerate')?.addEventListener('click', ()=>{
    val.value = String(Math.floor(100000000000 + Math.random()*900000000000));
  });

  refreshBarcodeOptions();
})();
