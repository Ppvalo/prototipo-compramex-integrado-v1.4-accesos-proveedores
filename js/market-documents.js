(function (root) {
  'use strict';

  var TYPES = {
    log: 'Bitácora de Estudio de Mercado',
    item: 'Ficha de Estudio de Mercado',
    result: 'Dictamen / Oficio de Resultado',
    communication: 'Oficio / Aviso'
  };

  var TYPE_SLUGS = {
    log: 'bitacora-estudio-mercado',
    item: 'ficha-estudio-mercado',
    result: 'dictamen-resultado',
    communication: 'oficio-aviso'
  };

  var DOCUMENT_CSS = [
    ':root{--wine:#7a1737;--wine-dark:#5f102a;--gold:#b28854;--ink:#252525;--muted:#69717d;--line:#dedede;--paper:#fff;--soft:#f7f2ee;--ok:#1f7a4d;--warn:#9a5a05;--bad:#9b2d2d}',
    '*{box-sizing:border-box}',
    '@page{size:A4;margin:16mm 14mm}',
    'html,body{margin:0;padding:0;background:#f2f2f0;color:var(--ink);font-family:Inter,Segoe UI,Arial,sans-serif;font-size:13px;line-height:1.45}',
    'body{padding:28px 18px}',
    '.md-page{max-width:1080px;margin:0 auto;background:var(--paper);border:1px solid var(--line);box-shadow:0 8px 28px rgba(0,0,0,.08);padding:34px 40px 44px}',
    '.md-topline{height:7px;background:var(--wine);margin:-34px -40px 26px}',
    '.md-head{display:grid;grid-template-columns:1fr auto;gap:24px;align-items:start;border-bottom:2px solid var(--wine);padding-bottom:18px;margin-bottom:20px}',
    '.md-kicker{color:var(--wine);font-size:10px;font-weight:800;letter-spacing:.14em;text-transform:uppercase}',
    '.md-head h1{font-size:25px;line-height:1.15;margin:5px 0 7px;color:var(--wine-dark)}',
    '.md-head p{margin:0;color:var(--muted);max-width:720px}',
    '.md-mark{width:70px;height:70px;border:2px solid var(--wine);color:var(--wine);display:grid;place-items:center;font-size:12px;font-weight:900;letter-spacing:.08em;text-align:center}',
    '.md-banner{border-left:4px solid var(--gold);background:var(--soft);padding:12px 15px;margin:0 0 20px;color:#604d3d}',
    '.md-section{margin-top:22px;break-inside:avoid}',
    '.md-section h2{font-size:15px;color:var(--wine);border-bottom:1px solid var(--line);padding-bottom:7px;margin:0 0 11px}',
    '.md-section h3{font-size:13px;color:var(--wine-dark);margin:17px 0 8px}',
    '.md-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px 12px}',
    '.md-field{border:1px solid var(--line);padding:9px 10px;min-height:49px;background:#fff}',
    '.md-field.wide{grid-column:span 2}',
    '.md-field.full{grid-column:1/-1}',
    '.md-field label{display:block;color:var(--muted);font-size:10px;font-weight:800;letter-spacing:.04em;text-transform:uppercase;margin-bottom:3px}',
    '.md-field strong{font-weight:700;overflow-wrap:anywhere}',
    '.md-table-wrap{overflow-x:auto}',
    'table{width:100%;border-collapse:collapse;margin:0;min-width:640px}',
    'th,td{text-align:left;vertical-align:top;border:1px solid var(--line);padding:7px 8px;overflow-wrap:anywhere}',
    'th{background:var(--wine);color:#fff;font-size:10px;line-height:1.25;text-transform:uppercase;letter-spacing:.04em}',
    'td{font-size:11px}',
    'tbody tr:nth-child(even){background:#fbfbfa}',
    '.md-subtable{margin-top:8px}',
    '.md-note{border:1px solid #e6d5c7;background:#fffaf5;padding:11px 13px;margin-top:10px}',
    '.md-note strong{color:var(--wine-dark)}',
    '.md-list{margin:5px 0 0;padding-left:19px}',
    '.md-list li{margin:3px 0}',
    '.md-empty{color:var(--muted);font-style:italic}',
    '.md-status{display:inline-block;border-radius:99px;padding:3px 8px;font-size:10px;font-weight:800;background:#eee}',
    '.md-status.ok{background:#e4f5eb;color:#16643d}',
    '.md-status.bad{background:#fee6e6;color:#922d2d}',
    '.md-status.review{background:#fff1d7;color:#80510a}',
    '.md-footer{margin-top:30px;padding-top:12px;border-top:1px solid var(--line);display:flex;justify-content:space-between;gap:15px;color:var(--muted);font-size:10px}',
    '.md-preview-controls{max-width:1080px;margin:0 auto 12px;display:flex;justify-content:flex-end;gap:8px}',
    '.md-preview-controls button{border:0;border-radius:8px;padding:9px 14px;background:var(--wine);color:#fff;font-weight:700;cursor:pointer}',
    '.md-preview-controls button.secondary{background:#e9e9e9;color:#333}',
    '.md-small{font-size:11px;color:var(--muted)}',
    '.md-separate{border:2px solid var(--wine);padding:12px 14px;font-weight:800;color:var(--wine-dark);background:#fff}',
    '.md-decision{font-size:18px;font-weight:900;letter-spacing:.05em;color:var(--wine-dark)}',
    '@media(max-width:760px){body{padding:10px}.md-page{padding:24px 18px 32px}.md-topline{margin:-24px -18px 20px}.md-head{grid-template-columns:1fr}.md-mark{display:none}.md-grid{grid-template-columns:1fr}.md-field.wide,.md-field.full{grid-column:auto}.md-footer{display:block}.md-footer span{display:block;margin-top:4px}}',
    '@media print{html,body{background:#fff;font-size:11px}body{padding:0}.md-page{max-width:none;border:0;box-shadow:none;padding:0}.md-topline{margin:0 0 18px}.md-preview-controls{display:none}.md-section{break-inside:avoid}.md-table-wrap{overflow:visible}table{min-width:0}.md-head h1{font-size:22px}a{color:inherit;text-decoration:none}}',
  ].join('');

  function isObject(value) {
    return value !== null && typeof value === 'object';
  }

  function array(value) {
    return Array.isArray(value) ? value : [];
  }

  function valueOf(value, fallback) {
    return value === null || value === undefined || value === '' ? fallback : value;
  }

  function esc(value) {
    return String(value === null || value === undefined ? '' : value).replace(/[&<>"']/g, function (character) {
      return {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#39;'
      }[character];
    });
  }

  function display(value, fallback) {
    return esc(valueOf(value, fallback === undefined ? '—' : fallback));
  }

  function text(value, fallback) {
    var result = valueOf(value, fallback === undefined ? '' : fallback);
    if (Array.isArray(result)) return result.map(function (entry) { return String(entry); }).join(' · ');
    if (isObject(result)) {
      if (result.label !== undefined) return String(result.label);
      if (result.name !== undefined) return String(result.name);
      return '';
    }
    return String(result);
  }

  function pick(object, names, fallback) {
    if (!isObject(object)) return fallback;
    for (var i = 0; i < names.length; i += 1) {
      var name = names[i];
      if (object[name] !== undefined && object[name] !== null && object[name] !== '') return object[name];
    }
    return fallback;
  }

  function list(value, fallback) {
    if (Array.isArray(value)) return value.filter(function (entry) { return entry !== null && entry !== undefined && entry !== ''; });
    if (value === null || value === undefined || value === '') return fallback || [];
    return [value];
  }

  function listDisplay(value, fallback) {
    var entries = list(value, fallback);
    return entries.length ? entries.map(function (entry) { return display(text(entry)); }).join(' · ') : '—';
  }

  function money(value) {
    if (value === null || value === undefined || value === '' || (typeof value === 'number' && !isFinite(value))) return '—';
    var number = typeof value === 'number' ? value : Number(String(value).replace(/[$,\s]/g, ''));
    if (!isFinite(number)) return '—';
    try {
      return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', minimumFractionDigits: 2, maximumFractionDigits: 2 }).format(number);
    } catch (error) {
      return '$' + number.toFixed(2) + ' MXN';
    }
  }

  function moneyHtml(value) {
    return esc(money(value));
  }

  function numberValue(value) {
    if (value === null || value === undefined || value === '') return null;
    var number = typeof value === 'number' ? value : Number(String(value).replace(/[$,\s]/g, ''));
    return isFinite(number) ? number : null;
  }

  function sourcePrice(source) {
    return pick(source, ['unitPrice', 'unit_price', 'price', 'precioUnitario', 'precio', 'amount', 'importe'], null);
  }

  function sourceEligible(source) {
    if (!isObject(source)) return false;
    if (source.eligible === false || source.elegible === false) return false;
    if (source.quoted === false || source.cotizada === false) return false;
    if (source.technical === false || source.technicalCompliance === false || source.comparable === false || source.comparableCommercial === false) return false;
    var status = [pick(source, ['result', 'status', 'estado'], ''), pick(source, ['fiscal', 'fiscalStatus', 'validacionFiscal'], ''), pick(source, ['controller', 'controllerStatus', 'contraloria'], '')].join(' ').toLowerCase();
    return !/(exclu|no eleg|rechaz|invalid|no válid[oa]|no valid[oa])/.test(status);
  }

  function sourceName(source) {
    return pick(source, ['name', 'provider', 'providerName', 'razonSocial', 'supplier', 'fuente'], null);
  }

  function sourceInfo(source) {
    if (!isObject(source)) return '—';
    var parts = [];
    var name = sourceName(source);
    var rfc = pick(source, ['rfc', 'RFC'], null);
    var type = pick(source, ['type', 'kind', 'giro', 'giros'], null);
    var evidence = pick(source, ['evidence', 'source', 'document', 'documento', 'url'], null);
    if (name !== null && name !== undefined && name !== '') parts.push(String(name));
    if (rfc !== null && rfc !== undefined && rfc !== '') parts.push('RFC ' + String(rfc));
    if (type !== null && type !== undefined && type !== '') parts.push(String(type));
    if (evidence !== null && evidence !== undefined && evidence !== '') parts.push(String(evidence));
    return parts.length ? parts.join(' · ') : '—';
  }

  function detailText(value) {
    if (value === null || value === undefined || value === '') return '—';
    if (Array.isArray(value)) return value.map(detailText).join(' · ');
    if (isObject(value)) {
      return Object.keys(value).map(function (key) {
        return key + ': ' + detailText(value[key]);
      }).join(' · ');
    }
    return String(value);
  }

  function sourceDetail(source) {
    return isObject(source) ? detailText(source) : detailText(source);
  }

  function sourceRows(sources) {
    return array(sources);
  }

  function average(sources) {
    var prices = sourceRows(sources).filter(sourceEligible).map(function (source) { return numberValue(sourcePrice(source)); }).filter(function (price) { return price !== null; });
    if (!prices.length) return null;
    return prices.reduce(function (sum, price) { return sum + price; }, 0) / prices.length;
  }

  function normalizeResult(value) {
    if (value === true) return 'AUTORIZADA';
    if (value === false) return 'NO AUTORIZADA';
    var raw = text(value, '').trim();
    if (!raw) return '—';
    var upper = raw.toUpperCase();
    if (/NO\s*AUTORIZ|NO\s*APROB|RECHAZ|IMPROCED/.test(upper)) return 'NO AUTORIZADA';
    if (/AUTORIZ|APROB|PROCED/.test(upper)) return 'AUTORIZADA';
    return raw;
  }

  function sourceListFor(raw, study, index, itemCount) {
    var direct = pick(raw, ['sources', 'fuentes', 'quotes', 'cotizaciones', 'marketSources'], null);
    if (Array.isArray(direct)) return direct;
    var studyResults = array(study && study.itemResults);
    var result = studyResults[index];
    if (isObject(result)) {
      var resultSources = pick(result, ['sources', 'fuentes', 'quotes', 'cotizaciones'], null);
      if (Array.isArray(resultSources)) return resultSources;
    }
    var global = pick(study, ['sources', 'fuentes', 'quotes', 'cotizaciones'], []);
    if (Array.isArray(global)) return global;
    return [];
  }

  function rawItems(ctx, request, study) {
    if (Array.isArray(ctx.items) && ctx.items.length) return ctx.items;
    if (ctx.item && isObject(ctx.item)) return [ctx.item];
    if (Array.isArray(request && request.items) && request.items.length) return request.items;
    if (Array.isArray(study && study.items) && study.items.length) return study.items;
    if (Array.isArray(study && study.itemResults) && study.itemResults.length) return study.itemResults;
    if (request || study) return [request || study];
    return [];
  }

  function normalizedItems(ctx, request, study) {
    return rawItems(ctx, request, study).map(function (entry, index) {
      var nested = isObject(entry && entry.item) ? entry.item : {};
      var raw = Object.assign({}, nested, isObject(entry) ? entry : {});
      var resultObject = isObject(raw.result) ? raw.result : (isObject(raw.itemResult) ? raw.itemResult : {});
      var sources = sourceListFor(raw, study, index, rawItems(ctx, request, study).length);
      var directPrice = pick(raw, ['price', 'precio', 'reference', 'referencePrice', 'precioReferencia', 'unitPrice', 'unit_price'], null);
      if (directPrice === null || directPrice === undefined || directPrice === '') directPrice = pick(resultObject, ['price', 'precio', 'reference', 'referencePrice'], null);
      var itemResult = pick(raw, ['result', 'resultado', 'decision', 'outcome'], null);
      if (isObject(itemResult)) itemResult = pick(itemResult, ['result', 'resultado', 'decision', 'status'], null);
      if (itemResult === null || itemResult === undefined || itemResult === '') itemResult = pick(resultObject, ['result', 'resultado', 'decision', 'status'], null);
      var name = pick(raw, ['name', 'nombre', 'description', 'descripcion', 'item', 'bienServicio', 'bien'], null);
      if (name === null || name === undefined || name === '') name = pick(study, ['item', 'name', 'description'], null);
      if (name === null || name === undefined || name === '') name = pick(request, ['description', 'descripcion', 'name'], null);
      var key = pick(raw, ['verificationKey', 'claveVerificacion', 'verificationCode', 'key', 'clave', 'catalogKey', 'catalogoKey', 'code'], null);
      if (key === null || key === undefined || key === '') key = pick(request, ['verificationKey', 'claveVerificacion', 'key', 'clave', 'code'], null);
      var itemSources = sources;
      var calculatedPrice = directPrice;
      if ((calculatedPrice === null || calculatedPrice === undefined || calculatedPrice === '') && itemSources.length) calculatedPrice = average(itemSources);
      if ((calculatedPrice === null || calculatedPrice === undefined || calculatedPrice === '') && rawItems(ctx, request, study).length === 1) calculatedPrice = pick(study, ['reference', 'referencePrice', 'precioReferencia'], null);
      return {
        raw: raw,
        id: pick(raw, ['id', 'itemId', 'item_id', 'uuid'], null),
        key: key,
        name: name,
        price: calculatedPrice,
        specification: pick(raw, ['specification', 'especificacion', 'technicalSpecification', 'technicalSpecs', 'specs', 'fichaTecnica'], pick(request, ['specification', 'especificacion', 'technicalSpecification', 'notes'], name)),
        unit: pick(raw, ['unit', 'unidad', 'unitMeasure', 'unidadMedida', 'measure'], pick(request, ['unitMeasure', 'unidad', 'unidadMedida'], null)),
        validity: pick(raw, ['validity', 'vigencia', 'validFrom', 'validUntil', 'effectiveDate', 'vigenciaDesde'], pick(study, ['validity', 'vigencia', 'validFrom', 'validUntil', 'effectiveDate'], pick(request, ['validity', 'vigencia'], null))),
        part: pick(raw, ['partida', 'classification', 'clasificacion', 'budgetPartida'], pick(request, ['classification', 'partida', 'clasificacion'], null)),
        movement: pick(raw, ['movement', 'movimiento', 'operation'], pick(request, ['movement', 'movimiento'], null)),
        quantity: pick(raw, ['quantity', 'cantidad'], pick(request, ['quantity', 'cantidad'], null)),
        result: itemResult,
        sources: itemSources,
        index: index
      };
    });
  }

  function contextOf(ctx) {
    ctx = isObject(ctx) ? ctx : {};
    var request = isObject(ctx.request) ? ctx.request : {};
    var study = isObject(ctx.study) ? ctx.study : {};
    var items = normalizedItems(ctx, request, study);
    return { ctx: ctx, request: request, study: study, items: items, audit: array(ctx.audit), item: isObject(ctx.item) ? ctx.item : (items[0] ? items[0].raw : {}) };
  }

  function field(label, value, className) {
    return '<div class="md-field' + (className ? ' ' + className : '') + '"><label>' + esc(label) + '</label><strong>' + (value === undefined ? '—' : value) + '</strong></div>';
  }

  function fieldText(label, value, className) {
    return field(label, display(value), className);
  }

  function emptyRow(columns, message) {
    return '<tr><td colspan="' + columns + '" class="md-empty">' + esc(message || 'No hay datos registrados en el expediente.') + '</td></tr>';
  }

  function sourceTable(sources) {
    var rows = sourceRows(sources);
    return '<div class="md-table-wrap"><table><thead><tr><th>Fuente / información</th><th>Técnica</th><th>Precio unitario MXN</th><th>Validación</th><th>Resultado</th><th>Detalle completo</th></tr></thead><tbody>' +
      (rows.length ? rows.map(function (source) {
        var eligible = sourceEligible(source);
        return '<tr><td>' + display(sourceInfo(source)) + '</td><td>' + display(pick(source, ['technique', 'técnica', 'tecnica'], null)) + '</td><td>' + moneyHtml(sourcePrice(source)) + '</td><td>' + display(pick(source, ['validation', 'validacion', 'fiscal', 'technical', 'controller'], null)) + '</td><td><span class="md-status ' + (eligible ? 'ok' : 'bad') + '">' + (eligible ? 'Elegible' : 'No elegible') + '</span></td><td>' + display(sourceDetail(source)) + '</td></tr>';
      }).join('') : emptyRow(6, 'No se registran fuentes o cotizaciones.')) +
      '</tbody></table></div>';
  }

  function itemSourcesText(item) {
    var rows = sourceRows(item.sources);
    if (!rows.length) return '—';
    return rows.map(function (source) {
      return sourceInfo(source) + ' · ' + money(sourcePrice(source)) + (sourceEligible(source) ? ' · Elegible' : ' · No elegible');
    }).join(' | ');
  }

  function itemSummaryTable(items) {
    return '<div class="md-table-wrap"><table><thead><tr><th>#</th><th>Clave</th><th>Bien o servicio</th><th>Partida</th><th>Unidad</th><th>Vigencia</th><th>Precio de referencia MXN</th><th>Resultado</th></tr></thead><tbody>' +
      (items.length ? items.map(function (item, index) {
        return '<tr><td>' + (index + 1) + '</td><td>' + display(item.key) + '</td><td>' + display(item.name) + '</td><td>' + display(item.part) + '</td><td>' + display(item.unit) + '</td><td>' + display(item.validity) + '</td><td>' + moneyHtml(item.price) + '</td><td>' + display(normalizeResult(item.result)) + '</td></tr>';
      }).join('') : emptyRow(8, 'No hay bienes o servicios registrados.')) +
      '</tbody></table></div>';
  }

  function requestFolio(request) {
    return pick(request, ['folio', 'requestFolio', 'id'], null);
  }

  function studyFolio(study) {
    return pick(study, ['folio', 'studyFolio', 'id'], null);
  }

  function dateFromValue(value) {
    if (value === null || value === undefined || value === '') return { date: null, time: null };
    var raw = String(value);
    var match = raw.match(/^(.*?)(?:\s+|T)(\d{1,2}:\d{2}(?::\d{2})?)/);
    if (match) return { date: match[1], time: match[2] };
    return { date: raw, time: null };
  }

  function eventDate(event) {
    var date = pick(event, ['date', 'fecha', 'when', 'timestamp', 'createdAt'], null);
    return dateFromValue(date).date;
  }

  function eventTime(event) {
    var explicit = pick(event, ['time', 'hora'], null);
    if (explicit !== null && explicit !== undefined && explicit !== '') return explicit;
    return dateFromValue(pick(event, ['date', 'fecha', 'when', 'timestamp', 'createdAt'], null)).time;
  }

  function auditRows(audit) {
    return array(audit).map(function (event) {
      return {
        date: eventDate(event),
        time: eventTime(event),
        user: pick(event, ['user', 'usuario', 'actor', 'createdBy'], null),
        role: pick(event, ['role', 'rol', 'actorRole'], null),
        action: pick(event, ['action', 'accion', 'event', 'label'], null),
        previous: pick(event, ['previousState', 'previousStatus', 'oldState', 'oldStatus', 'from', 'estadoAnterior'], null),
        next: pick(event, ['newState', 'newStatus', 'currentState', 'to', 'estadoNuevo'], null),
        observation: pick(event, ['observation', 'observacion', 'detail', 'description', 'nota'], null),
        document: pick(event, ['linkedDocument', 'document', 'documento', 'documentId', 'folio'], null)
      };
    });
  }

  function eventTable(audit) {
    var rows = auditRows(audit);
    return '<div class="md-table-wrap"><table><thead><tr><th>Fecha</th><th>Hora</th><th>Usuario</th><th>Rol</th><th>Acción</th><th>Estado anterior</th><th>Estado nuevo</th><th>Observación</th><th>Documento vinculado</th></tr></thead><tbody>' +
      (rows.length ? rows.map(function (event) {
        return '<tr><td>' + display(event.date) + '</td><td>' + display(event.time) + '</td><td>' + display(event.user) + '</td><td>' + display(event.role) + '</td><td>' + display(event.action) + '</td><td>' + display(event.previous) + '</td><td>' + display(event.next) + '</td><td>' + display(event.observation) + '</td><td>' + display(event.document) + '</td></tr>';
      }).join('') : emptyRow(9, 'No hay eventos de auditoría preservados para este expediente.')) +
      '</tbody></table></div>';
  }

  function firstEventDate(audit) {
    var rows = auditRows(audit);
    return rows.length ? rows[0].date : null;
  }

  function lastEventDate(audit) {
    var rows = auditRows(audit);
    return rows.length ? rows[rows.length - 1].date : null;
  }

  function techniques(study) {
    return listDisplay(pick(study, ['techniques', 'técnicas', 'tecnicas', 'marketTechniques'], null));
  }

  function totalSources(items) {
    return items.reduce(function (sum, item) { return sum + sourceRows(item.sources).length; }, 0);
  }

  function totalEligibleSources(items) {
    return items.reduce(function (sum, item) { return sum + sourceRows(item.sources).filter(sourceEligible).length; }, 0);
  }

  function aggregateAverage(items, study) {
    var prices = [];
    items.forEach(function (item) {
      sourceRows(item.sources).filter(sourceEligible).forEach(function (source) {
        var value = numberValue(sourcePrice(source));
        if (value !== null) prices.push(value);
      });
    });
    if (prices.length) return prices.reduce(function (sum, value) { return sum + value; }, 0) / prices.length;
    if (items.length === 1) return numberValue(pick(study, ['reference', 'referencePrice', 'precioReferencia'], null));
    return null;
  }

  function validity(study, request, items) {
    var explicit = pick(study, ['validity', 'vigencia', 'validFrom', 'validUntil', 'effectiveDate'], null);
    if (explicit === null || explicit === undefined || explicit === '') explicit = pick(request, ['validity', 'vigencia'], null);
    if (explicit === null || explicit === undefined || explicit === '') {
      var values = items.map(function (item) { return item.validity; }).filter(function (value) { return value !== null && value !== undefined && value !== ''; });
      if (values.length === 1) explicit = values[0];
      else if (values.length > 1) explicit = values.join(' · ');
    }
    return explicit;
  }

  function conclusions(study, items) {
    var explicit = pick(study, ['conclusions', 'conclusion', 'conclusiones', 'analysisConclusion'], null);
    if (explicit !== null && explicit !== undefined && explicit !== '') return text(explicit);
    var averageValue = aggregateAverage(items, study);
    if (averageValue !== null) return 'El análisis comparativo de las fuentes elegibles registra un promedio de ' + money(averageValue) + ' MXN. El detalle por bien o servicio y sus fuentes queda integrado en este documento.';
    return 'No se registró un precio de referencia o un promedio elegible en los datos preservados del expediente.';
  }

  var BITACORA_TECHNIQUES = [
    { label: 'Consulta a precios históricos mediante modelo estadístico', aliases: ['historical', 'historicalprices', 'historicalpricemodel', 'precios historicos', 'consulta a precios historicos', 'modelo estadistico'], fields: ['historical', 'historicalPrices', 'historicalPriceModel', 'preciosHistoricos', 'consultaPreciosHistoricos'] },
    { label: 'Solicitud de precios de mercado vía electrónica', aliases: ['electronicrequest', 'electronicmarketrequest', 'solicitud de precios electronica', 'solicitud precios mercado', 'via electronica'], fields: ['electronicRequest', 'electronicMarketRequest', 'electronicPrices', 'solicitudPreciosElectronica', 'solicitudPreciosMercado'] },
    { label: 'Consulta de precios en campo', aliases: ['field', 'fieldconsultation', 'consultationfield', 'consulta en campo', 'consulta precios campo', 'consulta de precios de campo'], fields: ['fieldConsultation', 'consultationField', 'fieldPrices', 'consultaEnCampo', 'consultaPreciosCampo', 'campo'] },
    { label: 'Segmentación de mercado', aliases: ['segmentation', 'marketsegmentation', 'segmentacion de mercado'], fields: ['segmentation', 'marketSegmentation', 'segmentacionMercado'] },
    { label: 'Comercio electrónico', aliases: ['ecommerce', 'electroniccommerce', 'comercio electronico'], fields: ['ecommerce', 'electronicCommerce', 'comercioElectronico'] },
    { label: 'Técnica Mystery Shopper', aliases: ['mystery', 'mysteryshopper', 'mysteryshopping', 'tecnica mystery shopper'], fields: ['mystery', 'mysteryShopper', 'mysteryShopping', 'tecnicaMysteryShopper'] }
  ];

  var SIGNATURE_LABELS = {
    elaboro: 'ELABORÓ ESTUDIO DE MERCADO',
    reviso: 'REVISÓ',
    autorizo: 'VO.BO.',
    direccion: 'AUTORIZÓ'
  };

  function token(value) {
    return String(value === null || value === undefined ? '' : value).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, ' ').trim();
  }

  function techniqueMark(value) {
    if (value === true || value === 1) return true;
    if (value === false || value === 0 || value === null || value === undefined || value === '') return false;
    if (isObject(value)) {
      var selected = pick(value, ['checked', 'selected', 'enabled', 'active', 'value', 'x', 'marca'], null);
      return selected === null ? false : techniqueMark(selected);
    }
    return /^(x|si|s|yes|true|1|marcado|seleccionado)$/i.test(String(value).trim());
  }

  function techniqueMatches(value, definition) {
    var candidate = value;
    if (isObject(value)) candidate = pick(value, ['key', 'id', 'name', 'label', 'technique', 'tecnica', 'method', 'metodo'], null);
    var normalized = token(candidate);
    return normalized === token(definition.label) || definition.aliases.some(function (alias) {
      var aliasToken = token(alias);
      return normalized === aliasToken || (aliasToken && normalized.indexOf(aliasToken) >= 0) || (normalized && aliasToken.indexOf(normalized) >= 0);
    });
  }

  function techniqueValues(item, study, request) {
    var raw = item && item.raw ? item.raw : {};
    var values = [
      pick(raw, ['techniques', 'técnicas', 'tecnicas', 'marketTechniques', 'methods', 'metodos'], null),
      pick(request, ['techniques', 'técnicas', 'tecnicas', 'marketTechniques', 'methods', 'metodos'], null),
      pick(study, ['techniques', 'técnicas', 'tecnicas', 'marketTechniques', 'methods', 'metodos'], null)
    ];
    sourceRows(item && item.sources).forEach(function (source) {
      values.push(pick(source, ['technique', 'técnica', 'tecnica', 'method', 'metodo'], null));
    });
    return values.reduce(function (all, value) {
      if (Array.isArray(value)) return all.concat(value);
      if (isObject(value) && pick(value, ['key', 'id', 'name', 'label', 'technique', 'tecnica', 'method', 'metodo'], null) === null) {
        return all.concat(Object.keys(value).map(function (key) { return { key: key, value: value[key] }; }));
      }
      return value === null || value === undefined || value === '' ? all : all.concat([value]);
    }, []);
  }

  function techniqueSelected(definition, item, study, request) {
    var raw = item && item.raw ? item.raw : {};
    for (var i = 0; i < definition.fields.length; i += 1) {
      var direct = pick(raw, [definition.fields[i]], null);
      if (direct !== null && direct !== undefined && direct !== '') {
        if (techniqueMark(direct) || techniqueMatches(direct, definition)) return true;
      }
      direct = pick(request, [definition.fields[i]], null);
      if (direct !== null && direct !== undefined && direct !== '') {
        if (techniqueMark(direct) || techniqueMatches(direct, definition)) return true;
      }
      direct = pick(study, [definition.fields[i]], null);
      if (direct !== null && direct !== undefined && direct !== '') {
        if (techniqueMark(direct) || techniqueMatches(direct, definition)) return true;
      }
    }
    return techniqueValues(item, study, request).some(function (entry) {
      if (isObject(entry)) {
        var flag = pick(entry, ['checked', 'selected', 'enabled', 'active', 'value', 'x', 'marca'], null);
        if (techniqueMatches(entry, definition)) return flag === null ? true : techniqueMark(flag);
        return false;
      }
      return techniqueMatches(entry, definition) || (techniqueMark(entry) && techniqueMatches(entry, definition));
    });
  }

  function techniqueTable(items, study, request) {
    var candidates = array(items).concat([{raw:{},sources:array(study && study.sources)}]);
    if (!candidates.length) candidates = [{ raw: {}, sources: [] }];
    return '<div class="md-table-wrap"><table><thead><tr><th>No.</th><th>Técnica de estudio de mercado</th><th>Marca X</th></tr></thead><tbody>' +
      BITACORA_TECHNIQUES.map(function (definition, index) {
        var checked = candidates.some(function (item) { return techniqueSelected(definition, item, study, request); });
        return '<tr><td>' + (index + 10) + '</td><td>' + display(definition.label) + '</td><td><strong>' + (checked ? 'X' : '—') + '</strong></td></tr>';
      }).join('') + '</tbody></table></div>';
  }

  function itemLookup(item, request, study, names, fallback) {
    var raw = item && item.raw ? item.raw : {};
    return pick(raw, names, pick(request, names, pick(study, names, fallback)));
  }

  function itemGiro(item, request, study) {
    return itemLookup(item, request, study, ['giro', 'giros', 'budgetGiro', 'clasificacionGiro', 'classificationGiro'], null);
  }

  function itemKind(item, request, study) {
    var kind = itemLookup(item, request, study, ['kind', 'nature', 'itemType', 'tipoBienServicio', 'bienServicioType', 'type'], null);
    if (kind !== null && kind !== undefined && kind !== '') return kind;
    var raw = item && item.raw ? item.raw : {};
    if (raw.service === true || raw.servicio === true) return 'SERVICIO';
    if (raw.good === true || raw.bien === true) return 'BIEN';
    return /servicio/i.test(text(item && item.name, '')) ? 'SERVICIO' : 'BIEN';
  }

  function numericSourcePrices(item) {
    return sourceRows(item && item.sources).map(function (source) {
      return { source: source, value: numberValue(sourcePrice(source)), eligible: sourceEligible(source) };
    }).filter(function (entry) { return entry.value !== null; });
  }

  function meanValues(values) {
    if (!values.length) return null;
    return values.reduce(function (sum, value) { return sum + value; }, 0) / values.length;
  }

  function priceAnalysis(item) {
    var all = numericSourcePrices(item);
    var eligible = all.filter(function (entry) { return entry.eligible; });
    var calculationRows = eligible;
    var prices = calculationRows.map(function (entry) { return entry.value; });
    var minimum = prices.length ? Math.min.apply(Math, prices) : null;
    var averageValue = meanValues(prices);
    var quarter = minimum === null ? null : minimum * 0.25;
    var upper = minimum === null ? null : minimum + quarter;
    var within = upper === null ? [] : calculationRows.filter(function (entry) { return entry.value >= minimum && entry.value <= upper; });
    var withinValues = within.map(function (entry) { return entry.value; });
    var withinAverage = meanValues(withinValues);
    var adopted = numberValue(item && item.price);
    if (adopted === null) adopted = withinAverage === null ? averageValue : withinAverage;
    return {
      all: all,
      eligible: eligible,
      average: averageValue,
      minimum: minimum,
      quarter: quarter,
      upper: upper,
      within: within,
      withinAverage: withinAverage,
      adopted: adopted
    };
  }

  function sourceSlotsTable(item) {
    var rows = sourceRows(item && item.sources).slice(0, 3);
    var html = '<div class="md-table-wrap"><table><thead><tr><th>Fuente</th><th>Nombre / razón social</th><th>Precio de mercado MXN</th></tr></thead><tbody>';
    for (var index = 0; index < 3; index += 1) {
      var source = rows[index];
      html += source ? '<tr><td>Fuente ' + (index + 1) + '</td><td>' + display(sourceInfo(source)) + '</td><td>' + moneyHtml(sourcePrice(source)) + '</td></tr>' : '<tr><td>Fuente ' + (index + 1) + '</td><td class="md-empty">—</td><td>—</td></tr>';
    }
    if (sourceRows(item && item.sources).length > 3) html += '<tr><td colspan="3" class="md-small">Las fuentes adicionales se conservan en la tabla completa de fuentes.</td></tr>';
    return html + '</tbody></table></div>';
  }

  function signatureValue(study, key) {
    var signatures = study && study.signatures;
    if (Array.isArray(signatures)) {
      return signatures.filter(function (entry) {
        return isObject(entry) && token(pick(entry, ['key', 'name', 'role', 'rol'], '')) === token(key);
      })[0] || null;
    }
    return isObject(signatures) ? signatures[key] : null;
  }

  function signaturePresent(value) {
    if (value === null || value === undefined || value === '') return false;
    if (typeof value === 'string') return value.trim() !== '';
    if (isObject(value)) return !!pick(value, ['user', 'usuario', 'name', 'nombre', 'when', 'date', 'fecha', 'role', 'rol', 'signature', 'firma'], null);
    return true;
  }

  function signaturesComplete(study) {
    return ['elaboro', 'autorizo', 'reviso', 'direccion'].every(function (key) {
      return signaturePresent(signatureValue(study, key));
    });
  }

  function signatureText(value) {
    return signaturePresent(value) ? detailText(value) : 'Pendiente';
  }

  function signatureTable(study) {
    return '<div class="md-table-wrap"><table><thead><tr><th>Responsabilidad</th><th>Nombre, fecha, rol y firma registrada</th></tr></thead><tbody>' +
      ['elaboro', 'reviso', 'autorizo', 'direccion'].map(function (key) {
        return '<tr><td>' + display(SIGNATURE_LABELS[key]) + '</td><td>' + display(signatureText(signatureValue(study, key))) + '</td></tr>';
      }).join('') + '</tbody></table></div>';
  }

  function generatedFlag(value) {
    if (value === true || value === 1 || value === 'true') return true;
    return isObject(value) && value.generated !== false;
  }

  function itemDocumentGenerated(study, item) {
    var documents = study && study.itemDocuments;
    var itemId = item && item.id;
    if (!isObject(documents) || itemId === null || itemId === undefined || itemId === '') return false;
    return generatedFlag(documents[itemId]);
  }

  function assertDocumentReady(type, data) {
    if (type !== 'log' && type !== 'item') return;
    if (!signaturesComplete(data.study)) throw new Error('Documento ' + type + ' bloqueado: requiere las firmas elaboro, reviso, vo.bo. y autorizo.');
    if (normalizeResult(data.study.outcome) === 'NO AUTORIZADA' || data.study.state === 'No autorizado') throw new Error('Documento ' + type + ' bloqueado: Dirección no autorizó el estudio.');
    if (type === 'log' && !generatedFlag(data.study && data.study.logGenerated)) throw new Error('Documento log bloqueado: la bitácora aún no está generada.');
    if (type === 'item' && !itemDocumentGenerated(data.study, data.items[0])) throw new Error('Documento item bloqueado: la ficha del elemento aún no está generada.');
  }

  function page(title, subtitle, body, request, study, type) {
    var rFolio = requestFolio(request);
    var sFolio = studyFolio(study);
    var relation = [rFolio ? 'Solicitud ' + text(rFolio) : null, sFolio ? 'Estudio ' + text(sFolio) : null].filter(Boolean).join(' · ');
    return '<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(title) + (relation ? ' · ' + esc(relation) : '') + '</title><style>' + DOCUMENT_CSS + '</style></head><body><main class="md-page" data-document-type="' + esc(type) + '"><div class="md-topline"></div><header class="md-head"><div><div class="md-kicker">COMPRAMEX · Documento derivado del expediente</div><h1>' + esc(title) + '</h1><p>' + esc(subtitle || '') + '</p></div><div class="md-mark">MX<br>EM</div></header>' + body + '<footer class="md-footer"><span>' + esc(TYPES[type] || 'Documento') + '</span><span>' + display(relation) + '</span></footer></main></body></html>';
  }

  function buildLog(data) {
    var request = data.request;
    var study = data.study;
    var items = data.items;
    var averageValue = aggregateAverage(items, study);
    var received = pick(request, ['receivedAt', 'received', 'fechaRecepcion'], firstEventDate(data.audit) || pick(request, ['created', 'createdAt'], null));
    var attended = pick(request, ['attendedAt', 'attentionDate', 'fechaAtencion'], lastEventDate(data.audit) || pick(study, ['updated', 'updatedAt'], null));
    var dependency = pick(request, ['dependency', 'dependencia'], pick(study, ['dependency', 'dependencia'], null));
    var adminUnit = pick(request, ['adminCoord', 'administrativeCoordination', 'ca', 'coordinacionAdministrativa'], pick(study, ['ca', 'adminCoord'], null));
    var events = array(data.audit).concat(array(study && study.history));
    var body = '<div class="md-banner"><strong>Bitácora de Estudio de Mercado</strong><br>Registro integral de la información recabada, técnicas utilizadas, fuentes, cálculos, firmas y trazabilidad del expediente.</div>' +
      '<section class="md-section"><h2>Datos generales del solicitante</h2><div class="md-grid">' +
      fieldText('Claves de verificación por elemento', items.map(function (item) { return text(item.key, '—'); }).join(' · '), 'wide') +
      fieldText('Dependencia', dependency) +
      fieldText('No. de solicitud', requestFolio(request)) +
      fieldText('U. ADVA.', adminUnit) +
      fieldText('Fecha de recepción de la solicitud', received) +
      fieldText('Fecha de atención de la solicitud', attended) +
      fieldText('Folio de estudio', studyFolio(study)) +
      fieldText('Número de elementos', items.length) +
      fieldText('Promedio global MXN', averageValue === null ? null : money(averageValue), 'wide') +
      '</div></section>' +
      '<section class="md-section"><h2>Técnicas de mercado</h2><p class="md-small">Se concentran las técnicas seleccionadas en el estudio, por elemento y en las fuentes de consulta.</p>' + techniqueTable(items, study, request) + '</section>' +
      (items.length ? items.map(function (item, index) {
        var analysis = priceAnalysis(item);
        var inRange = analysis.within.length ? analysis.within.map(function (entry) { return money(entry.value); }).join(' · ') : null;
        var specification = item.specification || pick(item.raw, ['specs', 'technicalSpecs', 'specification', 'especificacion'], null);
        return '<section class="md-section"><h2>Elemento ' + (index + 1) + ' · ' + display(item.name) + '</h2>' +
          '<div class="md-grid">' +
          fieldText('Clave de verificación', item.key) +
          fieldText('Nombre del bien o servicio', item.name, 'wide') +
          fieldText('Unidad de medida', item.unit) +
          fieldText('Giro', itemGiro(item, request, study)) +
          fieldText('Bien o servicio', itemKind(item, request, study)) +
          fieldText('Especificación', specification, 'wide') +
          fieldText('Resultado', normalizeResult(item.result)) +
          '</div>' +
          '<h3>Fuentes de consulta (hasta tres nombres y precios)</h3>' + sourceSlotsTable(item) +
          '<h3>Fuentes completas y validaciones</h3>' + sourceTable(item.sources) +
          '<h3>Obtención del precio de mercado y análisis</h3><div class="md-grid">' +
          fieldText('Número de cotizaciones', sourceRows(item.sources).length) +
          fieldText('Cotizaciones elegibles', analysis.eligible.length) +
          fieldText('Precio de mercado obtenido (promedio)', analysis.average === null ? null : money(analysis.average)) +
          fieldText('Precio de mercado más bajo de las fuentes consultadas', analysis.minimum === null ? null : money(analysis.minimum)) +
          fieldText('Cálculo del 25% del precio más bajo', analysis.quarter === null ? null : money(analysis.quarter)) +
          fieldText('Precio de mercado más bajo de las fuentes consultadas + 25%', analysis.upper === null ? null : money(analysis.upper)) +
          fieldText('Precios dentro del rango', inRange, 'full') +
          fieldText('Promedio de precios dentro del rango', analysis.withinAverage === null ? null : money(analysis.withinAverage)) +
          fieldText('Precio de mercado obtenido dentro del cálculo', analysis.adopted === null ? null : money(analysis.adopted)) +
          '</div></section>';
      }).join('') : '<section class="md-section"><p class="md-empty">No hay bienes o servicios registrados para integrar en la Bitácora.</p></section>') +
      '<section class="md-section"><h2>Elaboró, revisó, vo.bo. y autorizó</h2>' + signatureTable(study) + '</section>' +
      '<section class="md-section"><h2>Tabla de eventos</h2>' + eventTable(events) + '</section>' +
      '<section class="md-section"><div class="md-note"><strong>Análisis global</strong><br>' + display(conclusions(study, items)) + '<br>Se conservaron ' + totalSources(items) + ' fuente(s) y ' + totalEligibleSources(items) + ' fuente(s) elegible(s) en el expediente.</div></section>';
    return page('Bitácora de Estudio de Mercado', 'Formato integral de bienes o servicios, técnicas, fuentes, precios, firmas y eventos', body, request, study, 'log');
  }

  function buildItem(data) {
    var request = data.request;
    var study = data.study;
    var sourceItem = data.ctx && data.ctx.item ? data.ctx.item : (data.items[0] && data.items[0].raw ? data.items[0].raw : data.items[0]);
    var item = normalizedItems({ request: request, study: study, items: [sourceItem] }, request, study)[0] || { raw: sourceItem || {} };
    var body = '<section class="md-section"><h2>Seis campos del formato</h2><div class="md-table-wrap"><table><thead><tr><th>Campo</th><th>Información registrada</th></tr></thead><tbody>' +
      '<tr><th>Clave de Verificación</th><td>' + display(item.key) + '</td></tr>' +
      '<tr><th>Nombre del bien</th><td>' + display(item.name) + '</td></tr>' +
      '<tr><th>Precio del Bien</th><td>' + moneyHtml(item.price) + '</td></tr>' +
      '<tr><th>Especificación</th><td>' + display(item.specification) + '</td></tr>' +
      '<tr><th>Unidad de Medida</th><td>' + display(item.unit) + '</td></tr>' +
      '<tr><th>Fecha de Vigencia</th><td>' + display(item.validity) + '</td></tr>' +
      '</tbody></table></div></section>';
    return page('Ficha de Estudio de Mercado', 'Seis campos del formato de Estudio de Mercado', body, request, study, 'item');
  }

  function resultDocument(request) {
    return isObject(request && request.resultDocument) ? request.resultDocument : {};
  }

  function buildResult(data) {
    var request = data.request;
    var study = data.study;
    var items = data.items;
    var documentData = resultDocument(request);
    var status = pick(documentData, ['status', 'state', 'estado'], pick(request, ['resultStatus', 'status', 'state'], pick(study, ['resultStatus', 'status', 'state'], null)));
    var result = pick(documentData, ['result', 'resultado', 'decision', 'outcome'], pick(request, ['result', 'resultado', 'decision'], pick(study, ['result', 'resultado', 'decision'], null)));
    if ((result === null || result === undefined || result === '') && status !== null && status !== undefined) result = status;
    var normalizedDecision = normalizeResult(result);
    var decisionClass = normalizedDecision === 'AUTORIZADA' ? 'ok' : (normalizedDecision === 'NO AUTORIZADA' ? 'bad' : 'review');
    var tableRows = items.length ? items.map(function (item, index) {
      return '<tr><td>' + (index + 1) + '</td><td>' + display(item.key) + '</td><td>' + display(item.name) + '</td><td>' + display(item.part) + '</td><td>' + display(item.unit) + '</td><td>' + display(item.movement) + '</td><td>' + display(itemSourcesText(item)) + '</td><td>' + moneyHtml(item.price) + '</td><td>' + display(normalizeResult(item.result || normalizedDecision)) + '</td></tr>';
    }).join('') : emptyRow(9, 'No hay bienes o servicios preservados en el expediente.');
    var body = '<div class="md-separate">Este documento es el <strong>Dictamen / Oficio de Resultado del Estudio de Mercado</strong> y está expresamente separado del <strong>Dictamen Técnico POBALIN 059</strong>. No sustituye ni incorpora ese dictamen técnico.</div>' +
      '<section class="md-section"><h2>Identificación y decisión</h2><div class="md-grid">' +
      fieldText('ID propio del documento de resultado', pick(documentData, ['id', 'ID'], null)) +
      fieldText('Folio de solicitud', requestFolio(request)) +
      fieldText('Folio de estudio relacionado', studyFolio(study)) +
      fieldText('Relación documental', 'Solicitud ' + text(requestFolio(request), '—') + ' · Estudio ' + text(studyFolio(study), '—'), 'wide') +
      fieldText('Fecha', pick(documentData, ['date', 'fecha', 'createdAt', 'issuedAt'], null)) +
      fieldText('Usuario', pick(documentData, ['user', 'usuario', 'createdBy', 'issuedBy'], null)) +
      fieldText('Estado', status) +
      field('Resultado', '<span class="md-decision md-status ' + decisionClass + '">' + esc(normalizedDecision) + '</span>') +
      fieldText('Destinatario CA', pick(request, ['adminCoord', 'administrativeCoordination', 'ca', 'coordinacionAdministrativa'], pick(documentData, ['recipient', 'destinatario'], null)), 'wide') +
      fieldText('Fuente del estudio', studyFolio(study), 'wide') +
      '</div></section>' +
      '<section class="md-section"><h2>Resultado por bien o servicio</h2><div class="md-table-wrap"><table><thead><tr><th>#</th><th>Clave</th><th>Descripción</th><th>Partida</th><th>Unidad</th><th>Movimiento</th><th>Fuentes e información</th><th>Precio MXN</th><th>Resultado</th></tr></thead><tbody>' + tableRows + '</tbody></table></div></section>' +
      '<section class="md-section"><div class="md-note"><strong>Integridad del documento</strong><br>Se muestran únicamente el ID, fecha, usuario, estado, resultado y relaciones que obran en los datos preservados. No se generan firmas, nombres o cargos no registrados.</div></section>';
    return page('Dictamen / Oficio de Resultado del Estudio de Mercado', 'Resultado administrativo del estudio · documento separado del Dictamen Técnico POBALIN 059', body, request, study, 'result');
  }

  function communicationData(request) {
    var communication = isObject(request && request.communication) ? request.communication : {};
    return {
      type: pick(communication, ['type', 'communicationType', 'kind'], null),
      subject: pick(communication, ['subject', 'asunto', 'title'], pick(request, ['subject', 'asunto'], null)),
      body: pick(communication, ['body', 'message', 'text', 'contenido', 'notice'], pick(request, ['communicationText', 'message', 'notice'], null)),
      date: pick(communication, ['date', 'fecha', 'createdAt'], null),
      sender: pick(communication, ['sender', 'emitter', 'from', 'remitente'], pick(request, ['adminCoord', 'ca'], null)),
      recipient: pick(communication, ['recipient', 'to', 'destinatario'], pick(request, ['requestingArea', 'area', 'unit', 'unidad'], null)),
      document: pick(communication, ['id', 'folio', 'documentId'], null),
      attachments: pick(communication, ['attachments', 'documents', 'anexos'], null)
    };
  }

  function buildCommunication(data) {
    var request = data.request;
    var study = data.study;
    var communication = communicationData(request);
    var requestedType = data.ctx.communicationType || communication.type || 'oficio';
    var normalizedType = /aviso|notific/i.test(String(requestedType)) ? 'Aviso' : 'Oficio';
    var subject = communication.subject || ('Seguimiento del expediente ' + text(requestFolio(request), '—'));
    var message = communication.body;
    if (message === null || message === undefined || message === '') {
      message = 'Se comunica el estado del expediente vinculado a la solicitud ' + text(requestFolio(request), '—') + ' y al estudio de mercado ' + text(studyFolio(study), '—') + '. Consulte los datos y documentos relacionados que obran en el expediente.';
    }
    var body = '<div class="md-banner"><strong>' + esc(normalizedType) + ' basado en expediente</strong><br>Comunicación derivada de la solicitud, el estudio relacionado y los datos preservados; no agrega información fuera del expediente.</div>' +
      '<section class="md-section"><h2>Datos de la comunicación</h2><div class="md-grid">' +
      fieldText('Tipo', requestedType) +
      fieldText('Identificador del documento', communication.document) +
      fieldText('Fecha', communication.date) +
      fieldText('Remitente / área emisora', communication.sender, 'wide') +
      fieldText('Destinatario', communication.recipient, 'wide') +
      fieldText('Folio de solicitud', requestFolio(request)) +
      fieldText('Folio de estudio', studyFolio(study)) +
      fieldText('Asunto', subject, 'full') +
      '</div></section>' +
      '<section class="md-section"><h2>Texto del ' + esc(normalizedType.toLowerCase()) + '</h2><div class="md-note">' + display(message) + '</div></section>' +
      '<section class="md-section"><h2>Bienes y servicios del expediente</h2>' + itemSummaryTable(data.items) + '</section>' +
      '<section class="md-section"><h2>Documentos y relación de expediente</h2><div class="md-grid">' +
      fieldText('Estado de la solicitud', pick(request, ['state', 'status', 'estado'], null)) +
      fieldText('Estado del estudio', pick(study, ['state', 'status', 'estado'], null)) +
      fieldText('Anexos / documentos', communication.attachments || pick(request, ['documents', 'documentCount', 'anexos'], null), 'wide') +
      fieldText('Unidad solicitante', pick(request, ['requestingArea', 'area', 'unit', 'unidad'], null), 'wide') +
      '</div></section>';
    return page(normalizedType + ' de resultado del expediente', normalizedType + ' · comunicación institucional vinculada', body, request, study, 'communication');
  }

  function build(type, ctx) {
    var data = contextOf(ctx);
    if (type === 'item' && data.ctx && isObject(data.ctx.item)) {
      var individual = normalizedItems({ request: data.request, study: data.study, items: [data.ctx.item] }, data.request, data.study)[0];
      if (individual) data.items = [individual];
    }
    assertDocumentReady(type, data);
    switch (type) {
      case 'log': return buildLog(data);
      case 'item': return buildItem(data);
      case 'result': return buildResult(data);
      case 'communication': return buildCommunication(data);
      case 'study': throw new Error('La ruta de documento study está suprimida; use log.');
      default: throw new Error('Tipo de documento no soportado: ' + type);
    }
  }

  function identifier(type, ctx) {
    var data = contextOf(ctx);
    var request = data.request;
    var study = data.study;
    var result = resultDocument(request);
    var candidates = [];
    if (type === 'result') candidates.push(pick(result, ['id', 'ID'], null));
    if (type === 'item') {
      var raw = isObject(data.ctx && data.ctx.item) ? data.ctx.item : (data.items[0] && data.items[0].raw);
      var itemId = pick(raw, ['verificationKey', 'key', 'id'], data.items[0] && data.items[0].key);
      if (itemId) candidates.push(text(requestFolio(request), 'solicitud') + '-' + text(itemId));
    }
    candidates.push(requestFolio(request), studyFolio(study), data.items[0] && data.items[0].key);
    var found = candidates.find(function (candidate) { return candidate !== null && candidate !== undefined && candidate !== ''; });
    return String(found || 'sin-identificador').replace(/[^a-zA-Z0-9À-ÿ_-]+/g, '-').replace(/-+/g, '-').replace(/^-+|-+$/g, '').slice(0, 90) || 'sin-identificador';
  }

  function fileName(type, ctx) {
    var slug = TYPE_SLUGS[type] || 'documento-mercado';
    return slug + '-' + identifier(type, ctx) + '.html';
  }

  function getDocumentApi() {
    return root.document || (typeof document !== 'undefined' ? document : null);
  }

  function getUrlApi() {
    return root.URL || (typeof URL !== 'undefined' ? URL : null);
  }

  function download(type, ctx) {
    var html = build(type, ctx);
    var doc = getDocumentApi();
    var urlApi = getUrlApi();
    if (!doc || !urlApi || typeof urlApi.createObjectURL !== 'function' || typeof Blob === 'undefined') return false;
    var blob = new Blob([html], { type: 'text/html;charset=utf-8' });
    var url = urlApi.createObjectURL(blob);
    var anchor = doc.createElement('a');
    anchor.href = url;
    anchor.download = fileName(type, ctx);
    anchor.rel = 'noopener';
    anchor.style.display = 'none';
    (doc.body || doc.documentElement).appendChild(anchor);
    try {
      anchor.click();
    } finally {
      if (anchor.parentNode) anchor.parentNode.removeChild(anchor);
      setTimeout(function () { if (typeof urlApi.revokeObjectURL === 'function') urlApi.revokeObjectURL(url); }, 1200);
    }
    return anchor.download;
  }

  function preview(type, ctx) {
    var html = build(type, ctx);
    var open = typeof root.open === 'function' ? root.open.bind(root) : null;
    var popup = null;
    if (open) {
      try { popup = open('', '_blank'); if (popup) popup.opener = null; } catch (error) { popup = null; }
    }
    if (popup && !popup.closed) {
      var printable = html.replace('</body>', '<div class="md-preview-controls"><button type="button" onclick="window.print()">Imprimir</button><button type="button" class="secondary" onclick="window.close()">Cerrar</button></div></body>');
      try {
        popup.document.open();
        popup.document.write(printable);
        popup.document.close();
        try { popup.focus(); } catch (focusError) { /* no-op */ }
        return popup;
      } catch (writeError) {
        try { popup.close(); } catch (closeError) { /* no-op */ }
      }
    }
    download(type, ctx);
    return false;
  }

  root.MarketDocuments = { build: build, download: download, preview: preview };
}(typeof window !== 'undefined' ? window : globalThis));
