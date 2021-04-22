function setStorage() {
    const defaultCities = [['55.75;37.62','Moscow'], ['59.89;30.26','Saint-Petersburg']];
  
    if (localStorage.getItem('cities') === null) localStorage.cities = JSON.stringify(defaultCities);
    if (localStorage.getItem('default-city') === null) localStorage['default-city'] = 'Moscow';
}