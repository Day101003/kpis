// Copiar al portapapeles y aviso breve (toast).

function toast(msg){
  const el = document.getElementById('toast');
  document.getElementById('toast-msg').textContent = msg;
  el.classList.add('show');
  clearTimeout(toast.timer);
  toast.timer = setTimeout(() => el.classList.remove('show'), 2000);
}

function copyText(text, okMsg){
  // Respaldo para navegadores o contextos sin acceso a navigator.clipboard
  const fallback = () => {
    const ta = document.createElement('textarea');
    ta.className = 'cliptmp';
    ta.value = text;
    ta.setAttribute('readonly', '');
    document.body.appendChild(ta);
    ta.select();
    let done = false;
    try{ done = document.execCommand('copy'); }catch(e){}
    ta.remove();
    toast(done ? okMsg : 'No se pudo copiar. Seleccioná el texto a mano.');
  };

  if(navigator.clipboard && window.isSecureContext){
    navigator.clipboard.writeText(text).then(() => toast(okMsg), fallback);
  }else{
    fallback();
  }
}
