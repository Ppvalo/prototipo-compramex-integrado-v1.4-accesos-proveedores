(() => {
  const Rules = globalThis.CompramexProcedureRules;
  if (!Rules) throw new Error('Falta el módulo de reglas de Procedimientos de Contratación');

  const STORAGE = 'compramexProceduresDemoV2';
  const LEGACY_STORAGE = 'compramexProceduresDemoV1';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const clone = Rules.clone;
  const esc = value => String(value ?? '').replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const money = Rules.money;
  const stamp = () => new Date().toLocaleString('es-MX', { dateStyle: 'medium', timeStyle: 'short' });
  const today = () => new Date().toISOString().slice(0, 10);
  const fmtDate = value => value ? new Intl.DateTimeFormat('es-MX', { day: '2-digit', month: 'short', year: 'numeric', timeZone: 'UTC' }).format(new Date(`${value}T00:00:00Z`)) : '—';
  const originLabel = origin => origin === Rules.ORIGINS.OFICIALIA_MAYOR ? 'Oficialía Mayor' : 'Dependencia';
  const ROLE_CATALOG = Rules.ROLE_CATALOG;

  const DEPENDENCIES = [
    { key: '205', sigla: 'SGG', name: 'Secretaría General de Gobierno' },
    { key: '206', sigla: 'SSEM', name: 'Secretaría de Seguridad' },
    { key: '207', sigla: 'SF', name: 'Secretaría de Finanzas' },
    { key: '208', sigla: 'SS', name: 'Secretaría de Salud' },
    { key: '215', sigla: 'SEDECO', name: 'Secretaría de Desarrollo Económico' },
    { key: '220', sigla: 'SEMOV', name: 'Secretaría de Movilidad' },
    { key: '234', sigla: 'OM', name: 'Oficialía Mayor' }
  ];
  const AREAS = [
    { id: '205-a1', dependencyKey: '205', name: 'Dirección de Servicios Generales', responsible: 'Patricia Gómez' },
    { id: '205-a2', dependencyKey: '205', name: 'Dirección de Tecnologías y Servicios', responsible: 'Jorge Salgado' },
    { id: '206-a1', dependencyKey: '206', name: 'Dirección de Administración', responsible: 'Ricardo Torres' },
    { id: '206-a2', dependencyKey: '206', name: 'Unidad de Tecnologías', responsible: 'Daniela Cruz' },
    { id: '207-a1', dependencyKey: '207', name: 'Dirección de Tecnologías y Sistemas', responsible: 'Ernesto Vázquez' },
    { id: '208-a1', dependencyKey: '208', name: 'Hospital General · Administración', responsible: 'Mónica Salas' },
    { id: '215-a1', dependencyKey: '215', name: 'Dirección de Recursos Materiales', responsible: 'Ana Beltrán' },
    { id: '234-a1', dependencyKey: '234', name: 'Coordinación de Servicios Generales', responsible: 'Luis Ortega' }
  ];
  const OM_USERS = {
    'OM_DPA_A': { director: 'Directora DPA A · DEMO', users: { 'OM-PC-02': 'Subdirector de Bases A · DEMO', 'OM-PC-03': 'Responsable LPN A · DEMO', 'OM-PC-04': 'Responsable IR / AD A · DEMO', 'OM-PC-05': 'Subdirector de Adquisiciones A · DEMO', 'OM-PC-06': 'Responsable de Concursos A · DEMO', 'OM-PC-07': 'Apoyo a Comité A · DEMO', 'OM-PC-08': 'Responsable de Contratos A · DEMO' } },
    'OM_DPA_B': { director: 'Director DPA B · DEMO', users: { 'OM-PC-02': 'Subdirector de Bases B · DEMO', 'OM-PC-03': 'Responsable LPN B · DEMO', 'OM-PC-04': 'Responsable IR / AD B · DEMO', 'OM-PC-05': 'Subdirector de Adquisiciones B · DEMO', 'OM-PC-06': 'Responsable de Concursos B · DEMO', 'OM-PC-07': 'Apoyo a Comité B · DEMO', 'OM-PC-08': 'Responsable de Contratos B · DEMO' } },
    'OM_DPA_SA': { director: 'Director Sector Auxiliar · DEMO', users: { 'OM-PC-02': 'Subdirector de Bases SA · DEMO', 'OM-PC-03': 'Responsable LPN SA · DEMO', 'OM-PC-04': 'Responsable IR / AD SA · DEMO', 'OM-PC-05': 'Subdirector de Adquisiciones SA · DEMO', 'OM-PC-06': 'Responsable de Concursos SA · DEMO', 'OM-PC-07': 'Apoyo a Comité SA · DEMO', 'OM-PC-08': 'Responsable de Contratos SA · DEMO' } }
  };
  const TYPES = ['Bienes', 'Arrendamientos', 'Servicios'];
  const MODALITIES = Rules.MODALITIES;

  const dependency = key => DEPENDENCIES.find(item => item.key === String(key)) || DEPENDENCIES[0];
  const area = id => AREAS.find(item => item.id === String(id)) || { id: String(id || 'demo-area'), dependencyKey: String(id || '205').split('-')[0], name: 'Área requirente DEMO', responsible: 'Responsable DEMO' };
  const direction = key => Rules.direction(key) || { key: String(key || ''), short: '—', label: 'Sin Dirección asignada' };
  const role = code => ROLE_CATALOG[String(code)] || { code: String(code || ''), label: 'Perfil no identificado', shortLabel: 'Sin perfil', scope: 'NONE' };
  const roleName = code => role(code).label;
  const adscriptionLabel = key => key === 'OM_CPA' ? 'Coordinación de Procedimientos Adquisitivos' : direction(key).label;
  const userFor = (roleCode, adscription = '') => {
    if (roleCode === 'OM-PC-00') return 'Coordinador de Asignación · DEMO';
    if (roleCode === 'OM-PC-01') return OM_USERS[adscription]?.director || 'Director de Procedimientos · DEMO';
    return OM_USERS[adscription]?.users?.[roleCode] || roleName(roleCode) + ' · DEMO';
  };

  const DOCUMENTS = [
    { id: 'request', title: 'Solicitud de contratación', type: 'Solicitud', required: true },
    { id: 'justification', title: 'Justificación de la necesidad', type: 'Justificación', required: true },
    { id: 'budget', title: 'Información presupuestaria', type: 'Presupuesto', required: true },
    { id: 'availability', title: 'Suficiencia / disponibilidad presupuestaria', type: 'Presupuesto', required: false },
    { id: 'technical', title: 'Anexos técnicos', type: 'Técnico', required: false },
    { id: 'support', title: 'Documentos justificativos', type: 'Soporte', required: false },
    { id: 'paa', title: 'Referencia al PAA', type: 'Planeación', required: false },
    { id: 'market', title: 'Estudio de mercado', type: 'Antecedente', required: false },
    { id: 'bases', title: 'Bases, anexos o invitaciones', type: 'Procedimiento', required: false },
    { id: 'committee', title: 'Documentación de Comité', type: 'Comité', required: false },
    { id: 'contract', title: 'Documentación contractual', type: 'Contrato', required: false }
  ];

  function docs(overrides = {}) {
    return DOCUMENTS.map(item => ({ ...item, status: 'pending', file: '', uploadedAt: '', uploadedBy: '', ...(overrides[item.id] || {}) }));
  }
  function event(when, user, roleCode, action, detail, from = '', to = '', observation = '', document = '') {
    return { when, user, role: roleName(roleCode), roleCode, action, detail, from, to, observation, document };
  }
  function makeProcedure(id, overrides = {}) {
    const origin = overrides.origin || Rules.ORIGINS.DEPENDENCIA;
    const dependencyKey = String(overrides.dependencyKey || (origin === Rules.ORIGINS.OFICIALIA_MAYOR ? '234' : '206'));
    const areaId = overrides.requestingArea || (origin === Rules.ORIGINS.OFICIALIA_MAYOR ? '234-om' : `${dependencyKey}-a1`);
    const base = {
      id, folio: id, origin, originLabel: originLabel(origin), dependencyKey, institution: origin === Rules.ORIGINS.OFICIALIA_MAYOR ? 'Oficialía Mayor' : dependency(dependencyKey).name,
      unitAdministrative: origin === Rules.ORIGINS.OFICIALIA_MAYOR ? 'Coordinación de Procedimientos Adquisitivos' : area(areaId).name,
      requestingArea: areaId, requestingAreaName: origin === Rules.ORIGINS.OFICIALIA_MAYOR ? 'Coordinación de Procedimientos Adquisitivos' : area(areaId).name,
      administrativeCoordination: origin === Rules.ORIGINS.OFICIALIA_MAYOR ? 'No aplica · origen Oficialía Mayor' : `Coordinación Administrativa ${dependency(dependencyKey).sigla}`,
      creator: overrides.creator || { userId: 'DEMO-AREA', name: origin === Rules.ORIGINS.OFICIALIA_MAYOR ? 'Coordinador de Asignación · DEMO' : area(areaId).responsible, roleCode: origin === Rules.ORIGINS.OFICIALIA_MAYOR ? 'OM-PC-00' : 'DEP-AR' },
      fiscalYear: 2026, contractType: 'Bienes', classification: 'Bienes', object: 'Adquisición de insumos para la operación institucional',
      description: 'Necesidad de demostración para el ciclo de contratación pública.', justification: 'La adquisición es necesaria para asegurar la continuidad de los servicios públicos.',
      responsible: origin === Rules.ORIGINS.OFICIALIA_MAYOR ? 'Coordinador de Asignación · DEMO' : area(areaId).responsible,
      currentOwner: origin === Rules.ORIGINS.OFICIALIA_MAYOR ? 'Coordinación de Procedimientos Adquisitivos' : area(areaId).name,
      contractTypeLabel: 'Bienes', proposedModality: '', authorizedModality: '', estimatedAmountNoVat: 125000, currency: 'MXN',
      budgetAuthorized: 5800000, budgetInfo: 'Presupuesto autorizado para adquisiciones, arrendamientos y servicios', fundingSource: 'Recursos fiscales',
      paaReference: '', marketStudyReference: '', observations: '', classificationNote: '', initialReview: null,
      status: origin === Rules.ORIGINS.OFICIALIA_MAYOR ? 'Pendiente de asignación' : 'Borrador', procedureStatus: 'No iniciado', contractStatus: 'No iniciado',
      assignedDirection: '', assignedDirectionLabel: '', assignedRoleCode: '', assignedUser: '', assignedAt: '', receivedAt: overrides.receivedAt || overrides.registeredAt || '2026-10-01',
      assignmentHistory: [], actions: [], documents: docs(), history: [], registeredAt: '2026-10-01', updatedAt: '2026-10-01'
    };
    const result = { ...base, ...overrides };
    result.originLabel = originLabel(result.origin);
    result.institution = result.origin === Rules.ORIGINS.OFICIALIA_MAYOR ? 'Oficialía Mayor' : dependency(result.dependencyKey).name;
    result.folio = result.folio || result.id;
    result.documents = result.documents || docs();
    result.history = result.history || [event(result.registeredAt + ' 09:00', result.creator.name, result.creator.roleCode, 'Creación', 'Solicitud registrada como demostración.', '', result.status)];
    return result;
  }

  function seedState() {
    const procedures = [
      makeProcedure('PC-2026-0001', { dependencyKey: '205', requestingArea: '205-a1', object: 'Adquisición de materiales y útiles de oficina', description: 'Materiales de oficina para unidades administrativas de la Secretaría.', justification: 'Atender el consumo ordinario de las áreas durante el ejercicio.', estimatedAmountNoVat: 150001, budgetAuthorized: 6500000, proposedModality: 'IR', status: 'Enviada a revisión', currentOwner: 'Coordinación Administrativa SGG', receivedAt: '2026-10-07', updatedAt: '2026-10-07', creator: { userId: 'AR-205-A1', name: 'Patricia Gómez', roleCode: 'DEP-AR' }, documents: docs({ request: { status: 'integrated', file: 'Solicitud · DEMO.pdf' }, justification: { status: 'integrated', file: 'Justificación · DEMO.pdf' }, budget: { status: 'integrated', file: 'Presupuesto · DEMO.pdf' } }) }),
      makeProcedure('PC-2026-0002', { dependencyKey: '208', requestingArea: '208-a1', object: 'Servicio de mantenimiento preventivo de instalaciones hospitalarias', contractType: 'Servicios', contractTypeLabel: 'Servicios', classification: 'Servicios', description: 'Mantenimiento preventivo de instalaciones y equipos no médicos.', estimatedAmountNoVat: 450000, budgetAuthorized: 9200000, proposedModality: 'IR', status: 'Pendiente de asignación', currentOwner: 'Coordinación de Procedimientos Adquisitivos', receivedAt: '2026-10-09', updatedAt: '2026-10-09', creator: { userId: 'CA-208', name: 'Coordinación Administrativa SSEM', roleCode: 'DEP-CA' }, documents: docs({ request: { status: 'integrated', file: 'Solicitud · DEMO.pdf' }, justification: { status: 'integrated', file: 'Justificación · DEMO.pdf' }, budget: { status: 'integrated', file: 'Disponibilidad · DEMO.pdf' }, availability: { status: 'integrated', file: 'DSP-SS-2026-022 · DEMO.pdf' } }) }),
      makeProcedure('PC-2026-0003', { origin: Rules.ORIGINS.OFICIALIA_MAYOR, object: 'Adquisición directa de equipo para la Coordinación de Procedimientos Adquisitivos', description: 'Necesidad originada directamente en la Oficialía Mayor.', justification: 'Atender una necesidad institucional de la Oficialía Mayor sin omitir controles documentales.', estimatedAmountNoVat: 87500, budgetAuthorized: 5800000, status: 'Pendiente de asignación', currentOwner: 'Coordinación de Procedimientos Adquisitivos', receivedAt: '2026-10-10', updatedAt: '2026-10-10', creator: { userId: 'OM-CPA', name: 'Coordinador de Asignación · DEMO', roleCode: 'OM-PC-00' }, documents: docs({ request: { status: 'integrated', file: 'Solicitud OM · DEMO.pdf' }, justification: { status: 'integrated', file: 'Justificación OM · DEMO.pdf' }, budget: { status: 'integrated', file: 'Presupuesto OM · DEMO.pdf' } }) }),
      makeProcedure('PC-2026-0004', { dependencyKey: '206', requestingArea: '206-a1', object: 'Arrendamiento de vehículos operativos', contractType: 'Arrendamientos', contractTypeLabel: 'Arrendamientos', classification: 'Arrendamientos', estimatedAmountNoVat: 780000, budgetAuthorized: 20000000, proposedModality: 'IR', authorizedModality: 'IR', status: 'Asignada a Dirección', assignedDirection: 'OM_DPA_A', assignedDirectionLabel: adscriptionLabel('OM_DPA_A'), assignedRoleCode: 'OM-PC-01', assignedUser: 'Directora DPA A · DEMO', assignedAt: '2026-10-08', currentOwner: 'Dirección de Procedimientos Adquisitivos A', receivedAt: '2026-10-05', updatedAt: '2026-10-08', documents: docs({ request: { status: 'integrated', file: 'Solicitud · DEMO.pdf' }, justification: { status: 'integrated', file: 'Justificación · DEMO.pdf' }, budget: { status: 'integrated', file: 'Presupuesto · DEMO.pdf' }, availability: { status: 'integrated', file: 'DSP-SEDECO-2026-011 · DEMO.pdf' } }), assignmentHistory: [{ user: 'Coordinador de Asignación · DEMO', when: '2026-10-08', direction: 'OM_DPA_A', directionLabel: adscriptionLabel('OM_DPA_A'), responsible: 'Directora DPA A · DEMO', reason: 'Canalización por naturaleza y carga de trabajo.' }] }),
      makeProcedure('PC-2026-0005', { dependencyKey: '207', requestingArea: '207-a1', object: 'Adquisición de licencias de software', description: 'Licencias institucionales para herramientas de productividad.', estimatedAmountNoVat: 90000, budgetAuthorized: 12000000, proposedModality: 'AD', authorizedModality: 'AD', status: 'En atención', procedureStatus: 'En preparación', assignedDirection: 'OM_DPA_B', assignedDirectionLabel: adscriptionLabel('OM_DPA_B'), assignedRoleCode: 'OM-PC-01', assignedUser: 'Director DPA B · DEMO', assignedAt: '2026-09-12', currentOwner: 'Dirección de Procedimientos Adquisitivos B', receivedAt: '2026-09-04', updatedAt: '2026-09-12', documents: docs({ request: { status: 'integrated', file: 'Solicitud · DEMO.pdf' }, justification: { status: 'integrated', file: 'Justificación · DEMO.pdf' }, budget: { status: 'integrated', file: 'Presupuesto · DEMO.pdf' }, bases: { status: 'integrated', file: 'Bases · DEMO.pdf' } }), assignmentHistory: [{ user: 'Coordinador de Asignación · DEMO', when: '2026-09-12', direction: 'OM_DPA_B', directionLabel: adscriptionLabel('OM_DPA_B'), responsible: 'Director DPA B · DEMO', reason: 'Asignación inicial.' }] }),
      makeProcedure('PC-2026-0006', { dependencyKey: '215', requestingArea: '215-a1', object: 'Contratación de servicios integrales de limpieza', contractType: 'Servicios', contractTypeLabel: 'Servicios', classification: 'Servicios', estimatedAmountNoVat: 1800000, budgetAuthorized: 30000000, proposedModality: 'LPN', authorizedModality: 'LPN', status: 'En procedimiento de contratación', procedureStatus: 'En ejecución', contractStatus: 'En elaboración', assignedDirection: 'OM_DPA_SA', assignedDirectionLabel: adscriptionLabel('OM_DPA_SA'), assignedRoleCode: 'OM-PC-05', assignedUser: 'Subdirector de Adquisiciones SA · DEMO', assignedAt: '2026-08-20', currentOwner: 'Subdirección de Adquisiciones · Sector Auxiliar', receivedAt: '2026-08-15', updatedAt: '2026-10-03', documents: docs({ request: { status: 'integrated', file: 'Solicitud · DEMO.pdf' }, justification: { status: 'integrated', file: 'Justificación · DEMO.pdf' }, budget: { status: 'integrated', file: 'Presupuesto · DEMO.pdf' }, availability: { status: 'integrated', file: 'DSP-OM-2026-008 · DEMO.pdf' }, bases: { status: 'integrated', file: 'Bases LPN · DEMO.pdf' }, committee: { status: 'integrated', file: 'Acuerdo de Comité · DEMO.pdf' } }), assignmentHistory: [{ user: 'Coordinador de Asignación · DEMO', when: '2026-08-20', direction: 'OM_DPA_SA', directionLabel: adscriptionLabel('OM_DPA_SA'), responsible: 'Subdirector de Adquisiciones SA · DEMO', reason: 'Asignación inicial.' }] })
    ];
    const audit = procedures.flatMap(p => p.history.map(item => ({ ...item, folio: p.folio, procedureId: p.id, statusBefore: item.from || '—', statusAfter: item.to || p.status }))).reverse();
    return {
      schemaVersion: 2, active: false, roleCode: 'DEP-AR', adscription: 'DEPENDENCIA', dependencyKey: '205', areaId: '205-a1', actorName: 'Patricia Gómez',
      filters: { query: '', origin: '', dependency: '', direction: '', unit: '', dateFrom: '', dateTo: '', status: '' },
      creationAuthorizations: clone(Rules.CREATION_DEFAULTS), normativeConfig: clone(Rules.DEFAULT_CONFIG), configVersion: '2026.1-demo', procedures, audit, notifications: [], draft: null
    };
  }

  let state = load();
  let selectedId = '';
  let editingId = '';

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE) || 'null');
      if (!saved || Number(saved.schemaVersion) !== 2) return seedState();
      const base = seedState();
      return { ...base, ...saved, procedures: Array.isArray(saved.procedures) ? saved.procedures : base.procedures, audit: Array.isArray(saved.audit) ? saved.audit : base.audit, filters: { ...base.filters, ...(saved.filters || {}) }, creationAuthorizations: { ...base.creationAuthorizations, ...(saved.creationAuthorizations || {}) }, normativeConfig: saved.normativeConfig || base.normativeConfig };
    } catch (error) { return seedState(); }
  }
  function save() {
    try { localStorage.setItem(STORAGE, JSON.stringify(state)); return true; }
    catch (error) { toast('No fue posible guardar la demostración en este navegador. Los archivos sólo se conservan como metadatos.'); return false; }
  }
  function proc(id) { return state.procedures.find(item => item.id === String(id)); }
  function currentRole() { return role(state.roleCode); }
  function actor() { return String(state.actorName || userFor(state.roleCode, state.adscription) || currentRole().label).trim(); }
  function can(action, p = {}) { return Rules.actionAllowed({ roleCode: state.roleCode, dependencyKey: state.dependencyKey, areaId: state.areaId, adscription: state.adscription, creationAuthorizations: state.creationAuthorizations }, p, action); }
  function inScope(p) { return Rules.inScope({ roleCode: state.roleCode, dependencyKey: state.dependencyKey, areaId: state.areaId, adscription: state.adscription }, p); }
  function isOfficialiaRole() { return String(state.roleCode || '').startsWith('OM-PC-'); }
  function isDirectionRole() { return ['OM-PC-01','OM-PC-02','OM-PC-03','OM-PC-04','OM-PC-05','OM-PC-06','OM-PC-07','OM-PC-08'].includes(state.roleCode); }
  function statusBadge(value) { return `<span class="proc-badge ${Rules.statusClass(value)}">${esc(value || 'Pendiente')}</span>`; }
  function originBadge(value) { return `<span class="proc-origin ${value === Rules.ORIGINS.OFICIALIA_MAYOR ? 'om' : 'dep'}">${esc(originLabel(value))}</span>`; }
  function modalityBadge(value) { return `<span class="proc-badge ${value === 'LPN' ? 'review' : value ? 'payment' : ''}">${esc(value || 'Pendiente')}</span>`; }
  function documentReady(p, id) { const d = (p.documents || []).find(item => item.id === id); return !!d && d.status === 'integrated' && !!d.file; }
  function documentsDone(p) { return (p.documents || []).filter(item => item.status === 'integrated').length; }
  function documentsTotal(p) { return (p.documents || []).length; }
  function nextFolio() {
    const nums = state.procedures.map(item => Number(String(item.folio || '').match(/(\d+)$/)?.[1] || 0));
    return `PC-2026-${String(Math.max(0, ...nums) + 1).padStart(4, '0')}`;
  }

  function showOnly(which) {
    $('#publicView')?.classList.toggle('hidden', which !== 'public');
    $('#accessView')?.classList.toggle('hidden', which !== 'access');
    $('#workspace')?.classList.toggle('hidden', which !== 'workspace');
  }
  function openModal(title, wide = false) { $('#modalTitle').textContent = title; $('#modal').classList.remove('hidden'); $('#modal').classList.toggle('wide-modal', !!wide); }
  function closeModal() { $('#modal')?.classList.add('hidden'); $('#modal')?.classList.remove('wide-modal'); }
  function toast(message) { $('#modalBody').innerHTML = `<p>${esc(message)}</p>`; $('#modalActions').innerHTML = '<button class="btn btn-primary" data-proc-close type="button">Aceptar</button>'; openModal('Información'); $('[data-proc-close]', $('#modalActions')).onclick = closeModal; }
  function confirmModal(title, message, label, callback) { $('#modalBody').innerHTML = `<p>${esc(message)}</p>`; $('#modalActions').innerHTML = `<button class="btn btn-secondary" data-proc-cancel type="button">Cancelar</button><button class="btn btn-primary" data-proc-confirm type="button">${esc(label)}</button>`; openModal(title); $('[data-proc-cancel]', $('#modalActions')).onclick = closeModal; $('[data-proc-confirm]', $('#modalActions')).onclick = () => { closeModal(); callback(); }; }
  function observationModal(title, message, callback, label = 'Guardar motivo') { $('#modalBody').innerHTML = `<p>${esc(message)}</p><label>Motivo obligatorio<textarea id="procObservationText" rows="5" placeholder="Describa la observación, devolución o justificación..."></textarea></label>`; $('#modalActions').innerHTML = `<button class="btn btn-secondary" data-proc-cancel type="button">Cancelar</button><button class="btn btn-warning" data-proc-save-observation type="button">${esc(label)}</button>`; openModal(title, true); $('[data-proc-cancel]', $('#modalActions')).onclick = closeModal; $('[data-proc-save-observation]', $('#modalActions')).onclick = () => { const value = $('#procObservationText').value.trim(); if (!value) return toast('Capture un motivo obligatorio.'); closeModal(); callback(value); }; }
  function header(kicker, title, description) { $('#pageHeader').innerHTML = `<span class="kicker">${esc(kicker)}</span><h2>${esc(title)}</h2><p>${esc(description)}</p>`; }
  function contextHtml() { const scope = state.roleCode === 'DEP-AR' ? area(state.areaId).name : state.roleCode === 'DEP-CA' ? 'Toda la dependencia' : adscriptionLabel(state.adscription); return `<div class="proc-context"><div><b>Perfil activo</b><span>${esc(state.roleCode)} · ${esc(currentRole().shortLabel)}</span></div><div><b>Adscripción</b><span>${esc(scope)}</span></div><div><b>Ejercicio</b><span>2026 · configuración vigente DEMO</span></div><div><b>Ámbito</b><span>${esc(state.roleCode.startsWith('OM-') ? 'Oficialía Mayor' : dependency(state.dependencyKey).name)}</span></div><div><b>Persistencia</b><span>localStorage · DEMO</span></div></div>`; }
  function flowHtml(p) { const stages = [['Origen','Solicitud'], ['Revisión','Documentos'], ['Asignación','Dirección'], ['Atención','Actuaciones'], ['Cierre','Expediente']]; const active = !p ? 0 : ['Borrador','Enviada a revisión','Pendiente de revisión inicial','Devuelta para aclaración'].includes(p.status) ? 0 : ['Pendiente de asignación'].includes(p.status) ? 1 : ['Asignada a Dirección'].includes(p.status) ? 2 : ['En atención','Pendiente de validación'].includes(p.status) ? 3 : 4; return `<div class="proc-flow" aria-label="Flujo de solicitudes de contratación">${stages.map((step, i) => `<div class="proc-flow-step ${i <= active ? 'active' : ''}"><span>${i + 1}</span><div><b>${step[0]}</b><small>${step[1]}</small></div></div>${i < stages.length - 1 ? '<i>→</i>' : ''}`).join('')}</div>`; }

  function addAudit(p, action, from = '', to = '', detail = '', observation = '', document = '') {
    const entry = event(stamp(), actor(), state.roleCode, action, detail, from, to, observation, document);
    if (p) { (p.history ||= []).push(entry); p.updatedAt = today(); p.currentOwner = actor(); }
    state.audit.unshift({ ...entry, folio: p?.folio || '', procedureId: p?.id || '', statusBefore: from || '—', statusAfter: to || '—' });
    save();
    return entry;
  }
  function transition(p, next, action, detail = '', observation = '', document = '') {
    if (!p || !Rules.canTransition(p.status, next)) { toast(`La transición ${p?.status || '—'} → ${next} no está permitida.`); return false; }
    const before = p.status; p.status = next; addAudit(p, action, before, next, detail, observation, document); return true;
  }
  function notify(message, target = '') { state.notifications.unshift({ when: stamp(), message, target, procedureId: selectedId, read: false }); }

  function visibleProcedures() {
    return state.procedures.filter(item => inScope(item));
  }
  function readFilters(root = document) {
    state.filters = {
      query: $('#procFilterQuery', root)?.value.trim() || '', origin: $('#procFilterOrigin', root)?.value || '', dependency: $('#procFilterDependency', root)?.value || '', direction: $('#procFilterDirection', root)?.value || '', unit: $('#procFilterUnit', root)?.value || '', dateFrom: $('#procFilterFrom', root)?.value || '', dateTo: $('#procFilterTo', root)?.value || '', status: $('#procFilterStatus', root)?.value || ''
    };
    save();
  }
  function filteredProcedures(source = visibleProcedures()) {
    const f = state.filters; const query = String(f.query || '').toLowerCase();
    return source.filter(p => {
      const search = [p.folio, p.institution, p.unitAdministrative, p.requestingAreaName, p.object, p.status, p.assignedDirectionLabel].join(' ').toLowerCase();
      return (!query || search.includes(query)) && (!f.origin || p.origin === f.origin) && (!f.dependency || p.dependencyKey === f.dependency) && (!f.direction || p.assignedDirection === f.direction) && (!f.unit || p.unitAdministrative === f.unit) && (!f.dateFrom || p.receivedAt >= f.dateFrom) && (!f.dateTo || p.receivedAt <= f.dateTo) && (!f.status || p.status === f.status);
    });
  }
  function filterHtml() {
    const deps = DEPENDENCIES.filter(item => visibleProcedures().some(p => p.dependencyKey === item.key));
    const units = [...new Set(visibleProcedures().map(p => p.unitAdministrative).filter(Boolean))];
    return `<article class="card"><div class="proc-toolbar"><div class="proc-filters"><label class="span2">Búsqueda<input id="procFilterQuery" value="${esc(state.filters.query)}" placeholder="Folio, objeto, dependencia o área"></label><label>Origen<select id="procFilterOrigin"><option value="">Todos</option><option value="DEPENDENCIA" ${state.filters.origin === 'DEPENDENCIA' ? 'selected' : ''}>Dependencia</option><option value="OFICIALIA_MAYOR" ${state.filters.origin === 'OFICIALIA_MAYOR' ? 'selected' : ''}>Oficialía Mayor</option></select></label><label>Dependencia<select id="procFilterDependency"><option value="">Todas</option>${deps.map(item => `<option value="${item.key}" ${state.filters.dependency === item.key ? 'selected' : ''}>${esc(item.sigla)} · ${esc(item.name)}</option>`).join('')}</select></label><label>Dirección<select id="procFilterDirection"><option value="">Todas</option>${Rules.DIRECTIONS.map(item => `<option value="${item.key}" ${state.filters.direction === item.key ? 'selected' : ''}>${esc(item.short)} · ${esc(item.label)}</option>`).join('')}</select></label><label>Unidad administrativa<select id="procFilterUnit"><option value="">Todas</option>${units.map(item => `<option ${state.filters.unit === item ? 'selected' : ''}>${esc(item)}</option>`).join('')}</select></label><label>Desde<input id="procFilterFrom" type="date" value="${esc(state.filters.dateFrom)}"></label><label>Hasta<input id="procFilterTo" type="date" value="${esc(state.filters.dateTo)}"></label><label>Estatus<select id="procFilterStatus"><option value="">Todos</option>${Rules.STATUSES.map(status => `<option ${state.filters.status === status ? 'selected' : ''}>${esc(status)}</option>`).join('')}</select></label></div><div class="proc-actions"><button class="btn btn-secondary" id="procApplyFilters" type="button">Aplicar filtros</button><button class="btn btn-ghost" id="procClearFilters" type="button">Limpiar</button></div></div><div class="proc-legend"><span class="ok"><i></i>Concluida</span><span class="warn"><i></i>Devuelta o pendiente</span><span class="info"><i></i>En revisión / atención</span></div></article>`;
  }
  function bindFilters(root = document, routeName = 'proc-list') {
    $('#procApplyFilters', root)?.addEventListener('click', () => { readFilters(root); route(routeName); });
    $('#procClearFilters', root)?.addEventListener('click', () => { state.filters = { query: '', origin: '', dependency: '', direction: '', unit: '', dateFrom: '', dateTo: '', status: '' }; save(); route(routeName); });
    $('#procFilterQuery', root)?.addEventListener('keydown', event => { if (event.key === 'Enter') { event.preventDefault(); readFilters(root); route(routeName); } });
  }
  function bindRoutes(root = document) { $$('[data-proc-route]', root).forEach(button => button.onclick = () => route(button.dataset.procRoute)); }

  function statCards(rows) {
    const count = predicate => rows.filter(predicate).length;
    const cards = [
      ['Solicitudes visibles', rows.length, 'Según el ámbito autorizado'], ['Pendientes de revisión', count(p => ['Enviada a revisión', 'Pendiente de revisión inicial'].includes(p.status)), 'Recepción y validación inicial'], ['Pendientes de asignación', count(p => p.status === 'Pendiente de asignación'), 'Bandeja del coordinador'], ['Asignadas a Dirección', count(p => p.status === 'Asignada a Dirección'), 'Canalizadas'], ['En atención', count(p => ['En atención', 'Pendiente de validación'].includes(p.status)), 'Actuaciones de la Dirección'], ['En procedimiento', count(p => p.status === 'En procedimiento de contratación'), 'Etapa adquisitiva'], ['Concluidas', count(p => p.status === 'Concluida'), 'Cierre documental'], ['Origen OM', count(p => p.origin === Rules.ORIGINS.OFICIALIA_MAYOR), 'Creación institucional']
    ];
    return `<div class="stats-grid proc-stats">${cards.map((item, index) => `<article class="stat ${index === 0 ? 'proc-stat-accent' : ''}"><span>${esc(item[0])}</span><strong>${item[1]}</strong><small>${esc(item[2])}</small></article>`).join('')}</div>`;
  }
  function procedureTable(rows, compact = false) {
    if (!rows.length) return '<div class="proc-empty">No hay solicitudes que correspondan al alcance y filtros seleccionados.</div>';
    return `<div class="table-wrap"><table class="data-table proc-table"><thead><tr><th>Folio</th><th>Origen</th><th>Institución / área</th><th>Objeto de contratación</th><th>Recepción</th><th>Monto sin IVA</th><th>Modalidad</th><th>Estatus</th><th>Dirección asignada</th><th>Responsable</th><th>Acciones</th></tr></thead><tbody>${rows.map(p => `<tr><td><b>${esc(p.folio)}</b><small>${esc(fmtDate(p.updatedAt))}</small></td><td>${originBadge(p.origin)}</td><td><b>${esc(p.institution)}</b><small>${esc(p.requestingAreaName)}</small></td><td class="procedure-object"><b>${esc(p.object)}</b><small>${esc(p.unitAdministrative)}</small></td><td>${esc(fmtDate(p.receivedAt))}</td><td class="amount">${money(p.estimatedAmountNoVat)}</td><td>${modalityBadge(p.authorizedModality || p.proposedModality)}</td><td>${statusBadge(p.status)}</td><td>${esc(p.assignedDirectionLabel || 'Pendiente')}</td><td>${esc(p.assignedUser || p.currentOwner || p.responsible)}</td><td><div class="table-action-group"><button class="btn btn-ghost btn-small" data-proc-open="${esc(p.id)}" type="button">Abrir expediente</button></div></td></tr>`).join('')}</tbody></table></div>`;
  }
  function bindTableActions(root = document) { $$('[data-proc-open]', root).forEach(button => button.onclick = () => openProcedure(button.dataset.procOpen)); }

  function renderDashboard() {
    const rows = filteredProcedures();
    header('Procedimientos de Contratación', 'Panel de inicio', 'Recepción, clasificación, asignación y seguimiento de solicitudes de contratación dentro del ámbito autorizado.');
    content.innerHTML = contextHtml() + flowHtml(rows[0]) + statCards(rows) + `<article class="card mt24"><div class="card-head"><div><span class="kicker">Origen integrado</span><h3>Dos vías, una bandeja central</h3></div><span class="status-badge">Flujo controlado</span></div><div class="proc-origin-grid"><div><span class="proc-origin dep">DEPENDENCIA</span><b>Área Requirente → Coordinación Administrativa</b><small>La Coordinación Administrativa revisa y remite a la Oficialía Mayor.</small></div><div><span class="proc-origin om">OFICIALÍA MAYOR</span><b>Nueva solicitud de contratación</b><small>El usuario autorizado crea la solicitud y la envía a la bandeja de asignación.</small></div></div><div class="actions mt24"><button class="btn btn-primary" data-proc-route="proc-list" type="button">Abrir bandeja</button>${can('create') ? '<button class="btn btn-secondary" data-proc-route="proc-new" type="button">Nueva solicitud de contratación</button>' : ''}${state.roleCode === 'OM-PC-00' ? '<button class="btn btn-ghost" data-proc-route="proc-assignment" type="button">Pendientes de asignación</button>' : ''}</div></article><article class="card mt24"><div class="card-head"><div><span class="kicker">Actividad reciente</span><h3>Solicitudes en el alcance seleccionado</h3></div><span class="status-badge">${rows.length} registro(s)</span></div>${procedureTable(rows.slice(0, 8), true)}</article>`;
    bindRoutes(content); bindTableActions(content);
  }
  function renderList(mode = '') {
    let rows = filteredProcedures();
    if (mode === 'assignment') rows = rows.filter(p => p.status === 'Pendiente de asignación');
    if (mode === 'work') rows = rows.filter(p => p.assignedDirection === state.adscription);
    if (mode === 'mine') rows = rows.filter(p => p.creator?.name === actor() || p.assignedUser === actor() || p.currentOwner === actor());
    const title = mode === 'assignment' ? 'Pendientes de asignación' : mode === 'work' ? 'Procedimientos de mi Dirección' : mode === 'mine' ? 'Mis solicitudes' : 'Bandeja de solicitudes';
    const description = mode === 'assignment' ? 'Solicitudes recibidas de dependencias y originadas directamente en la Oficialía Mayor, pendientes de clasificación y canalización.' : mode === 'work' ? 'Consulte únicamente los expedientes de la adscripción técnica seleccionada.' : mode === 'mine' ? 'Solicitudes creadas por usted o asignadas expresamente a su usuario.' : 'Consulte y filtre los expedientes autorizados para este perfil.';
    header('Procedimientos de Contratación', title, description);
    content.innerHTML = contextHtml() + (mode ? '' : filterHtml()) + `<article class="card ${mode ? '' : 'mt24'}"><div class="card-head"><div><span class="kicker">Bandeja de trabajo</span><h3>${rows.length} solicitud(es)</h3></div>${can('create') ? '<button class="btn btn-primary btn-small" data-proc-route="proc-new" type="button">Nueva solicitud</button>' : ''}</div>${procedureTable(rows)}</article>`;
    if (!mode) bindFilters(content, 'proc-list');
    bindRoutes(content); bindTableActions(content);
  }

  function newDraft() {
    const officialia = isOfficialiaRole();
    const base = makeProcedure('BORRADOR', { origin: officialia ? Rules.ORIGINS.OFICIALIA_MAYOR : Rules.ORIGINS.DEPENDENCIA, dependencyKey: officialia ? '234' : state.dependencyKey, requestingArea: officialia ? '234-om' : state.areaId, creator: { userId: `${state.roleCode}-DEMO`, name: actor(), roleCode: state.roleCode }, status: 'Borrador', registeredAt: today(), updatedAt: today(), receivedAt: today() });
    base.folio = 'Se genera al guardar'; base.id = ''; base.currentOwner = actor(); base.documents = docs();
    return base;
  }
  function formValue(p, key) { return esc(p?.[key] ?? ''); }
  function formHtml(p) {
    const officialia = p.origin === Rules.ORIGINS.OFICIALIA_MAYOR;
    const depOptions = DEPENDENCIES.filter(item => item.key !== '234').map(item => `<option value="${item.key}" ${String(p.dependencyKey) === item.key ? 'selected' : ''}>${esc(item.name)}</option>`).join('');
    const areaOptions = AREAS.filter(item => item.dependencyKey === String(p.dependencyKey)).map(item => `<option value="${item.id}" ${item.id === p.requestingArea ? 'selected' : ''}>${esc(item.name)}</option>`).join('');
    return `<article class="card proc-form"><div class="card-head"><div><span class="kicker">${p.id ? 'Editar expediente' : 'Nueva solicitud de contratación'}</span><h3>${esc(p.folio || 'Borrador sin folio')}</h3></div>${statusBadge(p.status)}</div><div class="proc-alert"><strong>Origen: ${esc(originLabel(p.origin))}</strong><p>${officialia ? 'La solicitud se integrará directamente a la bandeja central de la Coordinación de Procedimientos Adquisitivos.' : 'El Área Requirente debe remitir la solicitud a la Coordinación Administrativa; no se permite omitir esa etapa.'}</p></div><div class="proc-section-title">Identificación de la solicitud</div><div class="proc-modal-grid"><label>Folio<input value="${formValue(p, 'folio')}" readonly></label><label>Fecha de registro<input value="${formValue(p, 'registeredAt')}" readonly></label><label>Origen<input value="${esc(originLabel(p.origin))}" readonly></label><label>Usuario que registra<input value="${esc(p.creator?.name || actor())}" readonly></label><label class="span2">Institución de origen${officialia ? '<input value="Oficialía Mayor" readonly>' : `<select data-pc-field="dependencyKey"><option value="">Seleccione</option>${depOptions}</select>`}</label><label class="span2">Unidad administrativa solicitante${officialia ? '<input value="Coordinación de Procedimientos Adquisitivos" readonly>' : `<select data-pc-field="requestingArea"><option value="">Seleccione</option>${areaOptions}</select>`}</label><label class="span2">Área solicitante<input data-pc-field="requestingAreaName" value="${formValue(p, 'requestingAreaName')}" ${officialia ? 'readonly' : ''}></label><label>Nombre y cargo del responsable<input data-pc-field="responsible" value="${formValue(p, 'responsible')}"></label><label>Moneda<select data-pc-field="currency"><option ${p.currency === 'MXN' ? 'selected' : ''}>MXN</option><option ${p.currency === 'USD' ? 'selected' : ''}>USD</option></select></label></div><div class="proc-section-title">Necesidad y contratación</div><div class="proc-modal-grid"><label class="span2">Objeto de la contratación<input data-pc-field="object" value="${formValue(p, 'object')}" placeholder="Describa el objeto de contratación"></label><label class="span2">Descripción de la necesidad<textarea data-pc-field="description" rows="3" placeholder="Describa la necesidad institucional">${formValue(p, 'description')}</textarea></label><label class="span2">Justificación<textarea data-pc-field="justification" rows="3" placeholder="Explique la necesidad y el beneficio institucional">${formValue(p, 'justification')}</textarea></label><label>Tipo de contratación<select data-pc-field="contractType"><option value="">Seleccione</option>${TYPES.map(item => `<option ${p.contractType === item ? 'selected' : ''}>${item}</option>`).join('')}</select></label><label>Clasificación<select data-pc-field="classification"><option value="">Seleccione</option>${TYPES.map(item => `<option ${p.classification === item ? 'selected' : ''}>${item}</option>`).join('')}</select></label><label>Modalidad propuesta<select data-pc-field="proposedModality"><option value="">Pendiente</option>${MODALITIES.map(item => `<option value="${item.value}" ${p.proposedModality === item.value ? 'selected' : ''}>${esc(item.label)}</option>`).join('')}</select></label><label>Importe estimado sin IVA<input data-pc-field="estimatedAmountNoVat" type="number" min="0" step="0.01" value="${formValue(p, 'estimatedAmountNoVat')}"></label><label>Presupuesto autorizado<input data-pc-field="budgetAuthorized" type="number" min="0" step="0.01" value="${formValue(p, 'budgetAuthorized')}"></label><label>Fuente de financiamiento<input data-pc-field="fundingSource" value="${formValue(p, 'fundingSource')}"></label><label class="span2">Información presupuestaria<textarea data-pc-field="budgetInfo" rows="2">${formValue(p, 'budgetInfo')}</textarea></label><label>Referencia PAA<input data-pc-field="paaReference" value="${formValue(p, 'paaReference')}"></label><label>Estudio de mercado<input data-pc-field="marketStudyReference" value="${formValue(p, 'marketStudyReference')}"></label><label class="span2">Observaciones<textarea data-pc-field="observations" rows="2">${formValue(p, 'observations')}</textarea></label></div><div class="proc-section-title">Documentación inicial</div><div class="proc-doc-list">${(p.documents || []).slice(0, 8).map(d => `<div class="proc-doc-row"><div><b>${esc(d.title)}</b><small>${esc(d.type)} · ${d.required ? 'Requerido para integrar la solicitud' : 'Según corresponda'}</small></div><div class="proc-doc-actions"><span class="doc-status ${d.status === 'integrated' ? 'done' : 'pending'}">${d.status === 'integrated' ? '✓ ' + esc(d.file) : 'Pendiente'}</span>${can('edit', p) || !p.id ? `<label class="btn btn-secondary btn-small file-btn">${d.status === 'integrated' ? 'Reemplazar' : 'Seleccionar'}<input type="file" data-pc-doc="${esc(d.id)}" accept=".pdf,.png,.jpg,.jpeg"></label>` : ''}</div></div>`).join('')}</div><p class="proc-note"><b>Persistencia DEMO:</b> los archivos no se almacenan como expediente institucional; sólo se conserva el nombre y metadatos en el navegador.</p><div class="actions"><button class="btn btn-ghost" data-pc-back type="button">Regresar</button><button class="btn btn-secondary" data-pc-save type="button">Guardar borrador</button>${p.id && (can('send_to_ca', p) || (isOfficialiaRole() && can('edit', p) && p.origin === Rules.ORIGINS.OFICIALIA_MAYOR)) ? '<button class="btn btn-primary" data-pc-send type="button">Enviar al siguiente paso</button>' : ''}</div></article>`;
  }
  function captureForm(p) {
    $$('[data-pc-field]', content).forEach(input => {
      const key = input.dataset.pcField; p[key] = input.type === 'number' ? (input.value === '' ? '' : Number(input.value)) : input.value;
    });
    if (p.requestingArea) { p.requestingAreaName = area(p.requestingArea).name; p.unitAdministrative = p.origin === Rules.ORIGINS.OFICIALIA_MAYOR ? 'Coordinación de Procedimientos Adquisitivos' : area(p.requestingArea).name; }
    if (p.origin === Rules.ORIGINS.DEPENDENCIA) { p.institution = dependency(p.dependencyKey).name; p.originLabel = originLabel(p.origin); p.administrativeCoordination = `Coordinación Administrativa ${dependency(p.dependencyKey).sigla}`; }
    p.contractTypeLabel = p.contractType;
    p.updatedAt = today();
  }
  function saveFormDraft(p, isNew) {
    captureForm(p);
    if (isNew) {
      p.id = nextFolio(); p.folio = p.id; p.registeredAt = today(); p.receivedAt = today(); p.creator = { userId: `${state.roleCode}-DEMO`, name: actor(), roleCode: state.roleCode }; p.currentOwner = actor(); p.history = [event(stamp(), actor(), state.roleCode, 'Creación', 'Solicitud guardada como borrador.', '', 'Borrador')]; state.procedures.unshift(p); editingId = p.id; state.draft = null; addAudit(p, 'Creación de solicitud', '', 'Borrador', `Origen registrado: ${originLabel(p.origin)}.`); selectedId = p.id;
    } else { addAudit(p, 'Actualización de solicitud', p.status, p.status, 'Se actualizaron datos y documentos en el expediente.'); }
    save(); toast(`La solicitud ${p.folio} quedó guardada como borrador.`); setTimeout(() => renderDetail(), 0);
  }
  function validateSend(p) {
    const issues = Rules.validateInputs({ exercise: p.fiscalYear, dependencyKey: p.dependencyKey, areaId: p.requestingArea, description: p.description, justification: p.justification, type: p.contractType, estimatedAmountNoVat: p.estimatedAmountNoVat, budgetAuthorized: p.budgetAuthorized });
    if (!documentReady(p, 'request')) issues.push('Integre el documento Solicitud de contratación.');
    if (!documentReady(p, 'justification')) issues.push('Integre la Justificación de la necesidad.');
    if (!documentReady(p, 'budget')) issues.push('Integre la Información presupuestaria.');
    return issues;
  }
  function sendRequest(p) {
    captureForm(p);
    const issues = validateSend(p); if (issues.length) return toast(issues.join(' '));
    if (state.roleCode === 'DEP-AR' && can('send_to_ca', p)) { if (transition(p, 'Enviada a revisión', 'Remisión a Coordinación Administrativa', 'El Área Requirente remitió la solicitud para revisión administrativa.')) { notify(`${p.folio}: solicitud recibida por la Coordinación Administrativa.`, 'DEP-CA'); save(); renderDetail(); } return; }
    if (isOfficialiaRole() && can('edit', p) && p.origin === Rules.ORIGINS.OFICIALIA_MAYOR && Rules.canTransition(p.status, 'Pendiente de asignación')) { if (transition(p, 'Pendiente de asignación', 'Remisión a bandeja de asignación', 'Solicitud originada en la Oficialía Mayor enviada a revisión central.')) { notify(`${p.folio}: nueva solicitud disponible para revisión inicial.`); save(); renderDetail(); } return; }
    toast('El perfil actual no puede remitir esta solicitud en la etapa actual.');
  }
  function renderForm() {
    let p = editingId ? proc(editingId) : state.draft;
    if (!p) { p = newDraft(); state.draft = p; }
    header('Procedimientos de Contratación', p.id ? 'Editar solicitud de contratación' : 'Nueva solicitud de contratación', 'Capture la información que corresponda a la etapa. Los controles de autorización se validan en la lógica del módulo.');
    content.innerHTML = contextHtml() + formHtml(p);
    $$('[data-pc-doc]', content).forEach(input => input.onchange = () => { const file = input.files[0]; if (!file) return; const d = p.documents.find(item => item.id === input.dataset.pcDoc); if (!d) return; d.status = 'integrated'; d.file = file.name; d.uploadedAt = stamp(); d.uploadedBy = actor(); save(); renderForm(); });
    $('[data-pc-back]', content)?.addEventListener('click', () => route('proc-list'));
    $('[data-pc-save]', content)?.addEventListener('click', () => saveFormDraft(p, !p.id));
    $('[data-pc-send]', content)?.addEventListener('click', () => { if (!p.id) saveFormDraft(p, true); else { captureForm(p); save(); sendRequest(p); } });
  }

  function docsHtml(p) {
    return `<article class="card"><div class="card-head"><div><span class="kicker">Expediente electrónico</span><h3>Documentos y versiones</h3></div><span class="status-badge">${documentsDone(p)}/${documentsTotal(p)} integrados</span></div><div class="proc-doc-list">${(p.documents || []).map(d => `<div class="proc-doc-row"><div><b>${esc(d.title)}</b><small>${esc(d.type)} · ${d.required ? 'Requerido' : 'Según corresponda'}</small></div><div class="proc-doc-actions"><span class="doc-status ${d.status === 'integrated' ? 'done' : 'pending'}">${d.status === 'integrated' ? '✓ ' + esc(d.file) : 'Pendiente'}</span>${can('edit', p) ? `<label class="btn btn-secondary btn-small file-btn">${d.status === 'integrated' ? 'Reemplazar' : 'Integrar'}<input type="file" data-detail-doc="${esc(d.id)}" accept=".pdf,.png,.jpg,.jpeg"></label>` : ''}</div></div>`).join('')}</div><p class="proc-note"><b>Control documental:</b> la interfaz muestra metadatos locales. No se afirma almacenamiento institucional, firma electrónica ni validez jurídica.</p></article>`;
  }
  function assignmentHistoryHtml(p) {
    return `<article class="card"><div class="card-head"><div><span class="kicker">Asignaciones</span><h3>Historial de distribución</h3></div><span class="status-badge">${(p.assignmentHistory || []).length} movimiento(s)</span></div>${(p.assignmentHistory || []).length ? `<div class="proc-timeline">${p.assignmentHistory.slice().reverse().map(item => `<div class="proc-timeline-item"><span class="proc-timeline-dot"></span><div><b>${esc(item.directionLabel)}</b><small>${esc(item.when)} · ${esc(item.user)}</small><p>Responsable: ${esc(item.responsible)} · Motivo: ${esc(item.reason || 'Asignación inicial')}</p></div></div>`).join('')}</div>` : '<div class="proc-empty">Aún no existen asignaciones.</div>'}</article>`;
  }
  function historyHtml(p) {
    return `<article class="card"><div class="card-head"><div><span class="kicker">Bitácora del expediente</span><h3>Actuaciones y transiciones</h3></div><span class="status-badge">${(p.history || []).length} evento(s)</span></div><div class="proc-timeline">${(p.history || []).slice().reverse().map(item => `<div class="proc-timeline-item"><span class="proc-timeline-dot"></span><div><b>${esc(item.action)}</b><small>${esc(item.when)} · ${esc(item.user)} · ${esc(item.role || '')}</small><p>${esc(item.detail || '—')}${item.from || item.to ? ` · ${esc(item.from || '—')} → ${esc(item.to || '—')}` : ''}${item.observation ? ` · Motivo: ${esc(item.observation)}` : ''}</p></div></div>`).join('')}</div></article>`;
  }
  function actionList(p) {
    const actions = [];
    if (can('edit', p)) actions.push({ id: 'edit', label: 'Editar captura', kind: 'secondary' });
    if (can('send_to_ca', p)) actions.push({ id: 'send', label: 'Enviar a Coordinación Administrativa', kind: 'primary' });
    if (isOfficialiaRole() && p.origin === Rules.ORIGINS.OFICIALIA_MAYOR && can('edit', p) && ['Borrador', 'Devuelta para aclaración'].includes(p.status)) actions.push({ id: 'send-om', label: 'Enviar a bandeja de asignación', kind: 'primary' });
    if (can('ca_review', p)) actions.push({ id: 'ca-review', label: p.status === 'Enviada a revisión' ? 'Iniciar revisión administrativa' : 'Continuar revisión administrativa', kind: 'secondary' });
    if (state.roleCode === 'DEP-CA' && ['Pendiente de revisión inicial', 'Pendiente de validación'].includes(p.status)) { actions.push({ id: 'ca-observe', label: 'Devolver para aclaración', kind: 'warning' }); actions.push({ id: 'ca-remit', label: 'Remitir a Oficialía Mayor', kind: 'primary' }); }
    if (can('initial_review', p)) { actions.push({ id: 'initial-review', label: 'Registrar revisión inicial', kind: 'secondary' }); actions.push({ id: 'initial-observe', label: 'Devolver por revisión inicial', kind: 'warning' }); }
    if (can('assign', p)) actions.push({ id: 'assign', label: 'Clasificar y asignar Dirección', kind: 'primary' });
    if (can('reassign', p)) actions.push({ id: 'reassign', label: 'Reasignar expediente', kind: 'warning' });
    if (can('supervise', p) && p.status === 'Asignada a Dirección') actions.push({ id: 'accept', label: 'Aceptar expediente en Dirección', kind: 'primary' });
    if (can('bases_lpn', p)) actions.push({ id: 'bases-lpn', label: 'Elaborar / revisar bases LPN', kind: 'secondary' });
    if (can('bases_ir_ad', p)) actions.push({ id: 'bases-ir-ad', label: 'Elaborar / revisar bases IR / AD', kind: 'secondary' });
    if (can('execute', p)) actions.push({ id: 'execute', label: 'Registrar actuación de concurso', kind: 'secondary' });
    if (can('committee', p)) actions.push({ id: 'committee', label: 'Registrar apoyo o acuerdo de Comité', kind: 'secondary' });
    if (can('contract', p)) actions.push({ id: 'contract', label: 'Gestionar documentación contractual', kind: 'secondary' });
    if (can('conclude', p)) actions.push({ id: 'conclude', label: 'Concluir expediente', kind: 'primary' });
    return actions;
  }
  function recommendationHtml(p) {
    const result = Rules.recommendation({ exercise: p.fiscalYear, budgetAuthorized: p.budgetAuthorized, estimatedAmountNoVat: p.estimatedAmountNoVat }, state.normativeConfig);
    if (result.status !== 'calculated') return `<div class="proc-recommendation"><b>Modalidad por monto</b><h3>Pendiente de determinar</h3><p class="rule-line">${esc((result.missing || []).join(' · ') || 'Complete los datos de presupuesto y monto.')}</p></div>`;
    return `<div class="proc-recommendation"><div class="recommendation-layout"><div><span class="kicker">Apoyo de determinación</span><h3>Modalidad sugerida: <span class="suggested">${esc(result.suggested)}</span></h3><p class="rule-line">${esc(result.explanation)}</p></div><div>${modalityBadge(p.authorizedModality || result.suggested)}</div></div><div class="recommendation-meta"><div><small>Intervalo de presupuesto</small><strong>${esc(result.interval.label)}</strong></div><div><small>Presupuesto autorizado</small><strong>${money(result.budgetAuthorized)}</strong></div><div><small>Monto sin IVA</small><strong>${money(result.amount)}</strong></div></div><p class="micro"><b>Advertencia:</b> la sugerencia es apoyo de captura y no constituye autorización jurídica.</p></div>`;
  }
  function activitySummary(p) { return (p.actions || []).length ? `<div class="proc-event-list">${p.actions.slice().reverse().map(item => `<div class="proc-event-card"><header><h4>${esc(item.title)}</h4><span class="proc-badge">${esc(item.when)}</span></header><p>${esc(item.detail)}</p><small>${esc(item.user)} · ${esc(item.role)}</small></div>`).join('')}</div>` : '<div class="proc-empty">Sin actuaciones adicionales registradas.</div>'; }
  function renderDetail() {
    const p = proc(selectedId); if (!p || !inScope(p)) return toast('El expediente no está dentro del ámbito autorizado para este usuario.');
    const actions = actionList(p);
    header('Procedimientos de Contratación', `Expediente ${p.folio}`, 'Consulta de datos, documentos, asignaciones y bitácora con acciones limitadas por perfil y etapa.');
    content.innerHTML = contextHtml() + flowHtml(p) + `<div class="proc-detail-grid"><div class="proc-detail-main"><article class="card"><div class="card-head"><div><span class="kicker">Solicitud de contratación</span><h3>${esc(p.object)}</h3></div><div>${originBadge(p.origin)} ${statusBadge(p.status)}</div></div><div class="proc-data-grid"><div><small>Folio</small><strong>${esc(p.folio)}</strong></div><div><small>Origen</small><strong>${esc(originLabel(p.origin))}</strong></div><div><small>Institución de origen</small><strong>${esc(p.institution)}</strong></div><div><small>Unidad administrativa</small><strong>${esc(p.unitAdministrative)}</strong></div><div><small>Área solicitante</small><strong>${esc(p.requestingAreaName)}</strong></div><div><small>Usuario creador</small><strong>${esc(p.creator?.name || '—')}</strong></div><div><small>Ejercicio fiscal</small><strong>${p.fiscalYear}</strong></div><div><small>Tipo / clasificación</small><strong>${esc(p.contractType)} · ${esc(p.classification)}</strong></div><div><small>Responsable actual</small><strong>${esc(p.assignedUser || p.currentOwner || p.responsible)}</strong></div><div class="wide"><small>Descripción de la necesidad</small><strong>${esc(p.description)}</strong></div><div class="wide"><small>Justificación</small><strong>${esc(p.justification)}</strong></div><div><small>Procedimiento</small><strong>${esc(p.procedureStatus)}</strong></div><div><small>Contrato</small><strong>${esc(p.contractStatus)}</strong></div><div><small>Recepción / actualización</small><strong>${esc(fmtDate(p.receivedAt))} · ${esc(fmtDate(p.updatedAt))}</strong></div></div></article><article class="card"><div class="card-head"><div><span class="kicker">Datos capturados y pendientes de validación</span><h3>Determinación de modalidad</h3></div><span class="status-badge">Sin autorización automática</span></div>${recommendationHtml(p)}<div class="proc-data-grid mt24"><div><small>Modalidad propuesta</small><strong>${esc(p.proposedModality || 'Pendiente')}</strong></div><div><small>Modalidad autorizada</small><strong>${esc(p.authorizedModality || 'Pendiente')}</strong></div><div><small>Importe estimado sin IVA</small><strong>${money(p.estimatedAmountNoVat)}</strong></div><div><small>Presupuesto autorizado</small><strong>${money(p.budgetAuthorized)}</strong></div><div><small>Fuente de financiamiento</small><strong>${esc(p.fundingSource || 'Pendiente')}</strong></div><div><small>Referencia PAA / estudio</small><strong>${esc(p.paaReference || 'No capturada')} · ${esc(p.marketStudyReference || 'No capturado')}</strong></div></div><p class="micro"><b>Fuente de regla DEMO:</b> ${esc(Rules.SOURCE.decree)} · ${esc(Rules.SOURCE.article)} · ${esc(Rules.SOURCE.table)}. Valores expresados en pesos y monto sin IVA.</p></article>${docsHtml(p)}${assignmentHistoryHtml(p)}<article class="card"><div class="card-head"><div><span class="kicker">Actuaciones de la Dirección</span><h3>Registro operativo</h3></div><span class="status-badge">${(p.actions || []).length} actuación(es)</span></div>${activitySummary(p)}</article>${historyHtml(p)}</div><div class="proc-detail-side"><article class="card proc-sticky"><div class="card-head"><div><span class="kicker">Acciones autorizadas</span><h3>${esc(currentRole().shortLabel)}</h3></div><span class="status-badge">${actions.length} disponible(s)</span></div><div class="proc-action-list">${actions.map(item => `<button class="btn btn-${item.kind} full" data-proc-action="${item.id}" type="button">${esc(item.label)}</button>`).join('') || '<div class="proc-empty">Este perfil sólo tiene consulta en la etapa actual.</div>'}</div><div class="proc-permission-box proc-note mt24"><b>Segregación de funciones</b><ul><li>La adscripción se verifica junto con el perfil.</li><li>Crear una solicitud no concede permiso para asignar, aprobar, fallar o formalizar.</li><li>Cada cambio relevante conserva usuario, fecha, estado anterior, estado nuevo y motivo.</li></ul></div><button class="btn btn-ghost full mt24" data-proc-back-list type="button">Regresar a la bandeja</button></article></div></div>`;
    $('[data-proc-back-list]', content)?.addEventListener('click', () => route('proc-list'));
    $$('[data-proc-action]', content).forEach(button => button.onclick = () => performAction(p, button.dataset.procAction));
    $$('[data-detail-doc]', content).forEach(input => input.onchange = () => { const file = input.files[0]; if (!file) return; const d = p.documents.find(item => item.id === input.dataset.detailDoc); if (!d) return; d.status = 'integrated'; d.file = file.name; d.uploadedAt = stamp(); d.uploadedBy = actor(); addAudit(p, 'Integración o reemplazo documental', p.status, p.status, `Documento: ${d.title}`, '', d.file); save(); renderDetail(); });
  }

  function assignmentModal(p, reassignment = false) {
    const current = p.assignedDirection || 'OM_DPA_A';
    $('#modalBody').innerHTML = `<p>${reassignment ? 'La reasignación requiere conservar el motivo y el historial de la asignación anterior.' : 'Seleccione la Dirección competente y el responsable receptor.'}</p><div class="proc-modal-grid"><label>Dirección receptora<select id="procAssignmentDirectionSelect">${Rules.DIRECTIONS.map(item => `<option value="${item.key}" ${item.key === current ? 'selected' : ''}>${esc(item.label)}</option>`).join('')}</select></label><label>Responsable<input id="procAssignee" value="${esc(userFor('OM-PC-01', current))}" readonly></label><label class="span2">Motivo ${reassignment ? '(obligatorio)' : ''}<textarea id="procAssignmentReason" rows="4" placeholder="Justifique la canalización o reasignación.">${reassignment ? '' : 'Canalización conforme a atribuciones y carga de trabajo.'}</textarea></label></div>`;
    $('#modalActions').innerHTML = '<button class="btn btn-secondary" data-proc-close type="button">Cancelar</button><button class="btn btn-primary" data-proc-save-assignment type="button">Guardar asignación</button>';
    openModal(reassignment ? 'Reasignar expediente' : 'Clasificar y asignar Dirección', true);
    $('[data-proc-close]', $('#modalActions')).onclick = closeModal;
    $('#procAssignmentDirectionSelect').onchange = () => { $('#procAssignee').value = esc(userFor('OM-PC-01', $('#procAssignmentDirectionSelect').value)); };
    $('[data-proc-save-assignment]', $('#modalActions')).onclick = () => {
      const dir = $('#procAssignmentDirectionSelect').value; const reason = $('#procAssignmentReason').value.trim();
      if (reassignment && !reason) return toast('La reasignación requiere un motivo.');
      const previous = p.assignedDirectionLabel || 'Sin Dirección asignada'; const wasAssigned = !!p.assignedDirection;
      p.assignedDirection = dir; p.assignedDirectionLabel = adscriptionLabel(dir); p.assignedRoleCode = 'OM-PC-01'; p.assignedUser = userFor('OM-PC-01', dir); p.assignedAt = today(); p.assignmentHistory ||= []; p.assignmentHistory.push({ user: actor(), when: stamp(), direction: dir, directionLabel: adscriptionLabel(dir), responsible: p.assignedUser, reason });
      if (reassignment) addAudit(p, 'Reasignación de expediente', p.status, p.status, `${previous} → ${p.assignedDirectionLabel}`, reason); else if (Rules.canTransition(p.status, 'Asignada a Dirección')) transition(p, 'Asignada a Dirección', 'Asignación a Dirección', `Expediente canalizado a ${p.assignedDirectionLabel}.`, reason);
      else addAudit(p, 'Asignación a Dirección', p.status, p.status, `Expediente canalizado a ${p.assignedDirectionLabel}.`, reason);
      if (!wasAssigned) notify(`${p.folio}: expediente asignado a ${p.assignedDirectionLabel}.`, p.assignedRoleCode);
      closeModal(); save(); renderDetail();
    };
  }
  function activityModal(p, kind) {
    const config = {
      'bases-lpn': { title: 'Bases de Licitación Pública', action: 'Elaboración de bases LPN', document: 'bases', detail: 'Se registró una actuación de elaboración o revisión de bases de licitación pública.', procedure: 'En preparación' },
      'bases-ir-ad': { title: 'Bases de Invitación Restringida / AD', action: 'Elaboración de bases IR / AD', document: 'bases', detail: 'Se registró una actuación de preparación de invitación restringida o adjudicación directa.', procedure: 'En preparación' },
      execute: { title: 'Ejecución de concursos', action: 'Actuación de ejecución', document: 'technical', detail: 'Se registró un acto operativo del procedimiento sin atribuir facultad de autorización jurídica.', procedure: 'En ejecución' },
      committee: { title: 'Apoyo a Comité', action: 'Registro de apoyo o acuerdo de Comité', document: 'committee', detail: 'Se incorporó documentación para sesión, acuerdo o seguimiento del Comité.', procedure: 'En ejecución' },
      contract: { title: 'Gestión contractual', action: 'Gestión de documentación contractual', document: 'contract', detail: 'Se registró una actuación contractual; la firma queda reservada a la persona legalmente facultada.', procedure: 'En ejecución' }
    }[kind];
    if (!config) return;
    $('#modalBody').innerHTML = `<p>${esc(config.detail)}</p><div class="proc-modal-grid"><label class="span2">Descripción de la actuación<textarea id="procActivityText" rows="4" placeholder="Describa la actuación, documento o seguimiento.">${esc(config.detail)}</textarea></label><label class="span2">Documento de soporte<input id="procActivityFile" type="file" accept=".pdf,.png,.jpg,.jpeg"></label></div>`;
    $('#modalActions').innerHTML = '<button class="btn btn-secondary" data-proc-close type="button">Cancelar</button><button class="btn btn-primary" data-proc-save-activity type="button">Registrar actuación</button>';
    openModal(config.title, true); $('[data-proc-close]', $('#modalActions')).onclick = closeModal;
    $('[data-proc-save-activity]', $('#modalActions')).onclick = () => {
      const detail = $('#procActivityText').value.trim(); const file = $('#procActivityFile').files[0]; if (!detail) return toast('Capture la descripción de la actuación.');
      p.actions ||= []; p.actions.push({ title: config.title, detail, user: actor(), role: roleName(state.roleCode), when: stamp(), document: file?.name || '' });
      const d = p.documents.find(item => item.id === config.document); if (d) { d.status = 'integrated'; d.file = file?.name || `${config.title} · DEMO.pdf`; d.uploadedAt = stamp(); d.uploadedBy = actor(); }
      if (p.status === 'Asignada a Dirección' && Rules.canTransition(p.status, 'En atención')) transition(p, 'En atención', 'Inicio de atención', 'La Dirección receptora inició las actuaciones de su competencia.');
      if (config.procedure === 'En preparación') p.procedureStatus = 'En preparación'; else { p.procedureStatus = 'En ejecución'; if (Rules.canTransition(p.status, 'En procedimiento de contratación')) transition(p, 'En procedimiento de contratación', config.action, config.detail, '', file?.name || ''); else addAudit(p, config.action, p.status, p.status, config.detail, '', file?.name || ''); }
      if (kind === 'contract') p.contractStatus = 'En elaboración';
      else addAudit(p, config.action, p.status, p.status, detail, '', file?.name || '');
      closeModal(); save(); renderDetail();
    };
  }
  function contractModal(p) {
    $('#modalBody').innerHTML = '<p>La gestión documental no equivale a firma o autorización contractual. Seleccione el estado documental que corresponda y deje evidencia.</p><div class="proc-modal-grid"><label>Estado contractual<select id="procContractStatus"><option value="En elaboración">En elaboración</option><option value="Formalización pendiente">Formalización pendiente</option><option value="Formalizado">Formalizado por persona facultada</option></select></label><label>Documento<input id="procContractFile" type="file" accept=".pdf,.png,.jpg,.jpeg"></label><label class="span2">Observación<textarea id="procContractText" rows="4" placeholder="Indique revisión, formalización o pendiente documental."></textarea></label></div>';
    $('#modalActions').innerHTML = '<button class="btn btn-secondary" data-proc-close type="button">Cancelar</button><button class="btn btn-primary" data-proc-save-contract type="button">Guardar gestión contractual</button>';
    openModal('Gestión contractual', true); $('[data-proc-close]', $('#modalActions')).onclick = closeModal;
    $('[data-proc-save-contract]', $('#modalActions')).onclick = () => { const status = $('#procContractStatus').value; const text = $('#procContractText').value.trim(); const file = $('#procContractFile').files[0]; if (!text) return toast('Capture la observación contractual.'); p.contractStatus = status; p.actions ||= []; p.actions.push({ title: 'Gestión contractual', detail: text, user: actor(), role: roleName(state.roleCode), when: stamp(), document: file?.name || '' }); const d = p.documents.find(item => item.id === 'contract'); if (d) Object.assign(d, { status: 'integrated', file: file?.name || 'Documento contractual · DEMO.pdf', uploadedAt: stamp(), uploadedBy: actor() }); addAudit(p, 'Gestión contractual', p.status, p.status, text, '', file?.name || ''); if (status === 'Formalizado' && p.status === 'En atención' && Rules.canTransition(p.status, 'En procedimiento de contratación')) transition(p, 'En procedimiento de contratación', 'Formalización contractual documentada', 'El expediente conserva un registro documental; la firma debe ser de persona legalmente facultada.'); closeModal(); save(); renderDetail(); };
  }
  function performAction(p, action) {
    if (!inScope(p)) return toast('Operación fuera del ámbito autorizado.');
    if (action === 'edit') { editingId = p.id; route('proc-new'); return; }
    if (action === 'send' || action === 'send-om') { sendRequest(p); return; }
    if (action === 'ca-review') { if (transition(p, 'Pendiente de revisión inicial', 'Inicio de revisión administrativa', 'La Coordinación Administrativa tomó la solicitud para revisar datos y documentos.')) { p.currentOwner = actor(); save(); renderDetail(); } return; }
    if (action === 'ca-observe') { observationModal('Devolver solicitud para aclaración', 'La devolución requiere precisar la información pendiente.', text => { p.observations ||= []; p.observations.push({ when: stamp(), user: actor(), reason: text }); if (transition(p, 'Devuelta para aclaración', 'Solicitud de aclaración', 'La Coordinación Administrativa devolvió la solicitud al Área Requirente.', text)) { notify(`${p.folio}: la Coordinación Administrativa solicitó aclaraciones.`, 'DEP-AR'); save(); renderDetail(); } }); return; }
    if (action === 'ca-remit') { if (!documentReady(p, 'budget')) return toast('Integre la información presupuestaria antes de remitir a la Oficialía Mayor.'); if (transition(p, 'Pendiente de asignación', 'Remisión a Oficialía Mayor', 'La Coordinación Administrativa remitió la solicitud a la bandeja central de recepción y asignación.')) { notify(`${p.folio}: solicitud recibida en la Coordinación de Procedimientos Adquisitivos.`, 'OM-PC-00'); save(); renderDetail(); } return; }
    if (action === 'initial-review') { p.initialReview = { user: actor(), role: roleName(state.roleCode), when: stamp(), result: 'Revisión inicial registrada' }; if (p.status === 'Enviada a revisión') transition(p, 'Pendiente de revisión inicial', 'Revisión inicial', 'La Coordinación de Procedimientos Adquisitivos recibió la solicitud para revisión documental inicial.'); else addAudit(p, 'Revisión inicial registrada', p.status, p.status, 'Se revisaron datos y documentos iniciales.'); save(); renderDetail(); return; }
    if (action === 'initial-observe') { observationModal('Devolver desde revisión inicial', 'La devolución requiere registrar el motivo de la aclaración.', text => { p.observations ||= []; p.observations.push({ when: stamp(), user: actor(), reason: text }); if (Rules.canTransition(p.status, 'Devuelta para aclaración')) transition(p, 'Devuelta para aclaración', 'Devolución en revisión inicial', 'La Coordinación de Procedimientos Adquisitivos solicitó aclaración.', text); else addAudit(p, 'Devolución en revisión inicial', p.status, p.status, 'Se solicitó aclaración antes de asignar.', text); save(); renderDetail(); }); return; }
    if (action === 'assign') { assignmentModal(p, false); return; }
    if (action === 'reassign') { assignmentModal(p, true); return; }
    if (action === 'accept') { if (transition(p, 'En atención', 'Recepción en Dirección', 'La Dirección receptora aceptó el expediente asignado.')) { p.procedureStatus = 'En preparación'; save(); renderDetail(); } return; }
    if (['bases-lpn', 'bases-ir-ad', 'execute', 'committee'].includes(action)) { activityModal(p, action); return; }
    if (action === 'contract') { contractModal(p); return; }
    if (action === 'conclude') { if (p.contractStatus !== 'Formalizado' && !['OM-PC-01', 'OM-PC-05'].includes(state.roleCode)) return toast('La documentación contractual debe estar formalizada o debe intervenir un perfil con atribución de supervisión de cierre.'); confirmModal('Concluir expediente', `¿Confirma la conclusión demostrativa del expediente ${p.folio}?`, 'Concluir expediente', () => { p.procedureStatus = 'Concluido'; p.contractStatus = p.contractStatus === 'Formalizado' ? 'Cerrado' : p.contractStatus; if (transition(p, 'Concluida', 'Cierre documental', 'Se consolidó el expediente y su bitácora DEMO.')) { save(); renderDetail(); } }); }
  }

  function renderPermissions() {
    if (state.roleCode !== 'OM-PC-00') return toast('La configuración central sólo está disponible para el Coordinador de Asignación.');
    header('Administración funcional', 'Catálogo de perfiles y permisos', 'Consulta del catálogo definitivo del módulo y autorización independiente para crear solicitudes. No se editan roles ni se elevan facultades jurídicas.');
    const rows = Object.values(ROLE_CATALOG);
    content.innerHTML = contextHtml() + `<article class="card"><div class="card-head"><div><span class="kicker">Catálogo del módulo</span><h3>${rows.length} perfiles autorizables</h3></div><span class="status-badge">Módulo aislado</span></div><p>El catálogo de Procedimientos de Contratación sólo contiene los nueve perfiles OM-PC y los dos perfiles operativos de dependencias. Los roles exclusivos de Estudios de Mercado no se ofrecen aquí.</p><div class="table-wrap"><table class="data-table proc-permission-table"><thead><tr><th>Clave</th><th>Perfil</th><th>Adscripción</th><th>Consultar expedientes</th><th>Crear solicitudes</th><th>Asignar a Dirección</th><th>Funciones operativas</th></tr></thead><tbody>${rows.map(r => `<tr><td><b>${esc(r.code)}</b></td><td>${esc(r.label)}</td><td>${esc(r.adscriptions.map(adscriptionLabel).join(' / '))}</td><td>✓</td><td><label class="permission-toggle"><input type="checkbox" data-create-role="${esc(r.code)}" ${state.creationAuthorizations[r.code] ? 'checked' : ''}><span>${state.creationAuthorizations[r.code] ? 'Autorizado' : 'No por defecto'}</span></label></td><td>${r.code === 'OM-PC-00' ? '✓' : '—'}</td><td>${esc((Rules.PERMISSIONS[r.code] || []).map(x => Rules.ACTION_LABELS[x] || x).join(' · '))}</td></tr>`).join('')}</tbody></table></div><div class="actions mt24"><button class="btn btn-primary" id="procSaveCreationAuth" type="button">Guardar autorizaciones de creación</button></div><div class="proc-note mt24"><b>Regla de seguridad:</b> la autorización de creación es independiente. Crear no concede asignar, validar, emitir fallos ni formalizar contratos. El cambio sólo se conserva como configuración DEMO local.</div></article>`;
    $$('[data-create-role]', content).forEach(input => input.onchange = () => { const label = input.parentElement.querySelector('span'); if (label) label.textContent = input.checked ? 'Autorizado' : 'No por defecto'; });
    $('#procSaveCreationAuth').onclick = () => { $$('[data-create-role]', content).forEach(input => { state.creationAuthorizations[input.dataset.createRole] = input.checked; }); addAudit(null, 'Actualización de autorizaciones de creación', '—', '—', 'Se actualizó la configuración centralizada de creación de solicitudes.'); save(); toast('Las autorizaciones de creación fueron guardadas en modo DEMO.'); };
  }
  function renderReports() {
    if (state.roleCode !== 'OM-PC-00') return toast('Los reportes de distribución están disponibles para el Coordinador de Asignación.');
    const rows = state.procedures;
    const ageDays = value => Math.max(0, Math.round((Date.now() - new Date(`${value || today()}T00:00:00Z`).getTime()) / 86400000));
    const byDirection = Rules.DIRECTIONS.map(item => {
      const assigned = rows.filter(p => p.assignedDirection === item.key);
      return { ...item, total: assigned.length, pending: assigned.filter(p => ['Asignada a Dirección', 'En atención', 'Pendiente de validación'].includes(p.status)).length, execution: assigned.filter(p => p.status === 'En procedimiento de contratación').length, concluded: assigned.filter(p => p.status === 'Concluida').length, averageAge: assigned.length ? Math.round(assigned.reduce((sum, p) => sum + ageDays(p.receivedAt), 0) / assigned.length) : 0 };
    });
    const unassigned = rows.filter(p => p.status === 'Pendiente de asignación').length;
    const originRows = [Rules.ORIGINS.DEPENDENCIA, Rules.ORIGINS.OFICIALIA_MAYOR].map(origin => ({ origin, total: rows.filter(p => p.origin === origin).length, pending: rows.filter(p => p.origin === origin && ['Pendiente de asignación', 'Asignada a Dirección', 'En atención'].includes(p.status)).length }));
    header('Procedimientos de Contratación', 'Reportes de distribución y carga', 'Indicadores demostrativos para seguimiento de recepción, asignaciones, tiempos de atención y origen de las solicitudes.');
    content.innerHTML = contextHtml() + `<div class="stats-grid proc-stats"><article class="stat proc-stat-accent"><span>Total recibido</span><strong>${rows.length}</strong><small>Todos los orígenes</small></article><article class="stat"><span>Pendiente de asignación</span><strong>${unassigned}</strong><small>Atención central</small></article><article class="stat"><span>Direcciones activas</span><strong>${byDirection.filter(item => item.total).length}</strong><small>Con expedientes asignados</small></article><article class="stat"><span>Origen Oficialía Mayor</span><strong>${originRows[1].total}</strong><small>Creación institucional</small></article></div><article class="card mt24"><div class="card-head"><div><span class="kicker">Distribución</span><h3>Carga por Dirección</h3></div><button class="btn btn-secondary" id="procExportDistribution" type="button">Exportar reporte CSV</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Dirección</th><th>Total asignado</th><th>Pendientes de atención</th><th>En procedimiento</th><th>Concluidos</th><th>Antigüedad promedio (días)</th></tr></thead><tbody>${byDirection.map(item => `<tr><td><b>${esc(item.short)}</b><small>${esc(item.label)}</small></td><td>${item.total}</td><td>${item.pending}</td><td>${item.execution}</td><td>${item.concluded}</td><td>${item.averageAge}</td></tr>`).join('')}</tbody></table></div><p class="proc-kpi-note">La antigüedad se calcula desde la fecha de recepción registrada en el expediente DEMO; no es un indicador oficial de plazo jurídico.</p></article><article class="card mt24"><div class="card-head"><div><span class="kicker">Origen de las solicitudes</span><h3>Recepción central</h3></div><span class="status-badge">${unassigned} por asignar</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Origen</th><th>Total</th><th>Con atención pendiente</th></tr></thead><tbody>${originRows.map(item => `<tr><td>${originBadge(item.origin)}</td><td>${item.total}</td><td>${item.pending}</td></tr>`).join('')}</tbody></table></div></article>`;
    $('#procExportDistribution').onclick = () => { const headerRow = ['Dirección', 'Total asignado', 'Pendientes', 'En procedimiento', 'Concluidos', 'Antigüedad promedio (días)']; const data = byDirection.map(item => [item.label, item.total, item.pending, item.execution, item.concluded, item.averageAge]); const csv = [headerRow, ...data].map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(',')).join('\n'); const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'reporte-distribucion-procedimientos.csv'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 500); };
  }
  function renderAudit() {
    const ids = new Set(visibleProcedures().map(item => item.id)); const rows = state.audit.filter(item => !item.folio || ids.has(item.procedureId || item.folio));
    header('Procedimientos de Contratación', 'Bitácora y reportes', 'Consulta de usuario, fecha/hora, acción, estado anterior, estado nuevo, motivo y documento en el ámbito autorizado.');
    content.innerHTML = contextHtml() + `<article class="card"><div class="card-head"><div><span class="kicker">Trazabilidad DEMO</span><h3>${rows.length} evento(s)</h3></div><button class="btn btn-secondary" id="procExportAudit" type="button">Exportar CSV</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Folio</th><th>Fecha / hora</th><th>Usuario / perfil</th><th>Acción</th><th>Anterior → nuevo</th><th>Motivo / detalle</th><th>Documento</th></tr></thead><tbody>${rows.slice().reverse().map(item => `<tr><td>${esc(item.folio || 'Configuración')}</td><td>${esc(item.when)}</td><td>${esc(item.user)}<small>${esc(item.role || '')}</small></td><td>${esc(item.action)}</td><td>${esc(item.statusBefore || item.from || '—')} → ${esc(item.statusAfter || item.to || '—')}</td><td>${esc(item.observation || item.detail || '—')}</td><td>${esc(item.document || '—')}</td></tr>`).join('') || '<tr><td colspan="7">Sin eventos en el alcance seleccionado.</td></tr>'}</tbody></table></div></article>`;
    $('#procExportAudit').onclick = () => { const headerRow = ['Folio', 'Fecha / hora', 'Usuario', 'Perfil', 'Acción', 'Estado anterior', 'Estado nuevo', 'Observación', 'Detalle', 'Documento']; const data = rows.map(item => [item.folio, item.when, item.user, item.role, item.action, item.statusBefore || item.from, item.statusAfter || item.to, item.observation, item.detail, item.document]); const csv = [headerRow, ...data].map(row => row.map(value => `"${String(value ?? '').replace(/"/g, '""')}"`).join(',')).join('\n'); const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' }); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = 'bitacora-procedimientos-compramex.csv'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 500); };
  }

  function openAccess() {
    state.active = false; save(); showOnly('access');
    $('#accessKicker').textContent = 'COMPRAMEX · Inicio de sesión institucional';
    $('#accessTitle').textContent = 'Procedimientos de Contratación';
    $('#accessDescription').textContent = 'Use el mismo acceso institucional del portal; el perfil y la adscripción determinan las funciones autorizadas para este módulo.';
    const roleOptions = Object.values(ROLE_CATALOG).map(item => `<option value="${esc(item.code)}" ${item.code === state.roleCode ? 'selected' : ''}>${esc(item.code)} · ${esc(item.label)}</option>`).join('');
    const depOptions = DEPENDENCIES.filter(item => item.key !== '234').map(item => `<option value="${item.key}" ${item.key === String(state.dependencyKey) ? 'selected' : ''}>${esc(item.name)} · ${esc(item.sigla)}</option>`).join('');
    $('#accessPanel').innerHTML = `<div class="identity-flow"><span>Acceso COMPRAMEX</span><b>→</b><span>Perfil autorizado</span><b>→</b><span>Expedientes en alcance</span></div><label>Usuario institucional<input id="procActorInput" value="${esc(state.actorName || 'USUARIO-COMPRAMEX-DEMO')}" autocomplete="username"></label><label>Contraseña<input id="procPassword" type="password" value="demo1234" autocomplete="current-password"></label><label>Perfil funcional resuelto en DEMO<select id="procRoleSelect">${roleOptions}</select></label><label id="procDependencyChoice">Adscripción de dependencia<select id="procDependencySelect">${depOptions}</select></label><label id="procAreaChoice">Área Requirente<select id="procAreaSelect"></select></label><label id="procDirectionChoice">Adscripción Oficialía Mayor<select id="procDirectionSelect">${Rules.DIRECTIONS.map(item => `<option value="${item.key}" ${item.key === state.adscription ? 'selected' : ''}>${esc(item.label)}</option>`).join('')}</select></label><button class="btn btn-primary full" id="procLoginBtn" type="button">Ingresar al módulo</button><button class="btn btn-ghost full" id="procBackBtn" type="button">Regresar a COMPRAMEX</button><div class="proc-login-note"><b>Demostración controlada:</b> la selección de perfil sólo permite recorrer la interfaz. En producción, el login institucional debe resolver roles, adscripción, permisos y expediente desde el backend; la autenticación no concede permisos por sí sola.</div>`;
    const roleSelect = $('#procRoleSelect'); const depSelect = $('#procDependencySelect'); const areaSelect = $('#procAreaSelect'); const directionSelect = $('#procDirectionSelect'); const dependencyChoice = $('#procDependencyChoice'); const areaChoice = $('#procAreaChoice'); const directionChoice = $('#procDirectionChoice'); const actorInput = $('#procActorInput');
    const refreshAreas = () => { const options = AREAS.filter(item => item.dependencyKey === depSelect.value); areaSelect.innerHTML = (options.length ? options : [{ id: `${depSelect.value}-demo`, name: `Área Requirente DEMO · ${dependency(depSelect.value).sigla}` }]).map(item => `<option value="${item.id}" ${item.id === state.areaId ? 'selected' : ''}>${esc(item.name)}</option>`).join(''); };
    const refreshRole = () => { const code = roleSelect.value; const depRole = ['DEP-AR', 'DEP-CA'].includes(code); const central = code === 'OM-PC-00'; const directionRole = isRoleDirection(code); dependencyChoice.classList.toggle('hidden', !depRole); areaChoice.classList.toggle('hidden', code !== 'DEP-AR'); directionChoice.classList.toggle('hidden', !(central || directionRole)); if (depRole) refreshAreas(); if (!depRole) actorInput.value = userFor(code, directionSelect.value); };
    roleSelect.onchange = refreshRole; depSelect.onchange = refreshAreas; directionSelect.onchange = () => { if (isRoleDirection(roleSelect.value)) actorInput.value = userFor(roleSelect.value, directionSelect.value); };
    refreshRole();
    $('#procLoginBtn').onclick = () => { const code = roleSelect.value; const adscription = code === 'OM-PC-00' ? 'OM_CPA' : isRoleDirection(code) ? directionSelect.value : 'DEPENDENCIA'; loginProc(code, depSelect.value, areaSelect.value, directionSelect.value, actorInput.value, adscription); };
    $('#procBackBtn').onclick = () => showOnly('public');
  }
  function isRoleDirection(code) { return Object.values(ROLE_CATALOG).some(item => item.code === code && item.scope === 'DIRECTION'); }
  function loginProc(roleCode, dependencyKey, areaId, directionKey, username, adscription) {
    state.active = true; state.schemaVersion = 2; state.roleCode = roleCode; state.dependencyKey = String(dependencyKey || '205'); state.areaId = areaId || ''; state.adscription = adscription || (roleCode === 'OM-PC-00' ? 'OM_CPA' : 'DEPENDENCIA'); state.actorName = String(username || userFor(roleCode, state.adscription)).trim(); save(); showOnly('workspace');
    const d = dependency(state.dependencyKey); $('#avatar').textContent = roleCode === 'OM-PC-00' ? 'CA' : roleCode.startsWith('OM-') ? (direction(state.adscription).short || 'OM') : d.sigla.slice(0, 2); $('#userName').textContent = actor(); $('#userRole').textContent = `${roleCode} · ${roleName(roleCode)}`; buildNav(); route(defaultRoute(roleCode));
  }
  function logoutProc() { state.active = false; state.draft = null; save(); closeModal(); showOnly('public'); }
  function defaultRoute(roleCode) { return roleCode === 'OM-PC-00' ? 'proc-assignment' : roleCode.startsWith('OM-') ? 'proc-work' : 'proc-dashboard'; }
  function buildNav() {
    const items = [['proc-dashboard', 'Panel de inicio'], ['proc-list', 'Bandeja de solicitudes'], ['proc-mine', 'Mis solicitudes']];
    if (can('create')) items.push(['proc-new', 'Nueva solicitud de contratación']);
    if (state.roleCode === 'OM-PC-00') items.push(['proc-assignment', 'Pendientes de asignación'], ['proc-reports', 'Reportes de distribución'], ['proc-permissions', 'Catálogo y permisos']);
    if (isDirectionRole(state.roleCode)) items.push(['proc-work', 'Procedimientos de mi Dirección']);
    items.push(['proc-audit', 'Bitácora y reportes']);
    $('#mainNav').innerHTML = items.map(([id, label]) => `<button type="button" data-proc-route="${id}">${esc(label)}</button>`).join('');
    $$('[data-proc-route]', $('#mainNav')).forEach(button => button.onclick = () => route(button.dataset.procRoute));
  }
  function route(name) {
    $$('[data-proc-route]', $('#mainNav')).forEach(button => button.classList.toggle('active', button.dataset.procRoute === name));
    if (name === 'proc-dashboard') renderDashboard();
    else if (name === 'proc-list') renderList();
    else if (name === 'proc-mine') renderList('mine');
    else if (name === 'proc-assignment') renderList('assignment');
    else if (name === 'proc-reports') renderReports();
    else if (name === 'proc-work') renderList('work');
    else if (name === 'proc-new') { if (!can('create')) return toast('El perfil no tiene autorizada la creación de solicitudes.'); editingId = ''; state.draft = null; renderForm(); }
    else if (name === 'proc-permissions') renderPermissions();
    else if (name === 'proc-audit') renderAudit();
    else if (name === 'proc-detail') renderDetail();
  }
  function openProcedure(id) { const p = proc(id); if (!p || !inScope(p)) return toast('El expediente no está dentro del ámbito autorizado.'); selectedId = id; editingId = ''; route('proc-detail'); }

  function attach() {
    $('#proceduresModuleBtn')?.addEventListener('click', openAccess);
    $('#proceduresAccessBtn')?.addEventListener('click', openAccess);
    $('#logoutBtn')?.addEventListener('click', logoutProc);
    $('#goPublic')?.addEventListener('click', logoutProc);
    $('#resetDemo')?.addEventListener('click', () => { localStorage.removeItem(STORAGE); localStorage.removeItem(LEGACY_STORAGE); state = seedState(); selectedId = ''; editingId = ''; showOnly('public'); });
    $('#modalClose')?.addEventListener('click', closeModal);
    $('#modal')?.addEventListener('click', event => { if (event.target === $('#modal')) closeModal(); });
    // Este script comparte el shell con Proveedores, Mercado y PAA. Si no hay una
    // sesión de Procedimientos, no debe cambiar la vista que otro módulo restauró.
    if (state.active && state.schemaVersion === 2) loginProc(state.roleCode, state.dependencyKey, state.areaId, state.adscription, state.actorName, state.adscription);
  }

  const content = $('#content');
  attach();
})();
