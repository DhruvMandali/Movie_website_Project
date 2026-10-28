
const favoritesContainer = document.getElementById("favoritesContainer");
const favoriteMessage = document.getElementById("favoriteMessage");

async function loadFavorites() {
  const token = sessionStorage.getItem("token");

  if (!token) {
    favoriteMessage.textContent = "Please login to see your favorite movies.";
    return;
  }

  favoritesContainer.innerHTML = "";
  favoriteMessage.textContent = "Loading favorites...";

  try {
    // Get logged-in user's favorite movies from backend
    const response = await fetch("/api/favorites", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to load favorites.");
    }

    const favorites = Array.isArray(data) ? data : data.favorites;

    if (!Array.isArray(favorites)) {
      throw new Error("Favorites data format is incorrect.");
    }

    if (favorites.length === 0) {
      favoriteMessage.textContent =
        "You have not added any favorite movies yet.";
      return;
    }

    favoriteMessage.textContent = "";

    // Create the same style of cards as the home page
    for (const favorite of favorites) {
      const movieId = favorite.movie_id;

      const card = document.createElement("div");
      card.classList.add("card");

      try {
        // Fetch movie details from TMDB
        const movie = await fetchAPIData(`movie/${movieId}`);

        card.innerHTML = `
          <a href="movie-details.html?${movie.id}">
            <img
              src="${
                movie.poster_path
                  ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
                  : ""
              }"
              class="card-img-top"
              alt="${movie.title || "Movie poster"}"
            />
          </a>

          <div class="card-body">
            <h5 class="card-title" style="color: white">
              ${movie.title || movie.original_title || "Untitled"}
            </h5>

            <p class="card-text">
              <small style="color: white">
                Release: ${movie.release_date || "Unknown"}
              </small>
            </p>

            <p style="color: white">
              ⭐ ${Number(movie.vote_average || 0).toFixed(1)}/10
            </p>
          </div>
        `;

        // Add Remove Favorite button
        const cardBody = card.querySelector(".card-body");

        const removeButton = document.createElement("button");
        removeButton.type = "button";
        removeButton.className = "favorite-remove-btn";
        removeButton.textContent = "❤️ Remove Favorite";

        removeButton.addEventListener("click", () => {
          removeFavorite(movieId, card, removeButton);
        });

        cardBody.appendChild(removeButton);

      } catch (error) {
        console.error(`Movie ${movieId} could not load:`, error);

        card.innerHTML = `
          <div class="card-body">
            <h5 class="card-title" style="color: white">
              Movie ID: ${movieId}
            </h5>
            <p style="color: white">
              Movie details could not be loaded.
            </p>
          </div>
        `;
      }

      favoritesContainer.appendChild(card);
    }

  } catch (error) {
    console.error("Load favorites error:", error);
    favoriteMessage.textContent = error.message;
  }
}

async function removeFavorite(movieId, card, button) {
  const token = sessionStorage.getItem("token");

  if (!token) {
    favoriteMessage.textContent = "Please login first.";
    return;
  }

  button.disabled = true;
  button.textContent = "Removing...";

  try {
    const response = await fetch(`/api/favorites/${movieId}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Unable to remove favorite.");
    }

    card.remove();

    if (favoritesContainer.children.length === 0) {
      favoriteMessage.textContent = "Your favorites list is empty.";
    }

  } catch (error) {
    console.error("Remove favorite error:", error);
    favoriteMessage.textContent = error.message;
    button.disabled = false;
    button.textContent = "❤️ Remove Favorite";
  }
}

loadFavorites();