# ecg-dicom-web-viewer

This library allows viewing an ECG file in DICOM format in web view. </br>
Thanks to the author https://github.com/jap1968 in his project https://github.com/jap1968/dcm-waveform since it is an adaptation of what has been done.
- NPM: https://www.npmjs.com/package/ecg-dicom-web-viewer

## Installation

This module is distributed via [npm][npm-url] which is bundled with [node][node] and
should be installed as one of your project's `dependencies`:

```js
// To install the newest version
npm install --save ecg-dicom-web-viewer
```

## Example

1. Once installed import the project.
```js
// Import
import { ReadECGData, DrawGraphs, Constants, DicomECGViewer } from 'ecg-dicom-web-viewer';
```
2. Instantiate the new class with the necessary data and create the view.
```js
//User data (optional)
let userData = {
  NAME: name,
  SEX: sex,
  DATE: date,
  PATIENT_ID: patientID,
  DESCRIPTION: desciption,
  BIRTH: birth,
};

//Load view:
let viewer = new DicomECGViewer(
  byteArray, //Data array ECG (XMLHttpRequest response array or...local open data) 
  divView, //Div where to draw the view
  userData, //Optional
  viewportIndex //View number, since you can have several views.
);
viewer.createView(); // Create graph.
```
## Result

<img src="https://user-images.githubusercontent.com/86238895/182796938-24c66b88-0225-4756-95fd-523554d65e57.png"/>

## Documentation
Currently it works:</br>
<ul>
  <li><strong>Sop12LeadECGWaveformStorage: '1.2.840.10008.5.1.4.1.1.9.1.1', --> YES</strong></li>
  <li><strong>GeneralECGWaveformStorage: '1.2.840.10008.5.1.4.1.1.9.1.2', --> YES</strong></li>
  <li><strong>AmbulatoryECGWaveformStorage: '1.2.840.10008.5.1.4.1.1.9.1.3', --> NO SUPPORT</strong></li>
  <li><strong>HemodynamicWaveformStorage: '1.2.840.10008.5.1.4.1.1.9.2.1', --> YES</strong></li>
</ul>
The next available classes are as follows:
<li><strong>Class ReadECGData</strong></li>
  <h6> - <strong>readData(dataSet)</strong></h4>
  <p>Receives a dataSet data structure and returns a readable array.</p>
  <h6> - <strong>getDataSet(dataDICOMarrayBuffer)</strong></h4>
  <p>Read the arraydicombuffer and return dataSet.</p>
<li><strong>Class DrawGraphs</strong></li>
  <h6> - <strong>drawData()</strong></h6>
  <p>Allows you to draw the ECG graph.</p>
  <h6> - <strong>noCompatible()</strong></h6>
  <p>If the ECG is not compatible it will draw an incompatibility view.</p>
  <h6> - <strong>drawLoader() & removeLoader()</strong></h6>
  <p>Draw or erase a spinner while loading data.</p>
  <h6> - <strong>addDOMChart()</strong></h6>
  <p>Draws the data structure in the DOM.</p>
  <h6> - <strong>drawLine()</strong></h6>
  <p>Draw the lines of the ECG.</p>
  <h6> - <strong>bindChart(chartId, channelData, yAxis)</strong></h6>
  <p>Create and generate the line with the c3 library.</p>
<li><strong>Static Constants</strong></li>
  <p>SOP UID of ECG types and graph measurements.</p>
<li><strong>Class DicomECGViewer</strong></li>
  <h6> - <strong>constructor(dataDICOMarrayBuffer, canvas, patientData, nameView)</strong></h4>
  <p><strong>dataDICOMarrayBuffer</strong> DICOM DCM ECG Array Buffer.</p>
  <p><strong>canvas</strong> Draw ID View.</p>
  <p><strong>patientData</strong> Patient Data, default null: patientData = { NAME, PATIENT_ID, BIRTH, SEX, DATE, DESCRIPTION }</p>
  <p><strong>nameView</strong> Identifier of the view you want to put, in case you have several views, default 0.</p>
  <h6> - <strong>createView()</strong></h4>
  <p>Creates the ECG view from the data passed to it in the constructor.This is the main method to use in your project.</p>
  <h6> - <strong>loadInstance()</strong></h4>
  <p>Load the view according to the SOP UID.</p>
  
## Features
<ul>
  <li><strong>Generate the graph instead of using the c3 library (since it takes time to load), generate a canvas with the most personalized graph and actions such as scrolling or others.
Calibrate Sop12LeadECGWaveformStorage and GeneralECGWaveformStorage to make it look good.
