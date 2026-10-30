document.addEventListener("DOMContentLoaded", function () {
    const form = document.getElementById("postJobForm");
    const message = document.getElementById("jobMessage");

    if (!form || !message) {
        console.error("Job form nahi mila. post-job.html check karo.");
        return;
    }

    // Aaj se pehle ki deadline select nahi kar sakte
    const deadlineInput = document.getElementById("jobDeadline");
    const today = new Date();
    const localToday = [
        today.getFullYear(),
        String(today.getMonth() + 1).padStart(2, "0"),
        String(today.getDate()).padStart(2, "0")
    ].join("-");

    deadlineInput.min = localToday;

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        // Check recruiter login
        const recruiterEmail =
            sessionStorage.getItem("internxRecruiterEmail");

        const company =
            sessionStorage.getItem("internxRecruiterCompany");

        if (!recruiterEmail || !company) {
    message.style.color = "crimson";

    message.innerHTML = `
        Please login with your recruiter account before posting a job.
        <br>
        <a href="recruiter-login.html?redirect=post-job.html">
            Login as Recruiter
        </a>
    `;

    return;
}

        const enteredCompany =
            document.getElementById("companyName").value.trim();

        // Recruiter apni registered company ke naam se post karega
        if (enteredCompany.toLowerCase() !== company.toLowerCase()) {
            message.style.color = "crimson";
            message.textContent =
                "Company name must match your recruiter account.";
            return;
        }

        const deadline = deadlineInput.value;

        if (deadline < localToday) {
            message.style.color = "crimson";
            message.textContent =
                "Application deadline cannot be in the past.";
            return;
        }

        const job = {
            id: "job_" + Date.now(),
            company: company,
            title: document.getElementById("jobTitle").value.trim(),
            location: document.getElementById("jobLocation").value.trim(),
            type: document.getElementById("jobType").value,
            salary: document.getElementById("jobSalary").value.trim(),
            experience: document.getElementById("jobExperience").value,
            qualification: document.getElementById("jobQualification").value.trim(),
            skills: document.getElementById("jobSkills").value.trim(),
            description: document.getElementById("jobDescription").value.trim(),
            recruiterEmail: recruiterEmail,
            deadline: deadline,
            postedOn: localToday
        };

        const postedJobs = JSON.parse(
            localStorage.getItem("internxPostedJobs") || "[]"
        );

        postedJobs.push(job);

        localStorage.setItem(
            "internxPostedJobs",
            JSON.stringify(postedJobs)
        );

        message.style.color = "green";
        message.textContent =
            "Job posted successfully! It has been saved.";

        form.reset();

        // Deadline minimum ko reset ke baad bhi maintain karo
        deadlineInput.min = localToday;
    });
});