import { useState } from "react";
import Swal from "sweetalert2";

export default function AddExpense({
  groupId,
  people,
  expenses,
  addExpenseToDB,
  deleteExpenseFromDB,
  deleteAllExpenses
}) {
  const [payer, setPayer] = useState("");
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");

  const addExpense = () => {
    if (!payer || !amount) return alert("Completa todos los campos");

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
  const result = await Swal.fire({
    title: "¿Seguro de eliminar gasto?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    background: "#dee0e0",
    color:"#283655",
    iconColor:"#269181",
    confirmButtonColor:"#35b67e",        
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
      confirmButtonText: "Listo",
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





// const deleteExpense = async (expenseId) => {
//   const result = await Swal.fire({
//     title: "¿Seguro de eliminar gasto?",
//     text: "Esta acción no se puede deshacer",
//     icon: "warning",
//     showCancelButton: true,
//     confirmButtonColor: "#3085d6",
//     cancelButtonColor: "#d33",
//     confirmButtonText: "Eliminar",
//     cancelButtonText: "Cancelar",
//   });

//   if (!result.isConfirmed) return;

//   try {
//     await deleteExpenseFromDB(expenseId);

//     Swal.fire({
//       title: "Eliminado",
//       text: "El gasto fue eliminado",
//       icon: "success",
//     });
//   } catch (error) {
//     console.error("Error eliminando gasto:", error);

//     Swal.fire({
//       title: "Error",
//       text: "No se pudo eliminar el gasto",
//       icon: "error",
//     });
//   }
// };

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
          showConfirmButton: false,
          timer: 1500,
        });
      });
    },
  });
};















// const showPersonExpenses = (personName) => {
//   const personExpenses = expenses.filter(
//     e => e.payer === personName
//   );

//   const person = people.find(p => p.name === personName);
//   const alias = person?.alias;

//   if (personExpenses.length === 0) {
//     Swal.fire(
//       "Sin gastos",
//       `${personName} no tiene gastos registrados`,
//       "info"
//     );
//     return;
//   }

//   const total = personExpenses.reduce(
//     (sum, e) => sum + Number(e.amount),
//     0
//   );

//   const listHtml = personExpenses
//     .map(e => `<li>${e.desc || "Sin descripción"} - $${e.amount}</li>`)
//     .join("");

//   Swal.fire({
//     title: `Gastos de ${personName}`,
//     html: `
//       <ul style="text-align:left">
//         ${listHtml}
//       </ul>

//       <hr />

//       <strong>Total: $${total}</strong>

//       ${
//         alias
//           ? `
//             <hr />
//             <p><strong>Alias para recibir transferencias</strong></p>
//             <p style="font-size:22px">${alias}</p>
//             <p style="font-size:12px">Pagá con</p>
//             <img 
//               src="mp-logo.png"
//               alt="Mercado Pago"
//               id="openMP"
//               style="
//                 width: 34px;
//                 cursor: pointer;
//                 margin-top: 10px;
//               "
//             />
            
//           `
//           : ""
//       }
//     `,
//     confirmButtonText: "Cerrar",
//     didOpen: () => {
//   if (person.alias) {
//     const btn = document.getElementById("openMPPerson");
//     btn?.addEventListener("click", () => {
//       navigator.clipboard.writeText(person.alias);

//       const isAndroid = /Android/i.test(navigator.userAgent);

//       if (isAndroid) {
//         // 👉 Intent para Android
//         window.location.href =
//           "intent://#Intent;package=com.mercadopago.wallet;scheme=mercadopago;end";
//       } else {
//         // 👉 iOS o fallback
//         window.open("https://www.mercadopago.com.ar", "_blank");
//       }
//     });
//   }
// }
//     // didOpen: () => {
//     //   if (alias) {
//     //     const mpBtn = document.getElementById("openMP");
//     //     if (mpBtn) {
//     //       mpBtn.addEventListener("click", () => {
//     //         navigator.clipboard.writeText(alias);
//     //         window.location.href = "mercadopago://";
//     //       });
//     //     }
//     //   }
//     // }
//   });
// };







// const showPersonExpenses = (personName) => {
//   const personExpenses = expenses.filter(
//     e => e.payer === personName
//   );

//   const person = people.find(p => p.name === personName);
//   const alias = person?.alias;

//   if (personExpenses.length === 0) {
//     Swal.fire(
//       "Sin gastos",
//       `${personName} no tiene gastos registrados`,
//       "info"
//     );
//     return;
//   }

//   const total = personExpenses.reduce(
//     (sum, e) => sum + Number(e.amount),
//     0
//   );

//   const listHtml = personExpenses
//     .map(e => `<li>${e.desc || "Sin descripción"} - $${e.amount}</li>`)
//     .join("");

//   Swal.fire({
//     title: `Gastos de ${personName}`,
//     html: `
//       <ul style="text-align:left">
//         ${listHtml}
//       </ul>

//       <hr />

//       <strong>Total: $${total}</strong>

//       ${
//         alias
//           ? `
//             <hr />
//             <p><strong>Alias para recibir transferencias</strong></p>
//             <p style="font-size:16px">${alias}</p>
//           `
//           : ""
//       }      
//     `,
//     confirmButtonText: "Cerrar",
//   });
// };

//nuevo





  return (
    <div className="card">
      <h2>Agregar gasto</h2>
<div>
      <select value={payer} onChange={(e) => setPayer(e.target.value)}>
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
      />
</div>
<div>
  <h3>Importe del gasto</h3>
      <input
        type="number"
        placeholder="Ingresar importe"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />
</div>
<div>
      <button className="boton" onClick={addExpense}>Agregar</button>
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

  <button onClick={() => deleteExpense(e.id)}>
    <i className="fa-solid fa-trash"></i>
  </button>
</li>          
        ))}        
      </ul> 
      <div>
        <button
  onClick={deleteAll}
  style={{ background: "#b61028", marginTop: "12px", color: "white", width: "190px"  }}
>
  <i className="fa-solid fa-trash"></i> Borrar todos los gastos</button>

        </div>     
    </div>    
  );
}



















