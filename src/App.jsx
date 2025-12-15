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

//nuevo
  //Crea id
//   const getGroupId = () => {
//   let id = localStorage.getItem("groupId");
//   if (!id) {
//     id = crypto.randomUUID();
//     localStorage.setItem("groupId", id);
//   }
//   return id;
// };

// const groupId = getGroupId();
//nuevo

  // Escuchar personas en tiempo real
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "people"), snap => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setPeople(list);
    });
    return unsub;
  }, []);

  // Escuchar gastos en tiempo real
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "expenses"), snap => {
      const list = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      setExpenses(list);
    });
    return unsub;
  }, []);

  // Agregar persona
  const addPersonToDB = async person => {
    await addDoc(collection(db, "people"), person);
  };

  // Borrar persona
  const deletePersonFromDB = async id => {
    await deleteDoc(doc(db, "people", id));
  };

  // Borrar TODOS los gastos de una persona
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

    console.log("Gastos de", personName, "borrados");
  };

  // Agregar gasto
  const addExpenseToDB = async expense => {
    await addDoc(collection(db, "expenses"), expense);
  };

  // Borrar gasto individual
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
      <p className="foot">Desarrollado por Jose Luis Gerbino</p>
    </div>
  );
}

export default App;









