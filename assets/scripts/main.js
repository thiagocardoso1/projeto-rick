const cardsHtml = document.querySelector(".cards");
const buttonUp = document.querySelector("#buttonUp");
const buttonDown = document.querySelector("#buttonDown");
const searchInput = document.getElementById("searchInput");
const searchButton = document.getElementById("searchButton");
const pageCount = document.querySelector(".pageCount");
const home = document.querySelector(".bi-house");

let currentPage = 1;
let totalPages = 0;
let nextPageUrl = "";
let backPageUrl = "";
const urlDefault = `https://rickandmortyapi.com/api/character?page=1`;

function main() {
    showCards(urlDefault);
    currentPage = 1;
}

async function getCards(url) {
    try {
        const response = await fetch(url);
        const jsonBody = await response.json();
        nextPageUrl = jsonBody.info.next;
        backPageUrl = jsonBody.info.prev;
        totalPages = jsonBody.info.pages;
        const results = await jsonBody.results;
        return results;
    } catch (error) {
        console.log(error);
    }
}

async function searchCaracter() {
    const query = searchInput.value.trim();
    if(!query) {
        alert("Por favor, digite o nome de um personagem!");
        return
    }

    try {
        const url = `https://rickandmortyapi.com/api/character/?name=${query}`
        const response = await fetch(url);
        const jsonBody = await response.json();
        nextPageUrl = jsonBody.info.next;
        backPageUrl = jsonBody.info.prev;
        totalPages = jsonBody.info.pages;

        if(jsonBody.error) {
            cardsHtml.innerHTML = `<p class="error">Nenhum personagem encontrado com o nome "${query}".</p>`;
            return;
        }

        const results = jsonBody.results;
        const newHtml = results.map((character) => {
            return `
            <div class="cards__card">
                    <h2>${character.name}</h2>
                    <img src="${character.image}" alt="${character.name}">
                    <ul class="card__details">
                        <li>species: </li>
                        <li>${character.species}</li>
                        <li>gender: </li>
                        <li>${character.gender}</li>
                        <li>origin: </li>
                        <li>${character.origin.name}</li>
                    </ul>
                </div>
            `
        }).join('');

        cardsHtml.innerHTML = newHtml;
        currentPage = 1;
        pageCount.innerHTML = `<p>${currentPage} - ${totalPages}</p>`
    } catch (error) {
        console.error(error);
        cardsHtml.innerHTML = `<p class="error">Erro ao buscar o personagem. Tente novamente!</p>`;
    }
}

async function showCards(url) {
    try {
        const cardDetails = await getCards(url);
    
        const newHtml = cardDetails.map((character) => {
            return `
                <div class="cards__card">
                    <img src="${character.image}" alt="${character.name}">
                    <ul class="card__details">
                        <li>name:</li>
                        <li>${character.name}</li>
                        <li>species: </li>
                        <li>${character.species}</li>
                        <li>gender: </li>
                        <li>${character.gender}</li>
                        <li>origin: </li>
                        <li>${character.origin.name}</li>
                    </ul>
                </div>
            `;
        }).join('');
        cardsHtml.innerHTML = "";
        cardsHtml.innerHTML += newHtml;

        pageCount.innerHTML = `<p>${currentPage} - ${totalPages}</p>`
    } catch (error) {
        console.error(error);
    }
}

buttonUp.addEventListener("click", () => {
    showCards(nextPageUrl);
    currentPage++;
})

buttonDown.addEventListener("click", () => {
    showCards(backPageUrl);
    currentPage--;
})

searchButton.addEventListener("click", searchCaracter);

searchInput.addEventListener('keydown', (event) => {
    if(event.key === "Enter") {
        searchCaracter();
    }
});

home.addEventListener("click", main);

main();