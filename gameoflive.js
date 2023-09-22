// Juego de la VIDA version multi civilización
// Definición de Emoggis usados...
const EMO_PLAYERS   = ["🧒", "👩🏾‍🦱", "👱‍♀️", "👩🏽‍🦱", "👧", "👱", "👵🏼", "🧓"];
const EMO_OTHERS1   = ["👿", "😖", "🤬", "😠", "😡", "👹", "👺"];
const EMO_OTHERS2   = ["🧛", "🦇", "☠️", "🧟", "🕷️", "💀"];
const EMO_DEATH     = "⚰️";
const EMO_TREE      = "🌲";
const EMO_BARRIER   = "🚧";
// Clase Celula
class Celula {
  #x;
  #y;
  #nivel;
  #minVecMuere;   // menos vec, se muere
  #maxVecMuere;   // mas vec, se muere
  #vecReNace1;    // igual a este renace 
  #vecRenace2;    // igual a este renace tambien
  #estado;
  #siguienteEstado;

  constructor(x, y, p, minVM, maxVM, vecRe1, vecRe2) {
    this.#x = x;
    this.#y = y;
    this.#nivel = p;
    this.#minVecMuere = minVM;
    this.#maxVecMuere = maxVM;
    this.#vecReNace1 = vecRe1;
    this.#vecRenace2 = vecRe2;
    this.#estado = Math.random() < 0.5 ? 0 : 1; // Inicializa aleatoriamente como viva o muerta
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
    if (this.#estado === 1) {
      //if (vecinosVivos < 2 || vecinosVivos > 3) {
      if (vecinosVivos < this.#minVecMuere || vecinosVivos > this.#maxVecMuere) {
        this.#siguienteEstado = 0; // Muere por soledad o superpoblación
      } else {
        this.#siguienteEstado = 1; // Permanece viva
      }
    } else {
      if ((vecinosVivos === this.#vecReNace1) || (vecinosVivos === this.#vecRenace2)) {  //this.#vecReNace
        this.#siguienteEstado = 1; // Nace por reproducción
      } else {
        this.#siguienteEstado = 0; // Permanece muerta
      }
    }
  }

   // Método para actualizar el estado de la célula
  actualizarEstado() {
    this.#estado = this.#siguienteEstado;
  }

  // Método para dibujar la célula en el tablero
  dibujar(contexto, lado) {
    const x = this.#x * lado;
    const y = this.#y * lado;
    if (this.#nivel == 0 ) { 
      contexto.fillStyle = this.#estado === 1 ? "lightsalmon" : "black";
    } else if (this.#nivel == 1) {
      contexto.fillStyle = this.#estado === 1 ? "lightgreen" : "black";
    } else if (this.#nivel == 2) {
      contexto.fillStyle = this.#estado === 1 ? "blueviolet" : "black";
    } else {
      contexto.fillStyle = this.#estado === 1 ? "grey" : "black";
    }
    contexto.fillRect(x, y, lado, lado);
    contexto.fillStyle = "red";
    contexto.font = lado*0.7 + "px sans-serif"; // Ajusta el tamaño de fuente aquí
    let texto = "";
    if (this.#nivel == 0 ) { 
      texto = this.#estado === 1 ? EMO_OTHERS1[this.#x%EMO_OTHERS1.length] : EMO_DEATH;
    } else if (this.#nivel == 1) {
      texto = this.#estado === 1 ? EMO_PLAYERS[this.#x%EMO_PLAYERS.length] : EMO_TREE;
    } else {
      texto = this.#estado === 1 ? EMO_OTHERS2[this.#x%EMO_OTHERS2.length] : EMO_DEATH;
    }
    contexto.fillText(texto, x + lado /8 , y + lado /1.5);
    //contexto.strokeRect(x, y, lado, lado); // agrega líneas de borde a las celdas
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
  #celulas;
  #lado;
  #animacionId;
  #dibujando;
  
  constructor(filas, columnas, canvasId, people, minVM, maxVM, vecRe1, vecRe2 ) {
    // llama a una función tipo método / para evira construir de nuevo...
    this.inicializatTab(filas, columnas, canvasId, people, minVM, maxVM, vecRe1, vecRe2);
  }
  // Método para inicializar desde cualquier lado sin construir
  inicializatTab (filas, columnas, canvasId, people, minVM, maxVM, vecRe1, vecRe2) {
    this.#filas = filas;
    this.#columnas = columnas;
    this.#canvas = document.getElementById(canvasId);
    this.#context = this.#canvas.getContext("2d");
    // Borra todo el contenido del canvas
    this.#context.clearRect(0, 0, this.#canvas.width, this.#canvas.height);
    this.#people  = people;
    this.#celulas = [];
    this.#lado = this.#canvas.width / this.#columnas; // Calcula el tamaño de la célula
    this.#dibujando = false;
    this.actualizarTamanioCanvas(); // Ajusta el tamaño del canvas al cargar la página
    window.addEventListener("resize", () => this.actualizarTamanioCanvas()); // Ajusta el tamaño del canvas al cambiar el tamaño de la ventana
    // Inicializar el tablero con células
    for (let p = 0; p < people ; p++) {
      const newCels = [];
      for (let y = 0; y < this.#filas; y++) {
        for (let x = 0; x < this.#columnas; x++) {
          if (people == 1 ) {
            newCels.push(new Celula(x, y, p+1, minVM, maxVM, vecRe1, vecRe2));
          }
          else {
            newCels.push(new Celula(x, y, p, p+1, p+2, p+2, p+2));
          }
          
        }
      }
      this.#celulas.push(newCels);
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
      console.log("esta dibujando!");
      return; // Ya está dibujando, no hacer nada
    }
    const intervalo = 300; // 300 milisegundos 
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
      for (const celula of this.#celulas[p]) {
        celula.actualizarEstado();
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

  // Método para actualizar el estado de todas las células en el tablero
  actualizarEstadoTablero() {
    for (let p=0; p< this.#people; p++) {
      for (const celula of this.#celulas[p]) {
        celula.actualizarEstado();
      }
    }
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
     // Llama a la función para la próxima iteración después de un retraso
    this.#animacionId = setTimeout(() => {
      this.iterarConDelay(retraso); // Pasa el parámetro "retraso" aquí
    }, retraso);
  }

  // Método público para iniciar la animación con un retraso personalizado
  iniciarAnimacionB(retraso) {
    if (!this.#animacionId) { // Verifica si la animación ya está en marcha
         this.iterarConDelay(retraso); // Pasa el parámetro "retraso" aq  
    }
  }
}

let tableroGoLife = 0;
let tableroExist = false;
let animacionPausada = false;

// Función para inicializar y comenzar el juego
function iniciarJuego(newConf, fil, col, num, par1, par2, par3, par4) {
  console.log("newConf: "+newConf);
  if (tableroExist === false) {
    tableroExist = true;
    tableroGoLife = new Tablero(fil, col, "canvas", num, par1, par2, par3, par4);
    tableroGoLife.iniciarAnimacionB(500*num); // Comienza la animación con un retraso de xxx ms (10 cuadros por segundo)
  }
  else {
    if (animacionPausada === true) {
      if (newConf === false) {
         tableroGoLife.inicializatTab (fil, col, "canvas", num, par1, par2, par3, par4);
         console.log("recarga: "+newConf);
      }
      // Si la animación está pausada, se reanuda (no es necesario recargar...)
      tableroGoLife.iniciarAnimacionB(350 * num);
      animacionPausada = false;
    
    } else {
      tableroGoLife.cancelarAnimacion();
      animacionPausada = true;
      console.log("animación pasa a pausada");      
    }
  }  
}