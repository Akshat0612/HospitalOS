@echo off
echo ==========================================
echo    Opening TestNG Reports
echo ==========================================
echo.

set PROJECT_DIR=%~dp0
set TEST_OUTPUT=%PROJECT_DIR%test-output

echo Checking for reports in: %TEST_OUTPUT%
echo.

:: Check if test-output exists
if not exist "%TEST_OUTPUT%" (
    echo ERROR: test-output folder not found!
    echo Please run tests first using: run-tests.bat
    pause
    exit /b 1
)

:: Open Emailable Report
if exist "%TEST_OUTPUT%\emailable-report.html" (
    echo [1/3] Opening Emailable Report...
    start "" "%TEST_OUTPUT%\emailable-report.html"
) else (
    echo [1/3] Emailable report not found
)

:: Open Index Report
if exist "%TEST_OUTPUT%\index.html" (
    echo [2/3] Opening Index Report...
    timeout /t 2 /nobreak >nul
    start "" "%TEST_OUTPUT%\index.html"
) else (
    echo [2/3] Index report not found
)

:: Check for XSLT Report
if exist "%TEST_OUTPUT%\XSLT_Report.html" (
    echo [3/3] Opening XSLT Report...
    timeout /t 2 /nobreak >nul
    start "" "%TEST_OUTPUT%\XSLT_Report.html"
) else (
    echo [3/3] XSLT report not found
    echo        Run: generate-xslt-report.bat to create it
)

echo.
echo ==========================================
echo    Reports Opened in Browser!
echo ==========================================
echo.
pause
