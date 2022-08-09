import DrawECGCanvas from "./DrawECGCanvas";
import GenericCanvas from "./GenericCanvas";

/**
 * Draw grid canvas template.
 */
class DrawGridCanvas extends GenericCanvas {
  constructor(id_canvas: string, dataMg: any) {
    super(id_canvas, dataMg);
  }

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

    for (var y = h; y >= this.configuration.START_GRID; y -= cs) {
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
      this.drawLine(x, this.configuration.START_GRID, x, h);
      this.ctx.closePath();
      this.ctx.stroke();
    }

    this.ctx.lineWidth = lw;
    this.ctx.strokeStyle = ss;
    //Load user data:
    this.loadUserData();
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
    let h = this.canvas.height - this.configuration.START_GRID;
    let gridWidth = this.canvas.width / this.configuration.COLUMS;
    let gridHeight = h / this.configuration.ROWS;

    //Default margin text width:
    let width = 10;
    //COLUMNS:
    for (let e = 0; e < this.configuration.COLUMS; e++) {
      let middleHeight = gridHeight / 2 + this.configuration.START_GRID;
      //ROWS:
      for (let i = 0; i < this.configuration.ROWS; i++) {
        this.ctx.font = this.configuration.CTXFONT;
        this.ctx.fillText(
          this.configuration.columsText[e][i],
          width,
          middleHeight
        );
        middleHeight += gridHeight;
      }
      width += gridWidth;
    }
  }

  /**
   * Load user data information in range y: 0 to 100.
   */
  public loadUserData() {
    //Draw line user:
    this.ctx.beginPath();
    this.ctx.moveTo(this.canvas.width, this.configuration.START_GRID);
    this.ctx.lineTo(0, this.configuration.START_GRID);
    this.ctx.moveTo(this.canvas.width, 1);
    this.ctx.lineTo(1, 1);
    this.ctx.moveTo(1, this.configuration.START_GRID);
    this.ctx.lineTo(1, 1);
    this.ctx.moveTo(this.canvas.width - 1, 0);
    this.ctx.lineTo(this.canvas.width - 1, this.configuration.START_GRID);
    this.ctx.stroke();

    //Data user:
    this.ctx.font = this.configuration.CTXFONT;
    this.ctx.fillText("NAME: " + this.dataMg.patientName, 10, 25);
    this.ctx.fillText("ID: " + this.dataMg.patientID, 10, 40);
    this.ctx.fillText("SEX: " + this.dataMg.sex, 10, 55);
    this.ctx.fillText("BIRTH: " + this.dataMg.bithDate, 10, 70);
    this.ctx.fillText("STUDY DATE: " + this.dataMg.studyDate, 10, 85);
    this.ctx.fillText("AGE: " + this.dataMg.patientAge, 250, 55);
    this.ctx.fillText("SIZE: " + this.dataMg.patientSize, 250, 70);
    this.ctx.fillText("WEIGHT: " + this.dataMg.patientWeight, 250, 85);
  }

}

export default DrawGridCanvas;
