let vertices = [];

for (let x = -1; x <= 1; x += 2)
  for (let y = -1; y <= 1; y += 2)
    for (let z = -1; z <= 1; z += 2)
      for (let w = -1; w <= 1; w += 2)
        vertices.push([x, y, z, w]);

function rotateXW(p, deg) {
  let a = deg * Math.PI / 180;
  let [x, y, z, w] = p;
  return [x * Math.cos(a) - w * Math.sin(a), y, z, x * Math.sin(a) + w * Math.cos(a)];
}

function rotateYW(p, deg) {
  let a = deg * Math.PI / 180;
  let [x, y, z, w] = p;
  return [x, y * Math.cos(a) - w * Math.sin(a), z, y * Math.sin(a) + w * Math.cos(a)];
}

function rotateZW(p, deg) {
  let a = deg * Math.PI / 180;
  let [x, y, z, w] = p;
  return [x, y, z * Math.cos(a) - w * Math.sin(a), z * Math.sin(a) + w * Math.cos(a)];
}

function project4Dto3D(p, distanceW = 1.8) {
  let [x, y, z, w] = p;
  let scale = 1 / (distanceW - w);
  return [x * scale, y * scale, z * scale];
}

function project3Dto2D(p) {
  return [p[1], p[2]];
}

function project(p) {
  return project3Dto2D(project4Dto3D(p));
}

function isEdge(a, b) {
  let diff = (a[0]!==b[0]) + (a[1]!==b[1]) + (a[2]!==b[2]) + (a[3]!==b[3]);
  return diff === 1;
}

let edges = [];
for (let i = 0; i < vertices.length; i++)
  for (let j = i+1; j < vertices.length; j++)
    if (isEdge(vertices[i], vertices[j])) edges.push([i, j]);

const canvas = document.getElementById('tes');
const ctx = canvas.getContext('2d');

const xwSlider = document.getElementById('xw');
const ywSlider = document.getElementById('yw');
const zwSlider = document.getElementById('zw');

function draw() {
  ctx.clearRect(0, 0, 500, 500);
  let points = [];

  const fixedYW = 35;
  const fixedZW = 0;
  const angleXW = Number(xwSlider.value);
  const angleYW = Number(ywSlider.value);
  const angleZW = Number(zwSlider.value);

  for (let v of vertices) {
    let p = rotateYW(v, fixedYW);
    p = rotateZW(p, fixedZW);
    p = rotateXW(p, angleXW);
    p = rotateYW(p, angleYW);
    p = rotateZW(p, angleZW);
    let [y, z] = project(p);
    points.push([y, z]);
  }

  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 1.2;
  for (let [i, j] of edges) {
    let x1 = 250 + points[i][0] * 150;
    let y1 = 250 - points[i][1] * 150;
    let x2 = 250 + points[j][0] * 150;
    let y2 = 250 - points[j][1] * 150;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
}

xwSlider.addEventListener('input', draw);
ywSlider.addEventListener('input', draw);
zwSlider.addEventListener('input', draw);

draw();