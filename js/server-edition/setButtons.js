function setEventsOnButtonClick() {
  const form = document.querySelector('form');

  form.onsubmit = async (evt) => {
    const searchField = document.querySelector('#city-field');

    evt.preventDefault();

    const newCity = searchField.value.trim();

    searchField.value = '';

    if (newCity !== '') {
      try {
        const result = await (await fetch(`${serverURL}favorites?city=${newCity}`, { method: 'POST' })).json();
        
        if (result.name !== undefined) {
          const parentNode = document.querySelector('.pinned-list');
          const loader = document.getElementById('loading-window').content.cloneNode(true);

          parentNode.appendChild(loader); //preloader for favourites cities

          await addPinnedCity(`weather/city?q=${result.name}`);

          document.querySelector('.loading-window').remove();
        } else if (result.name == undefined) {
          window.alert(`Город ${newCity} уже добавлен!`);
        }
      } catch (err) {
        window.alert(`Город ${newCity} не найден!`);
        console.log(err);
      }
    }
  };
}