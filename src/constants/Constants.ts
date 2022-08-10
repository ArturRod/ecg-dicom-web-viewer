//Microvolt:
const uV = {
  name: "mv",
  min: -500,
  max: 1500,
  deltaMain: 500,
  deltaSecondary: 100,
};

const mV = {
  name: "mV",
  min: -0.5,
  max: 1.5,
  deltaMain: 0.5,
  deltaSecondary: 0.1,
};

const mmHg = {
  name: "mmHg",
  min: 0,
  max: 200,
  deltaMain: 100,
  deltaSecondary: 20,
};


const def = {
  name: "mv",
  min: -500,
  max: 1500,
  deltaMain: 500,
  deltaSecondary: 100,
};


//SOP:
const SOP_CLASS_UIDS = {
  Sop12LeadECGWaveformStorage: '1.2.840.10008.5.1.4.1.1.9.1.1', //YES
  GeneralECGWaveformStorage: '1.2.840.10008.5.1.4.1.1.9.1.2',  //YES
  AmbulatoryECGWaveformStorage: '1.2.840.10008.5.1.4.1.1.9.1.3', //NO
  HemodynamicWaveformStorage: '1.2.840.10008.5.1.4.1.1.9.2.1', //YES
};

export default { uV, mV, mmHg, def, SOP_CLASS_UIDS };
