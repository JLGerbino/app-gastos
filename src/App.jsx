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
  // Estado inicial desde localStorage
  const [groupId, setGroupId] = useState(() => {
    return localStorage.getItem("groupId");
  });

  const [groupName, setGroupName] = useState(() => {
    return localStorage.getItem("groupName") || "";
  });
  
  const [people, setPeople] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [started, setStarted] = useState(false);//nuevo

  // Guardar groupId en localStorage
  useEffect(() => {
    if (groupId) {
      localStorage.setItem("groupId", groupId);
    }
  }, [groupId]);

  // Ver personas en tiempo real
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

  // Ver gastos en tiempo real
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

  // Agregar Persona
  const addPersonToDB = (person) =>
    addDoc(collection(db, "groups", groupId, "people"), person);

  // Borrar persona + gastos
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

  // Agregar Gasto
  const addExpenseToDB = (expense) =>
    addDoc(collection(db, "groups", groupId, "expenses"), expense);

  // Borrar Gasto
  const deleteExpenseFromDB = (expenseId) =>
    deleteDoc(doc(db, "groups", groupId, "expenses", expenseId));

    //Borrar TODOS los gastos del grupo
  const deleteAllExpenses = async () => {
    const q = query(
      collection(db, "groups", groupId, "expenses")
    );

    const snap = await getDocs(q);

    await Promise.all(
      snap.docs.map(d =>
        deleteDoc(doc(db, "groups", groupId, "expenses", d.id))
      )
    );
  };


  // Salir del grupo
  const exitGroup = () => {
    localStorage.removeItem("groupId");
    setGroupId(null);
    setPeople([]);
    setExpenses([]);
  };
//nuevo
  if (!started && !groupId) {
  return (
    <div className="app welcome">
      <img src="logo.jpg" alt="Cuentas Claras" className="logo" />
      <h2>La manera mas facil de</h2>
      <h2>compartir gastos</h2>

      <h3>Ideal para resolver las cuentas en</h3>
      <h3>vacaciones, juntadas, salidas</h3>
      <h3>o cuando lo nesecites!!!</h3>


      <button className="boton" onClick={() => setStarted(true)}>
        Ingresar
      </button>
    </div>
  );
}
//nuevo




  // Pantalla crear/Entrar a grupo
  if (!groupId) {
  return (
    <div className="app">
      {/* <h1>Cuentas Claras</h1> */}
      <img src="logo.jpg" alt="Cuentas Claras" className="Create" />
      <p>La manera mas facil de compartir gastos</p>
      <CreateGroup
        onGroupCreated={(id, name) => {
          setGroupId(id);
          setGroupName(name);
        }}
      />
    </div>
  );
}


  
  // if (!groupId) {
  //   return (
  //     <div className="app">
  //       <h1>Bienvenido a Cuentas Claras</h1>
  //       <CreateGroup onGroupCreated={setGroupId} />
  //     </div>
  //   );
  // }

  return (
    <div className="app">

      {/* <h1>Cuentas Claras</h1> */}
      <img src="logo.jpg" alt="Cuentas Claras" className="Create" />
      <p>La manera mas facil de compartir gastos</p>
<h1 className="group-title">{groupName}</h1>
      <button className="exit-btn" onClick={exitGroup}>
        Salir <i className="fa fa-sign-out" aria-hidden="true"></i>
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
        deleteAllExpenses={deleteAllExpenses}
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







