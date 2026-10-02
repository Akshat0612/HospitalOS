<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform">

<xsl:template match="/">
<html>
<head>
    <title>TestNG XSLT Report</title>
    <style>
        body { 
            font-family: Arial, sans-serif; 
            margin: 20px;
            background-color: #f5f5f5;
        }
        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 20px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }
        h1 { 
            color: #333;
            text-align: center;
            border-bottom: 2px solid #4CAF50;
            padding-bottom: 10px;
        }
        h2 {
            color: #555;
            margin-top: 30px;
        }
        table { 
            border-collapse: collapse; 
            width: 100%; 
            margin: 20px 0;
        }
        th, td { 
            border: 1px solid #ddd; 
            padding: 12px; 
            text-align: center; 
        }
        th { 
            background-color: #4CAF50; 
            color: white;
            font-weight: bold;
        }
        tr:nth-child(even) {
            background-color: #f9f9f9;
        }
        tr:hover {
            background-color: #f1f1f1;
        }
        .passed { 
            background-color: #d4edda; 
            color: #155724;
            font-weight: bold;
        }
        .failed { 
            background-color: #f8d7da; 
            color: #721c24;
            font-weight: bold;
        }
        .skipped { 
            background-color: #fff3cd; 
            color: #856404;
        }
        .summary-box {
            display: flex;
            justify-content: space-around;
            margin: 20px 0;
            padding: 20px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border-radius: 10px;
            color: white;
        }
        .summary-item {
            text-align: center;
        }
        .summary-item h3 {
            margin: 0;
            font-size: 32px;
        }
        .summary-item p {
            margin: 5px 0;
            font-size: 14px;
            opacity: 0.9;
        }
        .test-method {
            text-align: left;
            font-family: monospace;
            font-size: 12px;
        }
        .timestamp {
            color: #666;
            font-size: 12px;
        }
    </style>
</head>

<body>
    <div class="container">
        <h1>TestNG Automation Report</h1>
        
        <!-- Summary Box -->
        <div class="summary-box">
            <div class="summary-item">
                <h3><xsl:value-of select="testng-results/@total"/></h3>
                <p>Total Tests</p>
            </div>
            <div class="summary-item">
                <h3><xsl:value-of select="testng-results/@passed"/></h3>
                <p>Passed</p>
            </div>
            <div class="summary-item">
                <h3><xsl:value-of select="testng-results/@failed"/></h3>
                <p>Failed</p>
            </div>
            <div class="summary-item">
                <h3><xsl:value-of select="testng-results/@skipped"/></h3>
                <p>Skipped</p>
            </div>
        </div>

        <!-- Summary Table -->
        <h2>Test Summary</h2>
        <table>
            <tr>
                <th>Total</th>
                <th>Passed</th>
                <th>Failed</th>
                <th>Skipped</th>
                <th>Success Rate</th>
            </tr>
            <tr>
                <td><xsl:value-of select="testng-results/@total"/></td>
                <td class="passed"><xsl:value-of select="testng-results/@passed"/></td>
                <td class="failed"><xsl:value-of select="testng-results/@failed"/></td>
                <td class="skipped"><xsl:value-of select="testng-results/@skipped"/></td>
                <td>
                    <xsl:variable name="total" select="number(testng-results/@total)"/>
                    <xsl:variable name="passed" select="number(testng-results/@passed)"/>
                    <xsl:choose>
                        <xsl:when test="$total > 0">
                            <xsl:value-of select="format-number(($passed div $total) * 100, '0.00')"/>%
                        </xsl:when>
                        <xsl:otherwise>0%</xsl:otherwise>
                    </xsl:choose>
                </td>
            </tr>
        </table>

        <!-- Test Details -->
        <h2>Test Case Details</h2>
        <table>
            <tr>
                <th>Test Name</th>
                <th>Class</th>
                <th>Status</th>
                <th>Time (ms)</th>
            </tr>
            <xsl:for-each select="testng-results/suite/test/class/test-method">
                <tr>
                    <td class="test-method"><xsl:value-of select="@name"/></td>
                    <td><xsl:value-of select="../@name"/></td>
                    <td>
                        <xsl:choose>
                            <xsl:when test="@status='PASS'">
                                <span class="passed">PASSED</span>
                            </xsl:when>
                            <xsl:when test="@status='FAIL'">
                                <span class="failed">FAILED</span>
                            </xsl:when>
                            <xsl:otherwise>
                                <span class="skipped"><xsl:value-of select="@status"/></span>
                            </xsl:otherwise>
                        </xsl:choose>
                    </td>
                    <td><xsl:value-of select="@duration-ms"/></td>
                </tr>
            </xsl:for-each>
        </table>

        <!-- Generated Time -->
        <p class="timestamp">Report generated on: <xsl:value-of select="testng-results/@started-at"/></p>
    </div>
</body>
</html>
</xsl:template>

</xsl:stylesheet>
