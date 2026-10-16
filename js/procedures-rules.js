(() => {
  const SOURCE = {
    exercise: 2026,
    decree: 'Decreto número 241 · Presupuesto de Egresos del Gobierno del Estado de México para el ejercicio fiscal 2026',
    article: 'Artículo 62',
    table: 'Tabla 19',
    published: '17 de diciembre de 2025',
    units: 'miles de pesos en la fuente; convertidos a pesos en el prototipo',
    noVat: true,
    note: 'La tabla aplica a adquisiciones, arrendamientos de bienes y contratación de servicios. No aplica a obra pública.'
  };

  const DEFAULT_CONFIG = {
    2026: {
      exercise: 2026,
      source: SOURCE,
      intervals: [
        { id: '2026-1', min: 0, max: 6500000, minExclusive: false, label: 'De $0 hasta $6,500,000', ad: 150000, ir: 400000 },
        { id: '2026-2', min: 6500000, max: 13000000, minExclusive: true, label: 'Más de $6,500,000 hasta $13,000,000', ad: 175000, ir: 600000 },
        { id: '2026-3', min: 13000000, max: 19500000, minExclusive: true, label: 'Más de $13,000,000 hasta $19,500,000', ad: 200000, ir: 800000 },
        { id: '2026-4', min: 19500000, max: 26000000, minExclusive: true, label: 'Más de $19,500,000 hasta $26,000,000', ad: 250000, ir: 1000000 },
        { id: '2026-5', min: 26000000, max: null, minExclusive: true, label: 'Más de $26,000,000', ad: 500000, ir: 1500000 }
      ]
    }
  };

  const ORIGINS = Object.freeze({
    DEPENDENCIA: 'DEPENDENCIA',
    OFICIALIA_MAYOR: 'OFICIALIA_MAYOR'
  });

  const DIRECTIONS = Object.freeze([
    { key: 'OM_DPA_A', short: 'A', label: 'Dirección de Procedimientos Adquisitivos A' },
    { key: 'OM_DPA_B', short: 'B', label: 'Dirección de Procedimientos Adquisitivos B' },
    { key: 'OM_DPA_SA', short: 'SA', label: 'Dirección de Procedimientos Adquisitivos del Sector Auxiliar y Apoyo Intersectorial' }
  ]);

  const STATUSES = Object.freeze([
    'Borrador',
    'Enviada a revisión',
    'Pendiente de revisión inicial',
    'Pendiente de asignación',
    'Asignada a Dirección',
    'En atención',
    'Devuelta para aclaración',
    'Pendiente de validación',
    'En procedimiento de contratación',
    'Concluida',
    'Cancelada'
  ]);

  const PROCEDURE_STATUSES = Object.freeze(['No iniciado', 'En preparación', 'En ejecución', 'Concluido']);
  const CONTRACT_STATUSES = Object.freeze(['No iniciado', 'En elaboración', 'Formalización pendiente', 'Formalizado', 'Cerrado']);

  const TRANSITIONS = Object.freeze({
    'Borrador': ['Enviada a revisión', 'Pendiente de asignación', 'Cancelada'],
    'Enviada a revisión': ['Pendiente de revisión inicial', 'Devuelta para aclaración', 'Cancelada'],
    'Pendiente de revisión inicial': ['Pendiente de asignación', 'Devuelta para aclaración', 'Cancelada'],
    'Pendiente de asignación': ['Asignada a Dirección', 'Devuelta para aclaración', 'Cancelada'],
    'Asignada a Dirección': ['En atención', 'Devuelta para aclaración', 'Cancelada'],
    'En atención': ['Pendiente de validación', 'En procedimiento de contratación', 'Devuelta para aclaración', 'Cancelada'],
    'Devuelta para aclaración': ['Enviada a revisión', 'Pendiente de revisión inicial', 'Pendiente de asignación', 'Cancelada'],
    'Pendiente de validación': ['En procedimiento de contratación', 'Devuelta para aclaración', 'Cancelada'],
    'En procedimiento de contratación': ['Concluida', 'Devuelta para aclaración', 'Cancelada'],
    'Concluida': [],
    'Cancelada': []
  });

  const ROLE_CATALOG = Object.freeze({
    'OM-PC-00': {
      code: 'OM-PC-00', label: 'Coordinador de Asignación de Procedimientos Adquisitivos', shortLabel: 'Coordinador de Asignación',
      module: 'PROCEDIMIENTOS_CONTRATACION', adscriptions: ['OM_CPA'], scope: 'CENTRAL'
    },
    'OM-PC-01': {
      code: 'OM-PC-01', label: 'Director de Procedimientos Adquisitivos', shortLabel: 'Director de Procedimientos',
      module: 'PROCEDIMIENTOS_CONTRATACION', adscriptions: ['OM_DPA_A', 'OM_DPA_B', 'OM_DPA_SA'], scope: 'DIRECTION'
    },
    'OM-PC-02': {
      code: 'OM-PC-02', label: 'Subdirector de Bases e Invitaciones', shortLabel: 'Subdirector de Bases e Invitaciones',
      module: 'PROCEDIMIENTOS_CONTRATACION', adscriptions: ['OM_DPA_A', 'OM_DPA_B', 'OM_DPA_SA'], scope: 'DIRECTION'
    },
    'OM-PC-03': {
      code: 'OM-PC-03', label: 'Responsable de Bases de Licitaciones Públicas', shortLabel: 'Responsable de Bases LPN',
      module: 'PROCEDIMIENTOS_CONTRATACION', adscriptions: ['OM_DPA_A', 'OM_DPA_B', 'OM_DPA_SA'], scope: 'DIRECTION'
    },
    'OM-PC-04': {
      code: 'OM-PC-04', label: 'Responsable de Bases para Invitaciones Restringidas y Adjudicaciones Directas', shortLabel: 'Responsable de Bases IR / AD',
      module: 'PROCEDIMIENTOS_CONTRATACION', adscriptions: ['OM_DPA_A', 'OM_DPA_B', 'OM_DPA_SA'], scope: 'DIRECTION'
    },
    'OM-PC-05': {
      code: 'OM-PC-05', label: 'Subdirector de Adquisiciones', shortLabel: 'Subdirector de Adquisiciones',
      module: 'PROCEDIMIENTOS_CONTRATACION', adscriptions: ['OM_DPA_A', 'OM_DPA_B', 'OM_DPA_SA'], scope: 'DIRECTION'
    },
    'OM-PC-06': {
      code: 'OM-PC-06', label: 'Responsable de Ejecución de Concursos', shortLabel: 'Responsable de Ejecución de Concursos',
      module: 'PROCEDIMIENTOS_CONTRATACION', adscriptions: ['OM_DPA_A', 'OM_DPA_B', 'OM_DPA_SA'], scope: 'DIRECTION'
    },
    'OM-PC-07': {
      code: 'OM-PC-07', label: 'Responsable de Apoyo a Comité', shortLabel: 'Responsable de Apoyo a Comité',
      module: 'PROCEDIMIENTOS_CONTRATACION', adscriptions: ['OM_DPA_A', 'OM_DPA_B', 'OM_DPA_SA'], scope: 'DIRECTION'
    },
    'OM-PC-08': {
      code: 'OM-PC-08', label: 'Responsable de Contratos', shortLabel: 'Responsable de Contratos',
      module: 'PROCEDIMIENTOS_CONTRATACION', adscriptions: ['OM_DPA_A', 'OM_DPA_B', 'OM_DPA_SA'], scope: 'DIRECTION'
    },
    'DEP-AR': {
      code: 'DEP-AR', label: 'Área Requirente', shortLabel: 'Área Requirente',
      module: 'PROCEDIMIENTOS_CONTRATACION', adscriptions: ['DEPENDENCIA'], scope: 'AREA'
    },
    'DEP-CA': {
      code: 'DEP-CA', label: 'Coordinación Administrativa', shortLabel: 'Coordinación Administrativa',
      module: 'PROCEDIMIENTOS_CONTRATACION', adscriptions: ['DEPENDENCIA'], scope: 'DEPENDENCY'
    }
  });

  const CREATION_DEFAULTS = Object.freeze({
    'OM-PC-00': true, 'OM-PC-01': false, 'OM-PC-02': false, 'OM-PC-03': false, 'OM-PC-04': false,
    'OM-PC-05': false, 'OM-PC-06': false, 'OM-PC-07': false, 'OM-PC-08': false,
    'DEP-AR': true, 'DEP-CA': false
  });

  const PERMISSIONS = Object.freeze({
    'OM-PC-00': ['view', 'receive', 'review_initial', 'classify', 'assign', 'reassign', 'create', 'reports', 'audit'],
    'OM-PC-01': ['view', 'supervise', 'validate', 'create_configurable', 'audit'],
    'OM-PC-02': ['view', 'supervise_bases', 'review_documents', 'create_configurable', 'audit'],
    'OM-PC-03': ['view', 'elaborate_lpn', 'edit_documents', 'audit'],
    'OM-PC-04': ['view', 'elaborate_ir_ad', 'edit_documents', 'audit'],
    'OM-PC-05': ['view', 'supervise_execution', 'validate', 'create_configurable', 'audit'],
    'OM-PC-06': ['view', 'execute_contest', 'record_act', 'audit'],
    'OM-PC-07': ['view', 'committee_support', 'record_agreement', 'audit'],
    'OM-PC-08': ['view', 'manage_contract', 'edit_documents', 'audit'],
    'DEP-AR': ['view', 'create', 'edit_own', 'submit_to_ca', 'answer_return', 'audit_own'],
    'DEP-CA': ['view', 'review_dependency', 'request_clarification', 'remit_to_om', 'audit_dependency']
  });

  const ACTION_LABELS = Object.freeze({
    receive: 'Recepción de solicitudes', review_initial: 'Revisión documental inicial', classify: 'Clasificación y canalización',
    assign: 'Asignación a Dirección', reassign: 'Reasignación de expedientes', create: 'Creación de solicitudes',
    supervise: 'Supervisión de expedientes', supervise_bases: 'Supervisión de bases e invitaciones',
    elaborate_lpn: 'Elaboración de bases LPN', elaborate_ir_ad: 'Elaboración de bases IR / AD',
    supervise_execution: 'Supervisión de ejecución', execute_contest: 'Ejecución de concursos',
    committee_support: 'Apoyo a Comité', manage_contract: 'Gestión contractual', reports: 'Reportes de asignación',
    audit: 'Consulta de bitácora', edit_own: 'Edición de solicitudes propias', submit_to_ca: 'Remisión a Coordinación Administrativa',
    answer_return: 'Atención de devoluciones', review_dependency: 'Revisión en ámbito de la dependencia',
    request_clarification: 'Solicitud de aclaraciones', remit_to_om: 'Remisión a Oficialía Mayor'
  });

  const clone = value => JSON.parse(JSON.stringify(value));
  const finiteNonNegative = value => Number.isFinite(Number(value)) && Number(value) >= 0;
  const money = value => Number.isFinite(Number(value))
    ? new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN', maximumFractionDigits: 2 }).format(Number(value))
    : '—';

  function configFor(exercise, config = DEFAULT_CONFIG) { return config[String(exercise)] || null; }

  function intervalFor(budgetAuthorized, exercise = 2026, config = DEFAULT_CONFIG) {
    const amount = Number(budgetAuthorized);
    const fiscal = configFor(exercise, config);
    if (!fiscal || !finiteNonNegative(amount)) return null;
    return fiscal.intervals.find(row => {
      const lowerOk = row.minExclusive ? amount > row.min : amount >= row.min;
      const upperOk = row.max === null ? true : amount <= row.max;
      return lowerOk && upperOk;
    }) || null;
  }

  function recommendation({ exercise, budgetAuthorized, estimatedAmountNoVat }, config = DEFAULT_CONFIG) {
    const missing = [];
    const fiscal = configFor(exercise, config);
    if (!String(exercise || '').trim()) missing.push('Ejercicio fiscal');
    if (!fiscal) missing.push(`Parámetros normativos configurados para ${exercise || 'el ejercicio seleccionado'}`);
    if (budgetAuthorized === '' || budgetAuthorized === null || budgetAuthorized === undefined) missing.push('Presupuesto autorizado de adquisiciones, arrendamientos y servicios');
    else if (!finiteNonNegative(budgetAuthorized)) missing.push('Presupuesto autorizado válido y no negativo');
    if (estimatedAmountNoVat === '' || estimatedAmountNoVat === null || estimatedAmountNoVat === undefined) missing.push('Monto estimado sin IVA');
    else if (!finiteNonNegative(estimatedAmountNoVat)) missing.push('Monto estimado sin IVA válido y no negativo');
    if (missing.length) return { status: 'pending', missing, suggested: '', message: 'Pendiente de determinar' };

    const row = intervalFor(budgetAuthorized, exercise, config);
    if (!row) return { status: 'pending', missing: ['Presupuesto autorizado dentro de un intervalo configurado'], suggested: '', message: 'Pendiente de determinar' };
    const amount = Number(estimatedAmountNoVat);
    const suggested = amount <= row.ad ? 'AD' : amount <= row.ir ? 'IR' : 'LPN';
    const explanation = suggested === 'AD'
      ? `El monto sin IVA (${money(amount)}) es igual o inferior al máximo de AD (${money(row.ad)}).`
      : suggested === 'IR'
        ? `El monto sin IVA (${money(amount)}) supera AD (${money(row.ad)}) y es igual o inferior al máximo de IR (${money(row.ir)}).`
        : `El monto sin IVA (${money(amount)}) supera el máximo de IR (${money(row.ir)}); se sugiere LPN sujeta a validación normativa.`;
    return {
      status: 'calculated', suggested, amount, budgetAuthorized: Number(budgetAuthorized), interval: row, fiscal,
      message: `Modalidad sugerida por monto: ${suggested}`, explanation, source: fiscal.source
    };
  }

  function validateInputs(input = {}) {
    const issues = [];
    if (!String(input.exercise || '').trim()) issues.push('Seleccione el ejercicio fiscal.');
    if (!String(input.dependencyKey || '').trim()) issues.push('Capture la institución de origen.');
    if (!String(input.areaId || '').trim()) issues.push('Capture o seleccione el área solicitante.');
    if (!String(input.description || '').trim()) issues.push('Capture el objeto o descripción de la necesidad.');
    if (!String(input.justification || '').trim()) issues.push('Capture la justificación de la necesidad.');
    if (!String(input.type || '').trim()) issues.push('Seleccione el tipo de contratación.');
    if (!finiteNonNegative(input.estimatedAmountNoVat)) issues.push('El monto estimado sin IVA debe ser numérico y no negativo.');
    if (!finiteNonNegative(input.budgetAuthorized)) issues.push('El presupuesto autorizado debe ser numérico y no negativo.');
    return issues;
  }

  function statusClass(status = '') {
    if (['Concluida'].includes(status)) return 'approved';
    if (['Devuelta para aclaración', 'Cancelada'].includes(status)) return 'observed';
    if (['Enviada a revisión', 'Pendiente de revisión inicial', 'Pendiente de validación'].includes(status)) return 'review';
    if (['Pendiente de asignación', 'Asignada a Dirección', 'En atención', 'En procedimiento de contratación'].includes(status)) return 'payment';
    return '';
  }

  function roleDefinition(roleCode) { return ROLE_CATALOG[String(roleCode)] || null; }
  function hasPermission(roleCode, action, creationAuthorizations = CREATION_DEFAULTS) {
    const code = String(roleCode || '');
    if (action === 'create') return !!creationAuthorizations[code];
    if (action === 'create_configurable') return !!creationAuthorizations[code];
    return (PERMISSIONS[code] || []).includes(action);
  }
  function canTransition(from, to) { return (TRANSITIONS[from] || []).includes(to); }
  function direction(key) { return DIRECTIONS.find(item => item.key === String(key)) || null; }

  function inScope(context = {}, procedure = {}) {
    const roleCode = String(context.roleCode || '');
    if (roleCode === 'OM-PC-00') return true;
    if (roleCode === 'DEP-AR') return String(procedure.dependencyKey) === String(context.dependencyKey) && String(procedure.requestingArea) === String(context.areaId);
    if (roleCode === 'DEP-CA') return String(procedure.dependencyKey) === String(context.dependencyKey);
    const role = roleDefinition(roleCode);
    if (!role) return false;
    if (role.scope === 'DIRECTION') return String(procedure.assignedDirection || '') === String(context.adscription || '');
    return false;
  }

  function actionAllowed(context = {}, procedure = {}, action = '') {
    const roleCode = String(context.roleCode || '');
    if (action === 'create') return hasPermission(roleCode, 'create', context.creationAuthorizations || CREATION_DEFAULTS);
    if (action === 'create_configurable') return hasPermission(roleCode, 'create_configurable', context.creationAuthorizations || CREATION_DEFAULTS);
    if (!inScope(context, procedure)) return false;
    if (action === 'edit') {
      if (roleCode === 'DEP-AR') return ['Borrador', 'Devuelta para aclaración'].includes(procedure.status) && inScope(context, procedure);
      if (roleCode === 'OM-PC-00') return procedure.origin === ORIGINS.OFICIALIA_MAYOR && ['Borrador', 'Devuelta para aclaración'].includes(procedure.status);
      if (['OM-PC-02', 'OM-PC-03', 'OM-PC-04', 'OM-PC-08'].includes(roleCode)) return ['Asignada a Dirección', 'En atención', 'En procedimiento de contratación'].includes(procedure.status);
      return false;
    }
    if (action === 'send_to_ca') return roleCode === 'DEP-AR' && ['Borrador', 'Devuelta para aclaración'].includes(procedure.status);
    if (action === 'ca_review') return roleCode === 'DEP-CA' && ['Enviada a revisión', 'Pendiente de revisión inicial'].includes(procedure.status);
    if (action === 'remit_to_om') return roleCode === 'DEP-CA' && ['Pendiente de revisión inicial', 'Pendiente de validación'].includes(procedure.status);
    if (action === 'initial_review') return roleCode === 'OM-PC-00' && ['Pendiente de asignación', 'Enviada a revisión'].includes(procedure.status);
    if (action === 'assign' || action === 'reassign') return roleCode === 'OM-PC-00' && (action === 'assign' ? procedure.status === 'Pendiente de asignación' : !!procedure.assignedDirection);
    if (action === 'supervise') return roleCode === 'OM-PC-01' && ['Asignada a Dirección', 'En atención', 'En procedimiento de contratación'].includes(procedure.status);
    if (action === 'bases_lpn') return ['OM-PC-02', 'OM-PC-03'].includes(roleCode) && ['Asignada a Dirección', 'En atención', 'En procedimiento de contratación'].includes(procedure.status);
    if (action === 'bases_ir_ad') return ['OM-PC-02', 'OM-PC-04'].includes(roleCode) && ['Asignada a Dirección', 'En atención', 'En procedimiento de contratación'].includes(procedure.status);
    if (action === 'execute') return ['OM-PC-05', 'OM-PC-06'].includes(roleCode) && ['Asignada a Dirección', 'En atención', 'En procedimiento de contratación'].includes(procedure.status);
    if (action === 'committee') return ['OM-PC-05', 'OM-PC-07'].includes(roleCode) && ['Asignada a Dirección', 'En atención', 'En procedimiento de contratación'].includes(procedure.status);
    if (action === 'contract') return roleCode === 'OM-PC-08' && ['En atención', 'En procedimiento de contratación'].includes(procedure.status);
    if (action === 'conclude') return ['OM-PC-01', 'OM-PC-05', 'OM-PC-08'].includes(roleCode) && ['En procedimiento de contratación', 'Pendiente de validación'].includes(procedure.status);
    if (action === 'audit') return hasPermission(roleCode, 'audit') || hasPermission(roleCode, 'audit_own') || hasPermission(roleCode, 'audit_dependency');
    return hasPermission(roleCode, action);
  }

  globalThis.CompramexProcedureRules = Object.freeze({
    SOURCE,
    DEFAULT_CONFIG: clone(DEFAULT_CONFIG),
    ORIGINS,
    DIRECTIONS: clone(DIRECTIONS),
    STATUSES: [...STATUSES],
    PROCEDURE_STATUSES: [...PROCEDURE_STATUSES],
    CONTRACT_STATUSES: [...CONTRACT_STATUSES],
    TRANSITIONS: clone(TRANSITIONS),
    ROLE_CATALOG: clone(ROLE_CATALOG),
    CREATION_DEFAULTS: clone(CREATION_DEFAULTS),
    PERMISSIONS: clone(PERMISSIONS),
    ACTION_LABELS: clone(ACTION_LABELS),
    MODALITIES: [
      { value: 'AD', label: 'Adjudicación directa (AD)' },
      { value: 'IR', label: 'Invitación restringida (IR)' },
      { value: 'LPN', label: 'Licitación pública (LPN)' }
    ],
    clone, money, configFor, intervalFor, recommendation, validateInputs, statusClass,
    roleDefinition, hasPermission, canTransition, direction, inScope, actionAllowed
  });
})();
