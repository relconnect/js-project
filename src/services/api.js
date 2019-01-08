import axios from 'axios';

const API_KEY = '5837779-ac3ba737206b541ae294f1119';

// eslint-disable-next-line import/prefer-default-export
export const fetchImages = ({ query, count, page }) => {
  const url = `https://pixabay.com/api/?image_type=photo&q=${query}&per_page=${count}&page=${page}&key=${API_KEY}`;

  return axios
    .get(url)
    .then(res => res.data.hits)
    .catch(err => console.log('axios err : ', err));
};
