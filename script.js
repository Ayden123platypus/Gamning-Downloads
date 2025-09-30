// Sample games data
let games = [
    { title: "Super Mario Bros. ROM Hack", description: "A fun ROM hack of the classic NES game.", tags: ["nes", "romhack"], download: "https://example.com/download1" },
    { title: "Sonic the Hedgehog", description: "The classic Genesis platformer.", tags: ["genesis"], download: "https://example.com/download2" },
];

// Admin password (set this to your desired password)
const ADMIN_PASSWORD = "LittleJimmy";

// DOM elements
const gamesContainer = document.getElementById("games-container");
const searchBar = document.getElementById("search-bar");
const searchButton = document.getElementById("search-button");
const tags = document.querySelectorAll(".tag");
const loginButton = document.getElementById("login-button");
const addGameButton = document.getElementById("add-game-button");
const loginModal = document.getElementById("login-modal");
const addModal = document.getElementById("add-modal");
const loginForm = document.getElementById("login-form");
const gameForm = document.getElementById("game-form");
const closeButtons = document.querySelectorAll(".close");

// Render games
function renderGames(filteredGames = games) {
    gamesContainer.innerHTML = "";
    filteredGames.forEach(game => {
        const gameCard = document.createElement("div");
        gameCard.className = "game-card";
        gameCard.innerHTML = `
            <h3>${game.title}</h3>
            <p>${game.description}</p>
            <div class="game-tags">
                ${game.tags.map(tag => `<span class="game-tag">${tag}</span>`).join("")}
            </div>
            <a href="${game.download}" class="download-link" target="_blank">Download</a>
        `;
        gamesContainer.appendChild(gameCard);
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
    loginModal.style.display = "block";
});

// Close modals
closeButtons.forEach(button => {
    button.addEventListener("click", () => {
        loginModal.style.display = "none";
        addModal.style.display = "none";
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

// Add game form submission
gameForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const title = document.getElementById("game-title").value;
    const description = document.getElementById("game-description").value;
    const tags = document.getElementById("game-tags").value.split(",").map(tag => tag.trim());
    const download = document.getElementById("game-download").value;

    games.push({ title, description, tags, download });
    renderGames();
    addModal.style.display = "none";
    gameForm.reset();
});

// Add game button
addGameButton.addEventListener("click", () => {
    addModal.style.display = "block";
});

// Initial render
renderGames();
