# Indicadores de la Joyería

Tablero de indicadores (KPIs) para una joyería pequeña que hoy lleva todo a mano.
Cada indicador sale de un problema mencionado en la entrevista. Los cuatro indicadores
de Joyería / Manual muestran estimaciones iniciales fijas, no mediciones reales.

## Cómo abrirlo

Doble clic en `index.html`. No necesita servidor ni instalación.

## Estructura

```
indicadores-joyeria/
├── index.html          Estructura de la página
├── assets/
│   └── favicon.svg     Ícono de la pestaña
├── css/
│   ├── tokens.css      Colores, tipografías, sombras (tema claro y oscuro)
│   ├── base.css        Reinicio y estilos generales
│   ├── layout.css      Navegación, portada, aviso, registros, pie
│   └── components.css  Botones, fichas, registros, aviso flotante
└── js/
    ├── theme.js        Tema claro/oscuro (se carga primero, en <head>)
    ├── data.js         Área e indicadores: textos, fórmulas, estimaciones
    ├── kpi.js          Cálculo y formato (sin DOM)
    ├── render.js       Arma la interfaz
    ├── clipboard.js    Copiar fichas y aviso flotante
    └── main.js         Eventos e inicio
```

## Cambios frecuentes

- **Agregar o editar un indicador:** `js/data.js`, en la lista `KPIS`.
- **Cambiar colores:** `css/tokens.css`.
- **Cambiar textos de la portada o de los registros:** `index.html`.
