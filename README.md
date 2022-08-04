# ecg-dicom-web-viewer

This library allows viewing an ECG file in DICOM format in web view.

## Installation

This module is distributed via [npm][npm-url] which is bundled with [node][node] and
should be installed as one of your project's `dependencies`:

```js
// To install the newest version
npm install --save ecg-dicom-web-viewer
```
## Documentation

The next available classes are as follows:
<li><strong>Class ReadECGData</strong></li>
  <h6> - <strong>readData(dataSet)</strong></h4>
  <p>Receives a dataSet data structure and returns a readable array.</p>
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
  
  
## Example

This module is distributed via [npm][npm-url] which is bundled with [node][node] and
should be installed as one of your project's `dependencies`:

```js
// To install the newest version
npm install --save ecg-dicom-web-viewer
```
