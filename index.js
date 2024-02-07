const search = document.querySelector("input");
const select = document.getElementById("select");
const pokemonContainer = document.querySelector(".pokemon-container");
const btn = document.querySelectorAll("button");
let displayContainer = document.querySelector("#display-container");

let pokeArray = [];
let arr = [];
let typeArr = [];

async function fetchPokemon() {
  let pokemonPromiseArray = [];
  for (let i = 1; i <= 151; i++) {
    pokemonPromiseArray.push(
      fetch(`https://pokeapi.co/api/v2/pokemon/${i}`).then((results) =>
        results.json()
      )
    );
  }
  //   console.log(pokemonPromiseArray);

  // creating new Object once all the promises are resolved
  Promise.all(pokemonPromiseArray).then((res) => {
    let newPokemonArray = res.map((item) => {
      return {
        id: item.id,
        image: item.sprites.front_default,
        name: item.name,
        type: item.types[0].type.name,
        back_img: item.sprites.back_default,
        move: item.moves[0].move.name,
        height: item.height,
        weight: item.weight,
        game_index: item.game_indices[0].game_index,
        card_image: item.sprites.front_shiny,
      };
    });
    pokeArray = newPokemonArray;
    console.log(pokeArray);
    for (let i = 0; i < newPokemonArray.length; i++) {
      let pokemonCard = document.createElement("div");
      pokemonCard.innerHTML = `
            <div class="pokemon" id="${newPokemonArray[i].type}">
                <div class="image">
                    <p class="id">${newPokemonArray[i].id}</p>
                    <img src = "${newPokemonArray[i].image}"/>
                </div>
                    <p class="name">${newPokemonArray[i].name}</p>
                    <p class="type">${newPokemonArray[i].type}</p>
            </div>
        `;
      pokemonContainer.appendChild(pokemonCard);

      if (!typeArr.includes(newPokemonArray[i].type)) {
        typeArr.push(newPokemonArray[i].type);
        let option = document.createElement("option");
        option.innerHTML = `${newPokemonArray[i].type}`;
        option.value = newPokemonArray[i].type;
        select.appendChild(option);
      }
    }

    let pokemon = pokemonContainer.getElementsByClassName("pokemon");
    displayCard(pokemon);
  });
}

fetchPokemon();

function filterByName(pokeArray) {
  let searchText = search.value.toLowerCase();
  console.log(searchText);
  let filterList = pokeArray.filter((pokemon) => {
    return pokemon.name.indexOf(searchText) == -1 ? false : true;
  });
  pokemonContainer.innerHTML = "";
  for (let i = 0; i < filterList.length; i++) {
    let pokemonCard = document.createElement("div");
    pokemonCard.innerHTML = `
        <div class="pokemon" id="${filterList[i].type}">
        <div class="image">
            <p class="id">${filterList[i].id}</p>
            <img src = "${filterList[i].image}"/>
        </div>
            <p class="name">${filterList[i].name}</p>
            <p class="type">${filterList[i].type}</p>
    </div>        
        `;
    pokemonContainer.appendChild(pokemonCard);
    // searchText = "";
  }
}

function filterByType(pokeArray) {
  let selectValue = select.value;
  let filterList = pokeArray.filter((item) =>
    item.type.indexOf(selectValue) == -1 ? false : true
  );
  console.log(filterList);

  pokemonContainer.innerHTML = " ";
  for (let i = 0; i < filterList.length; i++) {
    let pokemonCard = document.createElement("div");
    pokemonCard.innerHTML = `
    <div class="pokemon" id="${filterList[i].type}">
    <div class="image">
        <p class="id">${filterList[i].id}</p>
        <img src = "${filterList[i].image}"/>
    </div>
        <p class="name">${filterList[i].name}</p>
        <p class="type">${filterList[i].type}</p>
</div>        
    `;
    pokemonContainer.appendChild(pokemonCard);
  }
}

btn[0].addEventListener("click", (e) => {
  filterByType(pokeArray);
});

btn[1].addEventListener("click", () => {
  document.location.reload();
});

search.addEventListener("input", (e) => {
  filterByName(pokeArray);
});

function displayCard(arr) {
  for (let i = 0; i < arr.length; i++) {
    // console.log(arr[i]);
    arr[i].addEventListener("click", (e) => {
      e.target.classList.add("bounceIn");
      let id = e.target.children[0].children[0].innerText;
      console.log(id);
      let data = fetch(`https://pokeapi.co/api/v2/pokemon/${id}/`)
        .then((res) => res.json())
        .then((data) => {
          let pokemonDisplay = document.createElement("div");
          displayContainer.innerHTML = "";
          pokemonDisplay.innerHTML = `
            <div class="card">
                <div class="cardInner">
                    <div class="front">
                        <img src ="${data.sprites.front_default}" alt=""/>
                    
                        <div class="moves">
                            <div class="moveLeft">
                                <p>Height : <span>${data.height} </span></p>
                                <p>Move : <span>${data.moves[0].move.name} </span></p>
                            </div>
                            <div class="moveRight">
                                <p>Weight : <span>${data.weight} </span> </p>
                                <p>game_index : <span>${data.game_indices[0].game_index} </span></p>
                            </div>
                        </div>

                    </div>
           
                    <div class="back">
                        <img src="${data.sprites.back_default}" alt="">
                        <p>Abilities : <span>${data.abilities[0].ability.name},</span> <span>${data.abilities[1].ability.name}</span></p>
                    </div>
                </div>
            </div>
          `;
          displayContainer.append(pokemonDisplay);
        });
    });
  }
}
