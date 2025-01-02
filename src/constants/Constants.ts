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

export { SOP_CLASS_UIDS, WAVE_FORM_BITS_STORED};
