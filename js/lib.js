export function times([a, ai], [b, bi]) {
  const real = a * b - ai * bi;
  const imag = a * bi + ai * b;
  return [real, imag];
}

export function plus([a, ai], [b, bi]) {
  return [a + b, ai + bi];
}

export function magnitude([a, ai]) {
  return Math.sqrt(a * a + ai * ai);
}

function rgba(r, g, b, a) {
  return [r, g, b, a];
}

function escapeVelocity(c) {
  // z -> z^2 + c
  let z = [0, 0];

  for (let i = 0; i < 1000; i++) {
    z = plus(times(z, z), c);
    if (magnitude(z) > 2.0) {
      return i / 50;
    }
  }
  return 0;
}

export function calculatePoint(x, y, lensW, lensH, width, height) {
  const x1 = (x * lensW) / width - lensW / 2;
  const y1 = (y * lensH) / height - lensH / 2;
  return [x1, y1];
}

export function calculatePixelColor(x, y, width, height) {
  const coords = calculatePoint(x, y, 5, 4, width, height);
  const red = 255 * escapeVelocity(coords);
  return rgba(red, 0, 0, 255);
}

export function generatePixelMap(width, height) {
  const data = [];
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      data.push(calculatePixelColor(x, y, width, height));
    }
  }
  return data;
}
