import { useState, useEffect } from "react";
import AddPerson from "./components/addPerson";
import AddExpense from "./components/addExpense";
import BalanceList from "./components/balanceList";
import CreateGroup from "./components/createGroup";
import { db } from "./firebase";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
} from "firebase/firestore";
import "./App.css";

function App() {
  const [groupId, setGroupId] = useState(null);
  const [people, setPeople] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // 🔄 Personas en tiempo real
  useEffect(() => {
    if (!groupId) return;

    const unsub = onSnapshot(
      collection(db, "groups", groupId, "people"),
      (snap) => {
        setPeople(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    );

    return unsub;
  }, [groupId]);

  // 🔄 Gastos en tiempo real
  useEffect(() => {
    if (!groupId) return;

    const unsub = onSnapshot(
      collection(db, "groups", groupId, "expenses"),
      (snap) => {
        setExpenses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
      }
    );

    return unsub;
  }, [groupId]);

  // 👉 PANTALLA CREAR / ENTRAR A GRUPO
  if (!groupId) {
    return (
      <div className="app">
        <h1>Cuentas Claras</h1>
        <CreateGroup onGroupCreated={setGroupId} />
      </div>
    );
  }

  // ➕ Persona
  const addPersonToDB = (person) =>
    addDoc(collection(db, "groups", groupId, "people"), person);

  // ❌ Persona + gastos
  const deletePersonAndExpenses = async (person) => {
    await deleteDoc(doc(db, "groups", groupId, "people", person.id));

    const q = query(
      collection(db, "groups", groupId, "expenses"),
      where("payer", "==", person.name)
    );

    const snap = await getDocs(q);

    await Promise.all(
      snap.docs.map(d =>
        deleteDoc(doc(db, "groups", groupId, "expenses", d.id))
      )
    );
  };

  // ➕ Gasto
  const addExpenseToDB = (expense) =>
    addDoc(collection(db, "groups", groupId, "expenses"), expense);

  // ❌ Gasto
  const deleteExpenseFromDB = (expenseId) =>
    deleteDoc(doc(db, "groups", groupId, "expenses", expenseId));

  return (
    <div className="app">
      <h1>Cuentas Claras</h1>

      <AddPerson
        people={people}
        addPersonToDB={addPersonToDB}
        deletePerson={deletePersonAndExpenses}
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
// import CreateGroup from "./components/createGroup";
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
//   const [groupId, setGroupId] = useState(null);
//   const [people, setPeople] = useState([]);
//   const [expenses, setExpenses] = useState([]);

//   if (!groupId) {
//     return (
//       <div className="app">
//         <h1>Cuentas Claras</h1>
//         <CreateGroup onGroupCreated={setGroupId} />
//       </div>
//     );
//   }

//   useEffect(() => {
//     const unsub = onSnapshot(
//       collection(db, "groups", groupId, "people"),
//       snap => setPeople(snap.docs.map(d => ({ id: d.id, ...d.data() })))
//     );
//     return unsub;
//   }, [groupId]);

//   useEffect(() => {
//     const unsub = onSnapshot(
//       collection(db, "groups", groupId, "expenses"),
//       snap => setExpenses(snap.docs.map(d => ({ id: d.id, ...d.data() })))
//     );
//     return unsub;
//   }, [groupId]);

//   const addPersonToDB = person =>
//     addDoc(collection(db, "groups", groupId, "people"), person);

//   const deletePersonAndExpenses = async (person) => {
//     await deleteDoc(doc(db, "groups", groupId, "people", person.id));

//     const q = query(
//       collection(db, "groups", groupId, "expenses"),
//       where("payer", "==", person.name)
//     );

//     const snap = await getDocs(q);
//     await Promise.all(
//       snap.docs.map(d =>
//         deleteDoc(doc(db, "groups", groupId, "expenses", d.id))
//       )
//     );
//   };

//   const addExpenseToDB = expense =>
//     addDoc(collection(db, "groups", groupId, "expenses"), expense);

//   const deleteExpenseFromDB = expenseId =>
//     deleteDoc(doc(db, "groups", groupId, "expenses", expenseId));

//   return (
//     <div className="app">
//       <h1>Cuentas Claras</h1>

//       <AddPerson
//         people={people}
//         addPersonToDB={addPersonToDB}
//         deletePerson={deletePersonAndExpenses}
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
// import CreateGroup from "./components/createGroup";
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
//   const [groupId, setGroupId] = useState(null);
//   const [people, setPeople] = useState([]);
//   const [expenses, setExpenses] = useState([]);

//   // 👉 PANTALLA CREAR / ENTRAR A GRUPO
//   if (!groupId) {
//     return (
//       <div className="app">
//         <h1>Cuentas Claras</h1>
//         <CreateGroup onGroupCreated={setGroupId} />
//       </div>
//     );
//   }

//   // 🔄 Personas en tiempo real
//   useEffect(() => {
//     const unsub = onSnapshot(
//       collection(db, "groups", groupId, "people"),
//       (snap) => {
//         setPeople(snap.docs.map(d => ({ id: d.id, ...d.data() })));
//       }
//     );
//     return unsub;
//   }, [groupId]);

//   // 🔄 Gastos en tiempo real
//   useEffect(() => {
//     const unsub = onSnapshot(
//       collection(db, "groups", groupId, "expenses"),
//       (snap) => {
//         setExpenses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
//       }
//     );
//     return unsub;
//   }, [groupId]);

//   // ➕ Persona
//   const addPersonToDB = (person) =>
//     addDoc(collection(db, "groups", groupId, "people"), person);

//   // ❌ Persona + gastos
//   const deletePersonAndExpenses = async (person) => {
//     // borrar persona
//     await deleteDoc(doc(db, "groups", groupId, "people", person.id));

//     // borrar gastos asociados
//     const q = query(
//       collection(db, "groups", groupId, "expenses"),
//       where("payer", "==", person.name)
//     );

//     const snap = await getDocs(q);
//     await Promise.all(
//       snap.docs.map(d =>
//         deleteDoc(doc(db, "groups", groupId, "expenses", d.id))
//       )
//     );
//   };

//   // ➕ Gasto
//   const addExpenseToDB = (expense) =>
//     addDoc(collection(db, "groups", groupId, "expenses"), expense);

//   // ❌ Gasto
//   const deleteExpenseFromDB = (expenseId) =>
//     deleteDoc(doc(db, "groups", groupId, "expenses", expenseId));

//   return (
//     <div className="app">
//       <h1>Cuentas Claras</h1>

//       <AddPerson
//         people={people}
//         addPersonToDB={addPersonToDB}
//         deletePerson={deletePersonAndExpenses}
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
// import CreateGroup from "./components/createGroup";
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
//   // 🔹 STATES (siempre arriba)
//   const [groupId, setGroupId] = useState(null);
//   const [people, setPeople] = useState([]);
//   const [expenses, setExpenses] = useState([]);

//   // 🔹 ESCUCHAR PERSONAS (solo si hay groupId)
//   useEffect(() => {
//     if (!groupId) return;

//     const unsub = onSnapshot(
//       collection(db, "groups", groupId, "people"),
//       (snap) => {
//         const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//         setPeople(list);
//       }
//     );

//     return unsub;
//   }, [groupId]);

//   // 🔹 ESCUCHAR GASTOS (solo si hay groupId)
//   useEffect(() => {
//     if (!groupId) return;

//     const unsub = onSnapshot(
//       collection(db, "groups", groupId, "expenses"),
//       (snap) => {
//         const list = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
//         setExpenses(list);
//       }
//     );

//     return unsub;
//   }, [groupId]);

//   // 🔹 FIRESTORE ACTIONS
//   const addPersonToDB = async (person) => {
//     await addDoc(collection(db, "groups", groupId, "people"), person);
//   };

//   const deletePersonFromDB = async (personId) => {
//     await deleteDoc(doc(db, "groups", groupId, "people", personId));
//   };

//   const deleteExpensesByPerson = async (personName) => {
//     const q = query(
//       collection(db, "groups", groupId, "expenses"),
//       where("payer", "==", personName)
//     );

//     const snap = await getDocs(q);

//     await Promise.all(
//       snap.docs.map((d) =>
//         deleteDoc(doc(db, "groups", groupId, "expenses", d.id))
//       )
//     );
//   };

//   const addExpenseToDB = async (expense) => {
//     await addDoc(collection(db, "groups", groupId, "expenses"), expense);
//   };

//   const deleteExpenseFromDB = async (expenseId) => {
//     await deleteDoc(doc(db, "groups", groupId, "expenses", expenseId));
//   };

//   // 🔹 RENDER
//   return (
//     <div className="app">
//       <h1>Cuentas Claras</h1>

//       {!groupId ? (
//         <CreateGroup onGroupCreated={setGroupId} />
//       ) : (
//         <>
//           <AddPerson
//             groupId={groupId}
//             people={people}
//             addPersonToDB={addPersonToDB}
//             deletePersonFromDB={deletePersonFromDB}
//             deleteExpensesByPerson={deleteExpensesByPerson}
//           />

//           <AddExpense
//             groupId={groupId}
//             people={people}
//             expenses={expenses}
//             addExpenseToDB={addExpenseToDB}
//             deleteExpenseFromDB={deleteExpenseFromDB}
//           />

//           <BalanceList people={people} expenses={expenses} />
//         </>
//       )}

//       <p className="foot">Desarrollado por Jose Luis Gerbino</p>
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
// import CreateGroup from "./components/createGroup";





// function App() {

//   const [groupId, setGroupId] = useState(null);
//   const [people, setPeople] = useState([]);
//   const [expenses, setExpenses] = useState([]);


// if (!groupId) {
//   return (
//     <div className="app">
//       <h1>Cuentas Claras</h1>
//       <CreateGroup onGroupCreated={setGroupId} />
//     </div>
//   );
// }

//   // Escuchar personas en tiempo real
//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "groups", groupId, "people")
// , snap => {
//       const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
//       setPeople(list);
//     });
//     return unsub;
//   }, []);

//   // Escuchar gastos en tiempo real
//   useEffect(() => {
//     const unsub = onSnapshot(collection(db, "expenses"), snap => {
//       const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
//       setExpenses(list);
//     });
//     return unsub;
//   }, []);

//   // Agregar persona
//   const addPersonToDB = async person => {
//     await addDoc(collection(db, "groups", groupId, "people")
// , person);
//   };

//   // Borrar persona
//   const deletePersonFromDB = async (groupId, personId) => {
//   await deleteDoc(
//     doc(db, "groups", groupId, "people", personId)
//   );
// };

//   // const deletePersonFromDB = async id => {
//   //   await deleteDoc(doc(db, "people", id));
//   // };

//   // Borrar TODOS los gastos de una persona
//   const deleteExpensesByPerson = async (groupId, personName) => {
//   const q = query(
//     collection(db, "groups", groupId, "expenses"),
//     where("payer", "==", personName)
//   );

//   const snap = await getDocs(q);

//   await Promise.all(
//     snap.docs.map(d =>
//       deleteDoc(doc(db, "groups", groupId, "expenses", d.id))
//     )
//   );
// };



//   // const deleteExpensesByPerson = async personName => {
//   //   console.log("🔥 Buscando gastos de:", personName);

//   //   const q = query(
//   //     collection(db, "expenses"),
//   //     where("payer", "==", personName)
//   //   );

//   //   const results = await getDocs(q);

//   //   console.log("Documentos encontrados:", results.docs.length);

//   //   const promises = results.docs.map(d =>
//   //     deleteDoc(doc(db, "expenses", d.id))
//   //   );

//   //   await Promise.all(promises);

//   //   console.log("Gastos de", personName, "borrados");
//   // };

//   // Agregar gasto
//   const addExpenseToDB = async expense => {
//     await addDoc(collection(db, "groups", groupId, "expenses")
// , expense);
//   };

//   // Borrar gasto individual
//   const deleteExpenseFromDB = async (groupId, expenseId) => {
//   await deleteDoc(
//     doc(db, "groups", groupId, "expenses", expenseId)
//   );
// };





//   // const deleteExpenseFromDB = async id => {
//   //   await deleteDoc(doc(db, "expenses", id));
//   // };

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
//       <p className="foot">Desarrollado por Jose Luis Gerbino</p>
//     </div>
//   );
// }

// export default App;









