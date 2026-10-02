package com.hospital.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import java.time.Duration;

public class BillingPage {

    WebDriver driver;
    WebDriverWait wait;

    public BillingPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    // Locators for new billing interface
    By billingLink = By.xpath("//a[contains(text(),'Billing')]");
    By patientName = By.id("patientName");
    By doctorSelect = By.id("billingDoctor");
    By addItemBtn = By.className("btn-add-item");
    By generateBtn = By.className("btn-generate");
    By billMsg = By.id("billMsg");
    By itemsTable = By.id("itemsTable");
    By taxRate = By.id("taxRate");
    By discountPercent = By.id("discountPercent");
    By subtotalDisplay = By.id("subtotal");
    By totalDisplay = By.id("totalAmount");
    
    // Bill list
    By billList = By.id("billList");

    public void goToBillingPage() {
        wait.until(ExpectedConditions.elementToBeClickable(billingLink)).click();
    }
    
    public void enterPatientDetails(String name) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(patientName));
        driver.findElement(patientName).clear();
        driver.findElement(patientName).sendKeys(name);
    }
    
    public void selectDoctor(String doctorInfo) {
        driver.findElement(doctorSelect).sendKeys(doctorInfo);
    }
    
    public void addServiceItem() {
        driver.findElement(addItemBtn).click();
    }

    public void generateBill(String patientName, String doctor) {
        enterPatientDetails(patientName);
        selectDoctor(doctor);
        wait.until(ExpectedConditions.elementToBeClickable(generateBtn)).click();
    }
    
    public void generateBill() {
        // Quick bill generation with defaults
        wait.until(ExpectedConditions.visibilityOfElementLocated(patientName));
        driver.findElement(patientName).sendKeys("Test Patient");
        driver.findElement(doctorSelect).sendKeys("Dr. Sharma");
        driver.findElement(generateBtn).click();
    }

    public boolean isBillGenerated() {
        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(billMsg));
            String msg = driver.findElement(billMsg).getText().toLowerCase();
            return msg.contains("invoice generated") || msg.contains("bill generated") || msg.contains("success");
        } catch (Exception e) {
            return false;
        }
    }
    
    public boolean isOnBillingPage() {
        try {
            return driver.findElement(By.xpath("//h1[contains(text(),'Billing')]")).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    public int getBillCount() {
        try {
            return driver.findElements(By.cssSelector("#billList li")).size();
        } catch (Exception e) {
            return 0;
        }
    }
    
    public String getTotalAmount() {
        try {
            return driver.findElement(totalDisplay).getText();
        } catch (Exception e) {
            return "";
        }
    }
    
    public boolean isConsultationFeeAutoAdded() {
        try {
            return driver.findElement(itemsTable).getText().contains("Consultation Fee");
        } catch (Exception e) {
            return false;
        }
    }
}