package com.hospital.tests;

import org.testng.Assert;
import org.testng.annotations.Test;

import com.hospital.base.BaseTest;
import com.hospital.pages.LoginPage;
import com.hospital.pages.DashboardPage;
import com.hospital.pages.AIPage;

public class AITest extends BaseTest {

    @Test(priority = 1, description = "AI analysis with fever and headache symptoms")
    public void testAIAnalysisWithSymptoms() {
        injectValidUser();
        driver.navigate().refresh();
        sleep(1000);

        LoginPage login = new LoginPage(driver);
        login.login(VALID_EMAIL, VALID_PASSWORD);

        DashboardPage dashboard = new DashboardPage(driver);
        Assert.assertTrue(dashboard.isLoginSuccessful(), "Login should succeed");

        AIPage ai = new AIPage(driver);
        ai.goToAIPage();
        ai.runAnalysis("I have fever and headache for 3 days", "Medium");

        boolean resultShown = ai.isResultDisplayed();
        Assert.assertTrue(resultShown, "AI analysis result should be displayed");
    }
    
    @Test(priority = 2, description = "Doctor recommendations displayed for chest pain")
    public void testDoctorRecommendations() {
        injectValidUser();
        driver.navigate().refresh();
        sleep(1000);
        
        LoginPage login = new LoginPage(driver);
        login.login(VALID_EMAIL, VALID_PASSWORD);
        
        DashboardPage dashboard = new DashboardPage(driver);
        Assert.assertTrue(dashboard.isLoginSuccessful(), "Login should succeed");
        
        AIPage ai = new AIPage(driver);
        ai.goToAIPage();
        ai.runAnalysis("chest pain and breathing difficulty", "High");
        
        boolean docsShown = ai.areDoctorRecommendationsDisplayed();
        Assert.assertTrue(docsShown, "Doctor recommendations should be displayed");
    }
    
    @Test(priority = 3, description = "General Physician recommended for general symptoms")
    public void testGeneralPhysicianRecommendation() {
        injectValidUser();
        driver.navigate().refresh();
        sleep(1000);
        
        LoginPage login = new LoginPage(driver);
        login.login(VALID_EMAIL, VALID_PASSWORD);
        
        AIPage ai = new AIPage(driver);
        ai.goToAIPage();
        ai.runAnalysis("general fever and body weakness", "Medium");
        
        Assert.assertTrue(ai.isResultDisplayed(), "Result should show");
        String dept = ai.getSuggestedDepartment();
        boolean hasGeneral = dept.contains("General") || dept.contains("Physician");
        Assert.assertTrue(hasGeneral, "Should recommend General Physician");
    }
    
    @Test(priority = 4, description = "Navigate to AI triage from dashboard")
    public void testNavigateToAI() {
        injectValidUser();
        driver.navigate().refresh();
        sleep(1000);
        
        LoginPage login = new LoginPage(driver);
        login.login(VALID_EMAIL, VALID_PASSWORD);
        
        DashboardPage dashboard = new DashboardPage(driver);
        dashboard.navigateToAI();
        
        AIPage ai = new AIPage(driver);
        boolean onPage = ai.isOnAIPage();
        Assert.assertTrue(onPage, "Should be on AI triage page");
    }
}