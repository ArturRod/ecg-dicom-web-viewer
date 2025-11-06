# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guideline
s.
## [2.1.4](https://github.com/ArturRod/ecg-dicom-web-viewer) (2025-11-06)

**Note:** Issues identified:
The lines were not visible at startup because the thicknesses (0.1, 0.2) were less than 1 physical pixel → they were either anti-aliased or disappeared.
When zooming, the browser increased the device Pixel Ratio (DPR) → the subpixel lines then occupied actual pixels and became visible.
The line thicknesses (CELL_WIDTH, BLOCK_WIDTH) were defined in canvas pixels, not in actual millimeters, so there was no consistency across screens.

Solution: The ECG grid appears complete from the first render, without waiting for zooming.
The actual 1 mm / 5 mm cell/block ratio is maintained.
The thin/thick thicknesses are visibly distinct and consistent.
The grid looks the same on standard displays, Retina displays, and at different zoom levels.

Other improvements:
Commit 740a9ff (https://github.com/ArturRod/ecg-dicom-web-viewer/commit/740a9ff7aff77589bd6a605aba9260a4f72ed8b0)
Add .prettierrc for consistent formatting
Add reset and center buttons
Add context menu for canvas
Package update
Dcmjs needs updating from ^0.37.0 to ^0.45.0, as it's causing errors with the new version and needs fixing. (Future update)

## [2.1.3](https://github.com/ArturRod/ecg-dicom-web-viewer) (2025-10-04)

**Note:** Improve waveform parsing and silent failures (#19) (https://github.com/ArturRod/ecg-dicom-web-viewer/pull/19 by @MomenAbdelwadoud)
Improve part 10 parsing and waveform sequence handling
Fix overlapping for zoom controls for big headers
Fix unit detection for ECG signal conversion
Updated the handling of units to correctly interpret "mv" as microvolt based on sensitivity values.
Added checks for channel sensitivity to determine if "mv" should be treated as microvolt or millivolt.
Ensured proper conversion from microvolt to millivolt when necessary.

## [2.1.2](https://github.com/ArturRod/ecg-dicom-web-viewer) (2025-01-08)

**Note:** Added in constants SPLINE - Generates interpolation in the ECG view with a spline, enabled by default, may affect performance.
Advantages of Using Splines in an ECG:
Smoothness: Splines can make ECG lines look smoother and more continuous, which can be more pleasing to the eye and easier to interpret.
Interpolation: If the sample data has large intervals, splines can interpolate the points in between, providing a more continuous representation of the signal.
Zoom: When zooming, splines can help maintain the continuity of the lines, preventing individual points from being seen.
Disadvantages of Using Splines in an ECG
Accuracy: In some cases, splines can over-smooth the signal, obscuring important details that could be clinically relevant.
Complexity: Implementing splines adds complexity to the code and can require more computational resources.

Tension (tension = 0.5)
The tension in a cardinal spline controls the stiffness of the curve. A tension value of 0.5 is a good middle ground that provides a smooth curve without being too stiff or too loose.
Low Tension (close to 0): The curve will be looser and smoother, but may deviate more from the control points.
High Tension (close to 1): The curve will be stiffer and will fit closer to the control points, but may appear more angular.
A value of 0.5 is chosen as a compromise between smoothness and accuracy, providing a curve that is visually pleasing and follows the control points reasonably well.
Number of Segments (numOfSegments = 16)
The number of segments determines how many intermediate points are calculated between each pair of control points. A value of 16 is a good balance between curve accuracy and performance.
Fewer Segments (low value): The curve will be less accurate and more angular, but the calculation will be faster.
More Segments (high value): The curve will be more accurate and smoother, but the calculation will be slower.
A value of 16 provides a smooth and accurate curve without requiring too many computational resources, which is important to maintain good performance, especially in real-time applications such as ECG visualization.

## [2.1.1](https://github.com/ArturRod/ecg-dicom-web-viewer) (2025-01-02)

**Note:** Added in constants KEY_UNIT_INFO - These are the data to be displayed/read from the ECG. Only the data that has values ​​will be shown, otherwise nothing will appear. They must always be in capital letters so that they are detected well. It can be customized according to the needs to be displayed in the ECG view. 

## [2.1.0](https://github.com/ArturRod/ecg-dicom-web-viewer) (2025-01-02)

**Note:** Added in constants WAVE_FORM_BITS_STORED - ECG bits (Accuracy and quality of the recorded signal), can be 8 (missing test), 12 (missing test), 16 (OK) and 24 (missing test). This is done to support different ECG qualities. Update packages.

## [2.0.9](https://github.com/ArturRod/ecg-dicom-web-viewer) (2024-11-19)

**Note:** Update packages and correct small error when analyzing millivolts.

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
