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

var options = {
    timeout: 300,
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

function setCurrentCityWeather() {
    const parentNode = document.querySelectorAll('section')[0];
  
    loadData(parentNode, '.current-location', () => {
      currParams.temp = document.querySelector('p');
      currParams.icon = document.querySelector('.img-header');
      currParams.city = document.querySelector('h2');
  
      navigator.geolocation.getCurrentPosition(success, error, options);
    }, options.timeout * 2);
}