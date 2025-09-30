// Sample games data
let games = [
    {
        title: "Super Mario Bros. ROM Hack",
        description: "A fun ROM hack of the classic NES game.",
        tags: ["nes", "romhack"],
        downloads: ["https://example.com/download1"],
        image: "https://via.placeholder.com/300x180?text=Super+Mario+Bros."
    },
    {
        title: "Sonic the Hedgehog",
        description: "The classic Genesis platformer.",
        tags: ["genesis"],
        downloads: ["https://example.com/download2"],
        image: "https://via.placeholder.com/300x180?text=Sonic+the+Hedgehog"
    },
];

// Admin password (set this to your desired password)
const ADMIN_PASSWORD = "yourpassword123";

// Admin state
let isAdminLoggedIn = false;

// DOM elements
const gamesContainer = document.getElementById("games-container");
const tagsContainer = document.getElementById("tags-container");
const searchBar = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");
const loginButton = document.getElementById("login-button");
const addGameButton = document.getElementById("add-game-button");
const loginModal = document.getElementById("login-modal");
const gameModal = document.getElementById("game-modal");
const loginForm = document.getElementById("login-form");
const gameForm = document.getElementById("game-form");
const closeButtons = document.querySelectorAll(".close");
const modalTitle = document.getElementById("modal-title");
const downloadLinksContainer = document.getElementById("download-links-container");
const addLinkButton = document.getElementById("add-link-button");
const editIndexInput = document.getElementById("edit-index");

// Render games
function renderGames(filteredGames = games) {
    gamesContainer.innerHTML = "";
    filteredGames.forEach((game, index) => {
        const gameCard = document.createElement("div");
        gameCard.className = "game-card";
        gameCard.innerHTML = `
            <button class="edit-button" data-index="${index}" ${!isAdminLoggedIn ? 'style="display: none;"' : ''}>✏️</button>
            <button class="delete-button" data-index="${index}" ${!isAdminLoggedIn ? 'style="display: none;"' : ''}>🗑️</button>
            ${game.image ? `<img src="${game.image}" alt="${game.title}" class="game-image">` : ''}
            <h3>${game.title}</h3>
            <p>${game.description}</p>
            <div class="game-tags">
                ${game.tags.map(tag => `<span class="game-tag">${tag}</span>`).join("")}
            </div>
            <div class="download-links">
                ${game.downloads.map(link => `<a href="${link}" class="download-link" target="_blank">Download</a>`).join("")}
            </div>
        `;
        gamesContainer.appendChild(gameCard);
    });

    // Add event listeners to edit buttons
    document.querySelectorAll(".edit-button").forEach(button => {
        button.addEventListener("click", () => {
            const index = parseInt(button.dataset.index);
            editGame(index);
        });
    });

    // Add event listeners to delete buttons
    document.querySelectorAll(".delete-button").forEach(button => {
        button.addEventListener("click", () => {
            const index = parseInt(button.dataset.index);
            if (confirm("Are you sure you want to delete this game?")) {
                deleteGame(index);
            }
        });
    });
}

// Delete game
function deleteGame(index) {
    games.splice(index, 1);
    renderGames();
    renderTags();
}

// Render tags
function renderTags() {
    const allTags = ["all"];
    games.forEach(game => {
        game.tags.forEach(tag => {
            if (!allTags.includes(tag)) {
                allTags.push(tag);
            }
        });
    });

    tagsContainer.innerHTML = "";
    allTags.forEach(tag => {
        const tagElement = document.createElement("div");
        tagElement.className = `tag ${tag === "all" ? "active" : ""}`;
        tagElement.textContent = tag.charAt(0).toUpperCase() + tag.slice(1);
        tagElement.dataset.tag = tag;
        tagElement.addEventListener("click", () => {
            document.querySelectorAll(".tag").forEach(t => t.classList.remove("active"));
            tagElement.classList.add("active");
            const searchTerm = searchBar.value.toLowerCase();
            const activeTag = tagElement.dataset.tag;
            const filteredGames = games.filter(game =>
                (game.title.toLowerCase().includes(searchTerm) ||
                 game.description.toLowerCase().includes(searchTerm)) &&
                (activeTag === "all" || game.tags.includes(activeTag))
            );
            renderGames(filteredGames);
        });
        tagsContainer.appendChild(tagElement);
    });
}

// Search functionality
searchButton.addEventListener("click", () => {
    const searchTerm = searchBar.value.toLowerCase();
    const activeTag = document.querySelector(".tag.active").dataset.tag;
    const filteredGames = games.filter(game =>
        (game.title.toLowerCase().includes(searchTerm) ||
         game.description.toLowerCase().includes(searchTerm)) &&
        (activeTag === "all" || game.tags.includes(activeTag))
    );
    renderGames(filteredGames);
});

// Login modal
loginButton.addEventListener("click", () => {
    loginModal.style.display = "flex";
});

// Close modals
closeButtons.forEach(button => {
    button.addEventListener("click", () => {
        loginModal.style.display = "none";
        gameModal.style.display = "none";
    });
});

// Login form submission
loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const password = document.getElementById("admin-password").value;
    if (password === ADMIN_PASSWORD) {
        isAdminLoggedIn = true;
        loginModal.style.display = "none";
        addGameButton.style.display = "inline-block";
        renderGames(); // Re-render games to show edit and delete buttons
    } else {
        alert("Incorrect password!");
    }
});

// Add game button
addGameButton.addEventListener("click", () => {
    gameForm.reset();
    modalTitle.textContent = "Add New Game";
    editIndexInput.value = "";
    downloadLinksContainer.innerHTML = `
        <div class="download-link-input">
            <input type="url" class="download-link" placeholder="Download Link" required>
            <button type="button" class="remove-link-button" style="display: none;">×</button>
        </div>
    `;
    gameModal.style.display = "flex";
});

// Add link button
addLinkButton.addEventListener("click", () => {
    const inputGroup = document.createElement("div");
    inputGroup.className = "download-link-input";
    inputGroup.innerHTML = `
        <input type="url" class="download-link" placeholder="Download Link" required>
        <button type="button" class="remove-link-button">×</button>
    `;
    downloadLinksContainer.appendChild(inputGroup);

    // Add event listener to remove button
    inputGroup.querySelector(".remove-link-button").addEventListener("click", () => {
        downloadLinksContainer.removeChild(inputGroup);
    });
});

// Game form submission
gameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("game-title").value;
    const description = document.getElementById("game-description").value;
    const tags = document.getElementById("game-tags").value.split(",").map(tag => tag.trim());
    const imageInput = document.getElementById("game-image");
    const downloadInputs = document.querySelectorAll(".download-link");
    const downloads = Array.from(downloadInputs).map(input => input.value);
    const editIndex = editIndexInput.value;

    let imageUrl = null;
    if (imageInput.files.length > 0) {
        const file = imageInput.files[0];
        imageUrl = URL.createObjectURL(file);
    }

    if (editIndex !== "") {
        // Edit existing game
        const existingGame = games[editIndex];
        games[editIndex] = {
            title,
            description,
            tags,
            downloads,
            image: imageUrl || existingGame.image
        };
    } else {
        // Add new game
        games.push({ title, description, tags, downloads, image: imageUrl });
    }

    renderGames();
    renderTags();
    gameModal.style.display = "none";
});

// Edit game
function editGame(index) {
    const game = games[index];
    document.getElementById("game-title").value = game.title;
    document.getElementById("game-description").value = game.description;
    document.getElementById("game-tags").value = game.tags.join(", ");
    editIndexInput.value = index;

    // Populate download links
    downloadLinksContainer.innerHTML = "";
    game.downloads.forEach((link, i) => {
        const inputGroup = document.createElement("div");
        inputGroup.className = "download-link-input";
        inputGroup.innerHTML = `
            <input type="url" class="download-link" placeholder="Download Link" value="${link}" required>
            <button type="button" class="remove-link-button" ${i === 0 ? 'style="display: none;"' : ''}>×</button>
        `;
        downloadLinksContainer.appendChild(inputGroup);

        // Add event listener to remove button
        if (i !== 0) {
            inputGroup.querySelector(".remove-link-button").addEventListener("click", () => {
                downloadLinksContainer.removeChild(inputGroup);
            });
        }
    });

    modalTitle.textContent = "Edit Game";
    gameModal.style.display = "flex";
}

// Initial render
renderGames();
renderTags();
