const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');

const context = { console, Intl };
vm.createContext(context);
vm.runInContext(fs.readFileSync(new URL('../js/procedures-rules.js', `file://${__dirname}/`).pathname, 'utf8'), context);
const Rules = context.CompramexProcedureRules;

const officialiaRoles = Object.keys(Rules.ROLE_CATALOG).filter(code => code.startsWith('OM-PC-'));
assert.deepEqual(officialiaRoles, ['OM-PC-00', 'OM-PC-01', 'OM-PC-02', 'OM-PC-03', 'OM-PC-04', 'OM-PC-05', 'OM-PC-06', 'OM-PC-07', 'OM-PC-08']);
assert.equal(Object.values(Rules.ROLE_CATALOG).some(role => /Mercado|Catálogo de Bienes/i.test(role.label)), false);
assert.equal(Rules.CREATION_DEFAULTS['OM-PC-00'], true);
assert.equal(Rules.CREATION_DEFAULTS['OM-PC-03'], false);
assert.equal(Rules.CREATION_DEFAULTS['DEP-AR'], true);
assert.equal(Rules.CREATION_DEFAULTS['DEP-CA'], false);

const dependencyRequest = { dependencyKey: '205', requestingArea: '205-a1', assignedDirection: '' };
const directionARequest = { dependencyKey: '205', requestingArea: '205-a1', assignedDirection: 'OM_DPA_A', status: 'Asignada a Dirección' };
const directionBRequest = { dependencyKey: '205', requestingArea: '205-a1', assignedDirection: 'OM_DPA_B', status: 'Asignada a Dirección' };

assert.equal(Rules.inScope({ roleCode: 'DEP-AR', dependencyKey: '205', areaId: '205-a1' }, dependencyRequest), true);
assert.equal(Rules.actionAllowed({ roleCode: 'DEP-AR', dependencyKey: '205', areaId: '205-a1' }, {}, 'create'), true);
assert.equal(Rules.actionAllowed({ roleCode: 'DEP-AR', dependencyKey: '205', areaId: '205-a1' }, dependencyRequest, 'assign'), false);
assert.equal(Rules.inScope({ roleCode: 'OM-PC-01', adscription: 'OM_DPA_A' }, directionARequest), true);
assert.equal(Rules.inScope({ roleCode: 'OM-PC-01', adscription: 'OM_DPA_A' }, directionBRequest), false);
assert.equal(Rules.actionAllowed({ roleCode: 'OM-PC-00' }, { status: 'Pendiente de asignación' }, 'assign'), true);
assert.equal(Rules.actionAllowed({ roleCode: 'OM-PC-00' }, { status: 'Pendiente de asignación' }, 'reassign'), false);
assert.equal(Rules.canTransition('Borrador', 'Concluida'), false);
assert.equal(Rules.canTransition('Pendiente de asignación', 'Asignada a Dirección'), true);
assert.equal(Rules.canTransition('Asignada a Dirección', 'En atención'), true);

console.log(`Procedure authorization: ${officialiaRoles.length} perfiles OM-PC y controles de segregación correctos`);
