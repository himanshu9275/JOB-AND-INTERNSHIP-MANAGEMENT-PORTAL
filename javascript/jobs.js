document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("jobSearch");
    const locationFilter = document.getElementById("locationFilter");
    const clearButton = document.getElementById("clearFilters");
    const jobGrid = document.getElementById("jobGrid");
    const resultsCount = document.getElementById("resultsCount");
    const noResults = document.getElementById("noResults");

    // Display jobs posted by recruiters
    function loadPostedJobs() {
        const postedJobs = JSON.parse(
            localStorage.getItem("internxPostedJobs") || "[]"
        );

        postedJobs.forEach(function (job) {
            // Avoid adding the same job more than once
            if (document.getElementById(job.id)) return;

            const card = document.createElement("div");
            card.className = "job-card";
            card.id = job.id;
            card.dataset.location = job.location || "";

            card.innerHTML = `
                <h3>${escapeHTML(job.title)}</h3>
                <p><strong>Company:</strong> ${escapeHTML(job.company)}</p>
                <p><strong>Location:</strong> ${escapeHTML(job.location)}</p>
                <p><strong>Job Type:</strong> ${escapeHTML(job.type)}</p>
                <p><strong>Salary:</strong> ${escapeHTML(job.salary || "Not specified")}</p>
                <p><strong>Experience:</strong> ${escapeHTML(job.experience)}</p>
                <p><strong>Qualification:</strong> ${escapeHTML(job.qualification)}</p>
                <p><strong>Skills:</strong> ${escapeHTML(job.skills)}</p>
                <p>${escapeHTML(job.description)}</p>
                <p><strong>Application Deadline:</strong> ${escapeHTML(job.deadline)}</p>
                <a href="apply.html?postedJobId=${encodeURIComponent(job.id)}"
                   class="apply-btn">Apply Now</a>
            `;

            jobGrid.appendChild(card);
        });
    }

    // Safely display text entered by recruiters
    function escapeHTML(value) {
        return String(value || "").replace(/[&<>"']/g, function (character) {
            return {
                "&": "&amp;",
                "<": "&lt;",
                ">": "&gt;",
                '"': "&quot;",
                "'": "&#39;"
            }[character];
        });
    }

    function filterJobs() {
        const searchText = searchInput.value.toLowerCase().trim();
        const selectedLocation = locationFilter.value.toLowerCase();
        const jobCards = jobGrid.querySelectorAll(".job-card");

        let visibleJobs = 0;

        jobCards.forEach(function (card) {
            const cardText = card.textContent.toLowerCase();
            const cardLocation = (
                card.dataset.location || ""
            ).toLowerCase();

            const matchesSearch = cardText.includes(searchText);
            const matchesLocation =
                selectedLocation === "" ||
                cardLocation === selectedLocation;

            if (matchesSearch && matchesLocation) {
                card.style.display = "";
                visibleJobs++;
            } else {
                card.style.display = "none";
            }
        });

        resultsCount.textContent =
            "Showing " + visibleJobs +
            (visibleJobs === 1 ? " job" : " jobs");

        noResults.hidden = visibleJobs !== 0;
    }

    loadPostedJobs();

    searchInput.addEventListener("input", filterJobs);
    locationFilter.addEventListener("change", filterJobs);

    clearButton.addEventListener("click", function () {
        searchInput.value = "";
        locationFilter.value = "";
        filterJobs();
        searchInput.focus();
    });

    filterJobs();
});