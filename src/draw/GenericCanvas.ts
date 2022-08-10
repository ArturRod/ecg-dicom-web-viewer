/**
 * Generic class canvas.
 */
class GenericCanvas {
  public id_canvas: string;
  public dataMg: any;
  //Canvas ECG:
  public canvas: HTMLCanvasElement;
  public ctx: CanvasRenderingContext2D;
  //Canvas User Information:
  public canvasUserData: HTMLCanvasElement;
  public ctxUserData: CanvasRenderingContext2D;
  public positionsDraw: Array<any>;

  //Configurantion:
  public configuration = {
    //GRID:
    CELL_WIDTH: 0.1, //The stroke width of cell 1mm
    CELL_SIZE: 6, //The cell size
    BLOCK_WIDTH: 0.2, //The stroke width of block
    BLOCK_SIZE: 0, //CELL_SIZE * 5, //The block size, each block includes 5*5 cells
    //ROWS and COLUMS canvas separation I, II, III, aVR, aVL, aVF, V1, V2, V3, V4, V5, V6
    ROWS: 6,
    COLUMS: 2,
    columsText: [
      ["I", "II", "III", "aVR", "aVL", "aVF"], //Colum 1
      ["V1", "V2", "V3", "V4", "V5", "V6"], // Colum 2
    ],
    //LINE ECG:
    CURVE_WIDTH: 1, //The stroke width of curve
    SAMPLING_RATE: 125, //The number of samples per second (1/0.008)
    FREQUENCY: 250, //The frequency to update the curve 25mm = 1000ms = 1s
    TEMPO: 0.25, //Default <- 25mm/s -> Each square is 1 mm
    AMPLITUDE: 0.10, //Default 10mm/mV  Each square is 1 mm
    //DESING:
    GRID_COLOR: "#F08080",
    LINE_COLOR: "#000033",
    BACKGROUND_COLOR: "#F9F8F2",
    HEIGHT_USER_INFO: 100, //Start grid draw.
    CTXFONT: "small-caps 800 14px Times New Roman", //Configuration style text.
  };

  /**
   * Constructor.
   * @param id_canvas ID Canvas view.
   * @param dataMg data Dicom.
   */
  constructor(id_canvas: string, dataMg: any) {
    this.dataMg = dataMg;

    //Canvas ECG:
    this.canvas = <HTMLCanvasElement> document.getElementById(id_canvas);
    this.ctx = this.canvas.getContext("2d");

    //Canvas User Data:
    this.canvasUserData = <HTMLCanvasElement> document.getElementById("userData");
    this.ctxUserData = this.canvasUserData.getContext("2d");

    //Canvas resize:
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.canvas.style.width = "100%";
    this.canvas.style.height = "100%";
    //this.canvas.width = Math.max(400, this.canvas.clientWidth);
    //this.canvas.height = this.canvas.clientHeight;

    //Canves user resize:
    this.canvasUserData.width = window.innerWidth;
    this.canvasUserData.height = this.configuration.HEIGHT_USER_INFO;
    this.canvasUserData.style.width = "100%";
    this.canvasUserData.style.height = "100px";
    this.canvasUserData.width = Math.max(400, this.canvasUserData.clientWidth);
    this.canvasUserData.height = this.canvasUserData.clientHeight;

    //Color canvas:
    this.canvas.style.backgroundColor = this.configuration.BACKGROUND_COLOR;
    this.canvasUserData.style.backgroundColor = this.configuration.BACKGROUND_COLOR;

    //Bloqu size:
    this.configuration.BLOCK_SIZE = this.configuration.CELL_SIZE * 5;

    //Frequency data dcm:
    this.configuration.FREQUENCY = dataMg.samplingFrequency;

    //Star Array:
    this.positionsDraw = new Array();
  }
  

  /**
   * Draw a line from point (x1, y1) to point (x2, y2)
   * @param x1 moveTo(x1).
   * @param y1 moveTo(y1).
   * @param x2 lineTo(x2).
   * @param y2 lineTo(y2).
   */
  public drawLine(x1: number, y1: number, x2: number, y2:number) {
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
  }

  //GET Methods:
  /**
   * Returns the cell size
   * @return the cell size
   */
  get cellSize() {
    return this.configuration.CELL_SIZE;
  }

  /**
   * Returns the block size
   * @return the block size
   */
  get blockSize() {
    return 5 * this.configuration.CELL_SIZE;
  }

  /**
   * Returns the number of cells per period
   * @return the number of cells per period
   */
  get cellsPerPeriod() {
    return Math.floor(this.width / this.cellSize);
  }

  /**
   * Returns the number of samples per cell
   * @return the number of samples per cell
   */
  get samplesPerCell() {
    return 0.04 * this.samplingRate;
  }

  /**
   * Returns the number of samples per second
   * @return the number of samples per second
   */
  get samplingRate() {
    return this.configuration.SAMPLING_RATE;
  }

  /**
   * Returns the number of samples per period
   * @return the number of samples per period
   */
  get samplesPerPeriod() {
    return Math.floor(
      0.04 * this.samplingRate * (this.width / this.cellSize)
    );
  }

  /**
   * Returns the width of this electrocardiogram
   * @return the width of this electrocardiogram
   */
  get width() {
    return this.ctx.canvas.width;
  }

  /**
   * Returns the height of this electrocardiogram
   * @return the height of this electrocardiogram
   */
  get height() {
    return this.ctx.canvas.height;
  }

  /**
   * Returns the period (seconds) of this electrocardiogram
   * @return the period of this electrocardiogram
   */
  get period() {
    return (0.04 * this.width) / this.cellSize;
  }
}
export default GenericCanvas;
