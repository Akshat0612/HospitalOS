package com.hospital.tests;

import org.testng.Assert;
import org.testng.annotations.Test;

import com.hospital.base.BaseTest;
import com.hospital.pages.LoginPage;
import com.hospital.pages.DashboardPage;

public class LoginTest extends BaseTest {

    @Test(priority = 1, description = "Valid login with correct credentials")
    public void testValidLogin() {
        injectValidUser();
        driver.navigate().refresh();
        sleep(1000);

        LoginPage login = new LoginPage(driver);
        login.login(VALID_EMAIL, VALID_PASSWORD);

        DashboardPage dashboard = new DashboardPage(driver);
        boolean success = dashboard.isLoginSuccessful();
        Assert.assertTrue(success, "Login should be successful");
    }

    @Test(priority = 2, description = "Invalid login shows error message")
    public void testInvalidLogin() {
        clearSession();
        driver.navigate().refresh();
        sleep(1000);
        
        LoginPage login = new LoginPage(driver);
        login.login("wrong@email.com", "wrongpassword");

        boolean errorShown = login.isErrorDisplayed();
        Assert.assertTrue(errorShown, "Error should be displayed for invalid credentials");
    }
    
    @Test(priority = 3, description = "Empty credentials shows validation")
    public void testEmptyCredentials() {
        clearSession();
        driver.navigate().refresh();
        sleep(1000);
        
        LoginPage login = new LoginPage(driver);
        login.login("", "");
        
        boolean onLoginPage = login.isOnLoginPage();
        Assert.assertTrue(onLoginPage, "Should remain on login page with empty credentials");
    }
    
}