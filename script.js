// Load games from localStorage or use default
let games = JSON.parse(localStorage.getItem("games")) || [
    {
        title: "Super Mario Bros. ROM Hack",
        description: "A fun ROM hack of the classic NES game.",
        tags: ["nes", "romhack"],
        downloads: ["https://example.com/download1"],
        image: "https://via.placeholder.com/300x180?text=Super+Mario+Bros.",
        versions: [
            {
                number: "v1.0",
                notes: "Initial release with 5 new levels.",
                downloads: ["https://example.com/download1_v1"]
            }
        ]
    },
    {
        title: "Sonic the Hedgehog",
        description: "The classic Genesis platformer.",
        tags: ["genesis"],
        downloads: ["https://example.com/download2"],
        image: "https://via.placeholder.com/300x180?text=Sonic+the+Hedgehog",
        versions: []
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
const versionModal = document.getElementById("version-modal");
const loginForm = document.getElementById("login-form");
const gameForm = document.getElementById("game-form");
const versionForm = document.getElementById("version-form");
const closeButtons = document.querySelectorAll(".close");
const modalTitle = document.getElementById("modal-title");
const versionModalTitle = document.getElementById("version-modal-title");
const downloadLinksContainer = document.getElementById("download-links-container");
const versionDownloadLinksContainer = document.getElementById("version-download-links-container");
const addLinkButton = document.getElementById("add-link-button");
const addVersionLinkButton = document.getElementById("add-version-link-button");
const editIndexInput = document.getElementById("edit-index");
const versionGameIndexInput = document.getElementById("version-game-index");
const versionEditIndexInput = document.getElementById("version-edit-index");

// Render games
function renderGames(filteredGames = games) {
    gamesContainer.innerHTML = "";
    filteredGames.forEach((game, index) => {
        const gameCard = document.createElement("div");
        gameCard.className = "game-card";
        gameCard.innerHTML = `
            <button class="edit-button" data-index="${index}" style="${isAdminLoggedIn ? 'display: block;' : 'display: none;'}">✏️</button>
            <button class="delete-button" data-index="${index}" style="${isAdminLoggedIn ? 'display: block;' : 'display: none;'}">🗑️</button>
            ${game.image ? `<img src="${game.image}" alt="${game.title}" class="game-image">` : ''}
            <h3>${game.title}</h3>
            <p>${game.description}</p>
            <div class="game-tags">
                ${game.tags.map(tag => `<span class="game-tag">${tag}</span>`).join("")}
            </div>
            <div class="download-links">
                ${game.downloads.map(link => `<a href="${link}" class="download-link" target="_blank">Download Latest</a>`).join("")}
            </div>
            <div class="versions-section">
                <div class="versions-title">Versions:</div>
                <div class="versions-list" data-game-index="${index}">
                    ${game.versions.length > 0 ?
                        game.versions.map((version, versionIndex) => `
                            <div class="version-item">
                                <div class="version-header">
                                    <div class="version-number">${version.number}</div>
                                    ${isAdminLoggedIn ?
                                        `<button class="edit-version-button" data-game-index="${index}" data-version-index="${versionIndex}">✏️</button>` : ''}
                                </div>
                                <div class="version-notes">${version.notes}</div>
                                <div class="version-downloads">
                                    ${version.downloads.map(download => `
                                        <a href="${download}" class="version-download-link" target="_blank">Download ${version.number}</a>
                                    `).join("")}
                                </div>
                            </div>
                        `).join("")
                    : '<div class="version-item">No older versions available.</div>'}
                </div>
                ${isAdminLoggedIn ?
                    `<button class="add-version-button" data-game-index="${index}">+ Add Version</button>` : ''}
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

    // Add event listeners to add version buttons
    document.querySelectorAll(".add-version-button").forEach(button => {
        button.addEventListener("click", () => {
            const gameIndex = parseInt(button.dataset.gameIndex);
            addVersion(gameIndex);
        });
    });

    // Add event listeners to edit version buttons
    document.querySelectorAll(".edit-version-button").forEach(button => {
        button.addEventListener("click", () => {
            const gameIndex = parseInt(button.dataset.gameIndex);
            const versionIndex = parseInt(button.dataset.versionIndex);
            editVersion(gameIndex, versionIndex);
        });
    });
}

// Delete game
function deleteGame(index) {
    games.splice(index, 1);
    saveGames();
    renderGames();
    renderTags();
}

// Add version
function addVersion(gameIndex) {
    versionModalTitle.textContent = "Add New Version";
    versionGameIndexInput.value = gameIndex;
    versionEditIndexInput.value = "";
    versionForm.reset();
    versionDownloadLinksContainer.innerHTML = `
        <div class="version-download-link-input">
            <input type="url" class="version-download-link" placeholder="Download Link" required>
            <button type="button" class="remove-version-link-button" style="display: none;">×</button>
        </div>
    `;
    versionModal.style.display = "flex";
}

// Edit version
function editVersion(gameIndex, versionIndex) {
    const version = games[gameIndex].versions[versionIndex];
    versionModalTitle.textContent = "Edit Version";
    versionGameIndexInput.value = gameIndex;
    versionEditIndexInput.value = versionIndex;
    document.getElementById("version-number").value = version.number;
    document.getElementById("version-notes").value = version.notes;

    versionDownloadLinksContainer.innerHTML = "";
    version.downloads.forEach((link, i) => {
        const inputGroup = document.createElement("div");
        inputGroup.className = "version-download-link-input";
        inputGroup.innerHTML = `
            <input type="url" class="version-download-link" placeholder="Download Link" value="${link}" required>
            <button type="button" class="remove-version-link-button" ${i === 0 ? 'style="display: none;"' : ''}>×</button>
        `;
        versionDownloadLinksContainer.appendChild(inputGroup);

        if (i !== 0) {
            inputGroup.querySelector(".remove-version-link-button").addEventListener("click", () => {
                versionDownloadLinksContainer.removeChild(inputGroup);
            });
        }
    });

    versionModal.style.display = "flex";
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
            filterGames();
        });
        tagsContainer.appendChild(tagElement);
    });
}

// Filter games based on search and active tag
function filterGames() {
    const searchTerm = searchBar.value.toLowerCase();
    const activeTag = document.querySelector(".tag.active").dataset.tag;
    const filteredGames = games.filter(game =>
        (game.title.toLowerCase().includes(searchTerm) ||
         game.description.toLowerCase().includes(searchTerm)) &&
        (activeTag === "all" || game.tags.includes(activeTag))
    );
    renderGames(filteredGames);
}

// Search functionality (dynamic)
searchBar.addEventListener("input", filterGames);

// Search button (optional)
searchButton.addEventListener("click", filterGames);

// Login modal
loginButton.addEventListener("click", () => {
    loginModal.style.display = "flex";
});

// Close modals
closeButtons.forEach(button => {
    button.addEventListener("click", () => {
        loginModal.style.display = "none";
        gameModal.style.display = "none";
        versionModal.style.display = "none";
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
        renderGames();
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

    inputGroup.querySelector(".remove-link-button").addEventListener("click", () => {
        downloadLinksContainer.removeChild(inputGroup);
    });
});

// Add version link button
addVersionLinkButton.addEventListener("click", () => {
    const inputGroup = document.createElement("div");
    inputGroup.className = "version-download-link-input";
    inputGroup.innerHTML = `
        <input type="url" class="version-download-link" placeholder="Download Link" required>
        <button type="button" class="remove-version-link-button">×</button>
    `;
    versionDownloadLinksContainer.appendChild(inputGroup);

    inputGroup.querySelector(".remove-version-link-button").addEventListener("click", () => {
        versionDownloadLinksContainer.removeChild(inputGroup);
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
            image: imageUrl || existingGame.image,
            versions: existingGame.versions || []
        };
    } else {
        // Add new game
        games.push({ title, description, tags, downloads, image: imageUrl, versions: [] });
    }

    saveGames();
    renderGames();
    renderTags();
    gameModal.style.display = "none";
});

// Version form submission
versionForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const gameIndex = parseInt(versionGameIndexInput.value);
    const versionIndex = versionEditIndexInput.value;
    const number = document.getElementById("version-number").value;
    const notes = document.getElementById("version-notes").value;
    const versionDownloadInputs = document.querySelectorAll(".version-download-link");
    const downloads = Array.from(versionDownloadInputs).map(input => input.value);

    if (versionIndex !== "") {
        // Edit existing version
        games[gameIndex].versions[versionIndex] = { number, notes, downloads };
    } else {
        // Add new version
        games[gameIndex].versions.push({ number, notes, downloads });
    }

    saveGames();
    renderGames();
    versionModal.style.display = "none";
});

// Edit game
function editGame(index) {
    const game = games[index];
    document.getElementById("game-title").value = game.title;
    document.getElementById("game-description").value = game.description;
    document.getElementById("game-tags").value = game.tags.join(", ");
    editIndexInput.value = index;

    downloadLinksContainer.innerHTML = "";
    game.downloads.forEach((link, i) => {
        const inputGroup = document.createElement("div");
        inputGroup.className = "download-link-input";
        inputGroup.innerHTML = `
            <input type="url" class="download-link" placeholder="Download Link" value="${link}" required>
            <button type="button" class="remove-link-button" ${i === 0 ? 'style="display: none;"' : ''}>×</button>
        `;
        downloadLinksContainer.appendChild(inputGroup);

        if (i !== 0) {
            inputGroup.querySelector(".remove-link-button").addEventListener("click", () => {
                downloadLinksContainer.removeChild(inputGroup);
            });
        }
    });

    modalTitle.textContent = "Edit Game";
    gameModal.style.display = "flex";
}

// Save games to localStorage
function saveGames() {
    localStorage.setItem("games", JSON.stringify(games));
}

// Initial render
renderGames();
renderTags();
