// Juego de la VIDA version I multi civilización
// Definición de Emoggis usados...
const EMO_PLAYERS   = ["🧒", "👩🏾‍🦱", "👱‍♀️", "👩🏽‍🦱", "👧", "👱", "👵🏼", "🧓"];
const EMO_ANIMALS   = ["🐶", "🐱", "🐯", "🐻", "🐨", "🐰", "🐷", "🐴"];
const EMO_OTHERS1   = ["👿", "😖", "🤬", "😠", "😡", "👹", "👺"];
const EMO_OTHERS2   = ["🧛", "🦇", "☠️", "🧟", "🕷️", "💀"];
const EMO_DEATH     = "⚰️";
const EMO_TREE      = "🌲";
const EMO_BLACK     = "🐦‍⬛";
const EMO_BARRIER   = "🚧";
// Clase Celula
class Celula {
  #x;
  #y;
  #nivel;
  #algoEleg;
  #estado;
  #siguienteEstado;
  #calcSigEst=[];
  #backAlive;
  #backDeath;
  #emoAlive;
  #emoDeath;
  
  constructor(x, y, tb, p, algo, minVM, maxVM, vecRe1, vecRe2) {
    this.#x = x;
    this.#y = y; 
    this.#nivel = p;
    this.#algoEleg = algo;
    switch (algo) {
      case 1:   this.#backAlive = "lightgreen"; this.#backDeath = "black"; 
                this.#emoAlive = EMO_PLAYERS[this.#x%EMO_PLAYERS.length] ;
                this.#emoDeath = EMO_TREE; break;
      case 2:   this.#backAlive = "yellowgreen"; this.#backDeath = "black";
                this.#emoAlive = EMO_OTHERS1[this.#x%EMO_OTHERS1.length];
                this.#emoDeath = EMO_DEATH; break;
      case 3:   this.#backAlive = "lightblue"; this.#backDeath = "black"; 
                this.#emoAlive = EMO_OTHERS2[this.#x%EMO_OTHERS2.length];
                this.#emoDeath = EMO_DEATH; break;
      case 4:   this.#backAlive = "lightsalmon"; this.#backDeath = "black"; 
                this.#emoAlive = EMO_OTHERS2[this.#x%EMO_OTHERS2.length];
                this.#emoDeath = EMO_DEATH; break;
      case 5:   this.#backAlive = "blueviolet"; this.#backDeath = "black"; 
                this.#emoAlive = EMO_OTHERS2[this.#x%EMO_OTHERS2.length];
                this.#emoDeath = EMO_DEATH; break;
      case 6:   this.#backAlive = "lightgray"; this.#backDeath = "black";
                this.#emoAlive = EMO_OTHERS2[this.#x%EMO_OTHERS2.length];
                this.#emoDeath = EMO_DEATH; break;
      case USER_DEF:
                  this.#backAlive = "lightgreen"; this.#backDeath = "black"; 
                  this.#emoAlive = EMO_ANIMALS[this.#x%EMO_ANIMALS.length] ;
                  this.#emoDeath = EMO_BLACK; break;
      default:  this.#backAlive = "gray"; this.#backDeath = "black";   // 7 o más (excepto que esté antes)
                this.#emoAlive = EMO_OTHERS2[this.#x%EMO_OTHERS2.length];
                this.#emoDeath = EMO_DEATH; break;
    }
    for (let i=0; i<9 ; i++) { // calcula siguiente estado si esta en "0"
      this.#calcSigEst.push(0); // carga primer valor en "0"
      if ((vecRe1 == i) || (vecRe2 == i)) {this.#calcSigEst[i] = 1;} // modifica a 1
    }
    for (let j=0; j<9 ; j++) { // calcula siguiente estado si esta en "1"
      this.#calcSigEst.push(1); // carga primer valor en "0"
      if ((j < minVM) || (j > maxVM)) {this.#calcSigEst[j+9] = 0;} // modifica a 0 
    }
    if ( tb === true) {this.#estado = 0 } // Inicializa como célula muerta
    else {this.#estado = Math.random() < 0.5 ? 0 : 1; } // Inicializa aleatoriamente como viva o muerta
    this.#siguienteEstado = 0; // Estado que tendrá en la siguiente generación
  }

  get x() {
    return this.#x;
  }

  get y() {
    return this.#y;
  }

  get estado() {
    return this.#estado;
  }

  set estado(nuevoEstado) {
    this.#estado = nuevoEstado;
  }

  get siguienteEstado() {
    return this.#siguienteEstado;
  }

  set siguienteEstado(nuevoEstado) {
    this.#siguienteEstado = nuevoEstado;
  } 

  // Método para calcular el siguiente estado de la célula
  calcularSiguienteEstado(vecinosVivos) {
    //this.#siguienteEstado = this.#estado; // debug
    this.#siguienteEstado = this.#calcSigEst[(this.#estado*9)+vecinosVivos];
  }

  // Método para actualizar el estado de la célula
  actualizarEstado() {
    this.#estado = this.#siguienteEstado;
  }

  // Método para dibujar la célula en el tablero
  dibujar(contexto, lado) {
    const x = this.#x * lado;
    const y = this.#y * lado;
    contexto.fillStyle = this.#estado === 1 ? this.#backAlive : this.#backDeath; 
    contexto.fillRect(x, y, lado, lado);
    contexto.font = lado*0.7 + "px sans-serif"; // Ajusta el tamaño de fuente aquí
    let texto = "";
    texto = this.#estado == 1 ? this.#emoAlive : this.#emoDeath;
    contexto.fillText(texto, x + lado /8 , y + lado /1.5);
  }

  // Metodo para diseñar a mano el tablero
  dibujarCell(contexto, lado) {
    const x = this.#x * lado;
    const y = this.#y * lado;
    if (this.#estado === 0) { this.#estado = 1;} 
    else {this.#estado = 0;}
    contexto.fillStyle = this.#estado === 1 ? this.#backAlive : this.#backDeath;
    console.log("x e y: "+this.#x+this.#y);   // debug
    contexto.fillRect(x, y, lado, lado);
    contexto.font = lado*0.7 + "px sans-serif"; // Ajusta el tamaño de fuente aquí
    let texto = "";
    texto = this.#estado == 1 ? this.#emoAlive : this.#emoDeath;
    contexto.fillText(texto, x + lado /8 , y + lado /1.5);
  }
}
///////////////////////////////
// Clase Tablero
class Tablero {
  #filas;
  #columnas;
  #canvas;
  #context;
  #people;
  #algoritmo;
  #celulas;
  #lado;
  #animacionId;
  #dibujando;
  #tabVacio;
  #listenerInstalado = false;
  //
  constructor(filas, columnas, canvasId, people, algorit, pargol ) {
    // llama a una función tipo método / para evira construir de nuevo...
    this.inicializatTab(filas, columnas, canvasId, people, algorit, pargol);
  }
    // Método para inicializar desde cualquier lado sin construir
  inicializatTab (filas, columnas, canvasId, people, algo, pargol) {
    this.#filas = filas;
    this.#columnas = columnas;
    this.#canvas = document.getElementById(canvasId);
    this.#context = this.#canvas.getContext("2d");
    // Borra todo el contenido del canvas
    this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
    this.#people  = people;
    this.#algoritmo = algo;
    this.#tabVacio = false;
    if (people >= TAB_VACIO ) {
      this.#people  = 1;
      this.#tabVacio = true;
    }
    this.#celulas = [];
    this.#lado = this.#canvas.width / this.#columnas; // Calcula el tamaño de la célula
    this.#dibujando = false;
    this.actualizarTamanioCanvas(); // Ajusta el tamaño del canvas al cargar la página
    window.addEventListener("resize", () => this.actualizarTamanioCanvas()); // Ajusta el tamaño del canvas al cambiar el tamaño de la ventana
    // Inicializar el tablero con células
    for (let p = 0; p < this.#people ; p++) {
      let tb = this.#tabVacio;
      const newCels = [];
      for (let y = 0; y < this.#filas; y++) {
        for (let x = 0; x < this.#columnas; x++) {
          if (this.#people == 1 ) {
            newCels.push(new Celula(x, y, tb, p, algo, pargol[0], pargol[1], pargol[2], pargol[3]));
          }
          else {
            newCels.push(new Celula(x, y, tb, p, p+1,
                    pargol[p*4], pargol[(p*4)+1], pargol[(p*4)+2], pargol[(p*4)+3]));
          }
        }
      }
      this.#celulas.push(newCels);
    }
    // Si tablero vacío y no instalado agrega un listener de click al canvas
    if ((this.#tabVacio == 1)&&(this.#listenerInstalado === false) ){
      this.#canvas.addEventListener("click", (event) => this.handleClick(event));
      this.#listenerInstalado = true;
    }
  }
  
  // Función para manejar el clic del mouse
  handleClick(event) {
    if(this.#tabVacio === true) {
    const rect = this.#canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const clickedRow = Math.floor(y / this.#lado);
    const clickedCol = Math.floor(x / this.#lado);
    console.log(`Celda clickeada: Fila ${clickedRow}, Columna ${clickedCol}`);
    this.#celulas[0][clickedCol+(clickedRow*this.#columnas)].dibujarCell(this.#context, this.#lado);
    }
  }
  // Método para ajustar el tamaño del canvas al tamaño de la ventana
  actualizarTamanioCanvas() {
    const ancho = window.innerWidth * 0.95; // Ancho ligeramente menor
    const alto = window.innerHeight * 0.85; // Alto ligeramente menor
    this.#lado = Math.min(ancho / this.#columnas, alto / this.#filas); // Calcula el tamaño de la célula
    this.#canvas.width = this.#lado * this.#columnas;
    this.#canvas.height = this.#lado * this.#filas;
  }

  // Método para dibujar el tablero
  dibujarTablero() {
    for (let p = 0 ; p < this.#people; p++) {
      for (const celula of this.#celulas[p]) {  
      celula.dibujar(this.#context, this.#lado);
      }
    }
  } 

  // Método para dibujar el tablero con un retraso de un segundo entre los grupos de celdas
  dibujarTableroConRetraso() {
    if (this.#dibujando) {
      return; // Ya está dibujando, no hacer nada
    }
    const intervalo = INTERV_DIBUJA; // 400 milisegundos 
    let grupoActual = 0; // Inicializa con el primer grupo de celdas

    const dibujarGrupoSiguiente = () => {
      if (grupoActual < this.#people) {
        for (const celula of this.#celulas[grupoActual]) {
          celula.dibujar(this.#context, this.#lado);
        }
        grupoActual++; // Pasar al siguiente grupo
        setTimeout(dibujarGrupoSiguiente, intervalo); // Llamar recursivamente después del retraso
      } else {
        // La animación ha finalizado
        this.#dibujando = false;
      }
    };

    // Comienza el proceso llamando a la función dibujarGrupoSiguiente
    this.#dibujando = true;
    dibujarGrupoSiguiente();
  }

  // Método para calcular el siguiente estado de todas las células en el tablero
  calcularSiguienteEstadoTablero() {
    for (let p = 0; p < this.#people; p++ ) {
      for (const grupoCelulas of this.#celulas[p]) {
          const celula = grupoCelulas;
          const vecinosVivos = this.contarVecinosVivos(celula);
          celula.calcularSiguienteEstado(vecinosVivos);
      }
   }
  }

  // Método para actualizar el estado de todas las células en el tablero
  actualizarEstadoTablero() {
    for (let p = 0; p < this.#people; p++ ) {
      let cont = 0;
      for (const celula of this.#celulas[p]) {
        celula.actualizarEstado();
        cont++;
      }
    }
  }

  // Método para obtener una célula en una ubicación específica
  getCelulaEn(x, y) {
    // Verificar si x está fuera del rango de columnas
    if (x >= this.#columnas) {
      x = 0; // Tomar la primera columna
    } else if (x < 0) {
      x = this.#columnas - 1; // Tomar la última columna
    }

    // Verificar si y está fuera del rango de filas
    if (y >= this.#filas) {
      y = 0; // Tomar la primera fila
    } else if (y < 0) {
      y = this.#filas - 1; // Tomar la última fila
    }
    return this.#celulas[0].find((celula) => celula.x === x && celula.y === y);
  }

  // Método para contar las células vecinas vivas de una célula dada
  contarVecinosVivos(celula) { // cuenta hasta 8 vecinos (left, right, up y down)
    let vecinosVivos = 0;
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        if (dx === 0 && dy === 0) continue; // No contar la propia célula
        const vecino = this.getCelulaEn(celula.x + dx, celula.y + dy);
        if (vecino && vecino.estado === 1) {
          vecinosVivos++;
        }
      }
    }
    return vecinosVivos;
  }
  
  // Método para iniciar o detener la animación del juego
  toggleAnimacion() {
    if (!this.#animacionId) {
      this.#animacionId = requestAnimationFrame(this.#iterar.bind(this));
    } else {
      cancelAnimationFrame(this.#animacionId);
      this.#animacionId = null;
    }
  }

  // Método privado para realizar una iteración del juego
  #iterar() {
    this.calcularSiguienteEstadoTablero();
    this.actualizarEstadoTablero();
    this.dibujarTablero();
    this.#animacionId = requestAnimationFrame(this.#iterar.bind(this));
  }

  // Método para borrar todas las células en el tablero
  borrarTablero() {
    for (let p=0; p< this.#people;p++) {
      for (const celula of this.#celulas[p]) {
        celula.estado = 0;
        celula.siguienteEstado = 0;
      }
    }
  }

  // Método para generar un patrón aleatorio en el tablero
  generarPatronAleatorio() {
    for (let p=0;p<this.#people;p++){
      for (const celula of this.#celulas[p]) {
        celula.estado = Math.random() < 0.5 ? 0 : 1;
        celula.siguienteEstado = 0;
      }
    }
  }

  // MI METODO PARA CANCELAR
  cancelarAnimacion () {
    clearTimeout(this.#animacionId);
    cancelAnimationFrame(this.#animacionId);
    this.#animacionId = null;
    this.#dibujando = false;
  }
  // Mí método para Iterar
  iterarConDelay(retraso) {
    this.calcularSiguienteEstadoTablero();
    this.actualizarEstadoTablero();
    this.dibujarTableroConRetraso();
    this.#animacionId = setTimeout(() => {
      this.iterarConDelay(retraso); // Pasa el parámetro "retraso" aquí
    }, retraso);
  }

  // Método público para iniciar la animación con un retraso personalizado
  iniciarAnimacion(retraso) {
    if (!this.#animacionId) { // Verifica si la animación ya está en marcha
         this.iterarConDelay(retraso); // Pasa el parámetro "retraso" aq  
    }
  }
}
/* FIN DECLARACION DE CLASES */
/// MAIN
let tableroGoLife = 0;
let tableroExist = false;
let animacionPausada = false;
const INTERVAL  = 350;
const INTERV_DIBUJA = INTERVAL * 0.9;
let timeScale = 1;
/**
 *  Pausar en caso de Tablero Vacío
 */
function tabVacPausar () {
  tableroGoLife.cancelarAnimacion();
  animacionPausada = true;
  console.log("animación pausada automaticamente");      
}

// Función para inicializar y comenzar el juego
function iniciarJuego(newConf, fil, col, num, algo, pargol) {
  if(num==TAB_VACIO){ timeScale = 0.9;} else {timeScale = num;}
  console.log("Config Inicial(new): "+newConf);
  if (tableroExist === false) {
    console.log("Carga 1ra configuración");
    tableroExist = true;
    tableroGoLife = new Tablero(fil, col, "canvas", num, algo, pargol);
    console.log(fil, col, num, algo, pargol[0], pargol[1], pargol[2], pargol[3]);
    //console.table(pargol);
    tableroGoLife.iniciarAnimacion(INTERVAL * timeScale); // Comienza la animación con un retraso de xxx ms (10 cuadros por segundo)
    if (num == TAB_VACIO) {
      setTimeout(tabVacPausar, 500);
    }
  }
  else {
    if (newConf === true) {
        tableroGoLife.inicializatTab (fil, col, "canvas", num, algo, pargol);
        console.log("Recarga Nueva Configuración: ");
        console.log(fil, col, num, algo, pargol[0], pargol[1], pargol[2], pargol[3]);
        if (num == TAB_VACIO) {
          setTimeout(tabVacPausar, INTERVAL);
        }
    }
    if (animacionPausada == true) {
      // Si la animación está pausada, se reanuda (no es necesario recargar...)
      tableroGoLife.iniciarAnimacion(INTERVAL * timeScale);
      animacionPausada = false;
      console.log("ahora se reaunuda....");
      console.log(fil, col, num, algo, pargol[0], pargol[1], pargol[2], pargol[3]); 
      //console.table(pargol);
    } else {
      tableroGoLife.cancelarAnimacion();
      animacionPausada = true;
      console.log("animación pausada");  
    }
  }  
}

