import React from "react";
import { generatePixelMap } from "./lib";
import { generate_pixel_map } from "rust";

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

function App() {
  const [time, setTime] = React.useState(-1);
  const [loading, setLoading] = React.useState(false);

  const regenerate = React.useCallback(
    ({ rust }) => {
      setLoading(true);
      const canvas = document.getElementById("canvas");
      const ctx = canvas.getContext("2d");
      const width = canvas.width;
      const height = canvas.height;

      ctx.clearRect(0, 0, width, height);
      setTimeout(() => {
        const imageData = ctx.createImageData(width, height);

        const start = new Date();
        const map = rust
          ? generate_pixel_map(width, height).data
          : generatePixelMap(width, height);
        const end = new Date();
        applyPixelMapToData(imageData.data, map, width, height);

        ctx.putImageData(imageData, 0, 0);

        setTime(end - start);
        setLoading(false);
      }, 0);
    },
    [setTime]
  );

  const handleRegenerateRequested = React.useCallback(() => {
    regenerate({ rust: false });
  }, [regenerate]);

  const handleRustClicked = React.useCallback(() => {
    regenerate({ rust: true });
  }, [regenerate]);

  return (
    <div>
      <p id="time">
        <button onClick={handleRegenerateRequested}>
          {loading ? "Generating..." : "Generate JS"}
        </button>
        <button onClick={handleRustClicked}>
          {loading ? "Generating..." : "Generate Rust"}
        </button>
        <br />
        <br />
        {!loading && time > -1 && (
          <span>Mandelbrot set took {time}ms to generate.</span>
        )}
      </p>
      <canvas width="1000" height="800" id="canvas"></canvas>
      {loading && <p id="spinner">Loading...</p>}
    </div>
  );
}

export default App;
