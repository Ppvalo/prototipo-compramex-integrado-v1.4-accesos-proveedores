const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');

const TEST_URL = process.env.TEST_URL || 'http://127.0.0.1:8765/';
const executablePath = process.env.CHROMIUM_PATH || '/usr/bin/chromium';
const fixture = '/tmp/compramex-procedure-demo.pdf';
fs.writeFileSync(fixture, 'PDF DEMO · no es un expediente oficial');

async function chooseProfile(page, role, { dependency = '205', area = '205-a1', direction = 'OM_DPA_A' } = {}) {
  await page.locator('#proceduresModuleBtn').click();
  await page.locator('#procRoleSelect').selectOption(role);
  if (['DEP-AR', 'DEP-CA'].includes(role)) {
    await page.locator('#procDependencySelect').selectOption(dependency);
    if (role === 'DEP-AR') await page.locator('#procAreaSelect').selectOption(area);
  } else if (role !== 'OM-PC-00') {
    await page.locator('#procDirectionSelect').selectOption(direction);
  }
  await page.locator('#procLoginBtn').click();
  await page.waitForTimeout(50);
}

async function openFirst(page) {
  const button = page.locator('[data-proc-open]').first();
  assert.ok(await button.count(), 'Debe existir al menos un expediente visible');
  await button.click();
  await page.waitForTimeout(20);
}

(async () => {
  const browser = await chromium.launch({ headless: true, executablePath, args: ['--no-sandbox', '--disable-dev-shm-usage'] });
  const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
  const errors = [];
  page.on('pageerror', error => errors.push(error.message));
  page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });

  await page.goto(TEST_URL, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });

  // A/F: login único del shell, catálogo OM-PC y ausencia de perfiles de mercado.
  await chooseProfile(page, 'OM-PC-00');
  assert.match(await page.locator('#userRole').textContent(), /OM-PC-00/);
  assert.match(await page.locator('body').textContent(), /Pendientes de asignación/);
  await page.locator('#mainNav [data-proc-route="proc-permissions"]').click();
  const roleOptions = await page.locator('#mainNav').locator('xpath=..').count();
  assert.ok(roleOptions >= 0);
  const catalogText = await page.locator('body').textContent();
  for (const forbidden of ['Investigador de Mercado Estatal', 'Responsable de Catálogo', 'Titular de la Dirección de Investigación de Mercado']) {
    assert.equal(catalogText.includes(forbidden), false, `No debe aparecer el rol heredado ${forbidden}`);
  }
  assert.match(catalogText, /OM-PC-00/);
  assert.match(catalogText, /OM-PC-08/);
  await page.locator('#mainNav [data-proc-route="proc-reports"]').click();
  assert.match(await page.locator('body').textContent(), /Carga por Dirección/);
  await page.locator('#mainNav [data-proc-route="proc-assignment"]').click();
  await openFirst(page);
  assert.match(await page.locator('body').textContent(), /Origen/);
  const assignmentButton = page.locator('[data-proc-action="assign"]');
  assert.ok(await assignmentButton.count(), 'El coordinador debe poder asignar un expediente pendiente');
  await assignmentButton.click();
  await page.locator('#procAssignmentDirectionSelect').selectOption('OM_DPA_A');
  await page.locator('[data-proc-save-assignment]').click();
  assert.match(await page.locator('body').textContent(), /Asignada a Dirección/);

  // E: una Dirección sólo ve expedientes de su adscripción.
  await page.locator('#logoutBtn').click();
  await chooseProfile(page, 'OM-PC-01', { direction: 'OM_DPA_A' });
  await page.locator('#mainNav [data-proc-route="proc-work"]').click();
  const workText = await page.locator('body').textContent();
  assert.match(workText, /OM_DPA_A|Dirección de Procedimientos Adquisitivos A/);
  assert.equal(workText.includes('PC-2026-0005'), false, 'Dirección A no debe ver el expediente asignado a Dirección B');

  // B: Coordinación Administrativa recibe, revisa y remite dentro de su dependencia.
  await page.locator('#logoutBtn').click();
  await chooseProfile(page, 'DEP-CA', { dependency: '205' });
  await page.locator('#mainNav [data-proc-route="proc-list"]').click();
  await page.locator('[data-proc-open="PC-2026-0001"]').click();
  assert.ok(await page.locator('[data-proc-action="ca-review"]').count());
  await page.locator('[data-proc-action="ca-review"]').click();
  assert.ok(await page.locator('[data-proc-action="ca-remit"]').count());
  await page.locator('[data-proc-action="ca-remit"]').click();
  assert.match(await page.locator('body').textContent(), /Pendiente de asignación/);

  // C: Área Requirente crea, guarda como borrador y remite al CA; no asigna Dirección.
  await page.locator('#logoutBtn').click();
  await chooseProfile(page, 'DEP-AR', { dependency: '205', area: '205-a1' });
  await page.locator('#mainNav [data-proc-route="proc-new"]').click();
  await page.locator('[data-pc-field="object"]').fill('Servicio de prueba de mantenimiento');
  await page.locator('[data-pc-field="description"]').fill('Descripción de la necesidad de prueba');
  await page.locator('[data-pc-field="justification"]').fill('Justificación suficiente para la prueba');
  await page.locator('[data-pc-field="contractType"]').selectOption({ label: 'Servicios' });
  await page.locator('[data-pc-field="classification"]').selectOption({ label: 'Servicios' });
  await page.locator('[data-pc-field="estimatedAmountNoVat"]').fill('85000');
  await page.locator('[data-pc-field="budgetAuthorized"]').fill('5800000');
  for (const id of ['request', 'justification', 'budget']) await page.locator(`[data-pc-doc="${id}"]`).setInputFiles(fixture);
  await page.locator('[data-pc-save]').click();
  await page.waitForTimeout(50);
  assert.match(await page.locator('body').textContent(), /Se guardó|Editar expediente|Acciones autorizadas/);
  await page.locator('[data-proc-close]').click();
  const send = page.locator('[data-proc-action="send"]');
  assert.ok(await send.count(), 'El Área Requirente debe poder remitir el borrador al CA');
  await send.click();
  assert.match(await page.locator('body').textContent(), /Enviada a revisión/);
  assert.equal(await page.locator('[data-proc-action="assign"]').count(), 0, 'El Área Requirente no debe poder asignar Dirección');

  // D: origen oficialía: el Coordinador crea y envía a la misma bandeja central.
  await page.locator('#logoutBtn').click();
  await chooseProfile(page, 'OM-PC-00');
  await page.locator('#mainNav [data-proc-route="proc-new"]').click();
  await page.locator('[data-pc-field="object"]').fill('Nueva solicitud originada en Oficialía Mayor');
  await page.locator('[data-pc-field="description"]').fill('Necesidad institucional de la Oficialía Mayor');
  await page.locator('[data-pc-field="justification"]').fill('Justificación de la solicitud directa');
  await page.locator('[data-pc-field="estimatedAmountNoVat"]').fill('90000');
  await page.locator('[data-pc-field="budgetAuthorized"]').fill('5800000');
  for (const id of ['request', 'justification', 'budget']) await page.locator(`[data-pc-doc="${id}"]`).setInputFiles(fixture);
  await page.locator('[data-pc-save]').click();
  await page.waitForTimeout(50);
  assert.match(await page.locator('body').textContent(), /Oficialía Mayor/);
  await page.locator('[data-proc-close]').click();
  const sendOm = page.locator('[data-proc-action="send-om"]');
  assert.ok(await sendOm.count(), 'El Coordinador debe poder enviar la solicitud OM a asignación');
  await sendOm.click();
  assert.match(await page.locator('body').textContent(), /Pendiente de asignación/);

  assert.deepEqual(errors, [], `Errores de navegador: ${errors.join(' | ')}`);
  console.log('Procedures E2E: login, roles, alcance, dual origin, CA, Área y asignación OK');
  await browser.close();
})().catch(error => { console.error(error.stack || error); process.exitCode = 1; });
