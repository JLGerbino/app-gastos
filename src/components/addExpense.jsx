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

      <select value={payer} onChange={(e) => setPayer(e.target.value)}>
        <option value="">-- Quién pagó --</option>
        {people.map((p) => (
          <option key={p.id} value={p.name}>
            {p.name}
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Descripción"
        value={desc}
        onChange={(e) => setDesc(e.target.value)}
      />

      <input
        type="number"
        placeholder="Monto"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
      />

      <button onClick={addExpense}>Agregar gasto</button>

      <ul>
        {expenses.map((e) => (
          <li key={e.id}>
            {e.payer} pagó ${e.amount} ({e.desc})
            <button onClick={() => deleteExpenseFromDB(e.id)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}








// import { useState } from "react";

// export default function AddExpense({ people, expenses, setExpenses }) {
//   const [payer, setPayer] = useState("");
//   const [desc, setDesc] = useState("");
//   const [amount, setAmount] = useState("");

//   const addExpense = () => {
//     if (!payer) return alert("Seleccioná quién pagó");
//     if (!amount || isNaN(parseFloat(amount))) return alert("Monto inválido");

//     const newExpense = {
//       payer: payer,
//       desc: desc.trim(),
//       amount: parseFloat(amount),
//       createdAt: Date.now()
//     };

//     // actualización funcional (evita problemas si setExpenses se llama desde otro lado)
//     setExpenses(prev => [...prev, newExpense]);

//     // limpiar formulario
//     setDesc("");
//     setAmount("");
//     setPayer("");
//   };

//   const deleteExpense = (index) => {
//     // eliminamos por índice usando actualización funcional
//     setExpenses(prev => prev.filter((_, i) => i !== index));
//   };

//   return (
//     <div className="card">
//       <h2>Agregar gasto</h2>

//       <select value={payer} onChange={(e) => setPayer(e.target.value)}>
//         <option value="">-- Quién pagó --</option>
//         {people.map((p, i) => (
//           <option key={p.name + i} value={p.name}>
//             {p.name} ({p.count})
//           </option>
//         ))}
//       </select>

//       <input
//         type="text"
//         placeholder="Descripción"
//         value={desc}
//         onChange={(e) => setDesc(e.target.value)}
//       />

//       <input
//         type="number"
//         placeholder="Monto"
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//       />

//       <button onClick={addExpense}>Agregar gasto</button>

//       <ul>
//         {expenses.map((e, i) => (
//           <li key={e.createdAt ?? i}>
//             {e.payer} pagó ${Number(e.amount).toFixed(2)} {e.desc ? `(${e.desc})` : ""}
//             <button
//               style={{ marginLeft: 8 }}
//               onClick={() => deleteExpense(i)}
//             >
//               ❌
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }




// import { useState } from "react";
// import { db } from "../firebase";
// import { collection, addDoc, deleteDoc, doc } from "firebase/firestore";

// export default function AddExpense({ people, expenses, setExpenses }) {
//   const [payer, setPayer] = useState("");
//   const [desc, setDesc] = useState("");
//   const [amount, setAmount] = useState("");

//   const addExpense = async () => {
//     if (!payer || !amount) return alert("Completa todos los campos");

//     const newExpense = {
//       payer,
//       desc,
//       amount: parseFloat(amount),
//       createdAt: Date.now(),
//     };

//     try {
//       // 👉 Guardar en Firestore
//       const ref = await addDoc(collection(db, "expenses"), newExpense);

//       // 👉 Guardar en React localmente (agrego el ID de Firestore)
//       setExpenses([...expenses, { ...newExpense, id: ref.id }]);

//       setDesc("");
//       setAmount("");
//       setPayer("");
//     } catch (err) {
//       console.error("Error al guardar en Firestore:", err);
//       alert("Error guardando gasto");
//     }
//   };

//   const deleteExpense = async (id) => {
//     try {
//       // 👉 borrar en Firestore
//       await deleteDoc(doc(db, "expenses", id));

//       // 👉 borrar en React
//       setExpenses(expenses.filter((e) => e.id !== id));
//     } catch (err) {
//       console.error("Error borrando gasto:", err);
//       alert("No se pudo borrar el gasto");
//     }
//   };

//   return (
//     <div className="card">
//       <h2>Agregar gasto</h2>

//       <select value={payer} onChange={(e) => setPayer(e.target.value)}>
//         <option value="">-- Quién pagó --</option>
//         {people.map((p, i) => (
//           <option key={i} value={p.name}>{p.name}</option>
//         ))}
//       </select>

//       <input
//         type="text"
//         placeholder="Descripción"
//         value={desc}
//         onChange={(e) => setDesc(e.target.value)}
//       />

//       <input
//         type="number"
//         placeholder="Monto"
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//       />

//       <button onClick={addExpense}>Agregar gasto</button>

//       <ul>
//         {expenses.map((e) => (
//           <li key={e.id}>
//             {e.payer} pagó ${e.amount} ({e.desc})
//             <button
//               style={{ marginLeft: "10px" }}
//               onClick={() => deleteExpense(e.id)}
//             >
//               ❌
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }



// import { useState } from "react";
// export default function AddExpense({ people, expenses, setExpenses }) {
//   const [payer, setPayer] = useState("");
//   const [desc, setDesc] = useState("");
//   const [amount, setAmount] = useState("");

//   const addExpense = () => {
//     if (!payer || !amount) return alert("Completa todos los campos");

//     const newExpense = {
//       payer,
//       desc,
//       amount: parseFloat(amount),
//     };

//     setExpenses([...expenses, newExpense]);

//     setDesc("");
//     setAmount("");
//     setPayer(""); // 🔥 esto arregla lo que me dijiste recién
//   };

//   return (
//     <div className="card">
//       <h2>Agregar gasto</h2>

//       <select value={payer} onChange={(e) => setPayer(e.target.value)}>
//         <option value="">-- Quién pagó --</option>
//         {people.map((p, i) => (
//           <option key={i} value={p.name}>{p.name}</option>
//         ))}
//       </select>

//       <input
//         type="text"
//         placeholder="Descripción"
//         value={desc}
//         onChange={(e) => setDesc(e.target.value)}
//       />

//       <input
//         type="number"
//         placeholder="Monto"
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//       />

//       <button onClick={addExpense}>Agregar gasto</button>

//       <ul>
//         {expenses.map((e, i) => (
//           <li key={i}>{e.payer} pagó ${e.amount} ({e.desc})</li>
//         ))}
//       </ul>
//     </div>
//   );
// }




// import { useState } from "react";

// export default function AddExpense({ people, expenses, setExpenses }) {
//   const [payer, setPayer] = useState("");
//   const [desc, setDesc] = useState("");
//   const [amount, setAmount] = useState("");

//   const deleteExpense = (index) => {
//   const updated = expenses.filter((_, i) => i !== index);
//   setExpenses(updated);
// };


//   const addExpense = () => {
//     if (!payer || !amount) return alert("Completa todos los campos");
//     const newExpense = {
//       payer,
//       desc,
//       amount: parseFloat(amount),
//     };
//     setPayer("");
//     setExpenses([...expenses, newExpense]);
//     setDesc("");
//     setAmount("");
//   };

//   return (
//     <div className="card">
//       <h2>🧾 Agregar gasto</h2>
//       <select value={payer} onChange={(e) => setPayer(e.target.value)}>
//         <option value="">-- Quién pagó --</option>
//         {people.map((p, i) => (
//           <option key={i} value={p}>{p}</option>
//         ))}
//       </select>

//       <input
//         type="text"
//         placeholder="Descripción"
//         value={desc}
//         onChange={(e) => setDesc(e.target.value)}
//       />
//       <input
//         type="number"
//         placeholder="Monto"
//         value={amount}
//         onChange={(e) => setAmount(e.target.value)}
//       />
//       <button onClick={addExpense}>Agregar gasto</button>

//       <ul>
//   {expenses.map((e, i) => (
//     <li key={i}>
//       {e.payer} pagó ${e.amount} ({e.desc})
//       <button onClick={() => deleteExpense(i)}>❌</button>
//     </li>
//   ))}
// </ul>

//     </div>
//   );
// }
