const API_BASE_URL = "https://moviewebsiteproject-backend.vercel.app";
document.addEventListener("DOMContentLoaded", () => {
    const favoriteButton = document.getElementById("favoriteButton");
    const favoriteMessage = document.getElementById("favoriteMessage");

    console.log("favorites.js loaded");

    // Button current page par na hoy to error avoid karo
    if (!favoriteButton) {
        console.log("Favorite button is not available on this page.");
        return;
    }

    favoriteButton.addEventListener("click", async () => {
        const token = sessionStorage.getItem("token");

        if (!token) {
            if (favoriteMessage) {
                favoriteMessage.textContent = "Please login to add favorites.";
            }

            window.location.href = "login.html";
            return;
        }

        // Get movie ID from URL
        const params = new URLSearchParams(window.location.search);

        let movieId = Number(
            params.get("id") ||
            params.get("movieId") ||
            params.get("movie_id")
        );

        // Support URL format ?1228834
        if (!Number.isSafeInteger(movieId) || movieId <= 0) {
            const rawId = window.location.search.slice(1).split("&")[0];
            movieId = Number(rawId);
        }

        if (!Number.isSafeInteger(movieId) || movieId <= 0) {
            if (favoriteMessage) {
                favoriteMessage.textContent = "Valid movie ID not found in URL.";
            }
            return;
        }

        favoriteButton.disabled = true;

        if (favoriteMessage) {
            favoriteMessage.textContent = "Adding to favorites...";
        }

        try {
            const response = await fetch(
                "${API_BASE_URL}/api/favorites",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ movieId })
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || `Request failed: ${response.status}`);
            }

            if (favoriteMessage) {
                favoriteMessage.textContent =
                    data.message || "Movie added to favorites successfully!";
            }

            console.log("Favorite added:", data);

        } catch (error) {
            console.error("Favorite API error:", error);

            if (favoriteMessage) {
                favoriteMessage.textContent = error.message;
            }
        } finally {
            favoriteButton.disabled = false;
        }
    });
});
