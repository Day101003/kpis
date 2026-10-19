// Datos del tablero.
// Cada área sale de un problema mencionado en la entrevista; cada indicador (KPI) pertenece a un área.
//
// Campos de un KPI:
//   inputs   datos que se escriben en la ficha: {key, label, value, prefix?}
//   calc     fórmula; recibe los datos y devuelve el valor (o null si no se puede calcular)
//   dir      'up' = más es mejor · 'down' = menos es mejor · 'range' = debe quedar dentro de un rango
//   meta     valor objetivo; delta = margen para considerarlo "cerca"
//   min/max  extremos de la barra de progreso

const AREAS = [
  {key:'merc', short:'Mercadería',  title:'Mercadería nueva',     quote:'Cuando ingresa mercadería, no sabe si le va a gustar a las personas.'},
  {key:'aten', short:'Consultas',   title:'Atención y consultas', quote:'La gente consulta mucho; sin paciencia se pueden perder ventas.'},
  {key:'deta', short:'Detalle',     title:'Atención al detalle',  quote:'La falta de atención al detalle es de lo que puede hacer fracasar el negocio.'},
  {key:'orde', short:'Inventario',  title:'Orden e inventario',   quote:'El desorden es una de las tres cosas que harían fracasar la empresa.'},
  {key:'comp', short:'Competencia', title:'Competencia',          quote:'El informe que le haría la vida más fácil: entender a la competencia.'}
];

const KPIS = [
  // ---- Mercadería nueva ----
  {
    id:'01', area:'merc', name:'Sell-through de mercadería nueva',
    obj:'Medir qué parte de cada ingreso nuevo se vende en el primer mes, para decidir qué volver a comprar.',
    formula:'(Piezas nuevas vendidas en 30 días ÷ piezas nuevas ingresadas) × 100',
    inputs:[
      {key:'a', label:'Piezas nuevas vendidas en 30 días', value:18},
      {key:'b', label:'Piezas nuevas ingresadas', value:50}
    ],
    calc:v => v.b ? v.a / v.b * 100 : null,
    unit:'%', dec:1, dir:'up', meta:40, delta:10, min:0, max:100,
    freq:'Por cada ingreso de mercadería', resp:'Dueña', fuente:'Registro de inventario y registro de ventas'
  },
  {
    id:'02', area:'merc', name:'Rotación de inventario',
    obj:'Saber cuántas veces al año se vende y se repone el inventario completo.',
    formula:'Costo de lo vendido en el año ÷ ((inventario inicial + inventario final) ÷ 2)',
    inputs:[
      {key:'a', label:'Costo de lo vendido en el año', value:9600000, prefix:'₡'},
      {key:'b', label:'Inventario inicial', value:5800000, prefix:'₡'},
      {key:'c', label:'Inventario final', value:6200000, prefix:'₡'}
    ],
    calc:v => (v.b + v.c) ? v.a / ((v.b + v.c) / 2) : null,
    unit:'veces/año', dec:1, dir:'up', meta:2, delta:0.5, min:0, max:4,
    freq:'Trimestral (anualizado)', resp:'Dueña', fuente:'Registro de inventario (costos) y registro de ventas'
  },
  {
    id:'03', area:'merc', name:'Inventario estancado',
    obj:'Detectar piezas que no se venden para rebajarlas o dejar de comprar ese estilo.',
    formula:'(Piezas sin venderse en más de 90 días ÷ total de piezas en vitrina) × 100',
    inputs:[
      {key:'a', label:'Piezas sin venta en más de 90 días', value:42},
      {key:'b', label:'Total de piezas', value:220}
    ],
    calc:v => v.b ? v.a / v.b * 100 : null,
    unit:'%', dec:1, dir:'down', meta:20, delta:10, min:0, max:50,
    freq:'Mensual', resp:'Dueña', fuente:'Registro de inventario (fecha de ingreso y fecha de venta)'
  },

  // ---- Atención y consultas ----
  {
    id:'04', area:'aten', name:'Conversión de consultas',
    obj:'Medir cuántas de las personas que preguntan terminan comprando.',
    formula:'(Consultas que terminan en venta ÷ total de consultas) × 100',
    inputs:[
      {key:'a', label:'Consultas que terminaron en venta', value:34},
      {key:'b', label:'Total de consultas', value:160}
    ],
    calc:v => v.b ? v.a / v.b * 100 : null,
    unit:'%', dec:1, dir:'up', meta:25, delta:10, min:0, max:50,
    freq:'Semanal', resp:'Dependiente(s) de tienda', fuente:'Registro de consultas'
  },
  {
    id:'05', area:'aten', name:'Tiempo promedio de respuesta',
    obj:'Controlar cuánto espera un cliente que escribe por WhatsApp o redes.',
    formula:'Suma de minutos hasta responder ÷ número de consultas',
    inputs:[
      {key:'a', label:'Minutos totales hasta responder', value:2880},
      {key:'b', label:'Consultas por redes', value:160}
    ],
    calc:v => v.b ? v.a / v.b : null,
    unit:'min', dec:0, dir:'down', meta:15, delta:15, min:0, max:60,
    freq:'Semanal', resp:'Quien atiende redes', fuente:'Registro de consultas (hora de llegada y de respuesta)'
  },
  {
    id:'06', area:'aten', name:'Consultas sin seguimiento',
    obj:'Contar las ventas que se escapan porque nadie respondió o nadie volvió a escribir.',
    formula:'(Consultas sin respuesta ni seguimiento ÷ total de consultas) × 100',
    inputs:[
      {key:'a', label:'Consultas sin seguimiento', value:22},
      {key:'b', label:'Total de consultas', value:160}
    ],
    calc:v => v.b ? v.a / v.b * 100 : null,
    unit:'%', dec:1, dir:'down', meta:5, delta:5, min:0, max:25,
    freq:'Semanal', resp:'Dependiente(s) de tienda', fuente:'Registro de consultas'
  },

  // ---- Atención al detalle ----
  {
    id:'07', area:'deta', name:'Devoluciones y reclamos',
    obj:'Medir cuántas ventas vuelven por un problema con la pieza o la atención.',
    formula:'(Ventas con reclamo, cambio o devolución ÷ total de ventas) × 100',
    inputs:[
      {key:'a', label:'Ventas con reclamo o devolución', value:4},
      {key:'b', label:'Total de ventas', value:180}
    ],
    calc:v => v.b ? v.a / v.b * 100 : null,
    unit:'%', dec:1, dir:'down', meta:3, delta:2, min:0, max:10,
    freq:'Mensual', resp:'Dueña', fuente:'Registro de ventas'
  },
  {
    id:'08', area:'deta', name:'Errores en encargos',
    obj:'Controlar errores de talla, grabado, material o fecha de entrega en pedidos especiales.',
    formula:'(Encargos con algún error ÷ total de encargos) × 100',
    inputs:[
      {key:'a', label:'Encargos con error', value:3},
      {key:'b', label:'Total de encargos', value:40}
    ],
    calc:v => v.b ? v.a / v.b * 100 : null,
    unit:'%', dec:1, dir:'down', meta:2, delta:2, min:0, max:15,
    freq:'Mensual', resp:'Quien toma el encargo', fuente:'Registro de ventas (encargos)'
  },

  // ---- Orden e inventario ----
  {
    id:'09', area:'orde', name:'Exactitud de inventario',
    obj:'Verificar que lo que dice el registro coincide con lo que hay en vitrina y caja fuerte.',
    formula:'(Piezas que coinciden entre conteo físico y registro ÷ piezas contadas) × 100',
    inputs:[
      {key:'a', label:'Piezas que coinciden', value:211},
      {key:'b', label:'Piezas contadas', value:220}
    ],
    calc:v => v.b ? v.a / v.b * 100 : null,
    unit:'%', dec:1, dir:'up', meta:98, delta:3, min:90, max:100,
    freq:'Mensual (conteo físico)', resp:'Dueña', fuente:'Registro de inventario y conteo físico'
  },

  // ---- Competencia ----
  {
    id:'10', area:'comp', name:'Índice de precio vs. competencia',
    obj:'Saber si una categoría está más cara o más barata que las joyerías cercanas.',
    formula:'(Precio promedio propio de una categoría ÷ precio promedio de 3 a 5 competidores) × 100',
    inputs:[
      {key:'a', label:'Precio promedio propio', value:48000, prefix:'₡'},
      {key:'b', label:'Precio promedio competencia', value:45000, prefix:'₡'}
    ],
    calc:v => v.b ? v.a / v.b * 100 : null,
    unit:'pts', dec:1, dir:'range', range:[90, 110], warnRange:[80, 120], min:70, max:130,
    freq:'Mensual', resp:'Dueña', fuente:'Visitas y revisión de redes de la competencia'
  },
  {
    id:'11', area:'comp', name:'Ventas perdidas por competencia',
    obj:'Medir cuántas ventas perdidas se van a otra joyería, según lo que dice el cliente.',
    formula:'(Clientes que no compraron por precio o porque compran en otro lado ÷ total de ventas perdidas) × 100',
    inputs:[
      {key:'a', label:'Perdidas por competencia', value:9},
      {key:'b', label:'Total de ventas perdidas', value:30}
    ],
    calc:v => v.b ? v.a / v.b * 100 : null,
    unit:'%', dec:1, dir:'down', meta:20, delta:15, min:0, max:60,
    freq:'Mensual (vigilar tendencia)', resp:'Dependiente(s) de tienda', fuente:'Registro de consultas (motivo de no compra)'
  }
];
