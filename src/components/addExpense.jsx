import { useState } from "react";
import Swal from "sweetalert2";
export default function AddExpense({
  //groupId,
  group,
  people,
  expenses,
  addExpenseToDB,
  deleteExpenseFromDB,
  deleteAllExpenses,
  canEdit,
 
}) {
  const [payer, setPayer] = useState("");
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");

  const addExpense = () => {
    if (!payer || !amount) return Swal.fire({
      icon: "warning",
      background: "#dee0e0",
      color: "#283655",
      iconColor: "#269181",
      confirmButtonColor: "#35b67e",
      title:"Completa todos los campos",
      confirmButtonText: "Cerrar",
  });

    const newExpense = {
      payer,
      desc,
      amount: parseFloat(amount)
    };

    addExpenseToDB(newExpense);

    setDesc("");
    setAmount("");
    setPayer("");
  };

  const deleteExpense = async (expenseId) => { 
    const expense = expenses.find(e => e.id === expenseId);
    const result = await Swal.fire({
  title: "¿Eliminar gasto?",  
  html: `
    <div style="text-align:center; font-size:26px; margin-top:10px;">
      <p style=font-size:26px; margin-top:10px;"><strong>Pagó:</strong> ${expense.payer}</p>
      <p style=font-size:26px; margin-top:10px;"><strong>Detalle:</strong> ${expense.desc || "Sin descripción"}</p>
      <p style="font-size:26px; margin-top:10px;">
        <strong>Monto:</strong> $${Number(expense.amount).toFixed(2)}
      </p>
    </div>
    <p style="font-size:18px; margin-top:10px;">
        Esta acción no se puede deshacer
      </p>

  `,

  icon: "warning",
  showCancelButton: true,
  background: "#dee0e0",
  color: "#283655",
  iconColor: "#269181",
  confirmButtonColor: "#35b67e",
  confirmButtonText: "Eliminar",
  cancelButtonText: "Cancelar",
});

  if (!result.isConfirmed) return;

  // 🔒 Loading bloqueante
  Swal.fire({
    title: "Eliminando gasto...",
    allowOutsideClick: false,
    allowEscapeKey: false,
    background: "#dee0e0",
    color:"#283655",
    iconColor:"#269181",
    confirmButtonColor:"#35b67e",
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    await deleteExpenseFromDB(expenseId);

    // ✅ Reemplaza el loading
    await Swal.fire({
      icon: "success",
      title: "Eliminado",
      text: "El gasto fue eliminado",
      background: "#dee0e0",
      color:"#283655",
      iconColor:"#269181",
      confirmButtonColor:"#35b67e",
      confirmButtonText: "Cerrar",
      allowOutsideClick: false,
    });
  } catch (error) {
    console.error("Error eliminando gasto:", error);

    await Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo eliminar el gasto",
    });
  }
};

const deleteAll = async () => {
  const result = await Swal.fire({
    title: "¿Borrar TODOS los gastos?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    background: "#dee0e0",
    color:"#283655",
    iconColor:"#269181",
    confirmButtonColor: "#d33",
    confirmButtonText: "Sí, borrar todo",
    cancelButtonText: "Cancelar",
  });

  if (!result.isConfirmed) return;

  // 🔒 Loading bloqueante
  Swal.fire({
    title: "Eliminando gastos...",
    background: "#dee0e0",
    color:"#283655",
    iconColor:"#269181",      
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });

  try {
    await deleteAllExpenses();

    // ✅ Reemplaza el loading
    await Swal.fire({
      icon: "success",
      title: "Eliminados",
      text: "Todos los gastos fueron eliminados",
      background: "#dee0e0",
      color:"#283655",
      iconColor:"#269181",
      confirmButtonColor:"#35b67e",
      confirmButtonText:"listo",
      allowOutsideClick: false,
    });
  } catch (error) {
    console.error("Error borrando gastos:", error);
    Swal.fire(
      "Error",
      "No se pudieron borrar los gastos",
      "error"
    );
  }
};

//nuevo
const showPersonExpenses = (personName) => {
  const personExpenses = expenses.filter(
    e => e.payer === personName
  );

  const person = people.find(p => p.name === personName);
  const alias = person?.alias;

  if (personExpenses.length === 0) {
    Swal.fire(
      "Sin gastos",
      `${personName} no tiene gastos registrados`,
      "info"
    );
    return;
  }

  const total = personExpenses.reduce(
    (sum, e) => sum + Number(e.amount),
    0
  );

  const listHtml = personExpenses
    .map(e => `<li>${e.desc || "Sin descripción"} - $${e.amount}</li>`)
    .join("");

  Swal.fire({
    title: `Gastos de ${personName}`,
    html: `
      <ul style="text-align:left">
        ${listHtml}
      </ul>

      <hr />
      <strong>Total: $${total}</strong>

      ${
        alias
          ? `
            <hr />
            <p><strong>Alias para recibir transferencias</strong></p>
            <p 
              id="copyAliasExpense"
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
    color:"#283655",
    iconColor:"#269181",
    confirmButtonColor:"#35b67e",
    confirmButtonText: "Cerrar",
    didOpen: () => {
      if (!alias) return;

      const aliasEl = document.getElementById("copyAliasExpense");

      aliasEl?.addEventListener("click", async () => {
        await navigator.clipboard.writeText(alias);

        Swal.fire({
          toast: true,
          position: "top",
          icon: "success",
          title: "Alias copiado",
          background: "#dee0e0",
          color:"#283655",
          iconColor:"#269181",          
          showConfirmButton: false,
          timer: 1500,
        });
      });
    },
  });
};
console.log("AddExpense group:", group);
  return (
    <div className="card">
      <h2 id="section-expense" className="titulo">Agregar gasto</h2>
<div>
      <select value={payer} onChange={(e) => setPayer(e.target.value)} disabled={!canEdit}>
        
        <option value="">--     Quién realizó el gasto    --</option>
        {people.map((p) => (
          <option key={p.id} value={p.name}>
            {p.name}
          </option>
        ))}
      </select>
</div>
<div>
  <h3>Descripción del gasto</h3>
      <input
        type="text"
        placeholder="Ingresar descripción"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
        disabled={!canEdit}
      />
</div>
<div>
  <h3>Importe del gasto</h3>
      <input
        type="number"
        placeholder="Ingresar importe"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        disabled={!canEdit}
      />
</div>
<div>
      {canEdit && (<button className="boton" onClick={addExpense}>Agregar</button>)}
</div>

      <ul>        
        {expenses.map((e) => (
          <li key={e.id} className="people-item expense-item">
  <span
    className="people-name expense-payer"
    onClick={() => showPersonExpenses(e.payer)}
  >
    {e.payer}
  
  {" "}pagó ${e.amount} ({e.desc})</span>

  {canEdit && (<button onClick={() => deleteExpense(e.id)}>
    <i className="fa-solid fa-trash"></i>
  </button>)}
</li>          
        ))}        
      </ul> 
      <div>
        {canEdit && (<button
  onClick={deleteAll}
  style={{ background: "#b61028", marginTop: "12px", color: "white", width: "190px"  }}
>
  <i className="fa-solid fa-trash"></i> Borrar todos los gastos</button>)}

        </div>     
    </div>    
  );
}



















