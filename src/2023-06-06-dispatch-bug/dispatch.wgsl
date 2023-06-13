@group(0) @binding(0) var<storage, read_write> A: array<i32>;

const PI = 3.14159265358979323846;
const INV4PI = 1/PI/4;

fn any_compute(a : vec4f, b : vec4f) -> vec3f {
  let v = (a - b).xyz;
  let d = length(vec4f(v, 1e-3)); 
  return - INV4PI * b.w * v / (d * d * d);
}

const V4 = vec4f(1, 2, 3, 4);

@compute @workgroup_size(64)
fn test(@builtin(global_invocation_id) gid : vec3<u32>) {
  for (var c = 0u; c < arrayLength(&A); c++) {
    any_compute(V4, V4);
    if (gid.x == 0) {
      A[c] = A[c] + 1;
    }
  }
}
