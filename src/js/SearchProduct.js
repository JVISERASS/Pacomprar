document.addEventListener("DOMContentLoaded", function () {
    const params = new URLSearchParams(window.location.search);
    const query = params.get("q")?.toLowerCase() || "";

    const items = document.querySelectorAll(".item");
    items.forEach(item => {
        const title = item.querySelector("h1").textContent.toLowerCase();
        const description = item.querySelector(".SmallDescription").textContent.toLowerCase();

        if (title.includes(query) || description.includes(query)) {
            item.style.display = "block";
        } else {
            item.style.display = "none";
        }
    });
});