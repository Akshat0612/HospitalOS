package com.hospital.base;

import java.util.HashMap;
import java.util.Map;

import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.testng.annotations.AfterMethod;
import org.testng.annotations.BeforeMethod;

import io.github.bonigarcia.wdm.WebDriverManager;

public class BaseTest {

    public WebDriver driver;
    public static final String VALID_EMAIL = "neerugoyal@gmail.com";
    public static final String VALID_PASSWORD = "Neeru";
    public static final String BASE_URL = "file:///C:/Users/asus/OneDrive/Desktop/hospital-management-system1/frontend/index.html";

    @BeforeMethod(alwaysRun = true)
    public void setup() {
        WebDriverManager.chromedriver().setup();

        // Disable password manager + breach popup
        Map<String, Object> prefs = new HashMap<>();
        prefs.put("credentials_enable_service", false);
        prefs.put("profile.password_manager_enabled", false);

        ChromeOptions options = new ChromeOptions();
        options.setExperimentalOption("prefs", prefs);
        options.addArguments("--disable-notifications");
        options.addArguments("--disable-infobars");
        options.addArguments("--disable-extensions");
        // Slow down execution for visibility
        options.addArguments("--slow-motion=100");

        driver = new ChromeDriver(options);
        driver.manage().window().maximize();

        // Navigate to the application
        driver.get(BASE_URL);
        
        // Initial delay for visibility
        sleep(1000);
    }

    @AfterMethod(alwaysRun = true)
    public void tearDown() {
        sleep(2000); // Pause to see final state
        if (driver != null) {
            try {
                driver.quit();
            } catch (Exception e) {
                // Ignore cleanup errors
            }
        }
    }
    
    // Helper method for visible delays
    public void sleep(int milliseconds) {
        try {
            Thread.sleep(milliseconds);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }
    
    // Helper to inject valid user token
    public void injectValidUser() {
        JavascriptExecutor js = (JavascriptExecutor) driver;
        js.executeScript(
            "localStorage.setItem('token', 'valid-user-token');" +
            "localStorage.setItem('user', JSON.stringify({" +
            "    name:'Neeru Goyal'," +
            "    email:'" + VALID_EMAIL + "'," +
            "    role:'patient'" +
            "}));"
        );
        sleep(500);
    }
    
    // Helper to clear storage and logout
    public void clearSession() {
        try {
            JavascriptExecutor js = (JavascriptExecutor) driver;
            js.executeScript(
                "localStorage.clear();" +
                "sessionStorage.clear();"
            );
            sleep(500);
        } catch (Exception e) {
            // Ignore
        }
    }
}