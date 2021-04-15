function convertParameters(weatherReportList) {
    const keys = ['wind', 'cloud', 'press', 'humidity', 'coords'];
    const items = weatherReportList.querySelectorAll('p');
    const params = {};
  
    for (let i = 0; i < keys.length; i += 1) { params[keys[i]] = items[i];}
    
    return params;
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