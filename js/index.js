import { generatePixelMap } from "./lib.js";

// Set pixel in a canvas pixel array
export function setPixel(data, width, x, y, r, g, b, a) {
  const offset = (x + y * width) * 4;
  data[offset + 0] = r;
  data[offset + 1] = g;
  data[offset + 2] = b;
  data[offset + 3] = a;
}

export function applyPixelMapToData(data, map, width, height) {
  for (let x = 0; x < width; x++) {
    for (let y = 0; y < height; y++) {
      const index = y * width + x;
      const [r, g, b, a] = map[index];
      setPixel(data, width, x, y, r, g, b, a);
    }
  }
}

const canvas = document.getElementById("canvas");
const ctx = document.getElementById("canvas").getContext("2d");

const width = canvas.width;
const height = canvas.height;

const imageData = ctx.createImageData(width, height);

const start = new Date();
const map = generatePixelMap(width, height);
const end = new Date();
document.getElementById("time").innerHTML = `Mandelbrot set took ${end -
  start}ms to generate.`;

applyPixelMapToData(imageData.data, map, width, height);

ctx.putImageData(imageData, 0, 0);
