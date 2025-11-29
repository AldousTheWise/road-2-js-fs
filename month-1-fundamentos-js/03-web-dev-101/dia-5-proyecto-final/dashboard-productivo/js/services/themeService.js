/* =====================================
    
    themeService.js
    Manejo del modo claro/oscuro
   ===================================== */

export class ThemeService {
  constructor(storage) {
    this.storage = storage;
    this.isDark = storage.get("isDark", false);
  }

  apply() {}
  toggle() {}
}
