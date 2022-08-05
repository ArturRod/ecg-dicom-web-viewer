/**
 * Generic class canvas.
 */
class GenericCanvas {
  constructor(id_canvas, dataMg) {
    this.dataMg = dataMg;
    this.canvas = document.getElementById(id_canvas);
    this.ctx = this.canvas.getContext("2d");

    //Configurantion:
    this.configuration = {
      CELL_WIDTH: 0.1, //The stroke width of cell
      CELL_SIZE: 6, //The cell size
      BLOCK_WIDTH: 0.2, //The stroke width of block
      BLOCK_SIZE: 0, //CELL_SIZE * 5, //The block size, each block includes 5*5 cells
      CURVE_WIDTH: 1, //The stroke width of curve
      SAMPLING_RATE: 125, //The number of samples per second (1/0.008)
      FREQUENCY: 250, //The frequency to update the curve
      GRID_COLOR: "#F08080",
      LINE_COLOR: "#000033",
      START_GRID: 100, //Start grid draw.
      //ROWS and COLUMS canvas separation I, II, III, aVR, aVL, aVF, V1, V2, V3, V4, V5, V6
      ROWS: 6,
      COLUMS: 2,
      columsText: [
        ["I", "II", "III", "aVR", "aVL", "aVF"], //Colum 1
        ["V1", "V2", "V3", "V4", "V5", "V6"], // Colum 2
      ],
    };
    //Canvas resize:
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;

    this.configuration.BLOCK_SIZE = this.configuration.CELL_SIZE * 5;
    //Frequency data dcm:
    this.configuration.FREQUENCY = dataMg.samplingFrequency;
  }

  /**
   * Draw a line from point (x1, y1) to point (x2, y2)
   */
  drawLine(x1, y1, x2, y2) {
    this.ctx.moveTo(x1, y1);
    this.ctx.lineTo(x2, y2);
  }

  //GET Methods:
  /**
   * Returns the cell size
   *
   * @return the cell size
   */
  getCellSize() {
    return this.configuration.CELL_SIZE;
  }

  /**
   * Returns the block size
   *
   * @return the block size
   */
  getBlockSize() {
    return 5 * this.configuration.CELL_SIZE;
  }

  /**
   * Returns the number of cells per period
   *
   * @return the number of cells per period
   */
  getCellsPerPeriod() {
    return Math.floor(this.Width() / this.CellSize());
  }

  /**
   * Returns the number of samples per cell
   *
   * @return the number of samples per cell
   */
  getSamplesPerCell() {
    return 0.04 * this.SamplingRate();
  }

  /**
   * Returns the number of samples per second
   *
   * @return the number of samples per second
   */
  getSamplingRate() {
    return this.configuration.SAMPLING_RATE;
  }

  /**
   * Returns the number of samples per period
   *
   * @return the number of samples per period
   */
  getSamplesPerPeriod() {
    return Math.floor(
      0.04 * this.SamplingRate() * (this.Width() / this.CellSize())
    );
  }

  /**
   * Returns the width of this electrocardiogram
   *
   * @return the width of this electrocardiogram
   */
  getWidth() {
    return this.ctx.canvas.width;
  }

  /**
   * Returns the height of this electrocardiogram
   *
   * @return the height of this electrocardiogram
   */
  getHeight() {
    return this.ctx.canvas.height;
  }

  /**
   * Returns the period (seconds) of this electrocardiogram
   *
   * @return the period of this electrocardiogram
   */
  getPeriod() {
    return (0.04 * this.Width()) / this.CellSize();
  }
}
export default GenericCanvas;
