const HOST = 'https://api.giphy.com';
const PATH = '/v1/gifs/trending';
const LIMIT = 25;
const RATING = 'G';
// NOTE: In production I would most likely do this fetch from giphy server side
// as not to expose key, but since there is no server: this is here :(
const KEY = '5c843f0756d044b495770177c4f3fcf0';


async function fetchTrending() {
  const url = `${HOST}${PATH}?api_key=${KEY}&limit=${LIMIT}&rating=${RATING}`;
  const json = await fetch(url).then(res => res.json());
  return json.data;
}

function renderFeatured(gifData, index) {
  const { images, slug } = gifData;
  const url = images.original.url;

  const gif = new Image();
  gif.className = 'featured';
  gif.dataset.index = index;
  gif.src = url;
  gif.alt = slug;

  // no tags in GIPHY response.
  const pTag = document.createElement('p');
  pTag.className = 'tags';
  pTag.textContent = '#placeholder #more';

  const photoOverlay = document.createElement('div');
  photoOverlay.className = 'photo-overlay';
  photoOverlay.appendChild(pTag);

  const featureContainer = document.querySelector('.feature-container');
  featureContainer.innerHTML = '';
  featureContainer.appendChild(gif);
  featureContainer.appendChild(photoOverlay);
}


function openLightbox(e, allData) {
  const overlay = document.querySelector('.overlay');
  overlay.style.display = 'flex';

  const clickedElement = e.target;
  const index = clickedElement.dataset.index;

  const gifData = allData[index];
  renderFeatured(gifData, index);
}

// overlay tags
// documentation
// review instructions

function closeLightbox(e) {
  e.preventDefault();
  const overlay = document.querySelector('.overlay');
  overlay.style.display = 'none';
}


function handleArrowClick(e, direction, allData) {
  const featured = document.querySelector('.featured');
  const index = +featured.dataset.index;

  let newIndex = direction === 'left' ? index - 1 : index + 1;
  if (newIndex < 0) {
    newIndex = 24;
  }

  const newGifData = allData[newIndex % 25];
  renderFeatured(newGifData, newIndex);
}


function createThumbnailElement(gifData, index) {
  const { images, slug } = gifData;
  const url = images.fixed_width.url;

  const container = document.createElement('a');
  container.className = 'thumbnail-container';

  const gif = new Image(200, 200);
  gif.className = 'thumbnail';
  gif.dataset.index = index;
  gif.src = url;
  gif.alt = slug;

  container.appendChild(gif);
  return container;
}


function renderThumbnails(allData) {
  const thumbnailElements = allData.map(createThumbnailElement);

  const gallery = document.querySelector('.gallery');
  gallery.innerHTML = '';

  thumbnailElements.forEach(thumbnail => gallery.appendChild(thumbnail));
}


async function main() {
  debugger
  const allData = await fetchTrending();
  renderThumbnails(allData);

  const images = document.querySelectorAll('.thumbnail');

  // add event listeners that need ref to data array
  images.forEach(img => img.addEventListener('click', e => openLightbox(e, allData)));

  const leftArrow = document.querySelector('.left-arrow');
  leftArrow.addEventListener('click', e => handleArrowClick(e, 'left', allData));

  const rightArrow = document.querySelector('.right-arrow');
  rightArrow.addEventListener('click', e => handleArrowClick(e, 'right', allData));

  const close = document.querySelector('.close');
  close.addEventListener('click', closeLightbox);
}

document.body.onload = main;
