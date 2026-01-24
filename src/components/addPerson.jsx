import { useState } from "react";
import Swal from "sweetalert2";

export default function AddPerson({
  people,
  addPersonToDB,
  deletePerson, 
}) {
  const [name, setName] = useState("");
  const [count, setCount] = useState(1);
  const [alias, setAlias] = useState("");

  const totalPersonas = people.reduce((acc, p) => acc + p.count, 0);
  const addPerson = () => {
    if (!name.trim())  return Swal.fire({
          icon: "warning",
          title: "Falta el nombre del participante",
          background: "#dee0e0",
          color:"#283655",
          iconColor:"#269181",
          confirmButtonColor:"#35b67e",
          confirmButtonText:"Cerrar",
        });
    if (count < 1) return Swal.fire({
          icon: "warning",
          title: "Cantidad inválida",
          background: "#dee0e0",
          color:"#283655",
          iconColor:"#269181",
          confirmButtonColor:"#35b67e",
          confirmButtonText:"Cerrar",
        });

    if (people.some(p => p.name === name.trim())) {
      return Swal.fire({
            icon: "warning",
            title: "Ya existe ese participante",
            background: "#dee0e0",
            color:"#283655",
            iconColor:"#269181",
            confirmButtonColor:"#35b67e",
            confirmButtonText:"Cerrar",
          });
    }

    addPersonToDB({
      name: name.trim(),
      count: Number(count),
      alias: alias.trim(),
    });

    setName("");
    setCount(1);
    setAlias("");
  };

  const handleDeletePerson = async (person) => {
  const result = await Swal.fire({
    title: "¿Seguro de eliminar participante?",
    text: "Se eliminará la persona y todos sus gastos",
    icon: "warning",
    showCancelButton: true,
    background: "#dee0e0",
    color:"#283655",
    iconColor:"#269181",
    confirmButtonColor:"#35b67e",
    confirmButtonText: "Eliminar",
    cancelButtonText: "Cancelar",
  });

  if (!result.isConfirmed) return;

  // 🔒 Loading bloqueante
  Swal.fire({
    title: "Eliminando participante...",
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
    await deletePerson(person);

    // ✅ Reemplaza el loading
    await Swal.fire({
      icon: "success",
      title: "Eliminado",
      text: "La persona y sus gastos fueron eliminados",
      background: "#dee0e0",
      color:"#283655",
      iconColor:"#269181",
      confirmButtonColor:"#35b67e",
      confirmButtonText:"Cerrar",
      allowOutsideClick: false,
    });
  } catch (error) {
    console.error("Error eliminando persona:", error);

    await Swal.fire({
      icon: "error",
      title: "Error",
      text: "No se pudo eliminar la persona",
      background: "#dee0e0",
      color:"#283655",
      iconColor:"#269181",
      confirmButtonColor:"#35b67e",
    });
  }
};








  // const handleDeletePerson = async (person) => {
  //   const result = await Swal.fire({
  //     title: "¿Seguro de eliminar participante?",
  //     text: "Se eliminará la persona y todos sus gastos",
  //     icon: "warning",
  //     showCancelButton: true,
  //     confirmButtonText: "Eliminar",
  //     cancelButtonText: "Cancelar",
  //   });
    
    

  //   if (!result.isConfirmed) return;
    
  //   Swal.fire({
  //   title: "Eliminando participante...",
  //   allowOutsideClick: false,
  //   allowEscapeKey: false,
  //   didOpen: () => {
  //     Swal.showLoading();
  //   },
  // });

  //   try {
  //     await deletePerson(person);

  //     Swal.fire(
  //       "Eliminado",
  //       "La persona y sus gastos fueron eliminados",        
    
  //     );
  //   } catch (error) {
  //     console.error("Error eliminando persona:", error);
  //     Swal.fire("Error", "No se pudo eliminar la persona", "error");
  //   }
  // };

const showPersonAlias = (person) => {
  Swal.fire({
    title: person.name,
    html: `
      <p><strong>Cantidad:</strong> ${person.count}</p>

      ${
        person.alias
          ? `
            <hr />
            <p><strong>Alias para recibir transferencias</strong></p>
            <p 
              id="copyAliasPerson"
              style="
                font-size:22px;
                cursor:pointer;
                color:#1976d2;
                user-select:all;
              "
            >
              ${person.alias}
            </p>
            <p style="font-size:12px;color:gray">
              Tocá el alias para copiarlo
            </p>
          `
          : `<p style="color:gray">Sin alias cargado</p>`
      }
    `,
    confirmButtonText: "Cerrar",
    background: "#dee0e0",
    color:"#283655",
    iconColor:"#269181",
    confirmButtonColor:"#35b67e",

    didOpen: () => {
      if (!person.alias) return;

      const aliasEl = document.getElementById("copyAliasPerson");

      aliasEl?.addEventListener("click", async () => {
        await navigator.clipboard.writeText(person.alias);

        Swal.fire({
          toast: true,
          position: "top",
          icon: "success",
          title: "Alias copiado",
          background: "#dee0e0",
          color:"#283655",
          iconColor:"#269181",
          confirmButtonColor:"#35b67e",
          showConfirmButton: false,
          timer: 1500,
        });
      });
    },
  });
};









// const showPersonAlias = (person) => {
//     Swal.fire({
//       title: person.name,
//       html: `
//         <p><strong>Cantidad:</strong> ${person.count}</p>

//         ${
//           person.alias
//             ? `
//               <hr />
//               <p><strong>Alias para recibir transferencias</strong></p>
//               <p style="font-size:22px">${person.alias}</p>
//               <p style="font-size:12px">Pagá con</p>
//               <img
//                 src="mp-logo.png"
//                 alt="Mercado Pago"
//                 id="openMPPerson"
//                 style="
//                   width: 34px;
//                   cursor: pointer;
//                   margin-top: 10px;
//                 "
//               />              
//             `
//             : `<p style="color:gray">Sin alias cargado</p>`
//         }
//       `,
//       confirmButtonText: "Cerrar",

//       didOpen: () => {
//   if (person.alias) {
//     const btn = document.getElementById("openMPPerson");
//     btn?.addEventListener("click", () => {
//       navigator.clipboard.writeText(person.alias);

//       const isAndroid = /Android/i.test(navigator.userAgent);

//       if (isAndroid) {
//         // 👉 Intent para Android
//         window.location.href =
//           "intent://#Intent;package=com.mercadopago.wallet;scheme=mercadopago;end";
//       } else {
//         // 👉 iOS o fallback
//         window.open("https://www.mercadopago.com.ar", "_blank");
//       }
//       // didOpen: () => {
//       //   if (person.alias) {
//       //     const btn = document.getElementById("openMPPerson");
//       //     btn?.addEventListener("click", () => {
//       //       navigator.clipboard.writeText(person.alias);
//       //       window.location.href = "mercadopago://";
//       //     });
//       //   }
//       // }
//     })
//   }
//      }
//     })
//   };


//   const showPersonAlias = (person) => {
//   Swal.fire({
//     title: person.name,
//     html: person.alias
//       ? `
//         <p><strong>Alias para recibir transferencias</strong></p>
//         <p style="font-size:16px">${person.alias}</p>
//       `
//       : `
//         <p style="color:gray">
//           Este participante no cargó alias
//         </p>
//       `,
//     confirmButtonText: "Cerrar",
//   });
// };


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
  <h3>Alias para transferencias</h3>
      <input
        type="text"
        placeholder="Opcional"
        value={alias}
        onChange={e => setAlias(e.target.value)}
      />
</div>
<div>
      <button className="boton" onClick={addPerson}>Agregar</button>
</div>
      <ul>
        {people.map(p => (
          <li key={p.id} className="people-item"><span
  className="expense-payer people-name"
  onClick={() => showPersonAlias(p)}
>
  {p.name} ({p.count})
</span>

            
            <button className="delete-btn" onClick={() => handleDeletePerson(p)}>
              <i className="fa-solid fa-trash"></i>
            </button>
          </li>
        ))}
      </ul>
      <p>Cantidad participantes:{totalPersonas}</p>
    </div>
  );
}










