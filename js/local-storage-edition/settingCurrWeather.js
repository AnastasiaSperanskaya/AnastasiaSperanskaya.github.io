const currParams = convertParameters(document.querySelector('.weather-info'));

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