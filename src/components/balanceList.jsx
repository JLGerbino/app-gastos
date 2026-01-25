import Swal from "sweetalert2";


export default function BalanceList({ people, expenses }) {
  if (people.length === 0) return null;

  // Totales por persona
  const totals = {};
  people.forEach((p) => (totals[p.name] = 0));

  expenses.forEach((e) => {
    totals[e.payer] += e.amount;
  });

  // Calcular total ponderado por cantidad
  const totalPersonas = people.reduce((acc, p) => acc + p.count, 0);
  const totalGasto = expenses.reduce((acc, e) => acc + e.amount, 0);
  const costoPorPersona = totalGasto / totalPersonas;

  // Balance original (NO modificar)
  const balances = people.map((p) => {
    const gastoEsperado = p.count * costoPorPersona;
    const balance = totals[p.name] - gastoEsperado;
    return { name: p.name, balance };
  });

  // CLON para calcular deudas
  const balancesForDebts = balances.map(b => ({ ...b }));

  // Deudores y acreedores
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
  const getAliasByName = (name) => {
  const person = people.find(p => p.name === name);
  return person?.alias || null;
};


const showDebtModal = (deuda) => {
  const person = people.find(p => p.name === deuda.to);
  const alias = person?.alias;

  Swal.fire({
    title: "Deuda",
    html: `
      <div style="font-size:26px; line-height:1.5;">
        <strong>${deuda.from}</strong> debe
      </div> 
      <br />       
      <div style="font-size:30px; line-height:1.5;">
        <strong>$${deuda.amount.toFixed(2)}</strong>
      </div>
      <br />
      <div style="font-size:27px; line-height:1.5;">
        a <strong>${deuda.to}</strong>
      </div>

      ${
        alias
          ? `
            <hr />
            <div>
              Alias de ${deuda.to}: <div
              id="copyAliasPerson"
              style="
                margin-top: 12px;
                font-size: 22px;
                cursor:pointer;
                color:#1976d2;
                cursor: pointer;                
              "
            ><strong>${alias}</strong></div>
              <br />
              <span style="font-size:12px">Tocá el alias para copiarlo</span>
            </div>
          `
          : ""
      }
    `,
    background: "#dee0e0",
    color: "#283655",
    iconColor: "#269181",
    confirmButtonColor: "#35b67e",
    confirmButtonText: "Cerrar",
    allowOutsideClick: true,

    didOpen: () => {
      if (!alias) return;

      const aliasEl = document.getElementById("copyAliasPerson");

      aliasEl?.addEventListener("click", async () => {
        await navigator.clipboard.writeText(alias);

        Swal.fire({
          toast: true,
          position: "top",
          icon: "success",
          title: "Alias copiado",
          background: "#dee0e0",
          color: "#283655",
          iconColor: "#269181",
          showConfirmButton: false,
          timer: 1500,
        });
      });
    },
  });
};

  return (
    <div className="card">
      <h2>Balance</h2>
      <strong><p>Total gastado: ${totalGasto.toFixed(2)}</p></strong>
      <strong><p>A pagar cada uno: ${costoPorPersona.toFixed(2)}</p></strong>
<br />
      <h3 className="balance">Balance individual</h3>
      <ul>
        {balances.map((b, i) => {
          let text = "está justo";
          if (b.balance > 0.01) text = `le deben $${b.balance.toFixed(2)}`;
          if (b.balance < -0.01) text = `debe $${Math.abs(b.balance).toFixed(2)}`;
          return <li className="deudores" key={i}>{b.name}: {text}</li>;
        })}
      </ul>

<br />
      <h3 className="balance">Deudas entre personas</h3>
      {deudas.length === 0 ? (
        <p>Todos están a mano</p>
      ) : (
        <ul>
          {deudas.map((d, i) => (
            <li
  className="deudores deuda"
  key={i}  
  onClick={() => showDebtModal(d)}
>

            {/* <li className="deudores" key={i}> */}
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









// import { useState } from "react";

// export default function BalanceList({ people, expenses }) {
//   if (people.length === 0) return null;

//   const [selectedDebt, setSelectedDebt] = useState(null);

//   // Totales por persona
//   const totals = {};
//   people.forEach((p) => (totals[p.name] = 0));

//   expenses.forEach((e) => {
//     totals[e.payer] += e.amount;
//   });

//   const totalPersonas = people.reduce((acc, p) => acc + p.count, 0);
//   const totalGasto = expenses.reduce((acc, e) => acc + e.amount, 0);
//   const costoPorPersona = totalGasto / totalPersonas;

//   const balances = people.map((p) => {
//     const gastoEsperado = p.count * costoPorPersona;
//     const balance = totals[p.name] - gastoEsperado;
//     return { name: p.name, balance };
//   });

//   const balancesForDebts = balances.map((b) => ({ ...b }));

//   const deudores = balancesForDebts.filter((b) => b.balance < -0.01);
//   const acreedores = balancesForDebts.filter((b) => b.balance > 0.01);

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
//     <>
//       <div className="card">
//         <h2>Balance</h2>
//         <p>Total gastado: ${totalGasto.toFixed(2)}</p>
//         <p>A pagar cada uno: ${costoPorPersona.toFixed(2)}</p>

//         <h3 className="balance">Balance individual</h3>
//         <ul>
//           {balances.map((b, i) => {
//             let text = "está justo";
//             if (b.balance > 0.01)
//               text = `le deben $${b.balance.toFixed(2)}`;
//             if (b.balance < -0.01)
//               text = `debe $${Math.abs(b.balance).toFixed(2)}`;

//             return (
//               <li className="deudores" key={i}>
//                 {b.name}: {text}
//               </li>
//             );
//           })}
//         </ul>

//         <h3 className="balance">Deudas entre personas</h3>
//         {deudas.length === 0 ? (
//           <p>Todos están a mano</p>
//         ) : (
//           <ul>
//             {deudas.map((d, i) => (
//               <li
//                 className="deudores"
//                 key={i}
//                 style={{ cursor: "pointer" }}
//                 onClick={() => setSelectedDebt(d)}
//               >
//                 <strong>{d.from}</strong> debe{" "}
//                 <strong>${d.amount.toFixed(2)}</strong> a{" "}
//                 <strong>{d.to}</strong>
//               </li>
//             ))}
//           </ul>
//         )}
//       </div>

//       {/* 🔹 MODAL DEUDA */}
//       {selectedDebt && (
//         <div className="modal-overlay" onClick={() => setSelectedDebt(null)}>
//           <div className="modal" onClick={(e) => e.stopPropagation()}>
//             <button
//               className="modal-close"
//               onClick={() => setSelectedDebt(null)}
//             >
//               ✖
//             </button>

//             <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
//               Deuda
//             </h2>

//             <p style={{ fontSize: "22px", textAlign: "center" }}>
//               <strong>{selectedDebt.from}</strong> debe{" "}
//               <strong>${selectedDebt.amount.toFixed(2)}</strong> a{" "}
//               <strong>{selectedDebt.to}</strong>
//             </p>
//           </div>
//         </div>
//       )}
//     </>
//   );
// }











// export default function BalanceList({ people, expenses }) {
//   if (people.length === 0) return null;

//   // Totales por persona
//   const totals = {};
//   people.forEach((p) => (totals[p.name] = 0));

//   expenses.forEach((e) => {
//     totals[e.payer] += e.amount;
//   });

//   // Calcular total ponderado por cantidad
//   const totalPersonas = people.reduce((acc, p) => acc + p.count, 0);
//   const totalGasto = expenses.reduce((acc, e) => acc + e.amount, 0);
//   const costoPorPersona = totalGasto / totalPersonas;

//   // Balance original (NO modificar)
//   const balances = people.map((p) => {
//     const gastoEsperado = p.count * costoPorPersona;
//     const balance = totals[p.name] - gastoEsperado;
//     return { name: p.name, balance };
//   });

//   // CLON para calcular deudas
//   const balancesForDebts = balances.map(b => ({ ...b }));

//   // Deudores y acreedores
//   const deudores = balancesForDebts.filter((b) => b.balance < -0.01);
//   const acreedores = balancesForDebts.filter((b) => b.balance > 0.01);

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
//       <h2>Balance</h2>
//       <p>Total gastado: ${totalGasto.toFixed(2)}</p>
//       <p>A pagar cada uno: ${costoPorPersona.toFixed(2)}</p>

//       <h3 className="balance">Balance individual</h3>
//       <ul>
//         {balances.map((b, i) => {
//           let text = "está justo";
//           if (b.balance > 0.01) text = `le deben $${b.balance.toFixed(2)}`;
//           if (b.balance < -0.01) text = `debe $${Math.abs(b.balance).toFixed(2)}`;
//           return <li className="deudores" key={i}>{b.name}: {text}</li>;
//         })}
//       </ul>


//       <h3 className="balance">Deudas entre personas</h3>
//       {deudas.length === 0 ? (
//         <p>Todos están a mano</p>
//       ) : (
//         <ul>
//           {deudas.map((d, i) => (
//             <li className="deudores" key={i}>
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


