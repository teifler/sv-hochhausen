<?php
/* POST /api/contact.php – Kontaktformular → E-Mail an den Verein */

declare(strict_types=1);
require __DIR__ . '/_lib.php';

svh_require_post('/kontakt/');

$spam = svh_spam_check();
if ($spam === 'honeypot') {
    svh_respond(200, ['ok' => true, 'message' => 'Danke!'], '/kontakt/danke/');
}
if ($spam !== null) {
    svh_respond(429, ['ok' => false, 'error' => 'spam'], '/kontakt/fehler/');
}

$config = svh_config();
$topics = is_array($config['topics'] ?? null) ? $config['topics'] : [];
$topicKey = svh_line(svh_post('topic'), 40);
$topic = $topics[$topicKey] ?? ($topics['allgemein'] ?? 'Allgemeine Anfrage');

$name = svh_line(svh_post('name'), 120);
$email = svh_line(svh_post('email'), 160);
$phone = svh_line(svh_post('phone'), 40);
$department = svh_line(svh_post('department'), 60);
$message = svh_text(svh_post('message'), 4000);
$consent = svh_post('consent') !== '';

$messageLength = function_exists('mb_strlen') ? mb_strlen($message, 'UTF-8') : strlen($message);
if ($name === '' || !svh_is_email($email) || $messageLength < 10 || !$consent) {
    svh_respond(422, ['ok' => false, 'error' => 'invalid'], '/kontakt/fehler/');
}

$subject = '[Website] ' . $topic . ($department !== '' ? ' · ' . $department : '') . ' – ' . $name;
$sent = svh_send((string) ($config['mailTo'] ?? ''), $subject, [
    ['Anliegen', $topic],
    ['Abteilung', $department],
    ['Name', $name],
    ['E-Mail', $email],
    ['Telefon', $phone],
    ['Nachricht', $message],
    ['Einwilligung Datenschutz', 'ja'],
], $name, $email);

if (!$sent) {
    svh_respond(502, ['ok' => false, 'error' => 'send_failed'], '/kontakt/fehler/');
}

svh_respond(200, [
    'ok' => true,
    'message' => '<strong>Danke, deine Nachricht ist angekommen!</strong> Wir melden uns so bald wie möglich bei dir.',
], '/kontakt/danke/');
