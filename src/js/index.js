import { fetchImages } from '../services/api';
import * as storage from '../services/storage';
import gridItemTpl from '../templates/grid-item.hbs';
import '../scss/styles.scss';
// const shortid = require('shortid');
// const hbs = require('handlebars/runtime');
// let id = 0;
// hbs.registerHelper("setId", function(){
//   id+=1;
//   return id;
// });

const grid = document.querySelector('.js-main-wrapper');
const form = document.querySelector('.form');
const input = document.querySelector('.js-input');
const spinner = document.querySelector('.spinner-overlay');
const loadMoreBtn = document.querySelector('.js-load-more');
const modal = document.querySelector('.modal');
let currentPage = 1;
let currentQuery = '';
const persistedPhotos = storage.get();
const fetchedPhotos = [];
const favoritePhotos = [];
const closeBtn = document.querySelector('.button-close');
const prewImg = document.querySelector('.button-left');
const nextImg = document.querySelector('.button-right');


console.log(modal);

// if (persistedPhotos) {
//   hydratePhotosGrid(persistedPhotos);
// }

closeBtn.addEventListener('click', closeModal);
grid.addEventListener('click', onImgClick);
form.addEventListener('submit', handleFormSubmit);
loadMoreBtn.addEventListener('click', handleLoadMoreClick);
nextImg.addEventListener('click', showNextImg);
prewImg.addEventListener('click', showPrew);

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
    count: 12,
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
    
    // photos.forEach((elem) =>{
    //   imgPagination += 1; 
    //  elem.imgId = imgPagination;
           
    // });
    // console.log(photos);
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

function onImgClick({target}) {
  
  const nodeName = target.nodeName;
  if(nodeName !== 'IMG') return;
  modal.style.display = "block";  
  const modalImg = document.querySelector('.js-modal-img');
  modalImg.setAttribute('src', target.dataset.fullview); 
  modalImg.dataset.cardId =target.parentNode.dataset.id;
}

//functions for modal window

function closeModal () {
  modal.style.display = "none";
}

function showNextImg(){
  const modalImg = document.querySelector('.js-modal-img');  
  const fullImgId = modalImg.dataset.cardId;
  const currentImg = document.querySelector(`[data-id="${fullImgId}"]`);
  const nextTarget = currentImg.nextSibling;
  const src = nextTarget.querySelector('.card__img');
  const id =  nextTarget.getAttribute('data-id');
  modalImg.setAttribute('src',src.getAttribute('data-fullview')); 
  modalImg.dataset.cardId = id;
}
function showPrew(){
  const modalImg = document.querySelector('.js-modal-img');  
  const fullImgId = modalImg.dataset.cardId;
  const currentImg = document.querySelector(`[data-id="${fullImgId}"]`);
  const prevTarget = currentImg.previousSibling;
  const src = prevTarget.querySelector('.card__img');
  const id =  prevTarget.getAttribute('data-id');
  modalImg.setAttribute('src',src.getAttribute('data-fullview')); 
  modalImg.dataset.cardId = id;
}

function addToFavorit(){

}


