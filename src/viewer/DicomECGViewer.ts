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
        //Read wave information disponibility:
        let informationWave = this.ReadInformationWave(waveinformation);
        let information = {
          //Study Information:
          Name: readECG.elements.PatientName || '',
          Sex: readECG.elements.Sex || '',
          Size: readECG.elements.PatientSize || '',
          Id: readECG.elements.PatientID || '',
          Age: readECG.elements.PatientAge || '',
          Weight: readECG.elements.PatientWeight || '',
          Date: readECG.elements.StudyDate || '',
          Birth: readECG.elements.PatientBirthDate || '',
          //Wave Information:
          Duration: informationWave.Duration || '',
          VRate: informationWave.VRate || '',
          PR: informationWave.PR || '',
          QR: informationWave.QR || '',
          QTQTC: informationWave.QTQTC || '',
          prtAxis: informationWave.prtAxis || '',
          frequency: informationWave.frequency || '',
          annotations: informationWave.annotations || ''
        }
        //Load information:
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


  //Read Waveforminformation to html:
  private ReadInformationWave(waveinformation){
    //Duration:
    let duration = waveinformation.find(o => o.key === 'Duration');
    let durationText = 'undefined';
    if(duration != undefined){
      durationText = duration.value + ' ' + duration.unit;
    }
    //VRate BPM:
    let vRate = waveinformation.find(o => o.key === 'VRate');
    let vRateText = 'undefined';
    if(vRate != undefined){
      vRateText = vRate.value + ' ' + vRate.unit;
    }
    //PR Intrerval:
    let prInterval = waveinformation.find(o => o.key === 'PR Interval');
    let prIntervalText = 'undefined';
    if(prInterval != undefined){
      prIntervalText = prInterval.value + ' ' + prInterval.unit;
    }
    //QR Duration:
    let qrDuration = waveinformation.find(o => o.key === 'QRS Duration');
    let qrDurationText = 'undefined';
    if(qrDuration != undefined){
      qrDurationText = qrDuration.value + ' ' + qrDuration.unit;
    }
    //QT/QTc:
    let qt = waveinformation.find(o => o.key === 'QT Interval');
    let qtc = waveinformation.find(o => o.key === 'QTc Interval');
    let qtqtcText = 'undefined';
    if(qt != undefined && qtc != undefined){
      qtqtcText = qt.value + "/" + qtc.value + ' ' + qtc.unit;
    }
    //P R T Axis
    let p = waveinformation.find(o => o.key === 'P Axis');
    let r = waveinformation.find(o => o.key === 'QRS Axis');
    let t = waveinformation.find(o => o.key === 'T Axis');
    let prtAxisText = 'undefined';
    if(p != undefined && r != undefined && t != undefined){
      prtAxisText = p.value + ' ' + r.value + ' ' + t.value;
    }
    //Sampling Frequency:
    let frequency = waveinformation.find(o => o.key === 'Sampling Frequency');
    let frequencyText = 'undefined';
    if(frequency != undefined){
      frequencyText = frequency.value + ' ' + frequency.unit;
    }
    //Annotations:
    let annotations = waveinformation.find(o => o.key === 'Annotation');
    let annotationsArray = []; //Array
    if(annotations != undefined){
      annotationsArray = annotations.value; //Array
    }

    let information = {
      Duration: durationText,
      VRate: vRateText,
      PR: prIntervalText,
      QR: qrDurationText,
      QTQTC: qtqtcText,
      prtAxis: prtAxisText,
      frequency: frequencyText,
      annotations: annotationsArray
    }

    //Return information:
    return information;
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
          '<div class="divTableCell">VENT RATE: <i>' + information.VRate + "</i></div>" +
          '<div class="divTableCell">QT/QTC: <i>' + information.QTQTC + "</i></div>" +
        "</div>" +
        '<div class="divTableRow">' +
          '<div class="divTableCell">PATIENT ID: <i>' + information.Id + "</i></div>" +
          '<div class="divTableCell">PATIENT AGE: <i>' + information.Age + "</i></div>" +
          '<div class="divTableCell">PATIENT WEIGHT: <i>' + information.Weight + "</i></div>" +
          '<div class="divTableCell">PR INTERVAL: <i>' + information.PR + "</i></div>" +
          '<div class="divTableCell">P-R-T AXES: <i>' + information.prtAxis + "</i></div>" +
        "</div>" +
        '<div class="divTableRow">' +
          '<div class="divTableCell">DATE: <i>' + information.Date + "</i></div>" +
          '<div class="divTableCell">BIRTH: <i>' + information.Birth + "</i></div>" +
          '<div class="divTableCell">DURATION: <i>' + information.Duration + "</i></div>" +
          '<div class="divTableCell">QRS DURATION: <i>' + information.QR + "</i></div>" +
          '<div class="divTableCell">FREQUENCY: <i>' + information.frequency + "</i></div>" +
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
