import { useState } from "react";
import Swal from "sweetalert2";

export default function AddPerson({
  people,
  addPersonToDB,
  deletePerson, 
}) {
  const [name, setName] = useState("");
  const [count, setCount] = useState(1);
  const totalPersonas = people.reduce((acc, p) => acc + p.count, 0);
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
      <button className="boton" onClick={addPerson}>Agregar</button>
</div>
      <ul>
        {people.map(p => (
          <li key={p.id} className="people-item"><span className="people-name">
            {p.name} ({p.count})</span>
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










