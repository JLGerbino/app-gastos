import { useState, useEffect } from "react";
import { db } from "../firebase";
import Swal from "sweetalert2";
import {
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";

export default function CreateGroup({ onGroupCreated, user }) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [joinName, setJoinName] = useState("");
  const [joinCode, setJoinCode] = useState("");
  const [showCreate, setShowCreate] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [adminName, setAdminName] = useState("");
  const [adminPin, setAdminPin] = useState("");



  useEffect(() => {
  document.body.style.overflow = showCreate ? "hidden" : "auto";

  return () => {
    document.body.style.overflow = "auto";
  };
}, [showCreate]);





  //  useEffect(() => {
//   if (showCreate) {
//     document.body.style.overflow = "hidden";
//   } else {
//     document.body.style.overflow = "auto";
//   }
// }, [showCreate]);


  const closeCreateModal = () => {
    
    setShowCreate(false);
    setName("");
    setCode("");
    setIsAdmin("");
    setAdminName(""); 
    setAdminPin("");

  };

  // 👉 Crear grupo
  const createGroup = async () => {
    if (!name.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Falta el nombre del grupo",
        background: "#dee0e0",
        color:"#283655",
        iconColor:"#269181",
        confirmButtonColor:"#35b67e",
        confirmButtonText:"Cerrar",
      });
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      Swal.fire({
        icon: "warning",
        title: "El código debe tener 6 dígitos",
        background: "#dee0e0",
        color:"#283655",
        iconColor:"#269181",
        confirmButtonColor:"#35b67e",
        confirmButtonText:"Cerrar",
      });
      return;
    }

    const groupId =
      name.trim().toLowerCase().replace(/\s+/g, "-") + "_" + code;

    const ref = doc(db, "groups", groupId);
    const snap = await getDoc(ref);

    if (snap.exists()) {
  closeCreateModal();
  document.activeElement?.blur();
  Swal.fire({
    title: "Ya existe un grupo con ese nombre o código",
    text: "Elegí otro nombre o código",
    icon: "error",
    background: "#dee0e0",
          color:"#283655",
          iconColor:"#269181",
          confirmButtonColor:"#35b67e",
          confirmButtonText:"Cerrar",
          className:"swal-container",
  });
    
      return;
    }
if (isAdmin && !adminName.trim()) {
  Swal.fire({
    icon: "warning",
    title: "Ingresá el nombre del administrador",
    background: "#dee0e0",
    color:"#283655",
    iconColor:"#269181",
    confirmButtonColor:"#35b67e",
    confirmButtonText:"Cerrar",
  });
  return;
}
if (isAdmin) {
  if (!adminName.trim()) {
   
    return;
  }

  if (!/^\d{4}$/.test(adminPin)) {
     Swal.fire({
      icon: "warning",
      title: "El PIN debe tener 4 números",
      background: "#dee0e0",
          color:"#283655",
          iconColor:"#269181",
          confirmButtonColor:"#35b67e",
          confirmButtonText:"Cerrar",
    });
    
    return;
  }
}
    await setDoc(ref, {
      name: name.trim(),
      code,
      createdAt: serverTimestamp(),
      status: "open",
      adminUid: isAdmin ? user.uid : null,
      adminName: isAdmin ? adminName.trim() : null,
      adminPin: isAdmin ? adminPin : null,
    });


onGroupCreated({
  groupId,
  groupName: name.trim(),
  hasAdmin: isAdmin,
});    

    setName("");
    setCode("");
    setJoinName("");
    setJoinCode("");
    setShowCreate(false);
  };

  // 👉 Entrar a grupo existente
  const joinGroup = async () => {
    if (!joinName.trim()) {
      Swal.fire({
      icon: "warning",
      title: "Falta el nombre del grupo",
      background: "#dee0e0",
          color:"#283655",
          iconColor:"#269181",
          confirmButtonColor:"#35b67e",
          confirmButtonText:"Cerrar",
    });
      return;
    }

    if (!/^\d{6}$/.test(joinCode)) {
      Swal.fire({
      icon: "warning",
      title: "El código debe tener 6 dígitos",
      background: "#dee0e0",
          color:"#283655",
          iconColor:"#269181",
          confirmButtonColor:"#35b67e",
          confirmButtonText:"Cerrar",
    });
      return;
    }

    const groupId =
      joinName.trim().toLowerCase().replace(/\s+/g, "-") +
      "_" +
      joinCode;

    const ref = doc(db, "groups", groupId);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      Swal.fire({      
      title: "No existe un grupo con esos datos",
      background: "#dee0e0",
          color:"#283655",
          iconColor:"#269181",
          confirmButtonColor:"#35b67e",
          confirmButtonText:"Cerrar",
    });
      
      return;
    }

    onGroupCreated({
  groupId,
  groupName: snap.data().name,
  hasAdmin: !!snap.data().adminUid,
});
    
  };

  


  return (
    <div>
      <div className="card">
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
        <button className="boton" onClick={joinGroup}>
          Entrar al grupo
        </button>

        {showCreate && (
          <div className="modal-overlay"onClick={closeCreateModal}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <button
                className="modal-close"
                onClick={closeCreateModal}
              >
                
              <i className="fa-solid fa-x"></i>               
              </button>

              <h2>Crear nuevo grupo</h2>

              <input
                placeholder="Nombre del grupo"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                placeholder="Código (6 dígitos)"
                value={code}
                maxLength={6}
                onChange={(e) => setCode(e.target.value)}
              />
<div>
              <label>
                <input
                  className="checkbox"
                  type="checkbox"
                  checked={isAdmin}                  
                     onChange={(e) => {
  const checked = e.target.checked;
  setIsAdmin(checked);

  if (!checked) {
    setAdminName("");
  }
}}
                />
                Quiero ser administrador del grupo
              </label></div>
              {isAdmin && (
  <div>
  <input
    type="text"
    placeholder="Nombre del administrador"
    value={adminName}
    onChange={(e) => setAdminName(e.target.value)}
    className="input"   
  />
  <input
  type="password"
  placeholder="PIN de 4 dígitos"
  maxLength={4}
  value={adminPin}
  onChange={(e) => setAdminPin(e.target.value)}
  className="input"
/>
<p>Guardá este PIN. Lo vas a necesitar para recuperar el rol.</p>

  <p>Solo vos vas a poder agregar, editar</p>
  <p>y eliminar personas y gastos</p>
  </div>
  
)}

              <button className="boton" onClick={createGroup}>
                Crear grupo
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="nuevo-grupo-container">
        <h2 className="grupo">Nuevo grupo</h2>
        <div
          onClick={() => setShowCreate(true)}
          className="nuevo nuevo-grupo"
        >
          <i className="fa-solid fa-circle-plus"></i>
        </div>
      </div>
    </div>
  );
}






