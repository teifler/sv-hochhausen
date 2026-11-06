<?php
/* POST /api/spende.php – Spende ankündigen → E-Mail an den Verein */

declare(strict_types=1);
require __DIR__ . '/_lib.php';

svh_require_post('/spenden/');

$spam = svh_spam_check();
if ($spam === 'honeypot') {
    svh_respond(200, ['ok' => true, 'message' => 'Danke!'], '/spenden/danke/');
}
if ($spam !== null) {
    svh_respond(429, ['ok' => false, 'error' => 'spam'], '/kontakt/fehler/');
}

$choice = svh_line(svh_post('amount'), 20);
$other = (float) str_replace(',', '.', svh_line(svh_post('amountOther'), 12));
$amount = 'offen';
if (preg_match('/^\d+$/', $choice)) {
    $amount = $choice . ' €';
} elseif ($choice === 'andere' && $other > 0) {
    $amount = rtrim(rtrim(number_format(round($other, 2), 2, ',', ''), '0'), ',') . ' €';
}

$name = svh_line(svh_post('name'), 120);
$email = svh_line(svh_post('email'), 160);
$phone = svh_line(svh_post('phone'), 40);
$purpose = svh_line(svh_post('purpose'), 80);
if ($purpose === '') {
    $purpose = 'Wo es am meisten hilft';
}
$receipt = svh_post('receipt') !== '';
$street = svh_line(svh_post('street'), 160);
$city = svh_line(svh_post('city'), 120);
$isPublic = svh_post('public') !== '';
$message = svh_text(svh_post('message'), 2000);
$consent = svh_post('consent') !== '';

if ($name === '' || !svh_is_email($email) || !$consent || ($receipt && ($street === '' || $city === ''))) {
    svh_respond(422, ['ok' => false, 'error' => 'invalid'], '/kontakt/fehler/');
}

$config = svh_config();
$to = (string) ($config['donationTo'] ?? ($config['mailTo'] ?? ''));
$sent = svh_send($to, '[Website] Spendenzusage ' . $amount . ' – ' . $name, [
    ['Betrag', $amount],
    ['Verwendung', $purpose],
    ['Name', $name],
    ['E-Mail', $email],
    ['Telefon', $phone],
    ['Spendenquittung gewünscht', $receipt ? 'ja' : 'nein'],
    ['Anschrift', $receipt ? $street . ', ' . $city : ''],
    ['Öffentliche Nennung erlaubt', $isPublic ? 'ja' : 'nein'],
    ['Nachricht', $message],
    ['Einwilligung Datenschutz', 'ja'],
], $name, $email);

if (!$sent) {
    svh_respond(502, ['ok' => false, 'error' => 'send_failed'], '/kontakt/fehler/');
}

$bank = is_array($config['bank'] ?? null) ? $config['bank'] : null;
$esc = static function (string $s): string {
    return htmlspecialchars($s, ENT_QUOTES, 'UTF-8');
};
$thanks = '<strong>Vielen Dank für deine Unterstützung!</strong> ';
$thanks .= $bank
    ? 'Bitte überweise den Betrag an: ' . $esc((string) $bank['holder']) . ', IBAN ' . $esc((string) $bank['iban'])
        . ($bank['bankName'] !== '' ? ' (' . $esc((string) $bank['bankName']) . ')' : '')
        . ', Verwendungszweck „' . $esc((string) $bank['reference']) . '“.'
    : 'Der Verein meldet sich in Kürze mit den Überweisungsdaten bei dir.';

svh_respond(200, ['ok' => true, 'message' => $thanks], '/spenden/danke/');
