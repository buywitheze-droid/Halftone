# Semitonos DTF · Removedor de fondo + Semitono para prenda negra

Herramienta web 100 % en el navegador para preparar arte de impresión DTF / serigrafía. Combina dos funciones en un solo flujo:

1. **Removedor de fondo por color** — Click con un gotero sobre la imagen para elegir el color a eliminar; controles de tolerancia y suavizado de bordes.
2. **Semitono AM** opcional — Cuando se habilita el checkbox, convierte la imagen en una trama de puntos rotada lista para serigrafía o DTF blanco sobre prenda negra.

**Sin backend, sin instalación.** Funciona en GitHub Pages o abriendo `index.html` directamente.

## Características

- **Preparación previa**: detecta el tamaño en cm y el DPI embebido del archivo subido (lee chunk `pHYs` de PNG y segmentos JFIF/EXIF de JPEG), y permite redimensionar al tamaño físico exacto de impresión.
- **Gotero estilo Photoshop**: cursor de cruz, click en cualquier parte de la imagen para muestrear el color, Esc para cancelar.
- **Removedor de fondo configurable**: tolerancia + suavizado para evitar halos duros.
- **Trama AM** (puntos redondos) con LPI, ángulo y punto mínimo en mm.
- **Visor con zoom y pan** estilo Photoshop: rueda para zoom centrado en el cursor, clic-arrastrar para mover, atajos `0`, `1`, `+`, `−`, `C`, doble clic para ajustar.
- **Tiempo real**: cualquier slider actualiza el resultado al instante.
- **PNG con DPI embebido**: el archivo descargado lleva el chunk `pHYs` correcto.

## Uso

### Abrir localmente

Doble clic en `index.html` y listo.

### Publicar en GitHub Pages

1. Sube el repositorio a GitHub.
2. Settings → Pages → Source: **Deploy from a branch** → Branch: `main` / root → Save.
3. En 1–2 minutos GitHub te entrega una URL pública estilo `https://usuario.github.io/repo/`.

## Flujo de trabajo

1. **Sube una imagen** (PNG, JPG o WEBP).
2. **Define el tamaño físico** en cm al que vas a imprimir (con candado de proporción) y el DPI de trabajo (300 por defecto).
3. **Ajusta tonos** si lo necesitas: brillo, contraste, nitidez, gamma, corte de negro/blanco.
4. **Remover fondo**: pulsa **Seleccionar color de fondo**, luego click en la imagen sobre el color a eliminar. Ajusta tolerancia y suavizado hasta dejar limpio el sujeto.
5. **(Opcional) Habilitar semitono**: marca el checkbox y configura LPI, ángulo, punto mínimo.
6. **Descarga el PNG transparente** con DPI embebido.

## Pipeline interno

```
imagen original RGBA
  └─ resize alta calidad al tamaño físico × DPI
        └─ brillo + contraste + nitidez sobre el RGB
              ├─ snapshot "workingCanvas" para el gotero
              ├─ si hay color de fondo seleccionado:
              │    distancia RGB al color elegido
              │    → bgAlpha (con tolerancia y feather)
              └─ si "habilitar semitono" está activo:
                   luminancia Rec.709
                   → niveles + gamma
                   → trama AM (puntos por celda rotada, radio ∝ √tono)
                   → halftoneAlpha
                          └─ alpha_final = min(alpha_original, bgAlpha, halftoneAlpha)
                                └─ PNG RGBA con chunk pHYs DPI
```

## Pila

HTML/CSS/JS puro, sin frameworks ni librerías externas. Todo se procesa con la API Canvas 2D, `TypedArray`s y matemáticas vectorizables.

## Notas

- El gotero lee el color de la imagen **después** de los ajustes tonales pero **antes** del removedor / semitono. Si cambias brillo o contraste tras seleccionar, el color guardado sigue refiriéndose al valor RGB de ese pixel; puedes re-seleccionar si quieres anclarlo al nuevo color visible.
- Tamaños grandes (32 cm @ 300 DPI ≈ 3780 px) pueden tardar entre 200 y 800 ms por actualización en tiempo real. Para velocidad máxima durante ajustes finos, baja temporalmente el DPI a 150 y súbelo a 300 antes de descargar.
- El backup del backend Python original (versión Flask) se conserva en `semitono_dtf_app.py.bak`.

## Licencia

MIT (o la que prefieras — ajústala antes de subir el repo).
