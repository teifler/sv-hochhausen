/* Commit-Nachrichten nach Conventional Commits: <typ>(<bereich>): <beschreibung>
   Typen: feat, fix, docs, style, refactor, perf, test, build, ci, chore, revert
   Beispiel: feat(termine): Sommerfest 2027 eintragen */
export default {
  extends: ['@commitlint/config-conventional'],
  rules: {
    // Deutsche Substantive beginnen groß – Groß-/Kleinschreibung des Betreffs nicht erzwingen
    'subject-case': [0],
  },
}
