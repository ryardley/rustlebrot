import { generatePixelMap } from "./lib";
import { generate_pixel_map } from "rust";

test("returns the same values", () => {
  expect(generatePixelMap(20, 20)).toEqual(generate_pixel_map(20, 20).data);
});
