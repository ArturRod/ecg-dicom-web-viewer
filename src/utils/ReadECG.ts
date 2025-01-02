import { WAVE_FORM_BITS_STORED, KEY_UNIT_INFO } from "../constants/Constants";

const dcmjs = require('dcmjs');
const { DicomMetaDictionary, DicomMessage, ReadBufferStream, WriteBufferStream } = dcmjs.data;

const RenderingDefaults = {
    DefaultSpeed: 25.0, //25mm/s
    DefaultAmplitude: 10.0, //10mm/mV
};

/**
 * ReadECG.
 * --> https://dicom.nema.org/medical/dicom/current/output/html/part16.html
 * --> https://dicom.nema.org/medical/dicom/2017e/output/chtml/part06/chapter_6.html
 * Thanks to the author PantelisGeorgiadis in his project https://github.com/PantelisGeorgiadis/dcmjs-ecg since it is an adaptation of what has been done.
 */
class DicomEcg {
	public transferSyntaxUid: any;
	public elements: any;
  public opts: {
    speed: any,
    amplitude: any,
    applyLowPassFilter: any,
  };
  
  /**
   * Creates an instance of DicomEcg.
   * @constructor
   * @param {Object|ArrayBuffer} [elementsOrBuffer] - Dataset elements as object or encoded as a DICOM dataset buffer.
   * @param {string} [transferSyntaxUid] - Dataset transfer syntax.
   * @param {Object} [opts] - Rendering options.
   */
  constructor(elementsOrBuffer, transferSyntaxUid, opts) {
    //Load options:
    this._setOpts(opts);
    this.transferSyntaxUid = transferSyntaxUid || '1.2.840.10008.1.2';
    if (elementsOrBuffer instanceof ArrayBuffer) {
      if (transferSyntaxUid) {
        this.elements = this._fromElementsBuffer(elementsOrBuffer, transferSyntaxUid);
      } 
      else {
        const ret = this._fromP10Buffer(elementsOrBuffer);
        this.elements = ret.elements;
        this.transferSyntaxUid = ret.transferSyntaxUid;
      }
      return;
    }

    this.elements = elementsOrBuffer || {};
  }

  /**
   * Gets element value.
   * @method
   * @param {string} tag - Element tag.
   * @returns {string|undefined} Element value or undefined if element doesn't exist.
   */
  getElement(tag) {
    return this.elements[tag];
  }

  /**
   * Sets element value.
   * @method
   * @param {string} tag - Element tag.
   * @param {string} value - Element value.
   */
  setElement(tag, value) {
    this.elements[tag] = value;
  }

  /**
   * Gets all elements.
   * @method
   * @returns {Object} Elements.
   */
  getElements() {
    return this.elements;
  }

  /**
   * Gets DICOM transfer syntax UID.
   * @method
   * @returns {string} Transfer syntax UID.
   */
  getTransferSyntaxUid() {
    return this.transferSyntaxUid;
  }

  /**
   * Sets DICOM transfer syntax UID.
   * @method
   * @param {string} transferSyntaxUid - Transfer Syntax UID.
   */
  setTransferSyntaxUid(transferSyntaxUid) {
    this.transferSyntaxUid = transferSyntaxUid;
  }

  /**
   * Gets elements encoded in a DICOM dataset buffer.
   * @method
   * @returns {ArrayBuffer} DICOM dataset.
   */
  getDenaturalizedDataset() {
    const denaturalizedDataset = DicomMetaDictionary.denaturalizeDataset(this.getElements());
    const stream = new WriteBufferStream();
    DicomMessage.write(denaturalizedDataset, stream, this.transferSyntaxUid, {});

    return stream.getBuffer();
  }

  
    /**
     * Load options.
     * @method
     * @private
     */
    _setOpts(opts){
        this.opts = opts || {};
        this.opts.speed = opts.speed || RenderingDefaults.DefaultSpeed;
        this.opts.amplitude = opts.amplitude || RenderingDefaults.DefaultAmplitude;
        this.opts.applyLowPassFilter = opts.applyLowPassFilter || false;

        if (opts.millimeterPerSecond) {
          this.opts.speed = opts.millimeterPerSecond;
        }
        if (opts.millimeterPerMillivolt) {
          this.opts.amplitude = opts.millimeterPerMillivolt;
        }
    }

  /**
   * Gets Waveform DICOM dataset buffer.
   * @method
   * @returns {Waveform} DICOM Waveform.
   */
  getWaveform() {
    // Extract waveform
    const waveform = this._extractWaveform();
    return waveform;
  }

  /**
   * Gets Waveform Information DICOM dataset buffer.
   * @method
   * @returns {WaveformInfo} DICOM Waveform.
   */
  getInfo() {
    const waveform = this.getWaveform();
      // Extract waveform info
    const info = this._extractInformation(waveform);

    // Extract annotation
    const annotation = this._extractAnnotation();
    if (annotation.length > 0) {
      info.push({ key: 'ANNOTATION', value: annotation });
    }

    // Additional info
    info.push({ key: 'SAMPLING FREQUENCY', value: waveform.samplingFrequency, unit: 'Hz' });
    info.push({ key: 'DURATION', value: waveform.samples / waveform.samplingFrequency, unit: 'sec' });
    info.push({ key: 'SPEED', value: this.opts.speed, unit: 'mm/sec' });
    info.push({ key: 'AMPLITUDE', value: this.opts.amplitude, unit: 'mm/mV' });
    return info;
  }

  /**
   * Gets the ECG description.
   * @method
   * @returns {string} DICOM ECG description.
   */
  toString() {
    const str = [];
    str.push('DICOM ECG:');
    str.push('='.repeat(50));
    str.push(JSON.stringify(this.getElements()));

    return str.join('\n');
  }

  /**
   * Loads a dataset from p10 buffer.
   * @method
   * @private
   * @param {ArrayBuffer} arrayBuffer - DICOM P10 array buffer.
   * @returns {Object} Dataset elements and transfer syntax UID.
   */
  _fromP10Buffer(arrayBuffer) {
    const dicomDict = DicomMessage.readFile(arrayBuffer, { ignoreErrors: true });
    const meta = DicomMetaDictionary.naturalizeDataset(dicomDict.meta);
    const transferSyntaxUid = meta.TransferSyntaxUID;
    const elements = DicomMetaDictionary.naturalizeDataset(dicomDict.dict);

    return { elements, transferSyntaxUid };
  }

  /**
   * Loads a dataset from elements only buffer.
   * @method
   * @private
   * @param {ArrayBuffer} arrayBuffer - Elements array buffer.
   * @param {string} transferSyntaxUid - Transfer Syntax UID.
   * @returns {Object} Dataset elements.
   */
  _fromElementsBuffer(arrayBuffer, transferSyntaxUid) {
    const stream = new ReadBufferStream(arrayBuffer);
    // Use the proper syntax length (based on transfer syntax UID)
    // since dcmjs doesn't do that internally.
    let syntaxLengthTypeToDecode =
      transferSyntaxUid === '1.2.840.10008.1.2' ? '1.2.840.10008.1.2' : '1.2.840.10008.1.2.1';
    const denaturalizedDataset = DicomMessage._read(stream, syntaxLengthTypeToDecode, {
      ignoreErrors: true,
    });

    return DicomMetaDictionary.naturalizeDataset(denaturalizedDataset);
  }

  /**
   * Extracts waveform.
   * @method
   * @private
   * @returns {Object} Waveform.
   * @throws Error if WaveformSequence is empty and sample interpretation
   * or bits allocated values are not supported.
   */
  _extractWaveform() {
    const waveformSequence = this.getElement('WaveformSequence');
    if (
      waveformSequence === undefined ||
      !Array.isArray(waveformSequence) ||
      waveformSequence.length === 0
    ) {
      throw new Error('WaveformSequence is empty');
    }
    const waveformSequenceItem = waveformSequence.find((o) => o);
    if (waveformSequenceItem.WaveformSampleInterpretation !== 'SS') {
      throw new Error(
        `Waveform sample interpretation is not supported [${waveformSequenceItem.WaveformSampleInterpretation}]`
      );
    }
    if (waveformSequenceItem.WaveformBitsAllocated !== 16) {
      throw new Error(
        `Waveform bits allocated is not supported [${waveformSequenceItem.WaveformBitsAllocated}]`
      );
    }
    const waveform = {
      leads:'',
      minMax: 0,
      channelDefinitionSequence: waveformSequenceItem.ChannelDefinitionSequence,
      waveformData: waveformSequenceItem.WaveformData,
      channels: waveformSequenceItem.NumberOfWaveformChannels,
      samples: waveformSequenceItem.NumberOfWaveformSamples,
      samplingFrequency: waveformSequenceItem.SamplingFrequency,
      duration:
        waveformSequenceItem.NumberOfWaveformSamples / waveformSequenceItem.SamplingFrequency,
    };
    this._calculateLeads(waveform);
    this._sortLeads(waveform);

    return waveform;
  }

  /**
   * Calculates waveform leads.
   * @method
   * @private
   * @param {Object} waveform - Waveform.
   * @throws Error if waveform bits stored definition value is not supported.
   */
  _calculateLeads(waveform) {
    const channelDefinitionSequence = waveform.channelDefinitionSequence;
    if (
      channelDefinitionSequence === undefined ||
      !Array.isArray(channelDefinitionSequence) ||
      channelDefinitionSequence.length === 0
    ) {
      throw new Error('ChannelDefinitionSequence is empty');
    }

    if (waveform.channels !== channelDefinitionSequence.length) {

    }

    const channels = channelDefinitionSequence.length;
    const factor = new Array(channels).fill(1.0);
    const baseline = new Array(channels).fill(0.0);

    const units = [];
    const sources = [];
    channelDefinitionSequence.forEach((channelDefinitionSequenceItem, i) => {
      if (channelDefinitionSequenceItem !== undefined) {
        //Bits:
        if (!WAVE_FORM_BITS_STORED.includes(channelDefinitionSequenceItem.WaveformBitsStored)) {
          throw new Error(
            `Waveform bits stored definition is not supported [${channelDefinitionSequenceItem.WaveformBitsStored}]`
          );
        }

        if (
          channelDefinitionSequenceItem.ChannelSensitivity !== undefined &&
          channelDefinitionSequenceItem.ChannelSensitivityCorrectionFactor !== undefined
        ) {
          factor[i] =
            channelDefinitionSequenceItem.ChannelSensitivity *
            channelDefinitionSequenceItem.ChannelSensitivityCorrectionFactor;
        }
        if (channelDefinitionSequenceItem.ChannelBaseline !== undefined) {
          baseline[i] = channelDefinitionSequenceItem.ChannelBaseline;
        }

        const channelSensitivityUnitsSequence =
          channelDefinitionSequenceItem.ChannelSensitivityUnitsSequence;
        if (
          channelSensitivityUnitsSequence !== undefined &&
          Array.isArray(channelSensitivityUnitsSequence) &&
          channelSensitivityUnitsSequence.length > 0
        ) {
          const channelSensitivityUnitsSequenceFirstItem = channelSensitivityUnitsSequence[0];
          if (channelSensitivityUnitsSequenceFirstItem.CodeValue !== undefined) {
            units.push(channelSensitivityUnitsSequenceFirstItem.CodeValue);
          }
        }

        const channelSourceSequence = channelDefinitionSequenceItem.ChannelSourceSequence;
        if (
          channelSourceSequence !== undefined &&
          Array.isArray(channelSourceSequence) &&
          channelSourceSequence.length !== 0
        ) {
          channelSourceSequence.forEach((channelSourceSequenceItem) => {
            let title =
              channelSourceSequenceItem.CodeMeaning !== undefined
                ? channelSourceSequenceItem.CodeMeaning
                : '';
            let codeValue = channelSourceSequenceItem.CodeValue;
            const schemeDesignator = channelSourceSequenceItem.CodingSchemeDesignator;
            if (!title && codeValue !== undefined && schemeDesignator !== undefined) {
              codeValue = codeValue.replace(/[^0-9-:.]/g, '');
              const mdcScpEcgCodeTitles = [
                { mdcCode: '2:1', scpEcgCode: '5.6.3-9-1', title: 'I' },
                { mdcCode: '2:2', scpEcgCode: '5.6.3-9-2', title: 'II' },
                { mdcCode: '2:61', scpEcgCode: '5.6.3-9-61', title: 'III' },
                { mdcCode: '2:62', scpEcgCode: '5.6.3-9-62', title: 'aVR' },
                { mdcCode: '2:63', scpEcgCode: '5.6.3-9-63', title: 'aVL' },
                { mdcCode: '2:64', scpEcgCode: '5.6.3-9-64', title: 'aVF' },
                { mdcCode: '2:3', scpEcgCode: '5.6.3-9-3', title: 'V1' },
                { mdcCode: '2:4', scpEcgCode: '5.6.3-9-4', title: 'V2' },
                { mdcCode: '2:5', scpEcgCode: '5.6.3-9-5', title: 'V3' },
                { mdcCode: '2:6', scpEcgCode: '5.6.3-9-6', title: 'V4' },
                { mdcCode: '2:7', scpEcgCode: '5.6.3-9-7', title: 'V5' },
                { mdcCode: '2:8', scpEcgCode: '5.6.3-9-8', title: 'V6' },
              ];
              if (schemeDesignator === 'MDC') {
                const mdcCodeTitle = mdcScpEcgCodeTitles.find((i) => i.mdcCode === codeValue);
                if (mdcCodeTitle !== undefined) {
                  title = mdcCodeTitle.title;
                }
              } else if (schemeDesignator === 'SCPECG') {
                const scpEcgCodeTitle = mdcScpEcgCodeTitles.find((i) => i.scpEcgCode === codeValue);
                if (scpEcgCodeTitle !== undefined) {
                  title = scpEcgCodeTitle.title;
                }
              }
            }

            title = title ? title.replace(/[^a-zA-Z0-9_ ]/g, '') : '';
            sources.push(
              title
                .replace(/lead/i, '')
                .replace(/\(?einthoven\)?/i, '')
                .trim()
            );
          });
        }
      }
    });

    waveform.leads = [];
    const waveformDataBuffer = new Uint8Array(waveform.waveformData.find((o) => o));
    const waveformData = new Int16Array(
      new Uint16Array(
        waveformDataBuffer.buffer,
        waveformDataBuffer.byteOffset,
        waveformDataBuffer.byteLength / Uint16Array.BYTES_PER_ELEMENT
      )
    );

    // Split to channels
    let signals = waveformData.reduce(
      (rows, key, index) =>
        (index % channels === 0 ? rows.push([key]) : rows[rows.length - 1].push(key)) && rows,
      []
    );

    // Transpose
    signals = signals[0].map((x, i) => signals.map((x) => x[i]));

    // Apply baseline and factor
    for (let i = 0; i < channels; i++) {
      for (let j = 0; j < signals[i].length; j++) {
        signals[i][j] = (signals[i][j] + baseline[i]) * factor[i];
      }
    }

    // Filter 40hz:
    if (this.opts.applyLowPassFilter === true) {
      const cutoffFrequency = 40.0;
      for (let i = 0; i < channels; i++) {
        this._lowPassFilter(signals[i], cutoffFrequency, waveform.samplingFrequency);
      }
    }

    // Convert to millivolts
    if (units.length === channels) {
      const millivolts = { uV: 1000.0, uv: 1000.0, mV: 1.0, mv: 1000.0, mmHg: 200.0, mmhg: 200.0};
      for (let i = 0; i < channels; i++) {
        for (let j = 0; j < signals[i].length; j++) {
          signals[i][j] = signals[i][j] / millivolts[units[i]];
        }
      }
    }

    // Find min/max and assign signal and source
    for (let i = 0; i < channels; i++) {
      waveform.leads.push({
        min: Math.min(...signals[i]),
        max: Math.max(...signals[i]),
        signal: signals[i],
        source: sources[i],
      });
    }
    waveform.min = Math.min(...waveform.leads.map((lead) => lead.min));
    waveform.max = Math.max(...waveform.leads.map((lead) => lead.max));
    waveform.minMax = Math.max(
      Math.abs(Math.min(...waveform.leads.map((lead) => lead.min))),
      Math.abs(Math.max(...waveform.leads.map((lead) => lead.max)))
    );
  }

  /**
   * Sorts waveform leads based on source.
   * @method
   * @private
   * @param {Object} waveform - Waveform.
   */
  _sortLeads(waveform) {
    const order = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'];
    waveform.leads.sort((a, b) => {
      const index1 = order.indexOf(a.source);
      const index2 = order.indexOf(b.source);
      return (index1 > -1 ? index1 : Infinity) - (index2 > -1 ? index2 : Infinity);
    });
  }

  /**
   * Applies a low-pass filter to sample data.
   * @method
   * @private
   * @param {Array<number>} samples - The sample data to filter.
   * @param {number} cutoff - Cut off frequency.
   * @param {number} sampleRate - Samples rate.
   */
  _lowPassFilter(samples, cutoff, sampleRate) {
    const rc = 1.0 / (cutoff * 2.0 * Math.PI);
    const dt = 1.0 / sampleRate;
    const alpha = dt / (rc + dt);
    let lastValue = samples[0];

    for (let i = 0; i < samples.length; i++) {
      lastValue = lastValue + alpha * (samples[i] - lastValue);
      samples[i] = lastValue;
    }
  }

  /**
   * Extracts waveform information.
   * @method
   * @param {Object} waveform - Waveform.
   * @private
   * @returns {Array<Object>} Array of waveform information.
   */
  _extractInformation(waveform) {
    const waveformAnnotationSequence = this.getElement('WaveformAnnotationSequence');
    if (
      waveformAnnotationSequence === undefined ||
      !Array.isArray(waveformAnnotationSequence) ||
      waveformAnnotationSequence.length === 0
    ) {
      return [];
    }
    const info = [];
    waveformAnnotationSequence.forEach((waveformAnnotationSequenceItem) => {
      const conceptNameCodeSequence = waveformAnnotationSequenceItem.ConceptNameCodeSequence;
      if (
        conceptNameCodeSequence !== undefined &&
        Array.isArray(conceptNameCodeSequence) &&
        conceptNameCodeSequence.length !== 0
      ) {
        conceptNameCodeSequence.forEach((conceptNameCodeSequenceItem) => {
          //Delete null character CodeMeaning, trasform to Uppercase:
          var cleanedCodeMeaning = conceptNameCodeSequenceItem.CodeMeaning.replace(/\u0000/g, '').toUpperCase();;

          //Search constant data:
          const keyUnitInfo = KEY_UNIT_INFO.find((i) => i.key === cleanedCodeMeaning);
          
          //Load data:
          if (waveformAnnotationSequenceItem.NumericValue !== undefined && keyUnitInfo !== undefined) {
            info.push({
              key: cleanedCodeMeaning,
              value: waveformAnnotationSequenceItem.NumericValue,
              unit: keyUnitInfo.unit,
            });
          }
        });
      }
    });
    //RR INTEVAL TO VRATE - BPM:
    const rrInterval = info.find((i) => i.key === 'RR INTERVAL');
    if (!info.find((i) => i.key === 'VRATE') && rrInterval) {
      info.push({
        key: 'VRATE',
        value: Math.trunc(((60.0 / waveform.duration) * waveform.samples) / rrInterval.value),
        unit: 'BPM',
      });
    }

    return info;
  }

  /**
   * Extracts waveform annotation.
   * @method
   * @private
   * @returns {Array<string>} Array of waveform annotation.
   */
  _extractAnnotation() {
    const waveformAnnotationSequence = this.getElement('WaveformAnnotationSequence');
    if (
      waveformAnnotationSequence === undefined ||
      !Array.isArray(waveformAnnotationSequence) ||
      waveformAnnotationSequence.length === 0
    ) {
      return [];
    }
    const annotations = [];
    waveformAnnotationSequence.forEach((waveformAnnotationSequenceItem) => {
      if (waveformAnnotationSequenceItem.UnformattedTextValue !== undefined) {
        annotations.push(waveformAnnotationSequenceItem.UnformattedTextValue);
      }
    });

    return annotations;
  }

}

export default DicomEcg;
