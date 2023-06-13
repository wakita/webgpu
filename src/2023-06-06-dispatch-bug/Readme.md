---
title: 'Dispatch bug'
author: 'Ken Wakita'
date: '2023-06-06'
---

# 経緯

2023-06-06 に峰くんが WSGL で記述した単純な並列コードの実行において、race condition に伴うと思われる不可思議な現象を発見した。そのコードは複数のスレッドを動作させるものの、単一のスレッドがバッファの各要素をインクリメントするものであった。想定ではバッファの内容はすべて1になるはずだが、プログラムを動かすと一部の内容が2、あるいは3になっていた。

峰くんはこの問題を脇田に報告したものの、原因解明にな至らなかったため StackOverflow に質問を掲げた。2023-06-09 に経験豊かなゲームプログラマの [Gman 氏より詳しい回答が寄せられた](https://stackoverflow.com/a/76437808/5850002)。

バグの原因は、われわれの `_.dispatchWorkgroups(...)` についての理解不足によるものであった。(c.f. [`dispatchWorkgroups(workgroupCountX, workgroupCountY, workgroupCountZ)`](https://www.w3.org/TR/webgpu/#dom-gpucomputepassencoder-dispatchworkgroups))

> Note: The x, y, and z values passed to dispatchWorkgroups() and dispatchWorkgroupsIndirect() are the number of workgroups to dispatch for each dimension, not the number of shader invocations to perform across each dimension. This matches the behavior of modern native GPU APIs, but differs from the behavior of OpenCL.
>
> This means that if a GPUShaderModule defines an entry point with @workgroup_size(4, 4), and work is dispatched to it with the call computePass.dispatchWorkgroups(8, 8); the entry point will be invoked 1024 times total: Dispatching a 4x4 workgroup 8 times along both the X and Y axes. (4*4*8*8=1024)

"work load", "work group", "work item" の諸概念とその大きさについては、[Surma 氏の解説 "All of the cores, none of the canvas"](https://surma.dev/things/webgpu/) の Workgroups の節がわかりやすい。[inzkyk.xyz氏による日本語訳](https://inzkyk.xyz/misc/webgpu/#ワークグループ)もある。

---

# 理解が不十分な点

## `comp.wgsl`

1. `@group(0) @binding(0) var<storage, read_write> resultBuffer: array<f32>;`

    - この宣言の役割は何か
    - `group`, `binding` の番号は何を意味しているのか。
    - これらの番号を JS と共有できるのか
    - 配列だけでなく、スカラーも宣言できるのか

1. `vec4<f32>`
    - `typedef` 的なことはできるのか
        - `alias Float4 = vec4<f32>;` のような宣言ができる
        - でも、組込みの `vec4f` があった
    - `sizeof(vec4<f32>)` 的なことはできるのか
        - `arrayLength(&resultBuffer)` で対応し、comp.wgsl から magic number の `1000` を消した。

1. `fn test(@builtin(workgroup_id) id : vec3<u32>) {`

    - `@builtin` には `workgroup_id` 以外に与えることができるもののリストは
    - `test` に `@builtin` でない仮引数を与えることはできるのか

---
# 思わぬ発見

- `if` 文の brace を省略できないらしい。

- WGSL と JavaScript の間のデータ構造のバインディングでは、`@group(_) @binding(_)` で与える番号が意味を持ち、変数名はバインディングに影響を与えないらしい。
