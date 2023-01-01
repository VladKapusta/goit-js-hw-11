const axios = require('axios').default;

export default class fatchImages {
  constructor() {
    this.API = 'https://pixabay.com/api/';
    this.KEY_API = '32442591-eae077292ae639629dac32843';
    this.URL = `${this.API}?key=${this.KEY_API}`;
    this.query = '';
    this.page = 1;
    this.per_page = 40;
    this.totalHits = 0;
  }
  get query() {
    return this.value;
  }
  set query(newValue) {
    this.value = newValue;
  }
  async searchImg() {
    const response = await axios.get(this.URL, {
      params: {
        q: this.query,
        image_type: 'photo',
        orientation: 'horizontal',
        safesearch: true,
        page: this.page,
        per_page: this.per_page,
      },
    });
    if(this.totalHits === 0) {
      this.totalHits = response.data.totalHits;
    }
    return await response.data.hits;
  }
  pageIncrement() {
    this.page += 1;
  }
  pageReset() {
    this.page = 1;
  }
  apdateHits(amountPage) {
  this.totalHits -= amountPage
  }
  resetHits() {
    this.totalHits = 0
  }
}
