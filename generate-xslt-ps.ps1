# PowerShell Script to Generate XSLT Report without Ant
param(
    [string]$XmlPath = "test-output/testng-results.xml",
    [string]$XslPath = "testng-results.xsl",
    [string]$OutputPath = "test-output/XSLT_Report.html"
)

Write-Host "==========================================" -ForegroundColor Cyan
Write-Host "    Generating TestNG XSLT Report" -ForegroundColor Cyan
Write-Host "==========================================" -ForegroundColor Cyan
Write-Host ""

# Check if files exist
if (-not (Test-Path $XmlPath)) {
    Write-Error "XML file not found: $XmlPath"
    Write-Host "Please run tests first using: run-tests.bat" -ForegroundColor Yellow
    exit 1
}

if (-not (Test-Path $XslPath)) {
    Write-Error "XSL file not found: $XslPath"
    exit 1
}

Write-Host "Input XML: $XmlPath" -ForegroundColor Gray
Write-Host "XSL Style: $XslPath" -ForegroundColor Gray
Write-Host "Output:    $OutputPath" -ForegroundColor Gray
Write-Host ""

try {
    # Create XSLT processor
    $XslTransform = New-Object System.Xml.Xsl.XslCompiledTransform
    
    # Load XSL stylesheet
    $XslTransform.Load($XslPath)
    
    # Transform XML to HTML
    $XslTransform.Transform($XmlPath, $OutputPath)
    
    Write-Host "SUCCESS! XSLT Report generated." -ForegroundColor Green
    Write-Host "Location: $OutputPath" -ForegroundColor Green
    Write-Host ""
    Write-Host "==========================================" -ForegroundColor Cyan
    Write-Host "    Opening XSLT Report..." -ForegroundColor Cyan
    Write-Host "==========================================" -ForegroundColor Cyan
    
    # Open the report
    Start-Process $OutputPath
}
catch {
    Write-Error "Failed to generate XSLT report: $_"
    exit 1
}
