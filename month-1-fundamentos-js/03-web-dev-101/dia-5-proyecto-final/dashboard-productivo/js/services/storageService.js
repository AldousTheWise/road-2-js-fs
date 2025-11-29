/* =====================================
    
    storageService.js
    Servicio de persistencia simple con 
    localStorage
   ===================================== */

export const storageService = {
  get(key, defaultValue = null) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (e) {
      console.error("Error al leer localStorage:", e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error("Error al guardar en localStorage:", e);
    }
  },
};
