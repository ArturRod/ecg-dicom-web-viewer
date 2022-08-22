import Constants from "../constants/Constants";
import GenericCanvas from "./GenericCanvas";

/**
 * Draw grid canvas template.
 */
class DrawECGCanvas extends GenericCanvas {
  private margin = 25; //Margin to draw elements.
  private changeValues = 0.05; //Value of change up down, left o right graph.
  private countZoom = 0; //Count zoom.
  
  constructor(id_canvas: string, dataMg: any) {
    super(id_canvas, dataMg);
  }

  //--------------------------------------------------------
  //------------------ DRAW AND EVENTS ---------------------
  //--------------------------------------------------------
 //#region DRAW AND EVENTS:
  /**
   * Draw grid and views:
   */
  public draw(){
    this.drawGrid();
    this.drawECG();
    //Event buttons:
    this.buttonsEvents();
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
  }


  /**
   * Change zoom, scale canvas.
   * @param min minimize or maximize
   */
  private changeZoom(min: boolean){
    //Zoom:
    let scale = 1.0;
    let scaleMultiplier = 0.8;
    if(min){
      scale *= scaleMultiplier;
      this.countZoom--;
    }
    else{
      scale /= scaleMultiplier;
      this.countZoom++;
    }
    //Max undefinded and min zoom = zoom base:
    if(this.countZoom >= 0){
      this.clearAndUpdateView(scale);
    }
    else{
      this.countZoom = 0;
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
      this.clearAndUpdateView(null);

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
      this.clearAndUpdateView(null);

      //Update text:
      let text = document.getElementById('textTime');
      text.innerText = " " + Math.round(time * 100) + "mm/s "
    }
  }


  /**
   * Clear and Update view.
   */
  private clearAndUpdateView(scale){
    //Clear ecg:
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    if(scale != null){
      this.ctx.scale(scale, scale);
    }
    //New draw:
    this.drawGrid();
    this.drawECG();
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
    let h = this.canvas.height;
    let gridWidth = this.canvas.width / this.configuration.COLUMNS;
    let gridHeight = h / this.configuration.ROWS;
    let marginWidth = 10;
    this.ctx.font = "small-caps 800 25px Times New Roman";

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
    this.dataMg.channels.forEach((channel) => {
      //code:
      let code =
        channel.channelDefinition.channelSource.codeMeaning.split(" ")[1];
      let objPosition = this.positionsDraw.find((obj) => {
        return obj.name === code;
      });
      //Variables:
      let data = [];
      let time = 0;
      let i = 0;
      let positionMaxPointFrec = 0;
      //Reference to draw:
      let startY = objPosition.height;
      let startX = objPosition.width + this.margin; //Margin left and right to draw:
      let latestPosition = startY;
      let baseScale: any;

      //Load data:
      channel.samples.forEach((element) => {
        data.push(element);
      });

      //Position for the max point data:
      let maxPoint =  Math.max(...data);
      while(data[positionMaxPointFrec] < maxPoint){
        positionMaxPointFrec++;
      }
      i = positionMaxPointFrec;

      //Scale mV, uV. mmHg...
      switch (channel.channelDefinition.channelSensitivityUnits.codeValue) {
        case Constants.mV.name:
          baseScale = Constants.mV;
          break;
        case Constants.uV.name:
          baseScale = Constants.uV;
          break;
        case Constants.mmHg.name:
          baseScale = Constants.mmHg;
          break;
        default:
          baseScale = Constants.def;
          break;
      }

      //Colum calculator:
      let middleColum = startX + this.margin; // Margin Right.
      if (startX != 10 + this.margin) {
        middleColum = 0;
      }
      //Draw line:
      while (i < data.length && time < this.canvas.width / 2 - middleColum) {
        //Line width:
        this.ctx.lineWidth = this.configuration.CURVE_WIDTH;
        this.ctx.lineCap = 'round';
        //10mV/s:
        let point =
          ((data[i] * objPosition.height) / baseScale.deltaMain) *
          this.configuration.AMPLITUDE; //Rescalate. 10mV/s Each square is 1 mm.

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
        //25mm/s:
        time += this.configuration.TIME; //25mm/s Each square is 1 mm
        i++;

        //Reset to start position, complete width draw and repeat secuency:
        if (i == data.length) {
          i = positionMaxPointFrec - Math.round(positionMaxPointFrec * 0.05); //start - 5%
        }
      }
    });
  }

  //#endregion
}

export default DrawECGCanvas;
