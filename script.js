'use strict';
const resultsNav = document.getElementById('resultsNav');
const favouritesNav = document.getElementById('favouritesNav');
const imgContainer = document.querySelector('.images-container');
const saveConfirmed = document.querySelector('.save-confirmed');
const loader = document.querySelector('.loader');

const count = 10;
const key = 'oLROb82lDk2eWFdX78fF6GZEEeFUeIQQDcaNYGc8';
//
const apiUrl = `https://api.nasa.gov/planetary/apod?api_key=${key}&count=${count}`;

let results = [];
let favorites = {};

const loadContent = function (page) {
  window.scrollTo({
    top,
    behavior: 'smooth',
  });

  if (page === 'results') {
    resultsNav.classList.remove('hidden');
    favouritesNav.classList.add('hidden');
  } else {
    resultsNav.classList.add('hidden');
    favouritesNav.classList.remove('hidden');
  }
  loader.classList.add('hidden');
};

const createDOMNode = function (page) {
  const curArr = page === 'results' ? results : Object.values(favorites);
  curArr.forEach(result => {
    const card = document.createElement('div');
    card.classList.add('card');

    //link
    const link = document.createElement('a');
    link.href = result.hdurl;
    link.title = 'View full image';
    link.target = '_blank';
    //img
    const img = document.createElement('img');
    img.classList.add('card-img-top');
    img.src = result.url;
    img.alt = 'Nasa picture of the day';
    img.loading = 'lazy';
    //card-body
    const cardBody = document.createElement('div');
    cardBody.classList.add('card-body');
    //card-title
    const cardTitle = document.createElement('h5');
    cardTitle.classList.add('card-title');
    cardTitle.textContent = result.title;
    //add to favs
    const addTofavs = document.createElement('p');
    addTofavs.classList.add('clickable');
    if (page === 'results') {
      addTofavs.textContent = 'Add to favorites';
      addTofavs.setAttribute('onclick', `saveFav('${result.url}')`);
    } else {
      addTofavs.textContent = 'Remove favorites';
      addTofavs.setAttribute('onclick', `removeFav('${result.url}')`);
    }

    //card text
    const cardText = document.createElement('p');
    cardText.classList.add('card-text');
    cardText.textContent = result.explanation;
    //card date
    const small = document.createElement('small');
    small.classList.add('text-muted');
    const strong = document.createElement('strong');
    strong.textContent = result.date;
    //copyright
    const copyright = document.createElement('span');
    const copyRightfixed =
      result.copyright === undefined ? '' : result.copyright;
    copyright.textContent = ` ${copyRightfixed}`;

    link.appendChild(img);
    small.append(strong, copyright);
    cardBody.append(cardTitle, addTofavs, cardText, small);
    card.append(link, cardBody);
    imgContainer.appendChild(card);
  });
};

const updateDOM = function (page) {
  if (localStorage.getItem('favorites')) {
    favorites = JSON.parse(localStorage.getItem('favorites'));
  }
  imgContainer.textContent = '';
  createDOMNode(page);
  loadContent(page);
};

const getNasaimages = async function () {
  loader.classList.remove('hidden');
  try {
    const req = await fetch(apiUrl);
    const res = await req.json();

    results = res;
    updateDOM('results');
  } catch (err) {
    console.log(err);
  }
};

const saveFav = function (itemUrl) {
  results.forEach(item => {
    if (item.url.includes(itemUrl) && !favorites[itemUrl]) {
      favorites[itemUrl] = item;
      saveConfirmed.hidden = false;
      setTimeout(() => {
        saveConfirmed.hidden = true;
      }, 2000);

      localStorage.setItem('favorites', JSON.stringify(favorites));
    }
  });
};

const removeFav = function (itemUrl) {
  if (favorites[itemUrl]) {
    delete favorites[itemUrl];
    localStorage.setItem('favorites', JSON.stringify(favorites));
    updateDOM('favorites');
  }
};

getNasaimages();
