package com.hospital.tests;

import org.testng.Assert;
import org.testng.annotations.Test;

import com.hospital.base.BaseTest;
import com.hospital.pages.LoginPage;
import com.hospital.pages.DashboardPage;
import com.hospital.pages.BillingPage;

public class BillingTest extends BaseTest {

    @Test(priority = 1, description = "Generate bill with consultation fee")
    public void testGenerateBill() {
        injectValidUser();
        driver.navigate().refresh();
        sleep(1000);

        LoginPage login = new LoginPage(driver);
        login.login(VALID_EMAIL, VALID_PASSWORD);

        DashboardPage dashboard = new DashboardPage(driver);
        Assert.assertTrue(dashboard.isLoginSuccessful(), "Login should succeed");

        BillingPage billing = new BillingPage(driver);
        billing.goToBillingPage();
        billing.generateBill("Test Patient", "Dr. Sharma");

        boolean generated = billing.isBillGenerated();
        Assert.assertTrue(generated, "Bill should be generated with consultation fee");
    }
}