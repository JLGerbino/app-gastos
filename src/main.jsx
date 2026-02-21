import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './App.css'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)



//este ando pero tiene unos agregados
// const showDebtModal = (deuda) => {
//   const person = people.find(p => p.name === deuda.to);
//   const alias = person?.alias;

//   Swal.fire({
//     title: "Deuda",    
//     html: `
//       <div style="font-size:26px; line-height:1.5; ">
//         <strong style="color: green">${deuda.from}</strong> debe
//       </div> 
//       <br />       
//       <div style="font-size:30px; line-height:1.5;">
//         <strong>$${deuda.amount.toFixed(2)}</strong>
//       </div>
//       <br />
//       <div style="font-size:27px; line-height:1.5;">
//         a <strong style="color: green">${deuda.to}</strong>
//       </div>

//       ${
//         alias
//           ? `
//             <hr />
//             <div>
//               Alias de ${deuda.to}: <div
//               id="copyAliasPerson"
//               style="
//                 margin-top: 12px;
//                 font-size: 22px;
//                 cursor:pointer;
//                 color:#1976d2;
//                 cursor: pointer;                
//               "
//             ><strong>${alias}</strong></div>
//               <br />
//               <span style="font-size:12px">Tocá el alias para copiarlo</span>
//             </div>
//           `
//           : ""
//       }
//     `,
//     background: "#dee0e0",
//     color: "#283655",
//     iconColor: "#269181",
//     confirmButtonColor: "#35b67e",
//     //confirmButtonText: "Marcar como pagado",//agregado para pagos
//     confirmButtonText: "Cerrar",
//     allowOutsideClick: true,

//     didOpen: () => {
//       if (!alias) return;

//       const aliasEl = document.getElementById("copyAliasPerson");

//       aliasEl?.addEventListener("click", async () => {
//         await navigator.clipboard.writeText(alias);

//         Swal.fire({
//           toast: true,
//           position: "top",
//           icon: "success",
//           title: "Alias copiado",
//           background: "#dee0e0",
//           color: "#283655",
//           iconColor: "#269181",
//           showConfirmButton: false,
//           timer: 1500,
//         });
//       });
//     },
//   });
// };


