document.addEventListener("DOMContentLoaded", function () {
    const searchInput = document.getElementById("internshipSearch");
    const locationFilter = document.getElementById("locationFilter");
    const clearButton = document.getElementById("clearFilters");
    const internshipCards = document.querySelectorAll(
        "#internshipGrid .job-card"
    );
    const resultsCount = document.getElementById("resultsCount");
    const noResults = document.getElementById("noResults");

    function filterInternships() {
        const searchText = searchInput.value.toLowerCase().trim();
        const selectedLocation = locationFilter.value.toLowerCase();
        let visibleInternships = 0;

        internshipCards.forEach(function (card) {
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
                visibleInternships++;
            } else {
                card.style.display = "none";
            }
        });

        resultsCount.textContent =
            "Showing " + visibleInternships +
            (visibleInternships === 1 ? " internship" : " internships");

        noResults.hidden = visibleInternships !== 0;
    }

    searchInput.addEventListener("input", filterInternships);
    locationFilter.addEventListener("change", filterInternships);

    clearButton.addEventListener("click", function () {
        searchInput.value = "";
        locationFilter.value = "";
        filterInternships();
        searchInput.focus();
    });

    filterInternships();
});