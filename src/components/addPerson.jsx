import { useState, useEffect } from "react";
import Swal from "sweetalert2";

export default function AddPerson({
  people,
  addPersonToDB,
  deletePerson,
  editPersonInDB,
  group,
  canEdit,
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
    title:  `¿Seguro de eliminar a ${person.name}?`,
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

    // Reemplaza el loading
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

const handleEditPerson = async (person) => {
  const result = await Swal.fire({
    title: "Editar participante",
    html: `
      <div
      style= "text-align: center;
             font-size: 26px;
             font-weight: 600;
             color: #35b67e;
             margin-bottom: 10px;">              
        ${person.name}
</div>
        
        <div>
        <input
          id="editCount"
          type="number"
          min="1"
          class="swal2-input"
          value="${person.count}"                        
        /></div><label>Cantidad de personas</label>        
        <div>        
        <input
          id="editAlias"
          class="swal2-input"
          value="${person.alias || ""}"          
        />
      </div><label>Alias opcional</label>
    `,
    showCancelButton: true,
    confirmButtonText: "Guardar",
    cancelButtonText: "Cancelar",
    background: "#dee0e0",
    color:"#283655",
    confirmButtonColor:"#35b67e",
    preConfirm: () => {
      const count = Number(
        document.getElementById("editCount").value
      );
      const alias = document
        .getElementById("editAlias")
        .value
        .trim();

      if (!count || count < 1) {
        Swal.showValidationMessage(
          "La cantidad debe ser mayor a 0"          
        );
        return;
      }

      return { count, alias };
    },
  });

  if (!result.isConfirmed) return;

  Swal.fire({
    title: "Guardando cambios...",
    allowOutsideClick: false,
    background: "#dee0e0",
    didOpen: () => Swal.showLoading(),
  });

  try {
    await editPersonInDB(person.id, result.value);

    Swal.fire({
      icon: "success",
      title: "Participante actualizado",
      timer: 1500,
      showConfirmButton: false,
      background: "#dee0e0",
    });
  } catch (error) {
    console.error(error);
    Swal.fire(
      "Error",
      "No se pudo actualizar el participante",
      "error"
    );
  }
};


  return (
    <div className="card" id="section-people">
      <h2  className="titulo">Agregar participantes</h2>
<div>
  <h3>Nombre</h3>
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={e => setName(e.target.value)}
        disabled={!canEdit}
      />
</div>
<div>
  <h3>Cantidad de personas a cargo</h3>
      <input
        type="number"
        min={1}
        value={count}
        onChange={e => setCount(e.target.value)}
        placeholder="Cantidad de personas"
        disabled={!canEdit}
      />
</div>
<div>
  <h3>Alias para transferencias</h3>
      <input
        type="text"
        placeholder="Opcional"
        value={alias}
        onChange={e => setAlias(e.target.value)}
        disabled={!canEdit}
      />
</div>
<div>
{canEdit && (
      <button className="boton" onClick={addPerson}>Agregar</button>)}
</div>
<h3>Participantes</h3>

      <ul>
        {people.map(p => (
          
          <li key={p.id} className="people-item"><span> {canEdit && (<button onClick={() => handleEditPerson(p)}> <i className="fa-solid fa-pencil edit-icon"
      
    ></i></button>)}</span><span
  className="expense-payer people-name"
  onClick={() => showPersonAlias(p)}
>
  {p.name} ({p.count})
</span>

            
            {canEdit && (<button className="delete-btn" onClick={() => handleDeletePerson(p)}>
              <i className="fa-solid fa-trash"></i>
            </button>)}
          </li>
        ))}
      </ul>
      <p>Total de personas:{totalPersonas}</p>
    </div>
  );
}










