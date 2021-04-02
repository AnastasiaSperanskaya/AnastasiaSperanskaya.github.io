const queryPattern = 'https://weatherapi-com.p.rapidapi.com/forecast.json?q=';
const rapidapiKey = '5ea1a7bba0mshb4b5ef34560e186p1b62cbjsn45061317a9f6';
const rapidapiHost = 'weatherapi-com.p.rapidapi.com';
const defaultCity = localStorage['default-city'];

function report2Params(weatherReportList) {
    const keys = ['wind', 'cloud', 'press', 'humidity', 'coords'];
    const items = weatherReportList.querySelectorAll('p');
    const params = {};
    for (let i = 0; i < keys.length; i += 1) {
      params[keys[i]] = items[i];
    }
    return params;
  }

function initStorage() {
    const defaultCities = ['Moscow', 'Saint-Petersburg'];
  
    if (localStorage.getItem('cities') === null) {
      localStorage.cities = JSON.stringify(defaultCities);
    }
    if (localStorage.getItem('default-city') === null) localStorage['default-city'] = 'Moscow';
  }

async function getWeatherJSON(cityOrCoords) {
    const query = queryPattern + cityOrCoords;
    const response = await fetch(query, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': rapidapiKey,
        'x-rapidapi-host': rapidapiHost,
      },
    });
    return response.json();
  }

async function fillReport(cityOrCoords, reportFields) {
    const weather = await getWeatherJSON(cityOrCoords);
    const { current } = weather;
    const { location } = weather;
    const report = reportFields;
  
    report.temp.textContent = `${Math.round(current.temp_c)}°C`;
    report.wind.textContent = `${current.wind_mph} m/s, ${current.wind_dir}`;
    report.cloud.textContent = `${current.cloud} %`;
    report.press.textContent = `${current.pressure_mb} hpa`;
    report.humidity.textContent = `${current.humidity} %`;
    report.coords.textContent = `[ ${location.lat}, ${location.lon} ]`;
    report.icon.src = current.condition.icon.replace(/64x64/i, '128x128');
  
    if (reportFields.city !== undefined) report.city.textContent = location.name;
  }

function loadData(parentNode, loadingNodeSelector, loadFunction, delay) {
    const loadingNode = document.querySelector(loadingNodeSelector);
    const defaultValue = loadingNode.style.display;
    loadingNode.style.display = 'none';
    const loader = document.getElementById('loading-window').content.cloneNode(true);
    parentNode.appendChild(loader);
  
    setTimeout(async () => {
      await loadFunction();
      parentNode.removeChild(parentNode.querySelector('.loading-window'));
      loadingNode.style.display = defaultValue;
    }, delay);
}
  
function enableCurrent() {
    const parentNode = document.querySelectorAll('section')[0];
    loadData(parentNode, '.current-location', () => {
      const params = report2Params(document.querySelector('.weather-info'));
      params.temp = document.querySelector('p');
      params.icon = document.querySelector('.img-header');
      params.city = document.querySelector('h2');
  
      navigator.geolocation.getCurrentPosition(async (position) => {
        const query = `${position.coords.latitude},${position.coords.longitude}`;
        await fillReport(query, params);
      }, async () => { await fillReport(defaultCity, params); });
    }, 500);
}

async function addPinnedCity(CityName) {
    const template = document.querySelector('#pinned-template');
  
    const placeParams = report2Params(template.content.querySelector('.weather-info'));
    placeParams.temp = template.content.querySelector('p');
    placeParams.icon = template.content.querySelector('img');
    placeParams.template = template;
    placeParams.city = template.content.querySelector('h3');
  
    await fillReport(CityName, placeParams);
  
    const pinnedList = document.querySelector('.pinned-list');
    const clone = template.content.querySelector('li').cloneNode(true);
  
    pinnedList.appendChild(clone);
    clone.querySelector('button').onclick = () => {
      pinnedList.removeChild(clone);
  
      const pinnedCities = new Set(JSON.parse(localStorage.cities));
      pinnedCities.delete(CityName);
      localStorage.cities = JSON.stringify([...pinnedCities]);
  
      if ([...pinnedCities].length === 0) {
        document.querySelector('.no-pinned').style.display = 'block';
      } 
    };
}
  
function setEventsOnButtonClick() {
    const refreashCurrentBtn = document.querySelector('.refresh-button');
    refreashCurrentBtn.onclick = () => { enableCurrent(); };
  
    const form = document.querySelector('form');
    form.onsubmit = async (evt) => {
      const searchField = document.querySelector('#city-field');
      evt.preventDefault();
      const newCity = searchField.value.trim();
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
          window.alert(`City ${newCity} hasn't been found`);
        }
      }
    };
}
  
function loadPinnedCities() {
    const parent = document.querySelectorAll('section')[1];
  
    loadData(parent, '.pinned-list', async () => {
      const set = new Set(JSON.parse(localStorage.cities));
      const data = [...set];
      data.forEach((city) => {
        addPinnedCity(city);
      });
  
      if (JSON.parse(localStorage.cities).length === 0) {
        document.querySelector('.no-pinned').style.display = 'block';
      }
    }, 1000);
}
  
initStorage();
enableCurrent();
loadPinnedCities();
setEventsOnButtonClick();