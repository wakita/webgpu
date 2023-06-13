import vitePluginString from 'vite-plugin-string'  // WGSL のサポートのため

export default {
  base: '/webgpu-issue/',
  plugins: [
    vitePluginString({ include: ['**/*.vs', '**/*.fs', '**/*.wgsl' ] })
  ]
}
