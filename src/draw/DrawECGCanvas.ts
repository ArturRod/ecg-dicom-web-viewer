import Constants from "../constants/Constants";
import GenericCanvas from "./GenericCanvas";

/**
 * Draw grid canvas template.
 */
class DrawECGCanvas extends GenericCanvas {
  constructor(id_canvas: string, dataMg: any) {
    super(id_canvas, dataMg);
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

    //Default margin text width:
    let width = 10;

    //COLUMNS:
    for (let e = 0; e < this.configuration.COLUMS; e++) {
      let middleHeight = gridHeight / 2;
      //ROWS:
      for (let i = 0; i < this.configuration.ROWS; i++) {
        this.ctx.font = this.configuration.CTXFONT;
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
   * Draw ECG.
   */
  public drawECG(){
    //Load user data:
    this.loadUserData();
    //load indicators:
    this.drawCurve();
  }
  
  /**
   * Load user data information in canva user data.
   */
  public loadUserData() {
    //Data user:
    this.ctxUserData.font = this.configuration.CTXFONT;
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
  public drawCurve(){
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
    let data = [];

    //SCALE HEIGHT: 
    let baseScale: number;
    switch(channel.channelDefinition.channelSensitivityUnits.codeValue){
      case Constants.mV.name:
        baseScale = Constants.mV.deltaMain;
        break;
      case Constants.uV.name:
        baseScale = Constants.uV.deltaMain;
        break;
      case Constants.mmHg.name:
        baseScale = Constants.mmHg.deltaMain;
        break;
      default:
        baseScale = Constants.def.deltaMain;
        break;        
    }
    //let secondsDraw = Math.floor((this.configuration.FREQUENCY/1000) % 60); //parse to seconds
    let time = 0;
    //Reference to draw:
    let startY = objPosition.height;
    let startX = objPosition.width + 10;
    channel.samples.forEach(element => {
      data.push(element);
    });

    let latestPosition = startY;
    let i = 0;

    while (i < data.length) {
      let point = data[i] * objPosition.height / baseScale; //Rescalate.
      this.drawLine(startX + time, latestPosition, startX + time, startY - point);
      this.ctx.stroke();
      latestPosition = startY - point;
      time += 1;
      i++;
    }
}
  /**
   * Draw curve with specified data
   */
  /*public drawCurve() {
    this.prueba();
    let data = [];
    let time = 0.000;
    for(let i = 0; i < this.dataMg.channels[10].samples.length; i++){
      let format = {'time':time += 0.008, 'pqrst':this.dataMg.channels[10].samples[i]};
      data.push(format);
    };

    let i = 0;
    let dt = null;
    let p0 = null;
    let p1 = null;
    let cs = this.cellSize;
    let sr = this.samplingRate;
    let lw = this.ctx.lineWidth;
    let ss = this.ctx.strokeStyle;
    let delta = cs / (0.04 * sr);
    let height = this.height;
    let period = this.period;

    //this.clear();
    //this.drawGrid();
    this.ctx.strokeStyle = this.configuration.LINE_COLOR;
    this.ctx.translate(0, height);

    while (i < data.length) {
      if ((p0 = data[i++])) break;
    }

    p0.offset = (i - 1) * delta;

    while (i < data.length) {
      p1 = data[i];
      p1.offset = i * delta;

      this.ctx.beginPath();
      this.ctx.lineWidth = this.configuration.CURVE_WIDTH;
      this.drawLine(p0.offset, -p0.pqrst, p1.offset, -p1.pqrst);
      this.ctx.closePath();
      this.ctx.stroke();

      p0 = p1;
      i++;
    }

    this.ctx.lineWidth = lw;
    this.ctx.strokeStyle = ss;
    this.ctx.translate(0, -height);
  }*/

  //#endregion
}

export default DrawECGCanvas;
