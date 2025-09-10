
// app.js — navigation, helpers, and shared UI
const $ = sel => document.querySelector(sel);
const $$ = sel => Array.from(document.querySelectorAll(sel));

const Router = (()=>{
  let historyStack = ['home'];
  const show = (view)=>{
    $$('.screen').forEach(s=>s.classList.remove('active'));
    const el = document.querySelector(`[data-view="${view}"]`);
    if(el){ el.classList.add('active'); }
  };
  return {
    go(view){
      historyStack.push(view);
      show(view);
    },
    back(){
      if(historyStack.length>1) historyStack.pop();
      show(historyStack[historyStack.length-1]);
    },
    home(){ historyStack=['home']; show('home'); }
  };
})();

const UI = (()=>{
  let toastEl;
  const toast = (msg)=>{
    if(!toastEl){ toastEl = document.createElement('div'); toastEl.className='toast'; document.body.appendChild(toastEl); }
    toastEl.textContent = msg; toastEl.classList.add('show');
    setTimeout(()=> toastEl.classList.remove('show'), 1700);
  };
  const money = n => (Number(n)||0).toFixed(2);
  return { toast, money };
})();

// wire top buttons
document.addEventListener('click', (e)=>{
  const card = e.target.closest('[data-nav]');
  if(card){ Router.go(card.getAttribute('data-nav')); }

  if(e.target.matches('[data-action="back"]')) Router.back();
  if(e.target.matches('[data-action="logout"]')) { sessionStorage.clear(); Router.home(); }
});
document.addEventListener("DOMContentLoaded", () => {
  const logoutBtn = document.getElementById("logoutBtn");

  function updateLogoutVisibility() {
    const activeScreen = document.querySelector(".screen.active");
    if (!activeScreen) return;

    const view = activeScreen.getAttribute("data-view");

    // Show logout only for admin/employee dashboards
    if (view === "admin-dashboard" || view === "employee-dashboard") {
      logoutBtn.style.display = "inline-block";
    } else {
      logoutBtn.style.display = "none";
    }
  }

  // Run on load
  updateLogoutVisibility();

  // Watch for screen changes
  const observer = new MutationObserver(updateLogoutVisibility);
  observer.observe(document.getElementById("view-root"), {
    attributes: true,
    subtree: true,
    attributeFilter: ["class"]
  });
});

// seed quick demo products
window.addEventListener('DOMContentLoaded', ()=>{
  // set stored threshold
  $('#lowThreshold').value = Store.data().meta.lowThreshold || 5;
});
