@echo off
echo ==========================================
echo    Generating TestNG XSLT Report
echo ==========================================
echo.

:: Check if Ant is installed
where ant >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo ERROR: Apache Ant is not installed or not in PATH
    echo.
    echo Please install Apache Ant:
    echo 1. Download from: https://ant.apache.org/bindownload.cgi
    echo 2. Extract to C:\apache-ant
    echo 3. Add C:\apache-ant\bin to your PATH environment variable
    echo.
    pause
    exit /b 1
)

:: Generate XSLT Report
echo Running Ant to generate XSLT report...
ant -f build.xml generate-report

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ==========================================
    echo    XSLT Report Generated Successfully!
    echo ==========================================
    echo.
    echo Report location: test-output\XSLT_Report.html
    echo.
    echo Opening report...
    start test-output\XSLT_Report.html
) else (
    echo.
    echo ERROR: Failed to generate XSLT report
    pause
)
