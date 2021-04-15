async function addPinnedCity(cityName, key) {
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
  
      const pinnedCities = new Map(JSON.parse(localStorage.cities));
      pinnedCities.delete(key);
      localStorage.cities = JSON.stringify([...pinnedCities]);
  
      if ([...pinnedCities].length === 0) {
        document.querySelector('.no-pinned').style.display = 'block';
      } 
    };
}

function loadPinnedCities() {
    const parent = document.querySelectorAll('section')[1];
  
    loadData(parent, '.pinned-list', async () => {
      let map;
      try {
        map = new Map(JSON.parse(localStorage.cities));
      } catch (error) {
        localStorage.clear();
        setStorage();
        map = new Map(JSON.parse(localStorage.cities));
      }
      const data = [...map];
  
      data.forEach((pair) => {
        addPinnedCity(pair[1], pair[0]);
      });
  
      //promise.all somewhere here
      // Promise.all(data).then(data => data.forEach((pair) => {
      //   addPinnedCity(pair[1], pair[0]);
      // }));
  
      if (JSON.parse(localStorage.cities).length === 0) {
        document.querySelector('.no-pinned').style.display = 'block';
      }
    }, 1000);
}