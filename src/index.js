const $app = document.getElementById('app');
const $observe = document.getElementById('observe');
const API = 'https://rickandmortyapi.com/api/character/';
// const API = 'https://us-central1-escuelajs-api.cloudfunctions.net/characters';

const getData = api => {
  fetch(api)
    .then(response => response.json())
    .then(response => {
      const characters = response.results;
      const nextPage = response.info.next;

      localStorage.setItem("next_fetch", nextPage);

        let output = characters.map(character => {
          return `
        <article class="Card">
          <img src="${character.image}" />
          <h2>${character.id} - ${character.name}<span>${character.species}</span></h2>
        </article>
      `
        }).join('');
        let newItem = document.createElement('section');
        newItem.classList.add('Items');
        newItem.innerHTML = output;
        $app.appendChild(newItem);
      
      
    })
    .catch(error => console.log(error));
}

// const loadData = () => {
//   if(localStorage.getItem("next_fetch") !== null){
//     getData(localStorage.getItem("next_fetch"));
//   }else{
//     getData(API);
//   }
// }

async function loadData(url) {
  try{
    await getData(url);
  } catch (error){
    console.log(error);
  }
}

const intersectionObserver = new IntersectionObserver(entries => {
  if (entries[0].isIntersecting) {

    if(localStorage.getItem("next_fetch") === null){
      loadData(API);
    }else if(localStorage.getItem("next_fetch") !== ""){
      loadData(localStorage.getItem("next_fetch"));
    }else{
      let newItem = document.createElement('section');
      newItem.innerHTML = `<div style="width: 100%; margin: 40px 0; text-align:center;font-size: 20px;">No Hay mas Personajes</div>`;
      $app.appendChild(newItem);
      intersectionObserver.unobserve($observe);
    }
  }
}, {
  rootMargin: '0px 0px 100% 0px',
});


intersectionObserver.observe($observe);


window.onbeforeunload = function(e) {
  localStorage.removeItem("next_fetch");
};