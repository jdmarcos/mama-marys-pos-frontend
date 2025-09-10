
// admin/login.js — password + OTP flow
(function(){
  const form = $('#adminLoginForm');
  const otpView = 'admin-otp';
  const dashView = 'admin-dashboard';

  form?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const u = $('#adminUser').value.trim() || 'admin';
    const p = $('#adminPass').value.trim();
    const {admin} = Store.data();
    if(u===admin.user && p===admin.pass){
      const code = String(Math.floor(100000+Math.random()*900000));
      sessionStorage.setItem('otp', code);
      $('#otpSimulated').textContent = 'Simulated OTP: ' + code;
      Router.go('admin-otp');
    }else{
      UI.toast('Invalid credentials');
    }
  });

  $('#otpForm')?.addEventListener('submit', (e)=>{
    e.preventDefault();
    const entered = $('#otpInput').value.trim();
    if(entered && entered === sessionStorage.getItem('otp')){
      sessionStorage.setItem('admin', '1');
      Router.go(dashView);
      UI.toast('Welcome, Admin');
    }else UI.toast('Wrong OTP');
  });
})();
