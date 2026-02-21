export const calculateDebts = (people, expenses) => {
  const totals = {};
  people.forEach(p => (totals[p.name] = 0));

  expenses.forEach(e => {
    totals[e.payer] += e.amount;
  });

  const totalPersonas = people.reduce((acc, p) => acc + p.count, 0);
  const totalGasto = expenses.reduce((acc, e) => acc + e.amount, 0);
  const costoPorPersona = totalGasto / totalPersonas;

  const balances = people.map(p => {
    const esperado = p.count * costoPorPersona;
    return {
      name: p.name,
      balance: totals[p.name] - esperado,
    };
  });

  const balancesForDebts = balances.map(b => ({ ...b }));
  const deudores = balancesForDebts.filter(b => b.balance < -0.01);
  const acreedores = balancesForDebts.filter(b => b.balance > 0.01);

  deudores.sort((a, b) => a.balance - b.balance);
  acreedores.sort((a, b) => b.balance - a.balance);

  const deudas = [];
  let i = 0, j = 0;

  while (i < deudores.length && j < acreedores.length) {
    const monto = Math.min(
      Math.abs(deudores[i].balance),
      acreedores[j].balance
    );

    deudas.push({
      from: deudores[i].name,
      to: acreedores[j].name,
      amount: monto,
    });

    deudores[i].balance += monto;
    acreedores[j].balance -= monto;

    if (Math.abs(deudores[i].balance) < 0.01) i++;
    if (acreedores[j].balance < 0.01) j++;
  }

  return { balances, deudas, totalGasto, costoPorPersona };
};





// export const calculateDebts = (people, expenses) => {
//   const totals = {};
//   people.forEach(p => (totals[p.name] = 0));

//   expenses.forEach(e => {
//     totals[e.payer] += e.amount;
//   });

//   const totalPersonas = people.reduce((acc, p) => acc + p.count, 0);
//   const totalGasto = expenses.reduce((acc, e) => acc + e.amount, 0);
//   const costoPorPersona = totalGasto / totalPersonas;

//   const balances = people.map(p => {
//     const esperado = p.count * costoPorPersona;
//     return { name: p.name, balance: totals[p.name] - esperado };
//   });

//   const debtors = balances.filter(b => b.balance < -0.01);
//   const creditors = balances.filter(b => b.balance > 0.01);

//   debtors.sort((a, b) => a.balance - b.balance);
//   creditors.sort((a, b) => b.balance - a.balance);

//   const deudas = [];
//   let i = 0, j = 0;

//   while (i < debtors.length && j < creditors.length) {
//     const amount = Math.min(
//       Math.abs(debtors[i].balance),
//       creditors[j].balance
//     );

//     deudas.push({
//       from: debtors[i].name,
//       to: creditors[j].name,
//       amount,
//     });

//     debtors[i].balance += amount;
//     creditors[j].balance -= amount;

//     if (Math.abs(debtors[i].balance) < 0.01) i++;
//     if (creditors[j].balance < 0.01) j++;
//   }

//   return { balances, deudas, totalGasto, costoPorPersona };
// };











// export const calculateDebts = (people, expenses, payments = []) => {
//   const totals = {};
//   people.forEach(p => (totals[p.name] = 0));

//   expenses.forEach(e => {
//     totals[e.payer] += e.amount;
//   });

//   const totalPersonas = people.reduce((acc, p) => acc + p.count, 0);
//   const totalGasto = expenses.reduce((acc, e) => acc + e.amount, 0);
//   const costoPorPersona = totalGasto / totalPersonas;

//   const balances = people.map(p => {
//     const esperado = p.count * costoPorPersona;
//     return { name: p.name, balance: totals[p.name] - esperado };
//   });

//   payments.forEach(p => {
//     const from = balances.find(b => b.name === p.from);
//     const to = balances.find(b => b.name === p.to);
//     if (from) from.balance += p.amount;
//     if (to) to.balance -= p.amount;
//   });

//   const debtors = balances.filter(b => b.balance < -0.01);
//   const creditors = balances.filter(b => b.balance > 0.01);

//   debtors.sort((a, b) => a.balance - b.balance);
//   creditors.sort((a, b) => b.balance - a.balance);

//   const deudas = [];
//   let i = 0, j = 0;

//   while (i < debtors.length && j < creditors.length) {
//     const amount = Math.min(
//       Math.abs(debtors[i].balance),
//       creditors[j].balance
//     );

//     deudas.push({
//       from: debtors[i].name,
//       to: creditors[j].name,
//       amount,
//     });

//     debtors[i].balance += amount;
//     creditors[j].balance -= amount;

//     if (Math.abs(debtors[i].balance) < 0.01) i++;
//     if (creditors[j].balance < 0.01) j++;
//   }

//   return { balances, deudas, totalGasto, costoPorPersona };
// };
