$(document).ready(function () {
  async function fetchArticles() {
    try {
      const response = await fetch("/api/articles/");
      const articles = await response.json();
      return articles;
    } catch (error) {
      console.error("Error fetching articles:", error);
      return [];
    }
  }

  async function displayArticles() {
    const articles = await fetchArticles();
    const articleList = document.getElementById("articleList");
    articleList.innerHTML = "";

    articles.forEach((article) => {
      const articleItem = document.createElement("div");
      articleItem.classList.add("col-md-3", "card", "p-2", "m-2");
      articleItem.innerHTML = `
                    <img src="${article.cover}" class="card-img-top" alt="Article Cover">
                    <div class="card-body">
                        <h5 class="card-title">${article.title}</h5>
                        <p class="card-text">Author: ${article.author}</p>
                        <p class="card-text">Published: ${article.published}</p>
                        <a href="#" class="btn btn-primary w-100">Read More</a>
                    </div>
          `;
      articleList.appendChild(articleItem);
    });
  }

  function searchArticles() {
    const searchInput = document
      .getElementById("searchInput")
      .value.toLowerCase();
    const articleCards = document.querySelectorAll(".card");
    articleCards.forEach((card) => {
      const title = card.querySelector(".card-title").textContent.toLowerCase();
      if (title.includes(searchInput)) {
        card.style.display = "block";
      } else {
        card.style.display = "none";
      }
    });
  }

  $("#searchButton").on("click", searchArticles);
  displayArticles();
});
