//SOP:
const SOP_CLASS_UIDS = [
  '1.2.840.10008.5.1.4.1.1.9.1.1', //Sop12LeadECGWaveformStorage
  '1.2.840.10008.5.1.4.1.1.9.1.2', //GeneralECGWaveformStorage
  '1.2.840.10008.5.1.4.1.1.9.1.3', //AmbulatoryECGWaveformStorage
  '1.2.840.10008.5.1.4.1.1.9.2.1', //HemodynamicWaveformStorage
  '1.2.840.10008.5.1.4.1.1.9.2.1', //CardiacElectrophysiologyWaveformStorage
];

//Bits ECG (Accuracy and quality of the recorded signal):
const WAVE_FORM_BITS_STORED = [
  8,  //Low Resolution, 256 different voltage levels.
  12, //Medium resolution, 4096 different voltage levels. (Clinical Applications)
  16, //High resolution, 65536 different voltage levels. (Investigations and Diagnoses)
  24, //Very high resolution, 16777216 different voltage levels. (Advanced Applications)
];

//Data to look for in the ECG, capital letters:
const KEY_UNIT_INFO = [
  { key: 'HEART RATE', unit: 'BPM' },
  { key: 'HR', unit: 'BPM' },
  { key: 'P DURATION', unit: 'ms' },
  { key: 'QT INTERVAL', unit: 'ms' },
  { key: 'QTC INTERVAL', unit: 'ms' },
  { key: 'RR INTERVAL', unit: 'ms' },
  { key: 'VRATE', unit: 'BPM' },
  { key: 'QRS DURATION', unit: 'ms' },
  { key: 'QRS AXIS', unit: '°' },
  { key: 'T AXIS', unit: '°' },
  { key: 'P AXIS', unit: '°' },
  { key: 'PR INTERVAL', unit: 'ms' },
  { key: 'ANNOTATION', unit: '' }, //Always ? 
  { key: 'SAMPLING FREQUENCY', unit: 'Hz' }, //Always.
  { key: 'DURATION', unit: 'sec' }, //Always.
  { key: 'SPEED', unit: 'mm/sec' }, //Always.
  { key: 'AMPLITUDE', unit: 'mm/mV' }, //Always.
];

export { SOP_CLASS_UIDS, WAVE_FORM_BITS_STORED, KEY_UNIT_INFO};
