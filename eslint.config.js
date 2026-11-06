// @ts-check
/* ESLint (Flat Config): JavaScript + Astro-Komponenten inkl. Barrierefreiheit (jsx-a11y).
   Formatierung übernimmt Prettier – eslint-config-prettier schaltet kollidierende Regeln ab. */
import js from '@eslint/js'
import astro from 'eslint-plugin-astro'
import prettier from 'eslint-config-prettier'
import globals from 'globals'
import tseslint from 'typescript-eslint'

export default [
  { ignores: ['dist/', '.vercel/', '.astro/', 'coverage/', 'node_modules/'] },

  js.configs.recommended,
  ...astro.configs.recommended,
  ...astro.configs['jsx-a11y-recommended'],

  /* Frontmatter der .astro-Dateien enthält TypeScript (interface Props, `as`-Casts) */
  {
    files: ['**/*.astro'],
    languageOptions: { parserOptions: { parser: tseslint.parser } },
  },

  {
    rules: {
      /* `catch {}` ist hier gewollt: localStorage/sessionStorage/Clipboard dürfen still scheitern */
      'no-empty': ['error', { allowEmptyCatch: true }],
      /* `const { meta, ...rest } = it` = Feld bewusst weglassen */
      'no-unused-vars': ['error', { ignoreRestSiblings: true }],
      /* onerror/onload an <img> sind Bild-Fallbacks, keine Bedien-Interaktion */
      'astro/jsx-a11y/no-noninteractive-element-interactions': [
        'error',
        { handlers: ['onClick', 'onMouseDown', 'onMouseUp', 'onKeyPress', 'onKeyDown', 'onKeyUp'] },
      ],
    },
  },

  /* Browser-Code: Module in src/scripts/ */
  {
    files: ['src/scripts/**/*.js'],
    languageOptions: { globals: { ...globals.browser } },
  },

  /* Node-Code: Build-Skripte, Konfiguration, API-Routen, Helfer, Daten, Tests */
  {
    files: ['scripts/**/*.mjs', '*.config.{js,mjs}', 'src/{lib,data,pages}/**/*.js', 'tests/**/*.js'],
    languageOptions: { globals: { ...globals.node } },
  },

  prettier,
]
