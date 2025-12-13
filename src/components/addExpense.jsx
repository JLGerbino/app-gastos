import { useState } from "react";

export default function AddExpense({
  people,
  expenses,
  addExpenseToDB,
  deleteExpenseFromDB
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
      <button onClick={addExpense}>Agregar gasto</button>
</div>

      <ul>        
        {expenses.map((e) => (
          <li key={e.id}>
            {e.payer} pagó ${e.amount} ({e.desc})
            <button onClick={() => deleteExpenseFromDB(e.id)}>🗑️</button>
          </li>
        ))}        
      </ul>      
    </div>
  );
}








