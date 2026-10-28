
// const favoriteButton = document.getElementById("favoriteButton");
// const favoriteMessage = document.getElementById("favoriteMessage");



document.addEventListener("DOMContentLoaded", () => {
  const favoriteButton = document.getElementById("favoriteButton");
  const favoriteMessage = document.getElementById("favoriteMessage");

  // if (!favoriteButton) {
  //   console.error('HTML ma id="favoriteButton" malyu nathi.');
  //   return;
  // }

  favoriteButton.addEventListener("click", async () => {
    const token = sessionStorage.getItem("token");

    if (!token) {
      if (favoriteMessage) {
        favoriteMessage.textContent = "Please login to add favorites.";
      }
      window.location.href = "login.html";
      return;
    }

    // URL mathi movie ID melvo
    const params = new URLSearchParams(window.location.search);

    let movieId = Number(
      params.get("id") ||
      params.get("movieId") ||
      params.get("movie_id")
    );

    // Tamari current URL ?1228834 format mate
    if (!Number.isSafeInteger(movieId) || movieId <= 0) {
      const rawId = window.location.search.slice(1).split("&")[0];
      movieId = Number(rawId);
    }

    if (!Number.isSafeInteger(movieId) || movieId <= 0) {
      if (favoriteMessage) {
        favoriteMessage.textContent = "Valid movie ID not found in URL.";
      }
      console.error("Invalid movie ID:", window.location.href);
      return;
    }

    favoriteButton.disabled = true;

    if (favoriteMessage) {
      favoriteMessage.textContent = "Adding to favorites...";
    }

    try {
      const response = await fetch("/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ movieId })
      });

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



// favoriteButton.addEventListener("click", async () => {
//   const token = sessionStorage.getItem("token");
// console.log("favorites.js loaded");

//   if (!token) {
//     favoriteMessage.textContent = "Please login to add favorites.";
//     window.location.href = "login.html";
//     return;
//   }

//   // Movie ID URL mathi melvo
//   // const params = new URLSearchParams(window.location.search);
//   // const movieId = Number(
//   //   params.get("id") || params.get("movieId") || params.get("movie_id")
//   // );
  
// const params = new URLSearchParams(window.location.search);

// let movieId = Number(
//   params.get("id") ||
//   params.get("movieId") ||
//   params.get("movie_id")
// );

// // Tamari current URL ?1228834 format ne pan support kare chhe
// if (!movieId) {
//   const rawId = window.location.search.slice(1).split("&")[0];
//   movieId = Number(rawId);
// }


//   if (!Number.isSafeInteger(movieId) || movieId <= 0) {
//     favoriteMessage.textContent =
//       "Movie ID URL ma malyo nathi. Please check movie details link.";
//     return;
//   }

//   favoriteButton.disabled = true;
//   favoriteMessage.textContent = "Adding to favorites...";

//   try {
//     const response = await fetch("/api/favorites", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`
//       },
//       body: JSON.stringify({ movieId })
//     });

//     const data = await response.json();

//     if (!response.ok) {
//       throw new Error(
//         data.message ||
//         (response.status === 409
//           ? "This movie is already in your favorites."
//           : "Could not add favorite.")
//       );
//     }

//     favoriteMessage.textContent =
//       data.message || "Movie added to favorites successfully!";
//   } catch (error) {
//     favoriteMessage.textContent = error.message;
//   } finally {
//     favoriteButton.disabled = false;
//   }
// });
