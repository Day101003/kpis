// Tema claro/oscuro.
// Se carga en <head> sin "defer" para aplicar el tema guardado antes de pintar la página.

const THEME_KEY = 'joyeria-tema';

(function applySavedTheme(){
  try{
    const saved = localStorage.getItem(THEME_KEY);
    if(saved === 'light' || saved === 'dark') document.documentElement.dataset.theme = saved;
  }catch(e){}
})();

function currentTheme(){
  const forced = document.documentElement.dataset.theme;
  if(forced) return forced;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function toggleTheme(){
  const next = currentTheme() === 'dark' ? 'light' : 'dark';
  document.documentElement.dataset.theme = next;
  try{ localStorage.setItem(THEME_KEY, next); }catch(e){}
  return next;
}
