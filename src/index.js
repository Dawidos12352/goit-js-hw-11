import Notiflix from 'notiflix';
import axios from 'axios';
import debounce from 'lodash.debounce';
import simpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';


const form = document.querySelector(".search__form");
const input = document.querySelector(".search__input");
const inputButton = document.querySelector(".search__button");

const gallery = document.querySelector(".gallery");
const loadMoreButton = document.querySelector(".load__more");


const API = '35988919-7ec9329d85026b7b4e8ec28c4';
const imageType = 'photo';
const orientation = 'horizontal';
const safeSearch = true;

const perPage = 40;
let page = 1;

loadMoreButton.setAttribute("hidden", true);

const lightbox = new simpleLightbox('.gallery a');

const fetchImages = async (input, pageNumber) => {
  const URL = `https://pixabay.com/api/?key=${API}&q=${input}&image_type=${imageType}&orientation=${orientation}&safesearch=${safeSearch}&page=${pageNumber}&per_page=${perPage}`;

  const response = await fetch(`${URL}`);
  const responseObject = await response.json();

  loadMoreButton.removeAttribute("hidden");
  return responseObject;
};


const renderImages = images => {
  const markup = images
    .map(image => `
      <div class="photo__card">
        <a href='${image.largeImageURL}'>
          <img src="${image.webformatURL}" alt="${image.tags}" loading="lazy" />
        </a>
        <div class="info">
          <p class="info__item">
            <b>Likes</b> ${image.likes}
          </p>
          <p class="info__item">
            <b>Views</b> ${image.views}
          </p>
          <p class="info__item">
            <b>Comments</b> ${image.comments}
          </p>
          <p class="info__item">
            <b>Downloads</b> ${image.downloads}
          </p>
        </div>
      </div>`
    )
    .join('');

  if (page === 1) {
    gallery.innerHTML = markup;
  } else {
    gallery.insertAdjacentHTML('beforeend', markup);
  }
  return page++;
};


inputButton.addEventListener('click', async event => {
  event.preventDefault();

  page = 1;
  const inputValue = input.value.trim();

  localStorage.setItem('inputValue', `${inputValue}`); 

  try {
    const array = await fetchImages(inputValue, page);
    const arrayImages = [];

    array.hits.forEach(async image => {
      arrayImages.push(image);
    });

    const total = await array.totalHits;

    if (total > 0) {
      Notiflix.Notify.success(`Hooray! We found ${total} images.`);
    }

    if (total === 0) {
      throw new Error();
    }
    renderImages(arrayImages);
    lightbox.refresh();
  } catch (error) {
    gallery.innerHTML = '';
    Notiflix.Notify.failure(
      'Sorry, there are no images matching your search query. Please try again.'
    );
  }
});



loadMoreButton.addEventListener('click', async () => {
  const inputValue = input.value.trim();
  try {
    const array = await fetchImages(inputValue, page);
    const arrayImages = [];

    array.hits.forEach(async image => {
      arrayImages.push(image);
    });
    renderImages(arrayImages);
    lightbox.refresh();
  } catch (error) {
    console.log(error.message);
  }
});







