(() => {
  const STORAGE = 'compramexCatalogMarketDemoV1_3';
  const $ = (s, root=document) => root.querySelector(s);
  const $$ = (s, root=document) => [...root.querySelectorAll(s)];
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
    'area':'Área Requirente / Usuario',
    'ca':'Coordinación Administrativa',
    'investigador':'Persona Investigadora de Mercado Estatal',
    'titular':'Titular del Departamento de Investigación de Mercado Estatal',
    'subdireccion':'Titular de la Subdirección de Investigación de Mercado Estatal',
    'direccion':'Titular de la Dirección de Investigación de Mercado',
    'catalogo':'Responsable del Catálogo de Bienes y Servicios',
    'auditor':'Auditor / Consulta'
  };

  const DEPENDENCIES = [
    {key:'205',sigla:'SGG',name:'Secretaría General de Gobierno',type:'Secretaría'},
    {key:'206',sigla:'SSEM',name:'Secretaría de Seguridad',type:'Secretaría'},
    {key:'207',sigla:'SF',name:'Secretaría de Finanzas',type:'Secretaría'},
    {key:'208',sigla:'SS',name:'Secretaría de Salud',type:'Secretaría'},
    {key:'209',sigla:'ST',name:'Secretaría del Trabajo',type:'Secretaría'},
    {key:'215',sigla:'SEDECO',name:'Secretaría de Desarrollo Económico',type:'Secretaría'},
    {key:'218',sigla:'SECOGEM',name:'Secretaría de la Contraloría',type:'Secretaría'},
    {key:'220',sigla:'SEMOV',name:'Secretaría de Movilidad',type:'Secretaría'},
    {key:'225',sigla:'SECAMPO',name:'Secretaría del Campo',type:'Secretaría'},
    {key:'226',sigla:'SCyT',name:'Secretaría de Cultura y Turismo',type:'Secretaría'},
    {key:'227',sigla:'SEMujeres',name:'Secretaría de las Mujeres',type:'Secretaría'},
    {key:'228',sigla:'SECTI',name:'Secretaría de Educación, Ciencia, Tecnología e Innovación',type:'Secretaría'},
    {key:'229',sigla:'SEBIEN',name:'Secretaría de Bienestar',type:'Secretaría'},
    {key:'230',sigla:'SEDUI',name:'Secretaría de Desarrollo Urbano e Infraestructura',type:'Secretaría'},
    {key:'231',sigla:'SMAyDS',name:'Secretaría del Medio Ambiente y Desarrollo Sostenible',type:'Secretaría'},
    {key:'232',sigla:'SAGUA',name:'Secretaría del Agua',type:'Secretaría'},
    {key:'233',sigla:'CJ',name:'Consejería Jurídica',type:'Consejería'},
    {key:'234',sigla:'OM',name:'Oficialía Mayor',type:'Oficialía'}
  ];
  const BASE_DEPENDENCY_ROLES = ['area','ca'];
  const OM_MARKET_ROLES = ['investigador','titular','subdireccion','direccion','catalogo','auditor'];
  const OFFICIALIA_MAYOR_KEY = '234';


  const REQUEST_DOCUMENTS = [
    {id:'docFicha',label:'Ficha técnica o documento que permita identificar el bien/servicio',required:true},
    {id:'docCatalogo',label:'Folleto, catálogo, manual u otro soporte',required:false},
    {id:'docNormas',label:'Normas, garantías, certificaciones y condiciones aplicables',required:false},
    {id:'docSpecs',label:'Especificaciones homogéneas preparadas para el Estudio de Mercado',required:true}
  ];

  const MARKET_TECHNIQUES = [
    'Consulta a precios históricos mediante modelo estadístico',
    'Solicitud de precios de mercado vía electrónica',
    'Consulta de precios de campo',
    'Segmentación de mercado',
    'Comercio electrónico',
    'Técnica de Mystery Shopper'
  ];

  const PROVIDER_REGISTRY_DEMO = [
    {id:'PAD-001',name:'Distribuidora Alfa · DEMO',rfc:'DAL260101AA1',type:'Distribuidor'},
    {id:'PAD-002',name:'Comercializadora Beta · DEMO',rfc:'CBE260101BB2',type:'Comercializador'},
    {id:'PAD-003',name:'Suministros Gamma · DEMO',rfc:'SGA260101CC3',type:'Distribuidor'},
    {id:'PAD-004',name:'Instrumentación Delta · DEMO',rfc:'IDE260101DD4',type:'Fabricante'},
    {id:'PAD-005',name:'Equipos Épsilon · DEMO',rfc:'EEP260101EE5',type:'Distribuidor'}
  ];

  let caQueue = 'received';


  const CATALOG = [
    {key:'DEMO-B-001',type:'Bien',family:'Papelería y consumibles',partida:'2111',unit:'Paquete',description:'Papel bond tamaño carta, 75 g/m², paquete de 500 hojas',price:118.40,status:'Vigente',version:3,updated:'2026-08-28'},
    {key:'DEMO-B-002',type:'Bien',family:'Equipo de cómputo',partida:'5151',unit:'Pieza',description:'Computadora portátil empresarial, 16 GB RAM, SSD 512 GB o superior',price:21950.00,status:'Vigente',version:2,updated:'2026-08-14'},
    {key:'DEMO-B-003',type:'Bien',family:'Mobiliario',partida:'5111',unit:'Pieza',description:'Silla ergonómica operativa con soporte lumbar y ajuste de altura',price:3290.00,status:'Vigente',version:4,updated:'2026-07-30'},
    {key:'DEMO-S-001',type:'Servicio',family:'Tecnologías de información',partida:'3331',unit:'Servicio',description:'Servicio de soporte técnico especializado para infraestructura de TI',price:48500.00,status:'Vigente',version:2,updated:'2026-09-01'},
    {key:'DEMO-S-002',type:'Servicio',family:'Mantenimiento',partida:'3511',unit:'Servicio',description:'Servicio de mantenimiento preventivo y correctivo de inmuebles',price:72500.00,status:'Vigente',version:1,updated:'2026-06-18'},
    {key:'DEMO-B-004',type:'Bien',family:'Limpieza',partida:'2161',unit:'Caja',description:'Toalla interdoblada de papel para manos, caja con 20 paquetes',price:640.50,status:'Vigente',version:2,updated:'2026-08-04'},
    {key:'DEMO-S-003',type:'Servicio',family:'Capacitación',partida:'3341',unit:'Curso',description:'Servicio de capacitación técnica presencial para personal institucional',price:28500.00,status:'Inactivo',version:1,updated:'2025-11-02'}
  ];

  const initialState = {
    active:false,
    role:'titular',
    dependencyKey:'234',
    selectedRequest:'CAT-2026-0421',
    selectedStudy:'EM-2026-0118',
    lastSearch:'',
    audit:[
      {when:'22/09/2026 09:12',user:'Sistema',action:'Solicitud recibida',folio:'CAT-2026-0421',detail:'Ingreso electrónico desde Coordinación Administrativa'},
      {when:'22/09/2026 09:18',user:'Titular DIME',action:'Asignación',folio:'CAT-2026-0421',detail:'Asignada a Ana Martínez'},
      {when:'22/09/2026 10:03',user:'Ana Martínez',action:'Inicio de revisión',folio:'CAT-2026-0421',detail:'Revisión de suficiencia conforme al artículo 28 del Reglamento de la Ley'}
    ],
    requests:[
      {folio:'CAT-2026-0428',dependency:'Secretaría de Desarrollo Económico',requestingArea:'Dirección de Servicios Generales · DEMO',adminCoord:'Coordinación Administrativa · DEMO',origin:'Área requirente / usuaria',unit:'Dirección de Servicios Generales · DEMO',movement:'Alta de bien',itemType:'Bien',description:'Impresora multifuncional departamental con conectividad de red',classification:'5151',unitMeasure:'Pieza',quantity:6,priority:'Normal',state:'En validación interna',code:'CAT-02',caStage:'received',investigator:'',created:'2026-09-22',version:1,art28:'Pendiente',documents:4,notes:'',duplicateHint:'',study:'',timeline:[
        {when:'22/09/2026 13:40',label:'Enviada a Coordinación Administrativa',detail:'Solicitud originada por el área usuaria/requirente'},
        {when:'22/09/2026 13:41',label:'Recibida por Coordinación Administrativa',detail:'Pendiente de toma para validación interna'}
      ]},
      {folio:'CAT-2026-0427',dependency:'Secretaría de Cultura y Turismo',requestingArea:'Dirección de Eventos · DEMO',adminCoord:'Coordinación Administrativa · DEMO',origin:'Área requirente / usuaria',unit:'Dirección de Eventos · DEMO',movement:'Alta de servicio',itemType:'Servicio',description:'Servicio integral de producción audiovisual para eventos institucionales',classification:'3691',unitMeasure:'Servicio',quantity:1,priority:'Alta',state:'En validación interna',code:'CAT-02',caStage:'validation',investigator:'',created:'2026-09-22',version:1,art28:'Pendiente',documents:3,notes:'',duplicateHint:'',study:'',timeline:[
        {when:'22/09/2026 12:15',label:'Enviada a Coordinación Administrativa',detail:'Solicitud originada por el área usuaria/requirente'},
        {when:'22/09/2026 12:28',label:'Validación interna iniciada',detail:'La Coordinación Administrativa revisa integración y documentos'}
      ]},
      {folio:'CAT-2026-0421',caStage:'sent',dependency:'Oficialía Mayor',requestingArea:'Dirección de Tecnologías y Servicios · DEMO',adminCoord:'Coordinación Administrativa · DEMO',unit:'Coordinación Administrativa',movement:'Alta de bien',itemType:'Bien',description:'Equipo de respaldo eléctrico UPS en línea de 3000 VA',classification:'5151',unitMeasure:'Pieza',quantity:18,priority:'Normal',state:'En revisión',code:'CAT-06',investigator:'Ana Martínez',created:'2026-09-22',version:1,art28:'Pendiente',documents:3,notes:'',duplicateHint:'',study:'',timeline:[
        {when:'22/09/2026 09:12',label:'Recibida',detail:'Solicitud electrónica recibida'},
        {when:'22/09/2026 09:18',label:'Asignada',detail:'Responsable: Ana Martínez'},
        {when:'22/09/2026 10:03',label:'En revisión',detail:'Validación de requisitos y anexos'}
      ]},
      {folio:'CAT-2026-0417',caStage:'sent',dependency:'Secretaría de Educación, Ciencia, Tecnología e Innovación',requestingArea:'Dirección de Recursos Materiales Educativos · DEMO',adminCoord:'Coordinación Administrativa · DEMO',unit:'Coordinación Administrativa',movement:'Actualización de bien',itemType:'Bien',description:'Papel bond tamaño carta, paquete de 500 hojas',classification:'2111',unitMeasure:'Paquete',quantity:1200,priority:'Normal',state:'En estudio de mercado',code:'CAT-10',investigator:'Luis Ortega',created:'2026-09-21',version:2,art28:'Suficiente',documents:4,notes:'Actualización de especificación y precio de referencia.',duplicateHint:'DEMO-B-001',study:'EM-2026-0118',timeline:[
        {when:'21/09/2026 08:40',label:'Recibida',detail:'Versión 2 recibida'},
        {when:'21/09/2026 09:05',label:'Asignada',detail:'Responsable: Luis Ortega'},
        {when:'21/09/2026 11:20',label:'Revisión Art. 28 del Reglamento de la Ley',detail:'Información suficiente'},
        {when:'21/09/2026 11:24',label:'En estudio de mercado',detail:'Estudio EM-2026-0118 creado'}
      ]},
      {folio:'CAT-2026-0409',caStage:'returned',dependency:'Secretaría de Salud',requestingArea:'Dirección de Servicios Generales · DEMO',adminCoord:'Coordinación Administrativa · DEMO',unit:'Coordinación Administrativa',movement:'Alta de servicio',itemType:'Servicio',description:'Servicio de mantenimiento preventivo de plantas eléctricas',classification:'3511',unitMeasure:'Servicio',quantity:1,priority:'Alta',state:'Requiere información',code:'CAT-07',investigator:'Ana Martínez',created:'2026-09-19',version:1,art28:'Insuficiente',documents:1,notes:'Falta alcance detallado, periodicidad y entregables.',duplicateHint:'',study:'',timeline:[
        {when:'19/09/2026 12:10',label:'Recibida',detail:'Solicitud electrónica recibida'},
        {when:'19/09/2026 13:05',label:'Asignada',detail:'Responsable: Ana Martínez'},
        {when:'19/09/2026 15:42',label:'Requiere información',detail:'Observaciones enviadas a Coordinación Administrativa'}
      ]},
      {folio:'CAT-2026-0392',caStage:'sent',dependency:'Secretaría del Campo',requestingArea:'Dirección de Infraestructura Rural · DEMO',adminCoord:'Coordinación Administrativa · DEMO',unit:'Coordinación Administrativa',movement:'Alta de bien',itemType:'Bien',description:'Equipo de medición portátil para calidad de agua',classification:'5621',unitMeasure:'Pieza',quantity:8,priority:'Normal',state:'Estudio concluido',code:'CAT-11',investigator:'Mariana Ruiz',created:'2026-09-16',version:1,art28:'Suficiente',documents:5,notes:'',duplicateHint:'',study:'EM-2026-0106',timeline:[
        {when:'16/09/2026 09:22',label:'Recibida',detail:'Solicitud recibida'},
        {when:'16/09/2026 10:02',label:'Asignada',detail:'Responsable: Mariana Ruiz'},
        {when:'16/09/2026 12:18',label:'En estudio de mercado',detail:'Estudio vinculado'},
        {when:'19/09/2026 16:55',label:'Estudio concluido',detail:'Precio de referencia determinado'}
      ]}
    ],
    studies:[
      {folio:'EM-2026-0118',request:'CAT-2026-0417',item:'Papel bond tamaño carta, paquete de 500 hojas',investigator:'Luis Ortega',state:'En análisis comparativo',code:'EM-09',techniques:['Solicitud de precios de mercado vía electrónica','Consulta a precios históricos mediante modelo estadístico'],reference:null,created:'2026-09-21',finalGenerated:false,logGenerated:false,exception:null,signatures:{elaboro:null,autorizo:null,reviso:null,direccion:null},sources:[
        {name:'Distribuidora Alfa · DEMO',rfc:'DAL260101AA1',type:'Distribuidor',quoted:true,unitPrice:116.80,tax:18.69,total:135.49,technical:true,comparable:true,fiscal:'Válido',controller:'No objetada',eligible:true,evidence:'Consulta asistida · DEMO'},
        {name:'Comercializadora Beta · DEMO',rfc:'CBE260101BB2',type:'Comercializador',quoted:true,unitPrice:121.40,tax:19.42,total:140.82,technical:true,comparable:true,fiscal:'Válido',controller:'No objetada',eligible:true,evidence:'Consulta asistida · DEMO'},
        {name:'Suministros Gamma · DEMO',rfc:'SGA260101CC3',type:'Distribuidor',quoted:true,unitPrice:109.50,tax:17.52,total:127.02,technical:true,comparable:false,fiscal:'Válido',controller:'No objetada',eligible:false,evidence:'Especificación distinta'}
      ],history:[{when:'21/09/2026 11:24',label:'Estudio creado'},{when:'21/09/2026 12:15',label:'Fuentes identificadas'},{when:'22/09/2026 09:10',label:'Cotizaciones recibidas'},{when:'22/09/2026 10:18',label:'En análisis comparativo'}]},
      {folio:'EM-2026-0106',request:'CAT-2026-0392',item:'Equipo de medición portátil para calidad de agua',investigator:'Mariana Ruiz',state:'Autorizado',code:'EM-21',techniques:['Segmentación de mercado','Solicitud de precios de mercado vía electrónica'],reference:18450.00,created:'2026-09-16',finalGenerated:true,logGenerated:true,exception:null,signatures:{elaboro:'Mariana Ruiz · 19/09/2026 14:08',autorizo:'Titular DIME · 19/09/2026 14:40',reviso:'Subdirección IME · 19/09/2026 15:22',direccion:'Dirección IME · 19/09/2026 16:48'},sources:[
        {name:'Instrumentación Delta · DEMO',rfc:'IDE260101DD4',type:'Fabricante',quoted:true,unitPrice:18000,tax:2880,total:20880,technical:true,comparable:true,fiscal:'Válido',controller:'No objetada',eligible:true,evidence:'Validación demostrativa'},
        {name:'Equipos Épsilon · DEMO',rfc:'EEP260101EE5',type:'Distribuidor',quoted:true,unitPrice:18900,tax:3024,total:21924,technical:true,comparable:true,fiscal:'Válido',controller:'No objetada',eligible:true,evidence:'Validación demostrativa'}
      ],history:[{when:'16/09/2026 12:18',label:'Estudio creado'},{when:'18/09/2026 13:40',label:'Cotizaciones recibidas'},{when:'19/09/2026 13:55',label:'Precio de referencia calculado'},{when:'19/09/2026 14:02',label:'Estudio final generado'},{when:'19/09/2026 16:48',label:'Cadena de firmas concluida'}]}
    ]
  };

  function clone(v){ return JSON.parse(JSON.stringify(v)); }
  function load(){ try{ return {...clone(initialState), ...JSON.parse(localStorage.getItem(STORAGE)||'{}')}; }catch(e){ return clone(initialState); } }
  let state = load();
  function save(){ localStorage.setItem(STORAGE, JSON.stringify(state)); }
  function esc(v=''){ return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function money(v){ return Number.isFinite(Number(v)) ? new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(Number(v)) : '—'; }
  function stamp(){ return new Date().toLocaleString('es-MX',{dateStyle:'medium',timeStyle:'short'}); }
  function showOnly(which){ publicView?.classList.toggle('hidden',which!=='public'); accessView?.classList.toggle('hidden',which!=='access'); workspace?.classList.toggle('hidden',which!=='workspace'); }
  function closeModal(){ modal?.classList.add('hidden'); modal?.classList.remove('wide-modal'); }
  function openModal(title,wide=false){ modalTitle.textContent=title; modal.classList.remove('hidden'); modal.classList.toggle('wide-modal',wide); }
  function toast(msg){ modalBody.innerHTML=`<p>${esc(msg)}</p>`; modalActions.innerHTML='<button class="btn btn-primary" data-cat-ok type="button">Aceptar</button>'; openModal('Información'); $('[data-cat-ok]',modalActions).onclick=closeModal; }
  function header(k,t,p){ pageHeader.innerHTML=`<span class="kicker">${esc(k)}</span><h2>${esc(t)}</h2><p>${esc(p)}</p>`; }
  function addAudit(action,folio,detail,user=ROLES[state.role]||'Sistema'){ state.audit.push({when:stamp(),user,action,folio,detail}); save(); }
  function req(f){ return state.requests.find(x=>x.folio===f); }
  function study(f){ return state.studies.find(x=>x.folio===f); }
  function requestByStudy(s){ return state.requests.find(x=>x.folio===s?.request); }
  function setSelectedRequest(f){ state.selectedRequest=f; save(); }
  function setSelectedStudy(f){ state.selectedStudy=f; save(); }
  function statusClass(s=''){ if(/Conclu|Registr|Actualiz|Autoriz|Vigente|Suficiente/.test(s)) return 'approved'; if(/Requiere|Insuf|Observ|Rechaz|Inactivo/.test(s)) return 'observed'; if(/En |Asign|Recib|Pendiente/.test(s)) return 'review'; return ''; }
  function badge(s){ return `<span class="status-badge ${statusClass(s)}">${esc(s)}</span>`; }
  function dependencyByKey(key){ return DEPENDENCIES.find(d=>d.key===String(key)) || DEPENDENCIES.find(d=>d.key===OFFICIALIA_MAYOR_KEY); }
  function activeDependency(){ return dependencyByKey(state.dependencyKey); }
  function allowedRolesForDependency(key){ return String(key)===OFFICIALIA_MAYOR_KEY ? [...BASE_DEPENDENCY_ROLES,...OM_MARKET_ROLES] : [...BASE_DEPENDENCY_ROLES]; }
  function ensureRoleAllowed(){ const allowed=allowedRolesForDependency(state.dependencyKey); if(!allowed.includes(state.role)) state.role=allowed[0]; }
  function isCentralMarketRole(){ return String(state.dependencyKey)===OFFICIALIA_MAYOR_KEY && OM_MARKET_ROLES.includes(state.role); }
  function visibleRequests(){ const dep=activeDependency(); return isCentralMarketRole()?state.requests:state.requests.filter(r=>r.dependency===dep.name); }
  function visibleStudies(){ const allowed=new Set(visibleRequests().map(r=>r.folio)); return isCentralMarketRole()?state.studies:state.studies.filter(s=>allowed.has(s.request)); }
  function dependencyLabel(d=activeDependency()){ return `${d.name} · ${d.sigla} · GEM ${d.key}`; }
  function rolesOptionsHtml(depKey,selectedRole){ return allowedRolesForDependency(depKey).map(k=>`<option value="${k}" ${k===selectedRole?'selected':''}>${esc(ROLES[k])}</option>`).join(''); }

  function openAccess(){
    state.active=true; ensureRoleAllowed(); save(); showOnly('access');
    $('#accessKicker').textContent='COMPRAMEX · Acceso institucional';
    $('#accessTitle').textContent='Catálogo de Bienes y Servicios y Estudios de Mercado';
    $('#accessDescription').textContent='Seleccione primero la dependencia y después el rol institucional. Todas las dependencias cuentan con Área Requirente / Usuario y Coordinación Administrativa; la Oficialía Mayor incorpora además los perfiles especializados del Estudio de Mercado.';
    accessPanel.innerHTML=`
      <div class="access-hierarchy"><div><span>1</span><b>Dependencia</b><small>Nivel superior de adscripción</small></div><i>→</i><div><span>2</span><b>Rol institucional</b><small>Permisos según dependencia</small></div></div>
      <label>Dependencia<select id="catalogDependencySelect">${DEPENDENCIES.map(d=>`<option value="${d.key}" ${d.key===String(state.dependencyKey)?'selected':''}>${esc(d.name)} · ${esc(d.sigla)}</option>`).join('')}</select></label>
      <label>Rol institucional<select id="catalogRoleSelect">${rolesOptionsHtml(state.dependencyKey,state.role)}</select></label>
      <div id="dependencyRoleInfo" class="dependency-role-info"></div>
      <label>Usuario de demostración<input value="USUARIO-COMPRAMEX-DEMO" readonly></label>
      <label>Contraseña de demostración<input type="password" value="demo1234"></label>
      <button class="btn btn-primary full" id="catalogLoginBtn" type="button">Ingresar al módulo</button>
      <button class="btn btn-ghost full" id="catalogBackBtn" type="button">Regresar a COMPRAMEX</button>
      <p class="micro">Catálogo de dependencias cargado desde el archivo institucional proporcionado. Prototipo Front-End: no ejecuta consultas reales a PMCP, SAT, Contraloría, correo, firma ni sistemas presupuestales.</p>`;
    const depSelect=$('#catalogDependencySelect'), roleSelect=$('#catalogRoleSelect'), info=$('#dependencyRoleInfo');
    const refreshRoles=()=>{ const depKey=depSelect.value; const allowed=allowedRolesForDependency(depKey); const keep=allowed.includes(roleSelect.value)?roleSelect.value:allowed[0]; roleSelect.innerHTML=rolesOptionsHtml(depKey,keep); const dep=dependencyByKey(depKey); info.innerHTML=depKey===OFFICIALIA_MAYOR_KEY?`<b>${esc(dep.name)}</b><span>2 roles comunes + 6 roles especializados de Investigación de Mercado, Catálogo y Auditoría.</span>`:`<b>${esc(dep.name)}</b><span>Roles disponibles: Área Requirente / Usuario y Coordinación Administrativa.</span>`; };
    depSelect.onchange=refreshRoles; refreshRoles();
    $('#catalogLoginBtn').onclick=()=>loginCatalog(roleSelect.value,depSelect.value);
    $('#catalogBackBtn').onclick=showPortal;
  }

  function showPortal(){ state.active=false; save(); showOnly('public'); window.scrollTo({top:0,behavior:'smooth'}); }

  function loginCatalog(role,dependencyKey=state.dependencyKey){
    state.active=true; state.dependencyKey=String(dependencyKey||OFFICIALIA_MAYOR_KEY); state.role=role; ensureRoleAllowed(); save(); showOnly('workspace');
    const dep=activeDependency();
    avatar.textContent=dep.sigla.charAt(0);
    userName.textContent=dep.name;
    userRole.textContent=ROLES[state.role];
    buildNav(); route(defaultRouteForRole(state.role));
  }
  function defaultRouteForRole(role){ if(role==='area') return 'cat-catalog'; if(role==='ca') return 'cat-requests'; if(role==='catalogo') return 'cat-registration'; if(role==='auditor') return 'cat-audit'; return 'cat-dashboard'; }
  function buildNav(){
    const byRole={
      area:[['cat-dashboard','Dashboard'],['cat-catalog','Consulta de catálogo'],['cat-requests','Mis solicitudes'],['cat-expedient','Expediente electrónico']],
      ca:[['cat-dashboard','Dashboard'],['cat-catalog','Consulta de catálogo'],['cat-requests','Bandeja CA'],['cat-expedient','Expediente electrónico'],['cat-reports','Reportes']],
      investigador:[['cat-dashboard','Dashboard'],['cat-catalog','Consulta de catálogo'],['cat-requests','Solicitudes'],['cat-studies','Estudios de mercado'],['cat-expedient','Expediente electrónico'],['cat-reports','Reportes']],
      titular:[['cat-dashboard','Dashboard'],['cat-catalog','Consulta de catálogo'],['cat-requests','Solicitudes'],['cat-studies','Estudios de mercado'],['cat-expedient','Expediente electrónico'],['cat-reports','Reportes']],
      subdireccion:[['cat-dashboard','Dashboard'],['cat-catalog','Consulta de catálogo'],['cat-requests','Solicitudes'],['cat-studies','Estudios de mercado'],['cat-expedient','Expediente electrónico'],['cat-reports','Reportes']],
      direccion:[['cat-dashboard','Dashboard'],['cat-catalog','Consulta de catálogo'],['cat-requests','Solicitudes'],['cat-studies','Estudios de mercado'],['cat-expedient','Expediente electrónico'],['cat-reports','Reportes']],
      catalogo:[['cat-dashboard','Dashboard'],['cat-catalog','Consulta de catálogo'],['cat-requests','Solicitudes'],['cat-studies','Estudios de mercado'],['cat-expedient','Expediente electrónico'],['cat-registration','Alta / actualización'],['cat-reports','Reportes'],['cat-audit','Bitácora']],
      auditor:[['cat-dashboard','Dashboard'],['cat-catalog','Consulta de catálogo'],['cat-requests','Solicitudes'],['cat-studies','Estudios de mercado'],['cat-expedient','Expediente electrónico'],['cat-reports','Reportes'],['cat-audit','Bitácora']]
    };
    const items=byRole[state.role]||byRole.area;
    mainNav.innerHTML=items.map(([id,label])=>`<button type="button" data-cat-route="${id}">${label}</button>`).join('');
    $$('[data-cat-route]',mainNav).forEach(b=>b.onclick=()=>route(b.dataset.catRoute));
  }
  function route(name){
    $$('[data-cat-route]',mainNav).forEach(b=>b.classList.toggle('active',b.dataset.catRoute===name));
    if(name==='cat-dashboard')renderDashboard();
    else if(name==='cat-catalog')renderCatalog();
    else if(name==='cat-requests')renderRequests();
    else if(name==='cat-request-new')renderRequestForm();
    else if(name==='cat-studies')renderStudies();
    else if(name==='cat-expedient')renderExpedient();
    else if(name==='cat-registration')renderRegistration();
    else if(name==='cat-reports')renderReports();
    else if(name==='cat-audit')renderAudit();
  }

  function renderDashboard(){
    const scopedRequests=visibleRequests(), scopedStudies=visibleStudies();
    const openReq=scopedRequests.filter(r=>!['Concluida','Registrada','Actualizada','Rechazada','Cancelada'].includes(r.state)).length;
    const info=scopedRequests.filter(r=>r.state==='Requiere información').length;
    const activeStudies=scopedStudies.filter(s=>!['Autorizado','Concluido','Cancelado'].includes(s.state)).length;
    const pendingSigns=scopedStudies.filter(s=>s.finalGenerated && !s.signatures.direccion).length;
    header('Catálogo y Estudios de Mercado','Dashboard institucional','Vista consolidada del workflow de actualización del Catálogo de Bienes y Servicios mediante Estudios de Mercado.');
    content.innerHTML=`
      <div class="module-context dependency-context"><div><b>Dependencia</b><span>${esc(dependencyLabel())}</span></div><div><b>Perfil activo</b><span>${esc(ROLES[state.role])}</span></div><div><b>Alcance</b><span>${isCentralMarketRole()?'Institucional / transversal':'Dependencia seleccionada'}</span></div><div><b>Canal</b><span>COMPRAMEX / PMCP parametrizable</span></div></div>
      <div class="stats-grid">
        <article class="stat"><span>Solicitudes abiertas</span><strong>${openReq}</strong><small>CAT-01 a CAT-20</small></article>
        <article class="stat"><span>Requieren información</span><strong>${info}</strong><small>Subsanación pendiente</small></article>
        <article class="stat"><span>Estudios activos</span><strong>${activeStudies}</strong><small>Investigación / análisis</small></article>
        <article class="stat"><span>Firmas pendientes</span><strong>${pendingSigns}</strong><small>Cadena institucional</small></article>
      </div>
      <div class="grid-2 mt24">
        <article class="card"><span class="kicker">Macroproceso</span><h3>Flujo de punta a punta</h3>${macroFlowHtml()}<div class="actions"><button class="btn btn-primary" data-go="cat-requests">Abrir solicitudes</button><button class="btn btn-secondary" data-go="cat-studies">Abrir estudios</button></div></article>
        <article class="card"><span class="kicker">Control de trabajo</span><h3>Solicitudes recientes</h3>${miniRequestsTable(scopedRequests.slice(0,4))}</article>
      </div>
      <div class="grid-2 mt24">
        <article class="card"><span class="kicker">Reglas rectoras</span><h3>Compuertas funcionales</h3><ul class="clean-list cat-rules"><li>Consulta previa obligatoria antes de solicitar alta.</li><li>La solicitud se origina en el área usuaria/requirente y pasa por la Coordinación Administrativa antes de Recursos Materiales.</li><li>Solicitud incompleta no avanza y se devuelve para complemento.</li><li>Fuentes excluidas permanecen en el expediente, pero no computan.</li><li>Precio ordinario requiere al menos dos cotizaciones elegibles y comparables.</li><li>Las firmas siguen secuencia: Elaboró → Autorizó → Revisó → Dirección.</li></ul></article>
        <article class="card"><span class="kicker">Trazabilidad</span><h3>Últimos eventos</h3><div class="timeline">${state.audit.slice(-5).reverse().map(a=>`<div class="timeline-item current"><span class="timeline-dot"></span><div><strong>${esc(a.action)} · ${esc(a.folio)}</strong><small>${esc(a.user)} · ${esc(a.when)}<br>${esc(a.detail)}</small></div></div>`).join('')}</div></article>
      </div>`;
    $$('[data-go]',content).forEach(b=>b.onclick=()=>route(b.dataset.go));
    bindRequestLinks(content);
  }

  function macroFlowHtml(){
    const steps=['Consulta catálogo','Área requirente: solicitud','Coordinación Administrativa: validación','Recursos Materiales: recepción','Revisión Art. 28 del Reglamento de la Ley','Estudio de mercado','Fuentes y cotizaciones','Cuadro comparativo','Firmas','Registro / actualización'];
    return `<div class="cat-flow">${steps.map((s,i)=>`<div class="cat-flow-step"><b>${i+1}</b><span>${esc(s)}</span></div>${i<steps.length-1?'<i>→</i>':''}`).join('')}</div>`;
  }
  function miniRequestsTable(rows){ return `<div class="table-wrap"><table class="data-table"><thead><tr><th>Folio</th><th>Movimiento</th><th>Estado</th></tr></thead><tbody>${rows.map(r=>`<tr><td><button class="link-btn" data-open-request="${esc(r.folio)}">${esc(r.folio)}</button></td><td>${esc(r.movement)}</td><td>${badge(r.state)}</td></tr>`).join('')}</tbody></table></div>`; }
  function bindRequestLinks(root){ $$('[data-open-request]',root).forEach(b=>b.onclick=()=>openRequestDetail(b.dataset.openRequest)); }

  function renderCatalog(){
    header('Catálogo de Bienes y Servicios','Consulta obligatoria','Busque por clave, descripción, palabra, familia, partida o unidad. Sólo registros vigentes pueden seleccionarse para nuevos requerimientos.');
    const createAction=state.role==='area'?'<button class="btn btn-primary" data-new-request type="button">Solicitar alta / actualización</button>':'<span class="status-badge">La solicitud se origina en el área requirente</span>';
    content.innerHTML=`
      <div class="card">
        <div class="section-heading compact"><div><span class="kicker">UI-01</span><h3>Búsqueda avanzada</h3></div><div class="actions">${createAction}</div></div>
        <div class="validation-banner routing"><b>Canal institucional del prototipo:</b> Área usuaria/requirente → Coordinación Administrativa → Recursos Materiales → Investigación de Mercado. El área usuaria no puede enviar directamente a la Oficialía Mayor.</div>
        <div class="catalog-filters"><label class="span2">Clave, descripción o palabra<input id="catalogQuery" value="${esc(state.lastSearch)}" placeholder="Ej. papel, soporte técnico, DEMO-B-001"></label><label>Tipo<select id="catalogType"><option value="">Todos</option><option>Bien</option><option>Servicio</option></select></label><label>Partida<input id="catalogPartida" placeholder="Ej. 2111"></label></div>
        <div class="actions"><button class="btn btn-secondary" id="catalogSearchBtn">Buscar</button><button class="btn btn-ghost" id="catalogClearBtn">Limpiar</button></div>
      </div>
      <div id="catalogResults" class="mt24"></div>`;
    $('[data-new-request]',content)?.addEventListener('click',()=>{state.lastSearch=$('#catalogQuery').value;save();route('cat-request-new');});
    $('#catalogSearchBtn').onclick=applyCatalogSearch;
    $('#catalogClearBtn').onclick=()=>{ $('#catalogQuery').value=''; $('#catalogType').value=''; $('#catalogPartida').value=''; applyCatalogSearch(); };
    applyCatalogSearch();
  }
  function applyCatalogSearch(){
    const q=($('#catalogQuery')?.value||'').trim().toLowerCase(), type=$('#catalogType')?.value||'', p=($('#catalogPartida')?.value||'').trim();
    state.lastSearch=q; save();
    const rows=CATALOG.filter(x=>(!q||[x.key,x.description,x.family,x.unit].join(' ').toLowerCase().includes(q))&&(!type||x.type===type)&&(!p||x.partida.includes(p)));
    const box=$('#catalogResults'); if(!box)return;
    box.innerHTML=`<article class="card"><div class="card-head"><div><span class="kicker">Resultados</span><h3>${rows.length} registro(s)</h3></div><span class="status-badge">Consulta DEMO</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Clave</th><th>Tipo</th><th>Descripción</th><th>Partida</th><th>Unidad</th><th>Precio ref.</th><th>Estado</th><th></th></tr></thead><tbody>${rows.map(x=>`<tr><td><b>${esc(x.key)}</b></td><td>${esc(x.type)}</td><td>${esc(x.description)}</td><td>${esc(x.partida)}</td><td>${esc(x.unit)}</td><td>${money(x.price)}</td><td>${badge(x.status)}</td><td><button class="btn btn-ghost btn-small" data-cat-detail="${x.key}">Ver ficha</button></td></tr>`).join('')||'<tr><td colspan="8">No se localizaron coincidencias.</td></tr>'}</tbody></table></div>${rows.length===0?'<div class="validation-banner warning">No se localizó una clave coincidente. Puede iniciar una solicitud de alta justificando la nueva incorporación al catálogo.</div>':''}</article>`;
    $$('[data-cat-detail]',box).forEach(b=>b.onclick=()=>openCatalogDetail(b.dataset.catDetail));
  }
  function openCatalogDetail(key){
    const x=CATALOG.find(c=>c.key===key); if(!x)return;
    modalBody.innerHTML=`<div class="detail-grid"><div><small>Clave</small><strong>${esc(x.key)}</strong></div><div><small>Estado</small><strong>${esc(x.status)}</strong></div><div><small>Tipo</small><strong>${esc(x.type)}</strong></div><div><small>Familia</small><strong>${esc(x.family)}</strong></div><div><small>Partida</small><strong>${esc(x.partida)}</strong></div><div><small>Unidad</small><strong>${esc(x.unit)}</strong></div><div class="span2"><small>Descripción vigente</small><strong>${esc(x.description)}</strong></div><div><small>Precio de referencia</small><strong>${money(x.price)}</strong></div><div><small>Versión</small><strong>${x.version}</strong></div><div><small>Última actualización</small><strong>${esc(x.updated)}</strong></div></div>`;
    modalActions.innerHTML=`<button class="btn btn-secondary" data-close>Cancelar</button><button class="btn btn-primary" data-update>Solicitar actualización</button>`; openModal('Ficha vigente del Catálogo',true);
    $('[data-close]',modalActions).onclick=closeModal; $('[data-update]',modalActions).onclick=()=>{closeModal();state.lastSearch=x.key;state.prefillCatalogKey=x.key;save();route('cat-request-new');};
  }

  function requestDocumentsEditorHtml(){
    return `<div class="document-upload-grid">${REQUEST_DOCUMENTS.map(d=>`<article class="document-upload-card" data-doc-card="${d.id}">
      <div class="document-upload-title"><b>${esc(d.label)}</b>${d.required?'<span class="required-chip">Requerido</span>':'<span class="optional-chip">Complementario</span>'}</div>
      <div class="document-presence" aria-label="Indicar si el documento está integrado">
        <span>¿Se cuenta con el documento?</span>
        <label class="presence-option"><input type="radio" name="${d.id}Status" value="si"> Sí</label>
        <label class="presence-option"><input type="radio" name="${d.id}Status" value="no" checked> No</label>
      </div>
      <label class="document-file-control">Subir documento<input data-doc-file="${d.id}" type="file" name="${d.id}File" accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png"></label>
      <small class="file-selection" data-file-label>Sin archivo seleccionado</small>
    </article>`).join('')}</div>`;
  }

  function collectRequestDocuments(form){
    return REQUEST_DOCUMENTS.map(d=>{
      const status=form.elements[`${d.id}Status`]?.value||'no';
      const input=form.elements[`${d.id}File`];
      const file=input?.files?.[0]||null;
      return {id:d.id,label:d.label,required:d.required,present:status==='si',filename:file?.name||'',size:file?.size||0};
    });
  }

  function requestDocumentsHtml(r){
    if(!Array.isArray(r.documentDetails)||!r.documentDetails.length){
      return `<div class="validation-banner"><b>Documentos integrados:</b> ${Number(r.documents||0)}. El detalle de archivos no está disponible para este registro demostrativo precargado.</div>`;
    }
    return `<div class="request-document-list">${r.documentDetails.map(d=>`<div class="request-document-row"><div><b>${esc(d.label)}</b><small>${d.filename?esc(d.filename):'Sin archivo cargado'}</small></div>${badge(d.present&&d.filename?'Integrado':'No integrado')}</div>`).join('')}</div>`;
  }

  function renderRequestForm(){
    if(state.role!=='area'){
      header('Solicitud de Catálogo','Origen de la solicitud','Las solicitudes de alta o actualización deben originarse en el área usuaria o requirente y enviarse primero a la Coordinación Administrativa.');
      content.innerHTML=`<article class="card"><span class="kicker">Control de canal</span><h3>La creación de solicitudes está reservada al área usuaria/requirente</h3><p>La Coordinación Administrativa recibe, valida y remite a Recursos Materiales. No existe envío directo del área usuaria a la Oficialía Mayor.</p><div class="routing-flow"><span>Área usuaria / requirente</span><b>→</b><span>Coordinación Administrativa</span><b>→</b><span>Recursos Materiales</span></div><div class="actions mt24"><button class="btn btn-secondary" data-back-requests>Volver a solicitudes</button></div></article>`;
      $('[data-back-requests]',content).onclick=()=>route('cat-requests');
      return;
    }
    header('Solicitud de Catálogo','Alta / actualización','Integre la solicitud del área usuaria/requirente. La solicitud se enviará primero a la Coordinación Administrativa para validación antes de su remisión a Recursos Materiales.');
    const pre=CATALOG.find(x=>x.key===state.prefillCatalogKey);
    content.innerHTML=`<form class="card" id="catalogRequestForm">
      <div class="card-head"><div><span class="kicker">UI-02</span><h3>Nueva solicitud del área requirente</h3></div><span class="status-badge">Borrador</span></div>
      <div class="validation-banner routing"><b>Ruta obligatoria:</b> Área usuaria/requirente → Coordinación Administrativa → Recursos Materiales. Esta pantalla no permite envío directo a la Oficialía Mayor.</div>
      <div class="validation-banner ${state.lastSearch?'ok':'warning'}"><b>Consulta previa:</b> ${state.lastSearch?'Se registró una búsqueda previa en el Catálogo.':'Antes del envío debe realizarse una búsqueda previa del Catálogo.'}</div>
      <div class="form-grid cols2 mt24">
        <label>Dependencia<input name="dependency" value="${esc(activeDependency().name)}" readonly required></label>
        <label>Área usuaria / requirente<input name="requestingArea" value="Dirección usuaria · DEMO" required></label>
        <label>Coordinación Administrativa receptora<input name="adminCoord" value="Coordinación Administrativa · DEMO" required></label>
        <label>Movimiento<select name="movement"><option ${pre?'':'selected'}>Alta de bien</option><option>Alta de servicio</option><option ${pre?'selected':''}>Actualización de bien</option><option>Actualización de servicio</option></select></label>
        <label>Tipo<select name="itemType"><option ${pre?.type==='Servicio'?'':'selected'}>Bien</option><option ${pre?.type==='Servicio'?'selected':''}>Servicio</option></select></label>
        <label>Clave existente, si aplica<input name="existingKey" value="${esc(pre?.key||'')}" placeholder="Sólo actualización"></label>
        <label class="span2">Descripción en prosa / objeto del servicio<textarea name="description" rows="3" required>${esc(pre?.description||'')}</textarea></label>
        <label class="span2">Características técnicas, alcance y entregables<textarea name="specs" rows="4" required placeholder="Especificación suficiente para identificar y comparar homogéneamente el bien o servicio"></textarea></label>
        <label>Partida / clasificador<input name="classification" value="${esc(pre?.partida||'')}" required></label>
        <label>Unidad de medida / presentación<input name="unitMeasure" value="${esc(pre?.unit||'Pieza')}" required></label>
        <label>Cantidad requerida<input name="quantity" type="number" min="1" value="1" required></label>
        <label>Prioridad<select name="priority"><option>Normal</option><option>Alta</option></select></label>
        <label class="span2">Justificación de alta / actualización<textarea name="justification" rows="3" required></textarea></label>
      </div>
      <div class="subhead">Documentos y suficiencia · Art. 28 del Reglamento de la Ley</div>
      <p class="section-help">Indique expresamente si se cuenta o no con cada documento y, cuando corresponda, seleccione el archivo que se integrará al expediente electrónico.</p>
      ${requestDocumentsEditorHtml()}
      <div id="duplicateBox"></div>
      <div class="actions mt24"><button class="btn btn-secondary" type="button" data-back-requests>Cancelar</button><button class="btn btn-primary" type="submit">Enviar a Coordinación Administrativa</button></div>
    </form>`;
    const form=$('#catalogRequestForm');
    form.elements.description.addEventListener('input',()=>renderDuplicateHint(form));
    $$('[data-doc-file]',form).forEach(input=>input.addEventListener('change',()=>{
      const card=input.closest('[data-doc-card]');
      const id=input.dataset.docFile;
      const filename=input.files?.[0]?.name||'';
      if(filename) card.querySelector(`input[name="${id}Status"][value="si"]`).checked=true;
      card.querySelector('[data-file-label]').textContent=filename||'Sin archivo seleccionado';
    }));
    $('[data-back-requests]',form).onclick=()=>route('cat-requests');
    form.onsubmit=e=>{e.preventDefault();submitRequest(form);};
    renderDuplicateHint(form);
  }
  function renderDuplicateHint(form){
    const text=(form.elements.description.value||'').toLowerCase(); const words=text.split(/\s+/).filter(w=>w.length>4);
    const hits=CATALOG.filter(c=>words.some(w=>c.description.toLowerCase().includes(w))).slice(0,3); const box=$('#duplicateBox'); if(!box)return;
    box.innerHTML=hits.length?`<div class="validation-banner warning"><b>Posibles coincidencias:</b> ${hits.map(h=>`${esc(h.key)} · ${esc(h.description)}`).join('<br>')}<br><small>La coincidencia no bloquea el borrador, pero antes de crear un alta debe seleccionarse una clave existente o justificarse la nueva alta.</small></div>`:`<div class="validation-banner ok"><b>Control de duplicidad:</b> no se identificaron coincidencias evidentes con los datos capturados.</div>`;
  }
  function submitRequest(form){
    if(state.role!=='area'){ toast('La solicitud debe originarse en el área usuaria o requirente.'); return; }
    if(!state.lastSearch){ toast('Realice primero una consulta del Catálogo. La consulta previa es obligatoria antes de una nueva alta.'); return; }
    const f=new FormData(form); const missing=['dependency','requestingArea','adminCoord','description','specs','classification','unitMeasure','quantity','justification'].filter(k=>!String(f.get(k)||'').trim());
    if(missing.length){ toast('No es posible enviar la solicitud. Complete las especificaciones y datos requeridos.'); return; }
    const docs=collectRequestDocuments(form);
    const markedWithoutFile=docs.filter(d=>d.present&&!d.filename);
    if(markedWithoutFile.length){ toast(`Los documentos marcados como “Sí” deben tener un archivo seleccionado: ${markedWithoutFile.map(d=>d.label).join('; ')}.`); return; }
    const requiredMissing=docs.filter(d=>d.required&&(!d.present||!d.filename));
    if(requiredMissing.length){ toast('No es posible enviar la solicitud. Integre la ficha técnica/documento de identificación y las especificaciones requeridas por el Art. 28 del Reglamento de la Ley.'); return; }
    const n=420+state.requests.length+2; const folio=`CAT-2026-0${n}`;
    const record={folio,dependency:f.get('dependency'),requestingArea:f.get('requestingArea'),adminCoord:f.get('adminCoord'),origin:'Área requirente / usuaria',unit:f.get('requestingArea'),movement:f.get('movement'),itemType:f.get('itemType'),description:f.get('description'),classification:f.get('classification'),unitMeasure:f.get('unitMeasure'),quantity:Number(f.get('quantity')),priority:f.get('priority'),state:'En validación interna',code:'CAT-02',caStage:'received',investigator:'',created:new Date().toISOString().slice(0,10),version:1,art28:'Pendiente',documents:docs.filter(d=>d.present&&d.filename).length,documentDetails:docs,notes:'',duplicateHint:f.get('existingKey')||'',study:'',timeline:[{when:stamp(),label:'Enviada a Coordinación Administrativa',detail:`Origen: ${f.get('requestingArea')} · Pendiente de validación interna`} ]};
    state.requests.unshift(record); state.selectedRequest=folio; state.prefillCatalogKey=''; addAudit('Solicitud enviada a Coordinación Administrativa',folio,'Solicitud originada por el área usuaria/requirente; aún no ha sido remitida a Recursos Materiales',ROLES.area); save(); openRequestDetail(folio);
  }

  function caBucket(r){
    if(r.caStage==='received') return 'received';
    if(r.caStage==='validation') return 'validation';
    if(r.caStage==='returned'||r.state==='Requiere información') return 'returned';
    if(r.caStage==='sent') return 'sent';
    if(r.state==='En validación interna') return 'validation';
    if(['Recibida','Subsanada','Asignada','En revisión','En estudio de mercado','Estudio concluido','En registro','Registrada','Actualizada','Asociada a clave existente','Concluida'].includes(r.state)) return 'sent';
    return 'sent';
  }

  function caQueueLabel(bucket){
    return ({received:'Recibidas del área requirente',validation:'Para validar',returned:'Devueltas',sent:'Enviadas a Recursos Materiales'})[bucket]||'Bandeja';
  }

  function renderCaQueueTabs(){
    const buckets=['received','validation','returned','sent'];
    const meta={
      received:{short:'Recibidas',help:'Ingresaron desde el área usuaria/requirente y aún no se toma la validación.'},
      validation:{short:'Para validar',help:'La Coordinación Administrativa está revisando integración y documentos.'},
      returned:{short:'Devueltas',help:'Recibieron observaciones y requieren gestión con el área usuaria/requirente.'},
      sent:{short:'Enviadas a Recursos Materiales',help:'Ya fueron validadas por la Coordinación Administrativa y remitidas.'}
    };
    return `<div class="ca-inbox" role="tablist" aria-label="Bandeja de Coordinación Administrativa">${buckets.map(b=>{
      const count=visibleRequests().filter(r=>caBucket(r)===b).length;
      return `<button type="button" class="ca-inbox-tab ${caQueue===b?'active':''}" data-ca-queue="${b}" role="tab" aria-selected="${caQueue===b?'true':'false'}"><span>${esc(meta[b].short)}</span><strong>${count}</strong><small>${esc(meta[b].help)}</small></button>`;
    }).join('')}</div>`;
  }

  function renderRequests(){
    const isCa=state.role==='ca';
    header('Solicitudes de Catálogo',isCa?'Bandeja de Coordinación Administrativa':'Bandeja y seguimiento',isCa?'Controle la recepción, validación, devoluciones y remisión a Recursos Materiales desde una sola bandeja operativa.':'Consulte solicitudes por folio, dependencia, movimiento, responsable, estado y antigüedad. El canal de envío se controla por perfil.');
    const action=state.role==='area'?'<button class="btn btn-primary" data-new-request>Crear solicitud</button>':isCa?'<span class="status-badge">Control previo a Recursos Materiales</span>':'<span class="status-badge">Consulta institucional</span>';
    content.innerHTML=`<div class="card"><div class="section-heading compact"><div><span class="kicker">UI-03 / UI-04</span><h3>${isCa?'Bandeja de la Coordinación Administrativa':'Bandeja de solicitudes'}</h3></div>${action}</div>
      <div class="validation-banner routing"><b>Ruta de la solicitud:</b> Área usuaria/requirente → Coordinación Administrativa → Recursos Materiales → Departamento de Investigación de Mercado Estatal.</div>
      ${isCa?`<p class="section-help">La Coordinación Administrativa es la compuerta previa: recibe de las áreas usuarias, valida la integración, gestiona devoluciones y sólo después remite a Recursos Materiales.</p>${renderCaQueueTabs()}`:''}
      <div class="catalog-filters"><label class="span2">Buscar<input id="reqSearch" placeholder="Folio, dependencia, área requirente o descripción"></label><label>Estado<select id="reqState"><option value="">Todos</option>${[...new Set(visibleRequests().map(r=>r.state))].map(s=>`<option>${esc(s)}</option>`).join('')}</select></label><label>Investigador<select id="reqInvestigator"><option value="">Todos</option>${[...new Set(visibleRequests().map(r=>r.investigator).filter(Boolean))].map(s=>`<option>${esc(s)}</option>`).join('')}</select></label></div></div><div id="requestTable" class="mt24"></div>`;
    $('[data-new-request]',content)?.addEventListener('click',()=>route('cat-request-new'));
    $$('[data-ca-queue]',content).forEach(btn=>btn.addEventListener('click',()=>{caQueue=btn.dataset.caQueue;renderRequests();}));
    $('#reqSearch').oninput=applyRequestFilters; $('#reqState').onchange=applyRequestFilters; $('#reqInvestigator').onchange=applyRequestFilters; applyRequestFilters();
  }

  function applyRequestFilters(){
    const q=($('#reqSearch')?.value||'').toLowerCase(), s=$('#reqState')?.value||'', i=$('#reqInvestigator')?.value||'';
    let rows=visibleRequests().filter(r=>(!q||[r.folio,r.dependency,r.requestingArea,r.description,r.movement].join(' ').toLowerCase().includes(q))&&(!s||r.state===s)&&(!i||r.investigator===i));
    if(state.role==='ca') rows=rows.filter(r=>caBucket(r)===caQueue);
    const empty=state.role==='ca'?`No hay solicitudes en “${caQueueLabel(caQueue)}” con los filtros seleccionados.`:'No se localizaron solicitudes con los filtros seleccionados.';
    const tableHead=state.role==='ca'?'<tr><th>Folio</th><th>Área usuaria / requirente</th><th>Movimiento</th><th>Descripción</th><th>Etapa CA</th><th>Estado general</th><th></th></tr>':'<tr><th>Folio</th><th>Dependencia</th><th>Movimiento</th><th>Descripción</th><th>Responsable</th><th>Estado</th><th></th></tr>';
    const tableRows=rows.map(r=>state.role==='ca'?`<tr><td><b>${esc(r.folio)}</b><small>${esc(r.created)}</small></td><td><b>${esc(r.requestingArea||r.unit||'Área requirente · DEMO')}</b><small>${esc(r.dependency)}</small></td><td>${esc(r.movement)}</td><td>${esc(r.description)}</td><td><span class="ca-stage-pill ${caBucket(r)}">${esc(caQueueLabel(caBucket(r)))}</span></td><td>${badge(r.state)}</td><td><button class="btn btn-ghost btn-small" data-open-request="${r.folio}">Abrir</button></td></tr>`:`<tr><td><b>${esc(r.folio)}</b><small>${esc(r.created)}</small></td><td>${esc(r.dependency)}</td><td>${esc(r.movement)}</td><td>${esc(r.description)}</td><td>${esc(r.investigator||'Sin asignar')}</td><td>${badge(r.state)}</td><td><button class="btn btn-ghost btn-small" data-open-request="${r.folio}">Abrir</button></td></tr>`).join('');
    $('#requestTable').innerHTML=`<article class="card"><div class="card-head"><div><span class="kicker">${state.role==='ca'?'Coordinación Administrativa':'Seguimiento'}</span><h3>${state.role==='ca'?esc(caQueueLabel(caQueue)):`${rows.length} solicitud(es)`}</h3></div><span class="status-badge">${rows.length} registro(s)</span></div><div class="table-wrap"><table class="data-table"><thead>${tableHead}</thead><tbody>${tableRows||`<tr><td colspan="7"><div class="empty-queue">${esc(empty)}</div></td></tr>`}</tbody></table></div></article>`; bindRequestLinks($('#requestTable'));
  }

  function openRequestDetail(folio){
    const r=req(folio); if(!r)return; setSelectedRequest(folio);
    const actions=[];
    if(state.role==='ca' && caBucket(r)==='received') actions.push(`<button class="btn btn-secondary" data-start-ca-review>Iniciar validación</button>`);
    if(state.role==='ca' && caBucket(r)==='validation') actions.push(`<button class="btn btn-primary" data-forward-ca>Validar y remitir a Recursos Materiales</button>`);
    if(state.role==='titular' && ['Recibida','Subsanada'].includes(r.state)) actions.push(`<button class="btn btn-primary" data-assign>Asignar investigador</button>`);
    if(state.role==='investigador' && ['Asignada','En revisión'].includes(r.state)) actions.push(`<button class="btn btn-primary" data-art28>Revisar Art. 28 del Reglamento de la Ley</button>`);
    if(state.role==='area' && r.state==='Requiere información') actions.push(`<button class="btn btn-primary" data-remedy>Subsanar y reenviar a Coordinación Administrativa</button>`);
    if(r.study) actions.push(`<button class="btn btn-secondary" data-open-study="${r.study}">Abrir estudio</button>`);
    modalBody.innerHTML=`<div class="detail-grid"><div><small>Folio</small><strong>${esc(r.folio)}</strong></div><div><small>Estado</small><strong>${esc(r.state)}</strong></div>${state.role==='ca'?`<div><small>Etapa en Coordinación Administrativa</small><strong>${esc(caQueueLabel(caBucket(r)))}</strong></div>`:''}<div><small>Dependencia</small><strong>${esc(r.dependency)}</strong></div><div><small>Área usuaria / requirente</small><strong>${esc(r.requestingArea||'Área usuaria/requirente · DEMO')}</strong></div><div><small>Coordinación Administrativa</small><strong>${esc(r.adminCoord||'Coordinación Administrativa · DEMO')}</strong></div><div><small>Movimiento</small><strong>${esc(r.movement)}</strong></div><div><small>Investigador</small><strong>${esc(r.investigator||'Sin asignar')}</strong></div><div><small>Versión</small><strong>${r.version}</strong></div><div class="span2"><small>Descripción</small><strong>${esc(r.description)}</strong></div><div><small>Partida</small><strong>${esc(r.classification)}</strong></div><div><small>Unidad / cantidad</small><strong>${esc(r.unitMeasure)} · ${r.quantity}</strong></div><div><small>Revisión Art. 28 del Reglamento de la Ley</small><strong>${esc(r.art28)}</strong></div><div><small>Documentos</small><strong>${r.documents} integrado(s)</strong></div>${r.notes?`<div class="span2"><small>Observaciones</small><strong>${esc(r.notes)}</strong></div>`:''}</div>
      <div class="subhead">Documentos y suficiencia · Art. 28 del Reglamento de la Ley</div>${requestDocumentsHtml(r)}
      <div class="subhead">Trazabilidad</div><div class="timeline">${r.timeline.map((t,idx)=>`<div class="timeline-item ${idx===r.timeline.length-1?'current':'done'}"><span class="timeline-dot"></span><div><strong>${esc(t.label)}</strong><small>${esc(t.when)} · ${esc(t.detail)}</small></div></div>`).join('')}</div>`;
    modalActions.innerHTML=`<button class="btn btn-ghost" data-close>Volver</button>${actions.join('')}`; openModal(`Expediente ${folio}`,true);
    $('[data-close]',modalActions).onclick=closeModal;
    $('[data-start-ca-review]',modalActions)?.addEventListener('click',()=>{
      r.caStage='validation';
      r.timeline.push({when:stamp(),label:'Validación interna iniciada',detail:'La Coordinación Administrativa toma la solicitud para revisar integración, documentos y canal institucional'});
      addAudit('Inicio de validación CA',r.folio,'La Coordinación Administrativa inició la revisión previa a Recursos Materiales.',ROLES.ca); save(); closeModal(); caQueue='validation'; renderRequests();
    });
    $('[data-forward-ca]',modalActions)?.addEventListener('click',()=>{
      r.state='Recibida'; r.code='CAT-04'; r.caStage='sent';
      r.timeline.push({when:stamp(),label:'Validada por Coordinación Administrativa',detail:'Integración revisada antes de remitir a Recursos Materiales'});
      r.timeline.push({when:stamp(),label:'Recibida en Recursos Materiales',detail:'Remisión institucional realizada por la Coordinación Administrativa'});
      addAudit('Remisión a Recursos Materiales',r.folio,'La Coordinación Administrativa validó y remitió la solicitud. No hubo envío directo del área requirente a la Oficialía Mayor.',ROLES.ca); save(); closeModal(); renderRequests();
    });
    $('[data-assign]',modalActions)?.addEventListener('click',()=>openAssignModal(r));
    $('[data-art28]',modalActions)?.addEventListener('click',()=>openArt28Modal(r));
    $('[data-remedy]',modalActions)?.addEventListener('click',()=>{r.version++;r.state='En validación interna';r.code='CAT-02';r.caStage='received';r.art28='Pendiente';r.timeline.push({when:stamp(),label:'Reenviada a Coordinación Administrativa',detail:`Versión ${r.version} reenviada por el área usuaria/requirente para nueva validación interna`});addAudit('Subsanación reenviada a Coordinación Administrativa',r.folio,`Versión ${r.version}`,ROLES.area);save();closeModal();renderRequests();});
    $$('[data-open-study]',modalActions).forEach(b=>b.onclick=()=>{closeModal();setSelectedStudy(b.dataset.openStudy);route('cat-studies');setTimeout(()=>openStudyDetail(b.dataset.openStudy),50);});
  }
  function openAssignModal(r){
    modalBody.innerHTML=`<p>Seleccione la persona investigadora responsable. La asignación queda registrada en la bitácora.</p><label>Investigador<select id="assignInvestigator"><option>Ana Martínez</option><option>Luis Ortega</option><option>Mariana Ruiz</option><option>Jorge Salgado</option></select></label>`;
    modalActions.innerHTML='<button class="btn btn-secondary" data-close>Cancelar</button><button class="btn btn-primary" data-save-assign>Asignar</button>'; openModal(`Asignar ${r.folio}`);
    $('[data-close]',modalActions).onclick=closeModal; $('[data-save-assign]',modalActions).onclick=()=>{r.investigator=$('#assignInvestigator').value;r.state='Asignada';r.code='CAT-05';r.timeline.push({when:stamp(),label:'Asignada',detail:`Responsable: ${r.investigator}`});addAudit('Solicitud asignada',r.folio,`Responsable: ${r.investigator}`);save();closeModal();renderRequests();};
  }
  function openArt28Modal(r){
    modalBody.innerHTML=`<p><b>Art. 28 del Reglamento de la Ley.</b> Checklist de suficiencia para determinar si la solicitud puede avanzar al Estudio de Mercado.</p><div class="review-checklist"><label class="review-check"><input type="checkbox" data-a28 checked><span>Descripción en prosa suficiente</span></label><label class="review-check"><input type="checkbox" data-a28 checked><span>Características técnicas / alcance</span></label><label class="review-check"><input type="checkbox" data-a28 checked><span>Unidad de medida / presentación</span></label><label class="review-check"><input type="checkbox" data-a28 checked><span>Garantías, normas o certificaciones aplicables</span></label><label class="review-check"><input type="checkbox" data-a28 checked><span>Sin marcas/modelos restrictivos sin justificación</span></label><label class="review-check"><input type="checkbox" data-a28 ${r.documents>=2?'checked':''}><span>Documentación soporte suficiente</span></label></div><label class="reassign-reason">Observaciones<textarea id="art28Notes" rows="3">${esc(r.notes||'')}</textarea></label>`;
    modalActions.innerHTML='<button class="btn btn-warning" data-insufficient>Requiere información</button><button class="btn btn-primary" data-sufficient>Información suficiente</button>'; openModal('Revisión Art. 28 del Reglamento de la Ley',true);
    $('[data-insufficient]',modalActions).onclick=()=>{r.art28='Insuficiente';r.state='Requiere información';r.code='CAT-07';r.caStage='returned';r.notes=$('#art28Notes').value||'Se requiere complementar información técnica o documental.';r.timeline.push({when:stamp(),label:'Requiere información',detail:`${r.notes} · Se canaliza a la Coordinación Administrativa para gestión con el área requirente.`});addAudit('Requiere información',r.folio,r.notes);save();closeModal();renderRequests();};
    $('[data-sufficient]',modalActions).onclick=()=>{ if($$('[data-a28]',modalBody).some(c=>!c.checked)){toast('El checklist contiene elementos pendientes. Marque todos los controles o devuelva la solicitud para complemento.');return;} r.art28='Suficiente'; r.state='En estudio de mercado'; r.code='CAT-10'; r.caStage='sent'; const f=`EM-2026-${String(120+state.studies.length).padStart(4,'0')}`; r.study=f; r.timeline.push({when:stamp(),label:'En estudio de mercado',detail:`Estudio ${f} creado`}); state.studies.unshift({folio:f,request:r.folio,item:r.description,investigator:r.investigator||'Investigador DEMO',state:'En integración',code:'EM-03',techniques:[],reference:null,created:new Date().toISOString().slice(0,10),finalGenerated:false,logGenerated:false,exception:null,signatures:{elaboro:null,autorizo:null,reviso:null,direccion:null},sources:[],history:[{when:stamp(),label:'Estudio creado'}]}); addAudit('Estudio de Mercado creado',f,`Vinculado a ${r.folio}`);save();closeModal();setSelectedStudy(f);route('cat-studies');};
  }

  function renderStudies(){
    header('Estudios de Mercado','Investigación, validación y precio de referencia','Gestione técnicas de investigación, fuentes, solicitudes de cotización, validaciones, análisis comparativo, documentos derivados y firmas.');
    const rows=visibleStudies();
    content.innerHTML=`<div class="card"><div class="card-head"><div><span class="kicker">UI-06 a UI-15</span><h3>Estudios vinculados</h3></div><span class="status-badge">${rows.length} estudio(s)</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Folio</th><th>Solicitud</th><th>Bien / servicio</th><th>Investigador</th><th>Estado</th><th>Precio ref.</th><th></th></tr></thead><tbody>${rows.map(s=>`<tr><td><b>${esc(s.folio)}</b></td><td>${esc(s.request)}</td><td>${esc(s.item)}</td><td>${esc(s.investigator)}</td><td>${badge(s.state)}</td><td>${money(s.reference)}</td><td><button class="btn btn-ghost btn-small" data-open-study="${s.folio}">Abrir</button></td></tr>`).join('')||'<tr><td colspan="7"><div class="empty-queue">No hay estudios vinculados al alcance del perfil seleccionado.</div></td></tr>'}</tbody></table></div></div>`;
    $$('[data-open-study]',content).forEach(b=>b.onclick=()=>openStudyDetail(b.dataset.openStudy));
  }
  function openStudyDetail(folio){
    const s=study(folio); if(!s)return; setSelectedStudy(folio);
    const eligible=s.sources.filter(x=>x.eligible&&x.quoted), avg=eligible.length?eligible.reduce((a,b)=>a+Number(b.unitPrice||0),0)/eligible.length:null;
    const actions=[];
    if(state.role==='investigador'){
      actions.push('<button class="btn btn-secondary" data-techniques>Definir técnicas</button>');
      actions.push('<button class="btn btn-secondary" data-add-source>Agregar fuente</button>');
      if(s.sources.length) actions.push('<button class="btn btn-secondary" data-validate-sources>Validar fuentes</button>');
      if(eligible.length>=2) actions.push('<button class="btn btn-primary" data-calc-ref>Calcular precio</button>');
      else if(s.sources.length) actions.push('<button class="btn btn-warning" data-exception>Excepción Art. 18</button>');
      if(s.reference && !s.finalGenerated) actions.push('<button class="btn btn-primary" data-generate-final>Generar Estudio final</button>');
      if(s.finalGenerated && !s.logGenerated) actions.push('<button class="btn btn-primary" data-generate-log>Generar Bitácora</button>');
      if(s.logGenerated && !s.signatures.elaboro) actions.push('<button class="btn btn-primary" data-sign-elab>Firmar “Elaboró”</button>');
    }
    if(state.role==='titular'&&s.signatures.elaboro&&!s.signatures.autorizo)actions.push('<button class="btn btn-primary" data-sign-auth>Firmar “Autorizó”</button>');
    if(state.role==='subdireccion'&&s.signatures.autorizo&&!s.signatures.reviso)actions.push('<button class="btn btn-primary" data-sign-review>Firmar “Revisó”</button>');
    if(state.role==='direccion'&&s.signatures.reviso&&!s.signatures.direccion)actions.push('<button class="btn btn-primary" data-sign-dir>Firmar “Visto Bueno”</button>');
    modalBody.innerHTML=`<div class="study-summary"><div><small>Folio</small><strong>${esc(s.folio)}</strong></div><div><small>Solicitud origen</small><strong>${esc(s.request)}</strong></div><div><small>Investigador</small><strong>${esc(s.investigator)}</strong></div><div><small>Estado</small><strong>${esc(s.state)}</strong></div><div class="span2"><small>Bien / servicio</small><strong>${esc(s.item)}</strong></div><div><small>Precio de referencia</small><strong>${money(s.reference)}</strong></div><div><small>Cotizaciones elegibles</small><strong>${eligible.length}</strong></div></div>
      <div class="subhead">Técnicas de investigación</div>
      <div class="validation-banner"><b>Seleccione una o más técnicas conforme al Estudio de Mercado.</b> Las opciones disponibles en esta versión son las siguientes:</div>
      <div class="technique-catalog">${MARKET_TECHNIQUES.map((t,i)=>`<div class="technique-item ${s.techniques.includes(t)?'selected':''}"><span>${s.techniques.includes(t)?'✓':String.fromCharCode(97+i)+')'}</span><b>${esc(t)}</b></div>`).join('')}</div>
      <div class="chips">${(s.techniques.length?s.techniques:['Pendiente de definir']).map(t=>`<span>${esc(t)}</span>`).join('')}</div>
      <div class="subhead">Fuentes y cotizaciones</div>${sourcesTable(s)}
      <div class="subhead">Análisis comparativo</div><div class="comparative-cards"><div><small>Mínimo elegible</small><strong>${money(eligible.length?Math.min(...eligible.map(x=>x.unitPrice)):null)}</strong></div><div><small>Máximo elegible</small><strong>${money(eligible.length?Math.max(...eligible.map(x=>x.unitPrice)):null)}</strong></div><div><small>Promedio</small><strong>${money(avg)}</strong></div><div><small>Precio referencia</small><strong>${money(s.reference)}</strong></div></div>
      ${eligible.length<2?'<div class="validation-banner warning">No existen al menos dos cotizaciones elegibles. El cálculo ordinario no debe ejecutarse sin documentar un supuesto de excepción Art. 18.</div>':''}
      <div class="subhead">Documentos derivados y firmas</div>${documentStatusHtml(s)}
      <div class="subhead">Historial</div><div class="timeline">${s.history.map((h,i)=>`<div class="timeline-item ${i===s.history.length-1?'current':'done'}"><span class="timeline-dot"></span><div><strong>${esc(h.label)}</strong><small>${esc(h.when)}</small></div></div>`).join('')}</div>`;
    modalActions.innerHTML=`<button class="btn btn-ghost" data-close>Cerrar</button>${actions.join('')}`; openModal(`Estudio de Mercado ${folio}`,true);
    $('[data-close]',modalActions).onclick=closeModal;
    $('[data-techniques]',modalActions)?.addEventListener('click',()=>openTechniquesModal(s));
    $('[data-add-source]',modalActions)?.addEventListener('click',()=>openAddSource(s));
    $('[data-validate-sources]',modalActions)?.addEventListener('click',()=>{s.state='En validación de fuentes';s.code='EM-08';s.history.push({when:stamp(),label:'Validación de fuentes actualizada'});addAudit('Validación de fuentes',s.folio,'Resultados fiscales, técnicos y de Contraloría registrados');save();closeModal();openStudyDetail(folio);});
    $('[data-calc-ref]',modalActions)?.addEventListener('click',()=>{s.reference=Number(avg.toFixed(2));s.state='Precio de referencia calculado';s.code='EM-12';s.history.push({when:stamp(),label:`Precio de referencia calculado: ${money(s.reference)}`});addAudit('Precio de referencia calculado',s.folio,money(s.reference));save();closeModal();openStudyDetail(folio);});
    $('[data-exception]',modalActions)?.addEventListener('click',()=>openExceptionModal(s));
    $('[data-generate-final]',modalActions)?.addEventListener('click',()=>{s.finalGenerated=true;s.state='Estudio de Mercado final generado';s.code='EM-13';s.history.push({when:stamp(),label:'Documento final del Estudio de Mercado generado'});addAudit('Estudio final generado',s.folio,'Documento derivado de datos transaccionales');save();closeModal();openStudyDetail(folio);});
    $('[data-generate-log]',modalActions)?.addEventListener('click',()=>{s.logGenerated=true;s.state='En autorización del Departamento';s.code='EM-14';s.history.push({when:stamp(),label:'Bitácora de Estudios de Mercado generada'});addAudit('Bitácora generada',s.folio,'Documento de control listo para firma');save();closeModal();openStudyDetail(folio);});
    $('[data-sign-elab]',modalActions)?.addEventListener('click',()=>signStudy(s,'elaboro','Elaboró',s.investigator,'En autorización del Departamento','EM-14'));
    $('[data-sign-auth]',modalActions)?.addEventListener('click',()=>signStudy(s,'autorizo','Autorizó','Titular DIME','En revisión de Subdirección','EM-16'));
    $('[data-sign-review]',modalActions)?.addEventListener('click',()=>signStudy(s,'reviso','Revisó','Subdirección IME','En Dirección','EM-18'));
    $('[data-sign-dir]',modalActions)?.addEventListener('click',()=>signStudy(s,'direccion','Visto Bueno','Dirección IME','Autorizado','EM-21'));
  }

  function openTechniquesModal(s){
    modalBody.innerHTML=`<p>Seleccione una o más técnicas de investigación para el Estudio de Mercado.</p><div class="review-checklist technique-select">${MARKET_TECHNIQUES.map((t,i)=>`<label class="review-check"><input type="checkbox" data-market-tech value="${esc(t)}" ${s.techniques.includes(t)?'checked':''}><span><b>${String.fromCharCode(97+i)})</b> ${esc(t)}</span></label>`).join('')}</div>`;
    modalActions.innerHTML='<button class="btn btn-secondary" data-close>Cancelar</button><button class="btn btn-primary" data-save-tech>Guardar técnicas</button>'; openModal('Técnicas de investigación',true);
    $('[data-close]',modalActions).onclick=()=>{closeModal();openStudyDetail(s.folio);};
    $('[data-save-tech]',modalActions).onclick=()=>{const selected=$$('[data-market-tech]',modalBody).filter(x=>x.checked).map(x=>x.value);if(!selected.length){toast('Seleccione al menos una técnica de investigación.');return;}s.techniques=selected;if(s.state==='En integración'){s.state='En investigación';s.code='EM-04';}s.history.push({when:stamp(),label:`Técnicas definidas: ${selected.join(' · ')}`});addAudit('Técnicas de investigación definidas',s.folio,selected.join(' | '));save();closeModal();openStudyDetail(s.folio);};
  }

  function sourcesTable(s){ return `<div class="table-wrap"><table class="data-table"><thead><tr><th>Fuente</th><th>RFC</th><th>Tipo</th><th>Precio unit.</th><th>Técnica de investigación</th><th>Validación técnica</th><th>Fiscal</th><th>Contraloría</th><th>Elegible</th></tr></thead><tbody>${s.sources.map(x=>`<tr><td>${esc(x.name)}</td><td>${esc(x.rfc)}</td><td>${esc(x.type)}</td><td>${money(x.unitPrice)}</td><td>${esc(x.technique||s.techniques[0]||'—')}</td><td>${x.technical?'Cumple':'No cumple'} / ${x.comparable?'Comparable':'No comparable'}</td><td>${esc(x.fiscal)}</td><td>${esc(x.controller)}</td><td>${badge(x.eligible?'Elegible':'Excluida')}</td></tr>`).join('')||'<tr><td colspan="9">Aún no se registran fuentes.</td></tr>'}</tbody></table></div>`; }
  function documentStatusHtml(s){
    const rows=[['Estudio de Mercado final',s.finalGenerated],['Bitácora de Estudios de Mercado',s.logGenerated],['Firma Elaboró',!!s.signatures.elaboro],['Firma Autorizó',!!s.signatures.autorizo],['Firma Revisó',!!s.signatures.reviso],['Firma Dirección',!!s.signatures.direccion]];
    return `<div class="doc-status-grid">${rows.map(([l,v])=>`<div><span>${esc(l)}</span>${badge(v?'Completo':'Pendiente')}</div>`).join('')}</div>`;
  }
  function openAddSource(s){
    const techniques=s.techniques.length?s.techniques:MARKET_TECHNIQUES;
    modalBody.innerHTML=`<div class="validation-banner provider-registry-banner"><b>Selección desde el Padrón de Proveedores.</b> En la versión productiva, las fuentes de mercado serán seleccionadas de la lista del Padrón de Proveedores de COMPRAMEX. En este prototipo la selección se simula con registros DEMO.</div>
      <div class="form-grid cols2 mt24"><label class="span2">Proveedor del Padrón<select id="srcProvider"><option value="">Seleccione un proveedor...</option>${PROVIDER_REGISTRY_DEMO.map(p=>`<option value="${p.id}">${esc(p.name)} · ${esc(p.rfc)}</option>`).join('')}</select></label><label>Nombre / razón social<input id="srcName" readonly placeholder="Se completa desde el Padrón"></label><label>RFC<input id="srcRfc" readonly placeholder="Se completa desde el Padrón"></label><label>Tipo de fuente<input id="srcType" readonly placeholder="Se completa desde el Padrón"></label><label>Precio unitario<input id="srcPrice" type="number" step=".01" value="119.90"></label><label class="span2">Técnica de investigación asociada<select id="srcTechnique">${techniques.map(t=>`<option>${esc(t)}</option>`).join('')}</select></label></div>
      <div class="review-checklist mt24"><label class="review-check"><input type="checkbox" id="srcTechnical" checked><span>Cumplimiento técnico</span></label><label class="review-check"><input type="checkbox" id="srcComparable" checked><span>Comparabilidad comercial</span></label><label class="review-check"><input type="checkbox" id="srcFiscal" checked><span>Validación fiscal satisfactoria · DEMO</span></label><label class="review-check"><input type="checkbox" id="srcController" checked><span>No localizada como objetada · DEMO</span></label></div>`;
    modalActions.innerHTML='<button class="btn btn-secondary" data-close>Cancelar</button><button class="btn btn-primary" data-save-source>Agregar fuente</button>'; openModal('Agregar fuente de mercado',true);
    const providerSelect=$('#srcProvider');
    providerSelect.onchange=()=>{const p=PROVIDER_REGISTRY_DEMO.find(x=>x.id===providerSelect.value);$('#srcName').value=p?.name||'';$('#srcRfc').value=p?.rfc||'';$('#srcType').value=p?.type||'';};
    $('[data-close]',modalActions).onclick=closeModal; $('[data-save-source]',modalActions).onclick=()=>{const p=PROVIDER_REGISTRY_DEMO.find(x=>x.id===providerSelect.value);if(!p){toast('Seleccione una fuente de la lista demostrativa del Padrón de Proveedores.');return;}const x={providerId:p.id,name:p.name,rfc:p.rfc,type:p.type,technique:$('#srcTechnique').value,quoted:true,unitPrice:Number($('#srcPrice').value),tax:Number($('#srcPrice').value)*.16,total:Number($('#srcPrice').value)*1.16,technical:$('#srcTechnical').checked,comparable:$('#srcComparable').checked,fiscal:$('#srcFiscal').checked?'Válido':'No válido',controller:$('#srcController').checked?'No objetada':'Objetada',evidence:'Registro del Padrón · DEMO',eligible:$('#srcTechnical').checked&&$('#srcComparable').checked&&$('#srcFiscal').checked&&$('#srcController').checked};s.sources.push(x);s.state='Cotizaciones recibidas';s.code='EM-07';s.history.push({when:stamp(),label:`Fuente incorporada desde Padrón: ${x.name}`});addAudit('Cotización recibida',s.folio,`${x.name} · ${money(x.unitPrice)} · ${x.technique}`);save();closeModal();openStudyDetail(s.folio);};
  }

  function openExceptionModal(s){
    modalBody.innerHTML=`<p>El sistema requiere documentar un supuesto normativo antes de determinar el precio por vía excepcional.</p><label>Supuesto / fundamento<select id="excGround"><option>Supuesto excepcional Art. 18 · DEMO</option><option>Mercado con fuente única documentada · DEMO</option></select></label><label>Justificación<textarea id="excJust" rows="4" placeholder="Fundamente la imposibilidad de obtener al menos dos cotizaciones elegibles"></textarea></label><label>Monto alternativo de referencia<input id="excAmount" type="number" step=".01"></label>`;
    modalActions.innerHTML='<button class="btn btn-secondary" data-close>Cancelar</button><button class="btn btn-warning" data-save-exc>Registrar excepción</button>';openModal('Excepción Art. 18');$('[data-close]',modalActions).onclick=closeModal;$('[data-save-exc]',modalActions).onclick=()=>{const j=$('#excJust').value.trim(),a=Number($('#excAmount').value);if(!j||!a){toast('Capture justificación y monto alternativo para documentar la excepción.');return;}s.exception={ground:$('#excGround').value,justification:j,amount:a,when:stamp()};s.reference=a;s.state='Precio de referencia calculado';s.code='EM-12';s.history.push({when:stamp(),label:'Excepción Art. 18 documentada'});addAudit('Excepción Art. 18',s.folio,j);save();closeModal();openStudyDetail(s.folio);};
  }
  function signStudy(s,key,label,who,nextState,nextCode){ s.signatures[key]=`${who} · ${stamp()}`;s.state=nextState;s.code=nextCode;s.history.push({when:stamp(),label:`Firma “${label}” registrada`});addAudit(`Firma ${label}`,s.folio,who);if(key==='direccion'){const r=requestByStudy(s);if(r){r.state='Estudio concluido';r.code='CAT-11';r.timeline.push({when:stamp(),label:'Estudio concluido',detail:`${s.folio} autorizado`});}}save();closeModal();openStudyDetail(s.folio); }

  function renderExpedient(){
    const scopedStudies=visibleStudies(), scopedRequests=visibleRequests(); const selectedS=study(state.selectedStudy); const s=(selectedS&&scopedStudies.includes(selectedS))?selectedS:scopedStudies[0]; const selectedR=req(state.selectedRequest); const r=s?requestByStudy(s):((selectedR&&scopedRequests.includes(selectedR))?selectedR:scopedRequests[0]);
    header('Expediente electrónico','Documentos, evidencias, versiones y eventos','El expediente concentra la solicitud origen, estudio, fuentes, cotizaciones, comparativo, validaciones, firmas y versiones sin sobrescritura.');
    content.innerHTML=`<div class="grid-2"><article class="card"><span class="kicker">UI-15</span><h3>Árbol documental</h3><div class="exp-tree"><div class="tree-node root">📁 ${esc(r?.folio||'Solicitud')}</div><div class="tree-node">├─ 📄 Solicitud de Catálogo · v${r?.version||1}</div><div class="tree-node">├─ 📎 Anexos técnicos · ${r?.documents||0}</div><div class="tree-node">├─ 📁 Estudio de Mercado · ${esc(s?.folio||'Pendiente')}</div><div class="tree-node indent">├─ Fuentes y validaciones · ${s?.sources?.length||0}</div><div class="tree-node indent">├─ Solicitudes / cotizaciones</div><div class="tree-node indent">├─ Cuadro Comparativo</div><div class="tree-node indent">├─ Estudio de Mercado final · ${s?.finalGenerated?'Generado':'Pendiente'}</div><div class="tree-node indent">├─ Bitácora de Estudios · ${s?.logGenerated?'Generada':'Pendiente'}</div><div class="tree-node indent">└─ Firmas · ${s?Object.values(s.signatures).filter(Boolean).length:0}/4</div></div></article><article class="card"><span class="kicker">Integridad y auditoría</span><h3>Controles representados</h3><div class="security-architecture"><div><b>Versionado</b><span>No sobrescritura de versiones autorizadas.</span></div><div><b>Bitácora</b><span>Usuario, fecha/hora, acción y transición.</span></div><div><b>Hash / sello</b><span>Previsto para repositorio documental.</span></div><div><b>RBAC</b><span>Permisos por rol, unidad y etapa.</span></div><div><b>Retención</b><span>Expediente conservado según política aplicable.</span></div></div></article></div><article class="card mt24"><span class="kicker">Eventos</span><h3>Bitácora vinculada</h3>${auditTable(state.audit.filter(a=>[r?.folio,s?.folio].includes(a.folio)))}</article>`;
  }

  function renderRegistration(){
    const candidates=visibleRequests().filter(r=>r.state==='Estudio concluido' || r.state==='En registro');
    header('Catálogo de Bienes y Servicios','Alta / actualización autorizada','Registre la clave, ficha vigente, precio de referencia, versión y vigencia una vez concluido y autorizado el Estudio de Mercado.');
    content.innerHTML=`<article class="card"><div class="card-head"><div><span class="kicker">UI-16</span><h3>Expedientes listos para registro</h3></div><span class="status-badge">${candidates.length} pendiente(s)</span></div>${candidates.length?`<div class="table-wrap"><table class="data-table"><thead><tr><th>Solicitud</th><th>Descripción</th><th>Estudio</th><th>Precio ref.</th><th></th></tr></thead><tbody>${candidates.map(r=>{const s=study(r.study);return `<tr><td>${esc(r.folio)}</td><td>${esc(r.description)}</td><td>${esc(r.study)}</td><td>${money(s?.reference)}</td><td><button class="btn btn-primary btn-small" data-register="${r.folio}">${/Actualización/.test(r.movement)?'Actualizar':'Registrar'}</button></td></tr>`}).join('')}</tbody></table></div>`:'<div class="validation-banner">No hay expedientes autorizados pendientes de alta o actualización.</div>'}</article>`;
    $$('[data-register]',content).forEach(b=>b.onclick=()=>openRegistrationModal(req(b.dataset.register)));
  }
  function openRegistrationModal(r){
    const s=study(r.study), isUpdate=/Actualización/.test(r.movement);
    modalBody.innerHTML=`<div class="form-grid cols2"><label>Movimiento<input value="${esc(r.movement)}" readonly></label><label>Solicitud<input value="${esc(r.folio)}" readonly></label><label>Clave<input id="regKey" value="${esc(isUpdate?(r.duplicateHint||'DEMO-B-001'):`DEMO-${r.itemType==='Bien'?'B':'S'}-${String(CATALOG.length+1).padStart(3,'0')}`)}"></label><label>Precio de referencia<input value="${s?.reference||''}" readonly></label><label class="span2">Descripción vigente<textarea id="regDesc" rows="3">${esc(r.description)}</textarea></label><label>Vigencia desde<input id="regFrom" type="date" value="${new Date().toISOString().slice(0,10)}"></label><label>Estado<select id="regStatus"><option>Vigente</option><option>Inactivo</option></select></label></div>`;
    modalActions.innerHTML='<button class="btn btn-secondary" data-close>Cancelar</button><button class="btn btn-primary" data-confirm-reg>Publicar versión vigente</button>';openModal(`${isUpdate?'Actualizar':'Registrar'} Catálogo`,true);$('[data-close]',modalActions).onclick=closeModal;$('[data-confirm-reg]',modalActions).onclick=()=>{r.state=isUpdate?'Actualizada':'Registrada';r.code=isUpdate?'CAT-14':'CAT-13';r.timeline.push({when:stamp(),label:r.state,detail:`Clave ${$('#regKey').value} publicada como vigente`});addAudit(r.state,r.folio,`Clave ${$('#regKey').value} · ${money(s?.reference)}`,ROLES.catalogo);save();closeModal();renderRegistration();toast(`Operación demostrativa completada. La solicitud quedó como “${r.state}”.`);};
  }

  function renderReports(){
    const scopedRequests=visibleRequests(), scopedStudies=visibleStudies(); const total=scopedRequests.length, returned=scopedRequests.filter(r=>r.state==='Requiere información').length, studies=scopedStudies.length, exceptions=scopedStudies.filter(s=>s.exception).length;
    header('Reportes e indicadores','Control y seguimiento','Indicadores demostrativos derivados de los datos transaccionales del prototipo.');
    content.innerHTML=`<div class="stats-grid"><article class="stat"><span>Solicitudes</span><strong>${total}</strong><small>Total DEMO</small></article><article class="stat"><span>Devueltas</span><strong>${returned}</strong><small>${total?Math.round(returned/total*100):0}% del total</small></article><article class="stat"><span>Estudios</span><strong>${studies}</strong><small>Vinculados</small></article><article class="stat"><span>Excepciones Art. 18</span><strong>${exceptions}</strong><small>Documentadas</small></article></div><div class="grid-2 mt24"><article class="card"><span class="kicker">Solicitudes por estado</span><h3>Distribución actual</h3>${barReport(groupCount(scopedRequests,'state'))}</article><article class="card"><span class="kicker">Estudios por estado</span><h3>Distribución actual</h3>${barReport(groupCount(scopedStudies,'state'))}</article></div><article class="card mt24"><span class="kicker">Reportes mínimos</span><h3>Disponibles para futura instrumentación</h3><div class="report-grid"><div>Solicitudes por dependencia, tipo, estado y periodo</div><div>Tiempo promedio por etapa y antigüedad</div><div>Fuentes invitadas, elegibles y excluidas</div><div>Estudios con menos de dos cotizaciones</div><div>Precios de referencia e histórico</div><div>Regularizaciones Art. 28 del Reglamento de la Ley pendientes</div><div>Bitácora por usuario / rol / expediente</div><div>Evidencias faltantes por expediente</div></div></article>`;
  }
  function groupCount(rows,key){return rows.reduce((a,x)=>(a[x[key]]=(a[x[key]]||0)+1,a),{});}
  function barReport(obj){const max=Math.max(1,...Object.values(obj));return `<div class="bars">${Object.entries(obj).map(([k,v])=>`<div class="bar-row"><span>${esc(k)}</span><div><i style="width:${v/max*100}%"></i></div><b>${v}</b></div>`).join('')}</div>`;}

  function auditTable(rows){return `<div class="table-wrap"><table class="data-table"><thead><tr><th>Fecha / hora</th><th>Usuario</th><th>Acción</th><th>Folio</th><th>Detalle</th></tr></thead><tbody>${rows.slice().reverse().map(a=>`<tr><td>${esc(a.when)}</td><td>${esc(a.user)}</td><td>${esc(a.action)}</td><td>${esc(a.folio)}</td><td>${esc(a.detail)}</td></tr>`).join('')}</tbody></table></div>`;}
  function renderAudit(){ const folios=new Set([...visibleRequests().map(r=>r.folio),...visibleStudies().map(s=>s.folio)]); const rows=isCentralMarketRole()?state.audit:state.audit.filter(a=>folios.has(a.folio)); header('Bitácora de auditoría','Trazabilidad de eventos','Toda transición o modificación relevante queda representada con usuario, fecha/hora, acción, folio y detalle.'); content.innerHTML=`<article class="card"><div class="card-head"><div><span class="kicker">UI-17</span><h3>Historial inmutable · DEMO</h3></div><button class="btn btn-secondary" id="auditExport">Exportar CSV demostrativo</button></div>${auditTable(rows)}</article>`; $('#auditExport').onclick=exportAudit; }
  function exportAudit(){ const rows=[['Fecha','Usuario','Acción','Folio','Detalle'],...state.audit.map(a=>[a.when,a.user,a.action,a.folio,a.detail])];const csv=rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='bitacora_compramex_demo.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),500); }

  function publicCatalogSearch(){
    const q=($('#publicCatalogQuery')?.value||'').trim().toLowerCase(); const rows=CATALOG.filter(x=>x.status==='Vigente'&&(!q||[x.key,x.description,x.family].join(' ').toLowerCase().includes(q))).slice(0,6);
    const box=$('#publicCatalogResults'); if(!box)return; box.innerHTML=rows.length?rows.map(x=>`<div class="public-catalog-row"><div><b>${esc(x.key)}</b><span>${esc(x.description)}</span></div><div><small>${esc(x.type)} · Partida ${esc(x.partida)}</small><strong>${money(x.price)}</strong></div></div>`).join(''):'<div class="validation-banner warning">No se localizaron coincidencias vigentes en el catálogo demostrativo.</div>';
  }

  const accessBtn=$('#catalogAccessBtn'); if(accessBtn) accessBtn.onclick=openAccess;
  const publicSearchBtn=$('#publicCatalogSearchBtn'); if(publicSearchBtn) publicSearchBtn.onclick=publicCatalogSearch;
  const modulesBtn=$('#goModulesBtn'); if(modulesBtn) modulesBtn.onclick=()=>document.getElementById('compramexModules')?.scrollIntoView({behavior:'smooth'});
  const providerModuleBtn=$('#providerModuleBtn'); if(providerModuleBtn) providerModuleBtn.onclick=()=>document.getElementById('inicioPortal')?.scrollIntoView({behavior:'smooth'});
  const catModuleBtn=$('#catalogModuleBtn'); if(catModuleBtn) catModuleBtn.onclick=openAccess;
  $$('[data-future-module]').forEach(b=>b.onclick=()=>toast('Este módulo se muestra como punto de integración futuro. No forma parte del alcance funcional implementado en esta versión del prototipo.'));

  $('#logoutBtn')?.addEventListener('click',()=>{state.active=false;save();});
  $('#goPublic')?.addEventListener('click',()=>{state.active=false;save();});
  $('#resetDemo')?.addEventListener('click',()=>{localStorage.removeItem(STORAGE);state=clone(initialState);});

  ensureRoleAllowed();
  if(state.active) loginCatalog(state.role,state.dependencyKey);
})();
