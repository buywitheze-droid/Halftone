# Semitonos DTF · Separación para prenda negra

Herramienta web para preparar arte con trama de semitono tipo serigrafía / DTF, pensada para impresión sobre prenda **negra**. Genera un PNG con transparencia real donde el negro de la imagen original queda transparente (no se imprime), los blancos quedan sólidos y los grises se convierten en puntos AM rotados.

**100 % en el navegador. Sin backend.** Se puede publicar en GitHub Pages o abrir directamente el `index.html` haciendo doble clic.

## Características

- **Preparación previa**: detecta el tamaño en cm y el DPI embebido de la imagen subida (lee chunk `pHYs` de PNG y segmentos JFIF/EXIF de JPEG), y permite redimensionar al tamaño físico exacto de impresión antes de tramar.
- **Trama AM** (puntos redondos) con control de LPI, ángulo y punto mínimo en mm.
- **Visor estilo Photoshop**: rueda del ratón para zoom centrado en el cursor, clic-arrastrar para mover, atajos `0`, `1`, `+`, `−`, `C`, doble clic para ajustar.
- **Tiempo real**: cualquier slider actualiza el resultado al instante (debounce 180 ms + protección contra colisiones).
- **PNG con DPI embebido**: el archivo descargado lleva el chunk `pHYs` correcto para que el RIP lo lea al tamaño físico exacto.

## Uso

### Abrir localmente

Doble clic en `index.html` y ya. No hace falta servidor.

### Publicar en GitHub Pages

1. Sube el repositorio a GitHub.
2. Settings → Pages → Source: **Deploy from a branch** → Branch: `main` / root → Save.
3. En 1–2 minutos GitHub te da una URL pública del estilo `https://usuario.github.io/repo/`.

## Flujo de trabajo

1. **Sube una imagen** (PNG, JPG o WEBP).
2. **Define el tamaño físico** en cm al que vas a imprimir (con candado de proporción) y el DPI de trabajo (300 por defecto).
3. **Ajusta tonos**: brillo, contraste, nitidez, corte de negro, corte de blanco, gamma.
4. **Configura la trama**: LPI, ángulo, punto mínimo, bordes suaves.
5. **Descarga el PNG transparente** con DPI embebido.

## Cómo funciona el algoritmo

```
imagen original RGBA (canvas)
  └─ resize en alta calidad al tamaño físico destino × DPI elegido
        └─ ajustes tonales: brillo, contraste, nitidez (unsharp 3x3)
              └─ luminancia perceptual Rec. 709
                    └─ normalización por niveles + gamma
                          └─ trama AM (puntos por celda rotada)
                                ├─ luminancia > white_cut → alpha 255 sólido
                                ├─ luminancia < black_cut → alpha 0 transparente
                                └─ medios tonos → radio del punto ∝ √(tono promedio de la celda)
                                                  (descartado si < punto mínimo)
                                      └─ blur suave o threshold según "bordes suaves"
                                            └─ PNG RGBA con chunk pHYs DPI
```

## Pila

HTML/CSS/JS puro, sin frameworks ni librerías externas. Todo el procesamiento se hace con la API Canvas 2D, `TypedArray`s y matemáticas vectorizables.

## Notas

- El cálculo del semitono se hace siempre a la resolución de impresión que elijas. Para tamaños grandes (32 cm @ 300 DPI ≈ 3780 × proporcional) puede tardar algunos cientos de ms por actualización. Si quieres trabajar más rápido en tiempo real, baja temporalmente el DPI a 150 mientras ajustas y súbelo a 300 antes de descargar.
- Para imágenes JPEG con metadata EXIF, lee `XResolution`/`ResolutionUnit`. Si la imagen no trae DPI embebido, asume 72 e indica que es un valor asumido.
- El backup del backend Python (versión Flask original) se conserva en `semitono_dtf_app.py.bak` por si se necesita.

## Licencia

MIT (o la que prefieras — ajústala antes de subir el repo).
