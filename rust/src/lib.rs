mod utils;
use wasm_bindgen::prelude::*;
use std::cmp;

#[macro_use]
extern crate serde_derive;



// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;



type CplxNum = (f64, f64);
type Color = [u8;4];

#[derive(Serialize, Deserialize)]
pub struct Example {
    pub data: Vec<Color>,
}

fn times(a_num:CplxNum, b_num:CplxNum) -> CplxNum {
    let (a, ai) = a_num;
    let (b, bi) = b_num;
    let real = a * b - ai * bi;
    let imag = a * bi + ai * b;
    return (real, imag);
}

fn plus(a_num:CplxNum, b_num:CplxNum) -> CplxNum {
    let (a, ai) = a_num;
    let (b, bi) = b_num;
    let real = a + b;
    let imag = ai + bi;
    return (real, imag);
}

fn magnitude(a_num:CplxNum) -> f64 {
    let (a, ai) = a_num;
    let sqr = a * a + ai * ai;
    return sqr.sqrt();
}

fn rgba(r:u8, g:u8, b:u8, a:u8) -> Color {
    return [r, g, b, a];
}

fn escape_velocity(c:CplxNum) -> f64 {
    let mut z:CplxNum = (0.0, 0.0);
    for i in 0..1000 {
        z = plus(times(z, z), c);
        if magnitude(z) > 2.0 {
            return i as f64 / 50.0;
        }
    }
    return 0.0
}

fn calculate_point(x:i32, y:i32, lens_w:f64, lens_h:f64, width:i32, height:i32) -> CplxNum {
    let x1:f64 = (x as f64 * lens_w) / width as f64 - lens_w / 2.;
    let y1:f64 = (y as f64 * lens_h) / height as f64 - lens_h / 2.;
    return (x1, y1);
}

fn calculate_pixel_color(x:i32, y:i32, width:i32, height:i32) -> Color {
    let coords:CplxNum = calculate_point(x, y, 5., 4., width, height);
    let velocity = escape_velocity(coords);
    let escape = if velocity > 1. {1.0} else {velocity};
    let red = (255. * escape) as u8;
    return rgba(cmp::min(red, 255), 0, 0, 255);
}

fn generate_pixel_map_vector(width:i32, height:i32) -> Vec<Color> {
    let mut data:Vec<Color> = vec![];
    for y in 0..height {
      for x in 0..width {
        let color = calculate_pixel_color(x, y, width, height);
        data.push(color);
      }
    }
    return data;
  }

#[wasm_bindgen]
pub fn generate_pixel_map(width:i32, height:i32) -> JsValue {
    let example = Example {
        data: generate_pixel_map_vector(width, height),
    };
    return JsValue::from_serde(&example).unwrap();
}
