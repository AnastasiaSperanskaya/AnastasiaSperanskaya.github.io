function convertParameters(weatherReportList) {
  const keys = ['wind', 'cloud', 'press', 'humidity', 'coords'];
  const items = weatherReportList.querySelectorAll('p');
  const params = {};

  for (let i = 0; i < keys.length; i += 1) { params[keys[i]] = items[i];}
  
  return params;
}

function setStorage() {
  const defaultCities = ['Moscow', 'Saint-Petersburg'];

  if (localStorage.getItem('cities') === null) localStorage.cities = JSON.stringify(defaultCities);
  if (localStorage.getItem('default-city') === null) localStorage['default-city'] = 'Moscow';
}

async function getJSONWeatherInfo(cityOrCoords) {
  const query = 'https://weatherapi-com.p.rapidapi.com/forecast.json?q=' + cityOrCoords;
  const response = await fetch(query, {
    method: 'GET',
    headers: {
      'x-rapidapi-key': 'ecb458bdedmsh3cfe23073821bc9p1442dbjsn08522e24b70a',
      'x-rapidapi-host': 'weatherapi-com.p.rapidapi.com',
    },
  });
  return response.json();
}

async function writeCurrentWeatherInfo(cityOrCoords, reportFields) {
  const weather = await getJSONWeatherInfo(cityOrCoords);
  const { current, location } = weather;
  const report = reportFields;

  report.temp.textContent = `${Math.round(current.temp_c)}°C`;
  report.wind.textContent = `${current.wind_mph} m/s, ${current.wind_dir}`;
  report.cloud.textContent = `${current.cloud} %`;
  report.press.textContent = `${current.pressure_mb} hpa`;
  report.humidity.textContent = `${current.humidity} %`;
  report.coords.textContent = `[ ${location.lat}, ${location.lon} ]`;
  report.icon.src = current.condition.icon.replace(/64x64/i, '128x128');
  report.city.textContent = location.name;
}

function loadData(parentNode, loadingNodeSelector, loadFunction, delay) {
  const loadingNode = document.querySelector(loadingNodeSelector);
  const defaultValue = loadingNode.style.display;
  const loader = document.getElementById('loading-window').content.cloneNode(true);

  loadingNode.style.display = 'none';
  
  parentNode.appendChild(loader);

  setTimeout(async () => {
    await loadFunction();
    parentNode.removeChild(parentNode.querySelector('.loading-window'));
    loadingNode.style.display = defaultValue;
  }, delay);
}

const currParams = convertParameters(document.querySelector('.weather-info'));

function setCurrentCityWeather() {
  const parentNode = document.querySelectorAll('section')[0];

  loadData(parentNode, '.current-location', () => {
    currParams.temp = document.querySelector('p');
    currParams.icon = document.querySelector('.img-header');
    currParams.city = document.querySelector('h2');

    navigator.geolocation.getCurrentPosition(success, error, options);
  }, 500);
}

var options = {
  timeout: 3000,
};

function success(pos) {
  var crd = pos.coords;
  const query = `${crd.latitude},${crd.longitude}`;
  writeCurrentWeatherInfo(query, currParams);
};

function error(err) {
  console.warn(`ERROR(${err.code}): ${err.message}`);
  if (err.code === 1 || err.code === 2 || err.code === 3) {
    writeCurrentWeatherInfo(localStorage['default-city'], currParams);
  } 
};

async function addPinnedCity(cityName) {
  const template = document.querySelector('#pinned-template');
  const placeParams = convertParameters(template.content.querySelector('.weather-info'));

  placeParams.temp = template.content.querySelector('p');
  placeParams.icon = template.content.querySelector('img');
  placeParams.template = template;
  placeParams.city = template.content.querySelector('h3');

  await writeCurrentWeatherInfo(cityName, placeParams);

  const pinnedList = document.querySelector('.pinned-list');
  const clone = template.content.querySelector('li').cloneNode(true);

  pinnedList.appendChild(clone);
  clone.querySelector('button').onclick = () => {
    pinnedList.removeChild(clone);

    const pinnedCities = new Set(JSON.parse(localStorage.cities));
    pinnedCities.delete(cityName);
    localStorage.cities = JSON.stringify([...pinnedCities]);

    if ([...pinnedCities].length === 0) {
      document.querySelector('.no-pinned').style.display = 'block';
    } 
  };
}

function setEventsOnButtonClick() {
  const refreshCurrentBtn = document.querySelector('.refresh-button');
  const form = document.querySelector('form');

  refreshCurrentBtn.onclick = () => { setCurrentCityWeather(); };

  form.onsubmit = async (evt) => {
    const searchField = document.querySelector('#city-field');
    const newCity = searchField.value.trim();

    evt.preventDefault();
    searchField.value = '';

    if (newCity !== '') {
      try {
        const pinnedCities = new Set(JSON.parse(localStorage.cities));
        if (!pinnedCities.has(newCity)) {
          await addPinnedCity(newCity);
          pinnedCities.add(newCity);
          localStorage.cities = JSON.stringify([...pinnedCities]);
          document.querySelector('.no-pinned').style.display = 'none';
        }
      } catch (err) {
        window.alert(`Город ${newCity} не найден!`);
      }
    }
  };
}

function loadPinnedCities() {
  const parent = document.querySelectorAll('section')[1];

  loadData(parent, '.pinned-list', async () => {
    const set = new Set(JSON.parse(localStorage.cities));
    const data = [...set];
    data.forEach((city) => { addPinnedCity(city); });

    if (JSON.parse(localStorage.cities).length === 0) {
      document.querySelector('.no-pinned').style.display = 'block';
    }
  }, 1000);
}

setStorage();
setCurrentCityWeather(); 
loadPinnedCities();
setEventsOnButtonClick();