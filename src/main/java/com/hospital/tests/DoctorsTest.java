package com.hospital.tests;

import org.testng.Assert;
import org.testng.annotations.Test;

import com.hospital.base.BaseTest;
import com.hospital.pages.LoginPage;
import com.hospital.pages.DashboardPage;
import com.hospital.pages.DoctorsPage;

public class DoctorsTest extends BaseTest {

    @Test(priority = 1, description = "Doctors list displayed with all doctors")
    public void testDoctorsListDisplayed() {
        injectValidUser();
        driver.navigate().refresh();
        sleep(1000);

        LoginPage login = new LoginPage(driver);
        login.login(VALID_EMAIL, VALID_PASSWORD);

        DashboardPage dashboard = new DashboardPage(driver);
        Assert.assertTrue(dashboard.isLoginSuccessful(), "Login should succeed");

        DoctorsPage doctors = new DoctorsPage(driver);
        doctors.goToDoctorsPage();

        boolean onPage = doctors.isOnDoctorsPage();
        boolean hasDoctors = doctors.getDoctorCount() > 0;
        Assert.assertTrue(onPage, "Should be on doctors page");
        Assert.assertTrue(hasDoctors, "Doctor list should contain doctors");
    }
    
    @Test(priority = 2, description = "Search doctor by name")
    public void testSearchDoctor() {
        injectValidUser();
        driver.navigate().refresh();
        sleep(1000);
        
        LoginPage login = new LoginPage(driver);
        login.login(VALID_EMAIL, VALID_PASSWORD);
        
        DoctorsPage doctors = new DoctorsPage(driver);
        doctors.goToDoctorsPage();
        doctors.searchDoctor("Sharma");
        
        boolean found = doctors.isDoctorDisplayed("Sharma");
        Assert.assertTrue(found, "Should find Dr. Sharma");
    }
    
    @Test(priority = 3, description = "Doctor fees displayed")
    public void testDoctorFeesDisplayed() {
        injectValidUser();
        driver.navigate().refresh();
        sleep(1000);
        
        LoginPage login = new LoginPage(driver);
        login.login(VALID_EMAIL, VALID_PASSWORD);
        
        DoctorsPage doctors = new DoctorsPage(driver);
        doctors.goToDoctorsPage();
        
        boolean feesShown = doctors.isDoctorFeeDisplayed();
        Assert.assertTrue(feesShown, "Doctor fees should be displayed");
    }
    
    @Test(priority = 4, description = "Navigate to doctors from dashboard")
    public void testNavigateToDoctors() {
        injectValidUser();
        driver.navigate().refresh();
        sleep(1000);
        
        LoginPage login = new LoginPage(driver);
        login.login(VALID_EMAIL, VALID_PASSWORD);
        
        DashboardPage dashboard = new DashboardPage(driver);
        dashboard.navigateToDoctors();
        
        DoctorsPage doctors = new DoctorsPage(driver);
        boolean onPage = doctors.isOnDoctorsPage();
        Assert.assertTrue(onPage, "Should be on doctors page");
    }
}
