// import { useState } from "react";
// import { db } from "../firebase";
// import {
//   doc,
//   getDoc,
//   setDoc,
//   serverTimestamp,
// } from "firebase/firestore";

// export default function CreateGroup({ onGroupCreated }) {
//   const [name, setName] = useState("");
//   const [code, setCode] = useState("");

//   const [joinName, setJoinName] = useState("");
//   const [joinCode, setJoinCode] = useState("");

//   const [showCreate, setShowCreate] = useState(false);

//   // 👉 Crear grupo
//   const createGroup = async () => {
//     if (!name.trim()) return alert("Falta el nombre del grupo");
//     if (!/^\d{6}$/.test(code)) {
//       return alert("El código debe tener 6 dígitos");
//     }

//     const groupId =
//       name.trim().toLowerCase().replace(/\s+/g, "-") + "_" + code;

//     const ref = doc(db, "groups", groupId);
//     const snap = await getDoc(ref);

//     if (snap.exists()) {
//       return alert("Ese grupo ya existe. Elegí otro código.");
//     }

//     await setDoc(ref, {
//       name: name.trim(),
//       code,
//       createdAt: serverTimestamp(),
//     });

//     onGroupCreated(groupId, name.trim());

//     setName("");
//     setCode("");
//     setJoinName("");
//     setJoinCode("");
//   };

//   // 👉 Entrar a grupo existente
//   const joinGroup = async () => {
//     if (!joinName.trim()) return alert("Falta el nombre del grupo");
//     if (!/^\d{6}$/.test(joinCode)) {
//       return alert("El código debe tener 6 dígitos");
//     }

//     const groupId =
//       joinName.trim().toLowerCase().replace(/\s+/g, "-") + "_" + joinCode;

//     const ref = doc(db, "groups", groupId);
//     const snap = await getDoc(ref);

//     if (!snap.exists()) {
//       return alert("No existe un grupo con esos datos");
//     }

//     onGroupCreated(groupId, joinName.trim());
//   };

//   return (
//     <div>
//     <div className="card">

//       {/* 🔹 ENTRAR A GRUPO */}
//       <h2>¿Ya tenés un grupo?</h2>
//       <h4>Ingresá acá</h4>

//       <div>
//         <input
//           placeholder="Nombre del grupo"
//           value={joinName}
//           onChange={(e) => setJoinName(e.target.value)}
//         />
//       </div>

//       <div>
//         <input
//           placeholder="Código (6 dígitos)"
//           value={joinCode}
//           maxLength={6}
//           onChange={(e) => setJoinCode(e.target.value)}
//         />
//       </div>

//       <div>
//         <button className="boton" onClick={joinGroup}>
//           Entrar al grupo
//         </button>
//       </div>

//       {/* 🔻 TOGGLE CREAR
//       <div
//         style={{
//           marginTop: "70px",
//           cursor: "pointer",
//           color: "#1976d2",
//           fontSize: "14px",
//           textAlign: "center",
//         }}
//         onClick={() => setShowCreate(!showCreate)}
//       >
//         {showCreate ? "✖ Cancelar" : "➕ Crear nuevo grupo"}
//       </div> */}

//       {/* 🔹 CREAR GRUPO */}
//       {showCreate && (
//         <>
//           <hr style={{ margin: "24px 0" }} />

//           <h2>Crear nuevo grupo</h2>
//           <h4>Completá estos datos</h4>

//           <div>
//             <input
//               placeholder="Nombre del grupo"
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//             />
//           </div>

//           <div>
//             <input
//               placeholder="Código (6 dígitos)"
//               value={code}
//               maxLength={6}
//               onChange={(e) => setCode(e.target.value)}
//             />
//           </div>

//           <div>
//             <button className="boton" onClick={createGroup}>
//               Crear grupo
//             </button>
//           </div>
//         </>
//       )}
//     </div> 
//     {/* 🔻 TOGGLE CREAR */}
//       <div
//         style={{
//           marginTop: "70px",
//           cursor: "pointer",
//           color: "#283655",
//           fontSize: "30px",
//           textAlign: "center",
//         }}
//         onClick={() => setShowCreate(!showCreate)}
//       ><div>Nuevo</div>
//         {showCreate ? "✖ Cancelar" : <i class="fa-solid fa-circle-plus"></i>}
//       </div>
//        </div>
//   );
// }



















import { useState } from "react";
import { db } from "../firebase";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function CreateGroup({ onGroupCreated }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");

  const [joinName, setJoinName] = useState("");
  const [joinCode, setJoinCode] = useState("");

  // Crear grupo
  const createGroup = async () => {
    if (!name.trim()) return alert("Falta el nombre del grupo");
    if (!/^\d{6}$/.test(code)) {
      return alert("El código debe tener 6 dígitos");
    }

    const groupId =
      name.trim().toLowerCase().replace(/\s+/g, "-") + "_" + code;

    const ref = doc(db, "groups", groupId);
    const snap = await getDoc(ref);

    if (snap.exists()) {
      return alert("Ese grupo ya existe. Elegí otro código.");
    }

    await setDoc(ref, {
      name: name.trim(),
      code,
      createdAt: serverTimestamp(),
    });

    onGroupCreated(groupId, name.trim());

    // onGroupCreated(groupId);
    setName("");
    setCode("");
    setJoinName("");
    setJoinCode("");   
  };

  // Entrar a grupo existente
  const joinGroup = async () => {
    if (!joinName.trim()) return alert("Falta el nombre del grupo");
    if (!/^\d{6}$/.test(joinCode)) {
      return alert("El código debe tener 6 dígitos");
    }

    const groupId =
      joinName.trim().toLowerCase().replace(/\s+/g, "-") + "_" + joinCode;

    const ref = doc(db, "groups", groupId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      return alert("No existe un grupo con esos datos");
    }
onGroupCreated(groupId, joinName.trim());

    // onGroupCreated(groupId);
  };

  return (
    <div className="card">
      {/* CREAR */}      
      <h2>Crear nuevo grupo</h2>
      <h4>Completá estos datos</h4>
      <div>
      <input
        placeholder="Nombre del grupo"
        value={name}
        onChange={(e) => setName(e.target.value)}
      />
</div>
<div>
      <input
        placeholder="Código (6 dígitos)"
        value={code}
        maxLength={6}
        onChange={(e) => setCode(e.target.value)}
      />
</div>
<div>
      <button className="boton" onClick={createGroup}>Crear grupo</button>
</div>
      <hr style={{ margin: "24px 0" }} />

      {/* ENTRAR */}
      <h2>Ya tenés un grupo?</h2>
      <h4>Ingresá acá</h4>
<div>
      <input
        placeholder="Nombre del grupo"
        value={joinName}
        onChange={(e) => setJoinName(e.target.value)}
      />
</div>
<div>
      <input
        placeholder="Código (6 dígitos)"
        value={joinCode}
        maxLength={6}
        onChange={(e) => setJoinCode(e.target.value)}
      />
</div>
<div>
      <button className="boton" onClick={joinGroup}>Entrar al grupo</button>
    </div>  
    </div>
  );
}





