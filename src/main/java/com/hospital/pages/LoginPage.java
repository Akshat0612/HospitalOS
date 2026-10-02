package com.hospital.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import java.time.Duration;

public class LoginPage {

    WebDriver driver;
    WebDriverWait wait;

    public LoginPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    // Locators - matching actual index.html
    By emailField = By.id("username");
    By passwordField = By.id("password");
    By loginBtn = By.id("loginBtn");
    By errorMsg = By.id("error");
    By registerLink = By.xpath("//a[@href='register.html']");
    
    // Dashboard locator - matching actual dashboard.html
    By welcomeHeader = By.xpath("//h1[contains(text(),'Welcome Back')]");
    By dashboardNav = By.className("sidebar");

    // Actions with visible delays
    public void login(String email, String password) {
        // Wait and enter email with delay
        wait.until(ExpectedConditions.visibilityOfElementLocated(emailField));
        driver.findElement(emailField).clear();
        sleep(500);
        typeSlowly(emailField, email);
        
        // Enter password with delay
        driver.findElement(passwordField).clear();
        sleep(500);
        typeSlowly(passwordField, password);
        
        sleep(800); // Pause before clicking
        driver.findElement(loginBtn).click();
        sleep(1500); // Wait for navigation
    }
    
    private void typeSlowly(By locator, String text) {
        for (char c : text.toCharArray()) {
            driver.findElement(locator).sendKeys(String.valueOf(c));
            sleep(100);
        }
    }
    
    private void sleep(int ms) {
        try { Thread.sleep(ms); } catch (InterruptedException e) { }
    }
    
    public void clickRegister() {
        wait.until(ExpectedConditions.elementToBeClickable(registerLink)).click();
        sleep(1000);
    }

    // Validations with proper error handling
    public boolean isLoginSuccessful() {
        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(welcomeHeader));
            boolean result = driver.findElement(welcomeHeader).isDisplayed();
            sleep(1000); // Pause to see success
            return result;
        } catch (Exception e) {
            return false;
        }
    }
    
    public boolean isErrorDisplayed() {
        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(errorMsg));
            boolean hasError = !driver.findElement(errorMsg).getText().isEmpty();
            sleep(1000); // Pause to see error
            return hasError;
        } catch (Exception e) {
            return false;
        }
    }
    
    public boolean isOnLoginPage() {
        try {
            return driver.findElement(loginBtn).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    public String getErrorMessage() {
        try {
            return driver.findElement(errorMsg).getText();
        } catch (Exception e) {
            return "";
        }
    }
    
    public boolean isDashboardLoaded() {
        try {
            return driver.findElement(dashboardNav).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
}