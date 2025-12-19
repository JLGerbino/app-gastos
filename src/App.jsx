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
  // 🔹 1) Estado inicial desde localStorage
  const [groupId, setGroupId] = useState(() => {
    return localStorage.getItem("groupId");
  });
  const [people, setPeople] = useState([]);
  const [expenses, setExpenses] = useState([]);

  // 🔹 2) Guardar groupId en localStorage
  useEffect(() => {
    if (groupId) {
      localStorage.setItem("groupId", groupId);
    }
  }, [groupId]);

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

  // 🚪 Salir del grupo
  const exitGroup = () => {
    localStorage.removeItem("groupId");
    setGroupId(null);
    setPeople([]);
    setExpenses([]);
  };

  // 👉 PANTALLA CREAR / ENTRAR A GRUPO
  if (!groupId) {
    return (
      <div className="app">
        <h1>Binevenido a Cuentas Claras</h1>
        <CreateGroup onGroupCreated={setGroupId} />
      </div>
    );
  }

  return (
    <div className="app">
      <h1>Cuentas Claras</h1>

      <button className="exit-btn" onClick={exitGroup}>
        Salir <i class="fa fa-sign-out" aria-hidden="true"></i>
      </button>

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

//   // 🔄 Personas en tiempo real
//   useEffect(() => {
//     if (!groupId) return;

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
//     if (!groupId) return;

//     const unsub = onSnapshot(
//       collection(db, "groups", groupId, "expenses"),
//       (snap) => {
//         setExpenses(snap.docs.map(d => ({ id: d.id, ...d.data() })));
//       }
//     );

//     return unsub;
//   }, [groupId]);

//   // 👉 PANTALLA CREAR / ENTRAR A GRUPO
//   if (!groupId) {
//     return (
//       <div className="app">
//         <h1>Cuentas Claras</h1>
//         <CreateGroup onGroupCreated={setGroupId} />
//       </div>
//     );
//   }

//   // ➕ Persona
//   const addPersonToDB = (person) =>
//     addDoc(collection(db, "groups", groupId, "people"), person);

//   // ❌ Persona + gastos
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







