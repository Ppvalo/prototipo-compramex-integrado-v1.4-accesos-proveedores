(() => {
  const STORAGE = 'compramexPaaDemoV1';
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const publicView = $('#publicView');
  const accessView = $('#accessView');
  const workspace = $('#workspace');
  const accessPanel = $('#accessPanel');
  const mainNav = $('#mainNav');
  const content = $('#content');
  const pageHeader = $('#pageHeader');
  const modal = $('#modal');
  const modalTitle = $('#modalTitle');
  const modalBody = $('#modalBody');
  const modalActions = $('#modalActions');
  const userName = $('#userName');
  const userRole = $('#userRole');
  const avatar = $('#avatar');

  const ROLES = {
    area: 'Área Requirente',
    ca: 'Coordinación Administrativa',
    rm: 'Dirección General de Recursos Materiales de la Oficialía Mayor'
  };
  const DEPENDENCIES = [
    {key:'205', sigla:'SGG', name:'Secretaría General de Gobierno'},
    {key:'206', sigla:'SSEM', name:'Secretaría de Seguridad'},
    {key:'207', sigla:'SF', name:'Secretaría de Finanzas'},
    {key:'208', sigla:'SS', name:'Secretaría de Salud'},
    {key:'209', sigla:'ST', name:'Secretaría del Trabajo'},
    {key:'215', sigla:'SEDECO', name:'Secretaría de Desarrollo Económico'},
    {key:'218', sigla:'SECOGEM', name:'Secretaría de la Contraloría'},
    {key:'220', sigla:'SEMOV', name:'Secretaría de Movilidad'},
    {key:'225', sigla:'SECAMPO', name:'Secretaría del Campo'},
    {key:'226', sigla:'SCyT', name:'Secretaría de Cultura y Turismo'},
    {key:'227', sigla:'SEMujeres', name:'Secretaría de las Mujeres'},
    {key:'228', sigla:'SECTI', name:'Secretaría de Educación, Ciencia, Tecnología e Innovación'},
    {key:'229', sigla:'SEBIEN', name:'Secretaría de Bienestar'},
    {key:'230', sigla:'SEDUI', name:'Secretaría de Desarrollo Urbano e Infraestructura'},
    {key:'231', sigla:'SMAyDS', name:'Secretaría del Medio Ambiente y Desarrollo Sostenible'},
    {key:'232', sigla:'SAGUA', name:'Secretaría del Agua'},
    {key:'233', sigla:'CJ', name:'Consejería Jurídica'},
    {key:'234', sigla:'OM', name:'Oficialía Mayor'}
  ];
  const AREAS = [
    {id:'205-a1', dependencyKey:'205', name:'Dirección de Servicios Generales', responsible:'Patricia Gómez'},
    {id:'205-a2', dependencyKey:'205', name:'Dirección de Tecnologías y Servicios', responsible:'Jorge Salgado'},
    {id:'205-a3', dependencyKey:'205', name:'Unidad de Planeación', responsible:'Laura Mendoza'},
    {id:'205-a4', dependencyKey:'205', name:'Dirección de Comunicación Social', responsible:'Mónica Silva'},
    {id:'206-a1', dependencyKey:'206', name:'Dirección de Administración', responsible:'Ricardo Torres'},
    {id:'206-a2', dependencyKey:'206', name:'Unidad de Tecnologías', responsible:'Daniela Cruz'}
  ];
  const PARTIDAS = [
    {key:'2111', chapter:'2000', concept:'Materiales de administración', name:'Materiales y útiles de oficina', type:'Bien'},
    {key:'2161', chapter:'2000', concept:'Materiales de limpieza', name:'Material de limpieza', type:'Bien'},
    {key:'2531', chapter:'2000', concept:'Medicinas y productos farmacéuticos', name:'Medicinas y productos farmacéuticos', type:'Bien'},
    {key:'3111', chapter:'3000', concept:'Energía eléctrica', name:'Energía eléctrica', type:'Servicio'},
    {key:'3331', chapter:'3000', concept:'Servicios profesionales', name:'Servicios de consultoría en tecnologías', type:'Servicio'},
    {key:'3511', chapter:'3000', concept:'Conservación y mantenimiento', name:'Mantenimiento de inmuebles', type:'Servicio'},
    {key:'3611', chapter:'3000', concept:'Difusión institucional', name:'Servicios audiovisuales', type:'Servicio'},
    {key:'5111', chapter:'5000', concept:'Mobiliario y equipo de administración', name:'Muebles de oficina', type:'Bien'},
    {key:'5151', chapter:'5000', concept:'Equipo de cómputo y tecnologías', name:'Equipo de cómputo', type:'Bien'},
    {key:'5621', chapter:'5000', concept:'Maquinaria y equipo industrial', name:'Maquinaria y equipo industrial', type:'Bien'}
  ];
  const ACQUISITION_TYPES = ['Bienes','Servicios','Arrendamientos','Obra / otros'];
  const UNITS = ['Pieza','Paquete','Caja','Servicio','Equipo','Metro','Kilogramo','Litro','Mes','Hora','Curso'];
  const MONTHS = ['Enero','Febrero','Marzo','Abril','Mayo','Junio','Julio','Agosto','Septiembre','Octubre','Noviembre','Diciembre'];
  const PERIODICITIES = ['Única','Mensual','Bimestral','Trimestral','Semestral','Anual'];
  const STATUSES = [
    'Borrador','Enviado a Coordinación Administrativa','En revisión','Observado','Corregido',
    'Validado por Coordinación Administrativa','Integrado al PAA Institucional','Enviado a Recursos Materiales',
    'En revisión por Recursos Materiales','Observado por Recursos Materiales','Corregido por Coordinación Administrativa',
    'Validado por Recursos Materiales','Cerrado'
  ];
  const DEPENDENCY_ROLES = ['area','ca'];
  const YEAR = 2027;

  const clone = value => JSON.parse(JSON.stringify(value));
  const escapeHtml = (value = '') => String(value).replace(/[&<>'"]/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[char]));
  const money = value => Number.isFinite(Number(value)) ? new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(Number(value)) : '—';
  const stamp = () => new Date().toLocaleString('es-MX',{dateStyle:'medium',timeStyle:'short'});
  const today = () => new Date().toISOString().slice(0,10);
  const dep = key => DEPENDENCIES.find(item => item.key === String(key)) || DEPENDENCIES[0];
  const area = id => {
    const value = String(id || '');
    const configured = AREAS.find(item => item.id === value);
    if (configured) return configured;
    const dependencyKey = value.split('-')[0];
    const dependency = DEPENDENCIES.find(item => item.key === dependencyKey);
    return dependency ? {id:`${dependency.key}-demo`,dependencyKey:dependency.key,name:`Área Requirente de demostración · ${dependency.sigla}`,responsible:'Responsable de Área Demo'} : undefined;
  };
  const depAreas = key => {
    const dependencyKey = String(key);
    const configured = AREAS.filter(item => item.dependencyKey === dependencyKey);
    if (configured.length) return configured;
    const dependency = DEPENDENCIES.find(item => item.key === dependencyKey);
    return dependency ? [{id:`${dependency.key}-demo`,dependencyKey:dependency.key,name:`Área Requirente de demostración · ${dependency.sigla}`,responsible:'Responsable de Área Demo'}] : [];
  };
  const party = key => PARTIDAS.find(item => item.key === String(key));
  const actor = () => String(state.actorName || ROLES[state.role] || 'Sistema').trim();
  const areaName = id => area(id)?.name || 'Área no identificada';
  const dependencyName = key => dep(key)?.name || 'Dependencia no identificada';
  const amountOf = record => Number(record.quantity || 0) * Number(record.unitPrice || 0);
  const isRecordComplete = record => {
    const required = ['fiscalYear','dependencyKey','areaId','responsible','acquisitionType','chapter','concept','budgetItem','classifier','description','technicalSpecs','unit','quantity','unitPrice','fundingSource','startMonth','contractMonth','supplyMonth','periodicity','justification'];
    return required.every(key => String(record[key] ?? '').trim() !== '') && Number(record.quantity) > 0 && Number(record.unitPrice) >= 0 && amountOf(record) === Number(record.estimatedAmount);
  };
  const idFor = (prefix, number) => `${prefix}${String(number).padStart(6,'0')}`;

  function recordTemplate(id, areaId, overrides = {}) {
    const a = area(areaId) || depAreas(String(areaId || '').split('-')[0])[0] || AREAS[0];
    const d = dep(a.dependencyKey);
    const base = {
      id, paaId:'PAA-2027-205-v1', fiscalYear:YEAR, dependencyKey:a.dependencyKey, dependency:d.name,
      unitAdministrative:a.name, areaId:a.id, area:a.name, responsible:a.responsible, createdAt:'2026-10-01', updatedAt:'2026-10-01',
      acquisitionType:'Bienes', chapter:'2000', concept:'Materiales de administración', budgetItem:'2111', classifier:'21101',
      description:'Papel bond tamaño carta, paquete de 500 hojas', technicalSpecs:'Papel bond blanco, 75 g/m², tamaño carta, paquete de 500 hojas.',
      unit:'Paquete', quantity:100, unitPrice:118.40, estimatedAmount:11840, fundingSource:'Recursos fiscales',
      startMonth:'Enero', contractMonth:'Febrero', supplyMonth:'Marzo', periodicity:'Mensual',
      justification:'Se requiere para la operación ordinaria de las unidades administrativas.', observations:'', supportFile:null,
      status:'Borrador', observation:null, history:[{when:'2026-10-01 09:00',user:'Sistema',role:'Sistema',action:'Creación',detail:'Registro creado como borrador'}]
    };
    const result = {...base,...overrides};
    result.estimatedAmount = amountOf(result);
    return result;
  }

  function seedState() {
    const records = [
      recordTemplate('PAA-2027-000101','205-a1',{description:'Papel bond tamaño carta, paquete de 500 hojas',budgetItem:'2111',unit:'Paquete',quantity:500,unitPrice:118.40,estimatedAmount:59200,startMonth:'Enero',contractMonth:'Febrero',supplyMonth:'Marzo',status:'Validado por Coordinación Administrativa',updatedAt:'2026-10-08'}),
      recordTemplate('PAA-2027-000102','205-a1',{description:'Servicio de mantenimiento preventivo de inmuebles',acquisitionType:'Servicios',chapter:'3000',concept:'Conservación y mantenimiento',budgetItem:'3511',classifier:'35101',unit:'Servicio',quantity:1,unitPrice:86500,estimatedAmount:86500,startMonth:'Febrero',contractMonth:'Marzo',supplyMonth:'Abril',periodicity:'Única',status:'Observado',observation:{text:'Precisar periodicidad, entregables y unidad responsable.',user:'Coordinación Administrativa',when:'2026-10-09 12:14'}}),
      recordTemplate('PAA-2027-000103','205-a1',{description:'Sillas ergonómicas operativas',budgetItem:'5111',chapter:'5000',concept:'Mobiliario y equipo de administración',classifier:'51101',unit:'Pieza',quantity:24,unitPrice:3290,estimatedAmount:78960,startMonth:'Abril',contractMonth:'Mayo',supplyMonth:'Junio',status:'Borrador'}),
      recordTemplate('PAA-2027-000104','205-a2',{description:'Equipo de cómputo portátil empresarial',budgetItem:'5151',chapter:'5000',concept:'Equipo de cómputo y tecnologías',classifier:'51501',unit:'Pieza',quantity:18,unitPrice:21950,estimatedAmount:395100,startMonth:'Enero',contractMonth:'Febrero',supplyMonth:'Marzo',status:'Enviado a Coordinación Administrativa',responsible:'Jorge Salgado'}),
      recordTemplate('PAA-2027-000105','205-a2',{description:'Servicio de soporte técnico especializado',acquisitionType:'Servicios',chapter:'3000',concept:'Servicios profesionales',budgetItem:'3331',classifier:'33301',unit:'Servicio',quantity:1,unitPrice:48500,estimatedAmount:48500,startMonth:'Enero',contractMonth:'Enero',supplyMonth:'Enero',periodicity:'Anual',status:'Enviado a Coordinación Administrativa',responsible:'Jorge Salgado'}),
      recordTemplate('PAA-2027-000106','205-a3',{description:'Materiales y útiles de oficina',budgetItem:'2111',unit:'Caja',quantity:60,unitPrice:640.50,estimatedAmount:38430,startMonth:'Marzo',contractMonth:'Abril',supplyMonth:'Abril',status:'Validado por Coordinación Administrativa',responsible:'Laura Mendoza'}),
      recordTemplate('PAA-2027-000201','206-a1',{paaId:'PAA-2027-206-v1',fiscalYear:YEAR,dependencyKey:'206',dependency:dependencyName('206'),unitAdministrative:'Dirección de Administración',areaId:'206-a1',area:'Dirección de Administración',responsible:'Ricardo Torres',description:'Arrendamiento de equipo de transporte',acquisitionType:'Arrendamientos',chapter:'3000',concept:'Servicios generales',budgetItem:'3511',classifier:'35102',unit:'Mes',quantity:12,unitPrice:42000,estimatedAmount:504000,startMonth:'Enero',contractMonth:'Enero',supplyMonth:'Enero',periodicity:'Mensual',status:'Validado por Recursos Materiales'}),
      recordTemplate('PAA-2027-000202','206-a2',{paaId:'PAA-2027-206-v1',fiscalYear:YEAR,dependencyKey:'206',dependency:dependencyName('206'),unitAdministrative:'Unidad de Tecnologías',areaId:'206-a2',area:'Unidad de Tecnologías',responsible:'Daniela Cruz',description:'Licencias de software institucional',acquisitionType:'Servicios',chapter:'3000',concept:'Servicios profesionales',budgetItem:'3331',classifier:'33302',unit:'Licencia',quantity:50,unitPrice:12500,estimatedAmount:625000,startMonth:'Enero',contractMonth:'Febrero',supplyMonth:'Marzo',periodicity:'Anual',status:'Validado por Recursos Materiales'})
    ];
    const paas = [
      {id:'PAA-2027-205-v1',version:1,fiscalYear:YEAR,dependencyKey:'205',dependency:dependencyName('205'),status:'En integración interna',createdAt:'2026-10-01',updatedAt:'2026-10-09',sentAt:'',sentBy:'',areaDeclarations:{'205-a4':{status:'Sin requerimientos',user:'Mónica Silva',when:'2026-10-02 10:10'}},history:[{when:'2026-10-01 09:00',user:'Sistema',role:'Sistema',action:'Creación del PAA',detail:'PAA 2027 · Versión 1'}]},
      {id:'PAA-2027-206-v1',version:1,fiscalYear:YEAR,dependencyKey:'206',dependency:dependencyName('206'),status:'Enviado a Recursos Materiales',createdAt:'2026-09-20',updatedAt:'2026-10-05',sentAt:'2026-10-05 16:40',sentBy:'Coordinación Administrativa SSEM',areaDeclarations:{},history:[{when:'2026-09-20 08:00',user:'Sistema',role:'Sistema',action:'Creación del PAA',detail:'PAA 2027 · Versión 1'},{when:'2026-10-05 16:40',user:'Coordinación Administrativa SSEM',role:'Coordinación Administrativa',action:'Envío a Recursos Materiales',detail:'2 registros · '+money(1129000)}]}
    ];
    const audit = [
      {when:'2026-10-01 09:00',user:'Sistema',role:'Sistema',action:'Creación',detail:'PAA-2027-205-v1 creado',paaId:'PAA-2027-205-v1',dependencyKey:'205',areaId:'205-a1',recordId:'PAA-2027-000101'},
      {when:'2026-10-09 12:14',user:'Coordinación Administrativa',role:'Coordinación Administrativa',action:'Observación',detail:'Precisar periodicidad, entregables y unidad responsable.',paaId:'PAA-2027-205-v1',dependencyKey:'205',areaId:'205-a1',recordId:'PAA-2027-000102'},
      {when:'2026-10-05 16:40',user:'Coordinación Administrativa SSEM',role:'Coordinación Administrativa',action:'Envío a Recursos Materiales',detail:'PAA 2027 · Versión 1 · 2 registros · '+money(1129000),paaId:'PAA-2027-206-v1',dependencyKey:'206'}
    ];
    return {
      active:false, role:'area', dependencyKey:'205', areaId:'205-a1', actorName:'Patricia Gómez', fiscalYear:YEAR,
      paas, records, versions:[], observations:[], audit,
      notifications:[
        {id:'N-001',when:'2026-10-09 12:14',targetRole:'area',dependencyKey:'205',areaId:'205-a1',message:'El registro PAA-2027-000102 fue devuelto por la Coordinación Administrativa para corrección.',read:false},
        {id:'N-002',when:'2026-10-05 16:40',targetRole:'rm',dependencyKey:'206',message:'La Secretaría de Seguridad ha enviado su Programa Anual de Adquisiciones para revisión.',read:false},
        {id:'N-003',when:'2026-10-08 15:20',targetRole:'ca',dependencyKey:'205',message:'El Área Requirente Dirección de Servicios Generales tiene registros validados y observados.',read:false}
      ],
      nextRecord:300, rmrFilters:{year:'',dependency:'',status:'',type:'',chapter:'',partida:''}
    };
  }
  let state = load();
  let currentRecordId = '';
  let uploadPreview = null;

  function load() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE) || 'null');
      if (!saved) return seedState();
      const result = {...seedState(), ...saved};
      result.paas = Array.isArray(saved.paas) ? saved.paas : seedState().paas;
      result.records = Array.isArray(saved.records) ? saved.records : seedState().records;
      result.notifications = Array.isArray(saved.notifications) ? saved.notifications : [];
      result.audit = Array.isArray(saved.audit) ? saved.audit : [];
      result.observations = Array.isArray(saved.observations) ? saved.observations : [];
      return result;
    } catch (error) { return seedState(); }
  }
  function save() {
    try { localStorage.setItem(STORAGE, JSON.stringify(state)); return true; }
    catch (error) { toast('El almacenamiento de la demostración está lleno. Reduzca los archivos o restablezca el PAA de demostración.'); return false; }
  }
  function showOnly(which) {
    publicView?.classList.toggle('hidden', which !== 'public');
    accessView?.classList.toggle('hidden', which !== 'access');
    workspace?.classList.toggle('hidden', which !== 'workspace');
  }
  function closeModal() { modal?.classList.add('hidden'); modal?.classList.remove('wide-modal'); }
  function openModal(title, wide = false) { modalTitle.textContent = title; modal.classList.remove('hidden'); modal.classList.toggle('wide-modal', wide); }
  function toast(message) {
    modalBody.innerHTML = `<p>${escapeHtml(message)}</p>`;
    modalActions.innerHTML = '<button class="btn btn-primary" data-paa-close type="button">Aceptar</button>';
    openModal('Información');
    $('[data-paa-close]', modalActions).onclick = closeModal;
  }
  function confirmModal(title, message, confirmLabel, callback) {
    modalBody.innerHTML = `<p>${escapeHtml(message)}</p>`;
    modalActions.innerHTML = `<button class="btn btn-secondary" data-paa-cancel type="button">Cancelar</button><button class="btn btn-primary" data-paa-confirm type="button">${escapeHtml(confirmLabel)}</button>`;
    openModal(title);
    $('[data-paa-cancel]', modalActions).onclick = closeModal;
    $('[data-paa-confirm]', modalActions).onclick = () => { closeModal(); callback(); };
  }
  function observationModal(title, prompt, callback) {
    modalBody.innerHTML = `<p>${escapeHtml(prompt)}</p><label>Motivo obligatorio<textarea id="paaObservationText" rows="5" placeholder="Describa la observación, devolución o requerimiento..."></textarea></label>`;
    modalActions.innerHTML = '<button class="btn btn-secondary" data-paa-cancel type="button">Cancelar</button><button class="btn btn-warning" data-paa-save-observation type="button">Guardar observación</button>';
    openModal(title, true);
    $('[data-paa-cancel]', modalActions).onclick = closeModal;
    $('[data-paa-save-observation]', modalActions).onclick = () => { const text = $('#paaObservationText').value.trim(); if (!text) return toast('Capture un motivo obligatorio.'); closeModal(); callback(text); };
  }
  function download(name, body, type = 'text/plain;charset=utf-8') {
    const blob = new Blob([body], {type}); const url = URL.createObjectURL(blob); const link = document.createElement('a'); link.href = url; link.download = name; link.click(); setTimeout(() => URL.revokeObjectURL(url), 500);
  }
  function addAudit(action, detail, context = {}) {
    const entry = {when:stamp(), user:actor(), role:ROLES[state.role] || 'Sistema', action, detail, ...context};
    state.audit.push(entry); save(); return entry;
  }
  function notify(targetRole, dependencyKey, message, areaId = '') {
    state.notifications.unshift({id:`N-${Date.now()}`,when:stamp(),targetRole,dependencyKey:String(dependencyKey),areaId,message,read:false});
  }
  function addRecordHistory(record, action, detail = '') {
    (record.history ||= []).push({when:stamp(),user:actor(),role:ROLES[state.role] || 'Sistema',action,detail});
    record.updatedAt = today();
  }
  function paaForDependency(key, year = state.fiscalYear) { return state.paas.find(item => item.dependencyKey === String(key) && Number(item.fiscalYear) === Number(year)); }
  function ensurePaa(key, year = state.fiscalYear) {
    const existing = paaForDependency(key, year);
    if (existing) return existing;
    const dependency = dep(key);
    const paa = {id:`PAA-${year}-${dependency.key}-v1`,version:1,fiscalYear:Number(year),dependencyKey:String(dependency.key),dependency:dependency.name,status:'En integración interna',createdAt:today(),updatedAt:today(),sentAt:'',sentBy:'',areaDeclarations:{},history:[{when:stamp(),user:actor(),role:ROLES[state.role] || 'Sistema',action:'Creación del PAA',detail:`PAA ${year} · Versión 1 creado para ${dependency.name}.`}]};
    state.paas.push(paa);
    if (state.active) addAudit('Creación del PAA',`PAA ${paa.id} creado para ${dependency.name}.`,{paaId:paa.id,dependencyKey:dependency.key}); else save();
    return paa;
  }
  function paaById(id) { return state.paas.find(item => item.id === String(id)); }
  function recordById(id) { return state.records.find(item => item.id === String(id)); }
  function recordsForPaa(paaId) { return state.records.filter(item => item.paaId === paaId); }
  function visibleRecords() {
    if (state.role === 'rm') return state.records;
    return state.records.filter(item => item.dependencyKey === String(state.dependencyKey) && (state.role !== 'area' || item.areaId === state.areaId));
  }
  function visiblePaas() {
    if (state.role === 'rm') return state.paas.filter(item => ['Enviado a Recursos Materiales','En revisión por Recursos Materiales','Observado por Recursos Materiales','Validado por Recursos Materiales','Cerrado'].includes(item.status));
    return state.paas.filter(item => item.dependencyKey === String(state.dependencyKey));
  }
  function notificationsForUser() {
    return state.notifications.filter(item => {
      if (item.targetRole !== state.role && item.targetRole !== 'all') return false;
      if (state.role === 'rm') return true;
      if (item.dependencyKey !== String(state.dependencyKey)) return false;
      return state.role !== 'area' || !item.areaId || item.areaId === state.areaId;
    });
  }
  function userScopeLabel() {
    if (state.role === 'rm') return 'Consulta transversal · Oficialía Mayor';
    return `${dependencyName(state.dependencyKey)} · ${state.role === 'area' ? areaName(state.areaId) : 'toda la dependencia'}`;
  }
  function statusClass(status = '') {
    if (/Validado|Integrado|Cerrado/.test(status)) return 'approved';
    if (/Observado/.test(status)) return 'observed';
    if (/Enviado|revisión|Corregido/.test(status)) return 'review';
    return '';
  }
  function badge(status) { return `<span class="status-badge paa-status ${statusClass(status)}">${escapeHtml(status)}</span>`; }
  function header(kicker, title, description) { pageHeader.innerHTML = `<span class="kicker">${escapeHtml(kicker)}</span><h2>${escapeHtml(title)}</h2><p>${escapeHtml(description)}</p>`; }
  function contextHtml() {
    const contextDependency = state.role === 'rm' ? 'Oficialía Mayor · ámbito transversal' : dependencyName(state.dependencyKey);
    return `<div class="module-context dependency-context paa-context"><div><b>Dependencia</b><span>${escapeHtml(contextDependency)}</span></div><div><b>Perfil activo</b><span>${escapeHtml(ROLES[state.role])}</span></div><div><b>Ejercicio</b><span>${state.fiscalYear}</span></div><div><b>Alcance</b><span>${escapeHtml(userScopeLabel())}</span></div></div>`;
  }
  function flowHtml(active = 1) {
    const steps = [['Área Requirente','Captura y envía'],['Coordinación Administrativa','Revisa y consolida'],['Recursos Materiales','Recibe, valida y cierra']];
    return `<div class="paa-flow" aria-label="Trazabilidad institucional">${steps.map((step,index) => `<div class="paa-flow-step ${index + 1 <= active ? 'active' : ''}"><span>${index + 1}</span><div><b>${step[0]}</b><small>${step[1]}</small></div></div>${index < steps.length - 1 ? '<i>→</i>' : ''}`).join('')}</div>`;
  }
  function areaSummary(areaId, paa) {
    const declaration = paa?.areaDeclarations?.[areaId];
    const rows = recordsForPaa(paa?.id).filter(item => item.areaId === areaId);
    const submitted = !!declaration || (rows.length > 0 && rows.every(item => !['Borrador','Observado'].includes(item.status)));
    const validated = rows.length > 0 && rows.every(item => ['Validado por Coordinación Administrativa','Integrado al PAA Institucional','Enviado a Recursos Materiales','En revisión por Recursos Materiales','Observado por Recursos Materiales','Validado por Recursos Materiales','Cerrado'].includes(item.status));
    return {area:area(areaId), declaration, rows, submitted, validated, amount:rows.reduce((sum,item) => sum + amountOf(item),0)};
  }
  function currentPaa() { return state.role === 'rm' ? visiblePaas()[0] : ensurePaa(state.dependencyKey, state.fiscalYear); }
  function totalAmount(rows) { return rows.reduce((sum,item) => sum + amountOf(item), 0); }
  function statsHtml(stats, extraClass = '') { return `<div class="stats-grid ${extraClass}">${stats.map(item => `<article class="stat"><span>${escapeHtml(item[0])}</span><strong>${escapeHtml(String(item[1]))}</strong><small>${escapeHtml(item[2] || '')}</small></article>`).join('')}</div>`; }
  function notificationPreview() {
    const rows = notificationsForUser().slice(0,3);
    return `<article class="card mt24 paa-notice-card"><div class="card-head"><div><span class="kicker">Avisos internos</span><h3>Notificaciones recientes</h3></div><button class="btn btn-secondary btn-small" data-paa-route="paa-notifications" type="button">Ver todas</button></div>${rows.length ? `<div class="paa-notifications-list">${rows.map(item => `<div class="paa-notification"><span class="notification-dot"></span><div><b>${escapeHtml(item.message)}</b><small>${escapeHtml(item.when)}</small></div></div>`).join('')}</div>` : '<div class="validation-banner">No hay notificaciones pendientes.</div>'}</article>`;
  }

  function openAccess() {
    state.active = false; save(); showOnly('access');
    $('#accessKicker').textContent = 'COMPRAMEX · Acceso institucional';
    $('#accessTitle').textContent = 'Programa Anual de Adquisiciones';
    $('#accessDescription').textContent = 'Seleccione dependencia, rol y ámbito de consulta para simular el ciclo institucional del PAA.';
    accessPanel.innerHTML = `<div class="access-hierarchy"><div><span>1</span><b>Dependencia</b><small>Adscripción institucional</small></div><i>→</i><div><span>2</span><b>Rol PAA</b><small>Permisos por nivel</small></div></div>
      <label>Dependencia<select id="paaDependencySelect">${DEPENDENCIES.map(item => `<option value="${item.key}" ${item.key === String(state.dependencyKey) ? 'selected' : ''}>${escapeHtml(item.name)} · ${escapeHtml(item.sigla)}</option>`).join('')}</select></label>
      <label>Rol institucional<select id="paaRoleSelect"><option value="area">Área Requirente</option><option value="ca">Coordinación Administrativa</option><option value="rm">Dirección General de Recursos Materiales de la Oficialía Mayor</option></select></label>
      <label id="paaAreaChoice">Área Requirente<select id="paaAreaSelect"></select></label>
      <label>Usuario de demostración<input id="paaActor" value="${escapeHtml(state.actorName || 'Usuario PAA Demo')}"></label>
      <label>Contraseña de demostración<input type="password" value="demo1234"></label>
      <button class="btn btn-primary full" id="paaLoginBtn" type="button">Ingresar al módulo PAA</button>
      <button class="btn btn-ghost full" id="paaBackBtn" type="button">Regresar a COMPRAMEX</button>
      <p class="micro">Prototipo Front-End: las identidades, archivos, validaciones y envíos son demostrativos y se conservan en este navegador.</p>`;
    const depSelect = $('#paaDependencySelect');
    const roleSelect = $('#paaRoleSelect');
    const areaChoice = $('#paaAreaChoice');
    const areaSelect = $('#paaAreaSelect');
    const actorInput = $('#paaActor');
    const refreshAreas = () => {
      const areas = depAreas(depSelect.value);
      areaSelect.innerHTML = areas.map(item => `<option value="${item.id}" ${item.id === state.areaId ? 'selected' : ''}>${escapeHtml(item.name)}</option>`).join('');
      if (!areas.some(item => item.id === state.areaId)) state.areaId = areas[0]?.id || '';
    };
    const refreshRole = () => { const isArea = roleSelect.value === 'area'; areaChoice.classList.toggle('hidden', !isArea); refreshAreas(); };
    depSelect.onchange = () => { state.dependencyKey = depSelect.value; refreshAreas(); };
    roleSelect.onchange = refreshRole;
    areaSelect.onchange = () => { state.areaId = areaSelect.value; };
    $('#paaLoginBtn').onclick = () => loginPaa(roleSelect.value, depSelect.value, areaSelect.value, actorInput.value);
    $('#paaBackBtn').onclick = () => showOnly('public');
    roleSelect.value = state.role === 'rm' ? 'rm' : state.role === 'ca' ? 'ca' : 'area';
    refreshRole();
  }
  function loginPaa(role, dependencyKey, areaId, username) {
    state.active = true; state.role = role; state.dependencyKey = String(dependencyKey); state.areaId = areaId || depAreas(dependencyKey)[0]?.id || ''; state.actorName = String(username || ROLES[role]).trim(); state.fiscalYear = YEAR; save(); showOnly('workspace');
    const d = dep(state.dependencyKey); avatar.textContent = role === 'rm' ? 'RM' : d.sigla.slice(0,2); userName.textContent = role === 'rm' ? 'Dirección General de Recursos Materiales de la Oficialía Mayor' : d.name; userRole.textContent = ROLES[role];
    buildNav(); route(defaultRouteForRole(role));
  }
  function logoutPaa() { state.active = false; save(); closeModal(); showOnly('public'); }
  function defaultRouteForRole(role) { return role === 'area' ? 'paa-dashboard' : role === 'ca' ? 'paa-dashboard' : 'paa-dependencies'; }
  function buildNav() {
    const common = [['paa-dashboard','Dashboard'],['paa-records','Registros PAA']];
    const items = state.role === 'area' ? [...common,['paa-notifications','Notificaciones'],['paa-audit','Bitácora']] : state.role === 'ca' ? [...common,['paa-consolidation','Consolidación'],['paa-notifications','Notificaciones'],['paa-audit','Bitácora']] : [['paa-dependencies','Programas recibidos'],['paa-notifications','Notificaciones'],['paa-audit','Bitácora']];
    mainNav.innerHTML = items.map(([id,label]) => `<button type="button" data-paa-route="${id}">${label}</button>`).join('');
    $$('[data-paa-route]', mainNav).forEach(button => button.onclick = () => route(button.dataset.paaRoute));
  }
  function route(name) {
    $$('[data-paa-route]', mainNav).forEach(button => button.classList.toggle('active', button.dataset.paaRoute === name));
    if (name === 'paa-dashboard') state.role === 'area' ? renderAreaDashboard() : renderCaDashboard();
    else if (name === 'paa-records') renderRecordsPage();
    else if (name === 'paa-register') renderRecordForm();
    else if (name === 'paa-consolidation') renderConsolidation();
    else if (name === 'paa-dependencies') renderRmrDashboard();
    else if (name === 'paa-notifications') renderNotifications();
    else if (name === 'paa-audit') renderAudit();
  }

  function renderAreaDashboard() {
    const paa = currentPaa(); const rows = visibleRecords(); const counts = status => rows.filter(item => item.status === status).length;
    header('Programa Anual de Adquisiciones','Mi Programa Anual de Adquisiciones','Registre, cargue, valide y envíe las necesidades de adquisición de su Área Requirente.');
    content.innerHTML = contextHtml() + flowHtml(1) + statsHtml([
      ['Registros capturados',rows.length,'Necesidades en el ejercicio'],['Borradores',counts('Borrador'),'Aún no enviados'],['Enviados',rows.filter(item => item.status.includes('Coordinación')).length,'En revisión institucional'],['Observados',counts('Observado'),'Requieren atención'],['Validados',rows.filter(item => item.status.includes('Validado')).length,'Por Coordinación'],['Monto total programado',money(totalAmount(rows)),'Suma de importes estimados']
    ], 'stats-six paa-stats') + `<article class="card mt24"><div class="card-head"><div><span class="kicker">Mi ejercicio ${state.fiscalYear}</span><h3>Captura y carga controlada</h3></div><span class="status-badge">${paa ? escapeHtml(paa.status) : 'Sin PAA'}</span></div><p>La carga o captura se guarda primero como borrador. Sólo después de validar la información se habilita el envío a la Coordinación Administrativa.</p><div class="actions"><button class="btn btn-primary" data-paa-route="paa-register" type="button">+ Registrar necesidad de adquisición</button><button class="btn btn-secondary" data-paa-mass-upload type="button">Cargar archivo</button><button class="btn btn-ghost" data-paa-template type="button">Descargar plantilla oficial del PAA</button><button class="btn btn-ghost" data-paa-no-requirements type="button">Sin requerimientos para el ejercicio</button></div><div class="source-note"><b>Importe calculado automáticamente:</b> cantidad × precio unitario estimado. El importe no es editable.</div></article>${notificationPreview()}<article class="card mt24"><div class="card-head"><div><span class="kicker">Mis registros</span><h3>Necesidades capturadas</h3></div><button class="btn btn-secondary btn-small" data-paa-route="paa-records" type="button">Ver todos</button></div><div class="table-wrap">${recordTable(rows.slice(0,6),'area')}</div></article>`;
    bindPaaRoutes(content); bindPaaActions(content);
  }
  function renderCaDashboard() {
    const paa = currentPaa(); const rows = paa ? recordsForPaa(paa.id) : []; const areas = paa ? depAreas(state.dependencyKey).map(item => areaSummary(item.id,paa)) : [];
    const submitted = areas.filter(item => item.submitted).length; const reviewing = rows.filter(item => ['Enviado a Coordinación Administrativa','En revisión','Corregido'].includes(item.status)).length; const observed = rows.filter(item => item.status === 'Observado').length; const validated = rows.filter(item => item.status.includes('Validado')).length; const progress = areas.length ? Math.round(submitted / areas.length * 100) : 0;
    header('Programa Anual de Adquisiciones','Avance del PAA institucional','Revise la información de todas las Áreas Requirentes, gestione observaciones y consolide el programa de la dependencia.');
    content.innerHTML = contextHtml() + flowHtml(2) + statsHtml([
      ['Áreas requirentes',areas.length,'Total de la dependencia'],['Áreas que enviaron',submitted,'Incluye Sin requerimientos'],['Áreas pendientes',Math.max(0,areas.length-submitted),'Aún no cumplen'],['Registros recibidos',rows.length,'Necesidades del ejercicio'],['En revisión',reviewing,'Pendientes de resolución'],['Observados',observed,'Con devolución'],['Validados',validated,'Listos para integrar'],['Monto total programado',money(totalAmount(rows)),'Importe estimado'],['Porcentaje de avance',`${progress}%`,'Integración institucional']
    ], 'stats-nine paa-stats') + `<article class="card mt24"><div class="card-head"><div><span class="kicker">Avance de integración del PAA institucional</span><h3>${progress}% completado</h3></div><span class="status-badge">${escapeHtml(paa?.status || 'Sin PAA')}</span></div><div class="progress-row"><div class="progress-track"><div class="progress-bar paa-progress-bar" style="width:${progress}%"></div></div><b>${progress}%</b></div><p>Para enviar a Recursos Materiales deben estar integradas todas las áreas o marcadas expresamente como “Sin requerimientos”, sin registros pendientes ni observados.</p><div class="actions"><button class="btn btn-primary" data-paa-route="paa-consolidation" type="button">Consolidación del PAA</button>${paa?.status === 'Observado por Recursos Materiales' ? '<button class="btn btn-warning" data-paa-new-version type="button">Crear nueva versión</button>' : ''}</div></article><article class="card mt24"><div class="card-head"><div><span class="kicker">Cumplimiento por área</span><h3>Áreas Requirentes</h3></div><span class="status-badge">${submitted}/${areas.length}</span></div><div class="table-wrap">${areaTable(areas)}</div></article><article class="card mt24"><div class="card-head"><div><span class="kicker">Registros para revisión</span><h3>Bandeja de la Coordinación Administrativa</h3></div><button class="btn btn-secondary btn-small" data-paa-route="paa-records" type="button">Ver bandeja completa</button></div><div class="table-wrap">${recordTable(rows.slice(0,8),'ca')}</div></article>${notificationPreview()}`;
    bindPaaRoutes(content); bindPaaActions(content);
  }
  function areaTable(items) {
    return `<table class="data-table paa-area-table"><thead><tr><th>Área Requirente</th><th>Registros</th><th>Monto</th><th>Estatus</th><th>Última actualización</th><th>Acción</th></tr></thead><tbody>${items.map(item => `<tr><td><b>${escapeHtml(item.area.name)}</b>${item.declaration ? '<small>Sin requerimientos declarado</small>' : ''}</td><td>${item.rows.length}</td><td>${money(item.amount)}</td><td>${badge(item.declaration ? 'Sin requerimientos' : item.validated ? 'Validada' : item.submitted ? 'En revisión' : 'Pendiente')}</td><td>${escapeHtml(item.rows[0]?.updatedAt || item.declaration?.when || '—')}</td><td><button class="btn btn-secondary btn-small" data-paa-area-filter="${item.area.id}" type="button">Ver</button></td></tr>`).join('')}</tbody></table>`;
  }
  function recordTable(rows, role) {
    if (!rows.length) return '<div class="empty-queue">No hay registros en el alcance seleccionado.</div>';
    return `<table class="data-table paa-record-table"><thead><tr><th>Identificador</th><th>Área Requirente</th><th>Descripción</th><th>Partida</th><th>Importe</th><th>Estatus</th><th>Acciones</th></tr></thead><tbody>${rows.map(record => `<tr><td><b>${escapeHtml(record.id)}</b><small>${escapeHtml(record.updatedAt || '')}</small></td><td>${escapeHtml(record.area)}</td><td>${escapeHtml(record.description)}</td><td>${escapeHtml(record.budgetItem)}</td><td>${money(amountOf(record))}</td><td>${badge(record.status)}</td><td><div class="table-action-group">${recordActions(record,role)}</div></td></tr>`).join('')}</tbody></table>`;
  }
  function recordActions(record, role) {
    const actions = [`<button class="btn btn-secondary btn-small" data-paa-action="view" data-paa-id="${record.id}" type="button">Ver</button>`];
    if (role === 'area') {
      if (['Borrador','Observado','Corregido'].includes(record.status)) actions.push(`<button class="btn btn-ghost btn-small" data-paa-action="edit" data-paa-id="${record.id}" type="button">${record.status === 'Observado' ? 'Atender' : 'Editar'}</button>`);
      if (['Borrador','Corregido'].includes(record.status)) actions.push(`<button class="btn btn-primary btn-small" data-paa-action="send" data-paa-id="${record.id}" type="button">Enviar</button>`);
    }
    if (role === 'ca' && ['Enviado a Coordinación Administrativa','Corregido','En revisión'].includes(record.status)) {
      actions.push(`<button class="btn btn-warning btn-small" data-paa-action="observe" data-paa-id="${record.id}" type="button">Observar</button>`);
      actions.push(`<button class="btn btn-primary btn-small" data-paa-action="validate" data-paa-id="${record.id}" type="button">Validar</button>`);
    }
    actions.push(`<button class="btn btn-ghost btn-small" data-paa-action="history" data-paa-id="${record.id}" type="button">Historial</button>`);
    return actions.join('');
  }
  function bindPaaRoutes(root = document) {
    $$('[data-paa-route]',root).forEach(button => button.onclick = () => { if (button.dataset.paaRoute === 'paa-register') currentRecordId = ''; route(button.dataset.paaRoute); });
    $$('[data-paa-area-filter]',root).forEach(button => button.onclick = () => { state.areaFilter = button.dataset.paaAreaFilter; route('paa-records'); });
  }
  function bindPaaActions(root = document) {
    $$('[data-paa-action]',root).forEach(button => button.onclick = () => {
      const record = recordById(button.dataset.paaId); if (!record) return;
      const action = button.dataset.paaAction;
      if (action === 'view') openRecordModal(record);
      if (action === 'edit') { currentRecordId = record.id; route('paa-register'); }
      if (action === 'send') sendRecord(record);
      if (action === 'observe') observeRecord(record);
      if (action === 'validate') validateRecord(record);
      if (action === 'history') openHistoryModal(record);
    });
    $('[data-paa-mass-upload]',root)?.addEventListener('click', openMassUpload);
    $('[data-paa-template]',root)?.addEventListener('click', downloadTemplate);
    $('[data-paa-no-requirements]',root)?.addEventListener('click', declareNoRequirements);
    $('[data-paa-new-version]',root)?.addEventListener('click', createNewVersion);
  }

  function renderRecordsPage() {
    const role = state.role; const rows = state.areaFilter && role === 'ca' ? visibleRecords().filter(item => item.areaId === state.areaFilter) : visibleRecords();
    header('Programa Anual de Adquisiciones',role === 'area' ? 'Mis registros PAA' : 'Bandeja de registros PAA',role === 'area' ? 'Administre únicamente las necesidades de su Área Requirente.' : 'Revise, observe y valide las necesidades recibidas de todas las Áreas Requirentes de la dependencia.');
    const filters = `<article class="card"><div class="paa-filter-grid"><label>Buscar<input id="paaRecordSearch" placeholder="ID, descripción o área"></label><label>Estatus<select id="paaRecordStatus"><option value="">Todos</option>${[...new Set(rows.map(item => item.status))].map(status => `<option>${escapeHtml(status)}</option>`).join('')}</select></label><label>Partida<input id="paaRecordPartida" placeholder="Ej. 2111"></label>${role === 'ca' ? '<label>Área Requirente<select id="paaRecordArea"><option value="">Todas</option>'+depAreas(state.dependencyKey).map(item => `<option value="${item.id}">${escapeHtml(item.name)}</option>`).join('')+'</select></label>' : ''}</div></article>`;
    content.innerHTML = contextHtml() + filters + `<article class="card mt24"><div class="card-head"><div><span class="kicker">Ejercicio ${state.fiscalYear}</span><h3>${rows.length} registro(s) en el alcance</h3></div>${role === 'area' ? '<button class="btn btn-primary" data-paa-route="paa-register" type="button">+ Registrar necesidad</button>' : ''}</div><div id="paaRecordsTable" class="table-wrap">${recordTable(rows,role)}</div></article>`;
    bindPaaRoutes(content); bindPaaActions(content);
    const apply = () => {
      const q = ($('#paaRecordSearch')?.value || '').toLowerCase(); const status = $('#paaRecordStatus')?.value || ''; const partidaValue = ($('#paaRecordPartida')?.value || '').toLowerCase(); const areaValue = $('#paaRecordArea')?.value || '';
      const filtered = rows.filter(item => (!q || [item.id,item.description,item.area].join(' ').toLowerCase().includes(q)) && (!status || item.status === status) && (!partidaValue || item.budgetItem.toLowerCase().includes(partidaValue)) && (!areaValue || item.areaId === areaValue));
      $('#paaRecordsTable').innerHTML = recordTable(filtered,role); bindPaaActions($('#paaRecordsTable'));
    };
    $$('[id^="paaRecord"]',content).forEach(input => input.addEventListener(input.tagName === 'INPUT' ? 'input' : 'change',apply));
  }

  function renderRecordForm() {
    if (state.role !== 'area') return toast('Sólo el Área Requirente puede capturar o modificar sus propios registros.');
    const existing = currentRecordId ? recordById(currentRecordId) : null; const r = existing || recordTemplate(idFor('PAA-2027-',state.nextRecord),state.areaId,{status:'Borrador',createdAt:today(),updatedAt:today()});
    if (existing && (existing.areaId !== state.areaId || !['Borrador','Observado','Corregido'].includes(existing.status))) return toast('El registro no está disponible para edición en este momento.');
    header('Programa Anual de Adquisiciones',existing ? (existing.status === 'Observado' ? 'Atender observación' : 'Editar necesidad') : 'Registrar necesidad de adquisición','Capture la información de la necesidad. El importe se calcula automáticamente y el registro se conserva como borrador hasta que usted decida enviarlo.');
    const options = (items, selected) => items.map(item => `<option value="${escapeHtml(item)}" ${String(item) === String(selected) ? 'selected' : ''}>${escapeHtml(item)}</option>`).join('');
    const partyOptions = PARTIDAS.map(item => `<option value="${item.key}" ${item.key === r.budgetItem ? 'selected' : ''}>${item.key} · ${escapeHtml(item.name)}</option>`).join('');
    content.innerHTML = contextHtml() + `<form class="card paa-form" id="paaRecordForm" novalidate><div class="card-head"><div><span class="kicker">${existing ? escapeHtml(existing.id) : 'Nuevo registro'}</span><h3>Datos generales y de la adquisición</h3></div>${badge(existing?.status || 'Borrador')}</div><div class="form-grid cols3"><label>Ejercicio fiscal<input name="fiscalYear" type="number" value="${r.fiscalYear}" readonly></label><label>Dependencia<input value="${escapeHtml(dependencyName(state.dependencyKey))}" readonly></label><label>Unidad Administrativa<input name="unitAdministrative" value="${escapeHtml(r.unitAdministrative || areaName(state.areaId))}" readonly></label><label>Área Requirente<input value="${escapeHtml(areaName(state.areaId))}" readonly></label><label>Responsable del registro<input name="responsible" value="${escapeHtml(r.responsible || actor())}" required></label><label>Fecha de registro<input name="registeredAt" type="date" value="${r.registeredAt || today()}" readonly></label></div><div class="subhead">Datos de la adquisición</div><div class="form-grid cols3"><label>Tipo de adquisición<select name="acquisitionType">${options(ACQUISITION_TYPES,r.acquisitionType)}</select></label><label>Capítulo de gasto<input name="chapter" value="${escapeHtml(r.chapter)}" readonly></label><label>Concepto<input name="concept" value="${escapeHtml(r.concept)}" readonly></label><label>Partida presupuestaria<select name="budgetItem" required>${partyOptions}</select></label><label>Clasificador específico<input name="classifier" value="${escapeHtml(r.classifier)}" required></label><label class="span2">Descripción del bien o servicio<input name="description" value="${escapeHtml(r.description)}" required></label><label class="span2">Características técnicas generales<textarea name="technicalSpecs" rows="3" required>${escapeHtml(r.technicalSpecs)}</textarea></label><label>Unidad de medida<select name="unit">${options(UNITS,r.unit)}</select></label><label>Cantidad<input name="quantity" type="number" min="0.01" step="0.01" value="${r.quantity}" required></label><label>Precio unitario estimado<input name="unitPrice" type="number" min="0" step="0.01" value="${r.unitPrice}" required></label><label>Importe estimado<input name="estimatedAmount" value="${money(amountOf(r))}" readonly aria-readonly="true"></label><label>Fuente de financiamiento<input name="fundingSource" value="${escapeHtml(r.fundingSource)}" required></label></div><div class="subhead">Programación</div><div class="form-grid cols3"><label>Inicio del procedimiento<select name="startMonth">${options(MONTHS,r.startMonth)}</select></label><label>Mes estimado de contratación<select name="contractMonth">${options(MONTHS,r.contractMonth)}</select></label><label>Mes de suministro / prestación<select name="supplyMonth">${options(MONTHS,r.supplyMonth)}</select></label><label>Periodicidad<select name="periodicity">${options(PERIODICITIES,r.periodicity)}</select></label></div><div class="subhead">Información adicional</div><div class="form-grid cols2"><label>Justificación de la necesidad<textarea name="justification" rows="4" required>${escapeHtml(r.justification)}</textarea></label><label>Observaciones<textarea name="observations" rows="4">${escapeHtml(r.observations)}</textarea></label><label>Archivo soporte <small>(opcional)</small><input name="supportFile" type="file" accept=".pdf,.xlsx,.xls,.csv,.png,.jpg,.jpeg"><small class="file-selection">${escapeHtml(r.supportFile?.name || 'Sin archivo seleccionado')}</small></label></div><div class="source-note"><b>Regla:</b> el importe estimado se obtiene de la cantidad por el precio unitario; no se permite capturar un importe distinto.</div><div class="actions mt24"><button class="btn btn-secondary" data-paa-route="paa-records" type="button">Cancelar</button><button class="btn btn-ghost" data-paa-save-draft type="button">Guardar borrador</button><button class="btn btn-primary" data-paa-save-send type="button">${existing?.status === 'Observado' ? 'Corregir y reenviar' : 'Guardar y enviar a Coordinación Administrativa'}</button></div></form>`;
    const form = $('#paaRecordForm'); const amountInput = form.elements.estimatedAmount;
    const syncAmount = () => { amountInput.value = money(Number(form.elements.quantity.value || 0) * Number(form.elements.unitPrice.value || 0)); };
    form.elements.quantity.oninput = syncAmount; form.elements.unitPrice.oninput = syncAmount;
    form.elements.budgetItem.onchange = () => { const p = party(form.elements.budgetItem.value); if (p) { form.elements.chapter.value = p.chapter; form.elements.concept.value = p.concept; if (p.type === 'Servicio') form.elements.acquisitionType.value = 'Servicios'; } };
    form.elements.supportFile.onchange = () => { const file = form.elements.supportFile.files[0]; form.querySelector('.file-selection').textContent = file ? `${file.name} · ${Math.round(file.size/1024)} KB` : 'Sin archivo seleccionado'; };
    $('[data-paa-route]',form).onclick = () => route('paa-records');
    $('[data-paa-save-draft]',form).onclick = () => saveRecordForm(form,false,r,existing);
    $('[data-paa-save-send]',form).onclick = () => saveRecordForm(form,true,r,existing);
  }
  function readRecordForm(form, target) {
    const f = new FormData(form); const data = Object.fromEntries(f.entries()); const file = form.elements.supportFile.files[0]; const activePaa = ensurePaa(state.dependencyKey,state.fiscalYear); delete data.supportFile; Object.assign(target,data,{paaId:activePaa.id,fiscalYear:Number(data.fiscalYear),quantity:Number(data.quantity),unitPrice:Number(data.unitPrice),estimatedAmount:Number(data.quantity) * Number(data.unitPrice),dependencyKey:String(state.dependencyKey),dependency:dependencyName(state.dependencyKey),areaId:state.areaId,area:areaName(state.areaId),unitAdministrative:areaName(state.areaId),registeredAt:data.registeredAt || today()});
    if (file) target.supportFile = {name:file.name,size:file.size,type:file.type,uploadedAt:stamp()};
    return target;
  }
  function validateRecordForSend(record) {
    const labels = {fiscalYear:'Ejercicio fiscal',dependencyKey:'Dependencia',areaId:'Área Requirente',responsible:'Responsable',acquisitionType:'Tipo de adquisición',chapter:'Capítulo',concept:'Concepto',budgetItem:'Partida presupuestaria',classifier:'Clasificador específico',description:'Descripción',technicalSpecs:'Características técnicas',unit:'Unidad de medida',quantity:'Cantidad',unitPrice:'Precio unitario estimado',fundingSource:'Fuente de financiamiento',startMonth:'Mes de inicio',contractMonth:'Mes de contratación',supplyMonth:'Mes de suministro',periodicity:'Periodicidad',justification:'Justificación'};
    const missing = Object.keys(labels).filter(key => String(record[key] ?? '').trim() === '');
    if (missing.length) return `Falta información obligatoria: ${missing.map(key => labels[key]).join(', ')}.`;
    if (Number(record.quantity) <= 0 || Number(record.unitPrice) < 0 || amountOf(record) !== Number(record.estimatedAmount)) return 'Verifique cantidad, precio e importe calculado.';
    if (!party(record.budgetItem)) return 'Seleccione una partida presupuestaria válida.';
    return '';
  }
  function saveRecordForm(form, send, target, existing) {
    const record = readRecordForm(form,target); const issue = send ? validateRecordForSend(record) : '';
    if (issue) return toast(issue);
    if (!existing) { state.nextRecord += 1; state.records.push(record); }
    const prior = record.status; record.status = send ? 'Enviado a Coordinación Administrativa' : (existing?.status === 'Observado' ? 'Corregido' : 'Borrador'); if (send) record.observation = null; addRecordHistory(record, send ? (prior === 'Observado' ? 'Corrección y reenvío' : 'Envío a Coordinación Administrativa') : 'Modificación', send ? 'Información capturada y remitida para revisión.' : 'Información guardada como borrador.');
    const paa = currentPaa(); if (paa) { paa.updatedAt = today(); if (send) { notify('ca',state.dependencyKey,`${record.area} envió el registro ${record.id} para revisión.`,record.areaId); addAudit('Envío a Coordinación Administrativa',`Registro ${record.id} remitido.`,{paaId:paa.id,dependencyKey:state.dependencyKey,areaId:record.areaId,recordId:record.id}); } else addAudit('Modificación de registro',`Registro ${record.id} guardado como borrador.`,{paaId:paa.id,dependencyKey:state.dependencyKey,areaId:record.areaId,recordId:record.id}); }
    save(); currentRecordId = ''; route('paa-dashboard');
  }
  function sendRecord(record) {
    const issue = validateRecordForSend(record); if (issue) return toast(issue);
    confirmModal('Enviar registro a Coordinación Administrativa',`¿Confirma el envío de ${record.id}? La Coordinación podrá revisar y observar este registro.`,`Confirmar envío`,() => { const prior = record.status; record.status = prior === 'Corregido' ? 'Enviado a Coordinación Administrativa' : 'Enviado a Coordinación Administrativa'; addRecordHistory(record,'Envío a Coordinación Administrativa','Registro enviado desde el Área Requirente.'); notify('ca',state.dependencyKey,`${record.area} envió el registro ${record.id} para revisión.`,record.areaId); addAudit('Envío a Coordinación Administrativa',`Registro ${record.id} remitido.`,{paaId:record.paaId,dependencyKey:record.dependencyKey,areaId:record.areaId,recordId:record.id}); save(); route('paa-dashboard'); });
  }
  function validateRecord(record) {
    if (state.role !== 'ca' || record.dependencyKey !== String(state.dependencyKey)) return toast('El registro está fuera de su ámbito.');
    const issue = validateRecordForSend(record); if (issue) return toast(`No se puede validar: ${issue}`);
    const prior = record.status; record.status = 'Validado por Coordinación Administrativa'; record.observation = null; addRecordHistory(record,'Validación','Registro validado por la Coordinación Administrativa.'); addAudit('Validación de registro',`${record.id}: ${prior} → ${record.status}`,{paaId:record.paaId,dependencyKey:record.dependencyKey,areaId:record.areaId,recordId:record.id}); notify('area',record.dependencyKey,`El registro ${record.id} fue validado por la Coordinación Administrativa.`,record.areaId); save(); renderCaDashboard();
  }
  function observeRecord(record) {
    observationModal('Observar registro PAA',`El registro ${record.id} regresará al Área Requirente para corrección.`,text => { const prior = record.status; record.status = 'Observado'; record.observation = {text,user:actor(),when:stamp()}; state.observations.unshift({scope:'record',recordId:record.id,paaId:record.paaId,text,user:actor(),role:ROLES[state.role],when:stamp()}); addRecordHistory(record,'Observación',text); addAudit('Observación y devolución',`${record.id}: ${text}`,{paaId:record.paaId,dependencyKey:record.dependencyKey,areaId:record.areaId,recordId:record.id}); notify('area',record.dependencyKey,`El registro ${record.id} fue devuelto por la Coordinación Administrativa para corrección.`,record.areaId); save(); renderCaDashboard(); });
  }
  function declareNoRequirements() {
    const paa = currentPaa(); if (!paa) return toast('No existe un PAA para el ejercicio seleccionado.'); const a = area(state.areaId); confirmModal('Declarar sin requerimientos',`El Área Requirente declara que no cuenta con necesidades de adquisición para integrar al Programa Anual de Adquisiciones del ejercicio ${state.fiscalYear}.`,`Confirmar declaración`,() => { paa.areaDeclarations ||= {}; paa.areaDeclarations[state.areaId] = {status:'Sin requerimientos',user:actor(),when:stamp()}; addAudit('Declaración Sin requerimientos',`${a.name} declaró no tener necesidades para ${state.fiscalYear}.`,{paaId:paa.id,dependencyKey:paa.dependencyKey,areaId:state.areaId}); notify('ca',paa.dependencyKey,`${a.name} declaró “Sin requerimientos” para el ejercicio ${state.fiscalYear}.`,state.areaId); save(); renderAreaDashboard(); });
  }
  function openRecordModal(record) {
    modalBody.innerHTML = `<div class="detail-grid paa-detail-grid"><div><small>Identificador</small><strong>${escapeHtml(record.id)}</strong></div><div><small>Estatus</small><strong>${badge(record.status)}</strong></div><div><small>Dependencia</small><strong>${escapeHtml(record.dependency)}</strong></div><div><small>Área Requirente</small><strong>${escapeHtml(record.area)}</strong></div><div><small>Responsable</small><strong>${escapeHtml(record.responsible)}</strong></div><div><small>Ejercicio</small><strong>${record.fiscalYear}</strong></div><div><small>Tipo de adquisición</small><strong>${escapeHtml(record.acquisitionType)}</strong></div><div><small>Capítulo / concepto</small><strong>${escapeHtml(record.chapter)} · ${escapeHtml(record.concept)}</strong></div><div><small>Partida / clasificador</small><strong>${escapeHtml(record.budgetItem)} · ${escapeHtml(record.classifier)}</strong></div><div><small>Unidad y cantidad</small><strong>${escapeHtml(record.unit)} · ${record.quantity}</strong></div><div><small>Precio unitario</small><strong>${money(record.unitPrice)}</strong></div><div><small>Importe estimado</small><strong>${money(amountOf(record))}</strong></div><div><small>Fuente de financiamiento</small><strong>${escapeHtml(record.fundingSource)}</strong></div><div><small>Programación</small><strong>Inicio: ${escapeHtml(record.startMonth)} · Contratación: ${escapeHtml(record.contractMonth)} · Suministro: ${escapeHtml(record.supplyMonth)}</strong></div><div class="span2"><small>Descripción</small><strong>${escapeHtml(record.description)}</strong></div><div class="span2"><small>Características técnicas</small><strong>${escapeHtml(record.technicalSpecs)}</strong></div><div class="span2"><small>Justificación</small><strong>${escapeHtml(record.justification)}</strong></div>${record.observation ? `<div class="span2 observation-box"><b>Observación vigente</b><p>${escapeHtml(record.observation.text)}</p></div>` : ''}</div>`;
    modalActions.innerHTML = `<button class="btn btn-primary" data-paa-close type="button">Cerrar</button>`; openModal(`Detalle ${record.id}`,true); $('[data-paa-close]',modalActions).onclick = closeModal;
  }
  function openHistoryModal(record) {
    modalBody.innerHTML = `<p>Historial de cambios del registro <b>${escapeHtml(record.id)}</b>. La bitácora es de sólo lectura.</p><div class="table-wrap"><table class="data-table"><thead><tr><th>Fecha / hora</th><th>Usuario</th><th>Rol</th><th>Acción</th><th>Detalle</th></tr></thead><tbody>${(record.history || []).slice().reverse().map(item => `<tr><td>${escapeHtml(item.when)}</td><td>${escapeHtml(item.user)}</td><td>${escapeHtml(item.role)}</td><td>${escapeHtml(item.action)}</td><td>${escapeHtml(item.detail || '—')}</td></tr>`).join('')}</tbody></table></div>`;
    modalActions.innerHTML = '<button class="btn btn-primary" data-paa-close type="button">Cerrar</button>'; openModal(`Historial · ${record.id}`,true); $('[data-paa-close]',modalActions).onclick = closeModal;
  }

  function renderConsolidation() {
    if (state.role !== 'ca') return toast('La consolidación corresponde a la Coordinación Administrativa.');
    const paa = currentPaa(); const rows = paa ? recordsForPaa(paa.id) : []; const checks = validationChecks(paa,rows); const ready = checks.every(item => item.ok); const integrated = rows.filter(item => ['Validado por Coordinación Administrativa','Integrado al PAA Institucional','Enviado a Recursos Materiales','En revisión por Recursos Materiales','Validado por Recursos Materiales','Cerrado'].includes(item.status));
    header('Programa Anual de Adquisiciones','Consolidación del PAA institucional','Integre únicamente los registros validados, revise los totales y ejecute la validación previa al envío.');
    content.innerHTML = contextHtml() + flowHtml(2) + `<article class="card"><div class="card-head"><div><span class="kicker">PAA ${state.fiscalYear} · Versión ${paa?.version || 1}</span><h3>Validación previa al envío</h3></div>${badge(paa?.status || 'Sin PAA')}</div><div class="paa-checklist">${checks.map(item => `<div class="paa-check ${item.ok ? 'ok' : 'bad'}"><span>${item.ok ? '✓' : '!'}</span><div><b>${escapeHtml(item.label)}</b><small>${escapeHtml(item.detail)}</small></div></div>`).join('')}</div>${ready ? '<div class="success-box mt24"><b>Validación completa.</b><p>La información está lista para consolidarse y enviarse a la Dirección General de Recursos Materiales.</p></div>' : '<div class="observation-box mt24"><b>No es posible enviar el PAA.</b><p>Atienda las observaciones pendientes y complete las Áreas Requirentes antes de continuar.</p></div>'}<div class="actions mt24"><button class="btn btn-primary" data-paa-integrate type="button" ${ready ? '' : 'disabled'}>Integrar PAA Institucional</button><button class="btn btn-secondary" data-paa-send-rm type="button" ${ready && paa?.status === 'Integrado al PAA Institucional' ? '' : 'disabled'}>Enviar PAA a Dirección General de Recursos Materiales</button></div></article><article class="card mt24"><div class="card-head"><div><span class="kicker">Vista consolidada</span><h3>${integrated.length} registros incluidos · ${money(totalAmount(integrated))}</h3></div><button class="btn btn-secondary btn-small" data-paa-download-consolidated type="button">Descargar información</button></div>${consolidatedSummary(integrated)}</article><article class="card mt24"><span class="kicker">Trazabilidad de versiones</span><h3>Historial del PAA</h3>${paaHistoryTable(paa)}</article>`;
    $('[data-paa-integrate]',content).onclick = () => integratePaa(paa,ready); $('[data-paa-send-rm]',content).onclick = () => sendPaaToRm(paa,ready); $('[data-paa-download-consolidated]',content).onclick = () => downloadConsolidated(paa,integrated);
  }
  function validationChecks(paa, rows) {
    const areas = paa ? depAreas(paa.dependencyKey).map(item => areaSummary(item.id,paa)) : []; const areaOk = areas.length > 0 && areas.every(item => item.submitted); const noPending = rows.every(item => !['Borrador','Enviado a Coordinación Administrativa','En revisión','Observado','Corregido'].includes(item.status)); const fieldsOk = rows.length > 0 && rows.every(isRecordComplete); const validated = rows.length > 0 && rows.every(item => ['Validado por Coordinación Administrativa','Integrado al PAA Institucional','Enviado a Recursos Materiales','En revisión por Recursos Materiales','Validado por Recursos Materiales','Cerrado'].includes(item.status));
    return [{label:'Áreas integradas',ok:areaOk,detail:areaOk ? `${areas.length} de ${areas.length} áreas presentaron información o declararon Sin requerimientos.` : `${areas.filter(item => item.submitted).length} de ${areas.length} áreas integradas.`},{label:'Registros validados',ok:validated,detail:validated ? `${rows.length} registros cuentan con validación de Coordinación.` : 'Existen registros sin validar por Coordinación Administrativa.'},{label:'Información presupuestaria completa',ok:fieldsOk,detail:fieldsOk ? 'Partida, cantidad, unidad, precio e importe calculado completos.' : 'Faltan campos presupuestarios o hay importes inconsistentes.'},{label:'Calendarización completa',ok:rows.length > 0 && rows.every(item => item.startMonth && item.contractMonth && item.supplyMonth),detail:rows.every(item => item.startMonth && item.contractMonth && item.supplyMonth) ? 'Todos los registros tienen programación.' : 'Hay registros sin programación completa.'},{label:'Sin observaciones pendientes',ok:noPending,detail:noPending ? 'No existen borradores, devoluciones ni revisiones pendientes.' : 'Existen registros pendientes de revisión o con observaciones.'}];
  }
  function consolidatedSummary(rows) {
    const aggregate = key => Object.entries(rows.reduce((out,item) => { const k = item[key] || 'Sin dato'; out[k] = (out[k] || 0) + amountOf(item); return out; },{})).sort((a,b) => b[1]-a[1]);
    const monthTotals = MONTHS.map(month => [month, rows.filter(item => item.supplyMonth === month).reduce((sum,item) => sum + amountOf(item),0)]).filter(item => item[1]);
    const renderGroup = (title, items) => `<div class="paa-summary-group"><b>${title}</b>${items.length ? items.map(item => `<span>${escapeHtml(item[0])}<strong>${money(item[1])}</strong></span>`).join('') : '<small>Sin información</small>'}</div>`;
    return `<div class="comparative-cards paa-totals"><div><small>Total de registros</small><strong>${rows.length}</strong></div><div><small>Áreas Requirentes</small><strong>${new Set(rows.map(item => item.areaId)).size}</strong></div><div><small>Monto total anual</small><strong>${money(totalAmount(rows))}</strong></div><div><small>Tipos de adquisición</small><strong>${new Set(rows.map(item => item.acquisitionType)).size}</strong></div></div><div class="paa-summary-grid">${renderGroup('Total por capítulo',aggregate('chapter'))}${renderGroup('Total por partida',aggregate('budgetItem'))}${renderGroup('Total por tipo de adquisición',aggregate('acquisitionType'))}${renderGroup('Total mensual',monthTotals)}</div>`;
  }
  function integratePaa(paa,ready) {
    if (!paa || !ready) return toast('La validación previa aún no está completa.');
    paa.status = 'Integrado al PAA Institucional'; paa.updatedAt = today(); recordsForPaa(paa.id).forEach(record => { record.status = 'Integrado al PAA Institucional'; addRecordHistory(record,'Integración al PAA Institucional','Incluido en la vista consolidada.'); }); paa.history.push({when:stamp(),user:actor(),role:ROLES[state.role],action:'Integrar PAA Institucional',detail:`${recordsForPaa(paa.id).length} registros · ${money(totalAmount(recordsForPaa(paa.id)))}`}); addAudit('Consolidación del PAA',`PAA ${paa.id} integrado institucionalmente.`,{paaId:paa.id,dependencyKey:paa.dependencyKey}); save(); renderConsolidation();
  }
  function sendPaaToRm(paa,ready) {
    if (!paa || !ready || paa.status !== 'Integrado al PAA Institucional') return toast('Integre y valide el PAA antes de enviarlo.');
    confirmModal('Enviar PAA a Recursos Materiales','¿Confirma que la información del Programa Anual de Adquisiciones de la dependencia ha sido revisada y validada por la Coordinación Administrativa y desea enviarla a la Dirección General de Recursos Materiales?','Confirmar envío',() => { paa.status = 'Enviado a Recursos Materiales'; paa.sentAt = stamp(); paa.sentBy = actor(); paa.updatedAt = today(); recordsForPaa(paa.id).forEach(record => { record.status = 'Enviado a Recursos Materiales'; addRecordHistory(record,'Envío a Recursos Materiales',`PAA ${paa.id} · Versión ${paa.version}`); }); paa.history.push({when:stamp(),user:actor(),role:ROLES[state.role],action:'Envío a Recursos Materiales',detail:`Dependencia: ${paa.dependency} · Ejercicio: ${paa.fiscalYear} · Versión: ${paa.version} · Registros: ${recordsForPaa(paa.id).length} · Monto: ${money(totalAmount(recordsForPaa(paa.id)))}`}); addAudit('Envío a Recursos Materiales',`PAA ${paa.id} enviado a la Dirección General de Recursos Materiales.`,{paaId:paa.id,dependencyKey:paa.dependencyKey}); notify('rm',paa.dependencyKey,`${paa.dependency} ha enviado su Programa Anual de Adquisiciones para revisión.`); save(); renderConsolidation(); });
  }
  function createNewVersion() {
    const paa = currentPaa(); if (!paa || paa.status !== 'Observado por Recursos Materiales') return toast('Sólo puede crear una nueva versión después de una devolución de Recursos Materiales.');
    const oldId = paa.id; const oldRecords = recordsForPaa(oldId); state.versions.push({paaId:oldId,version:paa.version,createdAt:stamp(),user:actor(),reason:'Devolución por observaciones de Recursos Materiales',amount:totalAmount(oldRecords),records:oldRecords.length,immutable:true}); paa.version += 1; paa.id = `PAA-${paa.fiscalYear}-${paa.dependencyKey}-v${paa.version}`; paa.status = 'En integración interna'; paa.updatedAt = today(); paa.history.push({when:stamp(),user:actor(),role:ROLES[state.role],action:'Nueva versión',detail:`${oldId} → ${paa.id}`}); oldRecords.forEach(record => { record.paaId = paa.id; record.status = 'Corregido por Coordinación Administrativa'; addRecordHistory(record,'Corrección por Coordinación Administrativa','Registro reabierto para nueva versión del PAA.'); }); addAudit('Nueva versión del PAA',`${oldId} conservada; nueva versión ${paa.id}.`,{paaId:paa.id,dependencyKey:paa.dependencyKey}); save(); renderCaDashboard();
  }
  function paaHistoryTable(paa) {
    const rows = [...(state.versions.filter(item => item.paaId === paa?.id)),...(paa?.history || []).map(item => ({...item,version:paa?.version}))];
    return `<div class="table-wrap"><table class="data-table"><thead><tr><th>Fecha / hora</th><th>Versión</th><th>Usuario</th><th>Acción</th><th>Detalle</th></tr></thead><tbody>${rows.slice().reverse().map(item => `<tr><td>${escapeHtml(item.when || item.createdAt || '—')}</td><td>${item.version || paa?.version || '—'}</td><td>${escapeHtml(item.user || '—')}</td><td>${escapeHtml(item.action || 'Versión conservada')}</td><td>${escapeHtml(item.detail || `Monto: ${money(item.amount)} · Registros: ${item.records || '—'}`)}</td></tr>`).join('') || '<tr><td colspan="5">Sin movimientos registrados.</td></tr>'}</tbody></table></div>`;
  }
  function downloadConsolidated(paa, rows) {
    const headerRow = ['Identificador','Ejercicio','Dependencia','Área Requirente','Tipo de adquisición','Capítulo','Concepto','Partida','Clasificador','Descripción','Unidad','Cantidad','Precio unitario','Importe estimado','Fuente','Inicio','Contratación','Suministro','Periodicidad','Estatus'];
    const data = rows.map(item => [item.id,item.fiscalYear,item.dependency,item.area,item.acquisitionType,item.chapter,item.concept,item.budgetItem,item.classifier,item.description,item.unit,item.quantity,item.unitPrice,amountOf(item),item.fundingSource,item.startMonth,item.contractMonth,item.supplyMonth,item.periodicity,item.status]);
    download(`PAA-${paa?.fiscalYear || YEAR}-${paa?.dependencyKey || state.dependencyKey}-consolidado.csv`,[headerRow,...data].map(row => row.map(value => `"${String(value ?? '').replace(/"/g,'""')}"`).join(',')).join('\n'),'text/csv;charset=utf-8');
  }

  function renderRmrDashboard() {
    header('Dirección General de Recursos Materiales','Programas Anuales de Adquisiciones','Consulte los PAA institucionales recibidos, revise el detalle por Área Requirente y partida, emita observaciones y valide.');
    const rows = filteredRmrPaas();
    content.innerHTML = contextHtml() + flowHtml(3) + `<article class="card"><div class="card-head"><div><span class="kicker">Bandeja transversal</span><h3>Programas institucionales recibidos</h3></div><span class="status-badge">${rows.length} programa(s)</span></div><div class="paa-filter-grid rmr-filters"><label>Ejercicio<select id="paaRmrYear"><option value="">Todos</option><option value="2027">2027</option></select></label><label>Dependencia<select id="paaRmrDependency"><option value="">Todas</option>${DEPENDENCIES.map(item => `<option value="${item.key}">${escapeHtml(item.name)}</option>`).join('')}</select></label><label>Estatus<select id="paaRmrStatus"><option value="">Todos</option>${['Enviado a Recursos Materiales','En revisión por Recursos Materiales','Observado por Recursos Materiales','Validado por Recursos Materiales','Cerrado'].map(item => `<option>${item}</option>`).join('')}</select></label><label>Tipo / capítulo<input id="paaRmrType" placeholder="Bienes, 2000, 2111..."></label></div><div class="table-wrap mt24"><table class="data-table"><thead><tr><th>Dependencia</th><th>Ejercicio</th><th>Áreas</th><th>Registros</th><th>Monto</th><th>Estatus</th><th>Última actualización</th><th>Acción</th></tr></thead><tbody>${rows.map(paa => { const pr = recordsForPaa(paa.id); return `<tr><td><b>${escapeHtml(paa.dependency)}</b><small>Versión ${paa.version}</small></td><td>${paa.fiscalYear}</td><td>${new Set(pr.map(item => item.areaId)).size}</td><td>${pr.length}</td><td>${money(totalAmount(pr))}</td><td>${badge(paa.status)}</td><td>${escapeHtml(paa.updatedAt || paa.sentAt || '—')}</td><td><button class="btn btn-primary btn-small" data-paa-open-paa="${paa.id}" type="button">Abrir PAA</button></td></tr>`; }).join('') || '<tr><td colspan="8"><div class="empty-queue">No hay PAA que cumplan los filtros.</div></td></tr>'}</tbody></table></div></article>${notificationPreview()}`;
    const sync = () => { state.rmrFilters = {year:$('#paaRmrYear').value,dependency:$('#paaRmrDependency').value,status:$('#paaRmrStatus').value,type:$('#paaRmrType').value}; renderRmrDashboard(); $('#paaRmrYear').value = state.rmrFilters.year; $('#paaRmrDependency').value = state.rmrFilters.dependency; $('#paaRmrStatus').value = state.rmrFilters.status; $('#paaRmrType').value = state.rmrFilters.type; };
    $('#paaRmrYear').value = state.rmrFilters?.year || ''; $('#paaRmrDependency').value = state.rmrFilters?.dependency || ''; $('#paaRmrStatus').value = state.rmrFilters?.status || ''; $('#paaRmrType').value = state.rmrFilters?.type || '';
    $('#paaRmrYear').onchange = sync; $('#paaRmrDependency').onchange = sync; $('#paaRmrStatus').onchange = sync; $('#paaRmrType').oninput = sync;
    $$('[data-paa-open-paa]',content).forEach(button => button.onclick = () => openPaaDetail(paaById(button.dataset.paaOpenPaa)));
    bindPaaRoutes(content);
  }
  function filteredRmrPaas() {
    const f = state.rmrFilters || {}; return visiblePaas().filter(paa => (!f.year || String(paa.fiscalYear) === String(f.year)) && (!f.dependency || paa.dependencyKey === f.dependency) && (!f.status || paa.status === f.status) && (!f.type || recordsForPaa(paa.id).some(item => [item.acquisitionType,item.chapter,item.budgetItem].join(' ').toLowerCase().includes(f.type.toLowerCase()))));
  }
  function openPaaDetail(paa) {
    if (!paa) return; const rows = recordsForPaa(paa.id); const areas = [...new Set(rows.map(item => item.areaId))].map(id => areaSummary(id,paa));
    modalBody.innerHTML = `<div class="detail-grid paa-detail-grid"><div><small>Dependencia</small><strong>${escapeHtml(paa.dependency)}</strong></div><div><small>Ejercicio</small><strong>${paa.fiscalYear}</strong></div><div><small>Fecha de envío</small><strong>${escapeHtml(paa.sentAt || '—')}</strong></div><div><small>Usuario responsable</small><strong>${escapeHtml(paa.sentBy || '—')}</strong></div><div><small>Áreas Requirentes</small><strong>${areas.length}</strong></div><div><small>Número de registros</small><strong>${rows.length}</strong></div><div><small>Monto total</small><strong>${money(totalAmount(rows))}</strong></div><div><small>Estatus</small><strong>${badge(paa.status)}</strong></div></div><div class="subhead">Detalle por Área Requirente</div><div class="table-wrap"><table class="data-table"><thead><tr><th>Área</th><th>Registros</th><th>Monto</th><th>Detalle</th></tr></thead><tbody>${areas.map(item => `<tr><td>${escapeHtml(item.area.name)}</td><td>${item.rows.length}</td><td>${money(item.amount)}</td><td>${item.rows.map(record => `<button class="link-btn" data-paa-modal-record="${record.id}">${escapeHtml(record.id)}</button>`).join(' ')}</td></tr>`).join('')}</tbody></table></div><div class="subhead">Detalle por partida</div>${consolidatedSummary(rows)}<div class="subhead">Historial de modificaciones</div>${paaHistoryTable(paa)}`;
    const actionButtons = [];
    if (paa.status === 'Enviado a Recursos Materiales') actionButtons.push('<button class="btn btn-secondary" data-paa-receive type="button">Marcar como recibido</button>');
    if (['Enviado a Recursos Materiales','En revisión por Recursos Materiales'].includes(paa.status)) { actionButtons.push('<button class="btn btn-warning" data-paa-observe-paa type="button">Devolver para corrección</button>'); actionButtons.push('<button class="btn btn-primary" data-paa-validate-paa type="button">Validar PAA</button>'); }
    if (paa.status === 'Validado por Recursos Materiales') actionButtons.push('<button class="btn btn-primary" data-paa-close-paa type="button">Cerrar PAA</button>');
    actionButtons.push('<button class="btn btn-secondary" data-paa-download-detail type="button">Descargar información</button><button class="btn btn-ghost" data-paa-close type="button">Cerrar</button>');
    modalActions.innerHTML = actionButtons.join(''); openModal(`PAA Institucional · ${paa.dependency}`,true);
    $$('[data-paa-modal-record]',modalBody).forEach(button => button.onclick = () => openRecordModal(recordById(button.dataset.paaModalRecord)));
    $('[data-paa-close]',modalActions).onclick = closeModal; $('[data-paa-download-detail]',modalActions).onclick = () => downloadConsolidated(paa,rows);
    $('[data-paa-receive]',modalActions)?.addEventListener('click',() => receivePaa(paa)); $('[data-paa-observe-paa]',modalActions)?.addEventListener('click',() => observePaa(paa)); $('[data-paa-validate-paa]',modalActions)?.addEventListener('click',() => validatePaa(paa)); $('[data-paa-close-paa]',modalActions)?.addEventListener('click',() => closePaa(paa));
  }
  function receivePaa(paa) { paa.status = 'En revisión por Recursos Materiales'; paa.updatedAt = today(); paa.history.push({when:stamp(),user:actor(),role:ROLES[state.role],action:'PAA recibido',detail:'La Dirección General de Recursos Materiales inició la revisión.'}); addAudit('PAA marcado como recibido',paa.id,{paaId:paa.id,dependencyKey:paa.dependencyKey}); notify('ca',paa.dependencyKey,`La Dirección General de Recursos Materiales marcó como recibido el PAA de ${paa.dependency}.`); save(); closeModal(); renderRmrDashboard(); }
  function observePaa(paa) { observationModal('Devolver PAA para corrección','Recursos Materiales requiere un motivo obligatorio para devolver el PAA a la Coordinación Administrativa.',text => { paa.status = 'Observado por Recursos Materiales'; paa.updatedAt = today(); state.observations.unshift({scope:'paa',paaId:paa.id,text,user:actor(),role:ROLES[state.role],when:stamp()}); paa.history.push({when:stamp(),user:actor(),role:ROLES[state.role],action:'Devolución por observaciones',detail:text}); addAudit('Devolución por Recursos Materiales',`${paa.id}: ${text}`,{paaId:paa.id,dependencyKey:paa.dependencyKey}); notify('ca',paa.dependencyKey,`El PAA de ${paa.dependency} fue devuelto por Recursos Materiales para corrección. Motivo: ${text}`); save(); closeModal(); renderRmrDashboard(); }); }
  function validatePaa(paa) { confirmModal('Validar PAA institucional',`¿Confirma que revisó el PAA ${paa.id}, sus áreas, partidas, importes y calendarización?`,`Validar PAA`,() => { paa.status = 'Validado por Recursos Materiales'; paa.updatedAt = today(); recordsForPaa(paa.id).forEach(record => { record.status = 'Validado por Recursos Materiales'; addRecordHistory(record,'Validación por Recursos Materiales','PAA institucional validado.'); }); paa.history.push({when:stamp(),user:actor(),role:ROLES[state.role],action:'PAA validado',detail:'Validación favorable de Recursos Materiales.'}); addAudit('Validación del PAA por Recursos Materiales',paa.id,{paaId:paa.id,dependencyKey:paa.dependencyKey}); notify('ca',paa.dependencyKey,`El PAA de ${paa.dependency} fue validado por Recursos Materiales.`); save(); closeModal(); renderRmrDashboard(); }); }
  function closePaa(paa) { paa.status = 'Cerrado'; paa.updatedAt = today(); paa.history.push({when:stamp(),user:actor(),role:ROLES[state.role],action:'PAA cerrado',detail:'El ciclo institucional quedó cerrado.'}); recordsForPaa(paa.id).forEach(record => { record.status = 'Cerrado'; addRecordHistory(record,'Cierre','PAA institucional cerrado.'); }); addAudit('Cierre del PAA',paa.id,{paaId:paa.id,dependencyKey:paa.dependencyKey}); notify('ca',paa.dependencyKey,`El PAA de ${paa.dependency} fue cerrado por Recursos Materiales.`); save(); closeModal(); renderRmrDashboard(); }

  function renderNotifications() {
    const rows = notificationsForUser(); header('Programa Anual de Adquisiciones','Notificaciones internas','Avisos generados por envíos, observaciones, correcciones, validaciones y cambios de estado.');
    content.innerHTML = contextHtml() + `<article class="card"><div class="card-head"><div><span class="kicker">Bandeja de avisos</span><h3>${rows.length} notificación(es)</h3></div><button class="btn btn-secondary" data-paa-mark-read type="button">Marcar como leídas</button></div><div class="paa-notifications-list paa-notifications-page">${rows.map(item => `<div class="paa-notification ${item.read ? 'read' : ''}"><span class="notification-dot"></span><div><b>${escapeHtml(item.message)}</b><small>${escapeHtml(item.when)} · ${item.read ? 'Leída' : 'Pendiente'}</small></div></div>`).join('') || '<div class="validation-banner">No hay notificaciones para este ámbito.</div>'}</div></article>`;
    $('#paa-mark-read',content)?.addEventListener('click',() => { rows.forEach(item => { item.read = true; }); save(); renderNotifications(); });
  }
  function renderAudit() {
    const rows = state.audit.filter(item => state.role === 'rm' || item.dependencyKey === String(state.dependencyKey)).filter(item => state.role !== 'area' || !item.areaId || item.areaId === state.areaId);
    header('Programa Anual de Adquisiciones','Bitácora de auditoría','Consulta de sólo lectura para conservar usuario, rol, fecha/hora, acción, registro, versión y observación.');
    content.innerHTML = contextHtml() + `<article class="card"><div class="card-head"><div><span class="kicker">Trazabilidad institucional</span><h3>${rows.length} evento(s)</h3></div><button class="btn btn-secondary" data-paa-export-audit type="button">Exportar CSV</button></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Fecha / hora</th><th>Usuario</th><th>Rol</th><th>Acción</th><th>PAA / registro</th><th>Observación / detalle</th></tr></thead><tbody>${rows.slice().reverse().map(item => `<tr><td>${escapeHtml(item.when)}</td><td>${escapeHtml(item.user)}</td><td>${escapeHtml(item.role)}</td><td>${escapeHtml(item.action)}</td><td>${escapeHtml(item.recordId || item.paaId || '—')}</td><td>${escapeHtml(item.detail || '—')}</td></tr>`).join('') || '<tr><td colspan="6">Sin eventos.</td></tr>'}</tbody></table></div></article>`;
    $('#paa-export-audit',content).onclick = exportAudit;
  }
  function exportAudit() {
    const rows = state.audit.filter(item => state.role === 'rm' || item.dependencyKey === String(state.dependencyKey)).map(item => [item.when,item.user,item.role,item.action,item.paaId || '',item.recordId || '',item.detail || '']);
    download('bitacora-paa-compramex.csv',[['Fecha','Usuario','Rol','Acción','PAA','Registro','Detalle'],...rows].map(row => row.map(value => `"${String(value).replace(/"/g,'""')}"`).join(',')).join('\n'),'text/csv;charset=utf-8');
  }

  function downloadTemplate() {
    const headers = ['Ejercicio fiscal','Dependencia','Unidad Administrativa','Área Requirente','Responsable del registro','Tipo de adquisición','Capítulo de gasto','Concepto','Partida presupuestaria','Clasificador específico','Descripción del bien o servicio','Características técnicas generales','Unidad de medida','Cantidad','Precio unitario estimado','Fuente de financiamiento','Mes inicio procedimiento','Mes estimado contratación','Mes estimado suministro','Periodicidad','Justificación de la necesidad','Observaciones'];
    const sample = [YEAR,dependencyName(state.dependencyKey),areaName(state.areaId),areaName(state.areaId),actor(),'Bienes','2000','Materiales de administración','2111','21101','Papel bond tamaño carta, paquete de 500 hojas','Papel bond blanco, 75 g/m², tamaño carta.','Paquete',100,118.40,'Recursos fiscales','Enero','Febrero','Marzo','Mensual','Describir la necesidad institucional',''];
    download(`plantilla-oficial-paa-${YEAR}.csv`,[headers,sample].map(row => row.map(value => `"${String(value ?? '').replace(/"/g,'""')}"`).join(',')).join('\n'),'text/csv;charset=utf-8');
  }
  function openMassUpload() {
    uploadPreview = null;
    modalBody.innerHTML = `<p>Seleccione la plantilla oficial o un archivo Excel moderno (.xlsx), CSV o TSV. La carga sólo prepara una vista previa; ningún registro se incorpora hasta que usted seleccione “Importar registros válidos”.</p><label>Archivo PAA<input id="paaMassFile" type="file" accept=".xlsx,.csv,.tsv,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"></label><div id="paaUploadPreview" class="mt24"></div>`;
    modalActions.innerHTML = '<button class="btn btn-secondary" data-paa-close type="button">Cancelar</button><button class="btn btn-ghost" data-paa-template type="button">Descargar plantilla</button><button class="btn btn-primary" data-paa-import type="button" disabled>Importar registros válidos</button>';
    openModal('Carga masiva del PAA',true); $('[data-paa-close]',modalActions).onclick = closeModal; $('[data-paa-template]',modalActions).onclick = downloadTemplate; $('#paaMassFile').onchange = async event => { const file = event.target.files[0]; if (!file) return; $('#paaUploadPreview').innerHTML = '<div class="validation-banner">Leyendo y validando el archivo…</div>'; try { uploadPreview = await parseAndValidateUpload(file); renderUploadPreview(); } catch (error) { uploadPreview = null; $('#paaUploadPreview').innerHTML = `<div class="observation-box">${escapeHtml(error.message || 'No se pudo leer el archivo.')}</div>`; } };
    $('[data-paa-import]',modalActions).onclick = importValidUpload;
  }
  function normalizeHeader(value) { return String(value || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9]+/g,' ').trim(); }
  function csvRows(text) {
    const rows=[]; let row=[], cell='', quoted=false;
    for (let i=0;i<text.length;i++) { const char=text[i], next=text[i+1]; if (char === '"' && quoted && next === '"') { cell += '"'; i++; } else if (char === '"') quoted = !quoted; else if ((char === ',' || char === '\t' || char === ';') && !quoted) { row.push(cell.trim()); cell=''; } else if ((char === '\n' || char === '\r') && !quoted) { if (char === '\r' && next === '\n') i++; row.push(cell.trim()); if (row.some(value => value !== '')) rows.push(row); row=[]; cell=''; } else cell += char; }
    if (cell || row.length) { row.push(cell.trim()); if (row.some(value => value !== '')) rows.push(row); }
    return rows;
  }
  async function readZipEntries(buffer) {
    const view = new DataView(buffer); const bytes = new Uint8Array(buffer); const u32 = offset => view.getUint32(offset,true); const u16 = offset => view.getUint16(offset,true); let eocd = -1;
    for (let i = bytes.length - 22; i >= Math.max(0,bytes.length - 65558); i--) if (u32(i) === 0x06054b50) { eocd = i; break; }
    if (eocd < 0) throw Error('El archivo Excel no contiene una estructura ZIP válida.');
    const count = u16(eocd + 10), cdOffset = u32(eocd + 16), entries = {};
    let cursor = cdOffset;
    const decoder = new TextDecoder();
    for (let i=0;i<count;i++) { if (u32(cursor) !== 0x02014b50) break; const method=u16(cursor+10), compressed=u32(cursor+20), nameLen=u16(cursor+28), extraLen=u16(cursor+30), commentLen=u16(cursor+32), localOffset=u32(cursor+42); const name=decoder.decode(bytes.slice(cursor+46,cursor+46+nameLen)); const localNameLen=u16(localOffset+26), localExtraLen=u16(localOffset+28); const start=localOffset+30+localNameLen+localExtraLen; const raw=bytes.slice(start,start+compressed); let data=raw; if(method===8){ if(!('DecompressionStream' in window)) throw Error('Este navegador no permite descomprimir XLSX; guarde la plantilla como CSV e inténtelo nuevamente.'); const stream=new Blob([raw]).stream().pipeThrough(new DecompressionStream('deflate-raw')); data=new Uint8Array(await new Response(stream).arrayBuffer()); } entries[name]=new TextDecoder().decode(data); cursor += 46+nameLen+extraLen+commentLen; }
    return entries;
  }
  function columnNumber(ref) { let letters = String(ref).match(/[A-Z]+/i)?.[0] || 'A', number=0; for (const char of letters.toUpperCase()) number = number*26 + char.charCodeAt(0)-64; return number-1; }
  async function xlsxRows(buffer) {
    const entries = await readZipEntries(buffer); const shared = []; const sharedXml = entries['xl/sharedStrings.xml']; if (sharedXml) { const doc = new DOMParser().parseFromString(sharedXml,'application/xml'); [...doc.querySelectorAll('si')].forEach(node => shared.push([...node.querySelectorAll('t')].map(t => t.textContent).join(''))); }
    const sheet = entries['xl/worksheets/sheet1.xml'] || Object.entries(entries).find(([key]) => /^xl\/worksheets\/sheet\d+\.xml$/.test(key))?.[1]; if (!sheet) throw Error('No se encontró una hoja de cálculo legible.'); const doc = new DOMParser().parseFromString(sheet,'application/xml'); const rows=[];
    [...doc.querySelectorAll('row')].forEach(rowNode => { const row=[]; [...rowNode.querySelectorAll('c')].forEach(cell => { const ref=cell.getAttribute('r') || 'A1', idx=columnNumber(ref); let value=''; if(cell.getAttribute('t')==='s') value=shared[Number(cell.querySelector('v')?.textContent || 0)] || ''; else if(cell.getAttribute('t')==='inlineStr') value=[...cell.querySelectorAll('t')].map(t=>t.textContent).join(''); else value=cell.querySelector('v')?.textContent || ''; row[idx]=value; }); rows.push(row.map(value => value ?? '')); }); return rows;
  }
  async function parseAndValidateUpload(file) {
    if (/\.xls$/i.test(file.name) && !/\.xlsx$/i.test(file.name)) throw Error('El formato XLS antiguo no se admite en esta demostración. Guarde el archivo como XLSX o CSV y vuelva a cargarlo.');
    const rows = /\.xlsx$/i.test(file.name) ? await xlsxRows(await file.arrayBuffer()) : csvRows(await file.text());
    if (rows.length < 2) throw Error('El archivo debe incluir encabezados y al menos un registro.');
    const headers = rows[0].map(normalizeHeader); const aliases = {fiscalYear:['ejercicio fiscal','ejercicio'],dependency:['dependencia'],unitAdministrative:['unidad administrativa','unidad administrativa responsable'],area:['area requirente','area'],responsible:['responsable del registro','responsable'],acquisitionType:['tipo de adquisicion','tipo'],chapter:['capitulo de gasto','capitulo'],concept:['concepto'],budgetItem:['partida presupuestaria','partida'],classifier:['clasificador especifico','clasificador'],description:['descripcion del bien o servicio','descripcion'],technicalSpecs:['caracteristicas tecnicas generales','caracteristicas tecnicas'],unit:['unidad de medida','unidad'],quantity:['cantidad'],unitPrice:['precio unitario estimado','precio unitario'],fundingSource:['fuente de financiamiento','fuente'],startMonth:['mes inicio procedimiento','mes inicio'],contractMonth:['mes estimado contratacion','mes contratacion'],supplyMonth:['mes estimado suministro','mes suministro'],periodicity:['periodicidad'],justification:['justificacion de la necesidad','justificacion'],observations:['observaciones']};
    const indexFor = names => { const wanted=names.map(normalizeHeader); return headers.findIndex(header => wanted.includes(header)); }; const mapping = Object.fromEntries(Object.entries(aliases).map(([key,names]) => [key,indexFor(names)])); const required = ['description','budgetItem','unit','quantity','unitPrice','fundingSource','startMonth','contractMonth','supplyMonth','justification']; const missingHeaders = required.filter(key => mapping[key] < 0); if (missingHeaders.length) throw Error(`Faltan encabezados obligatorios: ${missingHeaders.join(', ')}.`);
    const existingIds = new Set(state.records.map(item => item.id)); const fileIds = new Set(); const valid=[]; const errors=[];
    rows.slice(1).forEach((cells,rowIndex) => { const get=key => mapping[key] >= 0 ? String(cells[mapping[key]] || '').trim() : ''; const quantity=Number(get('quantity').replace(',','.')), unitPrice=Number(get('unitPrice').replace(',','.')); const budgetItem=get('budgetItem'); const p=party(budgetItem); const item=recordTemplate(idFor('PAA-2027-',state.nextRecord + valid.length + 1),state.areaId,{fiscalYear:Number(get('fiscalYear') || YEAR),dependencyKey:String(state.dependencyKey),dependency:dependencyName(state.dependencyKey),unitAdministrative:get('unitAdministrative') || areaName(state.areaId),areaId:state.areaId,area:get('area') || areaName(state.areaId),responsible:get('responsible') || actor(),acquisitionType:get('acquisitionType') || 'Bienes',chapter:get('chapter') || p?.chapter || '',concept:get('concept') || p?.concept || '',budgetItem,classifier:get('classifier'),description:get('description'),technicalSpecs:get('technicalSpecs'),unit:get('unit'),quantity,unitPrice,fundingSource:get('fundingSource'),startMonth:get('startMonth'),contractMonth:get('contractMonth'),supplyMonth:get('supplyMonth'),periodicity:get('periodicity') || 'Única',justification:get('justification'),observations:get('observations'),status:'Borrador',createdAt:today(),updatedAt:today()}); const rowErrors=[]; if(!get('description')) rowErrors.push('Descripción vacía'); if(!p) rowErrors.push('Partida no válida'); if(!get('unit')) rowErrors.push('Unidad vacía'); if(!Number.isFinite(quantity) || quantity <= 0) rowErrors.push('Cantidad inválida'); if(!Number.isFinite(unitPrice) || unitPrice < 0) rowErrors.push('Precio inválido'); if(!get('fundingSource')) rowErrors.push('Fuente de financiamiento vacía'); if(!get('startMonth') || !get('contractMonth') || !get('supplyMonth')) rowErrors.push('Calendarización incompleta'); if(!get('justification')) rowErrors.push('Justificación vacía'); if(fileIds.has(item.id) || existingIds.has(item.id)) rowErrors.push('Identificador duplicado'); fileIds.add(item.id); if(rowErrors.length) errors.push({row:rowIndex+2,values:item,errors:rowErrors}); else valid.push(item); });
    return {file:file.name,found:rows.length-1,valid,errors};
  }
  function renderUploadPreview() {
    if (!uploadPreview) return; $('#paaUploadPreview').innerHTML = `<div class="comparative-cards paa-upload-summary"><div><small>Registros encontrados</small><strong>${uploadPreview.found}</strong></div><div><small>Registros válidos</small><strong class="paa-ok-text">${uploadPreview.valid.length}</strong></div><div><small>Registros con errores</small><strong class="paa-error-text">${uploadPreview.errors.length}</strong></div></div>${uploadPreview.errors.length ? `<div class="table-wrap mt24"><table class="data-table"><thead><tr><th>Fila</th><th>Errores</th><th>Descripción</th><th>Partida</th></tr></thead><tbody>${uploadPreview.errors.map(item => `<tr><td>${item.row}</td><td>${escapeHtml(item.errors.join('; '))}</td><td>${escapeHtml(item.values.description)}</td><td>${escapeHtml(item.values.budgetItem)}</td></tr>`).join('')}</tbody></table></div><button class="btn btn-secondary mt24" data-paa-error-report type="button">Descargar reporte de errores</button>` : '<div class="success-box mt24">No se detectaron errores en la validación preliminar.</div>'}`; $('[data-paa-import]',modalActions).disabled = !uploadPreview.valid.length; $('[data-paa-error-report]')?.addEventListener('click',() => download('reporte-errores-paa.csv',[['Fila','Errores','Descripción','Partida'],...uploadPreview.errors.map(item => [item.row,item.errors.join('; '),item.values.description,item.values.budgetItem])].map(row => row.map(value => `"${String(value).replace(/"/g,'""')}"`).join(',')).join('\n'),'text/csv;charset=utf-8'));
  }
  function importValidUpload() {
    if (!uploadPreview?.valid?.length) return toast('No existen registros válidos para importar.'); const paa = currentPaa(); uploadPreview.valid.forEach(record => { record.paaId = paa.id; state.records.push(record); addRecordHistory(record,'Carga masiva','Registro importado desde archivo validado.'); }); state.nextRecord += uploadPreview.valid.length; addAudit('Carga masiva',`${uploadPreview.valid.length} registros válidos importados desde ${uploadPreview.file}.`,{paaId:paa.id,dependencyKey:state.dependencyKey,areaId:state.areaId}); notify('area',state.dependencyKey,`La carga masiva ${uploadPreview.file} quedó incorporada como borrador para revisión del Área Requirente.`,state.areaId); save(); closeModal(); uploadPreview=null; route('paa-dashboard');
  }

  function attachPublicAccess() {
    const button = $('#paaModuleBtn'); if (button) button.onclick = openAccess;
    const altButton = $('#paaAccessBtn'); if (altButton) altButton.onclick = openAccess;
    $('#paaResetDemo')?.addEventListener('click', () => { state = seedState(); save(); closeModal(); route(defaultRouteForRole(state.role)); });
    $('#logoutBtn')?.addEventListener('click', logoutPaa);
  }
  $('#modalClose')?.addEventListener('click', closeModal);
  modal?.addEventListener('click', event => { if (event.target === modal) closeModal(); });
  attachPublicAccess();
  if (state.active) { loginPaa(state.role,state.dependencyKey,state.areaId,state.actorName); }
})();
