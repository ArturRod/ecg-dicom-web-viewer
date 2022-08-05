import Constants from "../constants/Constants";
import ReadECGData from "../utils/ReadECGData";
import DrawGridCanvas from "../draw/DrawGridCanvas";
class DicomECGViewer {
  /**
   * Create Viwer
   * @param {*} dataDICOMarrayBuffer DICOM DCM ECG Array Buffer.
   * @param {*} idView Draw ID View.
   * @param {*} patientData Patient Data, default null: patientData = { NAME: name, PATIENT_ID: id, BIRTH: birth, SEX:sex, DATE:date, DESCRIPTION: description }
   * @param {*} nameView Identifier of the view you want to put, in case you have several views, default 0.
   */
  constructor(
    dataDICOMarrayBuffer,
    idView,
    patientData = null,
    nameView = "0"
  ) {
    this.dataDICOMarrayBuffer = dataDICOMarrayBuffer;
    this.idView = idView;
    this.nameView = nameView;
    this.patientData = patientData;
  }
  /**
 * Load canva data.
 */
  loadCanvas() {
    try{
      //Load DOM canva:
      this.loadCanvasDOM(); 

      //DataSet:
      let dataSet = ReadECGData.getDataSet(this.dataDICOMarrayBuffer);
      //Read data from dataSet:
      let dataMg = ReadECGData.readData(dataSet);

      //Draw template:
      let gridCanvas = new DrawGridCanvas(this.idView + this.nameView, dataMg);

      //Draw compatible:
      switch (dataMg.sopClassUID) {
        case Constants.SOP_CLASS_UIDS.HemodynamicWaveformStorage: //Hemodynamic Waveform Storage
          gridCanvas.drawGrid();
          break;
        case Constants.SOP_CLASS_UIDS.AmbulatoryECGWaveformStorage: //Ambulatory
          gridCanvas.drawNoCompatible();
          break;
        case Constants.SOP_CLASS_UIDS.GeneralECGWaveformStorage: //General ECG Waveform Storage
          gridCanvas.drawGrid();
          break;
        case Constants.SOP_CLASS_UIDS.Sop12LeadECGWaveformStorage: //12-lead ECG Waveform Storage
          gridCanvas.drawGrid();
          break;
        default:
          gridCanvas.drawNoCompatible();
          console.log("Unsupported SOP Class UID: " + sopClassUID);
      }
    } catch (err) {
      gridCanvas.drawNoCompatible();
    }
  }

  /**
   * Create struct of view.
   */
  loadCanvasDOM() {
    let view = "";
    document.getElementById(this.idView).innerHTML = view;
    view ='<canvas id="' + this.idView + this.nameView + '"/>';
    document.getElementById(this.idView).innerHTML = view;
  }


}
export default DicomECGViewer;
