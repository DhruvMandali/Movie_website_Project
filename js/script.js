// console.log(window.location.pathname);
// Movie App _TMDB API


const global = {
  currentPAge: window.location.pathname,
  search: {
    term: '',
    type: '',
    page: 1,
    totalPages: 1,
  },
  api: {
    apiKey: '',
    apiUrl: 'https://api.themoviedb.org/3/',
  },
};
// console.log(currentPAge)

function init() {
  switch (global.currentPAge) {
    case '/':
    case '/new/index.html':
      // console.log('Home');
      displaySlider();
      displaypopularmovies();
      break;

    case '/new/TV-Show.html':
      displaypopularTVShow();
      displaytvSlider();
      // console.log('show');
      break;

    case '/new/movie-details.html':
      console.log('Movie-Details');
      displayShowDetails();
      break;
    case '/new/show.html':
      console.log('TV-Details');
      displaySTVShowDeatils();

      break;
    case '/new/serch.html':
          console.log('serch');
      break;

    default:
      break;
  }
}

document.addEventListener('DOMContentLoaded', init);

// api
async function fetchAPIData(endpoint) {

  const api_key = '';
  const api = 'https://api.themoviedb.org/3/';

  const response = await fetch(`${api}${endpoint}?api_key=${api_key}&language=US`);
  const data = await response.json();
  // console.log(data)
  return data;
}

async function serchfetchAPIData(endpoint) {
  const api_key = '04fcfafaa1254938955b217252214d60';
  const api = 'https://api.themoviedb.org/3/';

  const separator = endpoint.includes('?') ? '&' : '?';

  const response = await fetch(
    `${api}${endpoint}${separator}api_key=${api_key}&language=en-US`
  );

  const data = await response.json();
  return data;
}

async function displaypopularmovies() {
  const { results } = await fetchAPIData('movie/popular');

  results.forEach((movie) => {
    // console.log(movie);

    const div = document.createElement('div');
    div.classList.add('card');

    div.innerHTML = `<a href="movie-details.html?${movie.id}">
          <img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />
          </a>
          <div class="card-body">
            <h5 class="card-title" style="color:white">${movie.title}</h5>
            <p class="card-text">
              <small class="" style="color:white">Release: ${movie.release_date}</small>
            </p>
          </div>
        `;

    document.querySelector('#popular-movies').appendChild(div);
  });

}

// tv-details.html work in
// show tvShow
async function displaypopularTVShow() {
  const { results } = await fetchAPIData('tv/popular');

  results.forEach((show) => {
    // console.log(show);
    // const Date  = show.first_air_date.getDate()}/${Date.getMonth() + 1}/${Date.getFullYear();
    // ${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}
    
    const div = document.createElement('div');
    div.classList.add('card');

    div.innerHTML = `<a href="show.html?${show.id}">
          <img
              src="https://image.tmdb.org/t/p/w500${show.poster_path}"
              class="card-img-top"
              alt="${show.name}"
            />
          </a>
          <div class="card-body">
            <h5 class="card-title" style="color:white">${show.name}</h5>
            <p class="card-text">
              <small class="" style="color:white">Release: ${show.first_air_date}</small>
            </p>
          </div>
        `;

    document.querySelector('#popular-movies').appendChild(div);
  });

}

// movie-detials page work in

async function displayShowDetails() {
  const showId = window.location.search.split('=')[0].substring(1);
  // const path_homepage = window.location.pathname;
  // console.log(path_homepage)

  const show = await fetchAPIData(`movie/${showId}`);
  console.log(show);

  const div = document.createElement('div');
  div.innerHTML = `
    <div class="details-top d-flex ">
          <div>
            <img
              src="https://image.tmdb.org/t/p/w200${show.poster_path}"
              class="card-img-top"
              style="width: 300px;height =50px"
              alt="${show.original_title}"
            />
          </div>
          <br>
          <div style="margin:50px;">
            <h2>${show.original_title}</h2>
            <p>
              <i class="fas fa-star text-primary"></i>⭐
             ${show.vote_average.toFixed()}/10
            </p>
            <p class="text">Release Date: ${show.release_date}</p>
            <p>
             ${show.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group" style="margin-left:30px">
            ${show.genres.map((genres) => `<li>${genres.name}</li>`).join('')}
            </ul>
            <div class="back" style="width: fit-content;margin: 20px 0px;background-color: yellow;color: black;border: 1px solid yellow;border-radius: 7px;">
                <a href="/new/index.html" target="_blank" class="btn" style="font-weight: bolder;">Visit Show Homepage</a>
                </div>
          <h2>Show Info</h2>
          <ul style="line-height:34px">
          <li><span class="fw-bold">Name :</span>   ${show.original_title}</li>
            <li>
              <span class="fw-bold">Spoken Languages:-</span> ${show.spoken_languages.map((lan) => `${lan.name}`)}
            </li>
            <li><span class="fw-bold">Status:</span> ${show.status}</li>
            <li><span class="fw-bold">TagLine :</span> ${show.tagline}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group" style="margin-left:30px" ><li>${show.production_companies.map((compane) => `${compane.name}`).join(`<li> `)}</li></div>
         </div>
         </div>`;

         document.querySelector('#show-details').appendChild(div);
}

//TV-detilas - show

async function displaySTVShowDeatils() {
  const showId = window.location.search.split('=')[0].substring(1);
  // console.log(showId);
  // const path_homepage = window.location.pathname;
  // console.log(path_homepage)
  const show = await fetchAPIData(`tv/${showId}`);
  console.log(show)
  const div = document.createElement('div');
  div.innerHTML = `<div class="details-top d-flex">
          <div>
            <img
              src="https://image.tmdb.org/t/p/w200${show.poster_path}"
              class="card-img-top"
              style="width: 300px;"
              alt="${show.original_name}"
            />
          </div>
          <br>
          <div style="margin:50px;">
          <h2 style=""><b> ${show.original_name}</b> </h2>
            <p>
              <i class="fas fa-star text-primary"></i>⭐
              ${show.vote_average.toFixed()} / 10
            </p>
            <p class="text">Release Date: ${show.first_air_date}</p>
            <p>
             ${show.overview}
            </p>
            <h5>Genres</h5>
            <ul class="list-group" style="margin-left:30px">
            ${show.genres.map((genres) => `<li>${genres.name}</li>`).join('')}
            </ul>
           <div class="back" style="width: fit-content; margin: 20px 0px;background-color: yellow;border: 1px solid yellow;border-radius: 7px;">
                <a href="/new/TV-Show.html" target="_blank" class="btn" style="font-weight: bolder;color: black;text-decoration: none">Visit Show Homepage</a>
            </div>
          <h2>Show Info</h2>
          <ul style="line-height:34px">
            <li><span class="fw-bold">Name :</span>   ${show.original_name}</li>
            <li><span class="fw-bold">Number Of Episodes :</span>   ${show.number_of_episodes}</li>
            <li><span class="fw-bold">Number Of Seasons :</span>   ${show.number_of_seasons}</li>
            <li>
            <span class="fw-bold">Spoken Languages  :</span> ${show.spoken_languages.map((lan) => `${lan.name}`)}
            </li>
            <li><span class="fw-bold">Created By  :</span> ${show.created_by.map((create) => `${create.name}`)}</li>
            <li><span class="fw-bold">Status  :</span> ${show.status}</li>
          </ul>
          <h4>Production Companies</h4>
          <div class="list-group" style="margin-left:30px"><li> ${show.production_companies.map((compane) => `${compane.name}`).join(`<li> `)}</li></div>
         </div>
      </div>`;
  document.querySelector('#show-details').appendChild(div);
}


function initSwiper() {
  const swiper = new Swiper('.swiper', {
    slidesPerView: 1,
    spaceBetween: 30,
    freeMode: true,
    loop: true,
    autoplay: {
      delay: 4000,
      disableOnInteraction: false,
    },
    breakpoints: {
      500: {
        slidesPerView: 2,
      },
      700: {
        slidesPerView: 3,
      },
      1200: {
        slidesPerView: 4,
      },
    },
  });
}

// Display Slider Movies
async function displaySlider() {
  const { results } = await fetchAPIData('movie/now_playing');

  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');

      let swiper = document.querySelector('.swiper-wrapper')
    div.innerHTML = `<a href="movie-details.html?${movie.id}">
          <img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.name}"
            />
          </a>
          <div class="card-body">
           <h4 class="swiper-rating">⭐ 
         ${movie.vote_average.toFixed()}/10
        </h4>
          </div>`;

    swiper.appendChild(div);
    initSwiper();
  });
}

// search ()
// SEARCH MOVIE
async function search() {
  console.log('hello');
  const query = document.getElementById('search-input').value;

  if (query === '') {
    alert('Please enter movie name');
    return;
  }
  const { results } = await serchfetchAPIData(`search/movie?query=${query}`);

  const container = document.querySelector('#popular-movies');
  container.innerHTML = ''; // old data clear

  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('card');

    div.innerHTML = `
     <a href="movie-details.html?${movie.id}">
          <img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.title}"
            />
          </a>
          <div class="card-body">
            <h5 class="card-title" style="color:white">${movie.title}</h5>
            <p class="card-text">
              <small class="" style="color:white">Release: ${movie.release_date}</small>
            </p>
          </div>
    `;

    container.appendChild(div);
  });
}

// display TV slider

async function displaytvSlider() {
  const { results } = await fetchAPIData('tv/popular');

  results.forEach((movie) => {
    const div = document.createElement('div');
    div.classList.add('swiper-slide');

    div.innerHTML = `<a href="show.html?${movie.id}">
          <img
              src="https://image.tmdb.org/t/p/w500${movie.poster_path}"
              class="card-img-top"
              alt="${movie.name}"
            />
          </a>
          <div class="card-body">
           <h4 class="swiper-rating">⭐
         ${movie.vote_average.toFixed()}/10
        </h4>
          </div>`;

      // document.querySelector('.swiper-wrapper').appendChild(div);
      let swiper = document.querySelector('#swiper');
     swiper.appendChild(div);
    });
    initSwiper();
  }

  // console.log(swiper);
