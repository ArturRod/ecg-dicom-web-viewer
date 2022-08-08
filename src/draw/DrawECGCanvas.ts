import GenericCanvas from "./GenericCanvas";

/**
 * Draw line of ECG in canvas.
 */
class DrawECGCanvas extends GenericCanvas {
  constructor(id_canvas: string, dataMg: any) {
    super(id_canvas, dataMg);
  }
  /**
   * Draw curve with specified data
   */
  public drawCurve(data) {
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
  }
}
export default DrawECGCanvas;
