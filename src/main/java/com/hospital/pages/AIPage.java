package com.hospital.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import java.time.Duration;

public class AIPage {

    WebDriver driver;
    WebDriverWait wait;

    public AIPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    // Locators
    By aiLink = By.xpath("//a[contains(text(),'AI')]");
    By symptomInput = By.id("description");
    By feverChip = By.xpath("//button[contains(text(),'Fever')]");
    By coughChip = By.xpath("//button[contains(text(),'Cough')]");
    By headacheChip = By.xpath("//button[contains(text(),'Headache')]");
    By severitySelect = By.id("severity");
    By analyzeBtn = By.xpath("//button[contains(text(),'Analyze')]");
    By resultBox = By.id("aiResultBox");
    By doctorRecommendations = By.id("doctorRecommendations");
    By suggestedDepartment = By.id("suggestedDepartment");
    By urgencyBadge = By.className("urgency-badge");
    By possibleConditions = By.id("possibleConditions");

    public void goToAIPage() {
        wait.until(ExpectedConditions.elementToBeClickable(aiLink)).click();
    }

    public void enterSymptoms(String symptoms) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(symptomInput));
        driver.findElement(symptomInput).clear();
        driver.findElement(symptomInput).sendKeys(symptoms);
    }
    
    public void selectSymptomChip(String symptom) {
        By chip = By.xpath("//button[contains(text(),'" + symptom + "')]");
        driver.findElement(chip).click();
    }
    
    public void selectSeverity(String level) {
        driver.findElement(severitySelect).sendKeys(level);
    }

    public void runAnalysis() {
        // Default analysis
        wait.until(ExpectedConditions.visibilityOfElementLocated(symptomInput));
        driver.findElement(symptomInput).sendKeys("I have fever and cough for 2 days");
        driver.findElement(feverChip).click();
        driver.findElement(coughChip).click();
        driver.findElement(severitySelect).sendKeys("Medium");
        driver.findElement(analyzeBtn).click();
    }
    
    public void runAnalysis(String symptoms, String severity) {
        enterSymptoms(symptoms);
        selectSeverity(severity);
        driver.findElement(analyzeBtn).click();
    }

    public boolean isResultDisplayed() {
        try {
            wait.until(ExpectedConditions.visibilityOfElementLocated(resultBox));
            return driver.findElement(resultBox).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    public boolean areDoctorRecommendationsDisplayed() {
        try {
            return driver.findElement(doctorRecommendations).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    public String getSuggestedDepartment() {
        try {
            return driver.findElement(suggestedDepartment).getText();
        } catch (Exception e) {
            return "";
        }
    }
    
    public String getUrgencyLevel() {
        try {
            return driver.findElement(urgencyBadge).getText();
        } catch (Exception e) {
            return "";
        }
    }
    
    public boolean isOnAIPage() {
        try {
            return driver.findElement(By.xpath("//h1[contains(text(),'AI Health')]")).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
}