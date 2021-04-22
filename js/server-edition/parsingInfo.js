const serverURL = 'https://weather-forecast-server-itmo.herokuapp.com/';
const defaultCity = 'Moscow';  

function convertParameters(weatherReportList) {
  const keys = ['wind', 'cloud', 'press', 'humidity', 'coords'];
  const items = weatherReportList.querySelectorAll('p');
  const params = {};
  for (let i = 0; i < keys.length; i += 1) { params[keys[i]] = items[i]; }
  return params;
}
  
async function writeCurrentWeatherInfo(cityOrCoords, reportFields, weatherData) {
  let weather;
  if(weatherData !== undefined) weather = weatherData;
  else { weather = await (await fetch(`${serverURL}${cityOrCoords}`, { method: 'GET' })).json(); }
  
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