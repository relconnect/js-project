import { fetchImages } from '../services/api';
import * as storage from '../services/storage';
import gridItemTpl from '../templates/grid-item.hbs';
import favoritesImgTpl from '../templates/favorites-img.hbs';
import '../scss/styles.scss';

const main = document.querySelector('.main');
const grid = document.querySelector('.js-main-wrapper');
const form = document.querySelector('.form');
const input = document.querySelector('.js-input');
const spinner = document.querySelector('.spinner-overlay');
const loadMoreBtn = document.querySelector('.js-load-more');
const modal = document.querySelector('.modal');
const btnFavorite = document.querySelector('.js-link');
const closeBtn = document.querySelector('.button-close');
const prewImg = document.querySelector('.button-left');
const nextImg = document.querySelector('.button-right');
const favorit = document.querySelector('.button-favorit');
const favoriteCollections = [];
let currentPage = 1;
let currentQuery = '';

btnFavorite.addEventListener('click', onFavClick);
grid.addEventListener('click', onImgClick);
form.addEventListener('submit', handleFormSubmit);
loadMoreBtn.addEventListener('click', handleLoadMoreClick);

nextImg.addEventListener('click', showNextImg);
prewImg.addEventListener('click', showPrew);
closeBtn.addEventListener('click', closeModal);
favorit.addEventListener('click', addToFavorit);

// Helpers

/**
 *
 *
 * @param {*} photos array of objects with img data
 * @param {*} cb hbs tamplate callback function
 */
function hydratePhotosGrid(photos, cb) {
  const markup = createGridItems(photos, cb);
  updatePhotosGrid(markup);
}

/**
 *
 *
 * @param {*} items array of objects with img data
 * @param {*} cb hbs tamplate callback function
 * @returns markup ready to render
 */
function createGridItems(items, cb) {
  return items.reduce((markup, item) => markup + cb(item), '');
}

function updatePhotosGrid(markup) {
  grid.insertAdjacentHTML('beforeend', markup);
}

function handleLoadMoreClick() {
  incrementCurrentPage();

  handleFetch({
    query: currentQuery,
    count: 12,
    page: currentPage
  });
}

function toggleSpinner() {
  return spinner.classList.toggle('visible');
}

function showLoadMoreBtn() {
  if (loadMoreBtn.style.display !== 'block') {
    loadMoreBtn.style.display = 'block';
  }
}

function hideLoadMoreBtn() {
  if (loadMoreBtn.style.display !== 'none') {
    loadMoreBtn.style.display = 'none';
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
  fetchImages(params).then(photos => {
    // fetchedPhotos.push(...photos);
    // storage.set(fetchedPhotos);
    const markup = createGridItems(photos, gridItemTpl);
    updatePhotosGrid(markup);
    toggleSpinner();
    scrollToBottom();
  });
}

/**
 *
 *
 * @param {*} element type of creating document
 * @param {*} text text inside element(optional)
 * @param {*} classAdd element class
 * @returns new element
 */
function createElement(element, text, classAdd, parentNode) {
  const domNode = document.querySelector('.favorite-text');

  if (typeof domNode !== 'undefined' && domNode !== null) return;
  const elem = document.createElement(element);
  const elemText = document.createTextNode(text);

  elem.classList.add(classAdd);
  elem.appendChild(elemText);
  parentNode.insertAdjacentElement('afterbegin', elem);
}

function createFavoritesGallery() {
  const favoritesPhotos = storage.get();

  createElement('p', 'Избранное', 'favorite-text', main);

  if (favoritesPhotos) {
    hydratePhotosGrid(favoritesPhotos, favoritesImgTpl);
  }
}

/**
 *Remove "Избранное" from the page
 *
 */
function removeFavNode() {
  const favNode = document.querySelector('.favorite-text');
  if (typeof favNode !== 'undefined' && favNode !== null) {
    main.removeChild(favNode);
  }
}

function handleFormSubmit(e) {
  e.preventDefault();

  removeFavNode();
  resetCurrentPage();
  resetPhotosGrid();

  currentQuery = input.value;

  handleFetch({
    query: currentQuery,
    count: 12,
    page: currentPage
  });

  e.target.reset();
  showLoadMoreBtn();
}

function onImgClick({ target }) {
  const nodeName = target.nodeName;
  if (nodeName !== 'IMG') return;

  modal.style.display = 'block';

  const modalImg = document.querySelector('.js-modal-img');
  modalImg.setAttribute('src', target.dataset.fullview);
  modalImg.dataset.cardId = target.parentNode.dataset.id;
}

function onFavClick(e) {
  e.preventDefault();
  toggleSpinner();
  hideLoadMoreBtn();
  resetCurrentPage();
  resetPhotosGrid();
  createFavoritesGallery();

  toggleSpinner();
}

//functions for modal window (New line)

function closeModal() {
  modal.style.display = 'none';
}

function showNextImg() {
  const modalImg = document.querySelector('.js-modal-img');
  const fullImgId = modalImg.dataset.cardId;
  const currentImg = document.querySelector(`[data-id="${fullImgId}"]`);
  const nextTarget = currentImg.nextSibling;
  const src = nextTarget.querySelector('.card__img');
  const id = nextTarget.getAttribute('data-id');
  modalImg.setAttribute('src', src.getAttribute('data-fullview'));
  modalImg.dataset.cardId = id;
}
function showPrew() {
  const modalImg = document.querySelector('.js-modal-img');
  const fullImgId = modalImg.dataset.cardId;
  const currentImg = document.querySelector(`[data-id="${fullImgId}"]`);
  const prevTarget = currentImg.previousSibling;
  const src = prevTarget.querySelector('.card__img');
  const id = prevTarget.getAttribute('data-id');
  modalImg.setAttribute('src', src.getAttribute('data-fullview'));
  modalImg.dataset.cardId = id;
}

function addToFavorit() {
  const item = {};
  const modalImg = document.querySelector('.js-modal-img');
  const fullImgId = modalImg.dataset.cardId;
  const currentImg = document.querySelector(`[data-id="${fullImgId}"]`);

  item.id = currentImg.getAttribute('data-id');
  item.previewURL = currentImg.querySelector('.card__img').getAttribute('src');
  item.largeImageURL = currentImg
    .querySelector('.card__img')
    .getAttribute('data-fullview');
  favoriteCollections.push(item);
  storage.set(favoriteCollections);
}
