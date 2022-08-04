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
  <h6>Method static <strong>readData(dataSet)</strong></h4>
  <p>Receives a dataSet data structure and returns a readable array.</p>
<li><strong>Class DrawGraphs</strong></li>
  <h6>Method <strong>drawData()</strong></h6>
  <p>Allows you to draw the ECG graph.</p>
  <h6>Method <strong>noCompatible()</strong></h6>
  <p>If the ECG is not compatible it will draw an incompatibility view.</p>
  <h6>Method <strong>drawLoader() & removeLoader()</strong></h6>
  <p>Draw or erase a spinner while loading data.</p>
  <h6>Method <strong>addDOMChart()</strong></h6>
  <p>Draws the data structure in the DOM.</p>
  <h6>Method <strong>drawLine()</strong></h6>
  <p>Draw the lines of the ECG.</p>
  <h6>Method <strong>bindChart(chartId, channelData, yAxis)</strong></h6>
  <p>Create and generate the line with the c3 library.</p>
<li><strong>Static Constants</strong></li>
  <p>SOP UID of ECG types and graph measurements.</p>

## Example

This module is distributed via [npm][npm-url] which is bundled with [node][node] and
should be installed as one of your project's `dependencies`:

```js
// To install the newest version
npm install --save ecg-dicom-web-viewer
```
