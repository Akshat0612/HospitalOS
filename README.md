# Hospital OS

A full-stack hospital management platform built with Node.js, Express, and MongoDB — covering patient appointments, billing, doctor directories, and a rule-based symptom-triage system. Paired with a complete Selenium WebDriver + TestNG automation framework for end-to-end regression testing.

---

## Overview

Hospital OS streamlines core hospital operations through a secure RESTful backend and a lightweight frontend client. The project reflects a full development lifecycle: a working application, backed by a dedicated QA automation suite that validates it end-to-end.

---

## Features

### Authentication & Security
- JWT-based authentication
- Password hashing with bcrypt
- Security headers via Helmet
- Request validation via express-validator
- Role-based access control (staff-only routes)

### Core Modules
- **Appointments** — booking and management
- **Billing** — fee tracking with PDF invoice generation (pdfkit)
- **Doctors** — directory with specialization-based listings
- **Symptom Triage** — rule-based recommendation engine matching patient symptoms to relevant specialists across 30+ specializations, with emergency-keyword detection
- **Analytics** — operational data insights

> **Disclaimer:** The symptom-triage feature provides rule-based guidance only, based on keyword matching — it is not a machine learning model and is not a substitute for professional medical diagnosis.

---

## Tech Stack

**Backend:** Node.js, Express.js, MongoDB, Mongoose
**Frontend:** HTML, CSS, JavaScript (consumes REST API via `fetch`)
**Security:** JWT, bcryptjs, Helmet, express-validator
**Other:** pdfkit (PDF generation), dotenv, morgan (logging)

**Automation:** Java, Selenium WebDriver, TestNG, Maven, WebDriverManager

---

## Test Automation

A dedicated Selenium WebDriver + TestNG framework validates the application end-to-end, built on the **Page Object Model** for maintainability.

- **17 automated test cases** across Login, Registration, Dashboard, Appointments, Doctors, Billing, and Triage modules
- **WebDriverManager** for automatic browser-driver handling
- Structured **HTML/XML test reports** generated via TestNG
- Regression runs have surfaced real defects in billing and authentication flows — validating the suite's effectiveness at catching functional issues, not just confirming happy paths

---

## Project Structure

```
Hospital-OS/
│
├── backend/                           # Node.js + Express REST API
│   ├── config/
│   │   └── db.js                      # MongoDB connection setup
│   ├── controllers/
│   │   ├── analyticsController.js
│   │   ├── appointmentController.js
│   │   ├── authController.js
│   │   ├── billingController.js
│   │   ├── doctorController.js
│   │   └── triageController.js        # Rule-based symptom-triage logic
│   ├── middleware/
│   │   ├── authMiddleware.js          # JWT verification
│   │   ├── errorHandler.js
│   │   ├── staffOnly.js               # Role-based access control
│   │   └── validateRequest.js
│   ├── models/
│   │   ├── Appointment.js
│   │   ├── Billing.js
│   │   ├── TriageCase.js
│   │   └── User.js
│   ├── routes/
│   │   ├── analyticsRoutes.js
│   │   ├── appointmentRoutes.js
│   │   ├── authRoutes.js
│   │   ├── billingRoutes.js
│   │   ├── doctorRoutes.js
│   │   └── triageRoutes.js
│   ├── utils/
│   │   └── apiResponse.js             # Standardized API response format
│   ├── validators/
│   │   ├── appointmentValidators.js
│   │   ├── authValidators.js
│   │   ├── billingValidators.js
│   │   └── triageValidators.js
│   ├── .env.example                   # Environment variable template
│   ├── package.json
│   └── server.js                      # App entry point
│
├── frontend/                          # Static HTML/CSS/JS client
│   ├── index.html                     # Login page
│   ├── register.html
│   ├── dashboard.html
│   ├── appointment.html
│   ├── billing.html
│   ├── doctors.html
│   ├── staff.html
│   ├── ai.html                        # Symptom-triage interface
│   ├── script.js
│   └── style.css
│
├── src/main/java/com/hospital/        # Selenium + TestNG automation suite
│   ├── base/
│   │   └── BaseTest.java              # Shared setup/teardown, session helpers
│   ├── pages/                         # Page Object Model classes
│   │   ├── LoginPage.java
│   │   ├── RegisterPage.java
│   │   ├── DashboardPage.java
│   │   ├── AppointmentPage.java
│   │   ├── BillingPage.java
│   │   ├── DoctorsPage.java
│   │   └── AIPage.java
│   └── tests/                         # TestNG test classes
│       ├── LoginTest.java
│       ├── RegistrationTest.java
│       ├── DashboardTest.java
│       ├── AppointmentTest.java
│       ├── BillingTest.java
│       ├── DoctorsTest.java
│       └── AITest.java
│
├── .gitignore
├── pom.xml                            # Maven dependencies (Selenium, TestNG, WebDriverManager)
└── testng.xml                         # TestNG suite configuration
```

---

## Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB (local instance or MongoDB Atlas)
- Java JDK (v11+) and Maven — for running the automation suite
- Google Chrome — for Selenium tests

### Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` folder using `.env.example` as a reference:

```
PORT=3000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
```

Start the server:

```bash
npm start
```

The frontend is served automatically at `http://localhost:3000`.

### Running the Automation Suite

```bash
mvn test
```

Test reports are generated in the `test-output/` directory after each run.

---

## License

This project is for educational purposes.

## Author

**Akshat Goyal**
[GitHub](https://github.com/Akshat0612) • [LinkedIn](https://www.linkedin.com/in/akshatgoyal06)
