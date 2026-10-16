

## 7. Revalidación de módulos existentes

Se repitieron en Chromium los flujos históricos de los módulos que comparten el shell:

- **Proveedores:** 16 comprobaciones correctas, incluyendo domicilios, mapas, persistencia, reenvío y acceso posterior a Estudios de Mercado; sin errores JavaScript.
- **Catálogo y Estudios de Mercado:** 22 comprobaciones correctas, incluyendo Dictamen, remisiones, técnicas, fuentes, firmas, fichas, bitácoras y fallos de almacenamiento; sin errores JavaScript.

Durante la primera ejecución se detectó que la inicialización de `procedures.js` llamaba a `showOnly('public')` aun cuando otro módulo había restaurado una sesión activa después de recargar. Se eliminó esa interferencia: el módulo de Procedimientos sólo restaura su workspace cuando su propia sesión v2 está activa. Después de la corrección, los dos E2E históricos y el E2E de Procedimientos pasaron.
