<?php
/* =========================================================
   Gemeinsame Helfer für die Formular-Endpunkte (PHP ≥ 7.4)
   ---------------------------------------------------------
   Antworten: JSON {ok, error|message} für fetch() mit
   „Accept: application/json“, sonst 303-Weiterleitung (ohne JS).
   Fehlercodes: invalid 422, spam 429, send_failed 502.
   Spamschutz: Honeypot „website“ (still „ok“), Zeitsperre „ts“ < 3 s.
   Versand: mail() des Webspace – keine Zugangsdaten im Code.
   Direktaufruf ist per .htaccess gesperrt.
   ========================================================= */

declare(strict_types=1);

const SVH_EMAIL_RE = '/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/u';

function svh_config(): array
{
    static $config = null;
    if ($config === null) {
        $raw = @file_get_contents(__DIR__ . '/config.json');
        $config = $raw === false ? [] : (json_decode($raw, true) ?: []);
    }
    return $config;
}

function svh_cut(string $s, int $max): string
{
    return function_exists('mb_substr') ? mb_substr($s, 0, $max, 'UTF-8') : substr($s, 0, $max);
}

/* Freitext: \r entfernen, trimmen, kürzen */
function svh_text($value, int $max = 4000): string
{
    $s = is_string($value) ? $value : '';
    $s = trim(str_replace("\r", '', $s));
    return svh_cut($s, $max);
}

/* Einzeilig (Name, Betreff …): Zeilenumbrüche entfernen – Schutz vor Header-Injection */
function svh_line($value, int $max = 200): string
{
    return trim((string) preg_replace('/[\r\n]+/', ' ', svh_text($value, $max)));
}

function svh_post(string $name): string
{
    return isset($_POST[$name]) && is_string($_POST[$name]) ? $_POST[$name] : '';
}

function svh_is_email(string $email): bool
{
    return (bool) preg_match(SVH_EMAIL_RE, $email);
}

function svh_wants_json(): bool
{
    return strpos($_SERVER['HTTP_ACCEPT'] ?? '', 'application/json') !== false;
}

/* JSON für fetch(), sonst Weiterleitung – beendet das Skript */
function svh_respond(int $status, array $body, string $redirect): void
{
    header('Cache-Control: no-store');
    header('X-Robots-Tag: noindex');
    if (svh_wants_json()) {
        http_response_code($status);
        header('Content-Type: application/json; charset=utf-8');
        echo json_encode($body, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    } else {
        header('Location: ' . $redirect, true, 303);
    }
    exit;
}

/* Nur POST; GET leitet zurück zum Formular */
function svh_require_post(string $formPage): void
{
    if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
        header('Location: ' . $formPage, true, 303);
        exit;
    }
}

/* 'honeypot' | 'too_fast' | null – fehlt ts (ohne JavaScript), wird bewusst nicht geblockt */
function svh_spam_check(): ?string
{
    if (svh_text(svh_post('website')) !== '') {
        return 'honeypot';
    }
    $ts = (int) svh_post('ts');
    $now = (int) round(microtime(true) * 1000);
    if ($ts > 0 && $now - $ts < 3000) {
        return 'too_fast';
    }
    return null;
}

/* RFC-2047-Kodierung für Betreff und Namen */
function svh_mime(string $s): string
{
    $s = str_replace(["\r", "\n"], ' ', $s);
    if (!preg_match('/[^\x20-\x7e]/', $s)) {
        return $s;
    }
    if (function_exists('mb_encode_mimeheader')) {
        return mb_encode_mimeheader($s, 'UTF-8', 'B', "\r\n");
    }
    return '=?UTF-8?B?' . base64_encode($s) . '?=';
}

function svh_address(string $name, string $email): string
{
    $email = str_replace(["\r", "\n", '<', '>', ' '], '', $email);
    $name = trim(str_replace(["\r", "\n", '"', '\\'], ' ', $name));
    if ($name === '') {
        return $email;
    }
    /* ASCII-Namen in Anführungszeichen (Sonderzeichen wie : @ , erlaubt), sonst RFC-2047-kodiert */
    $display = preg_match('/[^\x20-\x7e]/', $name) ? svh_mime($name) : '"' . $name . '"';
    return $display . ' <' . $email . '>';
}

/* rows: [[Bezeichnung, Wert], …] → Klartext-Mail */
function svh_send(string $to, string $subject, array $rows, string $replyName, string $replyEmail): bool
{
    $config = svh_config();
    $from = (string) ($config['mailFrom'] ?? '');
    if (!svh_is_email($to) || !svh_is_email($from)) {
        error_log('[svh-form] Empfänger/Absender in config.json fehlen oder sind ungültig');
        return false;
    }
    $lines = [];
    foreach ($rows as $row) {
        $value = (string) ($row[1] ?? '');
        $lines[] = $row[0] . ': ' . ($value !== '' ? $value : '–');
    }
    $body = implode("\n", $lines) . "\n\n-- \nGesendet über das Formular auf der Vereinswebsite.\n";
    $headers = [
        'From' => svh_address((string) ($config['fromName'] ?? ''), $from),
        'Reply-To' => svh_address($replyName, $replyEmail),
        'MIME-Version' => '1.0',
        'Content-Type' => 'text/plain; charset=UTF-8',
        'Content-Transfer-Encoding' => '8bit',
        'X-Mailer' => 'SVH-Website',
    ];
    $ok = mail($to, svh_mime($subject), $body, $headers, '-f' . $from);
    if (!$ok) {
        error_log('[svh-form] mail() fehlgeschlagen');
    }
    return $ok;
}
