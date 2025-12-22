/* ==================================
    main.js
    Punto de entrada de la app
   ================================== */

import App from "./app.js";
import { notify } from "./utils/notify.js";

window.notify = notify;

const app = new App();
app.init();
