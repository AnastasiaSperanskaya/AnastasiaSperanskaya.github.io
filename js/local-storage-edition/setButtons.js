function setEventsOnButtonClick() {
    const form = document.querySelector('form');
  
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

            const parentNode = document.querySelector('.pinned-list');
            const loader = document.getElementById('loading-window').content.cloneNode(true);
            parentNode.appendChild(loader); //preloader for favourites cities

            await addPinnedCity(newCity, key);
            pinnedCities.set(key, newCity);
            localStorage.cities = JSON.stringify([...pinnedCities]);
            document.querySelector('.no-pinned').style.display = 'none';
            
            document.querySelector('.loading-window').remove();
          } else if (pinnedCities.has(key)) {
            window.alert(`Город ${newCity} уже добавлен!`);
          }
        } catch (err) {
          window.alert(`Город ${newCity} не найден!`);
          console.log(err);
        }
      }
    };
}