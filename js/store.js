// Estado editable (datos de cada ficha y metas) y su persistencia en el navegador.

const STORAGE_KEY = 'kpis-joyeria-v1';

function defaultState(){
  const s = {inputs:{}, metas:{}};
  KPIS.forEach(k => {
    s.inputs[k.id] = {};
    k.inputs.forEach(i => { s.inputs[k.id][i.key] = i.value; });
    if(k.dir !== 'range') s.metas[k.id] = k.meta;
  });
  return s;
}

function loadState(){
  const s = defaultState();
  try{
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
    if(saved) KPIS.forEach(k => {
      if(saved.inputs && saved.inputs[k.id]) Object.assign(s.inputs[k.id], saved.inputs[k.id]);
      if(saved.metas && typeof saved.metas[k.id] === 'number') s.metas[k.id] = saved.metas[k.id];
    });
  }catch(e){}
  return s;
}

function saveState(s){
  try{ localStorage.setItem(STORAGE_KEY, JSON.stringify(s)); }catch(e){}
}

function clearState(){
  try{ localStorage.removeItem(STORAGE_KEY); }catch(e){}
}
