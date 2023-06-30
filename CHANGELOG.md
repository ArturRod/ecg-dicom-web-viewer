# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [2.0.8](https://github.com/ArturRod/ecg-dicom-web-viewer) (2023-06-30)

**Note:** Resolve fix: https://github.com/ArturRod/ecg-dicom-web-viewer/issues/9, If the data information arrives in the appropriate format, it is controlled, that is: I, II... without spaces without text Lead... If the dicom format does not arrive correctly for any reason, an alert will appear indicating this. This for the data format I, II, aVR...

## [2.0.7](https://github.com/ArturRod/ecg-dicom-web-viewer) (2023-06-21)

**Note:** New information is displayed, PR Interval, QRS Duration, QT/QTC...

## [2.0.6](https://github.com/ArturRod/ecg-dicom-web-viewer) (2023-06-21)

**Note:** Resolve fix: https://github.com/ArturRod/ecg-dicom-web-viewer/issues/8#issue-1765695154, remove white spaces and special characters: u\0000, \x00..., and update packages.

## [2.0.5](https://github.com/ArturRod/ecg-dicom-web-viewer) (2023-06-20)

**Note:** The DOMPurify library is implemented to prevent XSS attacks on information div.

## [2.0.4](https://github.com/ArturRod/ecg-dicom-web-viewer) (2023-06-19)

**Note:** It corrects errors, a new way of displaying the data is generated based on dcmjs instead of dicom-parse. More data is shown and legibility is more complete.
Part of the project code is implemented: (https://github.com/PantelisGeorgiadis/dcmjs-ecg) whose author is: (PantelisGeorgiadis)

## [2.0.3](https://github.com/ArturRod/ecg-dicom-web-viewer) (2023-05-29)

**Note:** Update packages.

## [2.0.2](https://github.com/ArturRod/ecg-dicom-web-viewer) (2022-10-06)

**Note:** The DOMPurify library is implemented to prevent XSS attacks on data entry idView and nameView.

## [2.0.1](https://github.com/ArturRod/ecg-dicom-web-viewer) (2022-08-24)

**Note:** Repair bug -> https://github.com/ArturRod/ecg-dicom-web-viewer/issues/2

## [2.0.0](https://github.com/ArturRod/ecg-dicom-web-viewer) (2022-08-24)

**Note:** The view and rendering with canvas is implemented. This allows to change the amplitude and the time (mm/mV, mm/s) It is also allowed to pan, and zoom.
Rendering is faster and allows more options for the future. The project is passed to Typescript.

## [1.0.6](https://github.com/ArturRod/ecg-dicom-web-viewer) (2022-08-09)

**Note:** It is no longer necessary to pass the user data, these will be read from the arraybyte file itself.

## [1.0.5](https://github.com/ArturRod/ecg-dicom-web-viewer) (2022-08-04)

**Note:** Add Documentation.

## [1.0.4](https://github.com/ArturRod/ecg-dicom-web-viewer) (2022-08-04)

**Note:** Bug Fix Render View.

## [1.0.3](https://github.com/ArturRod/ecg-dicom-web-viewer) (2022-08-03)

**Note:** Bug Fix Render View.

## [1.0.2](https://github.com/ArturRod/ecg-dicom-web-viewer) (2022-08-03)

**Note:** Bug Fix Render View.

## [1.0.1](https://github.com/ArturRod/ecg-dicom-web-viewer) (2022-08-03)

**Note:** Bug Fix.

## [1.0.0](https://github.com/ArturRod/ecg-dicom-web-viewer) (2022-08-03)

**Note:** Create proyect.
