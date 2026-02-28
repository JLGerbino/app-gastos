import { useState, useEffect } from "react";
import AddPerson from "./components/addPerson";
import AddExpense from "./components/addExpense";
import BalanceList from "./components/balanceList";
import CreateGroup from "./components/createGroup";
import { calculateDebts } from "./utils/calculateDebts";
import Swal from "sweetalert2";
import { db } from "./firebase";
import { getAuth, signInAnonymously, onAuthStateChanged } from "firebase/auth";
import {
  collection,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  query,
  where,
  getDocs,
  //getDoc,
  updateDoc,
  writeBatch,
  //serverTimestamp, //agregado para pagos
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
  const [loading, setLoading] = useState(false);
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [user, setUser] = useState(null);
  const [group, setGroup] = useState(null);
  const [groupCode, setGroupCode] = useState("");
  const [people, setPeople] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [started, setStarted] = useState(false);
  const [payments, setPayments] = useState([]);//agregado para pagos
  const [debts, setDebts] = useState([]);
  const hasAdmin = !!group?.adminUid;
  const isAdmin = !!group?.adminUid && group.adminUid === user?.uid;
  //const [pinAdminMode, setPinAdminMode] = useState(false);


  // Guardar groupId en localStorage
  useEffect(() => {
    if (groupId) {
      localStorage.setItem("groupId", groupId);
    }
  }, [groupId]);

  //login anonimo
useEffect(() => {
  const auth = getAuth();

  signInAnonymously(auth).catch(console.error);

  const unsub = onAuthStateChanged(auth, user => {
    setUser(user);
  });

  return unsub;
}, []);

//si no hay admin todos editan si hay, solo edita admin
const canEdit = !hasAdmin || isAdmin;



// traer grupo en tiempo real
useEffect(() => {
  if (!groupId) return;

  const unsub = onSnapshot(
    doc(db, "groups", groupId),
    (snap) => {
      if (snap.exists()) {
        const data = snap.data();

        setGroup({
          id: snap.id,
          ...data,
          status: data.status || "open",
        });

        setGroupName(data.name || "");
        setGroupCode(data.code || "");
      }
    }
  );

  return () => unsub();
}, [groupId]);


// //traer nombre grupo de firebase
// useEffect(() => {
//   if (!groupId) return;

//   const fetchGroupInfo = async () => {
//     const ref = doc(db, "groups", groupId);
//     const snap = await getDoc(ref);

//     if (snap.exists()) {
//       const data = snap.data();

//       setGroup({
//         id: snap.id,
//         ...data,
//         status: data.status || "open", // 👈 CLAVE
//       });

//       setGroupName(data.name || "");
//       setGroupCode(data.code || "");




//       // si el grupo NO tiene admin → todos pueden editar
//       setIsAdminMode(!data.hasAdmin);
//     }
//   };

//   fetchGroupInfo();
// }, [groupId]);

//Borra grupo
const handleDeleteGroup = async () => {
  // Primera confirmación
  const confirm1 = await Swal.fire({
    title: "Eliminar grupo",
    text: "Esta acción eliminará el grupo con TODOS los participantes, gastos y pagos!",
    icon: "warning",
    iconColor:"#269181",
    showCancelButton: true,
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#d33",
    background: "#dee0e0",
    color: "#283655",
  });

  if (!confirm1.isConfirmed) return;

  // Segunda confirmación fuerte
  const confirm2 = await Swal.fire({
    title: "¿Estás completamente seguro?",
    text: "Esta acción es irreversible.",
    icon: "error",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar definitivamente",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#d33",
    background: "#dee0e0",
    color: "#283655",
  });

  if (!confirm2.isConfirmed) return;
  Swal.fire({
          title: "Eliminando grupo...",
          allowOutsideClick: false,
          allowEscapeKey: false,
          background: "#dee0e0",
          color:"#283655",
          iconColor:"#269181",
          confirmButtonColor:"#35b67e",
          didOpen: () => {
            Swal.showLoading();
          },
        });

  try {
    // 🔹 Borrar expenses
    const expensesSnap = await getDocs(
      collection(db, "groups", groupId, "expenses")
    );
    for (const docu of expensesSnap.docs) {
      await deleteDoc(docu.ref);
    }

    // 🔹 Borrar payments
    const paymentsSnap = await getDocs(
      collection(db, "groups", groupId, "payments")
    );
    for (const docu of paymentsSnap.docs) {
      await deleteDoc(docu.ref);
    }

    // 🔹 Borrar people
    const peopleSnap = await getDocs(
      collection(db, "groups", groupId, "people")
    );
    for (const docu of peopleSnap.docs) {
      await deleteDoc(docu.ref);
    }

    // 🔹 Borrar grupo
    await deleteDoc(doc(db, "groups", groupId));

    await Swal.fire({
      title: "Grupo eliminado",
      icon: "success",
      iconColor:"#269181",
      timer: 1500,
      showConfirmButton: false,
      background: "#dee0e0",
      color: "#283655",
    });

    // 🔹 Volver a pantalla inicial
    setGroupId(null);

  } catch (error) {
    console.error(error);
    Swal.fire({
      title: "Error al eliminar",
      text: "Intentá nuevamente",
      icon: "error",
      iconColor:"#269181",
      background: "#dee0e0",
      color: "#283655",
    });
  }
};

//Scroll secciones
const scrollToSection = (id) => {
  const element = document.getElementById(id);
  if (element) {
    element.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() =>{
      document.activeElement?.blur();
    }, 300);
  }
};


//traspasar administrador
const handleAdminPinLogin = async () => {
  const result = await Swal.fire({
    title: "¿Querés ser administrador?",
    text: "Ingresá el PIN",
    input: "password",
    background: "#dee0e0",
    color: "#283655",
    iconColor: "#269181",
    showCancelButton: true,
    confirmButtonColor: "#35b67e",
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cerrar",
    inputAttributes: {
      maxlength: 4,
      inputmode: "numeric",
    },
    inputPlaceholder: "PIN de 4 dígitos",
  });

  // 🔴 Si canceló o cerró
  if (!result.isConfirmed) return;

  const pin = result.value;

  // 🔴 Si confirmó pero dejó vacío
  if (!pin || !pin.trim()) {
    await Swal.fire({
      title: "Tenés que ingresar el PIN",
      icon: "warning",
      iconColor:"#269181",
      confirmButtonColor: "#35b67e",
      background: "#dee0e0",
      color: "#283655",
    });
    return;
  }

  // 🔴 Si el PIN es incorrecto
  if (pin !== group.adminPin) {
    await Swal.fire({
      title: "PIN incorrecto",
      icon: "error",
      iconColor:"#269181",
      confirmButtonColor: "#35b67e",
      background: "#dee0e0",
      color: "#283655",
    });
    return;
  }

  // 🟢 Si el PIN es correcto
  const { value: newName } = await Swal.fire({
    title: "Ingresá el nombre del administrador",
    input: "text",
    inputPlaceholder: "Tu nombre",
    background: "#dee0e0",
    color: "#283655",
    confirmButtonColor: "#35b67e",
    confirmButtonText: "Confirmar",
    cancelButtonText: "Cancelar",
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value || !value.trim()) {
        return "Tenés que ingresar el nombre del nuevo administrador";
      }
    },
  });

  if (!newName) return;

    Swal.fire({
          title: "Cambiando de administrador...",
          allowOutsideClick: false,
          allowEscapeKey: false,
          background: "#dee0e0",
          color:"#283655",
          iconColor:"#269181",
          confirmButtonColor:"#35b67e",
          didOpen: () => {
            Swal.showLoading();
          },
        });


  await updateDoc(doc(db, "groups", groupId), {
    adminUid: user.uid,
    adminName: newName,
  });

  Swal.fire({
    title: "Ahora sos el administrador del grupo",
    icon: "success",
    confirmButtonColor: "#35b67e",
    background: "#dee0e0",
    color: "#283655",
  });
};


// const handleAdminPinLogin = async () => {
//   const { value: pin } = await Swal.fire({
//     title: "Queres ser administrador?",
//     text: "Ingresa el PIN",
//     input: "password",
//     background: "#dee0e0",
//     color:"#283655",
//     iconColor:"#269181",
//     showCancelButton: true,
//     confirmButtonColor:"#35b67e",
//     confirmButtonText:"Confirmar",
//     cancelButtonText: "Cerrar",
//     inputAttributes: {
//       maxlength: 4,
//       inputmode: "numeric",
//     },
//     inputPlaceholder: "PIN de 4 dígitos",
//   });
// if (pin === group.adminPin) {

//   const { value: newName } = await Swal.fire({
//     title: "Ingresá el nombre del administrador",
//     input: "text",
//     inputPlaceholder: "Tu nombre",
//     background: "#dee0e0",
//     color:"#283655",
//     iconColor:"#269181",
//     confirmButtonColor:"#35b67e",
//     confirmButtonText:"Confirmar",
//     cancelButtonText: "Cancelar",
//     inputValidator: (value)=>{
//       if(!value || !value.trim()) {
//         return "Tenés que ingresar el nombre del nuevo administrador"
//       }

//     }
//   });
//   Swal.fire({
//           title: "Cambiando de administrador...",
//           allowOutsideClick: false,
//           allowEscapeKey: false,
//           background: "#dee0e0",
//           color:"#283655",
//           iconColor:"#269181",
//           confirmButtonColor:"#35b67e",
//           didOpen: () => {
//             Swal.showLoading();
//           },
//         });

//   await updateDoc(doc(db, "groups", groupId), {
//     adminUid: user.uid,
//     adminName: newName,
//   });

//   Swal.fire({
//     title: "Ahora sos el administrador del grupo",
//     background: "#dee0e0",
//     color:"#283655",
//     iconColor:"#269181",
//     confirmButtonColor:"#35b67e",
//     confirmButtonText:"Cerrar",
//   });
// }
//   else {
//     Swal.fire({
//     title: "PIN incorrecto",
//     background: "#dee0e0",
//     color:"#283655",
//     iconColor:"#269181",
//     confirmButtonColor:"#35b67e",
//     confirmButtonText:"Cerrar",
//   });

//   }
// };


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

  //ver pago en tiemo real // agregado para pagos
  useEffect(() => {
  if (!groupId) return;

  const unsub = onSnapshot(
    collection(db, "groups", groupId, "payments"),
    (snap) => {
      setPayments(snap.docs.map(d => ({ id: d.id, ...d.data() })));
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

  //Agregar un pago //agregado para pagos
  // const addPaymentToDB = (payment) =>
  // addDoc(collection(db, "groups", groupId, "payments"), {
  //   ...payment,
  //   createdAt: serverTimestamp(),
  // });


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
try {
  await updateDoc(ref, {
    count: Number(data.count),
    alias: data.alias.trim(),
  });
} catch (error) {console.error(error);

}finally {
    setLoading(false);
  }

};

//con grupo cerrado escuchar espejo
// useEffect(() => {
//   if (!groupId || group?.status !== "closed") return;

//   const unsub = onSnapshot(
//     collection(db, "groups", groupId, "debts"),
//     snap => {
//       setDebts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
//     }
//   );

//   return unsub;
// }, [groupId, group?.status]);

//guardar pago
const addPayment = async (payment) => {
  await addDoc(
    collection(db, "groups", groupId, "payments"),
    payment
  );
};

//Borrar todos los pagos
const handleClearPayments = async () => {
  const result = await Swal.fire({
    title: "Eliminar todos los pagos",
    text: "Esta acción no se puede deshacer",
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
    confirmButtonColor: "#d33",
    iconColor:"#269181"
  });

  if (!result.isConfirmed) return;

Swal.fire({
    title: "Eliminando los pagos...",
    allowOutsideClick: false,
    allowEscapeKey: false,
    background: "#dee0e0",
    color:"#283655",
    iconColor:"#269181",
    confirmButtonColor:"#35b67e",
    didOpen: () => {
      Swal.showLoading();
    },
  });
  // setLoading(true);

  try {
    const paymentsRef = collection(db, "groups", groupId, "payments");

    const snapshot = await getDocs(paymentsRef);

    const batch = writeBatch(db);

    snapshot.forEach((docu) => {
      batch.delete(docu.ref);
    });

    await batch.commit();

    Swal.fire("Pagos eliminados", "", "success");
  } catch (error) {
    console.error(error);
  } finally {
    setLoading(false);
  }
};


//reabrir grupo
// const reopenGroup = async () => {
//   const ref = doc(db, "groups", groupId);

//   await updateDoc(ref, {
//     status: "open",
//   });

//   setGroup(prev => ({ ...prev, status: "open" }));

//   Swal.fire("Grupo reabierto 🔓");
// };

//cerrar cuentas
// const closeGroupAccounts = async () => {
//   const ref = doc(db, "groups", groupId);
//   const debtsCol = collection(db, "groups", groupId, "debts");

//   const { deudas } = calculateDebts(people, expenses);

//   const oldDebts = await getDocs(debtsCol);

//   const batch = writeBatch(db);

//   // 🔥 borrar espejo anterior
//   oldDebts.forEach(d => batch.delete(d.ref));

//   // 🔒 guardar nuevo espejo
//   deudas.forEach(d => {
//     const debtRef = doc(debtsCol);
//     batch.set(debtRef, d);
//   });

//   batch.update(ref, { status: "closed" });
//   await batch.commit();

//   setGroup(prev => ({ ...prev, status: "closed" }));
//   Swal.fire("Cuentas cerradas ✅");
// };


// const canCloseAccounts = !group?.adminUid;

  // Salir del grupo
const exitGroup = async () => {
  const result = await Swal.fire({
    title: "Salir del grupo",
    text: "¿Estás seguro que querés salir del grupo actual?",
    icon: "question",
    iconColor:"#269181",
    showCancelButton: true,
    confirmButtonText: "Salir del grupo",
    cancelButtonText: "Cerrar",
    confirmButtonColor: "#35b67e",
    background: "#dee0e0",
    color: "#283655",
  });

  if (!result.isConfirmed) return;
  Swal.fire({
          title: "Saliendo del grupo...",
          allowOutsideClick: false,
          allowEscapeKey: false,
          background: "#dee0e0",
          color:"#283655",
          iconColor:"#269181",
          confirmButtonColor:"#35b67e",
          didOpen: () => {
            Swal.showLoading();
          },
        });

  localStorage.removeItem("groupId");
  setGroupId(null);
  setPeople([]);
  setExpenses([]);

  Swal.fire({
    title: "Saliste del grupo",
    icon: "success",
    timer: 1200,
    iconColor:"#269181",
    showConfirmButton: false,
    background: "#dee0e0",
    color: "#283655",
  });
};

  // const exitGroup = () => {
  //   localStorage.removeItem("groupId");
  //   setGroupId(null);
  //   setPeople([]);
  //   setExpenses([]);
  // };

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
      user={user}
  onGroupCreated={({ groupId, groupName, hasAdmin }) => {
    setGroupId(groupId);
    setGroupName(groupName);
  }}
/>
    </div>
  );
}

// {loading && (
//   <div className="global-loader">
//     <div className="spinner"></div>
//   </div>
// )}

  return (
    <div className="app">
      <img src="logo.png" alt="Cuentas Claras" className="Create" />
      <p>La manera más fácil de compartir gastos</p>
<h1 className="group-title">{groupName}</h1>
<p className="group-code">
  <strong>{groupCode}</strong>
</p>
{group?.adminUid && (
  <p className="admin-label">
    Administrador: <strong>{group.adminName}</strong>
    {isAdmin && " (vos)"}
  </p>
)}
{/* <div>
{!isAdmin && group?.adminPin && (

  <button
    className="boton"
    onClick={handleAdminPinLogin}
  >Ser administrador
  </button>
)}</div> */}
{/* <div>
      <button className="exit-btn" onClick={exitGroup}>
        Salir <i className="fa fa-sign-out" aria-hidden="true"></i>
      </button>
</div> */}

      <AddPerson
        people={people}
        addPersonToDB={addPersonToDB}
        deletePerson={deletePersonAndExpenses}
        editPersonInDB={editPersonInDB}
        group={group}
        isAdminMode={isAdminMode}
        canEdit={canEdit}
      />

      <AddExpense
        people={people}
        expenses={expenses}
        addExpenseToDB={addExpenseToDB}
        deleteExpenseFromDB={deleteExpenseFromDB}
        deleteAllExpenses={deleteAllExpenses}
        group={group}
        isAdminMode={isAdminMode}
        canEdit={canEdit}
      />

      <BalanceList
      people={people}
      expenses={expenses}
      payments={payments}
      debts={debts}
      group={group}
      onPayDebt={addPayment}
      groupId={groupId}
      isAdminMode={isAdminMode}
      canEdit={canEdit}
      handleClearPayments={handleClearPayments}
      />


{groupId && (
  <div className="bottom-bar">


    <div className="bottom-icon" onClick={() => scrollToSection("section-people")}>
  <i className="fa-solid fa-person-circle-plus"></i>
  <small>Persona</small>
</div>

<div className="bottom-icon" onClick={() => scrollToSection("section-expense")}>
  <i className="fa-solid fa-circle-plus"></i>
  <small>Gasto</small>
</div>

<div className="bottom-icon" onClick={() => scrollToSection("section-balance")}>
  <i className="fa-solid fa-calculator"></i>
  <small>Balance</small>
</div>

{group?.adminUid && group.adminUid !== user?.uid && (
    <div className="bottom-icon" onClick={handleAdminPinLogin}>
      <i className="fa-solid fa-crown"></i>
      <small>Admin</small>
    </div>
  )}

  <div className="bottom-icon" onClick={exitGroup}>
      <i className="fa-solid fa-house"></i>
      <small>Inicio</small>
    </div>

    {canEdit && (
      <div className="bottom-icon" onClick={handleDeleteGroup}>
        <i className="fa-solid fa-trash-arrow-up"></i>
        <small>Grupo</small>
      </div>
     )}
  </div>

)}
  </div>
  );

}

export default App;









