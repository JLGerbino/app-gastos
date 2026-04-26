import i18n from "i18next";

const LanguageSelector = () => {
  const changeLang = (lang) => {
  i18n.changeLanguage(lang);
  localStorage.setItem("lang", lang);
};

  // const changeLang = (e) => {
  //   const lang = e.target.value;
  //   i18n.changeLanguage(lang);
  //   localStorage.setItem("lang", lang);
  // };

  return (
    <div style={{ marginBottom: "10px" }}>
  <button className="botonBandera" onClick={() => changeLang("es")}><img src="argentina.png" alt="bandera Argentina" className="bandera"/></button>
  <button className="botonBandera" onClick={() => changeLang("pt")}><img src="brasil.png" alt="bandera Brasil" className="bandera"/></button>
  <button className="botonBandera" onClick={() => changeLang("en")}><img src="estados-unidos.png" alt="bandera EEUU" className="bandera"/></button>
  <button className="botonBandera" onClick={() => changeLang("fr")}><img src="francia.png" alt="bandera Francia" className="bandera"/></button></div>
    // <div style={{ marginBottom: "10px" }}>
    //   <select onChange={changeLang} defaultValue={i18n.language}>
    //     <option value="es">🇪🇸 Español</option>
    //     <option value="en">🇺🇸 English</option>
    //     <option value="pt">🇧🇷 Português</option>
    //     <option value="fr">🇫🇷 Français</option>
    //   </select>
    // </div>
  );
};

export default LanguageSelector;