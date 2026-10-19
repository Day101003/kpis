# Indicadores de la Joyería

Tablero de indicadores (KPIs) para una joyería pequeña que hoy lleva todo a mano.
Cada indicador sale de un problema mencionado en la entrevista; al cambiar los números
de una ficha, el estado se recalcula (verde = en meta, amarillo = cerca, rojo = fuera).

## Cómo abrirlo

Doble clic en `index.html`. No necesita servidor ni instalación.
Los cambios se guardan en el navegador (localStorage).

## Estructura

```
indicadores-joyeria/
├── index.html          Estructura de la página
├── assets/
│   └── favicon.svg     Ícono de la pestaña
├── css/
│   ├── tokens.css      Colores, tipografías, sombras (tema claro y oscuro)
│   ├── base.css        Reinicio y estilos generales
│   ├── layout.css      Navegación, portada, resumen, áreas, registros, pie
│   └── components.css  Botones, chips, anillo, fichas, registros, aviso
└── js/
    ├── theme.js        Tema claro/oscuro (se carga primero, en <head>)
    ├── data.js         Áreas e indicadores: textos, fórmulas, metas
    ├── kpi.js          Cálculo, formato y semáforo (sin DOM)
    ├── store.js        Estado editable y guardado en el navegador
    ├── render.js       Arma y actualiza la interfaz
    ├── clipboard.js    Copiar fichas y aviso flotante
    └── main.js         Eventos e inicio
```

## Cambios frecuentes

- **Agregar o editar un indicador:** `js/data.js`, en la lista `KPIS`.
- **Cambiar colores:** `css/tokens.css`.
- **Cambiar textos de la portada o de los registros:** `index.html`.
