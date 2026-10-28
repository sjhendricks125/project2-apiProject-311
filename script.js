const API_URL = "https://pokeapi.co/api/v2/pokemon/";
const fetchButton = document.getElementById("fetch-button");
const searchButton = document.getElementById("search-button");
const container = document.getElementById("user-container");
const searchBox = document.getElementById("pokemon-name");

const showMessage = (text) => {
    const heading = document.createElement("h2");
    heading.textContent = text;
    container.innerHTML = "";
    container.appendChild(heading);
};

const renderPokemonCard = (pokemon) => {
    const card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
        <h3>${pokemon.name}</h3>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p>Pokedex ID: ${pokemon.id}</p>
    `;
    container.appendChild(card);
};

const searchPokemon = async (query) => {
    showMessage("Searching for Pokémon");
    try {
        const response = await fetch(API_URL + encodeURIComponent(query.toLowerCase()));

        if (!response.ok) {
            showMessage(`No Pokémon found for "${query}".`);
            return;
        }

        const pokemon = await response.json();
        container.innerHTML = "";
        renderPokemonCard(pokemon);
    } catch (error) {
        console.error("An error occurred:", error);
        showMessage("An error occurred while searching.");
    }
};

const fetchData = async () => {
    showMessage("Fetching 20 Random Pokémon");
    try {
        const randomIds = new Set();
        while (randomIds.size < 20) {
            const randomId = Math.floor(Math.random() * 1025) + 1;
            randomIds.add(randomId);
        }

        const promises = Array.from(randomIds).map(async (id) => {
            const response = await fetch(API_URL + id);
            return response.json();
        });
        const pokemonList = await Promise.all(promises);

        container.innerHTML = "";
        pokemonList.forEach((pokemon) => {
            renderPokemonCard(pokemon);
        });
    } catch (error) {
        console.error("An error occurred:", error);
        showMessage("An error occurred while fetching Pokémon.");
    }
};

searchButton.addEventListener("click", (e) => {
    e.preventDefault();
    const searchInput = searchBox.value.trim();
    if (!searchInput) {
        showMessage("Please enter a Pokémon name or ID.");
        return;
    }
    searchPokemon(searchInput);
});

fetchButton.addEventListener("click", fetchData);