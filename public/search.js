document.addEventListener("DOMContentLoaded", () => {
    const searchBox = document.getElementById("searchBox");
    const suggestionsList = document.getElementById("suggestionsList");
  
    if (!searchBox || !suggestionsList) return;
  
    searchBox.addEventListener("input", async () => {
      const query = searchBox.value.trim();
  
      if (query.length === 0) {
        suggestionsList.innerHTML = "";
        suggestionsList.style.display = "none";
        return;
      }
  
      try {
        const response = await fetch(`/api/search-suggestions?q=${query}`);
        const suggestions = await response.json();
  
        if (suggestions.length === 0) {
          suggestionsList.innerHTML = "<li>No matches found</li>";
        } else {
          suggestionsList.innerHTML = suggestions.map(book => `
            <li>
              <a href="/bookdetails/${book._id}">
                ${book.title} - ${book.author}
              </a>
            </li>
          `).join("");
        }
  
        suggestionsList.style.display = "block";
      } catch (error) {
        console.error("Error fetching suggestions:", error);
        suggestionsList.innerHTML = "<li>Error fetching suggestions</li>";
        suggestionsList.style.display = "block";
      }
    });
  
    // Optional: hide suggestions when clicking outside
    document.addEventListener("click", (e) => {
      if (!searchBox.contains(e.target) && !suggestionsList.contains(e.target)) {
        suggestionsList.style.display = "none";
      }
    });
  });
  