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

refs.form.addEventListener('submit', onSubmit);
refs.loadMore.addEventListener('click', onBtnLoadMore);

function onSubmit(e) {
  e.preventDefault();

  const valueSearch = e.target.searchQuery.value;

  fatchImage.pageReset();
  fatchImage.resetHits();

  delitCards();
  fatchImage.query = valueSearch;
  if (!valueSearch) {
    refs.loadMore.hidden = true;
    Notiflix.Notify.info(MESSAGE_INFORM);
    return;
  }
  renderGalleryCard();
  
}

function onBtnLoadMore() {
  fatchImage.pageIncrement();
  fatchImage.apdateHits(fatchImage.per_page);
  renderGalleryCard();
}

async function renderGalleryCard() {
  try {
    const arrPhoto = await fatchImage.searchImg();
    if (arrPhoto.length === 0) {
      refs.loadMore.hidden = true;
      Notiflix.Notify.info(MESSAGE_INFORM);
      return;
    }
    if (arrPhoto.length > 39) {
      refs.loadMore.hidden = false;
    }
    addCardPhoto(arrPhoto);
    Notiflix.Notify.info(`Hooray! We found ${fatchImage.totalHits} images.`);
    lightbox.refresh()
     
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
      const galleryCard = `<div class="photo-card">
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
      refs.gallery.insertAdjacentHTML('beforeend', galleryCard);
    }
  );
 
}

function delitCards() {
  refs.gallery.innerHTML = '';
}
