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


  const SUFFICIENCY_DOCUMENT = {id:'docSuficiencia',label:'Oficio de Dictamen de Suficiencia Presupuestal',required:true};
  const AREA_TO_CA_REMITTAL = 'La solicitud ha sido remitida a la Coordinación Administrativa para su revisión y, en su caso, envío a la Oficialía Mayor.';
  const CA_TO_OM_REMITTAL = 'La solicitud ha sido remitida a la Oficialía Mayor para su atención y continuidad del proceso.';
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
  const INVESTIGATORS=['Ana Martínez','Luis Ortega','Mariana Ruiz','Jorge Salgado'];
  const PARTIDAS=[
    {key:'2111',name:'Materiales y útiles de oficina',giro:'Papelería y consumibles',type:'Bien'},
    {key:'2161',name:'Material de limpieza',giro:'Limpieza',type:'Bien'},
    {key:'5151',name:'Equipo de cómputo',giro:'Tecnologías de información',type:'Bien'},
    {key:'3331',name:'Servicios de consultoría en tecnologías',giro:'Tecnologías de información',type:'Servicio'},
    {key:'5111',name:'Muebles de oficina',giro:'Mobiliario',type:'Bien'},
    {key:'3511',name:'Mantenimiento de inmuebles',giro:'Mantenimiento',type:'Servicio'},
    {key:'3341',name:'Capacitación',giro:'Capacitación',type:'Servicio'},
    {key:'3691',name:'Servicios audiovisuales',giro:'Producción audiovisual',type:'Servicio'},
    {key:'5621',name:'Maquinaria y equipo industrial',giro:'Infraestructura rural',type:'Bien'}
  ];
  const UNITS=['Pieza','Paquete','Caja','Servicio','Curso','Equipo','Metro','Kilogramo','Litro','Mes','Hora'];
  const ALLOWED_FILE=/\.(pdf|png|jpe?g)$/i;
  const MAX_FILE_BYTES=1500000; // Almacenamiento demostrativo localStorage



  const CATALOG = [
    {key:'DEMO-B-001',type:'Bien',family:'Papelería y consumibles',partida:'2111',unit:'Paquete',description:'Papel bond tamaño carta, 75 g/m², paquete de 500 hojas',price:118.40,status:'Vigente',version:3,updated:'2026-08-28'},
    {key:'DEMO-B-002',type:'Bien',family:'Equipo de cómputo',partida:'5151',unit:'Pieza',description:'Computadora portátil empresarial, 16 GB RAM, SSD 512 GB o superior',price:21950.00,status:'Vigente',version:2,updated:'2026-08-14'},
    {key:'DEMO-B-003',type:'Bien',family:'Mobiliario',partida:'5111',unit:'Pieza',description:'Silla ergonómica operativa con soporte lumbar y ajuste de altura',price:3290.00,status:'Vigente',version:4,updated:'2026-07-30'},
    {key:'DEMO-S-001',type:'Servicio',family:'Tecnologías de información',partida:'3331',unit:'Servicio',description:'Servicio de soporte técnico especializado para infraestructura de TI',price:48500.00,status:'Vigente',version:2,updated:'2026-09-01'},
    {key:'DEMO-S-002',type:'Servicio',family:'Mantenimiento',partida:'3511',unit:'Servicio',description:'Servicio de mantenimiento preventivo y correctivo de inmuebles',price:72500.00,status:'Vigente',version:1,updated:'2026-06-18'},
    {key:'DEMO-B-004',type:'Bien',family:'Limpieza',partida:'2161',unit:'Caja',description:'Toalla interdoblada de papel para manos, caja con 20 paquetes',price:640.50,status:'Vigente',version:2,updated:'2026-08-04'},
    {key:'DEMO-S-003',type:'Servicio',family:'Capacitación',partida:'3341',unit:'Curso',description:'Servicio de capacitación técnica presencial para personal institucional',price:28500.00,status:'Inactivo',version:1,updated:'2025-11-02'}
  ];

  CATALOG.forEach(c=>{c.priceValidUntil=c.status==='Vigente'?'2027-12-31':'2025-12-31';c.history=[];});

  const initialState = {
    active:false,
    role:'titular',
    dependencyKey:'234',
    selectedRequest:'CAT-2026-0421',
    selectedStudy:'EM-2026-0118',
    lastSearch:'',
    actorName:'USUARIO-COMPRAMEX-DEMO',
    catalog:clone(CATALOG),
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
      ],history:[{when:'16/09/2026 12:18',label:'Estudio creado'},{when:'18/09/2026 13:40',label:'Cotizaciones recibidas'},{when:'19/09/2026 13:55',label:'Precio de referencia calculado'},{when:'19/09/2026 14:02',label:'Análisis del estudio concluido'},{when:'19/09/2026 16:48',label:'Cadena de firmas concluida'}]}
    ]
  };

  function clone(v){ return JSON.parse(JSON.stringify(v)); }
  function migrateRequestDocuments(r){
    // Los anexos de versiones anteriores podían repetir el Dictamen por elemento.
    const previous=[...(r.documentDetails||[]),...(r.items||[]).flatMap(i=>i.documentDetails||[])].filter(d=>d.id===SUFFICIENCY_DOCUMENT.id);
    const existing=r.sufficiencyDocument;
    const hadDocuments=!!existing||previous.length||Array.isArray(r.documentDetails)||(r.items||[]).some(i=>Array.isArray(i.documentDetails));
    const selected=(isDocumentAvailable(existing)?existing:null)||previous.find(isDocumentAvailable)||existing||previous.find(d=>d.present)||previous[0];
    r.sufficiencyDocument={...SUFFICIENCY_DOCUMENT,...(selected||{}),id:SUFFICIENCY_DOCUMENT.id};
    if(Array.isArray(r.documentDetails))r.documentDetails=r.documentDetails.filter(d=>d.id!==SUFFICIENCY_DOCUMENT.id);
    (r.items||[]).forEach(i=>{if(Array.isArray(i.documentDetails))i.documentDetails=i.documentDetails.filter(d=>d.id!==SUFFICIENCY_DOCUMENT.id);});
    if(hadDocuments)r.documents=allDocuments(r).filter(isDocumentAvailable).length;
    return r;
  }
  function load(){try{const saved=JSON.parse(localStorage.getItem(STORAGE)||'{}');const result={...clone(initialState),...saved,catalog:Array.isArray(saved.catalog)?saved.catalog:clone(CATALOG)};result.requests.forEach(migrateRequestDocuments);return result;}catch(e){const result=clone(initialState);result.requests.forEach(migrateRequestDocuments);return result;}}
  let state = load();
  function save(){ try{localStorage.setItem(STORAGE, JSON.stringify(state));return true;}catch(e){toast('El almacenamiento de demostración está lleno. Reduzca el tamaño de los archivos o restablezca la demo.');return false;} }
  function esc(v=''){ return String(v).replace(/[&<>'"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c])); }
  function money(v){ return v!==null&&v!==undefined&&v!==''&&Number.isFinite(Number(v)) ? new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN'}).format(Number(v)) : '—'; }
  function stamp(){ return new Date().toLocaleString('es-MX',{dateStyle:'medium',timeStyle:'short'}); }
  function showOnly(which){ publicView?.classList.toggle('hidden',which!=='public'); accessView?.classList.toggle('hidden',which!=='access'); workspace?.classList.toggle('hidden',which!=='workspace'); }
  function closeModal(){ modal?.classList.add('hidden'); modal?.classList.remove('wide-modal'); }
  function clearCatalogModal(){closeModal();if(modalBody)modalBody.replaceChildren();if(modalActions)modalActions.replaceChildren();if(modalTitle)modalTitle.textContent='';}
  function exitCatalogSession(){state.active=false;save();clearCatalogModal();}
  function openModal(title,wide=false){ modalTitle.textContent=title; modal.classList.remove('hidden'); modal.classList.toggle('wide-modal',wide); }
  function toast(msg){ modalBody.innerHTML=`<p>${esc(msg)}</p>`; modalActions.innerHTML='<button class="btn btn-primary" data-cat-ok type="button">Aceptar</button>'; openModal('Información'); $('[data-cat-ok]',modalActions).onclick=closeModal; }
  function showSubmissionMessage(message,afterClose){ modalBody.innerHTML=`<p>${esc(message)}</p>`; modalActions.innerHTML='<button class="btn btn-primary" data-remitted-ok type="button">Aceptar</button>'; openModal('Solicitud remitida'); $('[data-remitted-ok]',modalActions).onclick=()=>{closeModal();if(typeof afterClose==='function')afterClose();}; }
  function header(k,t,p){ pageHeader.innerHTML=`<span class="kicker">${esc(k)}</span><h2>${esc(t)}</h2><p>${esc(p)}</p>`; }
  function actor(){ return (state.actorName||ROLES[state.role]||'Sistema').trim(); }
  function audit(action,folio,detail='',r=null,document=''){
    const old=r?.previousState||r?.state||'', now=r?.state||'';
    const entry={when:stamp(),user:actor(),role:ROLES[state.role]||'Sistema',action,folio,detail,previousState:old,newState:now,observation:detail,document};
    state.audit.push(entry);if(r){(r.timeline||=[]).push({when:entry.when,label:action,detail:`${actor()} · ${detail}`});}
    const persisted=save();return {...entry,persisted};
  }
  function transition(r,next,action,detail='',document=''){
    const before=r.state;r.state=next;
    const entry={when:stamp(),user:actor(),role:ROLES[state.role],action,folio:r.folio,detail,previousState:before,newState:next,observation:detail,document};
    state.audit.push(entry);(r.timeline||=[]).push({when:entry.when,label:action,detail:`${actor()} · ${before} → ${next}${detail?' · '+detail:''}`});return save();
  }
  function addAudit(action,folio,detail,user=actor()){
    state.audit.push({when:stamp(),user,role:ROLES[state.role]||'Sistema',action,folio,detail,previousState:'',newState:'',observation:detail,document:''});save();
  }
  function itemsOf(r){return Array.isArray(r?.items)&&r.items.length?r.items:[{id:'1',key:r?.duplicateHint||'',description:r?.description||'',specs:r?.specs||r?.description||'',partida:r?.classification||'',unit:r?.unitMeasure||'',type:r?.itemType||'Bien',movement:r?.movement||'Alta de bien',situation:r?.duplicateHint?'Existente':'Nuevo',giro:r?.giro||PARTIDAS.find(p=>p.key===r?.classification)?.giro||'',quantity:r?.quantity||1,sources:[],price:null,validUntil:r?.validUntil||'',result:''}];}
  function resultOf(s,item){return (s?.itemResults||{})[item.id]||{};}
  function catalogEntry(key){return state.catalog.find(c=>c.key===key);}
  function needsStudy(r){return itemsOf(r).some(i=>!i.movement.startsWith('Uso de'));}
  function roleCanSee(r){
    if(!r)return false;
    if(state.role==='area')return r.dependency===activeDependency().name && (r.owner? r.owner===actor() : r.requestingArea===actor());
    if(state.role==='ca')return r.dependency===activeDependency().name;
    if(!isCentralMarketRole()||!wasSentToOfficialia(r))return false;
    if(state.role==='investigador')return r.investigator===actor();
    const s=study(r.study);
    if(state.role==='subdireccion')return !!(s?.signatures?.autorizo);
    if(state.role==='direccion')return !!(s?.signatures?.reviso);
    if(state.role==='catalogo')return !!(s?.signatures?.direccion);
    return true;
  }
  function roleCanSeeStudy(s){return roleCanSee(requestByStudy(s));}
  function isDocumentAvailable(d){return !!((d?.id===SUFFICIENCY_DOCUMENT.id||d?.present)&&d?.filename&&d?.url&&validSignature(d.url,d.filename));}
  function docsOfItem(r,i){
    if(Array.isArray(i?.documentDetails))return i.documentDetails;
    // Compatibilidad con solicitudes antiguas de un solo elemento.
    return itemsOf(r).length===1&&Array.isArray(r?.documentDetails)?r.documentDetails:[];
  }
  function requestDocument(r){return r?.sufficiencyDocument||{...SUFFICIENCY_DOCUMENT,present:false};}
  function allDocuments(r){return [requestDocument(r),...itemsOf(r).flatMap(i=>docsOfItem(r,i))];}
  function itemRule(i,r){return {pobalin:i.pobalin||r.pobalin||'No aplica',art28Rule:i.art28Rule||r.art28Rule||'Aplica'};}
  function documentRequired(d,i,r){const rule=itemRule(i,r);return (d.id==='docPobalin'&&rule.pobalin==='Sí')||(['docFicha','docSpecs'].includes(d.id)&&rule.art28Rule!=='No aplica');}
  function missingDocuments(r){
    const missing=isDocumentAvailable(requestDocument(r))?[]:[{...requestDocument(r),itemId:null}];
    return missing.concat(itemsOf(r).flatMap(i=>documentSet().map(def=>docsOfItem(r,i).find(d=>d.id===def.id)||{...def,present:false}).filter(d=>documentRequired(d,i,r)&&!isDocumentAvailable(d)).map(d=>({...d,itemId:i.id,itemDescription:i.description}))));
  }
  function missingLabel(d){return d.itemId?`${d.itemDescription||`Elemento ${d.itemId}`} · ${d.label}`:`Solicitud · ${d.label}`;}
  function allApprovals(s){return !!(s?.signatures?.elaboro&&s?.signatures?.autorizo&&s?.signatures?.reviso&&s?.signatures?.direccion&&s.outcome!=='NO AUTORIZADA'&&s.state!=='No autorizado');}
  function itemDocuments(s){return s.itemDocuments||{};}
  function validFile(file){return file && ALLOWED_FILE.test(file.name) && (!file.type||['application/pdf','image/png','image/jpeg'].includes(file.type)) && file.size>0 && file.size<=MAX_FILE_BYTES;}
  function validSignature(url,name){
    try{const signature=atob(String(url).split(',')[1]||'').slice(0,8);return /\.pdf$/i.test(name)?signature.startsWith('%PDF-'):/\.png$/i.test(name)?signature==='\x89PNG\r\n\x1a\n':/^\xff\xd8\xff/.test(signature);}catch(e){return false;}
  }
  function readFile(file){return new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=reject;reader.readAsDataURL(file);});}
  async function enrichDocuments(form,docs,prefix=''){
    for(const d of docs){const file=form.elements[`${prefix}${d.id}File`]?.files?.[0];if(file){if(!validFile(file))throw Error(`Formato no válido, archivo vacío o mayor a 1.5 MB: ${file.name}. Sólo PDF, PNG, JPG o JPEG.`);d.url=await readFile(file);if(!validSignature(d.url,file.name))throw Error(`El contenido del archivo ${file.name} no corresponde a un PDF, PNG o JPG válido.`);if(isSufficiencyDefinition(d))d.present=true;d.size=file.size;d.status='Cargado';d.version=1;d.history=[{when:stamp(),user:actor(),filename:file.name,version:1,reason:'Carga inicial'}];}}
    return docs;
  }
  function previewDocument(d){
    if(!d?.url){toast('Este documento precargado no dispone de archivo para previsualización.');return;}
    const match=String(d.url).match(/^data:(application\/pdf|image\/(?:png|jpeg));base64,([A-Za-z0-9+/=]+)$/);
    if(!match)return toast('El documento no contiene un formato visualizable permitido.');
    try{const raw=atob(match[2]),bytes=Uint8Array.from(raw,c=>c.charCodeAt(0));const url=URL.createObjectURL(new Blob([bytes],{type:match[1]}));const w=window.open(url,'_blank');if(w)w.opener=null;else toast('Permita ventanas emergentes para visualizar el documento.');setTimeout(()=>URL.revokeObjectURL(url),60000);}catch(e){toast('No se pudo abrir el documento seleccionado.');}
  }
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
  function canCreateCatalogRequest(){ return state.role==='area' || state.role==='ca'; }
  function isCatalogAlta(movement=''){ return movement==='Alta de bien' || movement==='Alta de servicio'; }
  function wasSentToOfficialia(r){ if(r.sentToOfficialia===true)return true; if(r.sentToOfficialia===false)return false; return !['received','validation'].includes(r.caStage); }
  function visibleRequests(){return state.requests.filter(roleCanSee);}
  function visibleStudies(){return state.studies.filter(roleCanSeeStudy);}
  function dependencyLabel(d=activeDependency()){ return `${d.name} · ${d.sigla} · GEM ${d.key}`; }
  function rolesOptionsHtml(depKey,selectedRole){ return allowedRolesForDependency(depKey).map(k=>`<option value="${k}" ${k===selectedRole?'selected':''}>${esc(ROLES[k])}</option>`).join(''); }

  function openAccess(){
    state.active=false; ensureRoleAllowed(); save(); clearCatalogModal(); showOnly('access');
    $('#accessKicker').textContent='COMPRAMEX · Acceso institucional';
    $('#accessTitle').textContent='Catálogo y Estudios de Mercado';
    $('#accessDescription').textContent='Seleccione primero la dependencia y después el rol institucional. Todas las dependencias cuentan con Área Requirente / Usuario y Coordinación Administrativa; la Oficialía Mayor incorpora además los perfiles especializados del Estudio de Mercado.';
    accessPanel.innerHTML=`
      <div class="access-hierarchy"><div><span>1</span><b>Dependencia</b><small>Nivel superior de adscripción</small></div><i>→</i><div><span>2</span><b>Rol institucional</b><small>Permisos según dependencia</small></div></div>
      <label>Dependencia<select id="catalogDependencySelect">${DEPENDENCIES.map(d=>`<option value="${d.key}" ${d.key===String(state.dependencyKey)?'selected':''}>${esc(d.name)} · ${esc(d.sigla)}</option>`).join('')}</select></label>
      <label>Rol institucional<select id="catalogRoleSelect">${rolesOptionsHtml(state.dependencyKey,state.role)}</select></label>
      <div id="dependencyRoleInfo" class="dependency-role-info"></div>
      <label>Usuario de demostración<input id="catalogActor" value="${esc(state.actorName||'USUARIO-COMPRAMEX-DEMO')}"></label><label id="investigatorIdentity" class="${state.role==='investigador'?'':'hidden'}">Investigador<select id="investigatorActor">${INVESTIGATORS.map(x=>`<option>${esc(x)}</option>`).join('')}</select></label>
      <label>Contraseña de demostración<input type="password" value="demo1234"></label>
      <button class="btn btn-primary full" id="catalogLoginBtn" type="button">Ingresar al módulo</button>
      <button class="btn btn-ghost full" id="catalogBackBtn" type="button">Regresar a COMPRAMEX</button>
      <p class="micro">Catálogo de dependencias cargado desde el archivo institucional proporcionado. Prototipo Front-End: no ejecuta consultas reales a PMCP, SAT, Contraloría, correo, firma ni sistemas presupuestales.</p>`;
    const depSelect=$('#catalogDependencySelect'), roleSelect=$('#catalogRoleSelect'), info=$('#dependencyRoleInfo');
    const refreshRoles=()=>{ const depKey=depSelect.value; const allowed=allowedRolesForDependency(depKey); const keep=allowed.includes(roleSelect.value)?roleSelect.value:allowed[0]; roleSelect.innerHTML=rolesOptionsHtml(depKey,keep); const dep=dependencyByKey(depKey); info.innerHTML=depKey===OFFICIALIA_MAYOR_KEY?`<b>${esc(dep.name)}</b><span>2 roles comunes + 6 roles especializados de Investigación de Mercado, Catálogo y Auditoría.</span>`:`<b>${esc(dep.name)}</b><span>Roles disponibles: Área Requirente / Usuario y Coordinación Administrativa.</span>`; };
    depSelect.onchange=refreshRoles; roleSelect.onchange=()=>$('#investigatorIdentity').classList.toggle('hidden',roleSelect.value!=='investigador'); refreshRoles();roleSelect.onchange();
    $('#catalogLoginBtn').onclick=()=>loginCatalog(roleSelect.value,depSelect.value,roleSelect.value==='investigador'?$('#investigatorActor').value:$('#catalogActor').value);
    $('#catalogBackBtn').onclick=showPortal;
  }

  function showPortal(){ exitCatalogSession(); showOnly('public'); window.scrollTo({top:0,behavior:'smooth'}); }

  function loginCatalog(role,dependencyKey=state.dependencyKey,username=state.actorName){
    state.active=true; state.dependencyKey=String(dependencyKey||OFFICIALIA_MAYOR_KEY); state.role=role;state.actorName=String(username||'USUARIO-COMPRAMEX-DEMO').trim(); ensureRoleAllowed(); save(); showOnly('workspace');
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
    const pendingSigns=scopedStudies.filter(s=>s.signatures?.elaboro && !s.signatures?.direccion).length;const relevant=new Set([...scopedRequests.map(r=>r.folio),...scopedStudies.map(s=>s.folio)]);
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
        <article class="card"><span class="kicker">Reglas rectoras</span><h3>Compuertas funcionales</h3><ul class="clean-list cat-rules"><li>Consulta previa obligatoria antes de solicitar alta.</li><li>La Coordinación Administrativa puede iniciar directamente una solicitud de alta.</li><li>Únicamente la Coordinación Administrativa envía altas de bienes o servicios a la Oficialía Mayor.</li><li>Solicitud incompleta no avanza y se devuelve para complemento.</li><li>Fuentes excluidas permanecen en el expediente, pero no computan.</li><li>Precio ordinario requiere al menos dos cotizaciones elegibles y comparables.</li><li>Las autorizaciones siguen secuencia: Elaboró → Titular → Subdirección → Dirección; sólo después se generan Bitácora y Ficha de Estudio de Mercado.</li></ul></article>
        <article class="card"><span class="kicker">Trazabilidad</span><h3>Últimos eventos</h3><div class="timeline">${state.audit.filter(a=>relevant.has(a.folio)).slice(-5).reverse().map(a=>`<div class="timeline-item current"><span class="timeline-dot"></span><div><strong>${esc(a.action)} · ${esc(a.folio)}</strong><small>${esc(a.user)} · ${esc(a.when)}<br>${esc(a.detail)}</small></div></div>`).join('')}</div></article>
      </div>`;
    $$('[data-go]',content).forEach(b=>b.onclick=()=>route(b.dataset.go));
    bindRequestLinks(content);
  }

  function macroFlowHtml(){
    const steps=['Consulta catálogo','Área requirente o Coordinación Administrativa: solicitud','Coordinación Administrativa: validación y envío','Oficialía Mayor: recepción','Revisión Art. 28 del Reglamento de la Ley','Estudio de mercado','Fuentes y cotizaciones','Cuadro comparativo','Firmas','Registro / actualización'];
    return `<div class="cat-flow">${steps.map((s,i)=>`<div class="cat-flow-step"><b>${i+1}</b><span>${esc(s)}</span></div>${i<steps.length-1?'<i>→</i>':''}`).join('')}</div>`;
  }
  function miniRequestsTable(rows){ return `<div class="table-wrap"><table class="data-table"><thead><tr><th>Folio</th><th>Movimiento</th><th>Estado</th></tr></thead><tbody>${rows.map(r=>`<tr><td><button class="link-btn" data-open-request="${esc(r.folio)}">${esc(r.folio)}</button></td><td>${esc(r.movement)}</td><td>${badge(r.state)}</td></tr>`).join('')}</tbody></table></div>`; }
  function bindRequestLinks(root){ $$('[data-open-request]',root).forEach(b=>b.onclick=()=>openRequestDetail(b.dataset.openRequest)); }

  function renderCatalog(){
    header('Catálogo de Bienes y Servicios','Consulta obligatoria','Busque por clave, descripción, palabra, familia, partida o unidad. Sólo registros vigentes pueden seleccionarse para nuevos requerimientos.');
    const createAction=state.role==='area'?'<button class="btn btn-primary" data-new-request type="button">Solicitar alta / actualización</button>':state.role==='ca'?'<button class="btn btn-primary" data-new-request type="button">Iniciar alta de bien o servicio</button>':'<span class="status-badge">Consulta institucional</span>';
    content.innerHTML=`
      <div class="card">
        <div class="section-heading compact"><div><span class="kicker">UI-01</span><h3>Búsqueda avanzada</h3></div><div class="actions">${createAction}</div></div>
        <div class="validation-banner routing"><b>Canal institucional del prototipo:</b> el Área usuaria/requirente turna a la Coordinación Administrativa; la Coordinación también puede iniciar directamente una alta y es el único perfil que la envía a la Oficialía Mayor.</div>
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
    const rows=state.catalog.filter(x=>(!q||[x.key,x.description,x.family,x.unit].join(' ').toLowerCase().includes(q))&&(!type||x.type===type)&&(!p||x.partida.includes(p)));
    const box=$('#catalogResults'); if(!box)return;
    box.innerHTML=`<article class="card"><div class="card-head"><div><span class="kicker">Resultados</span><h3>${rows.length} registro(s)</h3></div><span class="status-badge">Consulta DEMO</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Clave</th><th>Tipo</th><th>Descripción</th><th>Partida</th><th>Unidad</th><th>Precio ref.</th><th>Estado</th><th></th></tr></thead><tbody>${rows.map(x=>`<tr><td><b>${esc(x.key)}</b></td><td>${esc(x.type)}</td><td>${esc(x.description)}</td><td>${esc(x.partida)}</td><td>${esc(x.unit)}</td><td>${money(x.price)}</td><td>${badge(x.status)}</td><td><button class="btn btn-ghost btn-small" data-cat-detail="${x.key}">Ver ficha</button></td></tr>`).join('')||'<tr><td colspan="8">No se localizaron coincidencias.</td></tr>'}</tbody></table></div>${rows.length===0?'<div class="validation-banner warning">No se localizó una clave coincidente. Puede iniciar una solicitud de alta justificando la nueva incorporación al catálogo.</div>':''}</article>`;
    $$('[data-cat-detail]',box).forEach(b=>b.onclick=()=>openCatalogDetail(b.dataset.catDetail));
  }
  function openCatalogDetail(key){const x=catalogEntry(key);if(!x)return;
    const valid=x.status==='Vigente'&&x.priceValidUntil>=new Date().toISOString().slice(0,10);
    modalBody.innerHTML=`<div class="detail-grid"><div><small>Clave</small><strong>${esc(x.key)}</strong></div><div><small>Estado</small><strong>${esc(x.status)}</strong></div><div><small>Tipo</small><strong>${esc(x.type)}</strong></div><div><small>Familia / giro</small><strong>${esc(x.family)}</strong></div><div><small>Partida</small><strong>${esc(x.partida)}</strong></div><div><small>Unidad</small><strong>${esc(x.unit)}</strong></div><div class="span2"><small>Descripción vigente</small><strong>${esc(x.description)}</strong></div><div><small>Precio de referencia</small><strong>${money(x.price)}</strong></div><div><small>Vigencia de precio</small><strong>${esc(x.priceValidUntil||'Sin vigencia')}</strong></div><div><small>Versión</small><strong>${x.version}</strong></div></div><div class="subhead">Historial de cambios</div>${(x.history||[]).length?auditTable(x.history.map(h=>({when:h.when,user:h.user,role:'Catálogo',action:'Versión publicada',folio:h.request,detail:`Antes: ${money(h.before?.price)} / ${h.before?.status||'Nuevo'} → Ahora: ${money(h.after?.price)} / ${h.after?.status}`}))):'<div class="validation-banner">No hay modificaciones en esta demostración.</div>'}`;
    modalActions.innerHTML=`<button class="btn btn-secondary" data-close>Cerrar</button>${canCreateCatalogRequest()?`<button class="btn btn-primary" data-update>${valid?'Utilizar o solicitar actualización':'Solicitar actualización'}</button>`:''}`;openModal('Ficha vigente del Catálogo',true);$('[data-close]',modalActions).onclick=closeModal;
    $('[data-update]',modalActions)?.addEventListener('click',()=>{closeModal();state.lastSearch=x.key;state.prefillCatalogKey=x.key;save();route('cat-request-new');});
  }

  function documentSet(){return [...REQUEST_DOCUMENTS,{id:'docPobalin',label:'Dictamen Técnico POBALIN 059',required:false}];}
  function isSufficiencyDefinition(definition){return definition?.id===SUFFICIENCY_DOCUMENT.id;}
  function requestDocumentsEditorHtml(existing=[],prefix='',rules={},definitions=documentSet()){
    return `<div class="document-upload-grid">${definitions.map(d=>{const old=existing.find(x=>x.id===d.id),sufficiency=isSufficiencyDefinition(d),notApplicable=d.id==='docPobalin'&&rules.pobalin!=='Sí'||['docFicha','docSpecs'].includes(d.id)&&rules.art28Rule==='No aplica';return `<article class="document-upload-card ${notApplicable?'hidden':''}" data-doc-card="${prefix}${d.id}">
      <div class="document-upload-title"><b>${esc(d.label)}</b>${sufficiency?'<small class="section-help">Documento obligatorio que debe presentar para estar en condiciones de iniciar la solicitud.</small>':d.required?'<span class="required-chip">Requerido según regla</span>':'<span class="optional-chip">Condicional / complementario</span>'}</div>
      ${sufficiency?'':`<div class="document-presence"><span>¿Se cuenta con el documento?</span><label class="presence-option"><input type="radio" name="${prefix}${d.id}Status" value="si" ${old?.present?'checked':''}> Sí</label><label class="presence-option"><input type="radio" name="${prefix}${d.id}Status" value="no" ${old?.present?'':'checked'}> No</label></div>`}
      <label class="document-file-control">Subir documento<input data-doc-file="${d.id}" type="file" name="${prefix}${d.id}File" accept=".pdf,.png,.jpg,.jpeg"></label><small class="file-selection" data-file-label>${esc(old?.filename||'Sin archivo seleccionado')}</small></article>`}).join('')}</div>`;
  }
  function collectRequestDocuments(form,prefix='',definitions=documentSet()){return definitions.map(d=>{const file=form.elements[`${prefix}${d.id}File`]?.files?.[0],sufficiency=isSufficiencyDefinition(d);return {id:d.id,label:d.label,present:sufficiency?!!file:form.elements[`${prefix}${d.id}Status`]?.value==='si',required:d.required,filename:file?.name||'',size:file?.size||0};});}
  function documentRowHtml(def,d,index,applicable,notApplicable=false){
    return `<div class="request-document-row document-record"><div class="document-record-description"><b>${esc(def.label)}</b><small>${esc(d.filename||'Sin archivo cargado')}${applicable?' · Obligatorio':''}</small>${(d.history||[]).filter(h=>h.previousUrl).map((h,v)=>`<small>Versión anterior ${v+1} · ${esc(h.when)} · ${esc(h.user)} · ${esc(h.reason)} <button type="button" class="link-btn" data-view-old-document="${index}:${(d.history||[]).indexOf(h)}">Ver versión anterior</button></small>`).join('')}</div><div class="document-record-status">${badge(notApplicable?'No aplica':isDocumentAvailable(d)?'Cargado':applicable?'Pendiente':'Opcional')}</div><div class="document-record-action">${d.url&&!notApplicable?`<button class="btn btn-ghost btn-small" data-view-document="${index}">Ver documento</button>`:''}</div></div>`;
  }
  function requestDocumentsHtml(r){const suff=requestDocument(r),available=allDocuments(r);
    return `<div class="request-document-list"><div class="subhead">Requisito de toda la solicitud · un único Dictamen</div>${documentRowHtml(SUFFICIENCY_DOCUMENT,suff,0,true)}${itemsOf(r).map(i=>{const docs=docsOfItem(r,i),rule=itemRule(i,r);return `<div class="subhead">${esc(i.description)} · ${esc(i.id)} · POBALIN 059: ${esc(rule.pobalin)} · Art. 28: ${esc(rule.art28Rule)}</div>${documentSet().map(def=>{const d=docs.find(x=>x.id===def.id)||{...def,present:false},n=available.indexOf(d),applicable=documentRequired(d,i,r),notApplicable=def.id==='docPobalin'&&rule.pobalin!=='Sí'||['docFicha','docSpecs'].includes(def.id)&&rule.art28Rule==='No aplica';return documentRowHtml(def,d,n,applicable,notApplicable);}).join('')}`;}).join('')}</div>`;
  }
  function bindDocPreview(r,root){$$('[data-view-document]',root).forEach(b=>b.onclick=()=>previewDocument(allDocuments(r)[Number(b.dataset.viewDocument)]));$$('[data-view-old-document]',root).forEach(b=>b.onclick=()=>{const [n,v]=b.dataset.viewOldDocument.split(':').map(Number),d=allDocuments(r)[n];previewDocument({...d,url:d?.history?.[v]?.previousUrl});});}
  function itemEditorHtml(i,x={}){const key=x.key||'',current=catalogEntry(key);return `<article class="card mt24" data-item-row="${i}"><div class="card-head"><h3>Bien / servicio ${i+1}</h3>${i?`<button type="button" class="btn btn-ghost btn-small" data-remove-item>Quitar</button>`:''}</div><div class="form-grid cols2">
    <label>Clave del catálogo<select name="itemKey-${i}" data-item-key><option value="">Nuevo · no existe en catálogo</option>${state.catalog.map(c=>`<option value="${esc(c.key)}" ${c.key===key?'selected':''}>${esc(c.key)} · ${esc(c.description)} (${esc(c.status)})</option>`).join('')}</select></label>
    <label>Tipo<select name="itemType-${i}" data-item-type><option ${x.type==='Servicio'?'':'selected'}>Bien</option><option ${x.type==='Servicio'?'selected':''}>Servicio</option></select></label>
    <label>Acción para clave existente<select name="itemAction-${i}" data-item-action><option value="use" ${x.movement?.startsWith('Uso de')?'selected':''}>Usar vigente, si procede</option><option value="update" ${x.movement?.startsWith('Uso de')?'':'selected'}>Solicitar actualización</option></select></label>
    <label>Situación / movimiento<input name="itemMovement-${i}" data-item-movement readonly value="${esc(x.movement||'Alta de bien')}"></label>
    <label class="span2">Descripción<textarea name="itemDescription-${i}" data-item-description rows="2" required>${esc(x.description||current?.description||'')}</textarea></label>
    <label class="span2">Especificación, alcance y entregables<textarea name="itemSpecs-${i}" rows="2" required>${esc(x.specs||'')}</textarea></label>
    <label>Partida / clasificador<select name="itemPartida-${i}" data-item-partida required><option value="">Seleccione una partida...</option>${PARTIDAS.map(p=>`<option value="${p.key}" ${p.key===x.partida?'selected':''}>${p.key} · ${esc(p.name)} (${p.type})</option>`).join('')}</select></label>
    <label>Unidad de medida<select name="itemUnit-${i}" data-item-unit required>${UNITS.map(u=>`<option ${u===(x.unit||current?.unit||'Pieza')?'selected':''}>${u}</option>`).join('')}</select></label>
    <label>Cantidad requerida<input name="itemQuantity-${i}" type="number" min="1" value="${x.quantity||1}" required></label>
    <label>Precio / vigencia existente<input data-item-validity readonly value="${current?`${money(current.price)} · ${esc(current.priceValidUntil||'vigencia no definida')}`:'No existe'}"></label></div>
    <div class="subhead">Requisitos y controles de este bien o servicio</div><div class="form-grid cols2"><label>Dictamen Técnico POBALIN 059<select name="itemPobalin-${i}" data-item-pobalin><option ${x.pobalin==='Sí'?'':'selected'}>No aplica</option><option ${x.pobalin==='Sí'?'selected':''}>Sí</option></select></label><label>Regla Art. 28<select name="itemArt28-${i}" data-item-art28><option ${x.art28Rule==='No aplica'?'':'selected'}>Aplica</option><option ${x.art28Rule==='No aplica'?'selected':''}>No aplica</option></select></label><label class="span2">Justificación de no aplicación del Art. 28<textarea name="itemArt28Reason-${i}" rows="2">${esc(x.art28Reason||'')}</textarea></label></div>
    ${requestDocumentsEditorHtml(x.documentDetails||[],`${i}-`,{pobalin:x.pobalin||'No aplica',art28Rule:x.art28Rule||'Aplica'})}</article>`;}
  function syncItemRow(row){const key=row.querySelector('[data-item-key]').value,c=catalogEntry(key),type=row.querySelector('[data-item-type]'),action=row.querySelector('[data-item-action]'),description=row.querySelector('[data-item-description]'),partida=row.querySelector('[data-item-partida]'),unit=row.querySelector('[data-item-unit]');
    if(c){type.value=c.type;if(!description.value.trim())description.value=c.description;partida.value=c.partida;unit.value=c.unit;}
    const valid=!!c && c.status==='Vigente' && !!c.priceValidUntil && c.priceValidUntil>=new Date().toISOString().slice(0,10);
    if(!c)action.value='update';if(c&&!valid)action.value='update';
    const movement=c?(action.value==='use'&&valid?'Uso de bien o servicio existente/vigente':`Actualización de ${type.value.toLowerCase()}`):`Alta de ${type.value.toLowerCase()}`;
    row.querySelector('[data-item-movement]').value=movement;
    row.querySelector('[data-item-validity]').value=c?`${money(c.price)} · ${c.priceValidUntil||'vigencia no definida'}${valid?' · Vigente':' · Requiere actualización'}`:'No existe';
  }
  function collectItems(form){return $$('[data-item-row]',form).map((row,index)=>{const f=new FormData(form),id=row.dataset.itemRow,key=String(f.get(`itemKey-${id}`)||''),c=catalogEntry(key),type=String(f.get(`itemType-${id}`)||'Bien'),movement=String(f.get(`itemMovement-${id}`)||''),partida=String(f.get(`itemPartida-${id}`)||'');return {id:`${index+1}`,key,description:String(f.get(`itemDescription-${id}`)||'').trim(),specs:String(f.get(`itemSpecs-${id}`)||'').trim(),partida,unit:String(f.get(`itemUnit-${id}`)||''),type,movement,situation:c?`${c.status} · ${c.priceValidUntil||'sin vigencia'}`:'No existe',giro:PARTIDAS.find(p=>p.key===partida)?.giro||'',quantity:Number(f.get(`itemQuantity-${id}`)||1),pobalin:String(f.get(`itemPobalin-${id}`)||'No aplica'),art28Rule:String(f.get(`itemArt28-${id}`)||'Aplica'),art28Reason:String(f.get(`itemArt28Reason-${id}`)||'').trim(),documentDetails:collectRequestDocuments(form,`${id}-`),sources:[],price:movement.startsWith('Uso de')?c?.price:null,validUntil:movement.startsWith('Uso de')?c?.priceValidUntil:'',result:movement.startsWith('Uso de')?'Uso de registro vigente':'Pendiente'};});}
  function itemValidation(items,giro){if(!items.length)return 'Agregue al menos un bien o servicio.';
    if(items.some(i=>!i.description||!i.specs||!i.partida||!i.unit||!i.quantity||i.quantity<1))return 'Complete la descripción, especificación, partida, unidad y cantidad de todos los bienes o servicios.';
    if(items.some(i=>i.giro!==giro||PARTIDAS.find(p=>p.key===i.partida)?.type!==i.type))return 'Todos los bienes y servicios deben corresponder al mismo giro y la partida debe coincidir con el tipo seleccionado.';
    if(items.some(i=>i.key&&!catalogEntry(i.key)))return 'Seleccione una clave existente válida del Catálogo.';
    if(items.some(i=>i.movement.startsWith('Uso de') && !((c)=>c&&c.status==='Vigente'&&c.priceValidUntil>=new Date().toISOString().slice(0,10))(catalogEntry(i.key))))return 'No se puede utilizar una clave inactiva o con precio sin vigencia. Solicite actualización.';
    if(items.some(i=>i.movement.startsWith('Uso de')&&i.description.trim()!==catalogEntry(i.key)?.description.trim()))return 'No modifique la descripción de una clave vigente al utilizarla; solicite su actualización.';
    if(items.some(i=>i.movement.startsWith('Alta')&&state.catalog.some(c=>c.description.trim().toLowerCase()===i.description.trim().toLowerCase())))return 'El bien o servicio ya existe en el Catálogo. Utilice la clave vigente o solicite actualización.';
    const tokens=items.map(i=>i.key||`${i.type}:${i.description.toLowerCase().trim()}`);if(new Set(tokens).size!==tokens.length)return 'La solicitud contiene bienes o servicios duplicados.';
    return '';
  }
  function renderRequestForm(){
    if(!canCreateCatalogRequest()){toast('Este perfil no puede crear solicitudes.');return;}
    const isCa=state.role==='ca',pre=catalogEntry(state.prefillCatalogKey),initial=pre?{key:pre.key,type:pre.type,description:pre.description,partida:pre.partida,unit:pre.unit,movement:pre.status==='Vigente'&&pre.priceValidUntil>=new Date().toISOString().slice(0,10)?'Uso de bien o servicio existente/vigente':`Actualización de ${pre.type.toLowerCase()}`}:{type:'Bien'};
    header('Solicitud de Catálogo','Alta / actualización',isCa?'La Coordinación Administrativa puede iniciar directamente una solicitud sin petición previa del Área Requirente.':'El Área Requirente turna la solicitud a su Coordinación Administrativa para revisión documental.');
    content.innerHTML=`<form class="card" id="catalogRequestForm"><div class="card-head"><div><span class="kicker">UI-02</span><h3>${isCa?'Nueva solicitud iniciada por Coordinación Administrativa':'Nueva solicitud del Área Requirente'}</h3></div><span class="status-badge">Borrador</span></div>
      <div class="validation-banner routing">${isCa?'Origen directo de Coordinación Administrativa → revisión documental → Oficialía Mayor.':'Área Requirente → Coordinación Administrativa → Oficialía Mayor.'}</div>
      <div class="validation-banner ${state.lastSearch?'ok':'warning'}">${state.lastSearch?'Consulta previa del Catálogo registrada.':'Antes de solicitar alta, realice una consulta previa del Catálogo.'}</div>
      <div class="form-grid cols2 mt24"><label>Dependencia<input name="dependency" value="${esc(activeDependency().name)}" readonly></label>
      ${isCa?'<label>Origen<input value="Coordinación Administrativa · inicio directo" readonly></label><input type="hidden" name="requestingArea" value="">':`<label>Área usuaria / requirente<input name="requestingArea" value="${esc(actor())}" required></label>`}
      <label>Coordinación Administrativa<input name="adminCoord" value="Coordinación Administrativa · DEMO" readonly></label>
      <label>Giro o ámbito común<select name="giro" required><option value="">Seleccione...</option>${[...new Set(PARTIDAS.map(x=>x.giro))].map(g=>`<option ${g===(pre?.family||'')?'selected':''}>${esc(g)}</option>`).join('')}</select></label>
      <label>Prioridad<select name="priority"><option>Normal</option><option>Alta</option></select></label><label class="span2">Justificación de la solicitud<textarea name="justification" rows="2" required></textarea></label></div>
      <div class="subhead">Documento obligatorio de toda la solicitud</div>${requestDocumentsEditorHtml([], 'request-', {}, [SUFFICIENCY_DOCUMENT])}
      <div id="requestItemRows">${itemEditorHtml(0,initial)}</div><div class="actions mt24"><button type="button" class="btn btn-secondary" id="addRequestItem">Agregar bien o servicio</button></div>
      <p class="section-help">El Oficio de Dictamen de Suficiencia Presupuestal se carga una sola vez por solicitud y es obligatorio antes de enviarla desde el Área Requirente. POBALIN 059 sólo se exige para el elemento marcado Sí. PDF, PNG, JPG o JPEG (máx. 1.5 MB por archivo en esta demo).</p><div id="duplicateBox"></div><div class="actions mt24"><button class="btn btn-secondary" type="button" data-back-requests>Cancelar</button><button class="btn btn-primary" type="submit">${isCa?'Crear solicitud para validación':'Enviar a Coordinación Administrativa'}</button></div></form>`;
    const form=$('#catalogRequestForm');let next=1;
    const bindRow=row=>{const updateConditions=()=>{const pob=row.querySelector('[data-item-pobalin]').value,art=row.querySelector('[data-item-art28]').value;row.querySelector('[data-doc-card$="docPobalin"]').classList.toggle('hidden',pob!=='Sí');['docFicha','docSpecs'].forEach(k=>row.querySelector(`[data-doc-card$="${k}"]`).classList.toggle('hidden',art==='No aplica'));};row.querySelector('[data-item-pobalin]').onchange=updateConditions;row.querySelector('[data-item-art28]').onchange=updateConditions;updateConditions();row.querySelector('[data-item-key]').onchange=()=>{row.querySelector('[data-item-description]').value='';syncItemRow(row);};row.querySelector('[data-item-type]').onchange=()=>syncItemRow(row);row.querySelector('[data-item-action]').onchange=()=>syncItemRow(row);row.querySelector('[data-remove-item]')?.addEventListener('click',()=>row.remove());syncItemRow(row);};
    $$('[data-item-row]',form).forEach(bindRow);
    $('#addRequestItem').onclick=()=>{const holder=$('#requestItemRows'),box=document.createElement('div');box.innerHTML=itemEditorHtml(next++);const row=box.firstElementChild;holder.appendChild(row);bindRow(row);};
    form.addEventListener('change',e=>{const input=e.target.closest?.('[data-doc-file]');if(!input||!form.contains(input))return;const file=input.files?.[0],card=input.closest('[data-doc-card]');if(file&&!validFile(file)){input.value='';card.querySelector('[data-file-label]').textContent='Sin archivo seleccionado';toast('Formato no válido o archivo mayor a 1.5 MB. Sólo se aceptan PDF, PNG, JPG y JPEG.');return;}const presence=card.querySelector('input[value="si"]');if(file&&presence)presence.checked=true;card.querySelector('[data-file-label]').textContent=file?.name||'Sin archivo seleccionado';});
    $('[data-back-requests]',form).onclick=()=>route('cat-requests');form.onsubmit=e=>{e.preventDefault();submitRequest(form);};
  }
  async function submitRequest(form){
    if(!canCreateCatalogRequest())return toast('Este perfil no puede crear solicitudes.');
    const f=new FormData(form),items=collectItems(form),giro=String(f.get('giro')||'');
    if(items.some(i=>i.movement.startsWith('Alta'))&&!state.lastSearch)return toast('Realice primero una consulta del Catálogo antes de solicitar una nueva alta.');
    const error=itemValidation(items,giro);if(error)return toast(error);
    if(!String(f.get('justification')||'').trim())return toast('Capture la justificación de la solicitud.');
    const studyNeeded=items.some(i=>!i.movement.startsWith('Uso de'));
    if(items.some(i=>i.art28Rule==='No aplica'&&!i.art28Reason))return toast('Justifique la no aplicación del Art. 28 para cada elemento correspondiente.');
    const sufficiencyDocument=collectRequestDocuments(form,'request-',[SUFFICIENCY_DOCUMENT])[0];
    try{await enrichDocuments(form,[sufficiencyDocument],'request-');}catch(err){return toast(err.message);}
    if(!isDocumentAvailable(sufficiencyDocument))return toast('Debe cargar el Oficio de Dictamen de Suficiencia Presupuestal para continuar.');
    for(const i of items){if(i.documentDetails.some(d=>d.present&&!d.filename))return toast(`Un documento marcado Sí para ${i.description} debe tener archivo cargado.`);
      try{i.documentDetails=await enrichDocuments(form,i.documentDetails,`${$$('[data-item-row]',form)[Number(i.id)-1].dataset.itemRow}-`);}catch(err){return toast(err.message);}}
    if(state.role==='area'){const missing=missingDocuments({items,sufficiencyDocument});if(missing.length)return toast(`No puede enviar a Coordinación Administrativa: ${missing.map(missingLabel).join('; ')}`);}
    const n=Math.max(0,...state.requests.map(r=>Number(String(r.folio||'').match(/(\d+)$/)?.[1]||0)))+1;
    const folio=`CAT-${new Date().getFullYear()}-${String(n).padStart(4,'0')}`,first=items[0],isCa=state.role==='ca';
    const r={folio,owner:actor(),dependency:activeDependency().name,requestingArea:String(f.get('requestingArea')||'').trim(),adminCoord:String(f.get('adminCoord')),origin:isCa?'Coordinación Administrativa · inicio directo':'Área requirente / usuaria',unit:first.unit,movement:first.movement,itemType:first.type,description:first.description,classification:first.partida,unitMeasure:first.unit,quantity:first.quantity,priority:String(f.get('priority')),giro,justification:String(f.get('justification')),items,sufficiencyDocument,documents:[sufficiencyDocument,...items.flatMap(i=>i.documentDetails)].filter(isDocumentAvailable).length,pobalinStatus:items.some(i=>i.pobalin==='Sí')?'Pendiente de revisión':'No aplica',art28:'Pendiente',state:studyNeeded?'Enviado a Coordinación Administrativa':'Concluida',caStage:studyNeeded?(isCa?'validation':'received'):'sent',sentToOfficialia:false,investigator:'',created:new Date().toISOString().slice(0,10),version:1,notes:'',duplicateHint:first.key||'',study:'',timeline:[],catalogUpdated:!studyNeeded};
    items.forEach(i=>{if(!i.key)i.verificationKey=`PMCP-${folio}-${i.id}`;});state.requests.unshift(r);state.selectedRequest=folio;state.prefillCatalogKey='';const persisted=transition(r,r.state,studyNeeded?(isCa?'Inicio directo por Coordinación Administrativa':'Solicitud enviada a Coordinación Administrativa'):'Uso de bien o servicio vigente',`${items.length} elemento(s) · ${giro}`);
    if(!persisted){state.requests.shift();return;}if(isCa||!studyNeeded)openRequestDetail(folio);else showSubmissionMessage(AREA_TO_CA_REMITTAL,()=>openRequestDetail(folio));
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
    return ({received:'Recibidas del área requirente',validation:'Para validar',returned:'Devueltas',sent:'Enviadas a Oficialía Mayor'})[bucket]||'Bandeja';
  }

  function renderCaQueueTabs(){
    const buckets=['received','validation','returned','sent'];
    const meta={
      received:{short:'Recibidas',help:'Ingresaron desde el área usuaria/requirente y aún no se toma la validación.'},
      validation:{short:'Para validar',help:'La Coordinación Administrativa está revisando integración y documentos.'},
      returned:{short:'Devueltas',help:'Recibieron observaciones y requieren gestión con el área usuaria/requirente.'},
      sent:{short:'Enviadas a Oficialía Mayor',help:'Ya fueron validadas y enviadas exclusivamente por la Coordinación Administrativa.'}
    };
    return `<div class="ca-inbox" role="tablist" aria-label="Bandeja de Coordinación Administrativa">${buckets.map(b=>{
      const count=visibleRequests().filter(r=>caBucket(r)===b).length;
      return `<button type="button" class="ca-inbox-tab ${caQueue===b?'active':''}" data-ca-queue="${b}" role="tab" aria-selected="${caQueue===b?'true':'false'}"><span>${esc(meta[b].short)}</span><strong>${count}</strong><small>${esc(meta[b].help)}</small></button>`;
    }).join('')}</div>`;
  }

  function renderRequests(){
    const isCa=state.role==='ca';
    header('Solicitudes de Catálogo',isCa?'Bandeja de Coordinación Administrativa':'Bandeja y seguimiento',isCa?'Controle la recepción, el inicio directo de altas, la validación, las devoluciones y el envío exclusivo a la Oficialía Mayor.':'Consulte solicitudes por folio, dependencia, movimiento, responsable, estado y antigüedad. El canal de envío se controla por perfil.');
    const action=state.role==='area'?'<button class="btn btn-primary" data-new-request>Crear solicitud</button>':isCa?'<button class="btn btn-primary" data-new-request>Iniciar alta de bien o servicio</button>':'<span class="status-badge">Consulta institucional</span>';
    content.innerHTML=`<div class="card"><div class="section-heading compact"><div><span class="kicker">UI-03 / UI-04</span><h3>${isCa?'Bandeja de la Coordinación Administrativa':'Bandeja de solicitudes'}</h3></div>${action}</div>
      <div class="validation-banner routing"><b>Ruta de la solicitud:</b> el Área usuaria/requirente puede turnarla a la Coordinación Administrativa; la Coordinación también puede iniciarla directamente y es la única que la envía a la Oficialía Mayor.</div>
      ${isCa?`<p class="section-help">La Coordinación Administrativa es la compuerta exclusiva: recibe solicitudes de las áreas, puede iniciar altas directamente, valida la integración, gestiona devoluciones y envía a la Oficialía Mayor.</p>${renderCaQueueTabs()}`:''}
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
    const tableHead=state.role==='ca'?'<tr><th>Folio</th><th>Origen / área usuaria</th><th>Movimiento</th><th>Descripción</th><th>Etapa CA</th><th>Estado general</th><th></th></tr>':'<tr><th>Folio</th><th>Dependencia</th><th>Movimiento</th><th>Descripción</th><th>Responsable</th><th>Estado</th><th></th></tr>';
    const tableRows=rows.map(r=>state.role==='ca'?`<tr><td><b>${esc(r.folio)}</b><small>${esc(r.created)}</small></td><td><b>${esc(r.requestingArea||r.origin||r.unit||'Área requirente · DEMO')}</b><small>${esc(r.dependency)}</small></td><td>${esc(r.movement)}</td><td>${esc(r.description)}</td><td><span class="ca-stage-pill ${caBucket(r)}">${esc(caQueueLabel(caBucket(r)))}</span></td><td>${badge(r.state)}</td><td><button class="btn btn-ghost btn-small" data-open-request="${r.folio}">Abrir</button></td></tr>`:`<tr><td><b>${esc(r.folio)}</b><small>${esc(r.created)}</small></td><td>${esc(r.dependency)}</td><td>${esc(r.movement)}</td><td>${esc(r.description)}</td><td>${esc(r.investigator||'Sin asignar')}</td><td>${badge(r.state)}</td><td><button class="btn btn-ghost btn-small" data-open-request="${r.folio}">Abrir</button></td></tr>`).join('');
    $('#requestTable').innerHTML=`<article class="card"><div class="card-head"><div><span class="kicker">${state.role==='ca'?'Coordinación Administrativa':'Seguimiento'}</span><h3>${state.role==='ca'?esc(caQueueLabel(caQueue)):`${rows.length} solicitud(es)`}</h3></div><span class="status-badge">${rows.length} registro(s)</span></div><div class="table-wrap"><table class="data-table"><thead>${tableHead}</thead><tbody>${tableRows||`<tr><td colspan="7"><div class="empty-queue">${esc(empty)}</div></td></tr>`}</tbody></table></div></article>`; bindRequestLinks($('#requestTable'));
  }

  function openCommunicationModal(r){
    if(!roleCanSee(r)||!['ca','direccion'].includes(state.role))return toast('Este perfil no puede generar comunicaciones institucionales.');
    const types=['Comunicación institucional','Oficio','Notificación de devolución','Notificación de autorización'];
    modalBody.innerHTML=`<p>Se utilizarán automáticamente la dependencia, área, folio, bienes y servicios, estado y responsables del expediente.</p><label>Tipo de comunicación<select id="communicationType">${types.map(x=>`<option>${esc(x)}</option>`).join('')}</select></label><div class="validation-banner routing">Solicitud ${esc(r.folio)} · ${itemsOf(r).length} elemento(s) · ${esc(r.resultDocument?.id||'Sin oficio de resultado aún')}</div>`;
    modalActions.innerHTML='<button class="btn btn-secondary" data-close>Cancelar</button><button class="btn btn-primary" data-generate-communication>Generar documento</button>';openModal(`Comunicación · ${r.folio}`,true);
    $('[data-close]',modalActions).onclick=()=>openRequestDetail(r.folio);
    $('[data-generate-communication]',modalActions).onclick=()=>{const type=$('#communicationType').value,entries=r.communications||[];if(entries.some(c=>c.type===type&&c.stage===r.state))return toast('Este tipo de comunicación ya fue generado para la misma etapa.');
      const seq=Math.max(0,...state.requests.flatMap(x=>(x.communications||[]).map(c=>Number(c.id?.match(/(\d+)$/)?.[1]||0))))+1;
      const id=`COM-${new Date().getFullYear()}-${String(seq).padStart(6,'0')}`;
      const comm={id,type,stage:r.state,date:stamp(),sender:actor(),recipient:r.adminCoord,subject:`${type} · solicitud ${r.folio}`,body:`Se comunica el estado ${r.state} de la solicitud ${r.folio} (${r.dependency}). ${itemsOf(r).map(i=>`${i.description} · ${i.movement}`).join('; ')}. ${r.resultDocument?`Resultado: ${r.resultDocument.result} · ${r.resultDocument.id}.`:''}`,attachments:allDocuments(r).filter(isDocumentAvailable).length};
      (r.communications||=[]).push(comm);r.communication=comm;audit('Comunicación institucional generada',r.folio,`${type} · ${id}`,r,id);openRequestDetail(r.folio);
    };
  }
  function openRequestDetail(folio){
    const r=req(folio);if(!roleCanSee(r)){toast('No tiene acceso a este expediente.');return;}setSelectedRequest(folio);
    const actions=[],s=study(r.study),bucket=caBucket(r);
    if(state.role==='ca'&&bucket==='received')actions.push('<button class="btn btn-secondary" data-start-ca-review>Iniciar validación</button>');
    if(state.role==='ca'&&bucket==='validation')actions.push('<button class="btn btn-primary" data-ca-review>Revisar documentación y enviar</button>');
    if(state.role==='ca'&&r.state==='Requiere información'&&!r.requestingArea)actions.push('<button class="btn btn-secondary" data-remedy>Corregir documentación</button>');
    if(state.role==='titular'&&['Recibida','Subsanada'].includes(r.state))actions.push('<button class="btn btn-primary" data-assign>Asignar investigador</button>');
    if(state.role==='titular'&&r.investigator&&wasSentToOfficialia(r)&&!r.study&&['Asignada','En revisión'].includes(r.state))actions.push('<button class="btn btn-secondary" data-reassign>Reasignar investigador</button>');
    if(state.role==='investigador'&&['Asignada','En revisión','Enviado a Estudio de Mercado'].includes(r.state))actions.push('<button class="btn btn-primary" data-art28>Revisar documentación</button>');
    if(state.role==='area'&&r.state==='Requiere información')actions.push('<button class="btn btn-primary" data-remedy>Corregir y reenviar a Coordinación Administrativa</button>');
    if(s&&roleCanSeeStudy(s))actions.push(`<button class="btn btn-secondary" data-open-study="${esc(s.folio)}">Abrir estudio</button>`);
    if(r.resultDocument?.id)actions.push('<button class="btn btn-secondary" data-result-preview>Ver Dictamen / Oficio de Resultado</button>');
    if(['ca','direccion'].includes(state.role))actions.push('<button class="btn btn-secondary" data-communication>Generar oficio / aviso</button>');
    const items=itemsOf(r);
    modalBody.innerHTML=`<div class="detail-grid"><div><small>Folio</small><strong>${esc(r.folio)}</strong></div><div><small>Estado</small><strong>${esc(r.state)}</strong></div>${state.role==='ca'?`<div><small>Etapa CA</small><strong>${esc(caQueueLabel(bucket))}</strong></div>`:''}<div><small>Dependencia</small><strong>${esc(r.dependency)}</strong></div><div><small>Origen</small><strong>${esc(r.origin||'Área requirente / usuaria')}</strong></div><div><small>Área usuaria / requirente</small><strong>${esc(r.requestingArea||'No aplica · inicio directo')}</strong></div><div><small>Coordinación Administrativa</small><strong>${esc(r.adminCoord)}</strong></div><div><small>Investigador</small><strong>${esc(r.investigator||'Sin asignar')}</strong></div><div><small>Envío a Oficialía Mayor</small><strong>${wasSentToOfficialia(r)?'Realizado':'Pendiente'}</strong></div><div><small>Giro</small><strong>${esc(r.giro||'No especificado')}</strong></div><div><small>Versión</small><strong>${r.version||1}</strong></div><div><small>Dictamen de Suficiencia Presupuestal · solicitud</small><strong>${isDocumentAvailable(requestDocument(r))?'Cargado':'Pendiente'}</strong></div><div><small>POBALIN 059 por elemento</small><strong>${esc(itemsOf(r).map(i=>`${i.id}: ${itemRule(i,r).pobalin}`).join(' · '))}</strong></div><div><small>Art. 28 por elemento</small><strong>${esc(itemsOf(r).map(i=>`${i.id}: ${itemRule(i,r).art28Rule}`).join(' · '))}</strong></div><div><small>Oficio de resultado</small><strong>${esc(r.resultDocument?.id||'Pendiente')}</strong></div></div>
      <div class="subhead">Bienes y servicios (${items.length})</div><div class="table-wrap"><table class="data-table"><thead><tr><th>Clave</th><th>Descripción</th><th>Partida</th><th>Unidad</th><th>Movimiento</th><th>Situación</th><th>Precio</th></tr></thead><tbody>${items.map(i=>`<tr><td>${esc(i.key||'Por asignar')}</td><td>${esc(i.description)}</td><td>${esc(i.partida)}</td><td>${esc(i.unit)}</td><td>${esc(i.movement)}</td><td>${esc(i.situation)}</td><td>${money(resultOf(s,i).price??i.price)}</td></tr>`).join('')}</tbody></table></div>
      <div class="subhead">Documentos de la solicitud y por bien/servicio · Art. 28 / presupuesto / POBALIN 059</div>${requestDocumentsHtml(r)}
      ${r.resultDocument?`<div class="validation-banner ok"><b>Dictamen / Oficio de Resultado del Estudio de Mercado:</b> ${esc(r.folio)} → ${esc(r.resultDocument.id)} · ${esc(r.resultDocument.status)} · ${esc(r.resultDocument.result)}</div>`:''}
      ${(r.communications||[]).length?`<div class="subhead">Comunicaciones institucionales</div><div class="request-document-list">${r.communications.map((c,n)=>`<div class="request-document-row"><div><b>${esc(c.id)} · ${esc(c.type)}</b><small>${esc(c.date)} · ${esc(c.stage)}</small></div><button class="btn btn-ghost btn-small" data-communication-preview="${n}">Ver oficio</button></div>`).join('')}</div>`:''}
      <div class="subhead">Trazabilidad</div><div class="timeline">${(r.timeline||[]).map((t,n)=>`<div class="timeline-item ${n===r.timeline.length-1?'current':'done'}"><span class="timeline-dot"></span><div><strong>${esc(t.label)}</strong><small>${esc(t.when)} · ${esc(t.detail)}</small></div></div>`).join('')}</div>`;
    modalActions.innerHTML=`<button class="btn btn-ghost" data-close>Volver</button>${actions.join('')}`;openModal(`Expediente ${folio}`,true);
    $('[data-close]',modalActions).onclick=closeModal;bindDocPreview(r,modalBody);
    $('[data-start-ca-review]',modalActions)?.addEventListener('click',()=>{r.caStage='validation';transition(r,'En revisión documental','Inicio de revisión CA','Primer filtro documental de la Dependencia');closeModal();caQueue='validation';renderRequests();});
    $('[data-ca-review]',modalActions)?.addEventListener('click',()=>openCaReview(r));
    $('[data-assign]',modalActions)?.addEventListener('click',()=>openAssignModal(r,false));
    $('[data-reassign]',modalActions)?.addEventListener('click',()=>openAssignModal(r,true));
    $('[data-art28]',modalActions)?.addEventListener('click',()=>openArt28Modal(r));
    $('[data-remedy]',modalActions)?.addEventListener('click',()=>openRemedyModal(r));
    $('[data-result-preview]',modalActions)?.addEventListener('click',()=>window.MarketDocuments?.preview('result',documentContext(r,s)));
    $('[data-communication]',modalActions)?.addEventListener('click',()=>openCommunicationModal(r));
    $$('[data-communication-preview]',modalBody).forEach(b=>b.onclick=()=>window.MarketDocuments?.preview('communication',documentContext({...r,communication:r.communications[Number(b.dataset.communicationPreview)]},s)));
    $('[data-open-study]',modalActions)?.addEventListener('click',()=>{closeModal();route('cat-studies');openStudyDetail(s.folio);});
  }
  function openCaReview(r){if(state.role!=='ca'||!roleCanSee(r)||caBucket(r)!=='validation')return toast('Esta solicitud no está en validación de la Coordinación Administrativa.');
    const items=itemsOf(r);
    modalBody.innerHTML=`<p>Primer filtro documental. Verifique los requisitos de cada bien o servicio antes del envío a la Oficialía Mayor.</p>${requestDocumentsHtml(r)}<div class="validation-banner ${missingDocuments(r).length?'warning':'ok'}">${missingDocuments(r).length?`Faltan: ${missingDocuments(r).map(x=>esc(missingLabel(x))).join('; ')}`:'Los documentos obligatorios están cargados.'}</div>
      ${items.map(i=>`<div class="subhead">${esc(i.description)}</div><div class="form-grid cols2"><label>Regla Art. 28<select data-ca-rule="${esc(i.id)}"><option ${itemRule(i,r).art28Rule==='No aplica'?'':'selected'}>Aplica</option><option ${itemRule(i,r).art28Rule==='No aplica'?'selected':''}>No aplica</option></select></label><label>Justificación si no aplica<input data-ca-reason="${esc(i.id)}" value="${esc(i.art28Reason||r.art28Reason||'')}"></label></div>`).join('')}
      <div class="review-checklist"><label class="review-check"><input type="checkbox" id="caCheckItems"><span>Revisé todos los bienes y servicios del expediente</span></label><label class="review-check"><input type="checkbox" id="caCheckDocs"><span>Revisé los documentos adjuntos y su integridad</span></label></div><label>Motivo de devolución / observaciones<textarea id="caReturnReason" rows="3" placeholder="Obligatorio para devolver"></textarea></label>`;
    modalActions.innerHTML='<button class="btn btn-ghost" data-close>Volver</button><button class="btn btn-warning" data-return>Devolver para corrección</button><button class="btn btn-primary" data-send>Validar y enviar a Oficialía Mayor</button>';openModal('Revisión documental de Coordinación Administrativa',true);bindDocPreview(r,modalBody);
    $('[data-close]',modalActions).onclick=()=>openRequestDetail(r.folio);
    $('[data-return]',modalActions).onclick=()=>{if(state.role!=='ca'||caBucket(r)!=='validation')return toast('Etapa no disponible.');const reason=$('#caReturnReason').value.trim();if(!reason)return toast('Capture obligatoriamente el motivo de devolución.');r.caStage='returned';r.notes=reason;transition(r,'Requiere información','Solicitud devuelta para corrección',reason);closeModal();renderRequests();};
    $('[data-send]',modalActions).onclick=()=>{
      if(state.role!=='ca'||!roleCanSee(r)||caBucket(r)!=='validation'||wasSentToOfficialia(r))return toast('El envío ya se realizó o la solicitud no está en validación.');
      const reviewed=items.map(i=>({...i,documentDetails:docsOfItem(r,i),art28Rule:$(`[data-ca-rule="${i.id}"]`,modalBody).value,art28Reason:$(`[data-ca-reason="${i.id}"]`,modalBody).value.trim()}));
      if(reviewed.some(i=>i.art28Rule==='No aplica'&&!i.art28Reason))return toast('Justifique la no aplicación del Art. 28 por bien o servicio.');
      const missing=missingDocuments({...r,items:reviewed});if(missing.length)return toast(`No puede avanzar: ${missing.map(missingLabel).join('; ')}. Devuelva la solicitud para corrección.`);
      if(!$('#caCheckItems').checked||!$('#caCheckDocs').checked)return toast('Confirme la revisión de bienes/servicios y documentación antes del envío.');
      r.items=reviewed;r.art28=reviewed.every(i=>i.art28Rule==='No aplica')?'No aplica':'Pendiente';r.caStage='sent';r.sentToOfficialia=true;r.notes='';r.pobalinStatus=reviewed.some(i=>i.pobalin==='Sí')?'En revisión':'No aplica';
      let persisted;if(r.investigator){persisted=transition(r,'Asignada','Subsanación reenviada al analista original',r.investigator);if(persisted)persisted=audit('Reasignación automática',r.folio,`Analista original: ${r.investigator}`,r).persisted;}else persisted=transition(r,'Recibida','Solicitud enviada correctamente','Validada por Coordinación Administrativa y recibida en Oficialía Mayor');if(!persisted)return;closeModal();caQueue='sent';renderRequests();showSubmissionMessage(CA_TO_OM_REMITTAL);
    };
  }
  async function updateRemedyDocument(def,oldDoc,card,reason){
    const file=$('[data-doc-file]',card)?.files?.[0],sufficiency=isSufficiencyDefinition(def),oldAvailable=isDocumentAvailable(oldDoc);
    if(file&&!validFile(file))throw Error('Sólo PDF, PNG, JPG o JPEG no vacíos (máx. 1.5 MB).');
    const presence=$('input[value="si"]',card),d={...oldDoc,present:sufficiency?oldAvailable:(presence?presence.checked:oldAvailable)};
    if(file){const url=await readFile(file);if(!validSignature(url,file.name))throw Error(`El contenido de ${file.name} no corresponde a su formato declarado.`);
      if(sufficiency)d.present=true;d.history=[...(d.history||[]),{when:stamp(),user:actor(),filename:file.name,version:(d.version||1)+1,reason,previousUrl:d.url||''}];d.filename=file.name;d.url=url;d.size=file.size;d.version=(d.version||1)+1;d.status='Cargado';}
    return d;
  }
  function openRemedyModal(r){if(!roleCanSee(r)||r.state!=='Requiere información'||!['area','ca'].includes(state.role))return;
    const items=itemsOf(r);modalBody.innerHTML=`<div class="validation-banner warning">Observaciones: ${esc(r.notes||'Pendiente de subsanación')}</div><p>Corrija los anexos y controles. Los documentos anteriores conservan su versión e historial.</p><div class="subhead">Dictamen de Suficiencia Presupuestal de toda la solicitud</div>${requestDocumentsEditorHtml([requestDocument(r)],'request-',{},[SUFFICIENCY_DOCUMENT])}${items.map((i,n)=>`<div class="subhead">${esc(i.description)}</div><div data-remedy-row="${n}"><div class="form-grid cols2"><label>POBALIN 059<select data-remedy-pobalin><option ${itemRule(i,r).pobalin==='Sí'?'':'selected'}>No aplica</option><option ${itemRule(i,r).pobalin==='Sí'?'selected':''}>Sí</option></select></label><label>Regla Art. 28<select data-remedy-art28><option ${itemRule(i,r).art28Rule==='No aplica'?'':'selected'}>Aplica</option><option ${itemRule(i,r).art28Rule==='No aplica'?'selected':''}>No aplica</option></select></label><label class="span2">Justificación Art. 28 No aplica<input data-remedy-reason value="${esc(i.art28Reason||r.art28Reason||'')}"></label></div>${requestDocumentsEditorHtml(docsOfItem(r,i),`${n}-`,itemRule(i,r))}</div>`).join('')}<label>Respuesta a observaciones<textarea id="remedyNotes" rows="3" required></textarea></label>`;
    modalActions.innerHTML='<button class="btn btn-ghost" data-close>Cancelar</button><button class="btn btn-primary" data-remedy-save>Reenviar correcciones a Coordinación Administrativa</button>';openModal(`Subsanación ${r.folio}`,true);
    $('[data-close]',modalActions).onclick=()=>openRequestDetail(r.folio);
    $$('[data-remedy-row]',modalBody).forEach(row=>{const update=()=>{row.querySelector('[data-doc-card$="docPobalin"]').classList.toggle('hidden',row.querySelector('[data-remedy-pobalin]').value!=='Sí');['docFicha','docSpecs'].forEach(k=>row.querySelector(`[data-doc-card$="${k}"]`).classList.toggle('hidden',row.querySelector('[data-remedy-art28]').value==='No aplica'));};row.querySelector('[data-remedy-pobalin]').onchange=update;row.querySelector('[data-remedy-art28]').onchange=update;update();});
    $$('[data-doc-file]',modalBody).forEach(input=>input.onchange=()=>{const file=input.files?.[0];if(file&&!validFile(file)){input.value='';return toast('Formato no válido o archivo mayor a 1.5 MB. Sólo PDF, PNG, JPG y JPEG.');}if(file){const presence=input.closest('[data-doc-card]').querySelector('input[value="si"]');if(presence)presence.checked=true;input.closest('[data-doc-card]').querySelector('[data-file-label]').textContent=file.name;}});
    $('[data-remedy-save]',modalActions).onclick=async()=>{if(!roleCanSee(r)||r.state!=='Requiere información'||!['area','ca'].includes(state.role))return toast('La solicitud ya no está en subsanación.');const reason=$('#remedyNotes').value.trim();if(!reason)return toast('Indique cómo atendió las observaciones.');
      try{
        const sufficiencyDocument=await updateRemedyDocument(SUFFICIENCY_DOCUMENT,requestDocument(r),$('[data-doc-card="request-docSuficiencia"]',modalBody),reason);
        const updated=[];for(let n=0;n<items.length;n++){const oldItem=items[n],row=$(`[data-remedy-row="${n}"]`,modalBody),pobalin=$('[data-remedy-pobalin]',row).value,art28Rule=$('[data-remedy-art28]',row).value,art28Reason=$('[data-remedy-reason]',row).value.trim();if(art28Rule==='No aplica'&&!art28Reason)return toast('Justifique No aplica para Art. 28 por bien o servicio.');
          const documentDetails=[];for(const def of documentSet()){const oldDoc=docsOfItem(r,oldItem).find(d=>d.id===def.id)||{...def,history:[]},card=$(`[data-doc-card="${n}-${def.id}"]`,row);documentDetails.push(await updateRemedyDocument(def,oldDoc,card,reason));}
          updated.push({...oldItem,pobalin,art28Rule,art28Reason,documentDetails});}
        const missing=missingDocuments({...r,items:updated,sufficiencyDocument});if(missing.length)return toast(`No puede reenviar: ${missing.map(missingLabel).join('; ')}`);
        r.items=updated;r.sufficiencyDocument=sufficiencyDocument;r.documents=[sufficiencyDocument,...updated.flatMap(i=>i.documentDetails)].filter(isDocumentAvailable).length;r.version=(r.version||1)+1;r.art28=updated.every(i=>i.art28Rule==='No aplica')?'No aplica':'Pendiente';r.pobalinStatus=updated.some(i=>i.pobalin==='Sí')?'Pendiente de revisión':'No aplica';r.sentToOfficialia=false;r.caStage='received';r.notes='';const persisted=transition(r,'Enviado a Coordinación Administrativa','Correcciones reenviadas',reason);if(!persisted)return;closeModal();renderRequests();showSubmissionMessage(AREA_TO_CA_REMITTAL,()=>openRequestDetail(r.folio));
      }catch(err){toast(err.message||'No se pudo leer el documento seleccionado.');}
    };
  }
  function openAssignModal(r,reassign=false){if(state.role!=='titular'||!roleCanSee(r)||reassign&&(!!r.study||!['Asignada','En revisión'].includes(r.state)))return;
    modalBody.innerHTML=`<p>${reassign?'Registre el motivo y el nuevo responsable; se conservará la asignación anterior.':'Seleccione el analista para este expediente.'}</p><label>Investigador<select id="assignInvestigator">${INVESTIGATORS.map(n=>`<option ${r.investigator===n?'selected':''}>${esc(n)}</option>`).join('')}</select></label>${reassign?'<label>Motivo obligatorio<textarea id="assignReason" rows="3"></textarea></label>':'<label>Observación (opcional)<textarea id="assignReason" rows="2"></textarea></label>'}`;
    modalActions.innerHTML='<button class="btn btn-secondary" data-close>Cancelar</button><button class="btn btn-primary" data-save-assign>Guardar asignación</button>';openModal(`${reassign?'Reasignar':'Asignar'} ${r.folio}`);
    $('[data-close]',modalActions).onclick=()=>openRequestDetail(r.folio);
    $('[data-save-assign]',modalActions).onclick=()=>{const next=$('#assignInvestigator').value,old=r.investigator,reason=$('#assignReason').value.trim();if(reassign&&(!reason||next===old))return toast('Seleccione un analista diferente y capture el motivo de reasignación.');if(!reassign&&old)return toast('El expediente ya tiene analista; utilice Reasignar.');r.investigator=next;r.code='CAT-05';if(study(r.study))study(r.study).investigator=next;transition(r,'Asignada',reassign?'Reasignación manual':'Solicitud asignada correctamente',`${old||'Sin asignar'} → ${next}${reason?' · '+reason:''}`);closeModal();renderRequests();};
  }
  function openArt28Modal(r){if(state.role!=='investigador'||!roleCanSee(r)||!['Asignada','En revisión','Enviado a Estudio de Mercado'].includes(r.state))return;
    modalBody.innerHTML=`<p><b>Checklist de revisión del investigador.</b> Marque cada condición después de examinar el expediente. Ninguna aparece validada de antemano.</p><div class="subhead">Bienes y servicios</div><div class="request-document-list">${itemsOf(r).map(i=>`<div class="request-document-row"><b>${esc(i.description)}</b><small>${esc(i.partida)} · ${esc(i.movement)}</small></div>`).join('')}</div>
      <div class="subhead">Documentación a revisar</div>${requestDocumentsHtml(r)}<div class="validation-banner ${missingDocuments(r).length?'warning':'ok'}">${missingDocuments(r).length?`Faltantes obligatorios: ${missingDocuments(r).map(d=>esc(missingLabel(d))).join('; ')}`:'Documentos obligatorios integrados.'}</div>
      <div class="review-checklist">${['Descripción de todos los bienes/servicios','Características técnicas y alcance','Partida, unidad y giro congruentes','Oficio de Dictamen de Suficiencia Presupuestal','Dictamen Técnico POBALIN 059 cuando aplica','Art. 28 según regla configurada','Documentos soporte visualizados'].map(x=>`<label class="review-check"><input type="checkbox" data-a28><span>${esc(x)}</span></label>`).join('')}</div><label>Motivo de devolución / observaciones<textarea id="art28Notes" rows="3"></textarea></label>`;
    modalActions.innerHTML='<button class="btn btn-warning" data-insufficient>Devolver para corrección</button><button class="btn btn-primary" data-sufficient>Documentación validada</button>';openModal('Revisión documental del analista',true);bindDocPreview(r,modalBody);
    $('[data-insufficient]',modalActions).onclick=()=>{const notes=$('#art28Notes').value.trim();if(!notes)return toast('Capture obligatoriamente el motivo de devolución.');r.art28='Observado';r.pobalinStatus=itemsOf(r).some(i=>itemRule(i,r).pobalin==='Sí')?'Observado':'No aplica';r.caStage='returned';r.notes=notes;transition(r,'Requiere información','Devolución a Dependencia',notes);closeModal();renderRequests();};
    $('[data-sufficient]',modalActions).onclick=()=>{if(missingDocuments(r).length)return toast(`Faltan documentos obligatorios: ${missingDocuments(r).map(missingLabel).join('; ')}`);if($$('[data-a28]',modalBody).some(c=>!c.checked))return toast('Revise y marque todos los elementos del checklist, o devuelva el expediente para corrección.');if(r.study)return toast('Ya existe un Estudio de Mercado para esta solicitud.');
      r.art28=itemsOf(r).every(i=>itemRule(i,r).art28Rule==='No aplica')?'No aplica':'Validado';r.pobalinStatus=itemsOf(r).some(i=>itemRule(i,r).pobalin==='Sí')?'Validado':'No aplica';r.caStage='sent';const f=`EM-${new Date().getFullYear()}-${String(Math.max(120,...state.studies.map(s=>Number(String(s.folio).match(/(\d+)$/)?.[1]||0)))+1).padStart(4,'0')}`;r.study=f;transition(r,'En investigación de mercado','Documentación validada correctamente',`Estudio ${f} abierto · Analista ${r.investigator}`);
      const itemResults={};itemsOf(r).forEach(i=>{itemResults[i.id]={sources:[],price:i.movement.startsWith('Uso de')?i.price:null,validUntil:i.validUntil||'',result:i.movement.startsWith('Uso de')?'Uso de registro vigente':'Pendiente'};});state.studies.unshift({folio:f,request:r.folio,item:itemsOf(r).map(i=>i.description).join(' · '),investigator:r.investigator,state:'En integración',code:'EM-03',techniques:[],reference:null,created:new Date().toISOString().slice(0,10),finalGenerated:false,logGenerated:false,exception:null,signatures:{elaboro:null,autorizo:null,reviso:null,direccion:null},sources:[],itemResults,validatedSources:false,history:[{when:stamp(),label:`Estudio creado por ${actor()}`} ]});audit('Estudio de Mercado creado',r.folio,`Folio ${f}`,r);closeModal();route('cat-studies');};
  }

  function renderStudies(){
    header('Estudios de Mercado','Investigación, validación y precio de referencia','Gestione técnicas de investigación, fuentes, solicitudes de cotización, validaciones, análisis comparativo, documentos derivados y firmas.');
    const rows=visibleStudies();
    content.innerHTML=`<div class="card"><div class="card-head"><div><span class="kicker">UI-06 a UI-15</span><h3>Estudios vinculados</h3></div><span class="status-badge">${rows.length} estudio(s)</span></div><div class="table-wrap"><table class="data-table"><thead><tr><th>Folio</th><th>Solicitud</th><th>Bien / servicio</th><th>Investigador</th><th>Estado</th><th>Precio ref.</th><th></th></tr></thead><tbody>${rows.map(s=>`<tr><td><b>${esc(s.folio)}</b></td><td>${esc(s.request)}</td><td>${esc(s.item)}</td><td>${esc(s.investigator)}</td><td>${badge(s.state)}</td><td>${money(s.reference)}</td><td><button class="btn btn-ghost btn-small" data-open-study="${s.folio}">Abrir</button></td></tr>`).join('')||'<tr><td colspan="7"><div class="empty-queue">No hay estudios vinculados al alcance del perfil seleccionado.</div></td></tr>'}</tbody></table></div></div>`;
    $$('[data-open-study]',content).forEach(b=>b.onclick=()=>openStudyDetail(b.dataset.openStudy));
  }
  function ensureResults(s){const r=requestByStudy(s);s.itemResults||={};for(const i of itemsOf(r)){s.itemResults[i.id]||={sources:[],price:i.movement.startsWith('Uso de')?i.price:s.reference,validUntil:i.validUntil||'',result:i.movement.startsWith('Uso de')?'Uso de registro vigente':'Pendiente'};}return s.itemResults;}
  function studyTechniques(s){return Array.isArray(s?.techniques)?s.techniques.filter(Boolean):[];}
  function sourcesFor(s,i){return (s.sources||[]).filter(x=>(x.itemId||'1')===i.id);}
  function eligibleFor(s,i){return sourcesFor(s,i).filter(x=>x.eligible&&x.quoted);}
  function documentContext(r,s,item=null,communicationType=''){
    const mapped=itemsOf(r).map(i=>{const res=resultOf(s,i);return {...i,key:i.key||i.verificationKey,sources:res.sources?.length?res.sources:(s?.sources||[]).filter(x=>(x.itemId||'1')===i.id),price:res.price??i.price,validUntil:res.validUntil||i.validUntil,result:res.result||i.result};});
    return {request:{...r,resultDocument:r.resultDocument?{...r.resultDocument,date:r.resultDocument.created,user:r.resultDocument.generatedBy}:null},study:s,items:mapped,item:item?mapped.find(i=>i.id===item.id):null,audit:state.audit.filter(a=>a.folio===r.folio||a.folio===s?.folio),communicationType};
  }
  function openStudyDetail(folio){
    const s=study(folio);if(!s||!roleCanSeeStudy(s)){toast('No tiene acceso a este Estudio de Mercado.');return;}
    setSelectedStudy(folio);const r=requestByStudy(s),items=itemsOf(r),results=ensureResults(s),activeItems=items.filter(i=>!i.movement.startsWith('Uso de')),selectedTechniques=studyTechniques(s);
    const ready=activeItems.every(i=>eligibleFor(s,i).length>=2||results[i.id].exception),priced=activeItems.every(i=>Number.isFinite(Number(results[i.id].price))&&Number(results[i.id].price)>0&&!!results[i.id].validUntil);
    const actions=[];
    if(state.role==='investigador'&&!s.signatures?.elaboro){
      if(!s.reference)actions.push('<button class="btn btn-secondary" data-techniques>Definir técnicas</button>');
      if(!s.reference)actions.push(`<button class="btn btn-secondary" data-add-source ${studyTechniques(s).length?'':'disabled title="Defina primero una técnica de estudio de mercado"'}>Agregar fuente</button>`);
      if(s.sources.length&&!s.validatedSources)actions.push('<button class="btn btn-secondary" data-validate-sources>Validar fuentes</button>');
      if(s.validatedSources&&ready&&!priced)actions.push('<button class="btn btn-primary" data-calc-ref>Calcular precio</button>');
      if(s.validatedSources&&activeItems.some(i=>eligibleFor(s,i).length<2&&!results[i.id].exception))actions.push('<button class="btn btn-warning" data-exception>Excepción Art. 18</button>');
      if(s.reference)actions.push('<button class="btn btn-ghost" data-recalculate>Modificar fuentes / recalcular</button>');
    }
    if(state.role==='investigador'&&priced&&!s.signatures?.elaboro)actions.push('<button class="btn btn-primary" data-sign-elab>Registrar “Elaboró”</button>');
    if(state.role==='titular'&&s.signatures?.elaboro&&!s.signatures?.autorizo)actions.push('<button class="btn btn-primary" data-sign-auth>Autorizar como Titular</button>');
    if(state.role==='subdireccion'&&s.signatures?.autorizo&&!s.signatures?.reviso)actions.push('<button class="btn btn-primary" data-sign-review>Autorizar como Subdirección</button>');
    if(state.role==='direccion'&&s.signatures?.reviso&&!s.signatures?.direccion)actions.push('<button class="btn btn-primary" data-sign-dir>Resolver como Dirección</button>');
    if(state.role==='direccion'&&s.signatures?.direccion&&!r.resultDocument)actions.push('<button class="btn btn-primary" data-generate-result>Generar Dictamen / Oficio de Resultado</button>');
    if(state.role==='direccion'&&r.resultDocument?.status==='Generado')actions.push('<button class="btn btn-primary" data-send-result>Enviar resultado a Coordinación Administrativa</button>');
    const approved=allApprovals(s),generatedItems=itemDocuments(s);
    if(state.role==='titular'&&!s.logGenerated)actions.push(`<button class="btn btn-primary" data-generate-log ${approved?'':'disabled title="Pendiente de autorizaciones hasta Dirección"'}>Generar Bitácora</button>`);
    if(s.logGenerated)actions.push(`<button class="btn btn-secondary" data-doc="log" ${approved?'':'disabled title="Pendiente de autorizaciones hasta Dirección"'}>Imprimir Bitácora</button>`);
    if(['investigador','titular'].includes(state.role))items.forEach(i=>{if(!generatedItems[i.id])actions.push(`<button class="btn btn-secondary market-generate-ficha-btn" data-generate-item="${esc(i.id)}" ${approved?'':'disabled title="Pendiente de autorizaciones hasta Dirección"'}>Generar Ficha de Estudio de Mercado · ${esc(i.id)}</button>`);});
    items.forEach(i=>{if(generatedItems[i.id])actions.push(`<button class="btn btn-ghost" data-item-doc="${esc(i.id)}" ${approved?'':'disabled title="Pendiente de autorizaciones hasta Dirección"'}>Imprimir Ficha de Estudio de Mercado · ${esc(i.id)}</button>`);});
    if(r.resultDocument?.id)actions.push('<button class="btn btn-secondary" data-doc="result">Dictamen / Oficio de Resultado</button>');
    modalBody.innerHTML=`<div class="study-summary"><div><small>Folio</small><strong>${esc(s.folio)}</strong></div><div><small>Solicitud origen</small><strong>${esc(s.request)}</strong></div><div><small>Investigador</small><strong>${esc(s.investigator)}</strong></div><div><small>Estado</small><strong>${esc(s.state)}</strong></div><div><small>Elementos</small><strong>${items.length}</strong></div><div><small>Fuentes validadas</small><strong>${s.validatedSources?'Completado':'Pendiente'}</strong></div><div><small>Cálculo de precio</small><strong>${s.reference?'Completado':'Pendiente'}</strong></div><div><small>Oficio de resultado</small><strong>${esc(r.resultDocument?.id||'Pendiente')}</strong></div></div>
      <div class="subhead">Técnicas de investigación</div><div class="technique-catalog">${MARKET_TECHNIQUES.map((t,n)=>`<div class="technique-item ${selectedTechniques.includes(t)?'selected':''}"><span>${selectedTechniques.includes(t)?'✓':String.fromCharCode(97+n)+')'}</span><b>${esc(t)}</b></div>`).join('')}</div>
      <div class="subhead">Resultados por bien o servicio</div>${items.map(i=>`<article class="card mt24"><h3>${esc(i.description)} · ${esc(i.key||'Nueva alta')}</h3><div class="detail-grid"><div><small>Partida / unidad</small><strong>${esc(i.partida)} · ${esc(i.unit)}</strong></div><div><small>Movimiento / situación</small><strong>${esc(i.movement)} · ${esc(i.situation)}</strong></div><div><small>Precio de mercado</small><strong>${money(results[i.id].price)}</strong></div><div><small>Vigencia</small><strong>${esc(results[i.id].validUntil||'Pendiente')}</strong></div><div><small>Resultado</small><strong>${esc(results[i.id].result)}</strong></div><div><small>Fuentes consultadas</small><strong>${sourcesFor(s,i).length}</strong></div></div>${sourcesTable(s,i)}</article>`).join('')}
      <div class="subhead">Documentación de origen</div>${requestDocumentsHtml(r)}<div class="subhead">Documentos derivados y firmas</div>${documentStatusHtml(s)}
      <div class="subhead">Historial</div><div class="timeline">${s.history.map((h,n)=>`<div class="timeline-item ${n===s.history.length-1?'current':'done'}"><span class="timeline-dot"></span><div><strong>${esc(h.label)}</strong><small>${esc(h.when)}</small></div></div>`).join('')}</div>`;
    modalActions.innerHTML=`<button class="btn btn-ghost" data-close>Cerrar</button>${actions.join('')}`;openModal(`Estudio de Mercado ${folio}`,true);bindDocPreview(r,modalBody);
    $('[data-close]',modalActions).onclick=closeModal;
    $('[data-techniques]',modalActions)?.addEventListener('click',()=>openTechniquesModal(s));
    $('[data-add-source]',modalActions)?.addEventListener('click',()=>openAddSource(s));
    $('[data-validate-sources]',modalActions)?.addEventListener('click',()=>{if(state.role!=='investigador'||!roleCanSeeStudy(s)||s.signatures?.elaboro)return toast('La revisión de fuentes ya no está disponible.');if(s.validatedSources)return toast('Las fuentes ya fueron validadas para este conjunto de datos.');if(!studyTechniques(s).length)return toast('Defina al menos una técnica antes de validar fuentes.');s.validatedSources=true;s.state='Fuentes validadas';s.history.push({when:stamp(),label:`Fuentes validadas por ${actor()}`});audit('Fuentes validadas correctamente',s.folio,`${s.sources.length} fuente(s), ${items.length} elemento(s)`,r);openStudyDetail(folio);});
    $('[data-calc-ref]',modalActions)?.addEventListener('click',()=>openCalculation(s));
    $('[data-exception]',modalActions)?.addEventListener('click',()=>openExceptionModal(s));
    $('[data-recalculate]',modalActions)?.addEventListener('click',()=>{if(state.role!=='investigador'||!roleCanSeeStudy(s)||s.signatures?.elaboro)return toast('No se puede recalcular tras registrar la primera autorización.');if(!confirm('¿Modificar fuentes y habilitar un nuevo cálculo explícito?'))return;s.reference=null;s.validatedSources=false;activeItems.forEach(i=>{results[i.id].price=null;results[i.id].validUntil='';results[i.id].result='Pendiente';});s.history.push({when:stamp(),label:'Recalculo habilitado explícitamente'});audit('Recalculo autorizado',s.folio,'Se conservan los valores históricos en la bitácora',r);openStudyDetail(folio);});
    $('[data-generate-log]',modalActions)?.addEventListener('click',()=>{if(state.role!=='titular'||!allApprovals(s)||s.logGenerated)return toast('La Bitácora sólo puede generarla el Titular tras todas las autorizaciones hasta Dirección y una única vez.');s.logGenerated=true;s.logDocument={user:actor(),role:ROLES[state.role],when:new Date().toISOString()};s.history.push({when:stamp(),label:`Bitácora consolidada generada por ${actor()}`});audit('Bitácora consolidada generada',s.folio,`Vinculada a ${r.folio}`,r);openStudyDetail(folio);});
    $$('[data-generate-item]',modalActions).forEach(b=>b.onclick=()=>{const id=b.dataset.generateItem;if(!['investigador','titular'].includes(state.role)||!allApprovals(s)||!items.some(i=>i.id===id)||itemDocuments(s)[id])return toast('La Ficha de Estudio de Mercado requiere autorización hasta Dirección y sólo puede generarse una vez por elemento.');s.itemDocuments||={};s.itemDocuments[id]={user:actor(),role:ROLES[state.role],when:new Date().toISOString()};s.history.push({when:stamp(),label:`Ficha de Estudio de Mercado del elemento ${id} generada por ${actor()}`});audit('Ficha de Estudio de Mercado generada',s.folio,`Elemento ${id}`,r);openStudyDetail(folio);});
    $('[data-sign-elab]',modalActions)?.addEventListener('click',()=>signStudy(s,'elaboro','Elaboró',actor(),'En revisión del Titular','EM-14'));
    $('[data-sign-auth]',modalActions)?.addEventListener('click',()=>signStudy(s,'autorizo','Autorizó',actor(),'En revisión de Subdirección','EM-16'));
    $('[data-sign-review]',modalActions)?.addEventListener('click',()=>signStudy(s,'reviso','Revisó',actor(),'En autorización de Dirección','EM-18'));
    $('[data-sign-dir]',modalActions)?.addEventListener('click',()=>openDirectionDecision(s));
    $('[data-generate-result]',modalActions)?.addEventListener('click',()=>generateResult(s));
    $('[data-send-result]',modalActions)?.addEventListener('click',()=>sendResult(s));
    $$('[data-doc]',modalActions).forEach(b=>b.onclick=()=>{if(b.dataset.doc==='log'&&(!allApprovals(s)||!s.logGenerated))return toast('La Bitácora requiere autorización completa y generación previa.');window.MarketDocuments?.preview(b.dataset.doc,documentContext(r,s));});
    $$('[data-item-doc]',modalActions).forEach(b=>b.onclick=()=>{if(!allApprovals(s)||!itemDocuments(s)[b.dataset.itemDoc])return toast('La Ficha de Estudio de Mercado requiere autorización completa y generación previa.');window.MarketDocuments?.preview('item',documentContext(r,s,items.find(i=>i.id===b.dataset.itemDoc)));});
  }
  function openCalculation(s){if(state.role!=='investigador'||!roleCanSeeStudy(s)||s.signatures?.elaboro)return toast('El cálculo ya no está disponible para este perfil o etapa.');const r=requestByStudy(s),items=itemsOf(r).filter(i=>!i.movement.startsWith('Uso de')),results=ensureResults(s);if(!s.validatedSources||s.reference)return toast('Las fuentes deben validarse primero y el cálculo no debe estar completado.');
    const expiry=new Date(Date.now()+90*86400000).toISOString().slice(0,10);
    modalBody.innerHTML=`<p>Promedio de precios elegibles y comparables por bien o servicio. Indique fecha límite de vigencia.</p><div class="form-grid cols2">${items.map(i=>`<label>Vigencia · ${esc(i.description)}<input type="date" data-price-expiry="${esc(i.id)}" value="${expiry}"></label>`).join('')}</div>`;
    modalActions.innerHTML='<button class="btn btn-secondary" data-close>Cancelar</button><button class="btn btn-primary" data-save-price>Calcular precio</button>';openModal('Cálculo del precio de mercado',true);$('[data-close]',modalActions).onclick=()=>openStudyDetail(s.folio);
    $('[data-save-price]',modalActions).onclick=()=>{if(s.reference)return toast('Cálculo ya completado. Use la acción explícita de recalcular.');for(const i of items){const e=eligibleFor(s,i);if(e.length<2&&!results[i.id].exception)return toast(`Se requieren dos cotizaciones elegibles para ${i.description}, o documentar excepción.`);const expiry=$(`[data-price-expiry="${i.id}"]`,modalBody)?.value;if(!expiry||expiry<new Date().toISOString().slice(0,10))return toast('Capture una vigencia futura para cada elemento.');results[i.id].price=results[i.id].exception?.amount||Number((e.reduce((sum,x)=>sum+Number(x.unitPrice),0)/e.length).toFixed(2));results[i.id].validUntil=expiry;results[i.id].sources=sourcesFor(s,i).map(x=>({...x}));results[i.id].result=results[i.id].exception?'Precio por excepción Art. 18':'Precio de mercado calculado';}
      s.reference=Number((items.reduce((sum,i)=>sum+Number(results[i.id].price),0)/items.length).toFixed(2));s.state='Precio de referencia calculado';s.history.push({when:stamp(),label:`Cálculo concluido por ${actor()}`});audit('Cálculo de precio realizado correctamente',s.folio,items.map(i=>`${i.description}: ${money(results[i.id].price)}`).join(' | '),r);openStudyDetail(s.folio);};
  }
  function openDirectionDecision(s){if(state.role!=='direccion'||!roleCanSeeStudy(s)||!s.signatures.reviso||s.signatures.direccion)return toast('La autorización requiere las firmas previas y no puede repetirse.');
    modalBody.innerHTML='<label>Resultado<select id="directionOutcome"><option value="AUTORIZADA">AUTORIZADA</option><option value="NO AUTORIZADA">NO AUTORIZADA</option></select></label><label>Observaciones<textarea id="directionNotes" rows="3"></textarea></label>';
    modalActions.innerHTML='<button class="btn btn-secondary" data-close>Cancelar</button><button class="btn btn-primary" data-resolve>Registrar resolución</button>';openModal('Autorización de Dirección');$('[data-close]',modalActions).onclick=()=>openStudyDetail(s.folio);
    $('[data-resolve]',modalActions).onclick=()=>{if(s.signatures.direccion||!s.signatures.reviso||state.role!=='direccion')return toast('La autorización ya fue registrada o la etapa no está disponible.');const result=$('#directionOutcome').value,reason=$('#directionNotes').value.trim();if(result==='NO AUTORIZADA'&&!reason)return toast('Capture el motivo de no autorización.');s.outcome=result;s.outcomeNotes=reason;signStudy(s,'direccion','Dirección',actor(),result==='AUTORIZADA'?'Autorizado':'No autorizado','EM-21');};
  }
  function generateResult(s){const r=requestByStudy(s);if(state.role!=='direccion'||!s.signatures.direccion||r.resultDocument)return toast('El resultado sólo puede generarse una vez y después de la autorización de Dirección.');
    const year=new Date().getFullYear(),seq=Math.max(0,...state.requests.map(x=>Number(x.resultDocument?.id?.match(/(\d+)$/)?.[1]||0)))+1,id=`DMR-${year}-${String(seq).padStart(6,'0')}`;
    r.resultDocument={id,request:r.folio,study:s.folio,created:stamp(),generatedBy:actor(),result:s.outcome||'AUTORIZADA',status:'Generado'};audit('Dictamen / Oficio de Resultado generado correctamente',r.folio,`${r.folio} → ${id}`,r,id);s.history.push({when:stamp(),label:`Documento ${id} generado`});openStudyDetail(s.folio);
  }
  function sendResult(s){const r=requestByStudy(s),doc=r.resultDocument;if(state.role!=='direccion'||!doc||doc.status!=='Generado')return toast('El documento ya se envió o aún no ha sido generado.');
    doc.status='Enviado a Coordinación Administrativa';doc.sentAt=stamp();doc.sentBy=actor();transition(r,doc.result==='AUTORIZADA'?'Actualización de Catálogo':'No autorizado','Resultado enviado a Coordinación Administrativa',`${doc.id} · ${doc.result}`,doc.id);s.state=doc.result==='AUTORIZADA'?'Autorizado':'No autorizado';openStudyDetail(s.folio);
  }

  function openTechniquesModal(s){
    if(state.role!=='investigador'||!roleCanSeeStudy(s)||s.signatures?.elaboro||s.reference)return toast('Las técnicas ya no pueden modificarse en esta etapa.');
    modalBody.innerHTML=`<p>Seleccione una o más técnicas de investigación para el Estudio de Mercado.</p><div class="review-checklist technique-select">${MARKET_TECHNIQUES.map((t,i)=>`<label class="review-check"><input type="checkbox" data-market-tech value="${esc(t)}" ${studyTechniques(s).includes(t)?'checked':''}><span><b>${String.fromCharCode(97+i)})</b> ${esc(t)}</span></label>`).join('')}</div>`;
    modalActions.innerHTML='<button class="btn btn-secondary" data-close>Cancelar</button><button class="btn btn-primary" data-save-tech>Guardar técnicas</button>'; openModal('Técnicas de investigación',true);
    $('[data-close]',modalActions).onclick=()=>{closeModal();openStudyDetail(s.folio);};
    $('[data-save-tech]',modalActions).onclick=()=>{const selected=$$('[data-market-tech]',modalBody).filter(x=>x.checked).map(x=>x.value);if(!selected.length){toast('Seleccione al menos una técnica de investigación.');return;}s.techniques=selected;if(s.state==='En integración'){s.state='En investigación';s.code='EM-04';}s.history.push({when:stamp(),label:`Técnicas definidas: ${selected.join(' · ')}`});addAudit('Técnicas de investigación definidas',s.folio,selected.join(' | '));save();closeModal();openStudyDetail(s.folio);};
  }

  function sourcesTable(s,item){const rows=item?sourcesFor(s,item):(s.sources||[]);return `<div class="table-wrap"><table class="data-table"><thead><tr><th>Fuente</th><th>RFC</th><th>Precio</th><th>Técnica</th><th>Información obtenida</th><th>Validación</th></tr></thead><tbody>${rows.map(x=>`<tr><td>${esc(x.name)}</td><td>${esc(x.rfc)}</td><td>${money(x.unitPrice)}</td><td>${esc(x.technique||'—')}</td><td>${esc(x.evidence||'—')}</td><td>${badge(x.eligible?'Elegible':'Excluida')}</td></tr>`).join('')||'<tr><td colspan="6">Aún no existen fuentes registradas para este elemento.</td></tr>'}</tbody></table></div>`;}
  function documentStatusHtml(s){const r=requestByStudy(s),rows=[['Bitácora',allApprovals(s)&&s.logGenerated],['Fichas de Estudio de Mercado',allApprovals(s)&&Object.keys(itemDocuments(s)).length===itemsOf(r).length],['Firma Elaboró',!!s.signatures.elaboro],['Firma del Titular del Departamento',!!s.signatures.autorizo],['Firma Subdirección',!!s.signatures.reviso],['Autorización de Dirección',!!s.signatures.direccion],['Dictamen / Oficio de Resultado',!!r.resultDocument]];return `<div class="doc-status-grid">${rows.map(([label,done])=>`<div><span>${esc(label)}</span>${badge(done?'Completado':'Pendiente')}</div>`).join('')}</div>`;}
  function openAddSource(s){const techniques=studyTechniques(s);if(state.role!=='investigador'||!roleCanSeeStudy(s)||s.signatures?.elaboro||s.reference)return toast('Las fuentes sólo se capturan antes del cálculo del precio.');if(!techniques.length)return toast('Defina al menos una técnica antes de agregar fuentes.');const r=requestByStudy(s),pending=itemsOf(r).filter(i=>!i.movement.startsWith('Uso de'));
    modalBody.innerHTML=`<div class="validation-banner provider-registry-banner"><b>Selección desde Padrón de Proveedores DEMO.</b> Vincule cada fuente con un bien o servicio específico.</div><div class="form-grid cols2 mt24"><label class="span2">Bien / servicio<select id="srcItem">${pending.map(i=>`<option value="${esc(i.id)}">${esc(i.description)}</option>`).join('')}</select></label><label class="span2">Proveedor<select id="srcProvider"><option value="">Seleccione...</option>${PROVIDER_REGISTRY_DEMO.map(p=>`<option value="${p.id}">${esc(p.name)} · ${esc(p.rfc)}</option>`).join('')}</select></label><label>Nombre / razón social<input id="srcName" readonly></label><label>RFC<input id="srcRfc" readonly></label><label>Precio unitario<input id="srcPrice" type="number" step=".01" min=".01"></label><label>Técnica<select id="srcTechnique">${techniques.map(t=>`<option>${esc(t)}</option>`).join('')}</select></label><label class="span2">Información / evidencia obtenida<textarea id="srcEvidence" rows="2"></textarea></label></div><div class="review-checklist mt24"><label class="review-check"><input type="checkbox" id="srcTechnical"><span>Cumplimiento técnico</span></label><label class="review-check"><input type="checkbox" id="srcComparable"><span>Comparabilidad comercial</span></label><label class="review-check"><input type="checkbox" id="srcFiscal"><span>Validación fiscal satisfactoria · DEMO</span></label><label class="review-check"><input type="checkbox" id="srcController"><span>No objetada · DEMO</span></label></div>`;
    modalActions.innerHTML='<button class="btn btn-secondary" data-close>Cancelar</button><button class="btn btn-primary" data-save-source>Agregar fuente</button>';openModal('Agregar fuente de mercado',true);
    $('#srcProvider').onchange=()=>{const p=PROVIDER_REGISTRY_DEMO.find(x=>x.id===$('#srcProvider').value);$('#srcName').value=p?.name||'';$('#srcRfc').value=p?.rfc||'';};
    $('[data-close]',modalActions).onclick=()=>openStudyDetail(s.folio);
    $('[data-save-source]',modalActions).onclick=()=>{if(!studyTechniques(s).length)return toast('Defina al menos una técnica antes de agregar fuentes.');const p=PROVIDER_REGISTRY_DEMO.find(x=>x.id===$('#srcProvider').value),amount=Number($('#srcPrice').value),id=$('#srcItem').value,detail=$('#srcEvidence').value.trim();if(!p||!Number.isFinite(amount)||amount<=0||!detail)return toast('Seleccione proveedor y capture precio positivo e información obtenida.');if(sourcesFor(s,{id}).some(x=>x.rfc===p.rfc))return toast('Esta fuente ya fue registrada para el bien o servicio seleccionado.');
      const x={itemId:id,providerId:p.id,name:p.name,rfc:p.rfc,type:p.type,technique:$('#srcTechnique').value,quoted:true,unitPrice:amount,tax:Number((amount*.16).toFixed(2)),total:Number((amount*1.16).toFixed(2)),technical:$('#srcTechnical').checked,comparable:$('#srcComparable').checked,fiscal:$('#srcFiscal').checked?'Válido':'No válido',controller:$('#srcController').checked?'No objetada':'Objetada',evidence:detail,eligible:['srcTechnical','srcComparable','srcFiscal','srcController'].every(k=>$('#'+k).checked)};
      s.sources.push(x);s.validatedSources=false;s.state='Cotizaciones recibidas';s.history.push({when:stamp(),label:`Fuente ${p.name} vinculada al elemento ${id}`});if(!audit('Cotización recibida',s.folio,`${p.name} · ${money(amount)} · elemento ${id}`,r).persisted)return;openStudyDetail(s.folio);};
  }
  function openExceptionModal(s){if(state.role!=='investigador'||!roleCanSeeStudy(s)||s.signatures?.elaboro||!s.validatedSources||s.reference)return toast('La excepción se registra sólo tras validar fuentes y antes del cálculo.');const r=requestByStudy(s),results=ensureResults(s),pending=itemsOf(r).filter(i=>!i.movement.startsWith('Uso de')&&eligibleFor(s,i).length<2);
    modalBody.innerHTML=`<p>Documente un supuesto excepcional por cada bien o servicio con menos de dos cotizaciones elegibles.</p><label>Bien / servicio<select id="excItem">${pending.map(i=>`<option value="${esc(i.id)}">${esc(i.description)}</option>`).join('')}</select></label><label>Supuesto / fundamento<select id="excGround"><option>Supuesto excepcional Art. 18 · DEMO</option><option>Mercado con fuente única documentada · DEMO</option></select></label><label>Justificación<textarea id="excJust" rows="3"></textarea></label><label>Monto alternativo de referencia<input id="excAmount" type="number" step=".01" min=".01"></label>`;
    modalActions.innerHTML='<button class="btn btn-secondary" data-close>Cancelar</button><button class="btn btn-warning" data-save-exc>Registrar excepción</button>';openModal('Excepción Art. 18');$('[data-close]',modalActions).onclick=()=>openStudyDetail(s.folio);
    $('[data-save-exc]',modalActions).onclick=()=>{const id=$('#excItem').value,reason=$('#excJust').value.trim(),amount=Number($('#excAmount').value);if(!reason||!Number.isFinite(amount)||amount<=0)return toast('Capture justificación y monto positivo para documentar la excepción.');if(results[id].exception)return toast('Este elemento ya cuenta con una excepción.');results[id].exception={ground:$('#excGround').value,justification:reason,amount,when:stamp(),user:actor()};s.exception=s.exception||[];s.exception.push({itemId:id,...results[id].exception});s.history.push({when:stamp(),label:`Excepción Art. 18 documentada para elemento ${id}`});audit('Excepción Art. 18',s.folio,`Elemento ${id} · ${reason}`,r);openStudyDetail(s.folio);};
  }
  function signStudy(s,key,label,who,nextState,nextCode){
    const permitted={elaboro:'investigador',autorizo:'titular',reviso:'subdireccion',direccion:'direccion'},prev={autorizo:'elaboro',reviso:'autorizo',direccion:'reviso'},r=requestByStudy(s);
    const priced=r&&itemsOf(r).filter(i=>!i.movement.startsWith('Uso de')).every(i=>{const result=ensureResults(s)[i.id];return Number(result.price)>0&&!!result.validUntil;});
    if(!r||!roleCanSeeStudy(s)||state.role!==permitted[key]||s.signatures?.[key]||key==='elaboro'&&(!s.reference||!priced)||key!=='elaboro'&&!s.signatures?.[prev[key]])return toast('No se puede repetir ni saltar etapas de autorización.');
    const now=new Date(),when=now.toISOString();s.signatures[key]={user:who,role:ROLES[state.role],when};s.state=nextState;s.code=nextCode;s.history.push({when:stamp(),label:`Autorización “${label}” registrada por ${who}`});audit(`Autorización registrada: ${label}`,s.folio,`${who} · ${when} · ${nextState}`,r);if(key==='direccion')transition(r,s.outcome==='NO AUTORIZADA'?'No autorizado':'Autorizado','Resolución de Dirección',s.outcomeNotes||s.outcome||'AUTORIZADA');const messages={
      elaboro:'La solicitud de Estudio de Mercado ha sido enviada al Titular del Departamento de Investigación de Mercado para su revisión y autorización.',
      autorizo:'El Estudio de Mercado ha sido enviado al Titular de la Subdirección de Investigación de Mercado para su revisión.',
      reviso:'El Estudio de Mercado ha sido enviado al Titular de la Dirección de Investigación de Mercado para su revisión y autorización.',
      direccion:s.outcome==='NO AUTORIZADA'?'El Estudio de Mercado no fue autorizado por la Dirección. La etapa de resolución ha concluido.':'El Estudio de Mercado ha sido autorizado por la Dirección. La etapa de firmas ha concluido.'
    };modalBody.innerHTML=`<p>${esc(messages[key])}</p><p class="section-help">${esc(s.folio)} · ${esc(nextState)}</p>`;modalActions.innerHTML='<button class="btn btn-primary" data-back-to-study>Volver al estudio</button>';openModal('Firma registrada');$('[data-back-to-study]',modalActions).onclick=()=>openStudyDetail(s.folio);
  }

  function renderExpedient(){
    const scopedRequests=visibleRequests(),selected=req(state.selectedRequest),r=selected&&scopedRequests.includes(selected)?selected:scopedRequests[0],s=study(r?.study);
    header('Expediente electrónico','Documentos, evidencias, versiones y eventos','El expediente conserva la solicitud origen, documentos visibles por rol, bienes y servicios, estudio, resultado y bitácora.');
    if(!r){content.innerHTML='<article class="card">No hay expedientes accesibles para este perfil.</article>';return;}
    const doc=r.resultDocument;
    content.innerHTML=`<div class="grid-2"><article class="card"><span class="kicker">UI-15</span><h3>Árbol documental · ${esc(r.folio)}</h3><div class="exp-tree"><div class="tree-node root">Solicitud ${esc(r.folio)} · v${r.version||1}</div><div class="tree-node">Bienes y servicios · ${itemsOf(r).length}</div><div class="tree-node">Anexos técnicos · ${r.documents||0}</div><div class="tree-node">Estudio de Mercado · ${esc(s?.folio||'Pendiente')}</div><div class="tree-node indent">Fuentes y validaciones · ${s?.sources?.length||0}</div><div class="tree-node indent">Bitácora consolidada · ${allApprovals(s)&&s.logGenerated?'Generada':'Pendiente'}</div><div class="tree-node indent">Fichas de Estudio de Mercado · ${s&&allApprovals(s)?Object.keys(itemDocuments(s)).length:0}</div><div class="tree-node indent">Resultado · ${esc(doc?.id||'Pendiente')}</div></div><div class="actions mt24"><button class="btn btn-secondary" data-open-request="${esc(r.folio)}">Abrir expediente</button>${s?.logGenerated?`<button class="btn btn-ghost" data-printed="log" ${allApprovals(s)?'':'disabled'}>Imprimir Bitácora</button>`:''}${s&&allApprovals(s)?itemsOf(r).filter(i=>itemDocuments(s)[i.id]).map(i=>`<button class="btn btn-ghost" data-printed-item="${esc(i.id)}">Imprimir Ficha de Estudio de Mercado · ${esc(i.id)}</button>`).join(''):''}${doc?'<button class="btn btn-primary" data-printed="result">Dictamen / Oficio de Resultado</button>':''}</div></article>
      <article class="card"><span class="kicker">Control documental</span><h3>Adjuntos y versiones</h3>${requestDocumentsHtml(r)}<div class="validation-banner routing">${doc?`${esc(r.folio)} → ${esc(doc.id)} · ${esc(doc.status)}`:'El oficio de resultado se generará tras la autorización de Dirección.'}</div></article></div>
      <article class="card mt24"><span class="kicker">Trazabilidad</span><h3>Bitácora vinculada</h3>${auditTable(state.audit.filter(a=>[r.folio,s?.folio].includes(a.folio)))}</article>`;
    bindRequestLinks(content);bindDocPreview(r,content);$$('[data-printed]',content).forEach(b=>b.onclick=()=>{if(b.dataset.printed==='log'&&(!allApprovals(s)||!s.logGenerated))return toast('Bitácora pendiente de autorización/generación.');window.MarketDocuments?.preview(b.dataset.printed,documentContext(r,s));});$$('[data-printed-item]',content).forEach(b=>b.onclick=()=>{if(!allApprovals(s)||!itemDocuments(s)[b.dataset.printedItem])return toast('Ficha pendiente de autorización/generación.');window.MarketDocuments?.preview('item',documentContext(r,s,itemsOf(r).find(i=>i.id===b.dataset.printedItem)));});
  }
  const recentCatalogChanges=[]; // Registro visual efímero: se vacía al recargar la pestaña.
  function renderRegistration(){
    const candidates=visibleRequests().filter(r=>r.resultDocument?.status==='Enviado a Coordinación Administrativa'&&r.resultDocument.result==='AUTORIZADA'&&!r.catalogUpdated&&needsStudy(r));
    header('Catálogo de Bienes y Servicios','Alta / actualización autorizada','Registre en el catálogo todos los bienes y servicios una vez autorizado el Estudio de Mercado y enviado el oficio de resultado.');
    content.innerHTML=`<article class="card"><div class="card-head"><div><span class="kicker">UI-16</span><h3>Expedientes listos para registro</h3></div><span class="status-badge">${candidates.length} pendiente(s)</span></div>${candidates.length?`<div class="table-wrap"><table class="data-table"><thead><tr><th>Solicitud</th><th>Elementos</th><th>Estudio</th><th>Oficio</th><th></th></tr></thead><tbody>${candidates.map(r=>`<tr><td>${esc(r.folio)}</td><td>${itemsOf(r).length} bien(es) / servicio(s)</td><td>${esc(r.study)}</td><td>${esc(r.resultDocument.id)}</td><td><button class="btn btn-primary btn-small" data-register="${esc(r.folio)}">Actualizar catálogo</button></td></tr>`).join('')}</tbody></table></div>`:'<div class="validation-banner">No hay expedientes autorizados y comunicados pendientes de actualización.</div>'}</article>${recentCatalogChanges.length?`<article class="card mt24"><span class="kicker">Comprobación temporal · sesión actual</span><h3>Bienes y servicios incorporados o actualizados</h3><p class="section-help">Este listado temporal muestra los movimientos procesados en esta pestaña; se borra al recargar. El Catálogo DEMO mantiene su almacenamiento local habitual.</p><div class="table-wrap"><table class="data-table"><thead><tr><th>Movimiento</th><th>Clave</th><th>Descripción</th><th>Precio anterior → nuevo</th><th>Solicitud</th><th></th></tr></thead><tbody>${recentCatalogChanges.map(x=>`<tr><td>${esc(x.movement)}</td><td>${esc(x.key)}</td><td>${esc(x.description)}</td><td>${money(x.beforePrice)} → ${money(x.price)}</td><td>${esc(x.folio)}</td><td><button class="btn btn-ghost btn-small" data-recent-catalog="${esc(x.key)}">Ver ficha</button></td></tr>`).join('')}</tbody></table></div></article>`:''}`;
    $$('[data-register]',content).forEach(b=>b.onclick=()=>openRegistrationModal(req(b.dataset.register)));
    $$('[data-recent-catalog]',content).forEach(b=>b.onclick=()=>openCatalogDetail(b.dataset.recentCatalog));
  }
  function openRegistrationModal(r){
    if(state.role!=='catalogo'||!roleCanSee(r)||r.catalogUpdated||r.resultDocument?.status!=='Enviado a Coordinación Administrativa'||r.resultDocument?.result!=='AUTORIZADA')return toast('No está autorizado publicar este expediente.');
    const s=study(r.study),items=itemsOf(r),results=ensureResults(s);
    modalBody.innerHTML=`<p>Se publicarán conjuntamente todos los elementos pendientes. El historial conservará valores anteriores y nuevos.</p><div class="table-wrap"><table class="data-table"><thead><tr><th>Movimiento</th><th>Clave</th><th>Descripción</th><th>Precio</th><th>Vigencia</th></tr></thead><tbody>${items.map(i=>`<tr><td>${esc(i.movement)}</td><td>${esc(i.key||'Nueva clave')}</td><td>${esc(i.description)}</td><td>${money(results[i.id].price)}</td><td>${esc(results[i.id].validUntil||'—')}</td></tr>`).join('')}</tbody></table></div>`;
    modalActions.innerHTML='<button class="btn btn-secondary" data-close>Cancelar</button><button class="btn btn-primary" data-confirm-reg>Publicar versión vigente</button>';openModal(`Actualización de Catálogo · ${r.folio}`,true);$('[data-close]',modalActions).onclick=closeModal;
    $('[data-confirm-reg]',modalActions).onclick=()=>{
      if(r.catalogUpdated)return toast('Este expediente ya actualizó el catálogo.');
      for(const i of items){if(i.movement.startsWith('Uso de'))continue;const result=results[i.id],existing=catalogEntry(i.key);if(!result||!Number.isFinite(Number(result.price))||Number(result.price)<=0||!result.validUntil)return toast(`Falta precio o vigencia para ${i.description}.`);if(i.movement.startsWith('Actualización')&&!existing)return toast(`La clave ${i.key} no existe para actualizar.`);if(i.movement.startsWith('Alta')&&i.key)return toast('No se permite alta duplicada de una clave existente.');if(i.movement.startsWith('Alta')&&state.catalog.some(c=>c.description.trim().toLowerCase()===i.description.trim().toLowerCase()))return toast(`Ya existe un bien o servicio con la descripción ${i.description}.`);}
      let seq=Math.max(0,...state.catalog.map(c=>Number(c.key.match(/(\d+)$/)?.[1]||0)));
      for(const i of items){if(i.movement.startsWith('Uso de')){i.result='Registro vigente utilizado';continue;}const result=results[i.id],current=catalogEntry(i.key),key=current?.key||`DEMO-${i.type==='Bien'?'B':'S'}-${String(++seq).padStart(3,'0')}`;
        const before=current?{description:current.description,price:current.price,status:current.status,unit:current.unit,partida:current.partida,priceValidUntil:current.priceValidUntil||'',version:current.version}:null;
        const entry=current||{key,type:i.type,version:0,history:[]};Object.assign(entry,{description:i.description,price:Number(result.price),status:'Vigente',unit:i.unit,partida:i.partida,family:i.giro,priceValidUntil:result.validUntil,updated:new Date().toISOString().slice(0,10),version:(entry.version||0)+1});
        const change={before,after:{description:entry.description,price:entry.price,status:entry.status,unit:entry.unit,partida:entry.partida,priceValidUntil:entry.priceValidUntil,version:entry.version},when:stamp(),user:actor(),request:r.folio,study:s.folio,document:r.resultDocument.id};(entry.history||=[]).push(change);if(!current)state.catalog.push(entry);
        recentCatalogChanges.unshift({key,description:entry.description,movement:current?'Actualización':'Alta',beforePrice:before?.price??null,price:entry.price,folio:r.folio});
        i.key=key;i.result=current?'Actualizado y activado en Catálogo':'Incorporado al Catálogo';audit(current?'Bien o servicio actualizado correctamente en el Catálogo':'Bien o servicio incorporado correctamente al Catálogo',r.folio,`${key} · ${money(entry.price)} · ${s.folio}`,r,r.resultDocument.id);
      }
      r.catalogUpdated=true;r.catalogUpdatedAt=stamp();r.code='CAT-14';transition(r,'Concluida','Catálogo actualizado y expediente concluido',`${items.length} elemento(s) · ${r.resultDocument.id}`,r.resultDocument.id);closeModal();renderRegistration();toast('Bienes y servicios actualizados/incorporados correctamente al Catálogo. Expediente concluido.');
    };
  }

  function renderReports(){
    const scopedRequests=visibleRequests(), scopedStudies=visibleStudies(); const total=scopedRequests.length, returned=scopedRequests.filter(r=>r.state==='Requiere información').length, studies=scopedStudies.length, exceptions=scopedStudies.filter(s=>s.exception).length;
    header('Reportes e indicadores','Control y seguimiento','Indicadores demostrativos derivados de los datos transaccionales del prototipo.');
    content.innerHTML=`<div class="stats-grid"><article class="stat"><span>Solicitudes</span><strong>${total}</strong><small>Total DEMO</small></article><article class="stat"><span>Devueltas</span><strong>${returned}</strong><small>${total?Math.round(returned/total*100):0}% del total</small></article><article class="stat"><span>Estudios</span><strong>${studies}</strong><small>Vinculados</small></article><article class="stat"><span>Excepciones Art. 18</span><strong>${exceptions}</strong><small>Documentadas</small></article></div><div class="grid-2 mt24"><article class="card"><span class="kicker">Solicitudes por estado</span><h3>Distribución actual</h3>${barReport(groupCount(scopedRequests,'state'))}</article><article class="card"><span class="kicker">Estudios por estado</span><h3>Distribución actual</h3>${barReport(groupCount(scopedStudies,'state'))}</article></div><article class="card mt24"><span class="kicker">Reportes mínimos</span><h3>Disponibles para futura instrumentación</h3><div class="report-grid"><div>Solicitudes por dependencia, tipo, estado y periodo</div><div>Tiempo promedio por etapa y antigüedad</div><div>Fuentes invitadas, elegibles y excluidas</div><div>Estudios con menos de dos cotizaciones</div><div>Precios de referencia e histórico</div><div>Regularizaciones Art. 28 del Reglamento de la Ley pendientes</div><div>Bitácora por usuario / rol / expediente</div><div>Evidencias faltantes por expediente</div></div></article>`;
  }
  function groupCount(rows,key){return rows.reduce((a,x)=>(a[x[key]]=(a[x[key]]||0)+1,a),{});}
  function barReport(obj){const max=Math.max(1,...Object.values(obj));return `<div class="bars">${Object.entries(obj).map(([k,v])=>`<div class="bar-row"><span>${esc(k)}</span><div><i style="width:${v/max*100}%"></i></div><b>${v}</b></div>`).join('')}</div>`;}

  function auditTable(rows){return `<div class="table-wrap"><table class="data-table"><thead><tr><th>Fecha / hora</th><th>Usuario / rol</th><th>Acción</th><th>Folio</th><th>Antes → después / observación / documento</th></tr></thead><tbody>${rows.slice().reverse().map(a=>`<tr><td>${esc(a.when)}</td><td>${esc(a.user)}<br><small>${esc(a.role||'')}</small></td><td>${esc(a.action)}</td><td>${esc(a.folio)}</td><td>${esc(a.previousState||'—')} → ${esc(a.newState||'—')} · ${esc(a.observation||a.detail||'—')} ${a.document?`· ${esc(a.document)}`:''}</td></tr>`).join('')}</tbody></table></div>`;}
    function renderAudit(){ const folios=new Set([...visibleRequests().map(r=>r.folio),...visibleStudies().map(s=>s.folio)]); const rows=state.audit.filter(a=>folios.has(a.folio)); header('Bitácora de auditoría','Trazabilidad de eventos','Toda transición o modificación relevante queda representada con usuario, fecha/hora, acción, folio y detalle.'); content.innerHTML=`<article class="card"><div class="card-head"><div><span class="kicker">UI-17</span><h3>Historial inmutable · DEMO</h3></div><button class="btn btn-secondary" id="auditExport">Exportar CSV demostrativo</button></div>${auditTable(rows)}</article>`; $('#auditExport').onclick=exportAudit; }
  function exportAudit(){ const visible=new Set([...visibleRequests().map(r=>r.folio),...visibleStudies().map(s=>s.folio)]);const rows=[['Fecha','Usuario','Rol','Acción','Folio','Estado anterior','Estado nuevo','Observación','Documento'],...state.audit.filter(a=>visible.has(a.folio)).map(a=>[a.when,a.user,a.role||'',a.action,a.folio,a.previousState||'',a.newState||'',a.observation||a.detail||'',a.document||''])];const csv=rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');const blob=new Blob([csv],{type:'text/csv;charset=utf-8'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='bitacora_compramex_demo.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),500); }

  function publicCatalogSearch(){
    const q=($('#publicCatalogQuery')?.value||'').trim().toLowerCase(); const rows=state.catalog.filter(x=>x.status==='Vigente'&&(!q||[x.key,x.description,x.family].join(' ').toLowerCase().includes(q))).slice(0,6);
    const box=$('#publicCatalogResults'); if(!box)return; box.innerHTML=rows.length?rows.map(x=>`<div class="public-catalog-row"><div><b>${esc(x.key)}</b><span>${esc(x.description)}</span></div><div><small>${esc(x.type)} · Partida ${esc(x.partida)}</small><strong>${money(x.price)}</strong></div></div>`).join(''):'<div class="validation-banner warning">No se localizaron coincidencias vigentes en el catálogo demostrativo.</div>';
  }

  const accessBtn=$('#catalogAccessBtn'); if(accessBtn) accessBtn.onclick=openAccess;
  const publicSearchBtn=$('#publicCatalogSearchBtn'); if(publicSearchBtn) publicSearchBtn.onclick=publicCatalogSearch;
  const modulesBtn=$('#goModulesBtn'); if(modulesBtn) modulesBtn.onclick=()=>document.getElementById('compramexModules')?.scrollIntoView({behavior:'smooth'});
  const providerModuleBtn=$('#providerModuleBtn'); if(providerModuleBtn) providerModuleBtn.onclick=()=>document.getElementById('inicioPortal')?.scrollIntoView({behavior:'smooth'});
  const catModuleBtn=$('#catalogModuleBtn'); if(catModuleBtn) catModuleBtn.onclick=openAccess;
  $$('[data-future-module]').forEach(b=>b.onclick=()=>toast('Este módulo se muestra como punto de integración futuro. No forma parte del alcance funcional implementado en esta versión del prototipo.'));

  $('#logoutBtn')?.addEventListener('click',exitCatalogSession);
  $('#goPublic')?.addEventListener('click',exitCatalogSession);
  $('#resetDemo')?.addEventListener('click',()=>{localStorage.removeItem(STORAGE);state=clone(initialState);recentCatalogChanges.length=0;clearCatalogModal();});

  ensureRoleAllowed();
  if(state.active) loginCatalog(state.role,state.dependencyKey);
})();
