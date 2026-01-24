import { useState } from "react";
import { db } from "../firebase";
import Swal from "sweetalert2";
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
  const [showCreate, setShowCreate] = useState(false);
  const closeCreateModal = () => {
    setShowCreate(false);
    setName("");
    setCode("");
};

  // 👉 Crear grupo
  const createGroup = async () => {         
     if (!name.trim()) {
    Swal.fire({
      icon: "warning",
      title: "Falta el nombre del grupo",     
    });
    return;
  }
    if (!/^\d{6}$/.test(code)) {
        Swal.fire({
      icon: "warning",
      title: "El código debe tener 6 digitos",     
    });
    return;      
    }

    const groupId =
      name.trim().toLowerCase().replace(/\s+/g, "-") + "_" + code;

    const ref = doc(db, "groups", groupId);
    const snap = await getDoc(ref);

    if (snap.exists()) {
        Swal.fire({
      icon: "warning",
      title: "Ese grupo ya existe.", 
      text: "Elegí otro código.",     
    });
    return;      
    }

    await setDoc(ref, {
      name: name.trim(),
      code,
      createdAt: serverTimestamp(),
    });

    onGroupCreated(groupId, name.trim());

    setName("");
    setCode("");
    setJoinName("");
    setJoinCode("");
  };

  // 👉 Entrar a grupo existente
  const joinGroup = async () => {    
     if (!joinName.trim()) {
    Swal.fire({
      icon: "warning",
      title: "Falta el nombre del grupo",      
    });
    return;
  }
    if (!/^\d{6}$/.test(joinCode)) {
       Swal.fire({
      icon: "warning",
      title: "El código debe tener 6 digitos",     
    });
    return;      
    }

    const groupId =
      joinName.trim().toLowerCase().replace(/\s+/g, "-") + "_" + joinCode;

    const ref = doc(db, "groups", groupId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
        Swal.fire({
      icon: "warning",
      title: "No existe un grupo con esos datos",     
    });
    return;      
    }

    onGroupCreated(groupId, joinName.trim());    
  };

  return (
    <div>
    <div className="card">

      {/* 🔹 ENTRAR A GRUPO */}
      <h2>¿Ya tenés un grupo?</h2>
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
        <button className="boton" onClick={joinGroup}>
          Entrar al grupo
        </button>
      </div>
      {showCreate && (
  <div className="modal-overlay"
  >
    <div className="modal"
    onClick={(e) => e.stopPropagation()}>

      <button
        className="modal-close"
        onClick={closeCreateModal}        
      >
        ✖
      </button>

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
      <button className="boton" onClick={createGroup}>
        Crear grupo
      </button>
    </div>
  </div>
)}
    </div> 
    
    
  <h2 className="grupo">Nuevo grupo</h2>
<div onClick={() => setShowCreate(true)} className=" nuevo nuevo-grupo">  
    <i className="fa-solid fa-circle-plus"></i>  
</div>
       </div>
       
  );
}



















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

//   Crear grupo
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

//     onGroupCreated(groupId);
//     setName("");
//     setCode("");
//     setJoinName("");
//     setJoinCode("");   
//   };

//   Entrar a grupo existente
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
// onGroupCreated(groupId, joinName.trim());

//     onGroupCreated(groupId);
//   };

//   return (
//     <div className="card">
//       {/* CREAR */}      
//       <h2>Crear nuevo grupo</h2>
//       <h4>Completá estos datos</h4>
//       <div>
//       <input
//         placeholder="Nombre del grupo"
//         value={name}
//         onChange={(e) => setName(e.target.value)}
//       />
// </div>
// <div>
//       <input
//         placeholder="Código (6 dígitos)"
//         value={code}
//         maxLength={6}
//         onChange={(e) => setCode(e.target.value)}
//       />
// </div>
// <div>
//       <button className="boton" onClick={createGroup}>Crear grupo</button>
// </div>
//       <hr style={{ margin: "24px 0" }} />

//       {/* ENTRAR */}
//       <h2>Ya tenés un grupo?</h2>
//       <h4>Ingresá acá</h4>
// <div>
//       <input
//         placeholder="Nombre del grupo"
//         value={joinName}
//         onChange={(e) => setJoinName(e.target.value)}
//       />
// </div>
// <div>
//       <input
//         placeholder="Código (6 dígitos)"
//         value={joinCode}
//         maxLength={6}
//         onChange={(e) => setJoinCode(e.target.value)}
//       />
// </div>
// <div>
//       <button className="boton" onClick={joinGroup}>Entrar al grupo</button>
//     </div>  
//     </div>
//   );
// }





