import GenericCanvas from "./GenericCanvas";

/**
 * Draw line of ECG in canvas.
 */
class DrawECGCanvas extends GenericCanvas {
  constructor(id_canvas: string, dataMg: any) {
    super(id_canvas, dataMg);
  }

  public drawCurve(){
    let data = [];
    let secondsDraw = Math.floor((this.configuration.FREQUENCY/1000) % 60); //parse to seconds
    let time = 0;

    this.dataMg.channels[3].samples.forEach(element => {
      data.push(element);
    });

    //Reference line:
    let startY = this.configuration.START_GRID + 50;
    let startX = 10;
    this.drawLine(startX, startY, this.canvas.width, startY);
    this.ctx.stroke();

    let latestPosition = startY;
    let i = 0;
    while (i < data.length) {
      this.drawLine(startX + time, latestPosition, startX + time, startY - data[i]);
      this.ctx.stroke();
      latestPosition = startY - data[i];
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
}
export default DrawECGCanvas;
