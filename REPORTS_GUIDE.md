# TestNG Reports Guide

## 📊 3 Types of Reports Available

### 1. ✅ Emailable Report (Auto-Generated)
**Location:** `test-output/emailable-report.html`

**Features:**
- Simple, clean table format
- Easy to email/share
- Shows pass/fail summary
- No dependencies required

**How to View:**
```
Simply open: test-output/emailable-report.html
```

---

### 2. ✅ Index Report (Auto-Generated)
**Location:** `test-output/index.html`

**Features:**
- Detailed HTML report
- Test method details
- Execution timeline
- Group-wise results
- Failed test details

**How to View:**
```
Simply open: test-output/index.html
```

---

### 3. ✅ XSLT Report (Generate via Ant)
**Location:** `test-output/XSLT_Report.html` (after generation)

**Features:**
- Custom styled report
- Color-coded results
- Success rate percentage
- Professional look
- Summary dashboard

**How to Generate:**

#### Step 1: Install Apache Ant (One-time setup)

**Option A: Using Chocolatey (Recommended)**
```cmd
choco install ant
```

**Option B: Manual Installation**
1. Download Ant from: https://ant.apache.org/bindownload.cgi
2. Extract to `C:\apache-ant`
3. Set Environment Variables:
   - `ANT_HOME` = `C:\apache-ant`
   - Add to `PATH`: `C:\apache-ant\bin`
4. Verify: Open CMD and type `ant -version`

#### Step 2: Generate Report

**Option A: Using Batch File (Easy)**
```cmd
generate-xslt-report.bat
```

**Option B: Using Command Line**
```cmd
ant -f build.xml generate-report
```

**Option C: Using Eclipse**
1. Right-click `build.xml` in Project Explorer
2. Run As → Ant Build
3. Select `generate-report` target

---

## 📁 All Report Locations

After running tests, find your reports here:

```
hospital-management-system1/
├── test-output/
│   ├── emailable-report.html      ← Simple email-friendly report
│   ├── index.html                 ← Detailed HTML report
│   ├── XSLT_Report.html           ← Custom styled report (after generation)
│   └── testng-results.xml         ← Raw XML data
└── target/
    └── surefire-reports/          ← Maven surefire reports
```

---

## 🎯 Quick Access

### After Running Tests in Eclipse:

1. **Refresh Project** (F5)
2. **Expand** `test-output` folder
3. **Right-click** on any `.html` file
4. **Open With** → Web Browser

### After Running Tests via Maven:

```cmd
# Open emailable report
start test-output\emailable-report.html

# Open index report  
start test-output\index.html

# Generate and open XSLT report
generate-xslt-report.bat
```

---

## 📊 Report Comparison

| Feature | Emailable | Index | XSLT |
|---------|-----------|-------|------|
| Auto-generated | ✅ | ✅ | ❌ (manual) |
| Email-friendly | ✅ | ❌ | ❌ |
| Detailed logs | ❌ | ✅ | ✅ |
| Custom styling | ❌ | ❌ | ✅ |
| Success rate % | ❌ | ❌ | ✅ |
| Test timeline | ❌ | ✅ | ❌ |
| Easy to share | ✅ | ❌ | ✅ |

---

## ⚠️ Important Notes

1. **XSLT Report** requires Apache Ant to be installed
2. **Reports update** every time you run tests
3. **Old reports** are overwritten with new results
4. **Back up** reports if you need to keep history

---

## 🆘 Troubleshooting

### XSLT Report Generation Fails

**Error:** `'ant' is not recognized`
**Solution:** Install Apache Ant and add to PATH

**Error:** `testng-results.xml not found`
**Solution:** Run tests first to generate the XML file

**Error:** `stylesheet not found`
**Solution:** Ensure `testng-results.xsl` is in project root

---

## 📧 Sharing Reports

### For Email:
- Use `emailable-report.html` (clean, simple)
- Or attach screenshot of XSLT report

### For Stakeholders:
- Use `XSLT_Report.html` (professional look)
- Or `index.html` (detailed view)

### For Debugging:
- Use `index.html` (full details)
- Check `target/surefire-reports/` for logs
