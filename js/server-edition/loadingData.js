function loadData(parentNode, loadingNodeSelector, loadFunction, delay) {
  const loadingNode = document.querySelector(loadingNodeSelector);
  const defaultValue = loadingNode.style.display;

  loadingNode.style.display = 'none';

  const loader = document.getElementById('loading-window').content.cloneNode(true);
  
  parentNode.appendChild(loader);
  
  setTimeout(async () => {
    await loadFunction();
    parentNode.removeChild(parentNode.querySelector('.loading-window'));
    loadingNode.style.display = defaultValue;
  }, delay);
}