import { defineConfig } from 'vitest/config'

/* Unit-Tests für reine Module (lib/, data/, scripts/ ohne DOM).
   Astro-Komponenten werden über den Build geprüft, nicht hier. */
export default defineConfig({
  test: {
    include: ['tests/**/*.test.js'],
    environment: 'node',
    coverage: {
      provider: 'v8',
      include: ['src/lib/format.js', 'src/lib/formutil.js', 'src/scripts/searchcore.js', 'src/scripts/ics.js'],
    },
  },
})
