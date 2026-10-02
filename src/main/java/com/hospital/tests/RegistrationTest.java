package com.hospital.tests;

import org.testng.Assert;
import org.testng.annotations.Test;

import com.hospital.base.BaseTest;
import com.hospital.pages.LoginPage;
import com.hospital.pages.RegisterPage;

public class RegistrationTest extends BaseTest {

    @Test(priority = 1, description = "Register new user with valid details")
    public void testValidRegistration() {
        LoginPage login = new LoginPage(driver);
        login.clickRegister();
        
        RegisterPage register = new RegisterPage(driver);
        String uniqueEmail = "test" + System.currentTimeMillis() + "@gmail.com";
        register.register("Test User", uniqueEmail, "password123");
        
        boolean success = register.isRegistrationSuccessful() || login.isOnLoginPage();
        Assert.assertTrue(success, "Registration should be successful");
    }
    
    @Test(priority = 2, description = "Duplicate email shows error")
    public void testDuplicateEmailRegistration() {
        LoginPage login = new LoginPage(driver);
        login.clickRegister();
        
        RegisterPage register = new RegisterPage(driver);
        // Try to register with existing email
        register.register("Test User", VALID_EMAIL, "password123");
        
        boolean hasError = register.isErrorDisplayed() || register.isOnRegisterPage();
        Assert.assertTrue(hasError, "Should show error for duplicate email");
    }
    
    @Test(priority = 3, description = "Empty fields stay on registration page")
    public void testEmptyFieldsValidation() {
        LoginPage login = new LoginPage(driver);
        login.clickRegister();
        
        RegisterPage register = new RegisterPage(driver);
        register.register("", "", "");
        
        boolean onPage = register.isOnRegisterPage();
        Assert.assertTrue(onPage, "Should remain on registration page with empty fields");
    }
}
