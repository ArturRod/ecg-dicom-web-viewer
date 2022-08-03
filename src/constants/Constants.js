const uV = {
  min: -500,
  max: 1500,
  deltaMain: 500,
  deltaSecondary: 100,
};

const mV = {
  min: -0.5,
  max: 1.5,
  deltaMain: 0.5,
  deltaSecondary: 0.1,
};

const mmHg = {
  min: 0,
  max: 200,
  deltaMain: 100,
  deltaSecondary: 20,
};

const SOP_CLASS_UIDS = {
  Sop12LeadECGWaveformStorage: '1.2.840.10008.5.1.4.1.1.9.1.1',
  GeneralECGWaveformStorage: '1.2.840.10008.5.1.4.1.1.9.1.2',
  AmbulatoryECGWaveformStorage: '1.2.840.10008.5.1.4.1.1.9.1.3',
  HemodynamicWaveformStorage: '1.2.840.10008.5.1.4.1.1.9.2.1',
};

export default { uV, mV, mmHg, SOP_CLASS_UIDS };
