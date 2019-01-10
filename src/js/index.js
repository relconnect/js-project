import { fetchImages } from '../services/api';
import * as storage from '../services/storage';
import gridItemTpl from '../templates/grid-item.hbs';
//import 'normalize.css';
import '../scss/styles.scss';

console.log(gridItemTpl);

const grid = document.querySelector('.js-grid');
const form = document.querySelector('.form');
const input = document.querySelector('.js-input');
const spinner = document.querySelector('.spinner-overlay');
const loadMoreBtn = document.querySelector('.js-load-more');
let currentPage = 1;
let currentQuery = '';
const persistedPhotos = storage.get();
const fetchedPhotos = [];

if (persistedPhotos) {
  hydratePhotosGrid(persistedPhotos);
}

form.addEventListener('submit', handleFormSubmit);
loadMoreBtn.addEventListener('click', handleLoadMoreClick);

// ============= Helpers

function hydratePhotosGrid(photos) {
  const markup = createGridItems(photos);
  updatePhotosGrid(markup);
}

function createGridItems(items) {
  return items.reduce((markup, item) => markup + gridItemTpl(item), '');
}

function updatePhotosGrid(markup) {
  grid.insertAdjacentHTML('beforeend', markup);
}

function handleLoadMoreClick() {
  incrementCurrentPage();

  handleFetch({
    query: currentQuery,
    count: 8,
    page: currentPage,
  });
}

function toggleSpinner() {
  return spinner.classList.toggle('visible');
}

function showLoadMoreBtn() {
  if (loadMoreBtn.style.display !== "block") {
    loadMoreBtn.style.display = "block";
  }
}

function resetCurrentPage() {
  currentPage = 1;
}

function incrementCurrentPage() {
  currentPage += 1;
}

function scrollToBottom() {
  scrollTo(0, document.body.scrollHeight);
}

function resetPhotosGrid() {
  grid.innerHTML = '';
}

function handleFetch(params) {
  toggleSpinner();

  fetchImages(params).then((photos) => {
    fetchedPhotos.push(...photos);
    storage.set(fetchedPhotos);

    const markup = createGridItems(photos);
    updatePhotosGrid(markup);
    toggleSpinner();
    scrollToBottom();
  });
}

function handleFormSubmit(e) {
  e.preventDefault();

  resetCurrentPage();
  resetPhotosGrid();

  currentQuery = input.value;

  handleFetch({
    query: currentQuery,
    count: 12,
    page: currentPage,
  });

  e.target.reset();
  showLoadMoreBtn();
}
