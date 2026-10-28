
function setupReviews(movieId) {
  const reviewForm = document.getElementById("reviewForm");
  const reviewText = document.getElementById("reviewText");
  const reviewMessage = document.getElementById("reviewMessage");
  const reviewsContainer = document.getElementById("reviewsContainer");
  const submitButton = document.getElementById("submitReviewButton");

  if (
    !reviewForm ||
    !reviewText ||
    !reviewMessage ||
    !reviewsContainer ||
    !submitButton
  ) {
    console.error("Review HTML elements not found.");
    return;
  }

  // Logged-in user ni information melvo
  function getCurrentUser() {
    try {
      return JSON.parse(sessionStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  }

  // --------------------------------
  // 1. Badha reviews load karva
  // --------------------------------
  async function loadReviews() {
    reviewsContainer.replaceChildren();
    reviewMessage.textContent = "Loading reviews...";

    try {
      const response = await fetch(`/api/reviews/${movieId}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Could not load reviews.");
      }

      const reviews = Array.isArray(data) ? data : data.reviews;

      if (!Array.isArray(reviews)) {
        throw new Error("Invalid reviews API response.");
      }

      if (reviews.length === 0) {
        reviewMessage.textContent =
          "No reviews yet. Be the first to review!";
        return;
      }

      reviewMessage.textContent = "";

      const currentUser = getCurrentUser();

      reviews.forEach((review) => {
        const item = document.createElement("article");
        item.className = "review-item";
        item.style.margin = "16px ";
        item.style.padding = "16px";
        item.style.border = "1px solid #888";
        item.style.borderRadius = "8px";

        const author = document.createElement("h4");
        author.textContent = review.user_name || "User";

        const text = document.createElement("p");
        text.textContent = review.review;

        const date = document.createElement("small");
        date.textContent = review.created_at
          ? new Date(review.created_at).toLocaleDateString()
          : "";

        item.append(author, text, date);

        // Khali potana review mate Edit ane Delete buttons
        if (
          currentUser &&
          Number(currentUser.id) === Number(review.user_id)
        ) {
          const editButton = document.createElement("button");
          editButton.type = "button";
          editButton.textContent = "Edit Review";

          editButton.addEventListener("click", async () => {
            const updatedText = prompt(
              "Edit your review:",
              review.review
            );

            if (updatedText === null) return;

            if (!updatedText.trim()) {
              alert("Review cannot be empty.");
              return;
            }

            const token = sessionStorage.getItem("token");

            if (!token) {
              window.location.href = "login.html";
              return;
            }

            editButton.disabled = true;

            try {
              const response = await fetch(
                `/api/reviews/${review.id}`,
                {
                  method: "PUT",
                  headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                  },
                  body: JSON.stringify({
                    review: updatedText.trim()
                  })
                }
              );

              const result = await response.json();

              if (!response.ok) {
                throw new Error(
                  result.message || "Could not update review."
                );
              }

              reviewMessage.textContent = "Review updated successfully!";
              await loadReviews();
            } catch (error) {
              console.error("Edit review error:", error);
              reviewMessage.textContent = error.message;
            } finally {
              editButton.disabled = false;
            }
          });

          const deleteButton = document.createElement("button");
          deleteButton.type = "button";
          deleteButton.textContent = "Delete Review";

          deleteButton.addEventListener("click", async () => {
            const confirmed = confirm(
              "Are you sure you want to delete your review?"
            );

            if (!confirmed) return;

            const token = sessionStorage.getItem("token");

            if (!token) {
              window.location.href = "login.html";
              return;
            }

            deleteButton.disabled = true;

            try {
              const response = await fetch(
                `/api/reviews/${review.id}`,
                {
                  method: "DELETE",
                  headers: {
                    Authorization: `Bearer ${token}`
                  }
                }
              );

              const result = await response.json();

              if (!response.ok) {
                throw new Error(
                  result.message || "Could not delete review."
                );
              }

              reviewMessage.textContent = "Review deleted successfully!";
              await loadReviews();
            } catch (error) {
              console.error("Delete review error:", error);
              reviewMessage.textContent = error.message;
            } finally {
              deleteButton.disabled = false;
            }
          });

          item.append(editButton, deleteButton);
        }

        reviewsContainer.appendChild(item);
      });
    } catch (error) {
      console.error("Load reviews error:", error);
      reviewMessage.textContent = error.message;
    }
  }

  // --------------------------------
  // 2. Navo review submit karva
  // --------------------------------
  reviewForm.addEventListener("submit", async (event) => {
    event.preventDefault();

    const token = sessionStorage.getItem("token");

    if (!token) {
      window.location.href = "login.html";
      return;
    }

    const review = reviewText.value.trim();

    if (review.length < 2) {
      reviewMessage.textContent =
        "Please enter at least 2 characters.";
      return;
    }

    submitButton.disabled = true;
    reviewMessage.textContent = "Submitting review...";

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          movieId: Number(movieId),
          review: review
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.message || "Could not submit review."
        );
      }

      reviewText.value = "";
      reviewMessage.textContent = "Review submitted successfully!";

      await loadReviews();
    } catch (error) {
      console.error("Submit review error:", error);
      reviewMessage.textContent = error.message;
    } finally {
      submitButton.disabled = false;
    }
  });

  // Page load thay tyare reviews batavva
  loadReviews();
}




