import Constants from "../constants/Constants";
import GenericCanvas from "./GenericCanvas";

/**
 * Draw grid canvas template.
 */
class DrawECGCanvas extends GenericCanvas {
  constructor(id_canvas: string, dataMg: any) {
    super(id_canvas, dataMg);
    //LOAD USER DATA:
    this.loadUserData();
  }

  //--------------------------------------------------------
  //----------------   DRAW GRID   -------------------------
  //--------------------------------------------------------
  //#region DRAW GRID
  /**
   * Draw the grid
   */
  public drawGrid() {
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

  /**
   * Load view no compatible:
   */
  public drawNoCompatible(){
    this.ctx.font = "3rem Arial";
    this.ctx.fillText(
      "ECG NO COMPATIBLE",
      this.canvas.width / 2,
      this.canvas.height / 2
    );
  }

  //Draw I, II, III, aVR, aVL, aVF, V1, V2, V3, V4, V5, V6
  public drawECGIndicators() {
    let h = this.canvas.height;
    let gridWidth = this.canvas.width / this.configuration.COLUMS;
    let gridHeight = h / this.configuration.ROWS;
    let width = 10;
    this.ctx.font = "small-caps 800 25px Times New Roman";

    //COLUMNS:
    for (let e = 0; e < this.configuration.COLUMS; e++) {
      let middleHeight = gridHeight / 2;
      //ROWS:
      for (let i = 0; i < this.configuration.ROWS; i++) {
        this.ctx.fillText(
          this.configuration.columsText[e][i],
          width,
          middleHeight
        );
        //Save positions for drawECG:
        let position = {
          name: this.configuration.columsText[e][i],
          width: width,
          height: middleHeight
        }
        this.positionsDraw.push(position);
        middleHeight += gridHeight;
      }
      width += gridWidth;
    }
  }
  //#endregion

  //--------------------------------------------------------
  //----------------    DRAW ECG   -------------------------
  //--------------------------------------------------------
  //#region DRAW ECG
  
  /**
   * Load user data information in canva user data.
   */
  public loadUserData() {
    //Data user:
    this.ctxUserData.font = "small-caps 800 14px Times New Roman";
    this.ctxUserData.fillText("NAME: " + this.dataMg.patientName, 10, 25);
    this.ctxUserData.fillText("ID: " + this.dataMg.patientID, 10, 40);
    this.ctxUserData.fillText("SEX: " + this.dataMg.sex, 10, 55);
    this.ctxUserData.fillText("BIRTH: " + this.dataMg.bithDate, 10, 70);
    this.ctxUserData.fillText("STUDY DATE: " + this.dataMg.studyDate, 10, 85);
    this.ctxUserData.fillText("AGE: " + this.dataMg.patientAge, 250, 55);
    this.ctxUserData.fillText("SIZE: " + this.dataMg.patientSize, 250, 70);
    this.ctxUserData.fillText("WEIGHT: " + this.dataMg.patientWeight, 250, 85);
  }


  /**
   * Draw lines.
   */
  public drawECG(){
    //CHANELS:
    this.dataMg.channels.forEach(channel => {
      //code:
      let code = channel.channelDefinition.channelSource.codeMeaning.split(" ")[1];
      let objPosition = this.positionsDraw.find((obj) => {
        return obj.name === code;
      });
      this.paintLines(objPosition, channel);
    });
  }

  /**
   * Paint Lines ECG.
   * @param objPosition Position information draw.
   * @param channel Channel draw:
   */
  private paintLines(objPosition: any, channel: any){
    //Variables:
    let data = [];
    let time = 0;
    let i = 0;
    //Reference to draw:
    let startY = objPosition.height;
    let startX = objPosition.width;
    let latestPosition = startY;
    let baseScale: any;
    
    //Load data:
    channel.samples.forEach(element => {
      data.push(element);
    });

    //Escale mV, uV. mmHg...
    switch(channel.channelDefinition.channelSensitivityUnits.codeValue){
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
    debugger;

    //Draw line:
    while (i < data.length && time < (this.canvas.width / 2 - startX)) {

      //Line width:
      this.ctx.lineWidth = this.configuration.CURVE_WIDTH;

      //10mV/s:
      let point = (data[i] * objPosition.height / baseScale.deltaMain) * this.configuration.AMPLITUDE; //Rescalate. 10mV/s Each square is 1 mm.

      //Draw line:
      this.drawLine(startX + time, latestPosition, startX + time, startY - point);
      this.ctx.stroke();

      //Positions:
      latestPosition = startY - point;
      //25mm/s:
      time += this.configuration.TEMPO; //25mm/s Each square is 1 mm
      i++;

      //Reset to 0, complete width draw and repet secuency:
      if(i == data.length){
        i = 0;
      }
    }
}

  //#endregion
}

export default DrawECGCanvas;
