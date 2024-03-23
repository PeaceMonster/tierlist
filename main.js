import { default as Konva } from "konva";

const log = console.log;

const width = window.innerWidth;
const height = window.innerHeight - 20;

let stage = new Konva.Stage({
  container: 'container',
  width: width,
  height: height,
})

let background = new Konva.Layer();

let bg_fill = new Konva.Rect({
  width: width,
  height: height,
  fill: '#353535'
});

background.add(bg_fill);

function getTextBox(x, y, width, height, fill, text) {
  let text_elem = new Konva.Text({
    x: x,
    y: y,
    width: width,
    fontSize: 50,
    padding: 30,
    text: text,
  })
  let textbox = new Konva.Rect({
    x: x,
    y: y,
    width: width,
    height: height,
    fill: fill,
  });

  return [textbox, text_elem];

}

let tier_x_start = width / 12 * 1;
let tier_x_end = width / 12 * 11;
let tier_y_start = height / 16 * 1;

let tiers = [
  { name: "S", fill: "#ef411a", centerpoint: 0, contains: [] },
  { name: "A", fill: "#ef8c1a", centerpoint: 0, contains: [] },
  { name: "B", fill: "#efc51a", centerpoint: 0, contains: [] },
  { name: "C", fill: "#98e21f", centerpoint: 0, contains: [] },
  { name: "D", fill: "#1fe2b5", centerpoint: 0, contains: [] },
  { name: "F", fill: "#e51010", centerpoint: 0, contains: [] },
]

let untiered = [];

let line = new Konva.Line({
  points: [tier_x_start, tier_y_start - 2, tier_x_end, tier_y_start - 2],
  stroke: '#474646',
  strokeWidth: 5,
  lineCap: 'round'
});
background.add(line);

for (let i = 0; i < tiers.length; i++) {
  let line = new Konva.Line({
    points: [tier_x_start, tier_y_start - 2 + 105 * (i + 1), tier_x_end, tier_y_start - 2 + 105 * (i + 1)],
    stroke: '#474646',
    strokeWidth: 5,
    lineCap: 'round'
  });

  let tier = getTextBox(tier_x_start, tier_y_start + 105 * i, 100, 100, tiers[i].fill, tiers[i].name);
  tiers[i].centerpoint = tier_y_start + 105 * i + 50;
  background.add(line, tier[0], tier[1]);
}


stage.add(background);
background.draw();

let subjects = new Konva.Layer();
let output = {};


function arrange_subjects() {
  for (let i = 0; i < tiers.length; i++) {
    let length = 0;
    for (let j = 0; j < tiers[i].contains.length; j++) {
      tiers[i].contains[j].x(tier_x_start + 120 + length);
      length += tiers[i].contains[j].width() + 10;
    }
  }
  let length = 0;
  let row = 0;
  for (let i = 0; i < untiered.length; i++) {
    untiered[i].y(height * (12 + row * 1.8) / 16);
    untiered[i].x(tier_x_start + length);
    length += untiered[i].width() + 10;
    if (length >= tier_x_end - 200) {
      length = 0;
      row = 1;
    }
  }
  output.untiered = [];
  for (let i = 0; i < untiered.length; i++) {
    output.untiered[i] = untiered[i].children[1].textArr[0].text;
  }
  for (let i = 0; i < tiers.length; i++) {
    output[tiers[i].name] = [];
    for (let j = 0; j < tiers[i].contains.length; j++) {
      output[tiers[i].name][j] = tiers[i].contains[j].children[1].textArr[0].text;
    }
  }
}

function newSubject(name, fill) {
  let subject_text = new Konva.Text({
    height: 100,
    text: name,
    fontSize: 30,
    padding: 40,
  });
  let subject_box = new Konva.Rect({
    height: 100,
    width: subject_text.width(),
    fill: fill
  })

  let subject_group = new Konva.Group({
    draggable: true,
  });

  subject_group.on('dragstart', () => {
    let y = subject_group.y() + subject_box.height() / 2;
    let snap = -1;
    let snap_dist = 70;
    for (let i = 0; i < tiers.length; i++) {
      if (Math.abs(y - tiers[i].centerpoint) < snap_dist) {
        snap_dist = Math.abs(y - tiers[i].centerpoint);
        snap = i;
      }
    }
    if (snap >= 0) {
      tiers[snap].contains = tiers[snap].contains.filter(item => item !== subject_group);
    } else {
      untiered = untiered.filter(item => item !== subject_group);
    }
    arrange_subjects();

  })

  subject_group.on('dragend', () => {
    let y = subject_group.y() + subject_box.height() / 2;
    let snap = -1;
    let snap_dist = 70;
    for (let i = 0; i < tiers.length; i++) {
      if (Math.abs(y - tiers[i].centerpoint) < snap_dist) {
        snap_dist = Math.abs(y - tiers[i].centerpoint);
        snap = i;
      }
    }
    if (snap >= 0) {
      subject_group.y(tiers[snap].centerpoint - 50);
      tiers[snap].contains.push(subject_group);
    } else {
      untiered.push(subject_group);
    }
    arrange_subjects();
  });

  subject_group.add(subject_box, subject_text);
  subject_group.width(subject_box.width());

  untiered.push(subject_group);

  return subject_group;
}

let subject_info = [
  { name: "Ads", fill: "#33ff85" },
  { name: "Imo", fill: "#fffb00" },
  { name: "IntProg", fill: "#adcc33" },
  { name: "DB Part 1", fill: "#52e0e0" },
  { name: "DB Part 2", fill: "#877ab8" },
  { name: "ProgSprog", fill: "#b170c2" },
  { name: "BerLog", fill: "#bf8c40" },
  { name: "ISS", fill: "#b87a9f" },
  { name: "HCI", fill: "#19e62a" },
  { name: "SWEA", fill: "#0df269" },
  { name: "ExSys", fill: "#66a3cc" },
  { name: "Numla", fill: "#479933" },
  { name: "CompArc", fill: "#b34d8a" },
  { name: "Dovs", fill: "#6ef7f7" },
  { name: "Dissys", fill: "#68eb47" },
  { name: "Etik", fill: "#d7f075" },
  { name: "Optimering", fill: "#a094d1" },
]

for (let i = 0; i < subject_info.length; i++) {
  let sub = newSubject(subject_info[i].name, subject_info[i].fill);
  subjects.add(sub);
}

stage.add(subjects);

arrange_subjects();

subjects.draw();

document.getElementById("json").addEventListener('click', e => {
  document.getElementById("result").innerText = JSON.stringify(output)
})

