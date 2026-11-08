/* RE:BOOT sorting station — a local, source-based learning game. */
(() => {
  'use strict';
  const root = document.getElementById('sortStation');
  if (!root) return;

  const bins = [
    {id:'paper', name:'Paper & cardboard', short:'PAPER', note:'Blue street bin', icon:'▤'},
    {id:'glass', name:'Glass packaging', short:'GLASS', note:'White street bin', icon:'◈'},
    {id:'packaging', name:'Mixed packaging', short:'PACKAGING', note:'Yellow street bin', icon:'▱'},
    {id:'ewaste', name:'Small e-waste', short:'SMALL E-WASTE', note:'Labelled e-waste bin', icon:'⌁'},
    {id:'battery', name:'Portable batteries', short:'BATTERIES', note:'Separate blue compartment', icon:'▣'},
    {id:'centre', name:'Collection centre', short:'COLLECTION CENTRE', note:'Special collection route', icon:'⌂'}
  ];
  // Two randomly selected items per category are mixed into every 12-item round.
  const items = [
    {name:'Clean cardboard box',icon:'📦',bin:'paper',why:'Clean, dry cardboard belongs with paper and cardboard in the blue container.'},
    {name:'Old newspaper',icon:'📰',bin:'paper',why:'Newspapers can be collected with paper in the blue container.'},
    {name:'Office paper sheets',icon:'📄',bin:'paper',why:'Uncontaminated office paper belongs in the paper fraction.'},
    {name:'Paper magazine',icon:'📖',bin:'paper',why:'Magazines belong in the blue container for paper and cardboard.'},

    {name:'Empty glass bottle',icon:'🍾',bin:'glass',why:'Glass packaging belongs in the separate glass container. Remove its cap if possible.'},
    {name:'Empty jam jar',icon:'🫙',bin:'glass',why:'Empty glass jars are glass packaging. The lid is sorted separately.'},
    {name:'Empty glass food jar',icon:'🫙',bin:'glass',why:'Glass jars go to the glass-packaging collection point, not mixed waste.'},

    {name:'Empty plastic bottle',icon:'🧴',bin:'packaging',why:'An empty plastic drink bottle is packaging and belongs in the yellow packaging container.'},
    {name:'Empty yoghurt cup',icon:'🥛',bin:'packaging',why:'Empty plastic food packaging belongs with mixed packaging in the yellow container.'},
    {name:'Metal food can',icon:'🥫',bin:'packaging',why:'Empty metal packaging such as food cans belongs in the yellow packaging container.'},
    {name:'Empty juice carton',icon:'🧃',bin:'packaging',why:'Beverage cartons are composite packaging, collected with mixed packaging.'},

    {name:'Old computer mouse',icon:'🖱️',bin:'ewaste',why:'A mouse is small electrical equipment and can go in a correctly labelled street e-waste bin.'},
    {name:'Unused phone charger',icon:'🔌',bin:'ewaste',why:'Chargers and adapters belong with small electrical and electronic waste.'},
    {name:'Broken electric shaver',icon:'🪒',bin:'ewaste',why:'A small electric shaver fits the small-appliance collection route. Remove a removable battery if applicable.'},
    {name:'Old computer keyboard',icon:'⌨️',bin:'ewaste',why:'Computer accessories such as keyboards are accepted in designated small e-waste street bins when they fit the opening.'},

    {name:'Used AA battery',icon:'🔋',bin:'battery',why:'Portable batteries use the separate battery compartment, not the compartment for small appliances.'},
    {name:'Used AAA battery',icon:'🔋',bin:'battery',why:'Portable batteries must be collected separately at a suitable battery point.'},
    {name:'Used 9V battery',icon:'🔋',bin:'battery',why:'A 9V household battery belongs in the dedicated portable-battery collection route.'},
    {name:'Used C-size battery',icon:'🔋',bin:'battery',why:'Ordinary portable household batteries belong in a dedicated battery collection compartment.'},

    {name:'Broken computer monitor',icon:'🖥️',bin:'centre',why:'Screens and monitors do not belong in street bins for small e-waste. Take them to a collection centre or authorised return point.'},
    {name:'Fluorescent tube',icon:'💡',bin:'centre',why:'Waste lamps can break and require special handling. A collection centre is an appropriate destination.'},
    {name:'Old refrigerator',icon:'🧊',bin:'centre',why:'Large electrical appliances need a collection centre or authorised take-back, not a street bin.'},
    {name:'Broken television',icon:'📺',bin:'centre',why:'TV screens must not be put in street small-appliance bins. Use an appropriate collection centre or take-back point.'}
  ];

  const $ = id => root.querySelector('#' + id);
  const shuffled = array => {
    const result = array.slice();
    for (let i = result.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  };
  let round = [], index = 0, correct = 0, answered = false;
  const binBox = $('stationBins');

  bins.forEach(bin => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'station-bin';
    button.dataset.bin = bin.id;
    button.setAttribute('aria-label', bin.name + '. ' + bin.note);
    const small = document.createElement('span');
    small.className = 'station-bin-label';
    small.textContent = bin.note;
    const lid = document.createElement('span');
    lid.className = 'station-bin-lid';
    lid.setAttribute('aria-hidden', 'true');
    const body = document.createElement('span');
    body.className = 'station-bin-body';
    body.setAttribute('aria-hidden', 'true');
    const mark = document.createElement('span');
    mark.className = 'station-bin-symbol';
    mark.textContent = bin.icon;
    body.append(mark);
    const name = document.createElement('strong');
    name.textContent = bin.name;
    button.append(small, lid, body, name);
    button.addEventListener('click', () => choose(bin.id));
    button.addEventListener('dragover', e => {
      if (answered) return;
      e.preventDefault();
      button.classList.add('is-drop-target');
    });
    button.addEventListener('dragleave', () => button.classList.remove('is-drop-target'));
    button.addEventListener('drop', e => {
      e.preventDefault();
      button.classList.remove('is-drop-target');
      choose(bin.id);
    });
    binBox.append(button);
  });

  const itemButton = $('stationItem');
  itemButton.addEventListener('dragstart', e => {
    if (answered || index >= round.length) {
      e.preventDefault();
      return;
    }
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', round[index].name);
    itemButton.classList.add('is-dragging');
  });
  itemButton.addEventListener('dragend', () => {
    itemButton.classList.remove('is-dragging');
    root.querySelectorAll('.station-bin').forEach(b => b.classList.remove('is-drop-target'));
  });
  itemButton.addEventListener('click', () => {
    if (!answered) {
      $('stationHint').textContent = 'Now choose one of the six destinations. You can click a bin instead of dragging.';
      binBox.querySelector('button').focus();
    }
  });

  function updateMeter() {
    $('stationCount').textContent = String(Math.min(index + 1, round.length)).padStart(2, '0') + ' / ' + round.length;
    $('stationScore').textContent = String(correct * 10).padStart(3, '0');
    $('stationProgress').style.width = ((index + (answered ? 1 : 0)) / round.length * 100) + '%';
  }

  function renderItem() {
    if (index >= round.length) {
      finish();
      return;
    }
    answered = false;
    const item = round[index];
    $('stationObjectIcon').textContent = item.icon;
    $('stationObjectName').textContent = item.name;
    $('stationObjectMeta').textContent = 'ITEM ' + String(index + 1).padStart(2, '0') + ' / FIND ITS DESTINATION';
    $('stationHint').textContent = 'Drag the item onto a destination, or simply tap a bin.';
    $('stationFeedback').textContent = '';
    $('stationFeedback').className = 'station-feedback';
    $('stationNext').hidden = true;
    itemButton.draggable = true;
    itemButton.disabled = false;
    root.querySelectorAll('.station-bin').forEach(btn => {
      btn.disabled = false;
      btn.classList.remove('is-correct', 'is-wrong', 'is-drop-target');
    });
    updateMeter();
  }

  function choose(id) {
    if (answered || index >= round.length) return;
    answered = true;
    const item = round[index];
    const isCorrect = id === item.bin;
    if (isCorrect) correct++;
    const target = bins.find(bin => bin.id === item.bin);
    root.querySelectorAll('.station-bin').forEach(btn => {
      btn.disabled = true;
      if (btn.dataset.bin === item.bin) btn.classList.add('is-correct');
      else if (btn.dataset.bin === id) btn.classList.add('is-wrong');
    });
    itemButton.draggable = false;
    itemButton.disabled = true;
    const feedback = $('stationFeedback');
    feedback.className = 'station-feedback ' + (isCorrect ? 'is-success' : 'is-error');
    feedback.textContent = '';
    const headline = document.createElement('strong');
    headline.textContent = isCorrect ? 'Correct route. +10 points' : 'Not quite — ' + target.name + ' is the right destination.';
    const explanation = document.createElement('p');
    explanation.textContent = item.why;
    feedback.append(headline, explanation);
    const next = $('stationNext');
    next.hidden = false;
    next.textContent = index === round.length - 1 ? 'See your results →' : 'Next item →';
    updateMeter();
    next.focus();
  }

  function finish() {
    $('stationPlayArea').hidden = true;
    $('stationResult').hidden = false;
    $('stationResultScore').textContent = correct * 10 + ' / ' + round.length * 10;
    $('stationResultHeadline').textContent = correct === round.length ? 'Perfect sorting.' : correct >= 9 ? 'Great work.' : 'Keep learning the routes.';
    $('stationResultDetail').textContent = 'You sorted ' + correct + ' of ' + round.length + ' items correctly. Every new round draws a different selection of Slovenian waste examples.';
    $('stationCount').textContent = round.length + ' / ' + round.length;
    $('stationProgress').style.width = '100%';
    $('stationReplay').focus();
  }

  function reset() {
    round = shuffled(bins.flatMap(bin => shuffled(items.filter(item => item.bin === bin.id)).slice(0, 2)));
    index = 0;
    correct = 0;
    $('stationPlayArea').hidden = false;
    $('stationResult').hidden = true;
    renderItem();
  }
  $('stationNext').addEventListener('click', () => {
    if (!answered) return;
    index++;
    renderItem();
  });
  $('stationReplay').addEventListener('click', reset);
  reset();
})();
