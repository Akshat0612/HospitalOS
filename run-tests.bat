@echo off
chcp 65001 >nul
setlocal EnableDelayedExpansion

:: Set JAVA_HOME to the correct JDK path
set JAVA_HOME=C:\Program Files\Java\jdk-25.0.2

echo Using Java at: %JAVA_HOME%
echo.

:: Set MAVEN_OPTS for proper encoding
set MAVEN_OPTS=-Xmx1024m -Dfile.encoding=UTF-8

:: Run Maven tests
call mvnw.cmd clean test %*

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo Tests failed with exit code %ERRORLEVEL%
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo Tests completed successfully!
pause
