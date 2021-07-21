export function fetchPictures(name, page) {
  const API_KEY = '21813643-16e9f0b30c26c932714b1b168';
  const BASE_URL = 'https://pixabay.com/api';
  return fetch(
    `${BASE_URL}/?key=${API_KEY}&q=${name}&image_type=photo&page&per_page=12&page=${page}`,
  ).then(response => {
    if (response.ok) {
      return response.json();
    }
    return Promise.reject(new Error(`Нет изображения с именем ${name.tags}`));
  });
}
