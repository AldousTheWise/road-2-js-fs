
import { saludar } from "../src/saludar.js";

test("Saludar devuelve el saludo correcto", () => { 
   expect(saludar("Aldo")).toBe("Hola, Aldo");
});

