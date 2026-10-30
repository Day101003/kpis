// Datos del tablero.
// El área sale de los problemas mencionados en la entrevista; cada indicador (KPI) pertenece a un área.
// Los valores son estimaciones iniciales fijas, no mediciones reales.
//
// Campos de un KPI:
//   inputs   datos de la estimación: {key, label, value}
//   calc     fórmula; recibe los datos y devuelve el valor (o null si no se puede calcular)

const AREAS = [
  {key:'manual', short:'Joyería / Manual', title:'Joyería / Manual', quote:'La falta de atención al detalle, la falta de paciencia, el desorden y la incertidumbre sobre la nueva mercadería afectan la operación.'}
];

const KPIS = [
  {
    id:'12', area:'manual', name:'Atención al detalle',
    obj:'Medir qué tan correctamente se revisan productos, precios, pedidos y características antes de atender o entregar. Estimación inicial: 70%; no es una medición real.',
    formula:'(Interacciones sin error ÷ interacciones revisadas) × 100',
    inputs:[
      {key:'a', label:'Interacciones sin error', value:70},
      {key:'b', label:'Interacciones revisadas', value:100}
    ],
    calc:v => v.b ? v.a / v.b * 100 : null,
    unit:'%', dec:1,
    freq:'Semanal', resp:'Dependiente(s) de tienda', fuente:'Revisión manual de interacciones; datos iniciales estimados'
  },
  {
    id:'13', area:'manual', name:'Conversión de consultas en ventas',
    obj:'Medir qué porcentaje de las consultas termina en una venta, para detectar posibles ventas perdidas por falta de paciencia al atender clientes. Estimación inicial: 35%; no es una medición real.',
    formula:'(Consultas que terminaron en venta ÷ total de consultas) × 100',
    inputs:[
      {key:'a', label:'Consultas que terminaron en venta', value:35},
      {key:'b', label:'Total de consultas', value:100}
    ],
    calc:v => v.b ? v.a / v.b * 100 : null,
    unit:'%', dec:1,
    freq:'Semanal', resp:'Dependiente(s) de tienda', fuente:'Registro de consultas; datos iniciales estimados'
  },
  {
    id:'14', area:'manual', name:'Nivel de orden en la operación',
    obj:'Medir el nivel de organización de productos, registros, vitrinas y espacios de trabajo. Estimación inicial: 60%; no es una medición real.',
    formula:'(Elementos correctamente ordenados ÷ elementos revisados) × 100',
    inputs:[
      {key:'a', label:'Elementos correctamente ordenados', value:60},
      {key:'b', label:'Elementos revisados', value:100}
    ],
    calc:v => v.b ? v.a / v.b * 100 : null,
    unit:'%', dec:1,
    freq:'Semanal', resp:'Dueño', fuente:'Lista de revisión manual del orden; datos iniciales estimados'
  },
  {
    id:'15', area:'manual', name:'Aceptación de nueva mercadería',
    obj:'Medir qué porcentaje de la mercadería nueva genera interés o ventas, para reducir la incertidumbre sobre si gustará a los clientes. Estimación inicial: 50%; no es una medición real.',
    formula:'(Productos nuevos con interés o venta ÷ productos nuevos ingresados) × 100',
    inputs:[
      {key:'a', label:'Productos nuevos con interés o venta', value:50},
      {key:'b', label:'Productos nuevos ingresados', value:100}
    ],
    calc:v => v.b ? v.a / v.b * 100 : null,
    unit:'%', dec:1,
    freq:'Por cada ingreso de mercadería', resp:'Dueño', fuente:'Registros de inventario, consultas y ventas (cada producto se cuenta una vez); datos iniciales estimados'
  }
];
