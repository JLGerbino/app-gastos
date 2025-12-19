import { useState } from "react";
import Swal from "sweetalert2";

export default function AddPerson({
  people,
  addPersonToDB,
  deletePerson, // 👈 viene directo desde App
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
      count: Number(count),
    });

    setName("");
    setCount(1);
  };

  const handleDeletePerson = async (person) => {
    const result = await Swal.fire({
      title: "¿Seguro de eliminar participante?",
      text: "Se eliminará la persona y todos sus gastos",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Eliminar",
      cancelButtonText: "Cancelar",
    });

    if (!result.isConfirmed) return;

    try {
      await deletePerson(person);

      Swal.fire(
        "Eliminado",
        "La persona y sus gastos fueron eliminados",
        "success"
      );
    } catch (error) {
      console.error("Error eliminando persona:", error);
      Swal.fire("Error", "No se pudo eliminar la persona", "error");
    }
  };

  return (
    <div className="card">
      <h2>Agregar participantes</h2>
<div>
  <h3>Nombre</h3>
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={e => setName(e.target.value)}
      />
</div>
<div>
  <h3>Cantidad personas</h3>
      <input
        type="number"
        min={1}
        value={count}
        onChange={e => setCount(e.target.value)}
        placeholder="Cantidad de personas"
      />
</div>
<div>
      <button onClick={addPerson}>Agregar participante</button>
</div>
      <ul>
        {people.map(p => (
          <li key={p.id}>
            {p.name} ({p.count})
            <button onClick={() => handleDeletePerson(p)}>
              <i className="fa-solid fa-trash"></i>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}










// import { useState } from "react";
// import Swal from "sweetalert2";

// export default function AddPerson({
//   people,
//   addPersonToDB,
//   deletePersonFromDB,
//   deleteExpensesByPerson
// }) {
//   const [name, setName] = useState("");
//   const [count, setCount] = useState(1);

//   const addPerson = () => {
//     if (!name.trim()) return alert("Falta el nombre");
//     if (count < 1) return alert("Cantidad inválida");

//     if (people.some(p => p.name === name.trim())) {
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
//     if (!person?.id || !person?.name) {
//       console.error("Persona inválida:", person);
//       return;
//     }

//     const result = await Swal.fire({
//       title: "¿Seguro de eliminar participante?",
//       text: "Se eliminará la persona y todos sus gastos",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Eliminar",
//       cancelButtonText: "Cancelar"
//     });

//     if (!result.isConfirmed) return;

//     try {
//       // 🔥 BORRADO CORRECTO
//       await deletePersonFromDB(person.id);
//       await deleteExpensesByPerson(person.name);

//       await Swal.fire(
//         "Eliminado",
//         "La persona y sus gastos fueron eliminados",
//         "success"
//       );
//     } catch (error) {
//       console.error("Error eliminando persona:", error);

//       Swal.fire(
//         "Error",
//         "No se pudo eliminar la persona",
//         "error"
//       );
//     }
//   };

//   return (
//     <div className="card">
//       <h2>Ingresar participantes</h2>

//       <input
//         type="text"
//         placeholder="Nombre"
//         value={name}
//         onChange={e => setName(e.target.value)}
//       />

//       <input
//         type="number"
//         min={1}
//         value={count}
//         onChange={e => setCount(e.target.value)}
//         placeholder="Cantidad de personas"
//       />

//       <button onClick={addPerson}>Agregar participante</button>

//       <ul>
//         {people.map(p => (
//           <li key={p.id}>
//             {p.name} ({p.count})
//             <button onClick={() => deletePerson(p)}>
//               <i className="fa-solid fa-trash"></i>
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }








// import { useState } from "react";
// import Swal from "sweetalert2";

// export default function AddPerson({
//   people,
//   addPersonToDB,
//   deletePersonFromDB,
//   deleteExpensesByPerson
// }) {
//   const [name, setName] = useState("");
//   const [count, setCount] = useState(1);

//   const addPerson = () => {
//     if (!name.trim()) return alert("Falta el nombre");
//     if (count < 1) return alert("Cantidad inválida");

//     if (people.some(p => p.name === name.trim())) {
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
//     if (!person?.id || !person?.name) {
//       console.error("Persona inválida:", person);
//       return;
//     }

//     const result = await Swal.fire({
//       title: "¿Seguro de eliminar participante?",
//       text: "Se eliminará la persona y todos sus gastos",
//       icon: "warning",
//       showCancelButton: true,
//       confirmButtonText: "Eliminar",
//       cancelButtonText: "Cancelar"
//     });

//     if (!result.isConfirmed) return;

//     try {
//       // 🔥 BORRADO CORRECTO
//       await deletePersonFromDB(person.id);
//       await deleteExpensesByPerson(person.name);

//       await Swal.fire(
//         "Eliminado",
//         "La persona y sus gastos fueron eliminados",
//         "success"
//       );
//     } catch (error) {
//       console.error("Error eliminando persona:", error);

//       Swal.fire(
//         "Error",
//         "No se pudo eliminar la persona",
//         "error"
//       );
//     }
//   };

//   return (
//     <div className="card">
//       <h2>Ingresar participantes</h2>

//       <input
//         type="text"
//         placeholder="Nombre"
//         value={name}
//         onChange={e => setName(e.target.value)}
//       />

//       <input
//         type="number"
//         min={1}
//         value={count}
//         onChange={e => setCount(e.target.value)}
//         placeholder="Cantidad de personas"
//       />

//       <button onClick={addPerson}>Agregar participante</button>

//       <ul>
//         {people.map(p => (
//           <li key={p.id}>
//             {p.name} ({p.count})
//             <button onClick={() => deletePerson(p)}>
//               <i className="fa-solid fa-trash"></i>
//             </button>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }












// import { useState } from "react";
// import Swal from 'sweetalert2';

// export default function AddPerson({
//   groupId,
//   people,
//   addPersonToDB,
//   deletePersonFromDB,
//   deleteExpensesByPerson
// }) {
//   const [name, setName] = useState("");
//   const [count, setCount] = useState(1);

//   const addPerson = () => {
//     if (!name.trim()) return alert("Falta el nombre");
//     if (count < 1) return alert("Cantidad inválida");

//     if (people.some(p => p.name === name.trim())) {
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
//   console.log("🟥 Eliminando persona:", person);

//   if (!person?.id || !person?.name) {
//     console.error("❌ ERROR: persona sin id o name:", person);
//     return;
//   }

//   const result = await Swal.fire({
//     title: "¿Seguro de eliminar participante?",
//     text: "Se eliminará a la persona y todos sus gastos asociados",
//     icon: "warning",
//     showCancelButton: true,
//     confirmButtonColor: "#3085d6",
//     cancelButtonColor: "#d33",
//     confirmButtonText: "Eliminar",
//     cancelButtonText: "Cancelar",
//   });

//   // 👉 SOLO si confirma, se borra
//   if (!result.isConfirmed) return;

//   try {
//     // 1) Borrar la persona
//     await deletePersonFromDB(groupId, person.id);

//     // await deletePersonFromDB(person.id);

//     // 2) Borrar sus gastos asociados
//     await deleteExpensesByPerson(person.name);

//     await Swal.fire({
//       title: "Eliminado",
//       text: "La persona y sus gastos fueron eliminados correctamente",
//       icon: "success",
//     });
//   } catch (error) {
//     console.error("❌ Error eliminando persona:", error);

//     Swal.fire({
//       title: "Error",
//       text: "Ocurrió un problema al eliminar la persona",
//       icon: "error",
//     });
//   }
// };



//   // const deletePerson = async person => {
//   //   console.log("🟥 Eliminando persona:", person);

//   //   if (!person?.id || !person?.name) {
//   //     console.error("❌ ERROR: persona sin id o name:", person);
//   //     return;
//   //   }

//   //   // 1) Borrar la persona
//   //   await deletePersonFromDB(person.id);

//   //   // 2) Borrar sus gastos asociados
//   //   await deleteExpensesByPerson(person.name);
//   // };

//   return (
//     <div className="card">
//       <h2>Ingresar participantes</h2>
// <div>
//   <h3>Nombre</h3>
//       <input
//         type="text"
//         placeholder="Nombre"
//         value={name}
//         onChange={e => setName(e.target.value)}
//       />
// </div>
// <div>
//   <h3>Cantidad personas</h3>
//       <input
//         type="number"
//         value={count}
//         min={1}
//         onChange={e => setCount(e.target.value)}
//         placeholder="Cantidad"
//       />
// </div>
//       <button onClick={addPerson}>Agregar participante</button>

//       <ul>
//         {people.map(p => (
//           <li key={p.id}>
//             <span>{p.name} ({p.count})</span>
//             <span><button onClick={() => deletePerson(p)}><i className="fa-solid fa-trash"></i>
// </button></span>
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// }









