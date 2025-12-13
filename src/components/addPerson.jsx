import { useState } from "react";

export default function AddPerson({
  people,
  addPersonToDB,
  deletePersonFromDB,
  deleteExpensesByPerson
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
      count: parseInt(count)
    });

    setName("");
    setCount(1);
  };

  const deletePerson = async person => {
    console.log("🟥 Eliminando persona:", person);

    if (!person?.id || !person?.name) {
      console.error("❌ ERROR: persona sin id o name:", person);
      return;
    }

    // 1) Borrar la persona
    await deletePersonFromDB(person.id);

    // 2) Borrar sus gastos asociados
    await deleteExpensesByPerson(person.name);
  };

  return (
    <div className="card">
      <h2>Ingresar participantes</h2>
<div>
  <h4>Nombre</h4>
      <input
        type="text"
        placeholder="Nombre"
        value={name}
        onChange={e => setName(e.target.value)}
      />
</div>
<div>
  <h4>Cantidad personas</h4>
      <input
        type="number"
        value={count}
        min={1}
        onChange={e => setCount(e.target.value)}
        placeholder="Cantidad"
      />
</div>
      <button onClick={addPerson}>Agregar participante</button>

      <ul>
        {people.map(p => (
          <li key={p.id}>
            {p.name} ({p.count})
            <button onClick={() => deletePerson(p)}>🗑️</button>
          </li>
        ))}
      </ul>
    </div>
  );
}









