import * as DOMPurify from 'dompurify';
import { KEY_UNIT_INFO, SOP_CLASS_UIDS } from '../constants/Constants';
import DrawECGCanvas from '../draw/DrawECGCanvas';
import ReadECG from '../utils/ReadECG'; //Development
import './Style.css';

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
  constructor(dataDICOMarrayBuffer: ArrayBuffer, idView: string, nameView: '0') {
    this.dataDICOMarrayBuffer = dataDICOMarrayBuffer;
    //Sanitize string for posivility attacks XSS:
    this.idView = DOMPurify.sanitize(idView);
    this.nameView = DOMPurify.sanitize(nameView);
  }

  /**
   * Development new read and render.
   */
  public loadCanvas() {
    //Optiones default:
    let opts = {
      speed: 25, //Default
      amplitude: 10, //Defualt
      applyLowPassFilter: true
    };
    let readECG = new ReadECG(this.dataDICOMarrayBuffer, '', opts);
    //Correct data:
    if (readECG != null) {
      let waveform = readECG.getWaveform();
      let waveinformation = readECG.getInfo();
      //Load canvas structure:
      if (waveform != null && waveinformation != null) {
        //Read wave information disponibility:
        //Read information Patient:
        let informationPatient = {
          //Study Information:
          Name: readECG.elements.PatientName || '',
          Sex: readECG.elements.Sex || '',
          Size: readECG.elements.PatientSize || '',
          Id: readECG.elements.PatientID || '',
          Age: readECG.elements.PatientAge || '',
          Weight: readECG.elements.PatientWeight || '',
          Date: readECG.elements.StudyDate || '',
          Birth: readECG.elements.PatientBirthDate || ''
        };

        //Read information Wave:
        let informationWave = {};
        waveinformation.forEach(item => {
          informationWave[item.key] = `${item.value || ''} ${item.unit}`;
        });

        //Load information:
        this.loadCanvasDOM(informationPatient, informationWave);

        //Draw ECG:
        let ecgCanvas = new DrawECGCanvas(this.idView + this.nameView, waveform);
        //SOP CLASS UID COMPATIBLE:
        if (SOP_CLASS_UIDS.includes(readECG.elements.SOPClassUID)) {
          ecgCanvas.draw();
        } else {
          ecgCanvas.drawNoCompatible();
        }
      }
    } else {
      alert('ECG NO COMPATIBLE');
    }
  }

  //Load the data according to the view of the elements to be displayed configured in KEY_UNIT_INFO, return string html:
  //It will only show the information that contains data, if it is empty it will not be shown KEY: VALUE
  private loadKey_Unit(informationWave) {
    //First new row:
    let html = "<div class='divTableRow'>";
    let count = 0;
    for (let i = 0; i < KEY_UNIT_INFO.length; i++) {
      const key = KEY_UNIT_INFO[i].key;
      const value = informationWave[key];
      if (value !== undefined) {
        html += `<div class="divTableCell">${key}: <i>${value}</i></div>`;
        count += 1;
        //If it has 8 elements we create a new divTableRow
        if (count == 8) {
          html += "</div><div class='divTableRow'>";
          count = 0;
        }
      }
    }
    //Close divTableRow:
    html += '</div>';
    return html;
  }

  /**
   * Create struct of view.
   */
  private loadCanvasDOM(informationPatient, informationWave) {
    //Load the data KEY_UNIT_INFO:
    let htmlUnit = this.loadKey_Unit(informationWave);
    let view = '';
    document.getElementById(this.idView).innerHTML = view;
    view = DOMPurify.sanitize(
      '<div id="infoECG">' +
        '<div id="divTableBody">' +
        '<div class="divTableRow">' +
        '<div class="divTableCell">NAME: <i>' +
        informationPatient.Name +
        '</i></div>' +
        '<div class="divTableCell">SEX: <i>' +
        informationPatient.Sex +
        '</i></div>' +
        '<div class="divTableCell">PATIENT SIZE: <i>' +
        informationPatient.Size +
        '</i></div>' +
        '<div class="divTableCell">PATIENT AGE: <i>' +
        informationPatient.Age +
        '</i></div>' +
        '<div class="divTableCell">PATIENT WEIGHT: <i>' +
        informationPatient.Weight +
        '</i></div>' +
        '<div class="divTableCell">DATE: <i>' +
        informationPatient.Date +
        '</i></div>' +
        '<div class="divTableCell">BIRTH: <i>' +
        informationPatient.Birth +
        '</i></div>' +
        '<div class="divTableCell">PATIENT ID: <i>' +
        informationPatient.Id +
        '</i></div>' +
        '</div>' +
        htmlUnit +
        '</div>' +
        '<div id="toolsECG">' +
        '<div class="divTools">' +
        '<b>TIME: </b><i id="textTime"> 25mm/s </i>' +
        '<button id="timeLeft">&#8592</button>' +
        '<button id="timeRight">&#8594</button>' +
        '</div>' +
        '<div class="divTools">' +
        '<b>AMPLITUDE: </b><i id="textAmplitude"> 10mm/mV </i>' +
        '<button id="amplitudeDown">&#8595</button>' +
        '<button id="amplitudeUp">&#8593</button>' +
        '</div>' +
        '<div class="divTools">' +
        '<button id="resetButton">RESET</button>' +
        '<button id="centerButton">CENTER</button>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="ecgCanvasWrapper">' +
        '<canvas id="' +
        this.idView +
        this.nameView +
        '" class="ecgCanvas" style="border-top: 2px solid #000000;"></canvas>' +
        '<div id="zoomButons">' +
        '<button id="plus">+</button>' +
        '<button id="minus">-</button>' +
        '</div>' +
        '<div id="contextMenu" class="context-menu">' +
        '<button class="context-menu-item" id="contextCenter">Center</button>' +
        '<button class="context-menu-item" id="contextReset">Reset</button>' +
        '</div>' +
        '</div>'
    );

    document.getElementById(this.idView).innerHTML = view;
  }
}
export default DicomECGViewer;
