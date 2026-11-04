const API_URL = "https://api.tenrai.org/v1";

const animeContainer = document.getElementById("animeContainer");

const searchInput = document.getElementById("searchInput");

const category = document.getElementById("category");

const searchBtn = document.getElementById("searchBtn");

const message = document.getElementById("message");

const prevBtn = document.getElementById("prevBtn");

const nextBtn = document.getElementById("nextBtn");

const pageNumber = document.getElementById("pageNumber");

let currentPage = 1;

let hasNextPage = false;


// Fetch Anime Data

async function getAnime() {

    const searchText = searchInput.value.trim();

    const selectedCategory = category.value;

    let endpoint;

    if (searchText !== "") {

        endpoint = new URL(API_URL + "/anime");

        endpoint.searchParams.set("q", searchText);

    } else {

        endpoint = new URL(API_URL + "/top/anime");

    }

    endpoint.searchParams.set("page", currentPage);

    endpoint.searchParams.set("limit", 12);

    endpoint.searchParams.set("sfw", "true");

    if (selectedCategory !== "") {

        endpoint.searchParams.set("type", selectedCategory);

    }

    animeContainer.innerHTML = "";

    message.innerHTML = "Loading anime... Please wait!";

    try {

        const response = await fetch(endpoint);

        if (!response.ok) {

            throw new Error("API Error: " + response.status);

        }

        const result = await response.json();

        const animeList = result.data;

        hasNextPage = result.pagination?.has_next_page || false;

        pageNumber.innerText = "Page " + currentPage;

        if (!animeList || animeList.length === 0) {

            message.innerHTML = "No Anime Found! Try Another Search.";

            return;

        }

        message.innerHTML = "";

        displayAnime(animeList);

        prevBtn.disabled = currentPage === 1;

        nextBtn.disabled = !hasNextPage;

    }

    catch (error) {

        console.log(error);

        message.innerHTML =
            "Something went wrong! Please try again later.";

    }

}


// Display Anime Cards

function displayAnime(animeList) {

    animeContainer.innerHTML = "";

    animeList.forEach(anime => {

        const card = document.createElement("div");

        card.className = "anime-card";

        const image =
            anime.images?.jpg?.image_url ||
            anime.images?.webp?.image_url ||
            "https://placehold.co/300x400?text=No+Image";

        const title =
            anime.title_english ||
            anime.title ||
            "Unknown Anime";

        const score = anime.score || "Not Available";

        const episodes = anime.episodes || "Unknown";

        const type = anime.type || "Anime";

        const year =
            anime.year ||
            anime.aired?.prop?.from?.year ||
            "Unknown";

        const description =
            anime.synopsis
                ? anime.synopsis.substring(0, 100) + "..."
                : "No description available.";

        card.innerHTML = `

            <img src="${image}" alt="${title}">

            <div class="anime-info">

                <h3>${title}</h3>

                <p><b>Type:</b> ${type}</p>

                <p><b>Rating:</b> ⭐ ${score}</p>

                <p><b>Episodes:</b> ${episodes}</p>

                <p><b>Year:</b> ${year}</p>

                <p>${description}</p>

                <a href="${anime.url}" target="_blank">
                    View Details
                </a>

            </div>

        `;

        animeContainer.appendChild(card);

    });

}


// Search Button

searchBtn.addEventListener("click", function() {

    currentPage = 1;

    getAnime();

});


// Enter Key Search

searchInput.addEventListener("keypress", function(event) {

    if (event.key === "Enter") {

        currentPage = 1;

        getAnime();

    }

});


// Category Filter

category.addEventListener("change", function() {

    currentPage = 1;

    getAnime();

});


// Previous Page

prevBtn.addEventListener("click", function() {

    if (currentPage > 1) {

        currentPage--;

        getAnime();

    }

});


// Next Page

nextBtn.addEventListener("click", function() {

    if (hasNextPage) {

        currentPage++;

        getAnime();

    }

});


// Load Anime When Website Opens

getAnime();