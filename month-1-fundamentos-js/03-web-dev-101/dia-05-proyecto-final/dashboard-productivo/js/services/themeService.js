/* =====================================
    
    themeService.js
    Manejo del modo claro/oscuro
   ===================================== */

export class ThemeService {
  constructor(storage) {
    this.storage = storage;
    this.isDark = storage.get("isDark", false);
  }

  apply() {
    document.documentElement.setAttribute(
      "data-theme",
      this.isDark ? "dark" : "light"
    );
  }

  toggle() {
    this.isDark = !this.isDark;
    this.storage.set("isDark", this.isDark);
    this.apply();
  }
}
