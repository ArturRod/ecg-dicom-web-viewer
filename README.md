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
<h5><strong>ReadECGData</strong></h3>
  <h6>Method static <strong>readData(dataSet)</strong></h4>
  <p>Receives a dataSet data structure and returns a readable array.</p>
<h5><strong>DrawGraphs</strong></h5>
  <h6>Method <strong>drawData()</strong></h6>
  <p>Allows you to draw the ECG graph.</p>
  <h6>Method <strong>noCompatible()</strong></h6>
  <p>If the ECG is not compatible it will draw an incompatibility view.</p>
  <h6>Method <strong>drawLoader() & removeLoader()</strong></h6>
  <p>Draw or erase a spinner while loading data.</p>
  
  


## Example

This module is distributed via [npm][npm-url] which is bundled with [node][node] and
should be installed as one of your project's `dependencies`:

```js
// To install the newest version
npm install --save ecg-dicom-web-viewer
```
