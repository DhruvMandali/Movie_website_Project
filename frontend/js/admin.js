const API_BASE_URL = "https://moviewebsiteproject-backend.vercel.app";
const statusMessage = document.getElementById("statusMessage");
const usersTableBody = document.getElementById("usersTableBody");
const userSearch = document.getElementById("userSearch");

const token = sessionStorage.getItem("token");

let allUsers = [];

function escapeHTML(value) {
    return String(value ?? "").replace(/[&<>"']/g, (char) => ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;"
    })[char]);
}

function getStoredUser() {
    try {
        return JSON.parse(sessionStorage.getItem("user") || "null");
    } catch {
        return null;
    }
}

const loggedInUser = getStoredUser();

if (!token) {
    window.location.href = "login.html";
} else if (!loggedInUser || loggedInUser.role !== "admin") {
    statusMessage.textContent =
        "Admin role not found in your saved login. Please log out and log in again.";
} else {
    loadDashboard();
    loadUsers();
}

async function apiRequest(url) {
    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(data.message || `Request failed: ${response.status}`);
    }

    return data;
}

async function loadDashboard() {
    try {
        const data = await apiRequest(`${API_BASE_URL}/api/admin/dashboard`);

        document.getElementById("totalUsers").textContent =
            data.stats.totalUsers ?? 0;

        document.getElementById("totalReviews").textContent =
            data.stats.totalReviews ?? 0;

        document.getElementById("totalFavorites").textContent =
            data.stats.totalFavorites ?? 0;

        statusMessage.textContent = "Dashboard loaded successfully.";
    } catch (error) {
        statusMessage.textContent = `Dashboard error: ${error.message}`;
    }
}

async function loadUsers() {
    try {
        const data = await apiRequest(`${API_BASE_URL}/api/admin/users`);

        allUsers = Array.isArray(data.users) ? data.users : [];
        renderUsers(allUsers);
    } catch (error) {
        usersTableBody.innerHTML = `
            <tr>
                <td colspan="6">${escapeHTML(error.message)}</td>
            </tr>
        `;
        document.getElementById("usersCount").textContent = "";
    }
}

function renderUsers(users) {
    if (users.length === 0) {
        usersTableBody.innerHTML = `
            <tr><td colspan="6">No users found.</td></tr>
        `;
        document.getElementById("usersCount").textContent = "0 users";
        return;
    }

    usersTableBody.innerHTML = users.map((user) => {
        const registeredDate = user.created_at
            ? new Date(user.created_at).toLocaleString()
            : "Not available";

        return `
            <tr>
                <td>${escapeHTML(user.id)}</td>
                <td>${escapeHTML(user.name)}</td>
                <td>${escapeHTML(user.email)}</td>
                <td class="password-protected">Protected</td>
                <td><span class="role-badge">${escapeHTML(user.role)}</span></td>
                <td>${escapeHTML(registeredDate)}</td>
            </tr>
        `;
    }).join("");

    document.getElementById("usersCount").textContent =
        `Showing ${users.length} user(s)`;
}

userSearch.addEventListener("input", () => {
    const searchTerm = userSearch.value.trim().toLowerCase();

    const filteredUsers = allUsers.filter((user) =>
        String(user.name || "").toLowerCase().includes(searchTerm) ||
        String(user.email || "").toLowerCase().includes(searchTerm) ||
        String(user.id || "").includes(searchTerm)
    );

    renderUsers(filteredUsers);
});

document.getElementById("logoutButton").addEventListener("click", () => {
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("user");
    window.location.href = "login.html";
});


async function loadUserActivities() {
    const tableBody = document.getElementById("activitiesTableBody");

    if (!tableBody) return;

    const token = sessionStorage.getItem("token");

    if (!token) {
        // tableBody.innerHTML =
        //     '<tr><td colspan="6">Please login first.</td></tr>';
        // return;
            console.error("Admin token not found. Please login again.");
    return;
    }

    try {
        const response = await fetch(
            // "http://localhost:7750/api/admin/activities"
            `${API_BASE_URL}/api/admin/activities`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Unable to load activities");
        }

        if (!data.activities || data.activities.length === 0) {
            tableBody.innerHTML =
                '<tr><td colspan="6">No activities found.</td></tr>';
            return;
        }

        tableBody.replaceChildren();

        data.activities.forEach((item) => {
            const row = document.createElement("tr");

            const values = [
                item.id,
                item.user_id ?? "Deleted user",
                item.user_email || "N/A",
                item.activity,
                item.details || "N/A",
                item.created_at
                    ? new Date(item.created_at).toLocaleString()
                    : "N/A"
            ];

            values.forEach((value) => {
                const cell = document.createElement("td");
                cell.textContent = String(value);
                row.appendChild(cell);
            });

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error("Activity logs error:", error);

        tableBody.innerHTML =
            '<tr><td colspan="6">Could not load activity logs. Check the server and login token.</td></tr>';
    }
}

loadUserActivities();


async function loadAdminReviews() {
    const tableBody = document.getElementById("reviewsTableBody");
    const status = document.getElementById("reviewsStatus");
    const token = sessionStorage.getItem("token");

    if (!tableBody) return;

    if (!token) {
        tableBody.innerHTML =
            '<tr><td colspan="7">Please login as admin.</td></tr>';
        return;
    }

    try {
        const response = await fetch(
            `${API_BASE_URL}/api/admin/reviews`,
            {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
            throw new Error(data.message || "Failed to load reviews");
        }

        tableBody.replaceChildren();

        if (!data.reviews || data.reviews.length === 0) {
            tableBody.innerHTML =
                '<tr><td colspan="7">No reviews found.</td></tr>';
            return;
        }

        data.reviews.forEach((review) => {
            const row = document.createElement("tr");

            const values = [
                review.id,
                review.user_name || `User ${review.user_id ?? "deleted"}`,
                review.user_email || "N/A",
                review.movie_id,
                review.review,
                review.created_at
                    ? new Date(review.created_at).toLocaleString()
                    : "N/A"
            ];

            values.forEach((value) => {
                const cell = document.createElement("td");
                cell.textContent = String(value ?? "N/A");
                row.appendChild(cell);
            });

            const actionCell = document.createElement("td");
            const deleteButton = document.createElement("button");

            deleteButton.type = "button";
            deleteButton.className = "review-delete-button";
            deleteButton.textContent = "Delete";

            deleteButton.addEventListener("click", async () => {
                const confirmed = window.confirm(
                    `Delete review #${review.id}? This cannot be undone.`
                );

                if (!confirmed) return;

                deleteButton.disabled = true;

                try {
                    const deleteResponse = await fetch(
                        `${API_BASE_URL}/api/admin/reviews/${review.id}`,
                        {
                            method: "DELETE",
                            headers: {
                                Authorization: `Bearer ${token}`
                            }
                        }
                    );

                    const deleteData = await deleteResponse.json();

                    if (!deleteResponse.ok || !deleteData.success) {
                        throw new Error(
                            deleteData.message || "Unable to delete review"
                        );
                    }

                    if (status) {
                        status.textContent = "Review deleted successfully.";
                    }

                    await loadAdminReviews();
                } catch (error) {
                    if (status) {
                        status.textContent = error.message;
                    }
                    deleteButton.disabled = false;
                }
            });

            actionCell.appendChild(deleteButton);
            row.appendChild(actionCell);
            tableBody.appendChild(row);
        });

        if (status) {
            status.textContent = `${data.reviews.length} review(s) loaded.`;
        }
    } catch (error) {
        console.error("Admin reviews error:", error);

        tableBody.innerHTML =
            '<tr><td colspan="7">Could not load reviews. Check API and admin login.</td></tr>';

        if (status) {
            status.textContent = error.message;
        }
    }
}

loadAdminReviews();


const refreshUsersButton = document.getElementById("refreshUsersButton");
const refreshActivitiesButton = document.getElementById("refreshActivitiesButton");
const refreshReviewsButton = document.getElementById("refreshReviewsButton");

if (refreshUsersButton) {
    refreshUsersButton.addEventListener("click", async () => {
        refreshUsersButton.disabled = true;

        try {
            if (typeof loadUsers === "function") {
                await loadUsers();
            } else {
                window.location.reload();
            }
        } finally {
            refreshUsersButton.disabled = false;
        }
    });
}

if (refreshActivitiesButton) {
    refreshActivitiesButton.addEventListener("click", async () => {
        refreshActivitiesButton.disabled = true;

        try {
            if (typeof loadUserActivities === "function") {
                await loadUserActivities();
            } else {
                window.location.reload();
            }
        } finally {
            refreshActivitiesButton.disabled = false;
        }
    });
}

if (refreshReviewsButton) {
    refreshReviewsButton.addEventListener("click", async () => {
        refreshReviewsButton.disabled = true;

        try {
            if (typeof loadAdminReviews === "function") {
                await loadAdminReviews();
            } else {
                window.location.reload();
            }
        } finally {
            refreshReviewsButton.disabled = false;
        }
    });
}

