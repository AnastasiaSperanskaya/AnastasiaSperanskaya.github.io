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
          const weather = await getJSONWeatherInfo(newCity);
          const key = weather.location.lat + ';' + weather.location.lon;
          const pinnedCities = new Map(JSON.parse(localStorage.cities));
          if (!pinnedCities.has(key)) {
            await addPinnedCity(newCity, key);
            pinnedCities.set(key, newCity);
            localStorage.cities = JSON.stringify([...pinnedCities]);
            document.querySelector('.no-pinned').style.display = 'none';
          } else if (pinnedCities.has(key)) {
            window.alert(`Город ${newCity} уже добавлен!`);
          }
        } catch (err) {
          window.alert(`Город ${newCity} не найден!`);
        }
      }
    };
}