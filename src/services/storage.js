export const set = (value) => {
  localStorage.setItem('image-finder-app', JSON.stringify(value));
};

export const get = () => {
  const data = localStorage.getItem('image-finder-app');

  return data ? JSON.parse(data) : null;
};

export const remove = id => {
  const data = JSON.parse(localStorage.getItem('image-finder-app'));
  const resData = data.filter(item => item.id !== id);
  localStorage.setItem('image-finder-app', JSON.stringify(resData));
};