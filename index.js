import GAMES_DATA from './games.js';
const GAMES_JSON = JSON.parse(GAMES_DATA);

// Remove all child elements from a parent element in the DOM
function deleteChildElements(parent) {
    while (parent.firstChild) {
        parent.removeChild(parent.firstChild);
    }
}

const gamesContainer = document.getElementById("games-container");

// Function to add all games to the page
function addGamesToPage(games) {
    deleteChildElements(gamesContainer);
    for (let game of games) {
        let gameCard = document.createElement('div');
        gameCard.classList.add('game-card');
        gameCard.innerHTML = `
            <img src="${game.img}" class="game-img" alt="Image of ${game.name}">
            <h4>${game.name}</h4>
            <p>${game.description}</p>
            <p>Pledged: $${game.pledged.toLocaleString()}</p>
            <p>Backers: ${game.backers}</p>
        `;
        gamesContainer.appendChild(gameCard);
    }
}

function displayTopFundedGames() {
    const sortedGames = [...GAMES_JSON].sort((a, b) => b.pledged - a.pledged);
    const [firstGame, secondGame] = sortedGames;

    const firstGameContainer = document.getElementById("first-game");
    const secondGameContainer = document.getElementById("second-game");

    firstGameContainer.innerHTML = '<h3>🥇 Top Funded Game</h3>'; 
    secondGameContainer.innerHTML = '<h3>🥈 Runner Up</h3>'; 

    const firstGameName = document.createElement('p');
    firstGameName.textContent = firstGame.name;
    firstGameContainer.appendChild(firstGameName);

    const secondGameName = document.createElement('p');
    secondGameName.textContent = secondGame.name;
    secondGameContainer.appendChild(secondGameName);
}


// Functions to filter games
function filterUnfundedOnly() {
    const unfundedGames = GAMES_JSON.filter(game => game.pledged < game.goal);
    addGamesToPage(unfundedGames);
    updateDynamicContent();
}

function filterFundedOnly() {
    const fundedGames = GAMES_JSON.filter(game => game.pledged >= game.goal);
    addGamesToPage(fundedGames);
    updateDynamicContent();
}

function showAllGames() {
    addGamesToPage(GAMES_JSON);
    updateDynamicContent();
}

// Update the dynamic content on the page
function updateDynamicContent() {
    updateStatistics();
}


// Update statistics shown on the page
function updateStatistics() {
    const totalRaised = GAMES_JSON.reduce((acc, game) => acc + game.pledged, 0);
    const totalContributions = GAMES_JSON.reduce((acc, game) => acc + game.backers, 0);
    const totalGames = GAMES_JSON.length;

    console.log("Total Raised:", totalRaised);
    console.log("Total Contributions:", totalContributions);
    console.log("Total Games:", totalGames);

    document.getElementById("total-raised").textContent = `$${totalRaised.toLocaleString()}`;
    document.getElementById("num-contributions").textContent = totalContributions.toLocaleString();
    document.getElementById("num-games").textContent = totalGames;

    const unfundedGamesCount = GAMES_JSON.filter(game => game.pledged < game.goal).length;
    const fundedText = totalGames === 1 ? "game" : "games"; 
    const unfundedText = unfundedGamesCount === 1 ? "game remains" : "games remain"; 

    const infoString = `A total of $${totalRaised.toLocaleString()} has been raised for ${totalGames} ${fundedText}. Currently, ${unfundedGamesCount} ${unfundedText} unfunded. We need your help to fund these amazing games!`;
    const statsContainer = document.getElementById("stats-info");
    statsContainer.textContent = infoString;
}


document.addEventListener('DOMContentLoaded', function() {
    showAllGames();  
    displayTopFundedGames();  
});

document.getElementById('search-bar').addEventListener('input', function(e) {
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm) {
        const filteredGames = GAMES_JSON.filter(game => game.name.toLowerCase().includes(searchTerm));
        addGamesToPage(filteredGames);
    } else {
        showAllGames(); 
    }
});



const unfundedBtn = document.getElementById("unfunded-btn");
const fundedBtn = document.getElementById("funded-btn");
const allBtn = document.getElementById("all-btn");

unfundedBtn.addEventListener('click', function() {
    filterUnfundedOnly();
});

fundedBtn.addEventListener('click', function() {
    filterFundedOnly();
});

allBtn.addEventListener('click', function() {
    showAllGames();
});