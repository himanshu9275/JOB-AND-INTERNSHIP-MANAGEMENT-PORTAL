
document.addEventListener("DOMContentLoaded", function () {
    const welcomeName = document.getElementById("welcomeName");
    const welcomeEmail = document.getElementById("welcomeEmail");
    const loginLink = document.getElementById("loginLink");

    const totalApplications = document.getElementById("totalApplications");
    const underReviewCount = document.getElementById("underReviewCount");
    const selectedCount = document.getElementById("selectedCount");
    const rejectedCount = document.getElementById("rejectedCount");

    
    const loggedInEmail = (
        sessionStorage.getItem("internxLoggedInEmail") || ""
    ).toLowerCase();

    const loggedInName = sessionStorage.getItem("internxLoggedInName");

   
    if (loggedInEmail) {

        welcomeName.textContent = loggedInName
            ? "Welcome, " + loggedInName + "!"
            : "Welcome to InternX!";

        welcomeEmail.textContent = loggedInEmail;

        loginLink.textContent = "Logout";
        loginLink.href = "#";

        loginLink.addEventListener("click", function (event) {
            event.preventDefault();

            sessionStorage.removeItem("internxLoggedInEmail");
            sessionStorage.removeItem("internXLoggedInName");
            sessionStorage.removeItem("internxLoggedInName");

            window.location.href = "login.html";
        });

    } else {

        welcomeName.textContent = "Student Dashboard";
        welcomeEmail.textContent =
            "Keep track of your applications and explore new career opportunities.";

        loginLink.textContent = "Login";
        loginLink.href = "login.html";
    }

    let applications = [];

    try {
        applications = JSON.parse(
            localStorage.getItem("internxApplications")
        ) || [];

        if (!Array.isArray(applications)) {
            applications = [];
        }

    } catch (error) {
        console.error("Unable to load applications:", error);
        applications = [];
    }

    const lastApplicantEmail = (
        sessionStorage.getItem("internxLastApplicantEmail") || ""
    ).toLowerCase();

    const currentEmail = loggedInEmail || lastApplicantEmail;

    let myApplications;

    if (currentEmail) {
        myApplications = applications.filter(function (app) {
            const email = String(
                app.userEmail || app.email || ""
            ).toLowerCase();

            return email === currentEmail;
        });
    } else {
        myApplications = applications;
    }

    let underReview = 0;
    let selected = 0;
    let rejected = 0;

    myApplications.forEach(function (app) {

        const status = String(
            app.status || "Under Review"
        ).trim().toLowerCase();

        if (
            status === "under review" ||
            status === "pending"
        ) {
            underReview++;
        } else if (status === "selected") {
            selected++;
        } else if (status === "rejected") {
            rejected++;
        }

    });

    totalApplications.textContent = myApplications.length;
    underReviewCount.textContent = underReview;
    selectedCount.textContent = selected;
    rejectedCount.textContent = rejected;

});
