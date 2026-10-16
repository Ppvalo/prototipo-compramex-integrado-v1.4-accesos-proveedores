const fs = require('fs');
const vm = require('vm');

const context = { console, Intl };
vm.createContext(context);
vm.runInContext(fs.readFileSync(new URL('../js/procedures-rules.js', `file://${__dirname}/`).pathname, 'utf8'), context);
const Rules = context.CompramexProcedureRules;

const cases = [
  [5800000, 150000, 'AD'],
  [5800000, 150001, 'IR'],
  [5800000, 400000, 'IR'],
  [5800000, 400001, 'LPN'],
  [6500000, 150000, 'AD'],
  [6500001, 175000, 'AD'],
  [6500001, 175001, 'IR'],
  [13000000, 600000, 'IR'],
  [13000001, 600001, 'IR'],
  [13000001, 800001, 'LPN'],
  [19500000, 800000, 'IR'],
  [26000000, 1000000, 'IR'],
  [26000001, 1500001, 'LPN'],
  [30000000, 500000.55, 'IR']
];

let passed = 0;
for (const [budgetAuthorized, estimatedAmountNoVat, expected] of cases) {
  const result = Rules.recommendation({ exercise: 2026, budgetAuthorized, estimatedAmountNoVat });
  if (result.suggested !== expected) {
    throw new Error(`${budgetAuthorized}/${estimatedAmountNoVat}: ${result.suggested} != ${expected}`);
  }
  passed += 1;
}

for (const input of [
  { exercise: 2026, budgetAuthorized: 5800000, estimatedAmountNoVat: -1 },
  { exercise: 2027, budgetAuthorized: 5800000, estimatedAmountNoVat: 1000 },
  { exercise: 2026, budgetAuthorized: '', estimatedAmountNoVat: 1000 }
]) {
  if (Rules.recommendation(input).status !== 'pending') {
    throw new Error(`El caso debía quedar pendiente: ${JSON.stringify(input)}`);
  }
  passed += 1;
}

console.log(`Procedure rules: ${passed} cases passed`);
