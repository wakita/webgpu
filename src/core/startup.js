export const G = { B: GPUBufferUsage }

export const ADAPTER = await navigator.gpu?.requestAdapter()
export const GPU     = await ADAPTER?.requestDevice()
