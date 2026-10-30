const applicationList = document.getElementById("applicationList");

let applications = [];

try {
    applications = JSON.parse(
        localStorage.getItem("internxApplications")
    ) || [];
} catch (error) {
    applications = [];
}

if (!Array.isArray(applications)) {
    applications = [];
}

// Identify the current user's applications
const loggedInEmail = (
    sessionStorage.getItem("internxLoggedInEmail") || ""
).toLowerCase();

const lastApplicantEmail = (
    sessionStorage.getItem("internxLastApplicantEmail") || ""
).toLowerCase();

const currentEmail =
    loggedInEmail ||
    lastApplicantEmail ||
    (applications.length
        ? String(applications[applications.length - 1].email || "").toLowerCase()
        : "");

const myApplications = applications.filter(app => {
    const appEmail = String(app.userEmail || app.email || "").toLowerCase();

    return currentEmail && appEmail === currentEmail;
});

applicationList.innerHTML = "";

function createElement(tag, className, text) {
    const element = document.createElement(tag);

    if (className) {
        element.className = className;
    }

    if (text !== undefined) {
        element.textContent = text;
    }

    return element;
}

if (myApplications.length === 0) {
    const emptyMessage = createElement(
        "div",
        "application-item",
        ""
    );

    const details = createElement("div", "application-details");

    details.appendChild(
        createElement("h2", "", "No applications found")
    );

    details.appendChild(
        createElement(
            "p",
            "",
            "Apply for a job or internship to see your application here."
        )
    );

    const applyLink = createElement("a", "primary-btn", "Explore Internships");
    applyLink.href = "internships.html";

    details.appendChild(applyLink);
    emptyMessage.appendChild(details);
    applicationList.appendChild(emptyMessage);

} else {
    myApplications.slice().reverse().forEach(app => {
        const card = createElement("div", "application-item");
        const details = createElement("div", "application-details");

        const opportunity = String(app.opportunity || "Opportunity");
        const isInternship = /intern/i.test(opportunity);

        const type = createElement(
            "span",
            "application-type",
            isInternship ? "Internship" : "Job"
        );

        details.appendChild(type);
        details.appendChild(createElement("h2", "", opportunity));
        details.appendChild(
            createElement("p", "", "Applicant: " + (app.name || "Not provided"))
        );
        details.appendChild(
            createElement("p", "", "Email: " + (app.email || "Not provided"))
        );
        details.appendChild(
            createElement(
                "p",
                "application-date",
                "Applied on: " + (app.appliedOn || "Date unavailable")
            )
        );

        if (app.resumeName) {
            details.appendChild(
                createElement("p", "", "Resume: " + app.resumeName)
            );
        }

        const statusText = app.status || "Under Review";
        let statusClass = "status-review";

        if (statusText.toLowerCase() === "selected") {
            statusClass = "status-selected";
        } else if (statusText.toLowerCase() === "rejected") {
            statusClass = "status-rejected";
        } else if (statusText.toLowerCase() === "pending") {
            statusClass = "status-pending";
        }

        const status = createElement("span", "status " + statusClass, statusText);

        card.appendChild(details);
        card.appendChild(status);
        applicationList.appendChild(card);
    });
}
