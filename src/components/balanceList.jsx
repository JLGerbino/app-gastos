import { collection, addDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import Swal from "sweetalert2";
import { useTranslation } from "react-i18next";
import i18n from "i18next";

//cambio de lenguaje y local storage
const changeLang = (lang) => {
  i18n.changeLanguage(lang);
  localStorage.setItem("lang", lang);
};


// La que calcula todo
const calculateDebts = (people, expenses, payments) => {
  const balancesMap = {};
  // Inicializar balances en 0
  people.forEach((p) => {
    balancesMap[p.name] = 0;
  });
  // Procesar cada gasto individualmente
  expenses.forEach((expense) => {
    const { payer, amount, participants } = expense;

    let currentParticipants = participants;
    //Si no hay participants (gastos viejos)
    if (!currentParticipants || currentParticipants.length === 0) {
      currentParticipants = people.map(p => ({
        name: p.name,
        units: p.count
      }));
    }

    const totalUnits = currentParticipants.reduce(
      (acc, p) => acc + Number(p.units),
      0
    );

    if (totalUnits === 0) return;

    const valuePerUnit = amount / totalUnits;

    balancesMap[payer] += amount;

    currentParticipants.forEach((p) => {
      const share = valuePerUnit * Number(p.units);
      balancesMap[p.name] -= share;
    });
  });
  // Convertir a array
  const balances = Object.entries(balancesMap).map(([name, balance]) => ({
    name,
    balance,
  }));
  // Aplicar pagos manuales
  payments.forEach((p) => {
    const payer = balances.find((b) => b.name === p.from);
    const receiver = balances.find((b) => b.name === p.to);

    if (payer) payer.balance += p.amount;
    if (receiver) receiver.balance -= p.amount;
  });
  //Balances
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

  const totalGasto = expenses.reduce((acc, e) => acc + e.amount, 0);

  return {
    balances,
    deudas,
    totalGasto,
    costoPorPersona: null,
  };
};


export default function BalanceList({
  people,
  expenses,
  payments = [],
  groupId,
  canEdit,
  handleClearPayments,
}) {
  if (!people.length) return null;

  const {
    balances,
    deudas,
    totalGasto,
  } = calculateDebts(people, expenses, payments);

  const { t } = useTranslation(); //traductor

  //Registrar pago
  const markAsPaid = async (deuda) => {
    const result = await Swal.fire({
      title: "Confirmar pago",
      html: `
        <p style="font-size:20px">
          ${deuda.from} pagó
          <strong>$${deuda.amount.toFixed(2)}</strong>
          a ${deuda.to}?
        </p>
      `,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Confirmar",
      cancelButtonText: "Cancelar",
      background: "#dee0e0",
      color: "#283655",
      iconColor: "#269181",
      confirmButtonColor: "#35b67e",
    });

    if (!result.isConfirmed) return;
    Swal.fire({
      title: "Registrando pago...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      background: "#dee0e0",
      color: "#283655",
      iconColor: "#269181",
      confirmButtonColor: "#35b67e",
      didOpen: () => {
        Swal.showLoading();
      },
    });

    await addDoc(
      collection(db, "groups", groupId, "payments"),
      {
        from: deuda.from,
        to: deuda.to,
        amount: deuda.amount,
        createdAt: new Date(),
      }
    );

    Swal.fire({
      icon: "success",
      title: "Pago registrado",
      background: "#dee0e0",
      color: "#283655",
      iconColor: "#269181",
      timer: 1500,
      showConfirmButton: false,
    });
  };

  //Eliminar pago
  const undoPayment = async (payment) => {
    const result = await Swal.fire({
      title: "¿Eliminar pago?",
      html: `
      <p style="font-size:18px">
        ¿Querés eliminar el pago de
        <strong>${payment.from}</strong> a
        <strong>${payment.to}</strong>?
      </p>
    `,
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
      background: "#dee0e0",
      color: "#283655",
      iconColor: "#269181",
      confirmButtonColor: "#35b67e",
    });

    if (!result.isConfirmed) return;

    Swal.fire({
      title: "Eliminando pago...",
      allowOutsideClick: false,
      allowEscapeKey: false,
      background: "#dee0e0",
      color: "#283655",
      iconColor: "#269181",
      confirmButtonColor: "#35b67e",
      didOpen: () => {
        Swal.showLoading();
      },
    });

    await deleteDoc(
      doc(db, "groups", groupId, "payments", payment.id)
    );

    Swal.fire({
      icon: "success",
      title: "Pago eliminado",
      timer: 1200,
      color: "#283655",
      iconColor: "#269181",
      showConfirmButton: false,
    });
  };
  

  //Modal total gastos
  const showTotalExpenses = () => {
    Swal.fire({
      title: "Total gastado:",
      html: `
        <div style="font-size:26px; line-height:1.5;">
          <strong style="color:#269181">${totalGasto.toFixed(2)}</strong> 
        </div>        
      `,
      background: "#dee0e0",
      color: "#283655",
      iconColor: "#269181",
      confirmButtonColor: "#35b67e",
      confirmButtonText: "Cerrar",
    });
  };


  //Modal deuda entre personas
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

        ${alias
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

  //modal para pagos
 const showPayModal = (pago) => {
    Swal.fire({
      title: "Detalle del pago",
      html: `
        <div style="font-size:26px; line-height:1.5;">
          <strong style="color:#269181">${pago.from}</strong> pagó
        </div>

        <div style="font-size:34px; margin:10px 0;">
          <strong>$${pago.amount.toFixed(2)}</strong>
        </div>

        <div style="font-size:26px;">
          a <strong style="color:#269181">${pago.to}</strong>
        </div>
      `,
      background: "#dee0e0",
      color: "#283655",
      iconColor: "#269181",
      confirmButtonColor: "#35b67e",
      confirmButtonText: "Cerrar",
    });
  };


  return (
    <div className="card" id="section-balance">
      <h2 className="titulo">{t("balance")}</h2>      

<div style={{ marginBottom: "10px" }}>
  <button onClick={() => changeLang("es")}>ES</button>
  <button onClick={() => changeLang("en")}>EN</button>
  <button onClick={() => changeLang("pt")}>PT</button>
  <button onClick={() => changeLang("fr")}>FR</button></div>


      <strong className="people-name expense-payer" onClick={() => showTotalExpenses()}>{t("totalGastado")}: {t("$")}{totalGasto.toFixed(2)}</strong>
      <h3 className="balance">{t("balanceIndividual")}</h3>
      <ul>
        {balances.map((b, i) => (
          <li style={{ marginBottom: "8px" }} key={i}>
            {b.name}:{" "}
            {b.balance > 0.01
              ? `${t("leDeben")} ${t("$")}${b.balance.toFixed(2)}`
              : b.balance < -0.01
                ? `${t("debe")} ${t("$")}${Math.abs(b.balance).toFixed(2)}`
                : `${t("estaJusto")}`}
          </li>
        ))}
      </ul>
      <div className="titulo">
        <h3 className="balance">{t("deudas")}</h3>
      </div>
      {deudas.length === 0 ? (
        <p>{t("TodosMano")}</p>
      ) : (
        <ul>
          {deudas.map((d, i) => (
            <li className="people-item expense-item"
              key={`${d.from}-${d.to}-${i}`}
            >
              <span
                className="clickable people-name expense-payer"
                onClick={() => showDebtModal(d)}
              >
                <strong className="deudor">{d.from}</strong> {t("debe")} {t("$")}
                <strong className="monto">{d.amount.toFixed(2)}</strong> {t("a")} {" "}
                <strong className="acreedor">{d.to}</strong>
              </span>

              {canEdit && (<button
                onClick={() => markAsPaid(d)}
              ><i className="fa-solid fa-dollar-sign"></i>
              </button>)}
            </li>
          ))}
        </ul>
      )}

      <h3 className="balance">{t("pagos realizados")}</h3>

      {payments.length === 0 ? (
        <p>{t("noPayments")}</p>
      ) : (
        <ul>
          {payments.map((p) => (
            <li className="people-item expense-item"
              key={p.id}
            >
              <span className="clickable people-name expense-payer"
              onClick={() => showPayModal(p)}>

                <strong>{p.from}</strong> {t("pagó")} {t("$")}
                <strong>{p.amount.toFixed(2)}</strong> {t("a")}{" "}
                <strong>{p.to}</strong>
              </span>

              {canEdit && (<button
                onClick={() => undoPayment(p)}
              >
                <i className="fa-solid fa-trash"></i>
              </button>)}
            </li>
          ))}
        </ul>
      )}
      <div>
        {canEdit && (<button
          className="btn-danger"
          onClick={handleClearPayments}
          disabled={!payments?.length}
        >
          <i className="fa-solid fa-trash"></i> {t("borrarTodosPagos")}</button>)}

      </div>
    </div>
  );
}
