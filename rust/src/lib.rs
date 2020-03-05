mod utils;
use wasm_bindgen::prelude::*;

#[macro_use]
extern crate serde_derive;

#[derive(Serialize, Deserialize)]
pub struct Example {
    pub data: Vec<Vec<f32>>,
}


// When the `wee_alloc` feature is enabled, use `wee_alloc` as the global
// allocator.
#[cfg(feature = "wee_alloc")]
#[global_allocator]
static ALLOC: wee_alloc::WeeAlloc = wee_alloc::WeeAlloc::INIT;


#[wasm_bindgen]
pub fn say_hello() -> JsValue {
    let example = Example {
        data: vec![vec![1., 2.], vec![3., 4.]],
    };
    return JsValue::from_serde(&example).unwrap();
}
