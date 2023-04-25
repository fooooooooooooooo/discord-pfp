import { defineConfig, presetWind, transformerDirectives } from 'unocss';

export default defineConfig({
  presets: [presetWind()],
  transformers: [transformerDirectives()],
});
