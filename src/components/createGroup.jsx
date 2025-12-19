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

  // 🆕 CREAR GRUPO
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

    onGroupCreated(groupId);
    setName("");
    setCode("");
    setJoinName("");
    setJoinCode("");   
  };

  // 🔑 ENTRAR A GRUPO EXISTENTE
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

    onGroupCreated(groupId);
  };

  return (
    <div className="card">
      {/* 🆕 CREAR */}      
      <h2>Crear nuevo grupo?</h2>
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
      <button onClick={createGroup}>Crear grupo</button>
</div>
      <hr style={{ margin: "24px 0" }} />

      {/* 🔑 ENTRAR */}
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
      <button onClick={joinGroup}>Entrar al grupo</button>
    </div>  
    </div>
  );
}





// import { useState } from "react";
// import { db } from "../firebase";
// import { addDoc, collection, doc, getDoc } from "firebase/firestore";
// import Swal from "sweetalert2";

// export default function CreateGroup({ onGroupCreated }) {
//   const [existingGroupId, setExistingGroupId] = useState("");

//   // 🆕 Crear grupo
//   const createGroup = async () => {
//     try {
//       const docRef = await addDoc(collection(db, "groups"), {
//         createdAt: Date.now(),
//       });

//       Swal.fire(
//         "Grupo creado",
//         `Tu código de grupo es: ${docRef.id}`,
//         "success"
//       );

//       onGroupCreated(docRef.id);
//     } catch (error) {
//       console.error(error);
//       Swal.fire("Error", "No se pudo crear el grupo", "error");
//     }
//   };

//   // 🔑 Entrar a grupo existente
//   const enterGroup = async () => {
//     if (!existingGroupId.trim()) return;

//     try {
//       const ref = doc(db, "groups", existingGroupId.trim());
//       const snap = await getDoc(ref);

//       if (!snap.exists()) {
//         return Swal.fire(
//           "Grupo no encontrado",
//           "El código ingresado no existe",
//           "error"
//         );
//       }

//       onGroupCreated(existingGroupId.trim());
//     } catch (error) {
//       console.error(error);
//       Swal.fire("Error", "No se pudo ingresar al grupo", "error");
//     }
//   };

//   return (
//     <div className="card">
//       <h2>Crear grupo</h2>
//       <button onClick={createGroup}>Crear nuevo grupo</button>

//       <hr />

//       <h3>¿Ya tenés un grupo?</h3>
//       <input
//         type="text"
//         placeholder="Ingresá el código del grupo"
//         value={existingGroupId}
//         onChange={(e) => setExistingGroupId(e.target.value)}
//       />
//       <button onClick={enterGroup}>Entrar al grupo</button>
//     </div>
//   );
// }



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

//     onGroupCreated(groupId);
//   };

//   return (
//     <div className="card">
//       <h2>🆕 Crear grupo</h2>

//       <input
//         placeholder="Nombre del grupo"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />

//       <input
//         placeholder="Código (6 dígitos)"
//         value={code}
//         maxLength={6}
//         onChange={(e) => setCode(e.target.value)}
//       />

//       <button onClick={createGroup}>Crear grupo</button>
//     </div>
//   );
// }
