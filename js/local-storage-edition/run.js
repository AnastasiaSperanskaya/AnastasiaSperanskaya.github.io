setStorage();
setCurrentCityWeather(); 
loadPinnedCities();
setEventsOnButtonClick();
const data = [localStorage.cities];
data.forEach((city) => {console.log(city + '\n')});