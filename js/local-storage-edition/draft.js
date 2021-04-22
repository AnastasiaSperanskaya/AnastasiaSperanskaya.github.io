// convert report html to js object
function report2Params(weatherReportList) {
  const keys = ['wind', 'cloud', 'press', 'humidity', 'coords'];
  const items = weatherReportList.querySelectorAll('p');
  const params = {};
  for (let i = 0; i < keys.length; i += 1) {
    params[keys[i]] = items[i];
  }
  return params;
}

const serverURL = 'https://weather-forecast-server-itmo.herokuapp.com/';
const defaultCity = 'Moscow';

// Fill weather report block
function convertDir(dir) {
  const dirs = {
    N: 'North', W: 'West', E: 'East', S: 'South',
  };
  let result = '';
  for (let i = 0; i < dir.length; i += 1) {
    result += dirs[dir[i]];
    if (i === 0 && dir.length > 1) result += '-';
  }
  return result;
}

async function fillReport(cityOrCoords, reportFields, weatherData) {

  let weather;
  if(weatherData !== undefined) weather = weatherData;
  else{
    weather = await (await fetch(`${serverURL}${cityOrCoords}`, {
      method: 'GET'
    })).json();
  }

  const { coords } = weather;
  const report = reportFields;

  report.temp.textContent = weather.temp;
  report.wind.textContent = weather.wind;
  report.cloud.textContent = weather.cloud;
  report.press.textContent = weather.press;
  report.humidity.textContent = weather.humidity;
  report.coords.textContent = `[ ${coords.lat}, ${coords.lon} ]`;
  report.icon.src = weather.icon;

  if (reportFields.city !== undefined) report.city.textContent = weather.city;
}

// Loading process (hide block -> show laoder + fill report) -> hide loader + show block
function loadData(parentNode, loadingNodeSelector, loadFunction, delay) {
  const loadingNode = document.querySelector(loadingNodeSelector);
  const defaultValue = loadingNode.style.display;
  loadingNode.style.display = 'none';
  const loader = document.getElementById('loader').content.cloneNode(true);
  parentNode.appendChild(loader);

  setTimeout(async () => {
    await loadFunction();
    parentNode.removeChild(parentNode.querySelector('.loader'));
    loadingNode.style.display = defaultValue;
  }, delay);
}

// Fill current by coords
function enableCurrent() {
  const parentNode = document.querySelectorAll('section')[0];
  loadData(parentNode, '.current-position', () => {
    const params = report2Params(document.querySelector('.weather-report'));
    params.temp = document.querySelector('p');
    params.icon = document.querySelector('.wi');
    params.city = document.querySelector('.place-current');

    navigator.geolocation.getCurrentPosition(async (position) => {
      const query = `weather/coordinates?lat=${position.coords.latitude}&lon=${position.coords.longitude}`;
      await fillReport(query, params);
    }, async () => { await fillReport(defaultCity, params); });
  }, 500);
}

// Render card to htnl
async function createCard(CityName, weather) {
  const template = document.querySelector('#pinned-card-template');
  const clone = template.content.querySelector('li').cloneNode(true);

  const placeParams = report2Params(clone.querySelector('.weather-report'));
  placeParams.temp = clone.querySelector('p');
  placeParams.icon = clone.querySelector('img');
  placeParams.city = clone.querySelector('h3');

  await fillReport(CityName, placeParams, weather);
  const pinnedList = document.querySelector('.pinned-list');

  document.querySelector('.pinned-empty').style.display = 'none';

  pinnedList.appendChild(clone);
  clone.querySelector('button').onclick = async () => {
    pinnedList.removeChild(clone);

    await fetch(`${serverURL}favorites?city=${placeParams.city.textContent}`, {
      method: 'DELETE'
    });
    const pinnedCities = await (await fetch(`${serverURL}favorites`, {
      method: 'GET'
    })).json();

    if (pinnedCities.favorites.length === 0) {
      document.querySelector('.pinned-empty').style.display = 'block';
    }
  };
}

// Set default buttons onClick methods
function enableDeafultButtons() {
  const refreashCurrentBtn = document.querySelector('.square-btn');
  refreashCurrentBtn.onclick = () => { enableCurrent(); };

  const form = document.querySelector('form');
  form.onsubmit = async (evt) => {
    const searchField = document.querySelector('#search-field');
    evt.preventDefault();
    const newCity = searchField.value.trim();
    searchField.value = '';
    if (newCity !== '') {
      try {
        const result = await (await fetch(`${serverURL}favorites?city=${newCity}`, {
          method: 'POST'
        })).json();
        if (result.name !== undefined) {
          await createCard(`weather/city?q=${result.name}`);
        }
      } catch (err) {
        window.alert(`City ${newCity} hasn't been found`);
      }
    }
  };
}

// Loading favorites cities
function loadPinned() {
  const parent = document.querySelectorAll('section')[1];

  loadData(parent, '.pinned-list', async () => {
    const favorites = await (await fetch(`${serverURL}favorites`,{
      method: 'GET'
    })).json();

    await Promise.all(favorites.favorites.map(async weatherData => {
      createCard(weatherData.city, weatherData);
    }));

    if (JSON.parse(localStorage.cities).length === 0) {
      document.querySelector('.pinned-empty').style.display = 'block';
    }
  }, 1000);
}

enableCurrent();
loadPinned();
enableDeafultButtons();