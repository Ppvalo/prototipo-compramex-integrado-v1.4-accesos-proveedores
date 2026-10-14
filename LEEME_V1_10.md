# CompraMex — prototipo integrado v1.10

Ajuste incremental sobre `prototipo-compramex-integrado-v1.9-proveedores-2026.zip`. Se conservan el portal, los campos, la navegación, las identidades simuladas, los roles, el catálogo documental, las firmas y la trazabilidad del original. **No se reconstruyó la aplicación ni se migró de tecnología.**

## Abrir el prototipo

1. Descomprima el ZIP manteniendo sus carpetas `css`, `js` y `assets` junto a `index.html`.
2. Abra `index.html` en un navegador moderno. Para obtener un origen estable y evitar restricciones propias de archivos locales, se recomienda servir la carpeta por HTTP:

```bash
cd prototipo-compramex-integrado-v1.10-georreferenciacion-mercado-2026
python3 -m http.server 8000
```

Abra <http://localhost:8000>. No se requiere compilar, instalar React ni disponer de claves de API para ejecutar esta demostración.

**Los datos se guardan localmente en el navegador**, como en el original. Use la misma dirección, puerto, perfil de navegador y carpeta para consultar datos guardados. La vista previa y su copia local tienen almacenamientos separados; los datos no se transfieren automáticamente. No use el restablecimiento de demo si desea conservar su captura.

## Proveedores: flujo de comprobación

1. Seleccione **Nuevo proveedor · Registrarme**, capture nombre, RFC y correo e inicie Alta.
2. Abra **Continuar captura** y vaya a **Datos generales**.
3. Capture normalmente los campos del domicilio fiscal. En **Buscar dirección**, revise el texto prellenado o escriba una búsqueda más precisa.
4. Busque, compruebe la ubicación y arrastre el pin al inmueble. También puede seleccionarlo con un clic en el mapa; las flechas del teclado permiten ajustar el pin enfocado.
5. Presione **Confirmar ubicación**. Las coordenadas y la fecha se obtienen automáticamente y no son campos editables.
6. Si selecciona **Sí** en domicilio comercial igual al fiscal, se copian y vinculan todos los campos, coordenadas, confirmación y fecha. No se solicita un segundo mapa.
7. **Editar domicilio comercial** o seleccionar **No** desvincula el comercial. Puede modificarlo y confirmar su ubicación sin afectar al fiscal. Al desvincular se conserva la copia inicial, pero se requiere reconfirmación comercial.
8. Guarde el borrador y recargue/ingrese de nuevo: los mapas se centran en las coordenadas guardadas y restauran el estado correspondiente.

Mover el marcador, volver a buscar o cambiar los campos de dirección invalida la confirmación. Alta/Renovación no pueden continuar después del paso de domicilios, concluir ni enviarse mientras alguno de sus domicilios obligatorios esté pendiente. **Guardar borrador sí está permitido**; no se trata de guardar como completo. Modificación, Duplicado y Reposición conservan sus formularios simplificados originales.

### Datos geográficos

Se mantienen los campos planos originales y se agregan en el mismo formulario:

```text
form.fiscalGeorreferenciacion
form.comercialGeorreferenciacion
  latitud
  longitud
  ubicacion_confirmada
  fecha_confirmacion_ubicacion
form.comercialMismoFiscal: "si" | "no"
```

No existe una ubicación genérica única del proveedor. La información de cada domicilio se conserva por separado, aun cuando el comercial esté vinculado al fiscal.

## Estudio de Mercado: flujo de comprobación

- Use **Catálogo y Estudios de Mercado** y seleccione dependencia, rol e identidad de demostración.
- El **Oficio de Dictamen de Suficiencia Presupuestal** es obligatorio al iniciar una solicitud desde Área Requirente y desde Coordinación Administrativa, así como para el avance posterior. No utiliza pregunta Sí/No; se verifica la existencia de archivo con contenido válido.
- Para anexos de mercado se conservan los formatos y límite originales: **PDF, PNG, JPG o JPEG, máximo 1.5 MB por archivo**.
- Área Requirente envía a Coordinación; Coordinación inicia revisión, confirma sus controles y envía a Oficialía Mayor. Ambos envíos muestran **Solicitud remitida** con el texto solicitado, independientemente de los eventos de trazabilidad.
- El investigador debe **Definir técnicas** antes de **Agregar fuente**. Sin técnicas, el botón está deshabilitado y la lógica bloquea el acceso aunque se altere el control del navegador.
- Fuentes, cotizaciones, cálculo, excepciones, roles y cadena de autorizaciones mantienen las compuertas existentes.
- Los botones numerados para generar fichas tienen nueva jerarquía visual. Cada ficha sigue generándose una sola vez por elemento y después de las autorizaciones requeridas.
- La **Bitácora impresa** concentra las técnicas del estudio, los bienes/servicios y las fuentes en una sola sección. Las fuentes, cálculos y demás apartados por elemento se conservan.

## Mapas y conexión

**Se requiere internet para la cartografía y la búsqueda de direcciones.** Leaflet 1.9.4 y sus imágenes se incluyen localmente. No se usa un CDN para cargar el código de la librería.

- Cartografía: [OpenStreetMap](https://www.openstreetmap.org/copyright).
- Búsqueda: servidor público de demostración [Photon](https://github.com/komoot/photon). La búsqueda es manual, no hay autocompletado; se utiliza caché de sesión y se limita la frecuencia local. Es un servicio de uso moderado sin garantía de disponibilidad; puede limitar solicitudes o cambiar sus condiciones.
- Los endpoints se pueden sustituir en `js/provider-map-config.js`. Para operación institucional multiusuario deben configurarse servicios propios o contratados y controles de frecuencia centralizados.
- Sólo se envía al geocodificador la dirección consultada; no envíe información confidencial a servicios públicos. El prototipo no es una aplicación institucional de producción.
- Si la búsqueda falla o no encuentra una dirección, muestra el error/no coincidencia y permite localizar manualmente sobre el mapa; no inventa coordenadas. Si no carga la cartografía, compruebe la conexión antes de confirmar.

## Pruebas incluidas

Pruebas originales y nuevas en `tests`:

```bash
node --test tests/*.test.cjs
```

Las pruebas integrales requieren Playwright/Chromium y el servidor del prototipo activo. Puede instalar las herramientas en una carpeta independiente, sin modificar la arquitectura de la aplicación:

```bash
mkdir qa
npm install --prefix qa playwright
qa/node_modules/.bin/playwright install chromium
NODE_PATH="$PWD/qa/node_modules" node tests/provider-flow.e2e.cjs
NODE_PATH="$PWD/qa/node_modules" node tests/market-flow.e2e.cjs
```

Por defecto usan <http://127.0.0.1:3000/>. Cambie `TEST_URL` si utiliza otro puerto. Cada ejecución usa un perfil aislado de navegador y datos de prueba; no altera su captura personal. La prueba de proveedores realiza una búsqueda real en Photon y necesita internet. Consulte `INFORME_PRUEBAS_V1_10.md` para los resultados de la entrega.

## Límites originales preservados

Accesos, firmas, autorizaciones e integraciones institucionales siguen siendo demostrativos. El módulo de proveedores conserva archivos sólo durante la sesión, como indicaba el original; las coordenadas sí persisten en `localStorage`. El módulo de mercado conserva anexos en su almacenamiento local conforme a su implementación original. No se agregó almacenamiento central, validación oficial, correo real ni conexión al SAT/Contraloría.
