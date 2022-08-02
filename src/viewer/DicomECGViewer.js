import dicomParser from 'dicom-parser';
import './DicomECGViewer.css';
import graphicCalibration from '../constants/graphicCalibration';
import DrawGraphs from '../utils/DrawGraphs';
import ReadECGData from '../utils/ReadECGData';

class DicomECGViewer {

    constructor(dataDICOMarrayBuffer, canvas, nameView){
        this.dataDICOMarrayBuffer = dataDICOMarrayBuffer;
        this.nameView = nameView;
        this.canvas = canvas;
        this.readECGData = new ReadECGData();
      }



    //Create view
    createView(){
        let id = 'myWaveform' +  this.nameView;
        //Patient data:
        /*let name = this.dataSet.studies[0].PatientName;
        let sex = this.dataSet.studies[0].PatientSex;
        let date = this.dataSet.studies[0].StudyDate;
        let patientID = this.dataSet.studies[0].PatientID;
        let desciption = this.dataSet.studies[0].StudyDescription;
        let birth = this.dataSet.studies[0].PatientBirthDate;*/
        document.getElementById(this.canvas).innerHTML = "";
        let view = '<div className="waveform"><div className="wavedata"><div className="divTableBody"><div className="divTableRow"><div className="divTableCell">NAME: <i>{name}</i></div><div className="divTableCell">SEX: <i>{sex}</i></div><div className="divTableCell">DATE: <i>{date}</i></div></div><div className="divTableRow"><div className="divTableCell">PATIENT ID: <i>{patientID}</i></div><div className="divTableCell">DESCRIPTION: <i>{desciption}</i></div></div><div className="divTableRow"><div className="divTableCell">BIRTH: <i>{birth}</i></div></div></div></div><div id=' + id + ' /></div><div className="wavemenu" />';
        document.getElementById(this.canvas).innerHTML = view;
        this.loadInstance();

    }

  /**
   * Load data:
   */
  loadInstance() {
    try {
      this.dataSet = dicomParser.parseDicom(new Uint8Array(this.dataDICOMarrayBuffer));
      let sopClassUID = this.dataSet.string('x00080016');
      //Read data from dataSet:
      let dataMg = this.readECGData.readData(this.dataSet);
      //Crate instance drawGrahps:
      let drawGraphs;
      //make the image based on whether it is color or not
      switch (sopClassUID) {
        case graphicCalibration.SOP_CLASS_UIDS.HemodynamicWaveformStorage: //Hemodynamic Waveform Storage
          drawGraphs = new DrawGraphs(dataMg, this.nameView);
          drawGraphs.draw();
          break;
        case graphicCalibration.SOP_CLASS_UIDS.AmbulatoryECGWaveformStorage: //Ambulatory
          drawGraphs.noCompatible();
          break;
        case graphicCalibration.SOP_CLASS_UIDS.GeneralECGWaveformStorage: //General ECG Waveform Storage
          drawGraphs = new DrawGraphs(dataMg, this.nameView);
          drawGraphs.draw();
          break;
        case graphicCalibration.SOP_CLASS_UIDS.Sop12LeadECGWaveformStorage: //12-lead ECG Waveform Storage
          drawGraphs = new DrawGraphs(dataMg, this.nameView);
          drawGraphs.draw();
          break;
        default:
          drawGraphs.noCompatible();
          console.log('Unsupported SOP Class UID: ' + sopClassUID);
      }
    }
    catch(err){
      let drawGraphs = new DrawGraphs("", this.nameView);
      drawGraphs.noCompatible();
    }
  }
}
export default DicomECGViewer;