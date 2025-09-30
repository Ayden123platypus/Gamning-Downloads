// Sample games data
let games = [
    {
        title: "Super Mario Bros. ROM Hack",
        description: "A fun ROM hack of the classic NES game.",
        tags: ["nes", "romhack"],
        downloads: ["https://example.com/download1"]
    },
    {
        title: "Sonic the Hedgehog",
        description: "The classic Genesis platformer.",
        tags: ["genesis"],
        downloads: ["https://example.com/download2"]
    },
];

// Admin password (set this to your desired password)
const ADMIN_PASSWORD = "yourpassword123";

// DOM elements
const gamesContainer = document.getElementById("games-container");
const searchBar = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");
const tags = document.querySelectorAll(".tag");
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
            <button class="edit-button" data-index="${index}">✏️</button>
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

// Tag filtering
tags.forEach(tag => {
    tag.addEventListener("click", () => {
        tags.forEach(t => t.classList.remove("active"));
        tag.classList.add("active");
        const searchTerm = searchBar.value.toLowerCase();
        const activeTag = tag.dataset.tag;
        const filteredGames = games.filter(game =>
            (game.title.toLowerCase().includes(searchTerm) ||
             game.description.toLowerCase().includes(searchTerm)) &&
            (activeTag === "all" || game.tags.includes(activeTag))
        );
        renderGames(filteredGames);
    });
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
        loginModal.style.display = "none";
        addGameButton.style.display = "inline-block";
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
    const downloadInputs = document.querySelectorAll(".download-link");
    const downloads = Array.from(downloadInputs).map(input => input.value);
    const editIndex = editIndexInput.value;

    if (editIndex !== "") {
        // Edit existing game
        games[editIndex] = { title, description, tags, downloads };
    } else {
        // Add new game
        games.push({ title, description, tags, downloads });
    }

    renderGames();
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
