const assert = require('node:assert/strict');
const fs = require('node:fs');

require('../js/market-documents.js');
const MarketDocuments = globalThis.MarketDocuments;
assert(MarketDocuments && typeof MarketDocuments.build === 'function');

const signatures = {
  elaboro: { user: 'Investigadora', when: '2026-09-01' },
  autorizo: { user: 'Titular', when: '2026-09-02' },
  reviso: { user: 'Subdirección', when: '2026-09-03' },
  direccion: { user: 'Dirección', when: '2026-09-04' }
};

const source = (name, technique, price, itemId) => ({
  itemId,
  name,
  rfc: `${itemId}RFC`,
  technique,
  unitPrice: price,
  quoted: true,
  eligible: true,
  technical: true,
  comparable: true,
  fiscal: 'Válido',
  controller: 'No objetada',
  evidence: `Evidencia de ${name}`
});

const oneItem = {
  request: { folio: 'CAT-TEST-0001', dependency: 'Dependencia DEMO', adminCoord: 'CA DEMO', description: 'Bien único', created: '2026-09-01' },
  study: {
    folio: 'EM-TEST-0001',
    state: 'Autorizado',
    logGenerated: true,
    signatures,
    techniques: ['Consulta de precios de campo'],
    itemDocuments: { '1': true },
    sources: []
  },
  items: [{
    id: '1', key: 'K-1', name: 'Bien único', specification: 'Especificación 1', unit: 'Pieza', part: '2111',
    techniques: ['Consulta a precios históricos mediante modelo estadístico'],
    sources: [source('Fuente Uno', 'Segmentación de mercado', 100, '1')],
    result: 'AUTORIZADA'
  }],
  audit: []
};

const oneHtml = MarketDocuments.build('log', oneItem);
assert.equal((oneHtml.match(/<h2>Técnicas de mercado<\/h2>/g) || []).length, 1);
assert.equal((oneHtml.match(/Técnicas de estudio de mercado efectuado/g) || []).length, 0);
assert(oneHtml.includes('Fuente Uno'));
assert(oneHtml.includes('Consulta a precios históricos mediante modelo estadístico'));
assert(oneHtml.includes('Consulta de precios en campo'));
assert(oneHtml.includes('Segmentación de mercado'));

const many = {
  ...oneItem,
  request: { ...oneItem.request, folio: 'CAT-TEST-0002' },
  study: {
    ...oneItem.study,
    folio: 'EM-TEST-0002',
    techniques: ['Solicitud de precios de mercado vía electrónica'],
    itemDocuments: { '1': true, '2': true }
  },
  items: [
    oneItem.items[0],
    {
      id: '2', key: 'K-2', name: 'Servicio dos', specification: 'Alcance 2', unit: 'Servicio', part: '3331',
      techniques: ['Comercio electrónico'],
      sources: [source('Fuente Dos', 'Técnica Mystery Shopper', 200, '2')],
      result: 'AUTORIZADA'
    }
  ]
};
const manyHtml = MarketDocuments.build('log', many);
assert.equal((manyHtml.match(/<h2>Técnicas de mercado<\/h2>/g) || []).length, 1);
assert(manyHtml.includes('Fuente Uno') && manyHtml.includes('Fuente Dos'));
assert(manyHtml.includes('Comercio electrónico'));
assert(manyHtml.includes('Técnica Mystery Shopper'));
assert(manyHtml.includes('Solicitud de precios de mercado vía electrónica'));

// La ficha sólo se puede abrir tras generar el documento para el elemento.
const itemHtml = MarketDocuments.build('item', { ...oneItem, item: oneItem.items[0] });
assert(itemHtml.includes('Seis campos del formato'));
assert.throws(() => MarketDocuments.build('item', {
  ...oneItem,
  study: { ...oneItem.study, itemDocuments: {} },
  item: oneItem.items[0]
}), /ficha del elemento aún no está generada/);

// Guardias de interfaz/lógica y dictamen real: comprobación estática complementaria al flujo del generador.
const catalog = fs.readFileSync(require.resolve('../js/catalog-market.js'), 'utf8');
assert.match(catalog, /Documento obligatorio que debe presentar para estar en condiciones de iniciar la solicitud\./);
assert.match(catalog, /if\(!isDocumentAvailable\(sufficiencyDocument\)\)/);
assert.match(catalog, /sufficiency\?'':`<div class="document-presence">/);
assert.match(catalog, /data-add-source \$\{studyTechniques\(s\)\.length\?'':'disabled/);
assert.match(catalog, /if\(!techniques\.length\)return toast\('Defina al menos una técnica/);
assert.match(catalog, /if\(!studyTechniques\(s\)\.length\)return toast\('Defina al menos una técnica/);
assert.doesNotMatch(catalog, /s\.techniques\.length\?s\.techniques:MARKET_TECHNIQUES/);
assert.match(catalog, /showSubmissionMessage\(AREA_TO_CA_REMITTAL/);
assert.match(catalog, /showSubmissionMessage\(CA_TO_OM_REMITTAL/);

console.log('OK: Bitácora consolidada, fuentes/técnicas, disponibilidad documental y guardias de mercado');

// Verificar la unión efectiva de marcas X, no sólo las etiquetas del catálogo.
const techniqueSection = html => html.match(/<h2>Técnicas de mercado<\/h2>[\s\S]*?<\/section>/)[0];
const marked = (html, label) => techniqueSection(html).includes(`<td>${label}</td><td><strong>X</strong>`);
assert(marked(oneHtml, 'Consulta a precios históricos mediante modelo estadístico'));
assert(marked(oneHtml, 'Consulta de precios en campo'));
assert(marked(oneHtml, 'Segmentación de mercado'));
assert.equal((techniqueSection(oneHtml).match(/<strong>X<\/strong>/g)||[]).length,3);
['Consulta a precios históricos mediante modelo estadístico','Solicitud de precios de mercado vía electrónica','Segmentación de mercado','Comercio electrónico','Técnica Mystery Shopper'].forEach(t=>assert(marked(manyHtml,t)));
const onlyGlobalSources = MarketDocuments.build('log', {
  ...oneItem,
  study: {...oneItem.study,techniques:[],sources:[source('Global','Comercio electrónico',100,'1')]},
  items: [{...oneItem.items[0],techniques:[],sources:[]}]
});
assert(marked(onlyGlobalSources,'Comercio electrónico'));
assert.equal((techniqueSection(onlyGlobalSources).match(/<strong>X<\/strong>/g)||[]).length,1);
assert.doesNotMatch(catalog,/Obligatorio cuando aplica/);
console.log('OK: marcas X consolidadas de técnicas por estudio, bienes, servicios y fuentes globales');
