import Constants from "../constants/Constants";
import DrawECGCanvas from "../draw/DrawECGCanvas";
import ReadECG from "../utils/ReadECG"; //Development
import './Style.css';
import * as DOMPurify from 'dompurify';

/**
 * Principal Class to render ECG viewer.
 */
class DicomECGViewer {
  private dataDICOMarrayBuffer: ArrayBuffer;
  private idView: string;
  private nameView: string;
  /**
   * Create Viewer
   * @param {*} dataDICOMarrayBuffer DICOM DCM ECG Array Buffer.
   * @param {*} idView Draw ID View.
   * @param {*} nameView Identifier of the view you want to put, in case you have several views, default 0.
   */
  constructor(
    dataDICOMarrayBuffer: ArrayBuffer,
    idView: string,
    nameView: "0"
  ) {
    this.dataDICOMarrayBuffer = dataDICOMarrayBuffer;
    //Sanitize string for posivility attacks XSS:
    this.idView = DOMPurify.sanitize(idView);
    this.nameView = DOMPurify.sanitize(nameView);
  }

  /**
   * Development new read and render.
   */
  public loadCanvas(){
    //Optiones default:
    let opts = {
      speed: 25, //Default
      amplitude: 10, //Defualt
      applyLowPassFilter: true,
    };
    let readECG = new ReadECG(this.dataDICOMarrayBuffer, '', opts);
    //Correct data:
    if(readECG != null){
      let waveform = readECG.getWaveform();
      let waveinformation = readECG.getInfo();

      //Load canvas structure:
      if(waveform != null && waveinformation != null){
        //Duration:
        let duration = waveinformation.find(o => o.key === 'Duration');
        let durationText = '';
        if(duration != undefined){
          durationText = duration.value + duration.unit;
        }
        //BPM:
        let bpm = waveinformation.find(o => o.key === 'VRate');
        let bpmText = '';
        if(bpm != undefined){
          bpmText = bpm.value;
        }

        //Load information:
        let information = {
          Name: readECG.elements.PatientName,
          Sex: readECG.elements.Sex,
          Size: readECG.elements.PatientSize,
          Id: readECG.elements.PatientID,
          Age: readECG.elements.PatientAge,
          Weight: readECG.elements.PatientWeight,
          Date: readECG.elements.StudyDate,
          Birth: readECG.elements.PatientBirthDate,
          Duration: durationText,
          BPM: bpmText
        }
        this.loadCanvasDOM(information);

        //Draw ECG:
        let ecgCanvas = new DrawECGCanvas(this.idView + this.nameView, waveform);
        //SOP CLASS UID COMPATIBLE:
        if(Constants.SOP_CLASS_UIDS.includes(readECG.elements.SOPClassUID)){
          ecgCanvas.draw();
        }
        else{
          ecgCanvas.drawNoCompatible();
        }
      
      }
    }
    else{
      alert("ECG NO COMPATIBLE")
    }
  }


   /**
   * Create struct of view.
   */
   private loadCanvasDOM(information) {
    let view = "";
    document.getElementById(this.idView).innerHTML = view;
    view = DOMPurify.sanitize(
    '<div id="infoECG">' +
      '<div id="divTableBody">' +
        '<div class="divTableRow">' +
          '<div class="divTableCell">NAME: <i>' + information.Name + "</i></div>" +
          '<div class="divTableCell">SEX: <i>' + information.Sex + "</i></div>" +
          '<div class="divTableCell">PATIENT SIZE: <i>' + information.Size + "</i></div>" +
          '<div class="divTableCell">BPM: <i>' + information.BPM + "</i></div>" +
        "</div>" +
        '<div class="divTableRow">' +
          '<div class="divTableCell">PATIENT ID: <i>' + information.Id + "</i></div>" +
          '<div class="divTableCell">PATIENT AGE: <i>' + information.Age + "</i></div>" +
          '<div class="divTableCell">PATIENT WEIGHT: <i>' + information.Weight + "</i></div>" +
        "</div>" +
        '<div class="divTableRow">' +
          '<div class="divTableCell">DATE: <i>' + information.Date + "</i></div>" +
          '<div class="divTableCell">BIRTH: <i>' + information.Birth + "</i></div>" +
          '<div class="divTableCell">DURATION: <i>' + information.Duration + "</i></div>" +
        "</div>" +
      "</div>" + 
      '<div id="toolsECG">' +
        '<div class="divTools">' +
          '<b>TIME: </b><i id="textTime"> 25mm/s </i>' +
          '<button id="timeLeft">&#8592</button>' +
          '<button id="timeRight">&#8594</button>' +
        '</div>'+
        '<div class="divTools">' +
          '<b>AMPLITUDE: </b><i id="textAmplitude"> 10mm/mV </i>' +
          '<button id="amplitudeDown">&#8595</button>' +
          '<button id="amplitudeUp">&#8593</button>' +
        '</div>'+
      '</div>' +
    '</div>' + 
    '<canvas id="' + this.idView + this.nameView + '" style="border-top: 2px solid #000000;"></canvas>' +
    '<div id="zoomButons">'+
      '<button id="plus">+</button>' +
      '<button id="minus">-</button>'+
    '</div>');

    document.getElementById(this.idView).innerHTML = view;
  }
}
export default DicomECGViewer;
