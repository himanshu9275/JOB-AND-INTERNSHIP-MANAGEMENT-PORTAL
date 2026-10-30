const form = document.getElementById("applicationForm");
const message = document.getElementById("applicationMessage");

const nameInput = document.getElementById("applicantName");
const emailInput = document.getElementById("applicantEmail");
const phoneInput = document.getElementById("applicantPhone");
const qualificationInput = document.getElementById("qualification");
const opportunityInput = document.getElementById("opportunity");
const coverLetterInput = document.getElementById("coverLetter");
const resumeInput = document.getElementById("resume");

// Available jobs and internships
const opportunities = {
    tcs: "Software Developer - Tata Consultancy Services",
    infosys: "Web Developer - Infosys",
    wipro: "Frontend Developer - Wipro",
    accenture: "Junior Software Engineer - Accenture",
    ibm: "Associate Developer - IBM",
    hcltech: "System Engineer - HCLTech",

    webdevintern: "Web Development Intern - TechNova Solutions",
    cybersecurity: "Cyber Security Intern - SecureNet India",
    dataanalytics: "Data Analytics Intern - DataCore Pvt. Ltd.",
    javaintern: "Java Development Intern - CodeSphere Technologies",
    uiuxintern: "UI/UX Design Intern - Creative Labs",
    testingintern: "Software Testing Intern - Digital Works"
};

// Automatically select the chosen opportunity
const params = new URLSearchParams(window.location.search);
const selectedJob = params.get("job");

if (selectedJob && opportunities[selectedJob]) {
    const option = document.createElement("option");

    option.value = opportunities[selectedJob];
    option.textContent = opportunities[selectedJob];
    option.selected = true;

    opportunityInput.appendChild(option);
}

// Name: English alphabets and spaces only
nameInput.addEventListener("input", function () {
    this.value = this.value.replace(/[^A-Za-z ]/g, "");
});

// Phone: digits only, maximum 10
phoneInput.addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, "").slice(0, 10);
});

// Display success or error message
function showMessage(text, type) {
    message.textContent = text;
    message.style.color = type === "success" ? "green" : "red";
    message.style.margin = "15px 0";
}

// Submit application
form.addEventListener("submit", function (event) {
    event.preventDefault();

    const name = nameInput.value.trim().replace(/\s+/g, " ");
    const email = emailInput.value.trim().toLowerCase();
    const phone = phoneInput.value.trim();
    const qualification = qualificationInput.value.trim();
    const opportunity = opportunityInput.value;
    const coverLetter = coverLetterInput.value.trim();
    const resume = resumeInput.files[0];

    if (!/^[A-Za-z]+(?: [A-Za-z]+)*$/.test(name)) {
        showMessage("Name mein sirf English alphabets aur spaces allowed hain.", "error");
        nameInput.focus();
        return;
    }

    if (!emailInput.checkValidity()) {
        showMessage("Please enter a valid email address.", "error");
        emailInput.focus();
        return;
    }

    if (!/^[6-9]\d{9}$/.test(phone)) {
        showMessage("Please enter a valid 10-digit Indian mobile number.", "error");
        phoneInput.focus();
        return;
    }

    if (!qualification) {
        showMessage("Please enter your qualification.", "error");
        qualificationInput.focus();
        return;
    }

    if (!opportunity) {
        showMessage("Please select a job or internship.", "error");
        opportunityInput.focus();
        return;
    }

    if (!resume) {
        showMessage("Please upload your resume.", "error");
        resumeInput.focus();
        return;
    }

    if (!/\.(pdf|doc|docx)$/i.test(resume.name)) {
        showMessage("Resume must be a PDF, DOC or DOCX file.", "error");
        resumeInput.focus();
        return;
    }

    if (resume.size > 2 * 1024 * 1024) {
        showMessage("Resume size must not exceed 2 MB.", "error");
        resumeInput.focus();
        return;
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
        showMessage("Unable to read saved applications.", "error");
        return;
    }

    const application = {
        id: Date.now(),
        name: name,
        email: email,
        phone: phone,
        qualification: qualification,
        opportunity: opportunity,
        coverLetter: coverLetter,
        resumeName: resume.name,
        status: "Under Review",
        appliedOn: new Date().toLocaleDateString("en-IN"),
        userEmail: (
            sessionStorage.getItem("internxLoggedInEmail") || email
        ).toLowerCase()
    };

    applications.push(application);
    sessionStorage.setItem("internxLastApplicantEmail", email);

    try {
        localStorage.setItem(
            "internxApplications",
            JSON.stringify(applications)
        );
    } catch (error) {
        showMessage("Application could not be saved in browser storage.", "error");
        return;
    }

    showMessage("Application submitted successfully!", "success");

    form.reset();
});