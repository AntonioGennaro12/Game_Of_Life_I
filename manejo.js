// Configuración 
// Tablero 
const juegoTablero  = document.querySelector("#juego-tablero");
const defTablero    = document.querySelector("#def-tablero");
const misFilas      = document.querySelector("#filas");
const misColumnas   = document.querySelector("#columnas"); 
const misPueblos    = document.querySelector("#peoples"); 
const miAlgoritmo   = document.querySelector("#opt_alg")
// Algoritmo Custom 
const defCustom     = document.querySelector("#def-custom");
const minKeepAlive  = document.querySelector("#min-alive");
const maxKeepAlive  = document.querySelector("#max-alive");
const goAlive1      = document.querySelector("#go-alive1");
const goAlive2      = document.querySelector("#go-alive2");
//
// BOTÓN Único (2 instancias)
const botonTablero  = document.querySelector("#bot-tablero");
const botonGame     = document.querySelector("#bot-game");
// Tablero
const miTablero     = document.querySelector("#mi-tablero");
// Canvas
const miCanvas      = document.querySelector("canvas");
//
// HELP
const popup         = document.getElementById('popup');
const closePopup    = document.getElementById('close-popup');

////////// TIPO DE DISPOSITIVO Y SISTEMA OPERATIVO
/**
 * Obtiene el tipo de dispositivo 
 * @returns Tipo de dispositivo
 */
function detectDeviceType() {
    const userAgent = navigator.userAgent;
    if (/Android/i.test(userAgent)) {
        return 'Android';
    } else if (/iPad|iPhone|iPod/i.test(userAgent)) {
        return 'iOS';
    } else if (/Windows|Macintosh|Linux/i.test(userAgent)) {
        return 'Computadora';
    } else if (/Tablet/i.test(userAgent)) {
        return 'Tablet';
    } else if (/Mobile/i.test(userAgent)) {
        return 'Movil';
    } else {
        return 'Desconocido';
    }
}
// Detectar el sistema operativo
/**
 * Lee el Sistema Operativo
 * @returns Sitema Operativo
 */
function detectOS() {
    const userAgent = navigator.userAgent;
    if (/Android/i.test(userAgent)) {
        return 'Android';
    } else if (/iPad|iPhone|iPod/i.test(userAgent)) {
        return 'iOS';
    } else if (/Windows/i.test(userAgent)) {
        return 'Windows';
    } else if (/Macintosh/i.test(userAgent)) {
        return 'Macintosh';
    } else if (/Linux/i.test(userAgent)) {
        return 'Linux';
    } else {
        return 'Desconocido';
    }
}
// Carga el tipo de dispositivo
let deviceType = detectDeviceType();
console.log('Dispositivo:', deviceType);
// Carga el sistema operativo
let operatingSystem = detectOS();
console.log('Sistema Operativo:', operatingSystem);
// Toma ancho y alto disponible
let limiteX         = window.innerWidth;
let limiteY         = window.innerHeight;
//if (limiteX > 1000 ) { juegoTablero.style.width = 800 + "px"; }
//else { juegoTablero.style.width = (limiteX*0.98) + "px"; }
//////////
let gameRunning     = false;
//
const ANCHO_MIN     = 320;
const MAX_FILAS     = 50;
const MAX_COLUMNAS  = 100;
const MAX_CASILLAS  = MAX_FILAS*MAX_COLUMNAS;
//
const ALTO_TABLERO  = 20;
const ANCHO_TABLERO = 40;
misFilas.value      = ALTO_TABLERO;
misColumnas.value   = ANCHO_TABLERO;
misPueblos.value    = 1;
// 
// Algoritmo
const STD_23_3      = 1; // Standard
const HD_23_36      = 2; // High Density idem std + un adicional cuando vecinos = 6
const HD1_12_2      = 3;
const LD1_34_4      = 4;
const LD2_45_5      = 5;
const LD3_56_6      = 6;
const LD4_67_7      = 7;
const USER_DEF      = 8;
const TAB_VACIO     = 9;
let algoritmos      = ["STD_23_3", "HD_23_36", "HD1_12_2", "LD1_34_4",
                       "LD2_45_5", "LD3_56_6", "LD4_67_7", "USER_DEF" ];
// 
let filasTablero    = ALTO_TABLERO;
let colTablero      = ANCHO_TABLERO;
let nroPueblos      = 1;
let algoritmoJgo    = STD_23_3;
// Parámetros algoritmo
let minAlive        = 2;  // Si está vivo, menor que este valor muere
let maxAlive        = 3;  // Si esta vivo, Mayor que este valor muere
let newLive1        = 3;  // si está muerto, igual a este valor renace
let newLive2        = 3;  // Adicional: si esta muerto igual a este valor renace tambien
// Tamaños
let anchoTabla      = 0;
let altoCelda       = 0;
let anchoCelda      = 0;
let tamCelda        = 0;
//
let nroOrdenes      = 1;  // por defecto 1
//
let customRunning   = false;
let gameActive      = false; 
let reiniciar       = false;
let newConfig       = false;
//
initBase();
//
// FUNCIONES 
//
// HELP
// Abre la ventana emergente
function clickHelp() {
    popup.style.display = 'block';
}
// Cierra la ventana emergente
closePopup.addEventListener('click', () => {
    popup.style.display = 'none';
});
/**
 * Inicialización de base
 */
function initBase() {
    miCanvas.style.display = "none";
    defTablero.style.display = "flex";
    defCustom.style.display = "none";
    botonTablero.style.backgroundColor = "lightgreen";
    botonTablero.textContent = "Datos básicos: Click para confirmar y ARMAR TABLERO";
    botonTablero.style.display = "block";
    botonGame.style.display = "none";
    customRunning = false;
    newConfig     = false;
}
/**
 * Evalúa Datos básicos
 * @returns True (OK) False (ERROR)
 */
function evalBasicData() {
if (( (((filasTablero = parseInt(misFilas.value))    <  5 ) || (filasTablero > 50 ))  ||
      (((colTablero = parseInt(misColumnas.value))   < 10 ) || (colTablero  > 100 ))) ||
      ((((nroPueblos = parseInt(misPueblos.value))    <  1 ) || (nroPueblos   > 6 ))   ||
       (((algoritmoJgo = parseInt(miAlgoritmo.value)) <  1 ) || (algoritmoJgo > 9 ))) ) {
          botonTablero.textContent = "Algunos valores no están permitidos, revisar datos y ARMAR TABLERO";
          botonTablero.style.backgroundColor = "lightsalmon"; 
          customRunning = false;
          console.log("basicos mal cargado");
          return (false);
        }
        else { return (true);}
    }
/**
 * Evalúa datos Custom
 * @returns True (OK) or False (ERROR) 
 */
function evalCustomData() {
    if (((((minAlive = parseInt(minKeepAlive.value)) < 1 ) || (minAlive > 8 )) ||
         (((maxAlive = parseInt(maxKeepAlive.value)) < 1 ) || (maxAlive > 8 )))||
        ((((newLive1 = parseInt(goAlive1.value))     < 1 ) || (newLive1 > 8 )) ||
         (((newLive2 = parseInt(goAlive2.value))     < 1 ) || (newLive2 > 8 ))) ) {
        botonTablero.textContent = "Valores permitidos entre 1 y 8, revisar datos y ARMAR TABLERO";
        botonTablero.style.backgroundColor = "salmon"; 
        customRunning = true;
        console.log("custom mal cargado");
        return (false);
    }
    else { return (true); }
}
/**
 * funcion llamada al clikear para aplicar la config o reiniciar
 * @returns nothing
 */
//export function playTablero() {
function playTablero() {
    if(reiniciar === true) {
        reiniciar = false;
        initBase();
        return;
    }
    if (customRunning === true) {
        customRunning = false;
        console.log("entro config custom");
        if (evalCustomData() === true ) {
            console.log("fin toma de datos Custom");
            initAll();      
        }          
    }
    else {
        limiteX         = window.innerWidth;
        limiteY         = window.innerHeight;
        console.log("X: "+limiteX+" ,Y: "+limiteY);
        ///
        defTablero.style.display = "flex";
        if (evalBasicData() === true ) {
        if (nroPueblos == 1) {
            switch (algoritmoJgo) {
                case STD_23_3: minAlive=2; maxAlive=3; newLive1=3; newLive2= 3; break; 
                case HD_23_36: minAlive=2; maxAlive=3; newLive1=3; newLive2= 6; break;
                case HD1_12_2: minAlive=1; maxAlive=2; newLive1=2; newLive2= 2; break; 
                case LD1_34_4: minAlive=3; maxAlive=4; newLive1=4; newLive2= 4; break;
                case LD2_45_5: minAlive=4; maxAlive=5; newLive1=5; newLive2= 5; break;
                case LD3_56_6: minAlive=5; maxAlive=6; newLive1=6; newLive2= 6; break;
                case LD4_67_7: minAlive=6; maxAlive=7; newLive1=7; newLive2= 7; break;
                case USER_DEF:
                    defTablero.style.display = "none";
                    defCustom.style.display = "flex"; // muestro  custom
                    botonTablero.textContent = 'Algoritmo "A Medida": Click para confirmar y ARMAR TABLERO';
                    botonTablero.style.backgroundColor = "lightsteelblue";
                    botonTablero.style.display = "block";
                    customRunning = true;
                    return;
                case TAB_VACIO:
                    nroPueblos = 10; // indica Tablero Vacío
                    break;    
            } 
        } 
       // si es mayor que 1 va directamente a un esquema fijo de 2 a n (arrancando de 12/2, 23/3 34/4, etc)
        console.log("fin toma de datos normal");
        customRunning = false;
        initAll();
        }
    }
}
/**
 * Completa la inicialización
 */
function initAll () {
    console.log(filasTablero, colTablero, nroPueblos, algoritmoJgo, minAlive, maxAlive, newLive1, newLive2);
    botonTablero.style.display = "none";
    defTablero.style.display = "none";
    defCustom.style.display = "none"; 
    botonGame.style.display = "block";
    botonGame.textContent = "INICIAR JUEGO";
    botonGame.style.backgroundColor = "lightgreen";
    newConfig  = true;
    gameActive = false;
}

/**
 * Llama a la función que inicia el juego en el manejador del mismo 
 */
function iniciaGoLife() {
    miCanvas.style.display = "block";
    iniciarJuego(newConfig, filasTablero, colTablero, nroPueblos, minAlive, maxAlive, newLive1, newLive2);
    newConfig = false;
}
/**
 * Boton Inicia / detiene Juego de la vida
 */ 
function startGoflive() {
    let texto = "";
    if (nroPueblos == 1 ) {texto = "Single: "+algoritmos[algoritmoJgo-1]; }
    else if(nroPueblos < 10 ) { texto = "Multi: "+nroPueblos+" niveles"; }
    else { texto = "Tablero vacío - click p/definir 🧒"; }
    if (gameActive === true) {
        gameActive = false;
        botonGame.textContent = "RENAUDAR JUEGO ("+texto+")";
        botonGame.style.backgroundColor = "lightgreen";
        botonTablero.textContent = "RE-INICIAR TABLERO/JUEGO";
        botonTablero.style.backgroundColor = "lightsteelblue";
        botonTablero.style.display = "block";
        reiniciar       = true;
        iniciaGoLife();        
    } else {
    botonTablero.style.display = "none";
    botonGame.textContent = "DETENER JUEGO ("+texto+")";
    botonGame.style.backgroundColor = "lightsalmon";
    gameActive = true;
    reiniciar  = false;
    iniciaGoLife();   
    }
}
