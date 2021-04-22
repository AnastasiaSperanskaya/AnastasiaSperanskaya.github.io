async function addPinnedCity(CityName, weather) {
  const template = document.querySelector('#pinned-template');
  const clone = template.content.querySelector('li').cloneNode(true);
  const placeParams = convertParameters(clone.querySelector('.weather-info'));

  placeParams.temp = clone.querySelector('p');
  placeParams.icon = clone.querySelector('img');
  placeParams.city = clone.querySelector('h3');
  
  await writeCurrentWeatherInfo(CityName, placeParams, weather);

  const pinnedList = document.querySelector('.pinned-list');

  document.querySelector('.no-pinned').style.display = 'none';

  pinnedList.appendChild(clone);

  clone.querySelector('button').onclick = async () => {
    pinnedList.removeChild(clone);
    await fetch(`${serverURL}favorites?city=${placeParams.city.textContent}`, { method: 'DELETE'});
    const pinnedCities = await (await fetch(`${serverURL}favorites`, { method: 'GET' })).json();
    if (pinnedCities.favorites.length === 0) {
      document.querySelector('.no-pinned').style.display = 'block';
    }
  };
}

function loadPinnedCities() {
  const parent = document.querySelectorAll('section')[1];
  loadData(parent, '.pinned-list', async () => {
    const favorites = await (await fetch(`${serverURL}favorites`,{ method: 'GET' })).json();
    await Promise.all(favorites.favorites.map(async weatherData => { addPinnedCity(weatherData.city, weatherData); }));
  }, 1000);
}