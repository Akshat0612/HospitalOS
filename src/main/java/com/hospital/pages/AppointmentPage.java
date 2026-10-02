package com.hospital.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import java.time.Duration;

public class AppointmentPage {

    WebDriver driver;
    WebDriverWait wait;

    public AppointmentPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    // Locators
    By doctorSelect = By.id("doctor");
    By dateField = By.id("date");
    By timeField = By.id("time");
    By bookBtn = By.xpath("//button[contains(text(),'Book Appointment')]");
    By successMsg = By.id("apptMsg");
    By apptList = By.id("apptList");
    By consultationFeeDisplay = By.id("consultationFeeDisplay");
    
    // Form elements
    By pageHeader = By.xpath("//h1[contains(text(),'Schedule')]");

    public void selectDoctor(String doctorName) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(doctorSelect));
        driver.findElement(doctorSelect).sendKeys(doctorName);
    }
    
    public void selectDate(String date) {
        driver.findElement(dateField).sendKeys(date);
    }
    
    public void selectTime(String time) {
        driver.findElement(timeField).sendKeys(time);
    }

    public void bookAppointment(String doctor, String date, String time) {
        selectDoctor(doctor);
        selectDate(date);
        selectTime(time);
        driver.findElement(bookBtn).click();
    }
    
    public void bookAppointment() {
        // Default appointment
        wait.until(ExpectedConditions.visibilityOfElementLocated(doctorSelect));
        driver.findElement(doctorSelect).sendKeys("Dr. Sharma");
        driver.findElement(dateField).sendKeys("2026-12-31");
        driver.findElement(timeField).sendKeys("10:00");
        driver.findElement(bookBtn).click();
    }

    public boolean isAppointmentCreated() {
        try {
            // Wait for success message (before redirect happens)
            wait.until(ExpectedConditions.visibilityOfElementLocated(successMsg));
            String msg = driver.findElement(successMsg).getText().toLowerCase();
            boolean success = msg.contains("appointment created") || msg.contains("redirecting to payment");
            if (success) {
                // Wait for redirect to complete
                Thread.sleep(2000);
            }
            return success;
        } catch (Exception e) {
            // Check if we were redirected to billing page (also success)
            try {
                String currentUrl = driver.getCurrentUrl();
                return currentUrl.contains("billing.html");
            } catch (Exception ex) {
                return false;
            }
        }
    }
    
    public boolean isConsultationFeeDisplayed() {
        try {
            return driver.findElement(consultationFeeDisplay).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    public String getConsultationFee() {
        try {
            return driver.findElement(By.id("feeAmount")).getText();
        } catch (Exception e) {
            return "";
        }
    }
    
    public boolean isAppointmentInList(String doctorName) {
        try {
            return driver.findElement(apptList).getText().contains(doctorName);
        } catch (Exception e) {
            return false;
        }
    }
    
    public int getAppointmentCount() {
        try {
            return driver.findElements(By.cssSelector("#apptList li")).size();
        } catch (Exception e) {
            return 0;
        }
    }
    
    public boolean isOnAppointmentPage() {
        try {
            return driver.findElement(pageHeader).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    // Backward compatibility methods
    public void goToAppointmentPage() {
        By appointmentLink = By.xpath("//a[contains(text(),'Appointments')]");
        wait.until(ExpectedConditions.elementToBeClickable(appointmentLink)).click();
    }
    
    public boolean isAppointmentBooked() {
        return isAppointmentCreated();
    }
}