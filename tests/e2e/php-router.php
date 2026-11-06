<?php
/* Router für `php -S` in den E2E-Tests – verhält sich wie Apache mit der erzeugten .htaccess:
   /pfad → 301 auf /pfad/, /pfad/ → index.html, Formular-Interna gesperrt, sonst 404.html.
   Wird nicht veröffentlicht (liegt nicht in public/). */

$root = rtrim((string) realpath($_SERVER['DOCUMENT_ROOT']), '/');
$rawPath = (string) (parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH) ?? '/');
$file = realpath($root . rawurldecode($rawPath));

$notFound = static function () use ($root): bool {
    http_response_code(404);
    header('Content-Type: text/html; charset=utf-8');
    readfile($root . '/404.html');
    return true;
};

if ($file === false || ($file !== $root && strpos($file, $root . '/') !== 0)) {
    return $notFound();
}
if (preg_match('#/(_lib\.php|config\.json)$#', $file)) {
    http_response_code(403);
    return true;
}
if (is_dir($file)) {
    if (substr($rawPath, -1) !== '/') {
        header('Location: ' . $rawPath . '/', true, 301);
        return true;
    }
    if (is_file($file . '/index.html')) {
        header('Content-Type: text/html; charset=utf-8');
        readfile($file . '/index.html');
        return true;
    }
    return $notFound();
}
return false; /* Datei ausliefern bzw. PHP ausführen */
