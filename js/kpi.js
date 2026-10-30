// Cálculo y formato de cada indicador. No toca el DOM.

function nf(n, dec){
  return n.toLocaleString('es-CR', {minimumFractionDigits:dec, maximumFractionDigits:dec});
}

// Datos de la estimación como {clave: valor}
function kpiInputs(k){
  return Object.fromEntries(k.inputs.map(i => [i.key, i.value]));
}

function kpiValue(k){
  const v = k.calc(kpiInputs(k));
  return (v === null || !isFinite(v)) ? null : v;
}

// Ficha en texto plano, lista para pegar en el informe
function fichaText(k){
  const v = kpiValue(k);
  const datos = k.inputs.map(i => `  - ${i.label}: ${nf(i.value, 0)}`).join('\n');
  const actual = v === null ? 'sin datos' : `${nf(v, k.dec)} ${k.unit}`;
  return [
    `K·${k.id} ${k.name}`,
    `Objetivo: ${k.obj}`,
    `Fórmula: ${k.formula}`,
    `Unidad: ${k.unit}`,
    `Frecuencia: ${k.freq}`,
    `Responsable: ${k.resp}`,
    `Fuente del dato: ${k.fuente}`,
    `Datos usados:`,
    datos,
    `Estimación inicial: ${actual} (no es una medición real)`
  ].join('\n');
}
