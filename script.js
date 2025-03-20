document.addEventListener("DOMContentLoaded", () => {
    const pokeContainer = document.getElementById("poke-container");
    const pokemonPopup = document.getElementById("pokemon-popup");
    const closePopup = document.getElementById("close-popup");
    const aldeaSelect = document.getElementById("aldea");
    const volverButton = document.getElementById("volver-button");
    const noResultsDiv = document.getElementById("no-results");
    const statNames = {
      "hp": "PS",
      "attack": "Ataque",
      "defense": "Defensa",
      "special-attack": "Ataque Especial",
      "special-defense": "Defensa Especial",
      "speed": "Velocidad"
    };
    const aldeaRanges = {
      all: [1, 898],
      kanto: [1, 151],
      johto: [152, 251],
      hoenn: [252, 386],
      sinnoh: [387, 493],
      unova: [494, 649],
      kalos: [650, 721],
      alola: [722, 809],
      galar: [810, 898]
    };
    const fetchAldeaPokemons = async (aldea) => {
      pokeContainer.innerHTML = "";
      noResultsDiv.classList.add("hidden");
      const [start, end] = aldeaRanges[aldea];
      for (let i = start; i <= end; i++) {
        await getPokemon(i);
      }
    };
    const getPokemon = async (id) => {
      try {
        const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
        const res = await fetch(url);
        const data = await res.json();
        createPokemonCard(data);
      } catch (error) {
        console.log("Error fetching Pokémon:", error);
      }
    };
    const createPokemonCard = (pokemon) => {
      const pokemonEl = document.createElement("div");
      pokemonEl.classList.add("card");
      pokemonEl.addEventListener("click", () => showPokemonDetails(pokemon));
      const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
      const id = pokemon.id.toString().padStart(3, "0");
      pokemonEl.innerHTML = `
        <img src="${pokemon.sprites.front_default}" alt="${name}">
        <h3>${name}</h3>
        <p>#${id}</p>
      `;
      pokeContainer.appendChild(pokemonEl);
    };
    const showPokemonDetails = (pokemon) => {
      const pokemonDetails = document.getElementById("pokemon-details");
      pokemonPopup.classList.remove("hidden");
      const name = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
      const statsHTML = pokemon.stats.map((stat) => {
        const label = statNames[stat.stat.name] || stat.stat.name;
        return `<p>${label}: ${stat.base_stat}</p>`;
      }).join("");
      pokemonDetails.innerHTML = `
        <h2>${name}</h2>
        <img src="${pokemon.sprites.front_default}" alt="${name}" />
        <p>ID: #${pokemon.id}</p>
        <p>Tipo: ${pokemon.types.map((t) => t.type.name).join(", ")}</p>
        <p>Peso: ${pokemon.weight / 10} kg</p>
        <p>Altura: ${pokemon.height / 10} m</p>
        <h3>Estadísticas</h3>
        ${statsHTML}
      `;
    };
    closePopup.addEventListener("click", () => {
      pokemonPopup.classList.add("hidden");
    });
    window.addEventListener("click", (e) => {
      if (e.target === pokemonPopup) {
        pokemonPopup.classList.add("hidden");
      }
    });
    aldeaSelect.addEventListener("change", () => {
      const selected = aldeaSelect.value;
      fetchAldeaPokemons(selected);
      if (selected !== "all") {
        volverButton.style.display = "inline-block";
      } else {
        volverButton.style.display = "none";
      }
    });
    volverButton.addEventListener("click", () => {
      aldeaSelect.value = "all";
      volverButton.style.display = "none";
      fetchAldeaPokemons("all");
    });
    window.searchPokemon = function() {
      let input = document.getElementById("searchbar").value.toLowerCase().trim();
      let cards = document.getElementsByClassName("card");
      let foundAny = false;
      for (let i = 0; i < cards.length; i++) {
        const name = cards[i].querySelector("h3").innerText.toLowerCase();
        const number = cards[i].querySelector("p").innerText.toLowerCase();
        if (name.includes(input) || number.includes(input)) {
          cards[i].style.display = "block";
          foundAny = true;
        } else {
          cards[i].style.display = "none";
        }
      }
      if (!foundAny && input !== "") {
        noResultsDiv.classList.remove("hidden");
      } else {
        noResultsDiv.classList.add("hidden");
      }
    };
    fetchAldeaPokemons("all");
  });