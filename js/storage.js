
// storage.js — lightweight persistence using localStorage
const Store = (()=>{
  const KEY = 'mmb_pos_v1';
  const state = {
    meta: { lowThreshold: 5 },
    products: [], // {id, name, category, price, stock, barcode}
    sales: [],    // {id, items:[{productId, qty, price}], total, cashier, timestamp, status:'OK'|'VOID'}
    eods: [],     // {id, cashier, date, totalCash, notes}
    admin: { user: 'admin', pass: 'admin123' }
  };

  const _load = () => {
    try{
      const raw = localStorage.getItem(KEY);
      if(!raw){ _save(state); return {...state}; }
      return JSON.parse(raw);
    }catch(e){ console.error(e); return {...state}; }
  };
  const _save = (data) => localStorage.setItem(KEY, JSON.stringify(data));

  let data = _load();

  return {
    data: ()=> data,
    save: ()=> _save(data),
    reset: ()=> { data = JSON.parse(JSON.stringify(state)); _save(data); },
    setLowThreshold(v){ data.meta.lowThreshold = Number(v)||0; this.save(); },
    upsertProduct(p){
      if(!p.id){ p.id = crypto.randomUUID(); data.products.push(p); }
      else{
        const i = data.products.findIndex(x=>x.id===p.id);
        if(i>=0) data.products[i]=p; else data.products.push(p);
      }
      this.save(); return p;
    },
    deleteProduct(id){ data.products = data.products.filter(p=>p.id!==id); this.save(); },
    setBarcode(productId, code){ const p = data.products.find(p=>p.id===productId); if(p){ p.barcode=code; this.save(); } },
    addSale(s){ s.id = 'S'+ Date.now(); s.status='OK'; data.sales.push(s); this.save(); return s; },
    voidSale(id){ const s = data.sales.find(x=>x.id===id); if(s){ s.status='VOID'; this.save(); } },
    addEOD(e){ e.id = 'E'+ Date.now(); data.eods.push(e); this.save(); return e; }
  };
})();
