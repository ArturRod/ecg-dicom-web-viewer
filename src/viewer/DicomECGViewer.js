import "./DicomECGViewer.css";
import Constants from "../constants/Constants";
import DrawGraphs from "../utils/DrawGraphs";
import ReadECGData from "../utils/ReadECGData";

class DicomECGViewer {
  /**
   * Create Viwer
   * @param {*} dataDICOMarrayBuffer DICOM DCM ECG Array Buffer.
   * @param {*} canvas Draw ID View.
   * @param {*} nameView Identifier of the view you want to put, in case you have several views, default 0.
   */
  constructor(dataDICOMarrayBuffer, canvas, nameView = "0") {
    this.dataDICOMarrayBuffer = dataDICOMarrayBuffer;
    this.canvas = canvas;
    this.nameView = "myWaveform" + nameView;
    this.dataMg;
  }

  /**
   * Create struct of view.
   */
  createView() {
    let view = "";
    debugger;
    document.getElementById(this.canvas).innerHTML = view;
    view =
      '<div class="waveform">' +
      '<div class="wavedata">' +
      '<div class="divTableBody">' +
      '<div class="divTableRow">' +
      '<div class="divTableCell">NAME: <i>' +
      this.dataMg.patientName +
      "</i></div>" +
      '<div class="divTableCell">SEX: <i>' +
      this.dataMg.sex +
      "</i></div>" +
      '<div class="divTableCell">PATIENT SIZE: <i>' +
      this.dataMg.patientSize +
      "</i></div>" +
      "</div>" +
      '<div class="divTableRow">' +
      '<div class="divTableCell">PATIENT ID: <i>' +
      this.dataMg.patientID +
      "</i></div>" +
      '<div class="divTableCell">PATIENT AGE: <i>' +
      this.dataMg.patientAge +
      "</i></div>" +
      '<div class="divTableCell">PATIENT WEIGHT: <i>' +
      this.dataMg.patientWeight +
      "</i></div>" +
      "</div>" +
      '<div class="divTableRow">' +
      '<div class="divTableCell">DATE: <i>' +
      this.dataMg.studyDate +
      "</i></div>" +
      '<div class="divTableCell">BIRTH: <i>' +
      this.dataMg.bithDate +
      "</i></div>" +
      "</div>" +
      "</div>" +
      "</div>" +
      '<div id="' +
      this.nameView +
      '" /></div><div class="wavemenu" />';
    document.getElementById(this.canvas).innerHTML = view;
  }

  /**
   * Load data and render ECG.
   */
  loadECG() {
    try {
      let dataSet = ReadECGData.getDataSet(this.dataDICOMarrayBuffer);
      //Read data from dataSet:
      this.dataMg = ReadECGData.readData(dataSet);
      //Create view:
      this.createView();
      //Crate instance drawGrahps:
      let drawGraphs;
      //make the image based on whether it is color or not
      switch (this.dataMg.sopClassUID) {
        case Constants.SOP_CLASS_UIDS.HemodynamicWaveformStorage: //Hemodynamic Waveform Storage
          drawGraphs = new DrawGraphs(this.dataMg, this.nameView);
          drawGraphs.draw();
          break;
        case Constants.SOP_CLASS_UIDS.AmbulatoryECGWaveformStorage: //Ambulatory
          drawGraphs.noCompatible();
          break;
        case Constants.SOP_CLASS_UIDS.GeneralECGWaveformStorage: //General ECG Waveform Storage
          drawGraphs = new DrawGraphs(this.dataMg, this.nameView);
          drawGraphs.draw();
          break;
        case Constants.SOP_CLASS_UIDS.Sop12LeadECGWaveformStorage: //12-lead ECG Waveform Storage
          drawGraphs = new DrawGraphs(this.dataMg, this.nameView);
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
}
export default DicomECGViewer;
