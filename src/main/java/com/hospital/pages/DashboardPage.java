package com.hospital.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import java.time.Duration;

public class DashboardPage {

    WebDriver driver;
    WebDriverWait wait;

    public DashboardPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    // Locators - matching actual dashboard.html
    By welcomeHeader = By.xpath("//h1[contains(text(),'Welcome Back')]");
    By sidebar = By.className("sidebar");
    By logoutBtn = By.xpath("//button[contains(text(),'Logout')]");
    
    // Navigation links in sidebar
    By homeLink = By.xpath("//a[@href='dashboard.html']");
    By appointmentsLink = By.xpath("//a[@href='appointment.html']");
    By doctorsLink = By.xpath("//a[@href='doctors.html']");
    By billingLink = By.xpath("//a[@href='billing.html']");
    By aiLink = By.xpath("//a[@href='ai.html']");
    
    // Card buttons
    By appointmentsCardBtn = By.xpath("//div[contains(@class,'card')]//h3[contains(text(),'Appointments')]/following-sibling::button");
    By doctorsCardBtn = By.xpath("//div[contains(@class,'card')]//h3[contains(text(),'Doctors')]/following-sibling::button");
    By billingCardBtn = By.xpath("//div[contains(@class,'card')]//h3[contains(text(),'Billing')]/following-sibling::button");
    By aiCardBtn = By.xpath("//div[contains(@class,'card')]//h3[contains(text(),'Triage')]/following-sibling::button");

    public boolean isLoginSuccessful() {
        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(welcomeHeader));
            boolean result = driver.findElement(welcomeHeader).isDisplayed();
            sleep(1000);
            return result;
        } catch (Exception e) {
            return false;
        }
    }
    
    public String getWelcomeText() {
        try {
            return driver.findElement(welcomeHeader).getText();
        } catch (Exception e) {
            return "";
        }
    }
    
    public void navigateToAppointments() {
        wait.until(ExpectedConditions.elementToBeClickable(appointmentsLink)).click();
        sleep(1500);
    }
    
    public void navigateToDoctors() {
        wait.until(ExpectedConditions.elementToBeClickable(doctorsLink)).click();
        sleep(1500);
    }
    
    public void navigateToBilling() {
        wait.until(ExpectedConditions.elementToBeClickable(billingLink)).click();
        sleep(1500);
    }
    
    public void navigateToAI() {
        wait.until(ExpectedConditions.elementToBeClickable(aiLink)).click();
        sleep(1500);
    }
    
    public void logout() {
        wait.until(ExpectedConditions.elementToBeClickable(logoutBtn)).click();
        sleep(1500);
    }
    
    public boolean isDashboardDisplayed() {
        try {
            return driver.findElement(sidebar).isDisplayed() &&
                   driver.findElement(welcomeHeader).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    private void sleep(int ms) {
        try { Thread.sleep(ms); } catch (InterruptedException e) { }
    }
}