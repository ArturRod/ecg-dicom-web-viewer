# ecg-dicom-web-viewer

This library allows viewing an ECG file in DICOM format in web view. </br>

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
import {
  ReadECG, //Optional.
  Constants, //Optional.
  DicomECGViewer, //Principal.
} from "ecg-dicom-web-viewer";
```

2. Instantiate the new class with the necessary data and create the view.

```js
//Load view:
let viewer = new DicomECGViewer(
  byteArray, //Data array ECG (XMLHttpRequest response array or...local open data)
  divView, //Div where to draw the view
  viewportIndex //View number, since you can have several views.
);
viewer.loadCanvas(); // Load canvas view.
```

## Result

<img src="https://github-production-user-asset-6210df.s3.amazonaws.com/86238895/247515793-53009cc0-8aa8-4e91-bfb1-95ee89ff3d94.png"/>

## Documentation

Currently it works:</br>

<ul>
  <li><strong>Sop12LeadECGWaveformStorage: '1.2.840.10008.5.1.4.1.1.9.1.1', --> YES</strong></li>
  <li><strong>GeneralECGWaveformStorage: '1.2.840.10008.5.1.4.1.1.9.1.2', --> YES</strong></li>
  <li><strong>AmbulatoryECGWaveformStorage: '1.2.840.10008.5.1.4.1.1.9.1.3', --> YES</strong></li>
  <li><strong>HemodynamicWaveformStorage: '1.2.840.10008.5.1.4.1.1.9.2.1', --> YES</strong></li>
  <li><strong>CardiacElectrophysiologyWaveformStorage: '1.2.840.10008.5.1.4.1.1.9.2.1', --> YES</strong></li>
</ul>
The next available classes are as follows:
<li><strong>Class DicomECGViewer</strong></li>
  <h6> - <strong>constructor(dataDICOMarrayBuffer, idView, nameView)</strong></h4>
  <p><strong>dataDICOMarrayBuffer</strong> DICOM DCM ECG Array Buffer.</p>
  <p><strong>idView</strong> Draw ID View. Recomended a div.</p>
  <p><strong>nameView</strong> Identifier of the view you want to put, in case you have several views, default 0.</p>
  <h6> - <strong>loadCanvas()</strong></h4>
  <p>Main method, draws the canvas and its entire view.</p>
<li><strong>Class ReadECG</strong></li>
  <h6> - <strong>ReadECG(this.dataDICOMarrayBuffer, '', opts)</strong></h4>
  <p>Receives a dataSet data structure and returns a readable array.</p>
  <p><strong>opts</strong>speed: 25, amplitude: 10, applyLowPassFilter: true</p>
  <h6> - <strong>getWaveform()</strong></h4>
  <p>Read the arraydicombuffer and return legible data.</p>
  <h6> - <strong>getInfo()</strong></h4>
  <p>Read the arraydicombuffer and return information data, example: BPM, Name, Duration ECG...</p>
<li><strong>Static Constants</strong></li>
  <p>SOP UID of ECG types and graph measurements.</p>
<li><strong>Class GenericCanvas</strong></li>
  <p>It is the generic class for the canvas, it contains the values ​​of the number of views, canvas size, rows, columns, grid size...</p>
<li><strong>Class DrawECGCanvas extends GenericCanvas</strong></li>
  <p>This class renders the data, both the grid and the view, it also contains the button events.</p>

## Features

<ul>
  <li><strong>Improve canvas scrolling performance.</strong></li>
</ul>
