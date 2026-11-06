/* Commit-Wächter (scripts/check-staged.mjs) – mit erfundenen Beispielwerten */
import { describe, expect, it } from 'vitest'
import { findProblems, MAX_BYTES, secretValues } from '../scripts/check-staged.mjs'

const file = (path, content, size = content?.length ?? 0) => ({ path, content, size })
/* zusammengesetzt, damit der Wächter diese Testdatei selbst nicht blockiert */
const FAKE_KEY = ['-----BEGIN OPENSSH', 'PRIVATE KEY-----'].join(' ')
const FAKE_PASSWORD_LINE = ['const pass', "word = 'hunter2hunter2'"].join('')

describe('secretValues', () => {
  it('liest Werte aus .env, lässt öffentliche, leere und rein numerische weg', () => {
    const env = [
      'SITE_URL=https://www.example.org',
      'DEPLOY_HOST=srv42.hoster.example',
      'DEPLOY_PORT=22',
      'DEPLOY_USER=',
      'X=abc',
    ].join('\n')
    expect(secretValues(env)).toEqual([['DEPLOY_HOST', 'srv42.hoster.example']])
  })
})

describe('findProblems', () => {
  const secrets = [['DEPLOY_HOST', 'srv42.hoster.example']]

  it('lässt normale Dateien durch', () => {
    expect(findProblems([file('src/data/news.js', "export const news = [{ title: 'Sommerfest' }]")], secrets)).toEqual(
      [],
    )
  })

  it('blockiert Werte aus der lokalen .env – ohne den Wert zu nennen', () => {
    const [p] = findProblems([file('README.md', 'Server: srv42.hoster.example')], secrets)
    expect(p).toContain('DEPLOY_HOST')
    expect(p).not.toContain('srv42')
  })

  it('blockiert .env-Dateien, private Schlüssel und Zugangswerte', () => {
    expect(findProblems([file('.env', 'A=b')])).toHaveLength(1)
    expect(findProblems([file('.env.example', 'DEPLOY_HOST=')])).toEqual([])
    expect(findProblems([file('key', `${FAKE_KEY}\nabc`)])).toHaveLength(1)
    expect(findProblems([file('config.js', FAKE_PASSWORD_LINE)])).toHaveLength(1)
    expect(findProblems([file('doc.md', 'Passwort-Login: aus')])).toEqual([])
    expect(findProblems([file('build.mjs', 'const token = process.env.INSTAGRAM_TOKEN')])).toEqual([])
    expect(findProblems([file('.env.sample', 'TOKEN=abcdef123456')])).toHaveLength(2)
  })

  it('blockiert sehr große Dateien, prüft Binärdateien aber nicht inhaltlich', () => {
    expect(findProblems([file('big.zip', null, MAX_BYTES + 1)])).toHaveLength(1)
    expect(findProblems([file('foto.jpg', null, 1000)])).toEqual([])
  })
})
