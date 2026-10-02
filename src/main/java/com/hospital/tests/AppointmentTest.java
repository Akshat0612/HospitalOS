package com.hospital.tests;

import org.testng.Assert;
import org.testng.annotations.Test;

import com.hospital.base.BaseTest;
import com.hospital.pages.LoginPage;
import com.hospital.pages.DashboardPage;
import com.hospital.pages.AppointmentPage;

public class AppointmentTest extends BaseTest {

    @Test(priority = 1, description = "Consultation fee displayed for selected doctor")
    public void testConsultationFeeDisplay() {
        injectValidUser();
        driver.navigate().refresh();
        sleep(1000);
        
        LoginPage login = new LoginPage(driver);
        login.login(VALID_EMAIL, VALID_PASSWORD);
        
        AppointmentPage appt = new AppointmentPage(driver);
        appt.goToAppointmentPage();
        appt.selectDoctor("Dr. Sharma");
        
        boolean feeShown = appt.isConsultationFeeDisplayed();
        Assert.assertTrue(feeShown, "Consultation fee should be displayed");
    }
}