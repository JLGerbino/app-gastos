import { useState } from "react";
import Swal from "sweetalert2";
import { useEffect } from "react";
export default function AddExpense({
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
  const [mode, setMode] = useState("all"); 
  const [participants, setParticipants] = useState([]);
  // const [splitType, setSplitType] = useState("all");
  
//Agregar gasto 
const addExpense = async () => {
  if (!payer || !amount || !desc ) return Swal.fire({
      icon: "warning",
      background: "#dee0e0",
      color: "#283655",
      iconColor: "#269181",
      confirmButtonColor: "#35b67e",
      title:"Completa todos los campos",
      confirmButtonText: "Cerrar",
  });


  const finalParticipants =
    mode === "all"
      ? people.map(p => ({
          name: p.name,
          units: p.count
        }))
      : participants
          .filter(p => p.selected)
          .map(p => ({
            name: p.name,
            units: Number(p.units)
          }));

const expense = mode === "all"? {
        payer,
        amount: Number(amount),
        desc,
        createdAt: new Date()
      }
    : {
        payer,
        amount: Number(amount),
        desc,
        participants: finalParticipants,
        createdAt: new Date()
      };
  await addExpenseToDB(expense);
Swal.fire({
    icon: "success",
    title: "Gasto agregado",
    html: `<b>${payer}</b> pagó $${amount}<br>${desc || ""}`,
    timer: 1500,
    showConfirmButton: false,
    iconColor:"#269181",
  });
  
  setPayer("");
  setAmount("");
  setDesc("");
  setMode("all")
};

  // const addExpense = () => {
  //   if (!payer || !amount) return Swal.fire({
  //     icon: "warning",
  //     background: "#dee0e0",
  //     color: "#283655",
  //     iconColor: "#269181",
  //     confirmButtonColor: "#35b67e",
  //     title:"Completa todos los campos",
  //     confirmButtonText: "Cerrar",
  // });

  //   const newExpense = {
  //     payer,
  //     desc,
  //     amount: parseFloat(amount)
  //   };

  //   addExpenseToDB(newExpense);

  //   setDesc("");
  //   setAmount("");
  //   setPayer("");
  // };

  //Borrar gasto
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

  icon: "question",
  showCancelButton: true,
  background: "#dee0e0",
  color: "#283655",
  iconColor: "#269181",
  confirmButtonColor: "#35b67e",
  confirmButtonText: "Eliminar",
  cancelButtonText: "Cancelar",
});

  if (!result.isConfirmed) return;

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
      background: "#dee0e0",
      color:"#283655",
      iconColor:"#269181",
    });
  }
};

//Borrar todos los gastos
const deleteAll = async () => {
  const result = await Swal.fire({
    title: "¿Borrar TODOS los gastos?",
    text: "Esta acción no se puede deshacer",
    icon: "question",
    showCancelButton: true,
    background: "#dee0e0",
    color:"#283655",
    iconColor:"#269181",
    confirmButtonColor: "#d33",
    confirmButtonText: "Sí, borrar todo",
    cancelButtonText: "Cancelar",
  });

  if (!result.isConfirmed) return;

  Swal.fire({
    title: "Eliminando los gastos...",
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

    await Swal.fire({
      icon: "success",
      title: "Eliminados",
      text: "Todos los gastos fueron eliminados",
      background: "#dee0e0",
      color:"#283655",
      iconColor:"#269181",   
    
    });
  } catch (error) {
    console.error("Error borrando gastos:", error);
    Swal.fire({
      text:"Error, no se pudieron borrar los gastos",      
      background: "#dee0e0",
      color:"#283655",
      iconColor:"#269181",
    });
  }
};


const showParticipants = (expense) => {

  const isAll = !expense.participants;

  if (isAll) {
    Swal.fire({
      title: "Participantes:",
      text: "Todos participan de este gasto",
      icon: "info",
      background: "#dee0e0",
    color:"#283655",
    iconColor:"#269181",
    
    
    confirmButtonText: "Cerrar",
    confirmButtonColor:"#35b67e",
    
    });
    return;
  }

  const list = expense.participants
    .map(p => `${p.name} (x${p.units})`)
    .join("<br>");

  Swal.fire({
    title: "Participan del gasto:",
    html: list,
    icon: "info",
    background: "#dee0e0",
    color:"#283655",
    iconColor:"#269181",  
   
    confirmButtonText: "Cerrar",
    confirmButtonColor:"#35b67e",

  });
};
// const isAll = !e.participants;
// const isAll = e.participants?.length === people.length;

//Mostrar gastos y alias
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
    // .map(e => `<li>${e.desc || "Sin descripción"} - $${e.amount}</li>`)
    .map(e => {
    let participantsText = "";

    if (!e.participants || e.participants.length === 0) {
      participantsText = "Participan: Todos";
    } else if (e.participants.length === people.length) {
      participantsText = "Participan: Todos";
    } else {
      participantsText =
        "Participan: " +
        e.participants
          .map(p => `${p.name} (x${p.units})`)
          .join(", ");
    }

    return `
      <li style="margin-bottom:8px">
        <strong>${e.desc || "Sin descripción"}</strong> - $${e.amount}
        <br/>
        <span style="font-size:12px;color:gray">
          ${participantsText}
        </span>
      </li>
    `;
  })
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

//Maneja inicializar cuando cambia all/some
const handleSplitTypeChange = (value) => {

  setMode(value);

  if (value === "some") {
    const initialParticipants = people.map(p => ({
      name: p.name,
      units: p.count,
      selected: false
    }));

    setParticipants(initialParticipants);
  }

  if (value === "all") {
    const allParticipants = people.map(p => ({
      name: p.name,
      units: p.count,
      selected: true
    }));

    setParticipants(allParticipants);
  }
};


//inicializar participantes
useEffect(() => {
  if (people.length > 0) {
    setParticipants(
      people.map(p => ({
        name: p.name,
        units: p.count,
        selected: false,
      }))
    );
  }
}, [people]);

console.log("AddExpense group:", group);

  return (
    <div className="card" id="section-expense">

      <h2  className="titulo">Agregar gasto</h2>
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
  <h3>¿Quiénes participan?</h3>

  <label>
  <input
    className="checkbox"
    type="radio"
    name="splitType"
    value="all"
    checked={mode === "all"}
    onChange={(e) => handleSplitTypeChange(e.target.value)}
    disabled={!canEdit}
  />
  Todos
</label>

  <label>
  <input
    className="checkbox"
    type="radio"
    name="splitType"
    value="some"
    checked={mode === "some"}
    onChange={(e) => handleSplitTypeChange(e.target.value)}
    disabled={!canEdit}
  />
  Algunos
</label>  
</div>

{mode === "some" && (
  <div>
    <h4>Elegí quienes participan del gasto</h4>
  <div className="some">    
  <div>
  {participants.map((p, index) => (
    <div
      key={p.name}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        marginBottom: "6px"
      }}
    >

<input
  className="checkbox"
  type="checkbox"
  checked={p.selected}
  onChange={(e) => {
    const updated = [...participants];
    updated[index].selected = e.target.checked;
    setParticipants(updated);
  }}
/>

      <span style={{ width: "120px" }}>
        {p.name}
      </span>

<input
  type="number"
  inputMode="numeric"
  min={1}
  value={p.units}
  disabled={!p.selected}
  style={{ width: "60px", marginLeft: "10px" }}
  onChange={(e) => {
    const updated = [...participants];
    updated[index].units = Number(e.target.value);
    setParticipants(updated);
  }}
/>

    </div>
  ))}
</div>
</div>
</div>)}

<div>
  <h3>Importe del gasto</h3>
      <input
        type="number"
        inputMode="numeric"
        placeholder="Ingresar importe"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        disabled={!canEdit}
      />
</div>







<div>
      {canEdit && (<button className="boton" onClick={addExpense}>Agregar</button>)}
</div>

{/* "people-name expense-payer" */}
<h3>Gastos</h3>

<ul>
  {expenses.map((e) => {
      
    const isAll = !e.participants || e.participants.length === 0;
    return (
      <li
        key={e.id}
        className={`people-item expense-item`}
      >
        <span className="expense-icon"
        onClick={() => showParticipants(e)}>
    {isAll ? <i className="fa-solid fa-users"></i> : <i className="fa-solid fa-user-group"></i>}</span>
        <span
          className="people-name expense-payer"
          onClick={() => showPersonExpenses(e.payer)}
        >
              
          {e.payer} pagó ${e.amount} ({e.desc})
        </span>

        {canEdit && (
          <button onClick={() => deleteExpense(e.id)}>
            <i className="fa-solid fa-trash"></i>
          </button>
        )}
      </li>
    );
  })}
</ul>

      {/* <ul>
     
        {expenses.map((e) => (          
          <li key={e.id} className="people-item expense-item">
  <span
    className= "people-name expense-payer "
    onClick={() => showPersonExpenses(e.payer)}
  >
    {e.payer}

  {" "}pagó ${e.amount} ({e.desc})</span>

  {canEdit && (<button onClick={() => deleteExpense(e.id)}>
    <i className="fa-solid fa-trash"></i>
  </button>)}
</li>
        ))}
      </ul> */}
      <div>
        {canEdit && (<button
    className="btn-danger"
  onClick={deleteAll}
  disabled={!expenses?.length}  
>
  <i className="fa-solid fa-trash"></i> Borrar todos los gastos</button>)}

        </div>
    </div>
  );
}



















