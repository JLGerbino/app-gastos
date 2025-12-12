import { useState, useEffect } from "react";
import AddPerson from "./components/addPerson";
import AddExpense from "./components/addExpense";
import BalanceList from "./components/balanceList";
import { db } from "./firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs
} from "firebase/firestore";
import "./App.css";

function App() {
  const [people, setPeople] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // 🔥 Escuchar personas en tiempo real
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "people"), snap => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setPeople(list);
    });
    return unsub;
  }, []);

  // 🔥 Escuchar gastos en tiempo real
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "expenses"), snap => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setExpenses(list);
    });
    return unsub;
  }, []);

  // ➕ Agregar persona
  const addPersonToDB = async person => {
    await addDoc(collection(db, "people"), person);
  };

  // ❌ Borrar persona
  const deletePersonFromDB = async id => {
    await deleteDoc(doc(db, "people", id));
  };

  // ❌ Borrar TODOS los gastos de una persona
  const deleteExpensesByPerson = async personName => {
    console.log("🔥 Buscando gastos de:", personName);

    const q = query(
      collection(db, "expenses"),
      where("payer", "==", personName)
    );

    const results = await getDocs(q);

    console.log("Documentos encontrados:", results.docs.length);

    const promises = results.docs.map(d =>
      deleteDoc(doc(db, "expenses", d.id))
    );

    await Promise.all(promises);

    console.log("🔥 Gastos de", personName, "borrados");
  };

  // ➕ Agregar gasto
  const addExpenseToDB = async expense => {
    await addDoc(collection(db, "expenses"), expense);
  };

  // ❌ Borrar gasto individual
  const deleteExpenseFromDB = async id => {
    await deleteDoc(doc(db, "expenses", id));
  };

  return (
    <div className="app">
      <h1>Cuentas Claras</h1>

      <AddPerson
        people={people}
        expenses={expenses}
        addPersonToDB={addPersonToDB}
        deletePersonFromDB={deletePersonFromDB}
        deleteExpensesByPerson={deleteExpensesByPerson}
      />

      <AddExpense
        people={people}
        expenses={expenses}
        addExpenseToDB={addExpenseToDB}
        deleteExpenseFromDB={deleteExpenseFromDB}
      />

      <BalanceList people={people} expenses={expenses} />
    </div>
  );
}

export default App;











// import { useState, useEffect } from "react";
// import AddPerson from "./components/addPerson";
// import AddExpense from "./components/addExpense";
// import BalanceList from "./components/balanceList";
// import { db } from "./firebase";
// import {
//   collection,
//   onSnapshot,
//   addDoc,
//   deleteDoc,
//   doc,
//   query,
//   where,
//   getDocs,
// } from "firebase/firestore";
// import "./App.css";

// function App() {
//   const [people, setPeople] = useState([]);
//   const [expenses, setExpenses] = useState([]);

//   // 📌 Escuchar colección people
//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "people"), (snap) => {
//       setPeople(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//     });
//     return unsub;
//   }, []);

//   // 📌 Escuchar colección expenses
//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "expenses"), (snap) => {
//       setExpenses(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
//     });
//     return unsub;
//   }, []);

//   // ➕ Agregar persona
//   const addPersonToDB = async (person) =>
//     await addDoc(collection(db, "people"), person);

//   // ❌ Borrar persona (solo la persona)
//   const deletePersonFromDB = async (id) =>
//     await deleteDoc(doc(db, "people", id));

//   // ❌ Borrar TODOS los gastos del participante
//   const deleteExpensesByPerson = async (personName) => {
//     const q = query(collection(db, "expenses"), where("payer", "==", personName));
//     const res = await getDocs(q);

//     const ops = res.docs.map((d) =>
//       deleteDoc(doc(db, "expenses", d.id))
//     );

//     await Promise.all(ops);
//   };

//   // ➕ Agregar gasto
//   const addExpenseToDB = async (expense) =>
//     await addDoc(collection(db, "expenses"), expense);

//   // ❌ Borrar gasto individual
//   const deleteExpenseFromDB = async (id) =>
//     await deleteDoc(doc(db, "expenses", id));

//   return (
//     <div className="app">
//       <h1>Cuentas Claras</h1>

//       <AddPerson
//         people={people}
//         addPersonToDB={addPersonToDB}
//         deletePersonFromDB={deletePersonFromDB}
//         deleteExpensesByPerson={deleteExpensesByPerson}
//       />

//       <AddExpense
//         people={people}
//         expenses={expenses}
//         addExpenseToDB={addExpenseToDB}
//         deleteExpenseFromDB={deleteExpenseFromDB}
//       />

//       <BalanceList people={people} expenses={expenses} />
//     </div>
//   );
// }

// export default App;















// import { useState, useEffect } from "react";
// import AddPerson from "./components/addPerson";
// import AddExpense from "./components/AddExpense";
// import BalanceList from "./components/BalanceList";
// import { db } from "./firebase";
// import {
//   collection,
//   onSnapshot,
//   addDoc,
//   deleteDoc,
//   doc,
//   query,
//   where,
//   getDocs,
// } from "firebase/firestore";
// import "./App.css";

// function App() {
//   const [people, setPeople] = useState([]);
//   const [expenses, setExpenses] = useState([]);

//   // 📌 Escuchar Firestore en tiempo real (people)
//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "people"), (snap) => {
//       const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       setPeople(list);
//     });
//     return unsub;
//   }, []);

//   // 📌 Escuchar Firestore en tiempo real (expenses)
//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "expenses"), (snap) => {
//       const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       setExpenses(list);
//     });
//     return unsub;
//   }, []);

//   // ➕ Agregar persona
//   const addPersonToDB = async (person) =>
//     await addDoc(collection(db, "people"), person);

//   // ❌ Borrar TODOS los gastos de una persona
//   const deleteExpensesByPerson = async (personName) => {
//     const q = query(
//       collection(db, "expenses"),
//       where("payer", "==", personName)
//     );

//     const results = await getDocs(q);

//     const deletePromises = results.docs.map((d) =>
//       deleteDoc(doc(db, "expenses", d.id))
//     );

//     await Promise.all(deletePromises);
//   };

//   // ❌ Borrar persona
//   const deletePersonFromDB = async (id) =>
//     await deleteDoc(doc(db, "people", id));

//   // ➕ Agregar gasto
//   const addExpenseToDB = async (expense) =>
//     await addDoc(collection(db, "expenses"), expense);

//   // ❌ Borrar gasto individual
//   const deleteExpenseFromDB = async (id) =>
//     await deleteDoc(doc(db, "expenses", id));

//   return (
//     <div className="app">
//       <h1>Cuentas Claras</h1>

//       <AddPerson
//         people={people}
//         addPersonToDB={addPersonToDB}
//         deletePersonFromDB={deletePersonFromDB}
//         deleteExpensesByPerson={deleteExpensesByPerson}
//       />

//       <AddExpense
//         people={people}
//         expenses={expenses}
//         addExpenseToDB={addExpenseToDB}
//         deleteExpenseFromDB={deleteExpenseFromDB}
//       />

//       <BalanceList people={people} expenses={expenses} />
//     </div>
//   );
// }

// export default App;














// import { useState, useEffect } from "react";
// import AddPerson from "./components/addPerson";
// import AddExpense from "./components/addExpense";
// import BalanceList from "./components/balanceList";
// import { db } from "./firebase";
// import {
//   collection,
//   onSnapshot,
//   addDoc,
//   deleteDoc,
//   doc,
//   query,
//   where,
//   getDocs,
// } from "firebase/firestore";
// import "./App.css";

// function App() {
//   const [people, setPeople] = useState([]);
//   const [expenses, setExpenses] = useState([]);

//   // 📌 ESCUCHAR Firestore en tiempo real (people)
//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "people"), (snap) => {
//       const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       setPeople(list);
//     });
//     return unsub;
//   }, []);

//   // 📌 ESCUCHAR Firestore en tiempo real (expenses)
//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "expenses"), (snap) => {
//       const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       setExpenses(list);
//     });
//     return unsub;
//   }, []);

//   // ➕ Agregar persona
//   const addPersonToDB = async (person) =>
//     await addDoc(collection(db, "people"), person);

//   // ❌ Borrar persona
//   const deletePersonFromDB = async (id) =>
//     await deleteDoc(doc(db, "people", id));

//   // ❌ Borrar gastos asociados
//   const deleteExpensesByPerson = async (personName) => {
//     const q = query(
//       collection(db, "expenses"),
//       where("payer", "==", personName)
//     );

//     const results = await getDocs(q);

//     const deletePromises = results.docs.map((d) =>
//       deleteDoc(doc(db, "expenses", d.id))
//     );

//     await Promise.all(deletePromises);
//   };

//   // ➕ Agregar gasto
//   const addExpenseToDB = async (expense) =>
//     await addDoc(collection(db, "expenses"), expense);

//   // ❌ Borrar gasto individual
//   const deleteExpenseFromDB = async (id) =>
//     await deleteDoc(doc(db, "expenses", id));

//   return (
//     <div className="app">
//       <h1>Cuentas Claras</h1>

//       <AddPerson
//         people={people}
//         expenses={expenses}
//         addPersonToDB={addPersonToDB}
//         deletePersonFromDB={deletePersonFromDB}
//         deleteExpensesByPerson={deleteExpensesByPerson}
//       />

//       <AddExpense
//         people={people}
//         expenses={expenses}
//         addExpenseToDB={addExpenseToDB}
//         deleteExpenseFromDB={deleteExpenseFromDB}
//       />

//       <BalanceList people={people} expenses={expenses} />
//     </div>
//   );
// }

// export default App;

















// import { useState, useEffect } from "react";
// import AddPerson from "./components/addPerson";
// import AddExpense from "./components/addExpense";
// import BalanceList from "./components/balanceList";
// import { db } from "./firebase";
// import {
//   collection,
//   onSnapshot,
//   addDoc,
//   deleteDoc,
//   doc,
//   query,
//   where,
//   getDocs,
// } from "firebase/firestore";
// import "./App.css";

// function App() {
//   const [people, setPeople] = useState([]);
//   const [expenses, setExpenses] = useState([]);

//   // 📌 ESCUCHAR Firestore en tiempo real (people)
//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "people"), (snap) => {
//       const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       setPeople(list);
//     });
//     return unsub;
//   }, []);

//   // 📌 ESCUCHAR Firestore en tiempo real (expenses)
//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "expenses"), (snap) => {
//       const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       setExpenses(list);
//     });
//     return unsub;
//   }, []);

//   // ➕ Agregar persona
//   const addPersonToDB = async (person) =>
//     await addDoc(collection(db, "people"), person);

//   // ❌ Borrar persona SOLA
//   const deletePersonFromDB = async (id) =>
//     await deleteDoc(doc(db, "people", id));

//   // ❌ Borrar TODOS los gastos de una persona
//   // const deleteExpensesByPerson = async (personName) => {
//   //   const q = query(collection(db, "expenses"), where("payer", "==", personName));
//   //   const results = await getDocs(q);

//   //   const promises = results.docs.map((d) =>
//   //     deleteDoc(doc(db, "expenses", d.id))
//   //   );

//   //   await Promise.all(promises);
//   // };

//   // ➕ Agregar gasto
//   const addExpenseToDB = async (expense) =>
//     await addDoc(collection(db, "expenses"), expense);

//   // ❌ Borrar gasto individual
//   const deleteExpenseFromDB = async (id) =>
//     await deleteDoc(doc(db, "expenses", id));

//   // ❌ Borrar gastos asociados a una persona
// const deleteExpensesByPerson = async (personName) => {
//   const q = query(
//     collection(db, "expenses"),
//     where("payer", "==", personName)
//   );

//   const results = await getDocs(q);

//   const deletePromises = results.docs.map((d) =>
//     deleteDoc(doc(db, "expenses", d.id))
//   );

//   await Promise.all(deletePromises);
// };


//   return (
//     <div className="app">
//       <h1>Cuentas Claras</h1>

//       <AddPerson
//         people={people}
//         expenses={expenses}
//         addPersonToDB={addPersonToDB}
//         deletePersonFromDB={deletePersonFromDB}
//         deleteExpensesByPerson={deleteExpensesByPerson}   // 👈 FALTABA ESTO
//       />

//       <AddExpense
//         people={people}
//         expenses={expenses}
//         addExpenseToDB={addExpenseToDB}
//         deleteExpenseFromDB={deleteExpenseFromDB}
//       />

//       <BalanceList people={people} expenses={expenses} />
//     </div>
//   );
// }

// export default App;















// import { useState, useEffect } from "react";
// import AddPerson from "./components/addPerson";
// import AddExpense from "./components/addExpense";
// import BalanceList from "./components/balanceList";
// import { db } from "./firebase";
// import {
//   collection,
//   onSnapshot,
//   addDoc,
//   deleteDoc,
//   doc,
//   query,
//   where,
//   getDocs
// } from "firebase/firestore";
// import "./App.css";

// function App() {
//   const [people, setPeople] = useState([]);
//   const [expenses, setExpenses] = useState([]);

//   // 📌 ESCUCHAR Firestore en tiempo real (people)
//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "people"), (snap) => {
//       const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       setPeople(list);
//     });
//     return unsub;
//   }, []);

//   // 📌 ESCUCHAR Firestore en tiempo real (expenses)
//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "expenses"), (snap) => {
//       const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       setExpenses(list);
//     });
//     return unsub;
//   }, []);

//   // 🌟 === FUNCIONES FIRESTORE ===

//   // ➕ Agregar persona
//   const addPersonToDB = async (person) =>
//     await addDoc(collection(db, "people"), person);

//   // ❌ Borrar persona + gastos asociados
//   const deletePersonAndExpensesFromDB = async (personId, personName) => {
//     // 1) Borrar persona
//     await deleteDoc(doc(db, "people", personId));

//     // 2) Buscar todos los gastos donde payer == personName
//     const q = query(
//       collection(db, "expenses"),
//       where("payer", "==", personName)
//     );
//     const results = await getDocs(q);

//     // 3) Borrar cada gasto encontrado
//     const deletePromises = results.docs.map((d) =>
//       deleteDoc(doc(db, "expenses", d.id))
//     );

//     await Promise.all(deletePromises);
//   };

//   // ➕ Agregar gasto
//   const addExpenseToDB = async (expense) =>
//     await addDoc(collection(db, "expenses"), expense);

//   // ❌ Borrar gasto
//   const deleteExpenseFromDB = async (id) =>
//     await deleteDoc(doc(db, "expenses", id));

//   return (
//     <div className="app">
//       <h1>Cuentas Claras</h1>

//       <AddPerson
//         people={people}
//         expenses={expenses}
//         addPersonToDB={addPersonToDB}
//         deletePersonFromDB={deletePersonAndExpensesFromDB}
//       />

//       <AddExpense
//         people={people}
//         expenses={expenses}
//         addExpenseToDB={addExpenseToDB}
//         deleteExpenseFromDB={deleteExpenseFromDB}
//       />

//       <BalanceList people={people} expenses={expenses} />
//     </div>
//   );
// }

// export default App;









// import { useState, useEffect } from "react";
// import AddPerson from "./components/AddPerson";
// import AddExpense from "./components/AddExpense";
// import BalanceList from "./components/BalanceList";
// import { db } from "./firebase";
// import {
//   collection,
//   onSnapshot,
//   addDoc,
//   deleteDoc,
//   doc
// } from "firebase/firestore";
// import "./App.css";

// function App() {
//   const [people, setPeople] = useState([]);
//   const [expenses, setExpenses] = useState([]);

//   // 📌 ESCUCHAR Firestore en tiempo real (people)
//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "people"), (snap) => {
//       const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       setPeople(list);
//     });
//     return unsub;
//   }, []);

//   // 📌 ESCUCHAR Firestore en tiempo real (expenses)
//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "expenses"), (snap) => {
//       const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//       setExpenses(list);
//     });
//     return unsub;
//   }, []);

//   // 🔥 Exportamos funciones para agregar/borrar desde otros componentes
//   const addPersonToDB = async (person) =>
//     await addDoc(collection(db, "people"), person);

//   const deletePersonFromDB = async (id) =>
//     await deleteDoc(doc(db, "people", id));

//   const addExpenseToDB = async (expense) =>
//     await addDoc(collection(db, "expenses"), expense);

//   const deleteExpenseFromDB = async (id) =>
//     await deleteDoc(doc(db, "expenses", id));

//   return (
//     <div className="app">
//       <h1>Cuentas Claras</h1>

//       <AddPerson
//         people={people}
//         addPersonToDB={addPersonToDB}
//         deletePersonFromDB={deletePersonFromDB}
//         expenses={expenses}
//       />

//       <AddExpense
//         people={people}
//         expenses={expenses}
//         addExpenseToDB={addExpenseToDB}
//         deleteExpenseFromDB={deleteExpenseFromDB}
//       />

//       <BalanceList people={people} expenses={expenses} />
//     </div>
//   );
// }

// export default App;





// import { useState, useEffect } from "react";
// import AddPerson from "./components/AddPerson";
// import AddExpense from "./components/AddExpense";
// import BalanceList from "./components/BalanceList";
// import "./App.css";

// // ⬅️ IMPORTAMOS FIRESTORE
// import { db } from "./firebase";
// import { doc, onSnapshot, updateDoc, setDoc } from "firebase/firestore";

// function App() {
//   // --- LOCAL STORAGE (SE MANTIENE)
//   const [people, setPeople] = useState(() => {
//     const saved = localStorage.getItem("people");
//     return saved ? JSON.parse(saved) : [];
//   });

//   const [expenses, setExpenses] = useState(() => {
//     const saved = localStorage.getItem("expenses");
//     return saved ? JSON.parse(saved) : [];
//   });

//   // --- ACTUALIZA localStorage CUANDO CAMBIAN
//   useEffect(() => {
//     localStorage.setItem("people", JSON.stringify(people));
//   }, [people]);

//   useEffect(() => {
//     localStorage.setItem("expenses", JSON.stringify(expenses));
//   }, [expenses]);

//   // ============================================================
//   //     🔥 SINCRONIZACIÓN CON FIRESTORE - TIEMPO REAL
//   // ============================================================

//   useEffect(() => {
//     const ref = doc(db, "appData", "shared");

//     // Escuchar cambios en Firestore en tiempo real
//     const unsub = onSnapshot(ref, (snap) => {
//       if (!snap.exists()) return;

//       const data = snap.data();

//       // Evita rescribir si es igual
//       if (JSON.stringify(data.people) !== JSON.stringify(people)) {
//         setPeople(data.people);
//       }
//       if (JSON.stringify(data.expenses) !== JSON.stringify(expenses)) {
//         setExpenses(data.expenses);
//       }
//     });

//     return () => unsub();
//   }, []);

//   // ============================================================
//   //     🔥 GUARDAR EN FIRESTORE CADA VEZ QUE CAMBIA ALGO
//   // ============================================================

//   const saveToFirestore = async (newPeople, newExpenses) => {
//     const ref = doc(db, "appData", "shared");

//     await setDoc(ref, {
//       people: newPeople,
//       expenses: newExpenses
//     }, { merge: true });
//   };

//   // --- ENVUELVO SETTERS PARA QUE GUARDEN EN FIRESTORE TAMBIÉN
//   const setPeopleSync = (newPeople) => {
//     setPeople(newPeople);
//     saveToFirestore(newPeople, expenses);
//   };

//   const setExpensesSync = (newExpenses) => {
//     setExpenses(newExpenses);
//     saveToFirestore(people, newExpenses);
//   };

//   // ============================================================

//   return (
//     <div className="app">
//       <h1>Cuentas claras</h1>

//       <AddPerson 
//         people={people} 
//         setPeople={setPeopleSync}
//         expenses={expenses}
//         setExpenses={setExpensesSync}
//       />

//       <AddExpense
//         people={people}
//         expenses={expenses}
//         setExpenses={setExpensesSync}
//       />

//       <BalanceList people={people} expenses={expenses} />
//     </div>
//   );
// }

// export default App;




// import { useState, useEffect } from "react";
// import AddPerson from "./components/AddPerson";
// import AddExpense from "./components/AddExpense";
// import BalanceList from "./components/BalanceList";
// import "./App.css";

// function App() {
//   const [people, setPeople] = useState(() => {
//   const saved = localStorage.getItem("people");
//   return saved ? JSON.parse(saved) : [];
// });  
  
//   const [expenses, setExpenses] = useState(() => {
//   const saved = localStorage.getItem("expenses");
//   return saved ? JSON.parse(saved) : [];
// });
  
//   useEffect(() => {
//   localStorage.setItem("people", JSON.stringify(people));
// }, [people]);

// useEffect(() => {
//   localStorage.setItem("expenses", JSON.stringify(expenses));
// }, [expenses]);


//   return (
//     <div className="app">
//       <h1>Cuentas claras</h1>

//       <AddPerson people={people} setPeople={setPeople} expenses={expenses} 
//       setExpenses={setExpenses}/>      
//       <AddExpense people={people} expenses={expenses} setExpenses={setExpenses} />
//       <BalanceList people={people} expenses={expenses} />
//     </div>
//   );
// }

// export default App;
