import {
  doc,
  deleteDoc,
  updateDoc
} from "firebase/firestore";
import { db } from "../firebase";
import Swal from "sweetalert2";

// 👇 NO tocamos tu algoritmo
const calculateDebts = (people, expenses, payments) => {
  const totals = {};
  people.forEach((p) => (totals[p.name] = 0));

  expenses.forEach((e) => {
    totals[e.payer] += e.amount;
  });

  const totalPersonas = people.reduce((acc, p) => acc + p.count, 0);
  const totalGasto = expenses.reduce((acc, e) => acc + e.amount, 0);
  const costoPorPersona = totalGasto / totalPersonas;

  const balances = people.map((p) => {
    const gastoEsperado = p.count * costoPorPersona;
    const balance = totals[p.name] - gastoEsperado;
    return { name: p.name, balance };
  });

  payments.forEach((p) => {
    const payer = balances.find((b) => b.name === p.from);
    const receiver = balances.find((b) => b.name === p.to);

    if (payer) payer.balance += p.amount;
    if (receiver) receiver.balance -= p.amount;
  });

  const balancesForDebts = balances.map((b) => ({ ...b }));

  const deudores = balancesForDebts.filter((b) => b.balance < -0.01);
  const acreedores = balancesForDebts.filter((b) => b.balance > 0.01);

  deudores.sort((a, b) => a.balance - b.balance);
  acreedores.sort((a, b) => b.balance - a.balance);

  const deudas = [];
  let i = 0;
  let j = 0;

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



export default function BalanceList({ people, expenses }) {
  if (!people.length) return null;

  const {
    balances,
    deudas,
    totalGasto,
    costoPorPersona,
  } = calculateDebts(people, expenses, []);

  // 👉 MODAL SOLO INFORMATIVO
  const showDebtModal = (deuda) => {
    const person = people.find(p => p.name === deuda.to);
    const alias = person?.alias;

    Swal.fire({
      title: "Deuda entre personas",
      html: `
        <div style="font-size:26px; line-height:1.5;">
          <strong style="color:#269181">${deuda.from}</strong> debe
        </div>

        <div style="font-size:34px; margin:10px 0;">
          <strong>$${deuda.amount.toFixed(2)}</strong>
        </div>

        <div style="font-size:26px;">
          a <strong style="color:#269181">${deuda.to}</strong>
        </div>

        ${
          alias
            ? `
              <hr />
              <p><strong>Alias para pagar</strong></p>
              <p
                id="copyAlias"
                style="
                  font-size:22px;
                  cursor:pointer;
                  color:#1976d2;
                  user-select:all;
                "
              >
                ${alias}
              </p>
              <p style="font-size:12px;color:gray">
                Tocá el alias para copiarlo
              </p>
            `
            : ""
        }
      `,
      background: "#dee0e0",
      color: "#283655",
      iconColor: "#269181",
      confirmButtonColor: "#35b67e",
      confirmButtonText: "Cerrar",
      didOpen: () => {
        if (!alias) return;

        const el = document.getElementById("copyAlias");
        el?.addEventListener("click", async () => {
          await navigator.clipboard.writeText(alias);

          Swal.fire({
            toast: true,
            position: "top",
            icon: "success",
            title: "Alias copiado",
            timer: 1500,
            showConfirmButton: false,
          });
        });
      },
    });
  };

 return (
    <div className="card">
      <h2>Balance</h2>

      <strong>Total gastado: ${totalGasto.toFixed(2)}</strong>
      <br />
      <strong>A pagar cada uno: ${costoPorPersona.toFixed(2)}</strong>

      {/* {!isClosed && ( */}
        <>
          <h3 className="balance">Balance individual</h3>
          <ul>
            {balances.map((b, i) => (
              <li key={i}>
                {b.name}:{" "}
                {b.balance > 0.01
                  ? `le deben $${b.balance.toFixed(2)}`
                  : b.balance < -0.01
                  ? `debe $${Math.abs(b.balance).toFixed(2)}`
                  : "está justo"}
              </li>
            ))}
          </ul>
        </>
      {/* )} */}

      <h3 className="balance">Deudas entre personas</h3>

      {deudas.length === 0 ? (
        <p>Todos están a mano</p>
      ) : (

        <ul>
    {deudas.map((d, i) => (
      <li className="deudores clickable" 
        key={`${d.from}-${d.to}-${i}`}        
        onClick={() => showDebtModal(d)}
      >
        <strong className="deudor">{d.from}</strong> debe $<strong className="monto">{d.amount.toFixed(2)}</strong> a{" "}
        <strong className="acreedor">{d.to}</strong>
      </li>
    ))}
  </ul>
        
      )}
    </div>
  );
}