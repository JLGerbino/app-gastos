import { useState } from "react";

export default function AddPerson({
  people,
  addPersonToDB,
  deletePersonFromDB,
  deleteExpensesByPerson
}) {
  const [name, setName] = useState("");
  const [count, setCount] = useState(1);

  const addPerson = () => {
    if (!name.trim()) return alert("Falta el nombre");
    if (count < 1) return alert("Cantidad inválida");

    if (people.some(p => p.name === name.trim())) {
      return alert("Ya existe ese participante");
    }

    addPersonToDB({
      name: name.trim(),
      count: parseInt(count)
    });

    setName("");
    setCount(1);
  };

  const deletePerson = async person => {
    console.log("🟥 Eliminando persona:", person);

    if (!person?.id || !person?.name) {
      console.error("❌ ERROR: persona sin id o name:", person);
      return;
    }

    // 1) Borrar la persona
    await deletePersonFromDB(person.id);

    // 2) Borrar sus gastos asociados
    await deleteExpensesByPerson(person.name);
  };

  return (
    <div className="card">
      <h2>Ingresar participantes</h2>

      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={e => setName(e.target.value)}
      />

      <input
        type="number"
        value={count}
        min={1}
        onChange={e => setCount(e.target.value)}
        placeholder="Cantidad"
      />

      <button onClick={addPerson}>Agregar</button>

      <ul>
        {people.map(p => (
          <li key={p.id}>
            {p.name} ({p.count})
            <button onClick={() => deletePerson(p)}>❌</button>
          </li>
        ))}
      </ul>
    </div>
  );
}









// import { useState } from "react";

// export default function AddPerson({
//   people,
//   addPersonToDB,
//   deletePersonFromDB,
//   deleteExpensesByPerson,
// }) {
//   const [name, setName] = useState("");
//   const [count, setCount] = useState(1);

//   const addPerson = () => {
//     if (!name.trim()) return alert("Falta el nombre");
//     if (count < 1) return alert("Cantidad inválida");

//     if (people.some((p) => p.name === name.trim())) {
//       return alert("Ya existe ese participante");
//     }

//     addPersonToDB({
//       name: name.trim(),
//       count: parseInt(count),
//     });

//     setName("");
//     setCount(1);
//   };

//   const deletePerson = async (person) => {
//     if (!person.id) return alert("Error: este usuario no tiene ID");

//     // 1) borrar persona
//     await deletePersonFromDB(person.id);

//     // 2) borrar automaticamente los gastos asociados
//     await deleteExpensesByPerson(person.name);
//   };

//   return (
//     <div className="card">
//       <h2>Ingresar participantes</h2>

//       <input
//         type="text"
//         placeholder="Nombre"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />

//       <input
//         type="number"
//         min={1}
//         value={count}
//         onChange={(e) => setCount(e.target.value)}
//         placeholder="Cantidad"
//       />

//       <button onClick={addPerson}>Agregar</button>

//       <ul>
//         {people.map((p) => (
//           <li key={p.id}>
//             {p.name} ({p.count})
//             <button onClick={() => deletePerson(p)}>❌</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }




















// import { useState } from "react";

// export default function AddPerson({
//   people,
//   addPersonToDB,
//   deletePersonFromDB,
//   deleteExpensesByPerson,
// }) {
//   const [name, setName] = useState("");
//   const [count, setCount] = useState(1);

//   const addPerson = () => {
//     if (!name.trim()) return alert("Falta el nombre");
//     if (count < 1) return alert("Cantidad inválida");

//     if (people.some((p) => p.name === name.trim())) {
//       return alert("Ya existe ese participante");
//     }

//     addPersonToDB({
//       name: name.trim(),
//       count: parseInt(count),
//     });

//     setName("");
//     setCount(1);
//   };

//   const deletePerson = async (person) => {
//     // 1) borrar gastos asociados
//     await deleteExpensesByPerson(person.name);

//     // 2) borrar persona
//     await deletePersonFromDB(person.id);
//   };

//   return (
//     <div className="card">
//       <h2>Ingresar participantes</h2>

//       <input
//         type="text"
//         placeholder="Nombre"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />

//       <input
//         type="number"
//         value={count}
//         min={1}
//         onChange={(e) => setCount(e.target.value)}
//         placeholder="Cantidad"
//       />

//       <button onClick={addPerson}>Agregar</button>

//       <ul>
//         {people.map((p) => (
//           <li key={p.id}>
//             {p.name} ({p.count})
//             <button onClick={() => deletePerson(p)}>❌</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }














// import { useState } from "react";

// export default function AddPerson({
//   people,
//   addPersonToDB,
//   deletePersonFromDB,
//   deleteExpensesByPerson,
// }) {
//   const [name, setName] = useState("");
//   const [count, setCount] = useState(1);

//   const addPerson = () => {
//     if (!name.trim()) return alert("Falta el nombre");
//     if (count < 1) return alert("Cantidad inválida");

//     if (people.some((p) => p.name === name.trim())) {
//       return alert("Ya existe ese participante");
//     }

//     addPersonToDB({
//       name: name.trim(),
//       count: parseInt(count),
//     });

//     setName("");
//     setCount(1);
//   };

//   const deletePerson = async (person) => {
//     // 1) Borrar gastos primero (para evitar errores)
//     await deleteExpensesByPerson(person.name);

//     // 2) Luego borrar la persona
//     await deletePersonFromDB(person.id);
//   };

//   return (
//     <div className="card">
//       <h2>Ingresar participantes</h2>

//       <input
//         type="text"
//         placeholder="Nombre"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />

//       <input
//         type="number"
//         value={count}
//         min={1}
//         onChange={(e) => setCount(e.target.value)}
//         placeholder="Cantidad"
//       />

//       <button onClick={addPerson}>Agregar</button>

//       <ul>
//         {people.map((p) => (
//           <li key={p.id}>
//             {p.name} ({p.count})
//             <button onClick={() => deletePerson(p)}>❌</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }

















// import { useState } from "react";

// export default function AddPerson({
//   people,
//   addPersonToDB,
//   deletePersonFromDB,
//   deleteExpensesByPerson, // 🔥 NUEVO
// }) {
//   const [name, setName] = useState("");
//   const [count, setCount] = useState(1);

//   const addPerson = () => {
//     if (!name.trim()) return alert("Falta el nombre");
//     if (count < 1) return alert("Cantidad inválida");

//     if (people.some((p) => p.name === name.trim())) {
//       return alert("Ya existe ese participante");
//     }

//     addPersonToDB({
//       name: name.trim(),
//       count: parseInt(count),
//     });

//     setName("");
//     setCount(1);
//   };

//   const deletePerson = async (person) => {
//     // 1) Borrar persona
//     await deletePersonFromDB(person.id);

//     // 2) 🔥 BORRAR SUS GASTOS ASOCIADOS
//     await deleteExpensesByPerson(person.name);
//   };

//   return (
//     <div className="card">
//       <h2>Ingresar participantes</h2>

//       <input
//         type="text"
//         placeholder="Nombre"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />

//       <input
//         type="number"
//         value={count}
//         min={1}
//         onChange={(e) => setCount(e.target.value)}
//         placeholder="Cantidad"
//       />

//       <button onClick={addPerson}>Agregar</button>

//       <ul>
//         {people.map((p) => (
//           <li key={p.id}>
//             {p.name} ({p.count})
//             <button onClick={() => deletePerson(p)}>❌</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }











// import { useState } from "react";

// export default function AddPerson({
//   people,
//   addPersonToDB,
//   deletePersonFromDB,
//   expenses
// }) {
//   const [name, setName] = useState("");
//   const [count, setCount] = useState(1);

//   const addPerson = () => {
//     if (!name.trim()) return alert("Falta el nombre");
//     if (count < 1) return alert("Cantidad inválida");

//     if (people.some((p) => p.name === name.trim())) {
//       return alert("Ya existe ese participante");
//     }

//     addPersonToDB({
//       name: name.trim(),
//       count: parseInt(count)
//     });

//     setName("");
//     setCount(1);
//   };

//   const deletePerson = async (person) => {
//     // 1) Borrar persona
//     await deletePersonFromDB(person.id);
//     // 2) No borramos gastos acá, ya que se podría borrar en AddExpense
//   };

//   return (
//     <div className="card">
//       <h2>Ingresar participantes</h2>

//       <input
//         type="text"
//         placeholder="Nombre"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />

//       <input
//         type="number"
//         value={count}
//         min={1}
//         onChange={(e) => setCount(e.target.value)}
//         placeholder="Cantidad"
//       />

//       <button onClick={addPerson}>Agregar</button>

//       <ul>
//         {people.map((p) => (
//           <li key={p.id}>
//             {p.name} ({p.count})
//             <button onClick={() => deletePerson(p)}>❌</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }








// import { useState } from "react";

// export default function AddPerson({ people, setPeople, expenses, setExpenses }) {
//   const [name, setName] = useState("");
//   const [count, setCount] = useState(1);

//   const addPerson = () => {
//     const nm = name.trim();
//     if (!nm) return alert("Falta el nombre");
//     const cnt = parseInt(count, 10) || 1;
//     if (cnt < 1) return alert("Cantidad inválida");

//     // Normalizamos y comprobamos existencia
//     if (people.some(p => p.name.toLowerCase() === nm.toLowerCase())) {
//       return alert("Ya existe ese participante");
//     }

//     // Usamos actualización funcional para evitar problemas de estado
//     setPeople(prev => [...prev, { name: nm, count: cnt }]);
//     setName("");
//     setCount(1);
//   };

//   const deletePerson = (nameToDelete) => {
//     // confirmá si querés
//     // if (!confirm(`Borrar a ${nameToDelete} y sus gastos?`)) return;

//     // Actualizamos people y expenses con funciones para evitar stale closures
//     setPeople(prev => prev.filter(p => p.name !== nameToDelete));
//     setExpenses(prev => prev.filter(e => e.payer !== nameToDelete));
//   };

//   return (
//     <div className="card">
//       <h2>Ingresar participantes</h2>

//       <input
//         type="text"
//         placeholder="Nombre"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />

//       <input
//         type="number"
//         value={count}
//         min={1}
//         onChange={(e) => setCount(e.target.value)}
//         placeholder="Cantidad (personas)"
//       />

//       <button onClick={addPerson}>Agregar</button>

//       <ul>
//         {people.map((p, i) => (
//           <li key={p.name + i}>
//             {p.name} ({p.count})
//             <button
//               style={{ marginLeft: 8 }}
//               onClick={() => deletePerson(p.name)}
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
// import { doc, setDoc } from "firebase/firestore";

// export default function AddPerson({ people, setPeople, expenses, setExpenses }) {
//   const [name, setName] = useState("");
//   const [count, setCount] = useState(1);

//   // 🔥 FUNCION PARA GUARDAR EN FIRESTORE
//   const syncToFirestore = async (newPeople, newExpenses) => {
//     try {
//       await setDoc(doc(db, "gastos", "data"), {
//         people: newPeople,
//         expenses: newExpenses
//       });
//       console.log("Sincronizado con Firestore");
//     } catch (error) {
//       console.error("Error al sincronizar Firestore:", error);
//     }
//   };

//   const addPerson = () => {
//     if (!name.trim()) return alert("Falta el nombre");
//     if (count < 1) return alert("Cantidad inválida");

//     if (people.some(p => p.name === name.trim())) {
//       return alert("Ya existe ese participante");
//     }

//     const newPeople = [...people, { name: name.trim(), count: parseInt(count) }];

//     setPeople(newPeople);
//     syncToFirestore(newPeople, expenses);  // 🔥 Guarda en Firestore

//     setName("");
//     setCount(1);
//   };

//   const deletePerson = (nameToDelete) => {
//     const newPeople = people.filter(p => p.name !== nameToDelete);
//     const newExpenses = expenses.filter(e => e.payer !== nameToDelete);

//     setPeople(newPeople);
//     setExpenses(newExpenses);

//     syncToFirestore(newPeople, newExpenses); // 🔥 Guarda en Firestore
//   };

//   return (
//     <div className="card">
//       <h2>Ingresar participantes</h2>

//       <input
//         type="text"
//         placeholder="Nombre"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />

//       <input
//         type="number"
//         value={count}
//         min={1}
//         onChange={(e) => setCount(e.target.value)}
//         placeholder="Cantidad"
//       />

//       <button onClick={addPerson}>Agregar</button>

//       <ul>
//         {people.map((p, i) => (
//           <li key={i}>
//             {p.name} ({p.count})
//             <button onClick={() => deletePerson(p.name)}>❌</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }




// import { useState } from "react";

// export default function AddPerson({ people, setPeople, expenses, setExpenses }) {
//   const [name, setName] = useState("");
//   const [count, setCount] = useState(1);

//   const addPerson = () => {
//     if (!name.trim()) return alert("Falta el nombre");
//     if (count < 1) return alert("Cantidad inválida");

//     if (people.some(p => p.name === name.trim())) {
//       return alert("Ya existe ese participante");
//     }

//     setPeople([...people, { name: name.trim(), count: parseInt(count) }]);
//     setName("");
//     setCount(1);
//   };

//   const deletePerson = (nameToDelete) => {
//     setPeople(people.filter(p => p.name !== nameToDelete));
//     setExpenses(expenses.filter(e => e.payer !== nameToDelete));
//   };

//   return (
//     <div className="card">
//       <h2>Ingresar participantes</h2>

//       <input
//         type="text"
//         placeholder="Nombre"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />

//       <input
//         type="number"
//         value={count}
//         min={1}
//         onChange={(e) => setCount(e.target.value)}
//         placeholder="Cantidad"
//       />

//       <button onClick={addPerson}>Agregar</button>

//       <ul>
//         {people.map((p, i) => (
//           <li key={i}>
//             {p.name} ({p.count})
//             <button onClick={() => deletePerson(p.name)}>❌</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }








// import { useState } from "react";

// export default function AddPerson({ people, setPeople, expenses, setExpenses }) {
//   const [name, setName] = useState("");

//   const deletePerson = (nameToDelete) => {
//     // 1. borrar de la lista de integrantes
//     const updatedPeople = people.filter(p => p !== nameToDelete);
//     setPeople(updatedPeople);

//     // 2. borrar sus gastos asociados
//     const updatedExpenses = expenses.filter(exp => exp.payer !== nameToDelete);
//     setExpenses(updatedExpenses);
//   };

//   const addPerson = () => {
//     if (!name.trim()) return;
//     if (people.some(p => p === name.trim())) {
//       alert("Ya existe esa persona");
//       return;
//     }
//     setPeople([...people, name.trim()]);
//     setName("");
//   };

//   return (
//     <div className="card">
//       <h2>👥 Participantes</h2>
//       <input
//         type="text"
//         placeholder="Nombre"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />
//       <button onClick={addPerson}>Agregar</button>

//       <ul>
//         {people.map((p, i) => (
//           <li key={i}>
//             {p}
//             <button onClick={() => deletePerson(p)}>❌</button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }
