package com.hospital.pages;

import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.openqa.selenium.support.ui.ExpectedConditions;
import java.time.Duration;

public class DoctorsPage {

    WebDriver driver;
    WebDriverWait wait;

    public DoctorsPage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(10));
    }

    // Locators
    By doctorsLink = By.xpath("//a[contains(text(),'Doctors')]");
    By searchBox = By.id("doctorSearch");
    By sortSelect = By.id("doctorSort");
    By doctorList = By.id("doctorList");
    By pageHeader = By.xpath("//h1[contains(text(),'Clinical')]");
    
    // Doctor card elements
    By doctorCards = By.cssSelector(".doctor-card");
    By doctorName = By.cssSelector(".doctor-card h3");
    By doctorSpecialization = By.cssSelector(".doctor-card .specialization");
    By doctorFee = By.cssSelector(".doctor-card .fee");

    public void goToDoctorsPage() {
        wait.until(ExpectedConditions.elementToBeClickable(doctorsLink)).click();
    }
    
    public void searchDoctor(String query) {
        wait.until(ExpectedConditions.visibilityOfElementLocated(searchBox));
        driver.findElement(searchBox).clear();
        driver.findElement(searchBox).sendKeys(query);
    }
    
    public void sortBy(String criteria) {
        driver.findElement(sortSelect).sendKeys(criteria);
    }

    public boolean isOnDoctorsPage() {
        try {
            return driver.findElement(pageHeader).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    public int getDoctorCount() {
        try {
            return driver.findElements(doctorCards).size();
        } catch (Exception e) {
            return 0;
        }
    }
    
    public boolean isDoctorDisplayed(String name) {
        try {
            return driver.findElement(doctorList).getText().contains(name);
        } catch (Exception e) {
            return false;
        }
    }
    
    public String getFirstDoctorName() {
        try {
            return driver.findElements(doctorName).get(0).getText();
        } catch (Exception e) {
            return "";
        }
    }
    
    public boolean isDoctorFeeDisplayed() {
        try {
            return driver.findElement(doctorFee).isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }
    
    public void clearSearch() {
        driver.findElement(searchBox).clear();
    }
}
