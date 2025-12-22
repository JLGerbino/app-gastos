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
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
  });

  if (!result.isConfirmed) return;

  try {
    await deleteExpenseFromDB(expenseId);

    Swal.fire({
      title: "Eliminado",
      text: "El gasto fue eliminado",
      icon: "success",
    });
  } catch (error) {
    console.error("Error eliminando gasto:", error);

    Swal.fire({
      title: "Error",
      text: "No se pudo eliminar el gasto",
      icon: "error",
    });
  }
};

const deleteAll = async () => {
  const result = await Swal.fire({
    title: "¿Borrar TODOS los gastos?",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    confirmButtonText: "Sí, borrar todo",
    cancelButtonText: "Cancelar",
  });

  if (!result.isConfirmed) return;

  try {
    await deleteAllExpenses();

    Swal.fire(
      "Eliminados",
      "Todos los gastos fueron borrados",
      "success"
    );
  } catch (error) {
    console.error("Error borrando gastos:", error);
    Swal.fire(
      "Error",
      "No se pudieron borrar los gastos",
      "error"
    );
  }
};


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
      <button className="boton" onClick={addExpense}>Agregar gasto</button>
</div>

      <ul>        
        {expenses.map((e) => (
          <li key={e.id}>
            {e.payer} pagó ${e.amount} ({e.desc})
            <span><button onClick={() => deleteExpense(e.id)}><i className="fa-solid fa-trash"></i></button></span>
          </li>
        ))}        
      </ul> 
      <div>
        <button
  onClick={deleteAll}
  style={{ background: "#b61028", marginTop: "12px" }}
>
  <i className="fa-solid fa-trash"></i> Borrar todos los gastos
</button>

        </div>     
    </div>    
  );
}



















