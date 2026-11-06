@echo off
chcp 65001 >nul
title SV Hochhausen - GitHub-Upload
cd /d "%~dp0"
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0scripts\github-upload.ps1"
echo.
pause
