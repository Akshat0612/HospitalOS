package com.hospital.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import java.time.Duration;

public class RegisterPage {

    WebDriver driver;
    WebDriverWait wait;

    public RegisterPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    // Locators - matching actual register.html
    By nameField = By.id("regName");
    By emailField = By.id("regEmail");
    By passwordField = By.id("regPass");
    By staffCodeField = By.id("staffCode");
    By registerBtn = By.id("registerBtn");
    By errorMsg = By.id("regError");
    By loginLink = By.xpath("//a[@href='index.html']");
    By createAccountHeader = By.xpath("//h2[contains(text(),'Create account')]");

    // Actions with delays
    public void enterName(String name) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(nameField));
        driver.findElement(nameField).clear();
        sleep(300);
        driver.findElement(nameField).sendKeys(name);
        sleep(200);
    }
    
    public void enterEmail(String email) {
        driver.findElement(emailField).clear();
        sleep(200);
        driver.findElement(emailField).sendKeys(email);
        sleep(200);
    }
    
    public void enterPassword(String password) {
        driver.findElement(passwordField).clear();
        sleep(200);
        driver.findElement(passwordField).sendKeys(password);
        sleep(200);
    }
    
    public void enterStaffCode(String code) {
        driver.findElement(staffCodeField).clear();
        sleep(200);
        driver.findElement(staffCodeField).sendKeys(code);
        sleep(200);
    }

    public void register(String name, String email, String password) {
        enterName(name);
        enterEmail(email);
        enterPassword(password);
        sleep(500);
        driver.findElement(registerBtn).click();
        sleep(1500);
    }
    
    public void registerAsStaff(String name, String email, String password, String staffCode) {
        enterName(name);
        enterEmail(email);
        enterPassword(password);
        enterStaffCode(staffCode);
        sleep(500);
        driver.findElement(registerBtn).click();
        sleep(1500);
    }

    public boolean isRegistrationSuccessful() {
        try {
            // Check if redirected to login or shows success
            sleep(1000);
            boolean onLogin = driver.findElement(By.id("loginBtn")).isDisplayed();
            return onLogin;
        } catch (Exception e) {
            return false;
        }
    }
    
    public boolean isErrorDisplayed() {
        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(errorMsg));
            boolean hasError = !driver.findElement(errorMsg).getText().isEmpty();
            sleep(1000);
            return hasError;
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
    
    public boolean isOnRegisterPage() {
        try {
            return driver.findElement(createAccountHeader).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    public void goBackToLogin() {
        wait.until(ExpectedConditions.elementToBeClickable(loginLink)).click();
        sleep(1000);
    }
    
    private void sleep(int ms) {
        try { Thread.sleep(ms); } catch (InterruptedException e) { }
    }
}
