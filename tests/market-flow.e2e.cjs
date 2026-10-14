/* Ejecutar con Playwright instalado y servidor del prototipo activo. */
const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const STORAGE='compramexCatalogMarketDemoV1_3';
const image={name:'documento-prueba.png',mimeType:'image/png',buffer:Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+jZyoAAAAASUVORK5CYII=','base64')};
(async()=>{
  const browser=await chromium.launch({headless:true,args:['--no-sandbox']});
  const page=await browser.newPage({viewport:{width:1440,height:1000}});
  const errors=[];page.on('pageerror',e=>errors.push(e.message));
  const checks=[];const ok=x=>{checks.push(x);console.log('OK:',x);};
  const output=process.env.TEST_OUTPUT_DIR||'/tmp/compramex-market-tests';fs.mkdirSync(output,{recursive:true});
  const data=()=>page.evaluate(k=>JSON.parse(localStorage.getItem(k)),STORAGE);
  const accept=()=>page.locator('#modalActions button').first().click();
  const login=async(role,name='Usuario QA')=>{
    if(await page.locator('#modal').isVisible())await page.locator('#modalClose').click();
    await page.locator('#goPublic').click();await page.locator('#catalogAccessBtn').click();
    await page.locator('#catalogDependencySelect').selectOption('234');await page.locator('#catalogRoleSelect').selectOption(role);
    if(role==='investigador')await page.locator('#investigatorActor').selectOption('Ana Martínez');else await page.locator('#catalogActor').fill(name);
    await page.locator('#catalogLoginBtn').click();
  };
  const openRequest=async folio=>{await page.locator('[data-cat-route="cat-requests"]').click();await page.locator('#reqSearch').fill(folio);await page.locator(`[data-open-request="${folio}"]`).click();};
  const openStudy=async folio=>{await page.locator('[data-cat-route="cat-studies"]').click();await page.locator(`[data-open-study="${folio}"]`).click();};
  const fillItem=async n=>{
    await page.locator(`[name="itemDescription-${n}"]`).fill(`Equipo de cómputo de prueba ${n+1}`);await page.locator(`[name="itemSpecs-${n}"]`).fill(`Especificaciones homogéneas de prueba ${n+1}`);
    await page.locator(`[name="itemPartida-${n}"]`).selectOption('5151');
    await page.locator(`[name="${n}-docFichaFile"]`).setInputFiles(image);await page.locator(`[name="${n}-docSpecsFile"]`).setInputFiles(image);
  };
  await page.goto(process.env.TEST_URL||'http://127.0.0.1:3000/',{waitUntil:'networkidle'});
  assert.equal(await page.locator('#catalogAccessBtn').innerText(),'Catálogo y Estudios de Mercado');
  await login('area','Área QA');await page.locator('#catalogQuery').fill('nuevo equipo QA');await page.locator('#catalogSearchBtn').click();await page.locator('[data-new-request]').click();
  const card=page.locator('[data-doc-card="request-docSuficiencia"]');
  assert.match(await card.innerText(),/Documento obligatorio que debe presentar para estar en condiciones de iniciar la solicitud\./);
  assert.equal(await card.locator('input[type=radio]').count(),0);assert.equal(await page.getByText('Obligatorio cuando aplica',{exact:true}).count(),0);ok('Acceso, nueva leyenda y ausencia de radios en el Dictamen; leyenda prohibida retirada.');
  await page.locator('[name="giro"]').selectOption({label:'Tecnologías de información'});await page.locator('[name="justification"]').fill('Prueba integral con dos bienes y requisitos obligatorios.');await fillItem(0);await page.locator('#addRequestItem').click();await fillItem(1);
  await page.locator('#catalogRequestForm button[type="submit"]').click();assert.match(await page.locator('#modalBody').innerText(),/Debe cargar el Oficio de Dictamen/);assert.notEqual(await page.locator('#modalTitle').innerText(),'Solicitud remitida');await accept();ok('Área no puede continuar sin archivo real de Dictamen, y no se muestra éxito falso.');
  await page.locator('[name="request-docSuficienciaFile"]').setInputFiles({name:'invalido.pdf',mimeType:'application/pdf',buffer:Buffer.from('contenido incorrecto')});
  await page.locator('#catalogRequestForm button[type="submit"]').click();await page.waitForFunction(()=>document.querySelector('#modalBody').textContent.includes('no corresponde'));assert.match(await page.locator('#modalBody').innerText(),/no corresponde/);await accept();ok('Un archivo con extensión PDF pero contenido inválido no satisface el requisito.');
  await page.locator('[name="request-docSuficienciaFile"]').setInputFiles(image);await page.locator('#catalogRequestForm button[type="submit"]').click();
  await page.waitForFunction(()=>document.querySelector('#modalTitle').textContent==='Solicitud remitida');
  assert.equal((await page.locator('#modalBody').innerText()).trim(),'La solicitud ha sido remitida a la Coordinación Administrativa para su revisión y, en su caso, envío a la Oficialía Mayor.');
  let d=await data();const r=d.requests[0],folio=r.folio;assert.equal(r.items.length,2);assert.equal(r.sufficiencyDocument.present,true);assert.ok(r.sufficiencyDocument.url);assert.equal(r.caStage,'received');assert.ok(r.timeline.some(x=>x.label==='Solicitud enviada a Coordinación Administrativa'));ok('Archivo válido permite Área→CA; mensaje exacto y trazabilidad conservada.');
  await accept();await page.locator('#modalActions [data-close]').click();
  await login('ca','Coordinación QA');await openRequest(folio);await page.locator('[data-start-ca-review]').click();await openRequest(folio);await page.locator('[data-ca-review]').click();
  await page.locator('[data-send]').click();assert.notEqual(await page.locator('#modalTitle').innerText(),'Solicitud remitida');assert.match(await page.locator('#modalBody').innerText(),/Confirme la revisión/);await accept();ok('CA sin revisión completa no muestra remisión exitosa.');
  await openRequest(folio);await page.locator('[data-ca-review]').click();await page.locator('#caCheckItems').check();await page.locator('#caCheckDocs').check();await page.locator('[data-send]').click();
  assert.equal(await page.locator('#modalTitle').innerText(),'Solicitud remitida');assert.equal((await page.locator('#modalBody').innerText()).trim(),'La solicitud ha sido remitida a la Oficialía Mayor para su atención y continuidad del proceso.');d=await data();let sent=d.requests.find(x=>x.folio===folio);assert.equal(sent.sentToOfficialia,true);assert.ok(sent.timeline.some(x=>x.label==='Solicitud enviada correctamente'));ok('CA→Oficialía Mayor muestra mensaje exacto sólo tras envío y conserva eventos anteriores.');await accept();
  await page.locator('[data-cat-route="cat-catalog"]').click();await page.locator('#catalogQuery').fill('otro equipo QA');await page.locator('[data-new-request]').click();await page.locator('[name="giro"]').selectOption({label:'Tecnologías de información'});await page.locator('[name="justification"]').fill('Alta directa de prueba');await fillItem(0);await page.locator('#catalogRequestForm button[type="submit"]').click();assert.match(await page.locator('#modalBody').innerText(),/Debe cargar el Oficio de Dictamen/);await accept();ok('Dictamen también es siempre obligatorio para el inicio directo por Coordinación Administrativa.');
  await page.locator('[name="request-docSuficienciaFile"]').setInputFiles(image);await page.locator('#catalogRequestForm button[type="submit"]').click();await page.waitForFunction(()=>document.querySelector('#modalTitle').textContent.startsWith('Expediente CAT'));ok('Inicio directo CA continúa al cargar un Dictamen válido.');await page.locator('#modalActions [data-close]').click();
  await login('titular','Titular QA');await openRequest(folio);await page.locator('[data-assign]').click();await page.locator('#assignInvestigator').selectOption('Ana Martínez');await page.locator('[data-save-assign]').click();
  await login('investigador');await openRequest(folio);await page.locator('[data-art28]').click();for(const x of await page.locator('[data-a28]').all())await x.check();await page.locator('[data-sufficient]').click();d=await data();const sf=d.requests.find(x=>x.folio===folio).study;assert.ok(sf);await openStudy(sf);ok('Asignación y revisión documental originales crean un estudio con dos bienes.');
  assert.equal(await page.locator('[data-add-source]').isDisabled(),true);
  await page.locator('[data-add-source]').evaluate(b=>{b.disabled=false;b.click();});assert.match(await page.locator('#modalBody').innerText(),/Defina al menos una técnica antes de agregar fuentes/);await accept();await openStudy(sf);ok('Agregar fuente inicia deshabilitado y la guardia lógica bloquea intentos de evadirlo.');
  await page.locator('[data-techniques]').click();await page.locator('[data-market-tech]').nth(0).check();await page.locator('[data-market-tech]').nth(1).check();await page.locator('[data-save-tech]').click();assert.equal(await page.locator('[data-add-source]').isDisabled(),false);ok('Guardar técnicas habilita Agregar fuente.');
  for(const id of ['1','2'])for(const [provider,price] of [['PAD-001','100'],['PAD-002','120']]){
    await page.locator('[data-add-source]').click();await page.locator('#srcItem').selectOption(id);await page.locator('#srcProvider').selectOption(provider);await page.locator('#srcPrice').fill(price);await page.locator('#srcEvidence').fill('Evidencia de cotización válida para prueba integral');
    for(const key of ['srcTechnical','srcComparable','srcFiscal','srcController'])await page.locator('#'+key).check();await page.locator('[data-save-source]').click();
  }
  d=await data();assert.equal(d.studies.find(x=>x.folio===sf).sources.length,4);ok('Se agregan fuentes asociadas a técnica y bien, manteniendo validaciones existentes.');
  await page.locator('[data-validate-sources]').click();await page.locator('[data-calc-ref]').click();await page.locator('[data-save-price]').click();await page.locator('[data-sign-elab]').click();
  await login('titular','Titular QA');await openStudy(sf);await page.locator('[data-sign-auth]').click();await login('subdireccion','Subdirección QA');await openStudy(sf);await page.locator('[data-sign-review]').click();await login('direccion','Dirección QA');await openStudy(sf);await page.locator('[data-sign-dir]').click();await page.locator('[data-resolve]').click();ok('Precio y cadena de firmas Elaboró→Titular→Subdirección→Dirección se conservan.');
  await login('titular','Titular QA');await openStudy(sf);
  assert.equal(await page.locator('.market-generate-ficha-btn').count(),2);assert.match(await page.locator('[data-generate-item="1"]').innerText(),/1$/);assert.match(await page.locator('[data-generate-item="2"]').innerText(),/2$/);
  await page.locator('#modalActions').screenshot({path:path.join(output,'botones-fichas.png')});
  await page.locator('[data-generate-log]').click();await page.locator('[data-generate-item="1"]').click();await page.locator('[data-generate-item="2"]').click();d=await data();assert.equal(Object.keys(d.studies.find(x=>x.folio===sf).itemDocuments).length,2);ok('Botones modernizados mantienen numeración y generan dos fichas independientes.');
  for(const id of ['1','2']){const popupPromise=page.waitForEvent('popup');await page.locator(`[data-item-doc="${id}"]`).click();const popup=await popupPromise;await popup.waitForLoadState();assert.match(await popup.locator('h1').innerText(),/Ficha de Estudio de Mercado/);await popup.close();}ok('Ambas fichas generadas abren correctamente conservando su funcionalidad.');
  const p2=page.waitForEvent('popup');await page.locator('[data-doc="log"]').click();const log2=await p2;await log2.waitForLoadState();
  assert.equal(await log2.locator('h2').filter({hasText:/^Técnicas de mercado$/}).count(),1);assert.match(await log2.locator('body').innerText(),/Equipo de cómputo de prueba 1/);assert.match(await log2.locator('body').innerText(),/Equipo de cómputo de prueba 2/);await log2.emulateMedia({media:'print'});await log2.pdf({path:path.join(output,'bitacora-varios-bienes.pdf'),format:'A4',printBackground:true});await log2.close();ok('Bitácora impresa con varios bienes presenta una sola sección de Técnicas de mercado.');
  await page.locator('#modalActions [data-close]').click();await openStudy('EM-2026-0106');const p1=page.waitForEvent('popup');await page.locator('[data-doc="log"]').click();const log1=await p1;await log1.waitForLoadState();assert.equal(await log1.locator('h2').filter({hasText:/^Técnicas de mercado$/}).count(),1);await log1.emulateMedia({media:'print'});await log1.pdf({path:path.join(output,'bitacora-un-bien.pdf'),format:'A4',printBackground:true});await log1.close();ok('Bitácora impresa de un bien también conserva una sola sección de técnicas.');
  // Preparar explícitamente un expediente devuelto en el perfil aislado de prueba.
  const setReturned=async({clear=false}={})=>{
    await page.evaluate(({key,folio,clear})=>{const s=JSON.parse(localStorage.getItem(key));const r=s.requests.find(x=>x.folio===folio);r.state='Requiere información';r.caStage='returned';r.sentToOfficialia=false;r.notes='Observaciones de prueba';r.sufficiencyDocument.present=false;if(clear)r.sufficiencyDocument.url='';localStorage.setItem(key,JSON.stringify(s));},{key:STORAGE,folio,clear});
    await page.reload({waitUntil:'networkidle'});await login('area','Área QA');await openRequest(folio);await page.locator('[data-remedy]').click();
  };
  await setReturned();assert.equal(await page.locator('[data-doc-card="request-docSuficiencia"] input[type=radio]').count(),0);
  const previous=(await data()).requests.find(x=>x.folio===folio).sufficiencyDocument.url;
  await page.locator('#remedyNotes').fill('Se atendieron las observaciones sin sustituir el Dictamen válido.');await page.locator('[data-remedy-save]').click();await page.waitForFunction(()=>document.querySelector('#modalTitle').textContent==='Solicitud remitida');
  assert.equal((await data()).requests.find(x=>x.folio===folio).sufficiencyDocument.url,previous);ok('Subsanación conserva archivo previo válido y migra la antigua selección No sin exigir radios.');
  await setReturned();await page.locator('[data-doc-card="request-docSuficiencia"] [data-doc-file]').setInputFiles({...image,name:'dictamen-reemplazo.png'});await page.locator('#remedyNotes').fill('Se sustituyó el Dictamen.');await page.locator('[data-remedy-save]').click();await page.waitForFunction(()=>document.querySelector('#modalTitle').textContent==='Solicitud remitida');
  assert.equal((await data()).requests.find(x=>x.folio===folio).sufficiencyDocument.filename,'dictamen-reemplazo.png');ok('Reemplazar Dictamen en subsanación carga correctamente y conserva historial de versiones.');
  await setReturned({clear:true});await page.locator('#remedyNotes').fill('Intento sin documento.');await page.locator('[data-remedy-save]').click();await page.waitForFunction(()=>document.querySelector('#modalTitle').textContent==='Información');assert.match(await page.locator('#modalBody').innerText(),/No puede reenviar/);ok('Subsanación no avanza con nombre/metadatos si no existe archivo válido.');
  await accept();await openRequest(folio);await page.locator('[data-remedy]').click();await page.locator('[data-doc-card="request-docSuficiencia"] [data-doc-file]').setInputFiles(image);await page.locator('#remedyNotes').fill('Prueba de fallo de almacenamiento.');
  await page.evaluate(key=>{const original=Storage.prototype.setItem;window.restoreTestStorage=()=>{Storage.prototype.setItem=original;};Storage.prototype.setItem=function(k,v){if(k===key)throw new DOMException('Cuota de prueba','QuotaExceededError');return original.call(this,k,v);};},STORAGE);
  await page.locator('[data-remedy-save]').click();await page.waitForFunction(()=>document.querySelector('#modalBody').textContent.includes('almacenamiento'));assert.notEqual(await page.locator('#modalTitle').innerText(),'Solicitud remitida');await page.evaluate(()=>window.restoreTestStorage());ok('Un fallo de almacenamiento en la remisión no muestra Solicitud remitida.');
  assert.deepEqual(errors,[]);ok('Sin errores JavaScript durante solicitudes, subsanación, estudios, fichas y reportes.');
  fs.writeFileSync(path.join(output,'market-e2e.json'),JSON.stringify({passed:checks.length,checks,errors,folio,study:sf},null,2));await browser.close();
})().catch(e=>{console.error(e);process.exit(1);});
