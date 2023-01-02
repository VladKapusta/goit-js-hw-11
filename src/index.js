import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import fatchImages from './js/fatch-image';
import Notiflix from 'notiflix';

const fatchImage = new fatchImages();
const lightbox = new SimpleLightbox('.gallery a', {
  /* options */
});

const MESSAGE_INFORM =
  'Sorry, there are no images matching your search query. Please try again.';
const refs = {
  form: document.querySelector('.search-form'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

refs.form.addEventListener('submit', onSubmitImagesSearch);
refs.loadMore.addEventListener('click', onBtnLoadMore);

function onSubmitImagesSearch(e) {
  e.preventDefault();

  const valueSearch = e.target.searchQuery.value.trim();
  refs.loadMore.hidden = true;
  fatchImage.query = valueSearch;
  if (!valueSearch) {
    Notiflix.Notify.info(MESSAGE_INFORM);
    deletGalleryMarcup();
    return;
  }
  fatchImage.pageReset();
  deletGalleryMarcup();
  addGalleryCardsMarcup();
}

function onBtnLoadMore() {
  refs.loadMore.hidden = true;
  fatchImage.pageIncrement();
  addGalleryCardsMarcup();
}

async function addGalleryCardsMarcup() {
  try {
    const data = await fatchImage.searchImg();
    const arrPhoto = data.hits;
    const totalHitsValue = data.totalHits;

    if (arrPhoto.length === 0) {
      refs.loadMore.hidden = true;
      Notiflix.Notify.info(MESSAGE_INFORM);
      return;
    }
    if (fatchImage.page === 1) {
      Notiflix.Notify.info(`Hooray! We found ${totalHitsValue} images.`);
    }
    addCardPhoto(arrPhoto);
    lightbox.refresh();
    if (arrPhoto.length > 39) {
      refs.loadMore.hidden = false;
    }
  } catch (error) {
    refs.loadMore.hidden = true;
    Notiflix.Notify.failure('Ooops. The server is not responding.');
  }
}

function addCardPhoto(arr) {
  arr.map(
    ({
      webformatURL,
      downloads,
      comments,
      views,
      likes,
      tags,
      largeImageURL,
    }) => {
      const galleryCards = `<div class="photo-card">
      <div class="wraper"><a href="${largeImageURL}"><img src="${webformatURL}" alt="${tags}" loading="lazy" width ="270px"/></a></div>
      <div class="info">
        <div class="info-item">
          <b>Likes</b>
          <p>${likes}</p>
        </div>
        <div class="info-item">
          <b>Views</b>
          <p>${views}</p>
        </div>
        <div class="info-item">
          <b>Comments</b>
          <p>${comments}</p>
        </div>
        <div class="info-item">
          <b>Downloads</b>
          <p>${downloads}</p>
        </div>
      </div>
    </div>`;
      refs.gallery.insertAdjacentHTML('beforeend', galleryCards);
    }
  );
}

function deletGalleryMarcup() {
  refs.gallery.innerHTML = '';
}
