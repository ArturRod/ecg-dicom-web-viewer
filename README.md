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
<h3>ReadECGData</h3>
  <h4>Method static readData(dataSet)</h4>
  <p>Receives a dataSet data structure and returns a readable array.</p>
<h3>DrawGraphs</h3>
  <h4>Method drawData()</h4>
  <p>Allows you to draw the ECG graph.</p>
  <h4>Method noCompatible()</h4>
  <p>If the ECG is not compatible it will draw an incompatibility view.</p>
  <h4>Method drawLoader() & removeLoader()</h4>
  <p>Draw or erase a spinner while loading data.</p>
  
  


## Example

This module is distributed via [npm][npm-url] which is bundled with [node][node] and
should be installed as one of your project's `dependencies`:

```js
// To install the newest version
npm install --save ecg-dicom-web-viewer
```
