export default function BalanceList({ people, expenses }) {
  if (people.length === 0) return null;

  // --- Totales por persona ---
  const totals = {};
  people.forEach((p) => (totals[p.name] = 0));

  expenses.forEach((e) => {
    totals[e.payer] += e.amount;
  });

  // --- Calcular total ponderado por cantidad ---
  const totalPersonas = people.reduce((acc, p) => acc + p.count, 0);
  const totalGasto = expenses.reduce((acc, e) => acc + e.amount, 0);
  const costoPorPersona = totalGasto / totalPersonas;

  // --- Balance original (NO se debe modificar) ---
  const balances = people.map((p) => {
    const gastoEsperado = p.count * costoPorPersona;
    const balance = totals[p.name] - gastoEsperado;
    return { name: p.name, balance };
  });

  // --- CLON para calcular deudas ---
  const balancesForDebts = balances.map(b => ({ ...b }));

  // --- Deudores y acreedores ---
  const deudores = balancesForDebts.filter((b) => b.balance < -0.01);
  const acreedores = balancesForDebts.filter((b) => b.balance > 0.01);

  deudores.sort((a, b) => a.balance - b.balance);
  acreedores.sort((a, b) => b.balance - a.balance);

  const deudas = [];
  let i = 0;
  let j = 0;

  while (i < deudores.length && j < acreedores.length) {
    const debe = Math.abs(deudores[i].balance);
    const recibe = acreedores[j].balance;

    const monto = Math.min(debe, recibe);

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

  return (
    <div className="card">
      <h2>Balance</h2>
      <p>Total gastado: ${totalGasto.toFixed(2)}</p>

      <h3 className="balance">Balance individual</h3>
      <ul>
        {balances.map((b, i) => {
          let text = "está justo";
          if (b.balance > 0.01) text = `le deben $${b.balance.toFixed(2)}`;
          if (b.balance < -0.01) text = `debe $${Math.abs(b.balance).toFixed(2)}`;
          return <li key={i}>{b.name}: {text}</li>;
        })}
      </ul>

      <h3 className="balance">Deudas entre personas</h3>
      {deudas.length === 0 ? (
        <p>Todos están a mano</p>
      ) : (
        <ul>
          {deudas.map((d, i) => (
            <li key={i}>
              <strong>{d.from}</strong> debe{" "}
              <strong>${d.amount.toFixed(2)}</strong> a{" "}
              <strong>{d.to}</strong>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}


// export default function BalanceList({ people, expenses }) {
//   if (people.length === 0) return null;

//   // total personas reales
//   const totalPersonas = people.reduce((acc, p) => acc + p.count, 0);

//   // gasto por persona real
//   const totalGasto = expenses.reduce((acc, e) => acc + e.amount, 0);
//   const costoPorPersona = totalGasto / totalPersonas;

//   // cuánto debería pagar cada familia según su tamaño
//   const deberiaPagar = {};
//   people.forEach(p => {
//     deberiaPagar[p.name] = p.count * costoPorPersona;
//   });

//   // cuánto pagó cada familia
//   const pagado = {};
//   people.forEach(p => (pagado[p.name] = 0));
//   expenses.forEach(e => (pagado[e.payer] += e.amount));

//   // balance
//   const balances = people.map(p => ({
//     name: p.name,
//     balance: pagado[p.name] - deberiaPagar[p.name],
//   }));

//   const deudores = balances.filter(b => b.balance < -0.01);
//   const acreedores = balances.filter(b => b.balance > 0.01);

//   const deudas = [];
//   let i = 0, j = 0;

//   const d = [...deudores].sort((a,b)=>a.balance-b.balance);
//   const a = [...acreedores].sort((a,b)=>b.balance-a.balance);

//   while (i < d.length && j < a.length) {
//     const debe = Math.abs(d[i].balance);
//     const recibe = a[j].balance;

//     const monto = Math.min(debe, recibe);

//     deudas.push({
//       from: d[i].name,
//       to: a[j].name,
//       amount: monto,
//     });

//     d[i].balance += monto;
//     a[j].balance -= monto;

//     if (Math.abs(d[i].balance) < 0.01) i++;
//     if (a[j].balance < 0.01) j++;
//   }

//   return (
//     <div className="card">
//       <h2>⚖️ Balances</h2>
//       <p>Total gastado: ${totalGasto.toFixed(2)}</p>

//       <h3>Balance individual</h3>
//       <ul>
//         {balances.map((b, i) => (
//           <li key={i}>
//             {b.name}:{" "}
//             {b.balance > 0
//               ? `le deben $${b.balance.toFixed(2)}`
//               : b.balance < 0
//               ? `debe $${Math.abs(b.balance).toFixed(2)}`
//               : "está justo"}
//           </li>
//         ))}
//       </ul>

//       <h3>🔗 Deudas entre personas</h3>
//       {deudas.length === 0 ? (
//         <p>Todos están a mano 👍</p>
//       ) : (
//         <ul>
//           {deudas.map((d, i) => (
//             <li key={i}>
//               <strong>{d.from}</strong> debe{" "}
//               <strong>${d.amount.toFixed(2)}</strong> a{" "}
//               <strong>{d.to}</strong>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }


// export default function BalanceList({ people, expenses }) {
//   if (people.length === 0) return null;

//   // Total de "unidades" de personas
//   const totalUnits = people.reduce((acc, p) => acc + p.count, 0);

//   // Total gastado
//   const totalGasto = expenses.reduce((acc, e) => acc + e.amount, 0);

//   // Costo por unidad
//   const costoUnidad = totalUnits > 0 ? totalGasto / totalUnits : 0;

//   // Totales pagados por persona
//   const totals = {};
//   people.forEach((p) => (totals[p.name] = 0));

//   expenses.forEach((e) => {
//     totals[e.payer] += e.amount;
//   });

//   // Balances
//   const balances = people.map((p) => {
//     const debe = p.count * costoUnidad; // Lo que debía pagar según su tamaño
//     const balance = totals[p.name] - debe;
//     return { name: p.name, balance };
//   });

//   // Deudas entre personas (igual que antes)
//   const deudores = balances.filter((b) => b.balance < -0.01);
//   const acreedores = balances.filter((b) => b.balance > 0.01);

//   deudores.sort((a, b) => a.balance - b.balance);
//   acreedores.sort((a, b) => b.balance - a.balance);

//   const deudas = [];
//   let i = 0;
//   let j = 0;

//   while (i < deudores.length && j < acreedores.length) {
//     const debe = Math.abs(deudores[i].balance);
//     const recibe = acreedores[j].balance;

//     const monto = Math.min(debe, recibe);

//     deudas.push({
//       from: deudores[i].name,
//       to: acreedores[j].name,
//       amount: monto,
//     });

//     deudores[i].balance += monto;
//     acreedores[j].balance -= monto;

//     if (Math.abs(deudores[i].balance) < 0.01) i++;
//     if (acreedores[j].balance < 0.01) j++;
//   }

//   return (
//     <div className="card">
//       <h2>⚖️ Balances</h2>
//       <p>Total gastado: ${totalGasto.toFixed(2)}</p>

//       <h3>Balance individual (considerando tamaño de familia)</h3>
//       <ul>
//         {balances.map((b, i) => (
//           <li key={i}>
//             {b.name}:{" "}
//             {b.balance > 0.01
//               ? `le deben $${b.balance.toFixed(2)}`
//               : b.balance < -0.01
//               ? `debe $${Math.abs(b.balance).toFixed(2)}`
//               : "está justo"}
//           </li>
//         ))}
//       </ul>

//       <h3>🔗 Deudas entre personas</h3>
//       {deudas.length === 0 ? (
//         <p>Todos están a mano 👍</p>
//       ) : (
//         <ul>
//           {deudas.map((d, i) => (
//             <li key={i}>
//               <strong>{d.from}</strong> debe{" "}
//               <strong>${d.amount.toFixed(2)}</strong> a{" "}
//               <strong>{d.to}</strong>
//             </li>
//           ))}
//         </ul>
//       )}
//     </div>
//   );
// }

