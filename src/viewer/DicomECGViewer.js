import "./DicomECGViewer.css";
import Constants from "../constants/Constants";
import DrawGraphs from "../utils/DrawGraphs";
import ReadECGData from "../utils/ReadECGData";
import DrawGridCanvas from "../utils/canvas/DrawGridCanvas";
import DrawECGCanvas from "../utils/canvas/DrawECGCanvas";
class DicomECGViewer {
  /**
   * Create Viwer
   * @param {*} dataDICOMarrayBuffer DICOM DCM ECG Array Buffer.
   * @param {*} canvas Draw ID View.
   * @param {*} patientData Patient Data, default null: patientData = { NAME: name, PATIENT_ID: id, BIRTH: birth, SEX:sex, DATE:date, DESCRIPTION: description }
   * @param {*} nameView Identifier of the view you want to put, in case you have several views, default 0.
   */
  constructor(
    dataDICOMarrayBuffer,
    canvas,
    patientData = null,
    nameView = "0"
  ) {
    this.dataDICOMarrayBuffer = dataDICOMarrayBuffer;
    this.canvas = canvas;
    this.nameView = "myWaveform" + nameView;
    this.patientData = patientData;
  }

  /**
   * Create struct of view.
   */
  createView() {
    let view = "";
    document.getElementById(this.canvas).innerHTML = view;
    if (this.patientData != null) {
      view =
        '<div class="waveform"><div class="wavedata"><div class="divTableBody"><div class="divTableRow"><div class="divTableCell">NAME: <i>' +
        this.patientData.NAME +
        '</i></div><div class="divTableCell">SEX: <i>' +
        this.patientData.SEX +
        '</i></div><div class="divTableCell">DATE: <i>' +
        this.patientData.DATE +
        '</i></div></div><div class="divTableRow"><div class="divTableCell">PATIENT ID: <i>' +
        this.patientData.PATIENT_ID +
        '</i></div><div class="divTableCell">DESCRIPTION: <i>' +
        this.patientData.DESCRIPTION +
        '</i></div></div><div class="divTableRow"><div class="divTableCell">BIRTH: <i>' +
        this.patientData.BIRTH +
        "</i></div></div></div></div><div id=" +
        this.nameView +
        ' /></div><div class="wavemenu" />';
    } else {
      view =
        '<div class="waveform"><div id=' +
        this.nameView +
        ' /><div class="wavemenu"/>';
    }
    document.getElementById(this.canvas).innerHTML = view;
    this.loadInstance();
  }

  /**
   * Load data and render ECG.
   */
  loadInstance() {
    try {
      let dataSet = ReadECGData.getDataSet(this.dataDICOMarrayBuffer);
      let sopClassUID = dataSet.string("x00080016");
      //Read data from dataSet:
      let dataMg = ReadECGData.readData(dataSet);
      //Crate instance drawGrahps:
      let drawGraphs;
      //make the image based on whether it is color or not
      switch (sopClassUID) {
        case Constants.SOP_CLASS_UIDS.HemodynamicWaveformStorage: //Hemodynamic Waveform Storage
          drawGraphs = new DrawGraphs(dataMg, this.nameView);
          drawGraphs.draw();
          break;
        case Constants.SOP_CLASS_UIDS.AmbulatoryECGWaveformStorage: //Ambulatory
          drawGraphs.noCompatible();
          break;
        case Constants.SOP_CLASS_UIDS.GeneralECGWaveformStorage: //General ECG Waveform Storage
          drawGraphs = new DrawGraphs(dataMg, this.nameView);
          drawGraphs.draw();
          break;
        case Constants.SOP_CLASS_UIDS.Sop12LeadECGWaveformStorage: //12-lead ECG Waveform Storage
          drawGraphs = new DrawGraphs(dataMg, this.nameView);
          drawGraphs.draw();
          break;
        default:
          drawGraphs.noCompatible();
          console.log("Unsupported SOP Class UID: " + sopClassUID);
      }
    } catch (err) {
      let drawGraphs = new DrawGraphs("", this.nameView);
      drawGraphs.noCompatible();
    }
  }

  createCanvas() {
    let dataSet = ReadECGData.getDataSet(this.dataDICOMarrayBuffer);
    let dataMg = ReadECGData.readData(dataSet);

    //Draw template:
    let gridCanvas = new DrawGridCanvas(this.canvas, dataMg);
    gridCanvas.drawGrid();

    //Draw lines:
    let curveCanvas = new DrawECGCanvas(dataMg);
  }
}
export default DicomECGViewer;
