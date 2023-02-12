import './css/styles.css';
import API from './fetchCountries.js';
import Notiflix from 'notiflix';

const DEBOUNCE_DELAY = 300;
const debounce = require('lodash.debounce');
const countryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');
const form = document.getElementById('search-box');

form.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  e.preventDefault();
  let inputValue = e.target.value.trim();

  cleanerMarkup(countryList);
  cleanerMarkup(countryInfo);

  if (inputValue === '') {
    return;
  }

  API.fetchCountries(inputValue)
    .then(data => {
      const markupForMoreThenTwo = createMarkupForMoreThenTwo(data);
      const markupForOne = createMarkup(data);

      console.log(data);

      if (data.length > 10) {
        Notiflix.Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
      } else if (data.length >= 2 && data.length < 10) {
        addMarkup(countryList, markupForMoreThenTwo);
      } else addMarkup(countryInfo, markupForOne);
    })
    .catch(error =>
      Notiflix.Notify.failure('Oops, there is no country with that name')
    );
}

function createMarkup(data) {
  return data
    .map(({ name, capital, population, flags, languages }) => {
      return `
            <div class="countrie">
            <h2 class="countrie-card-titel"> <img src="${
              flags.svg
            }" alt="" width="70" height="50"> ${name.official}</h2>
            <p>Capital: ${capital}</p>
            <p>Population: ${population}</p>
            <p>Languages: ${Object.values(languages)}</p>
            </div>
            `;
    })
    .join('');
}

function createMarkupForMoreThenTwo(data) {
  return data
    .map(({ name, flags }) => {
      return `
            <div class="countrie-card">
            <img src="${flags.svg}" alt="" width="50" height="30"> <p>${name.official}</p>
            </div>
            `;
    })
    .join('');
}

function addMarkup(element, constMarkup) {
  element.insertAdjacentHTML('beforeend', constMarkup);
}

function cleanerMarkup(element) {
  return (element.innerHTML = '');
}
