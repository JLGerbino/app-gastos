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
  getDoc,
  updateDoc,
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

  const [groupCode, setGroupCode] = useState("");
  
  const [people, setPeople] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [started, setStarted] = useState(false);  

  // Guardar groupId en localStorage
  useEffect(() => {
    if (groupId) {
      localStorage.setItem("groupId", groupId);
    }
  }, [groupId]);


  //traer nombre grupo de firebase
  useEffect(() => {
  if (!groupId) return;

  const fetchGroupInfo = async () => {
    const ref = doc(db, "groups", groupId);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      const data = snap.data();
      setGroupName(data.name || "");
      setGroupCode(data.code || "");
    }
  };

  fetchGroupInfo();
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
// Editar participante (cantidad + alias)
const editPersonInDB = async (personId, data) => {
  const ref = doc(db, "groups", groupId, "people", personId);

  await updateDoc(ref, {
    count: Number(data.count),
    alias: data.alias.trim(),
  });
};


  // Salir del grupo
  const exitGroup = () => {
    localStorage.removeItem("groupId");
    setGroupId(null);
    setPeople([]);
    setExpenses([]);
  };
//Bienvenida
  if (!started && !groupId) {
  return (
    <div className="app welcome">
      <img src="logo.png" alt="Cuentas Claras" className="logo" />
      <h2>La manera más fácil de compartir gastos</h2>      
      <h3>Ideal para resolver las cuentas en vacaciones, juntadas, salidas o cuando lo nesecites!!!</h3>
      <button className="boton" onClick={() => setStarted(true)}>
        Ingresar
      </button>
    </div>
  );
}


  // Pantalla crear/Entrar a grupo
  if (!groupId) {
  return (
    <div className="app">
      <img src="logo.png" alt="Cuentas Claras" className="Create" />
      <p>La manera más fácil de compartir gastos</p>
      <CreateGroup
        onGroupCreated={(id, name) => {
          setGroupId(id);
          setGroupName(name);
        }}
      />
    </div>
  );
}




  return (
    <div className="app">      
      <img src="logo.png" alt="Cuentas Claras" className="Create" />
      <p>La manera mas facil de compartir gastos</p>
<h1 className="group-title">{groupName}</h1>
<p className="group-code">
  <strong>{groupCode}</strong>  
</p>
      <button className="exit-btn" onClick={exitGroup}>
        Salir <i className="fa fa-sign-out" aria-hidden="true"></i>
      </button>

      <AddPerson
        people={people}
        addPersonToDB={addPersonToDB}
        deletePerson={deletePersonAndExpenses}
        editPersonInDB={editPersonInDB}
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









