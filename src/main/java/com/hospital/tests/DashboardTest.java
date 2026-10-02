package com.hospital.tests;

import org.testng.Assert;
import org.testng.annotations.Test;

import com.hospital.base.BaseTest;
import com.hospital.pages.LoginPage;
import com.hospital.pages.DashboardPage;

public class DashboardTest extends BaseTest {

    @Test(priority = 1, description = "Dashboard navigation to all main pages")
    public void testDashboardNavigation() {
        injectValidUser();
        driver.navigate().refresh();
        sleep(1000);

        LoginPage login = new LoginPage(driver);
        login.login(VALID_EMAIL, VALID_PASSWORD);

        DashboardPage dashboard = new DashboardPage(driver);
        Assert.assertTrue(dashboard.isLoginSuccessful(), "Login should succeed");

        // Navigate to Appointments and verify
        dashboard.navigateToAppointments();
        String url1 = driver.getCurrentUrl();
        Assert.assertTrue(url1.contains("appointment.html"), "Should navigate to appointments page");

        // Navigate to Doctors and verify
        dashboard.navigateToDoctors();
        String url2 = driver.getCurrentUrl();
        Assert.assertTrue(url2.contains("doctors.html"), "Should navigate to doctors page");

        // Navigate to Billing and verify
        dashboard.navigateToBilling();
        String url3 = driver.getCurrentUrl();
        Assert.assertTrue(url3.contains("billing.html"), "Should navigate to billing page");

        // Navigate back to Dashboard and verify
        driver.findElement(org.openqa.selenium.By.xpath("//a[@href='dashboard.html']")).click();
        sleep(1500);
        Assert.assertTrue(dashboard.isDashboardDisplayed(), "Should return to dashboard");
    }
}
