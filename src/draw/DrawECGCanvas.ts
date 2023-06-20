import GenericCanvas from "./GenericCanvas";

//Global variable for pan and drag:
//The global variable is necessary since we have to remove an event listener that we call from 2 places in the same class.
var pan = {
  start: { x: null, y: null, },
  offset: { x: 0, y: 0, },
  globaloffset: { x: 0, y: 0,},
};

/**
 * Draw grid canvas template.
 */
class DrawECGCanvas extends GenericCanvas {
  private margin = 20; //Margin to draw elements.
  private changeValues = 0.05; //Value of change up down, left o right graph.
  private scale	= 1;
  private scaleFactor = 0.8;
  
  constructor(id_canvas: string, dataMg: any) {
    super(id_canvas, dataMg);
    //Reset values pan:
    pan.start.x = null;
    pan.start.y = null;
    pan.offset.x = 0;
    pan.offset.y = 0;
    pan.globaloffset.x = 0;
    pan.globaloffset.y = 0;
    //Event buttons:
    this.buttonsEvents();
  }

  //--------------------------------------------------------
  //------------------ DRAW AND EVENTS ---------------------
  //--------------------------------------------------------
 //#region DRAW AND EVENTS:

  /**
   * Draw grid and views.
   * We don't put requestAnimationFrame since it only renders when we zoom, redraw or move, that's why I don't put the method to be loading all the time without need.
   */
  public draw(){      
    this.ctx.setTransform(1, 0, 0, 1, 0, 0);
    //Zoom:
    this.ctx.scale(this.scale, this.scale);
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    //Pan:
    this.ctx.translate(pan.offset.x, pan.offset.y);
    //Draw:
    this.drawGrid();
    this.drawECG();
  }

  /**
   * Load view no compatible:
   */
  public drawNoCompatible() {
    this.ctx.font = "3rem Arial";
    this.ctx.fillText(
      "ECG NO COMPATIBLE",
      this.canvas.width / 2,
      this.canvas.height / 2
    );
  }

  /**
   * Events buttons.
   */
  private buttonsEvents(){
    //AMPLITUDE mm/mV:
    let buttonAmUp = document.getElementById('amplitudeUp');
    buttonAmUp.addEventListener('click', () => this.changeAmplitude(true));
    let buttonAmDown = document.getElementById('amplitudeDown');
    buttonAmDown.addEventListener('click', () => this.changeAmplitude(false));

    //TEMPO mm/s
    let buttonTempoUp = document.getElementById('timeLeft');
    buttonTempoUp.addEventListener('click', () => this.changeTempo(true));
    let buttonTempoDown = document.getElementById('timeRight');
    buttonTempoDown.addEventListener('click', () => this.changeTempo(false));

    //Zoom:
    let buttonZoomMax = document.getElementById("plus");
    buttonZoomMax.addEventListener("click", () => this.changeZoom(false));
    let buttonZoomMin = document.getElementById("minus");
    buttonZoomMin.addEventListener("click", () => this.changeZoom(true));

    //Drag/Pan:
    this.canvas.addEventListener('mousedown', (e)=> this.startPan(e));
    this.canvas.addEventListener('mouseleave',()=> this.endPan());
    this.canvas.addEventListener('mouseup', ()=> this.endPan());
  }

  /**
   * Start pan.
   * @param e event.
   */
  private startPan(e){
    this.canvas.addEventListener("mousemove", this.trackMouse);    
    this.canvas.addEventListener("mousemove", ()=> this.draw());    
    pan.start.x = e.clientX;
    pan.start.y = e.clientY;
  }
  

  /**
   * End pan.
   */
  private endPan(){
    this.canvas.removeEventListener("mousemove", this.trackMouse);    
    pan.start.x = null;
    pan.start.y = null;
    pan.globaloffset.x = pan.offset.x;
    pan.globaloffset.y = pan.offset.y;
  }

  /**
   * Track mose x & y.
   * @param e event.
   */
  private trackMouse(e) {
    var offsetX	 = e.clientX - pan.start.x;
    var offsetY	 = e.clientY - pan.start.y;
    pan.offset.x = pan.globaloffset.x + offsetX;
    pan.offset.y = pan.globaloffset.y + offsetY;    
  }

  /**
   * Change zoom, scale canvas, and adjust line stroke.
   * @param min minimize or maximize
   */
  private changeZoom(min: boolean){
    //Zoom:
    if(min){
      this.scale *= this.scaleFactor;
      if(this.configuration.CURVE_WIDTH < 1.5 && this.scale < 3.80){
        this.configuration.CURVE_WIDTH += 0.2;
      }
    }
    else{
      this.scale /= this.scaleFactor;
      if(this.configuration.CURVE_WIDTH > 0.5) {   
        this.configuration.CURVE_WIDTH -= 0.2;
      }
    }
    //Max undefinded and min zoom = zoom base:
    if(this.scale <= 1){
      this.scale = 1;
    }
    else{
      this.draw();
    }
  }

  /**
   * Change amplitude
   * @param up up or down.
   */
  private changeAmplitude(up: boolean){
    let ampli;
    if(up){
      ampli = this.configuration.AMPLITUDE + this.changeValues; 
    }
    else{
      ampli = this.configuration.AMPLITUDE - this.changeValues; 
    }
    ampli = Math.round(ampli * 100) / 100
    //Max 1.0 = 100mm/mV | min 0.05 = 5mm/mV
    if(ampli <= 1.0 && ampli >= this.changeValues){
      //Change amplitude:
      this.amplitude = ampli;
      this.draw();

      //Update text:
      let text = document.getElementById('textAmplitude');
      text.innerText = " " + Math.round(ampli * 100) + "mm/mV "
    }
  }

  /**
   * Change tempo.
   * @param left left or right 
   */
  private changeTempo(left: boolean){
    let time;
    if(left){
      time = this.configuration.TIME - this.changeValues; 
    }
    else{
      time = this.configuration.TIME + this.changeValues; 
    }
    time = Math.round(time * 100) / 100
    //Max 1.0 = 100mm/ss | min 0.5 = 5mm/ss
    if(time <= 1.0 && time >= this.changeValues){
      //Change amplitude:
      this.time = time;
      this.draw();

      //Update text:
      let text = document.getElementById('textTime');
      text.innerText = " " + Math.round(time * 100) + "mm/s "
    }
  }


  //#endregion

  //--------------------------------------------------------
  //----------------   DRAW GRID   -------------------------
  //--------------------------------------------------------
  //#region DRAW GRID
  /**
   * Draw the grid
   */
  private drawGrid() {
    let w = this.width - 1;
    let h = this.height - 1;
    let bs = this.blockSize;
    let cs = this.cellSize;
    let lw = this.ctx.lineWidth;
    let ss = this.ctx.strokeStyle;

    this.ctx.strokeStyle = this.configuration.GRID_COLOR;

    for (var y = h; y >= 0; y -= cs) {
      this.ctx.beginPath();
      this.ctx.lineWidth =
        (h - y) % bs
          ? this.configuration.CELL_WIDTH
          : this.configuration.BLOCK_WIDTH;
      this.drawLine(0, y, w, y);
      this.ctx.closePath();
      this.ctx.stroke();
    }

    for (var x = 0; x <= w; x += cs) {
      this.ctx.beginPath();
      this.ctx.lineWidth =
        x % bs ? this.configuration.CELL_WIDTH : this.configuration.BLOCK_WIDTH;
      this.drawLine(x, 0, x, h);
      this.ctx.closePath();
      this.ctx.stroke();
    }

    this.ctx.lineWidth = lw;
    this.ctx.strokeStyle = ss;
    //Draw indicators:
    this.drawECGIndicators();
  }

  //Draw I, II, III, aVR, aVL, aVF, V1, V2, V3, V4, V5, V6
  private drawECGIndicators() {
    let gridWidth = this.canvas.width / this.configuration.COLUMNS;
    let gridHeight = this.canvas.height / this.configuration.ROWS;
    let marginWidth = 10;
    this.ctx.font = "small-caps 800 25px Times New Roman";
    //Inicialize array:
    this.positionsDraw = new Array();
    //COLUMNS:
    for (let e = 0; e < this.configuration.COLUMNS; e++) {
      let middleHeight = gridHeight / 2;
      //ROWS:
      for (let i = 0; i < this.configuration.ROWS; i++) {
        this.ctx.fillText(
          this.configuration.columnsText[e][i],
          marginWidth,
          middleHeight - this.margin
        );
        //Save positions for drawECG:
        let position = {
          name: this.configuration.columnsText[e][i],
          width: marginWidth,
          height: middleHeight,
        };
        this.positionsDraw.push(position);
        middleHeight += gridHeight;
      }
      marginWidth += gridWidth;
    }
  }
  //#endregion

  //--------------------------------------------------------
  //----------------    DRAW ECG   -------------------------
  //--------------------------------------------------------
  //#region DRAW ECG


  /**
   * Draw lines.
   */
    private drawECG() {
      //CHANNELS:
      for(let ileads = 0; ileads < this.dataMg.leads.length; ileads++){
        let code = this.dataMg.channelDefinitionSequence[ileads].ChannelLabel;

        //No exist ChannelLabel code: 
        if(code == undefined){
          let codeMeaning = this.dataMg.channelDefinitionSequence[ileads].ChannelSourceSequence[0].CodeMeaning;
          if(codeMeaning.split(" ").length === 2 || codeMeaning.split(" ").length === 3){  //3 text + Bethoven:
            code = codeMeaning.split(" ")[1];
          }
        }
        else{
          if(code.split(" ").length === 2 || code.split(" ").length === 3){  //3 text + Bethoven:
            code = code.split(" ")[1];
          }
          else if(code.split("_").length === 2 || code.split("_").length === 3){  //3 text + Bethoven or _ separator:
            code = code.split("_")[1];
          }
        }

        let objPosition = this.positionsDraw.find((obj) => {
          return obj.name === code;
        })

        //Variables:
        let data = [];
        let time = 0;
        let i = 0;
        //Reference to draw:
        let startY = objPosition.height;
        let startX = objPosition.width + this.margin; //Margin left and right to draw:
        let latestPosition = startY;
  
        //Load data:
        this.dataMg.leads[ileads].signal.forEach((element) => {
          data.push(element);
        });
  
        //Colum calculator margins left and right:
        let space = this.canvas.width / 2 - (startX + this.margin);
        if (startX != 10 + this.margin) {
          space = (this.canvas.width / 2) - (this.margin + 10);
        }
  
        //Line options:
        this.ctx.lineWidth = this.configuration.CURVE_WIDTH;
        this.ctx.lineCap = 'round';
        
        //Draw line:
        while (i < data.length && time < space) {
          //10mV/s:
          let point = ((data[i] * objPosition.height) * this.configuration.AMPLITUDE);  //Rescalate. 10mV/s Each square is 1 mm.
          //Draw line:
          this.ctx.beginPath();
          this.drawLine(
            startX + time,
            latestPosition,
            startX + time,
            startY - point
          );
          this.ctx.stroke();
  
          //Positions:
          latestPosition = startY - point;
          //Duration / time / 100
          //25mm/s Each square is 1 mm
          time += (this.dataMg.duration / this.configuration.TIME) / 100; 
          i++;
        }
      };
      //Clear data:
      this.positionsDraw = null;
    }
  //#endregion
}

export default DrawECGCanvas;
