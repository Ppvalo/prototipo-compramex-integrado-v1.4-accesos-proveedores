const assert = require('node:assert/strict');
const requirements = require('../js/provider-requirements-2026.js');
const base = {
  tipoSolicitud:'Alta',tipoPersona:'Persona física',fiscalEntidad:'Estado de México',
  fiscalCalle:'Calle 1',fiscalCp:'50000',fiscalMunicipio:'Toluca',
  comercialEntidad:'Estado de México',comercialCalle:'Calle 1',comercialCp:'50000',comercialMunicipio:'Toluca'
};
const ctx = {fiscalCase:'annual',imss:'yes',previousCedula:'available',changes:'no'};
const nums = (form, context=ctx) => requirements.visible(form,context).map(row=>row.number);
const row = number => requirements.catalog.find(item=>item.number===number);

assert.deepEqual(requirements.catalog.map(r=>r.number),Array.from({length:23},(_,i)=>i+1));
assert.deepEqual(nums(base),[1,2,4,5,7,8,9,10,11,13,14,15,16,17,18,19,20,23]);
assert.deepEqual(nums({...base,tipoPersona:'Persona jurídica colectiva'}),[1,2,3,5,6,7,8,9,10,11,13,14,15,16,17,18,19,20,23]);
assert(nums({...base,tipoSolicitud:'Renovación'}).includes(21));
assert(nums({...base,tipoSolicitud:'Renovación'}).includes(22));
assert(!nums(base).includes(21));
assert(!nums(base).includes(22));
assert(nums({...base,fiscalEntidad:'Ciudad de México'}).includes(12));
assert(!nums(base).includes(12));
assert.equal(row(23).optional,true);
assert.equal(requirements.slots(row(9),base,ctx).length,2);
assert.equal(requirements.slots(row(19),base,ctx).length,4);
assert.equal(requirements.slots(row(19),{...base,comercialCalle:'Calle 2'},ctx).length,8);
assert.deepEqual(requirements.slots(row(14),base,ctx).map(s=>s.id),['declaracion','acuse','estados']);
assert.deepEqual(requirements.slots(row(14),base,{...ctx,fiscalCase:'dictaminados'}).map(s=>s.id),['dictamen']);
assert.deepEqual(requirements.slots(row(14),base,{...ctx,fiscalCase:'new'}).map(s=>s.id),['cuenta']);
assert.deepEqual(requirements.slots(row(14),base,{...ctx,fiscalCase:'rif'}).map(s=>s.id),['bimestral']);
assert(!requirements.choices({...base,tipoPersona:'Persona jurídica colectiva'},ctx).find(c=>c.id==='fiscalCase').options.some(([id])=>id==='rif'));
assert.deepEqual(requirements.slots(row(17),base,{...ctx,imss:'no'}).map(s=>s.id),['escrito']);
assert.deepEqual(requirements.slots(row(21),{...base,tipoSolicitud:'Renovación'},{...ctx,previousCedula:'lost'}).map(s=>s.id),['extravío']);
assert.deepEqual(requirements.slots(row(22),{...base,tipoSolicitud:'Renovación'},{...ctx,changes:'yes'}).map(s=>s.id),['carta','soportes']);
assert.deepEqual(requirements.pendingChoices({...base,tipoSolicitud:'Renovación'},{}).length,4);
console.log('OK: catálogo 1–23, personas, trámites, condiciones, alternativas y múltiples archivos');
