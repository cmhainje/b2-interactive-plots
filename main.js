import { createApp, reactive } from 'https://unpkg.com/petite-vue@0.3.0?module'

const store = reactive({
  general: 'gen',
  image: 'conf',
  detClass: 'ens',
  det: 'SVD',
  part: 'all',
  correct: 'all',
  binned: false,
  p_bin: 0,
  t_bin: 0,
  diff: false,
  confNorm: 'raw',
  
  detClassSupported() { return this.general !== 'ctrb'; },
  detSupported() { return this.detClassSupported() && this.detClass !== 'ens'; },
  corrSupported() { return this.general === 'ctrb' || this.image === 'llr'; },
  partSupported() {
    return this.image === 'eff'
           || this.image === 'auc'
           || this.image === 'top_wrong'
           || this.image === 'ctrb'
           || this.image === 'blame'
           || this.general === 'llr';
  },
  normSupported() { return this.image === 'conf'; },
  diffSupported() {
    return (this.image === 'conf'
            || this.image === 'eff'
            || this.image === 'auc') && (this.detClass === 'abl');
  },
  binSupported() {
    return this.image === 'conf' 
           || this.image === 'roc' 
           || this.general === 'llr'
           || (this.general === 'ctrb' && this.image !== 'blame')
  },

  debug: true
});


function GenSelector() {
  return {
    $template: '#selector-template',
    key: 'general',
    label: 'Category:',
    options: [
      { text: 'General performance',    value: 'gen' },
      { text: 'Detector contributions', value: 'ctrb' },
      { text: 'Likelihood ratios',      value: 'llr' },
    ]
  }
}

function ImgSelectorGen() {
  return {
    $template: '#selector-template',
    key: 'image',
    label: 'Image type:',
    options: [
      { text: 'Confusion',     value: 'conf' },
      { text: 'Efficiency',    value: 'eff' },
      { text: 'ROC curves',    value: 'roc' },
      { text: 'AUC scores',    value: 'auc' },
      { text: 'Top wrong PID', value: 'top_wrong' },
    ],
  }
}

function ImgSelectorCtrb() {
  return {
    $template: '#selector-template',
    key: 'image',
    label: 'Image type:',
    options: [
      { text: 'Contribution distribution', value: 'ctrb' },
      { text: 'Average contribution',      value: 'avg' },
      { text: 'Blame frequencies',         value: 'blfreq' },
      { text: 'Blame plots',               value: 'blame' },
    ],
  }
}

function ImgSelectorLLR() {
  return {
    $template: '#selector-template',
    key: 'image',
    label: 'Image type:',
    options: [
      { text: 'Likelihood ratios', value: 'llr' },
      { text: 'Correct likelihood ratios', value: 'corr' },
      { text: 'Maximum likelihood ratios', value: 'max' },
      { text: 'Leading difference', value: 'diff' },
    ],
  }
}

function DetClassSelector() {
  return {
    $template: '#selector-template',
    key: 'detClass',
    label: 'Detector class:',
    options: [
      { text: 'Ensemble',        value: 'ens' },
      { text: 'Single detector', value: 'det' },
      { text: 'Ablation test',   value: 'abl' },
    ],
  }
}

function DetSelector() {
  return {
    $template: '#selector-template',
    key: 'det',
    label: 'Detector:',
    options: [
      { text: 'SVD',   value: 'SVD' },
      { text: 'CDC',   value: 'CDC' },
      { text: 'TOP',   value: 'TOP' },
      { text: 'ARICH', value: 'ARICH' },
      { text: 'ECL',   value: 'ECL' },
      { text: 'KLM',   value: 'KLM' },
    ]
  }
}

function ParticleSelector() {
  return {
    $template: '#selector-template',
    key: 'part',
    label: 'Particle type:',
    options: [
      { text: 'All (average)', value: 'all' },
      { text: 'Electron', value: 'e' },
      { text: 'Muon',     value: 'mu' },
      { text: 'Pion',     value: 'pi' },
      { text: 'Kaon',     value: 'K' },
      { text: 'Proton',   value: 'p' },
      { text: 'Deuteron', value: 'd' },
    ]
  }
}

function CorrectnessSelector() {
  return {
    $template: '#selector-template',
    key: 'correct',
    label: 'Correctness:',
    options: [
      { text: 'All events',       value: 'all' },
      { text: 'Correct events',   value: 'right' },
      { text: 'Incorrect events', value: 'wrong' },
    ]
  }
}

function NormSelector() {
  return {
    $template: '#selector-template',
    key: 'confNorm',
    label: 'Normalization:',
    options: [
      { text: 'None (event numbers)', value: 'raw' },
      { text: 'Row normalization',    value: 'rownorm' },
      { text: 'Column normalization', value: 'colnorm' },
    ]
  }
}

function BinCheck() {
  return {
    $template: '#checkbox-template',
    key: 'binned',
    label: 'Use bins?'
  }
}

function BinSliders() {
  return {
    $template: '#sliders-template',
    key: 'bin', 
    p_labels: [
      '[0.5, 1.0] GeV', '[1.0, 1.5] GeV', 
      '[1.5, 2.0] GeV', '[2.0, 2.5] GeV',
      '[2.5, 3.0] GeV', '[3.0, 3.5] GeV', 
      '[3.5, 4.5] GeV'
    ],
    t_labels: [
      '[17°, 28°]', '[28°, 40°]',  
      '[40°, 60°]', '[60°, 77°]',
      '[77°, 96°]', '[96°, 115°]', 
      '[115°, 133°]', '[133°, 150°]',
    ]
  }
}

function DiffCheck() {
  return {
    $template: '#checkbox-template',
    key: 'diff',
    label: 'Show change from standard?'
  }
}

function ImageDisplay() {
  return {
    filename() {
      const to_join = [ store['general'] ];

      if (store.detClassSupported()) 
        to_join.push(store['detClass']);

      to_join.push(store['image']);

      if (store.normSupported())
        to_join.push(store['confNorm']);

      if (store.corrSupported())
        to_join.push(store['correct']);

      if (store.partSupported())
        to_join.push(store['part']);

      if (store.detSupported())
        to_join.push(store['det']);

      if (store.diffSupported() && store['diff'])
        to_join.push('diff');

      if (store.binSupported()) {
        if (store['binned']) {
          to_join.push(store['p_bin']);
          to_join.push(store['t_bin']);
        }
      }

      return 'plots/' + to_join.join('_') + '.png'
    }
  }
}


createApp({
  store, 
  GenSelector, 
  ImgSelectorGen, ImgSelectorCtrb, ImgSelectorLLR,
  DetClassSelector, DetSelector, ParticleSelector,
  CorrectnessSelector, NormSelector,
  BinCheck, BinSliders, DiffCheck,
  ImageDisplay
}).mount();

