const preload = src => new Promise(function(resolve, reject) {
    const img = new Image();
    img.onload = function() {
      resolve(img);
    }
    img.onerror = reject;
    img.src = src;
  });
  
  const preloadAll = sources =>
    Promise.all(
      sources.map(
        preload));
  
  const sources = [
    'img/title-under-construction.jpg',
    'img/demo-carousel/g-0-0.jpg',
    'img/demo-carousel/g-0-1.jpg',
    'img/demo-carousel/g-0-2.jpg',
    'img/demo-carousel/g-0-3.jpg',
    'img/demo-carousel/g-0-4.jpg',
    'img/demo-carousel/g-0-0.jpg',
    'img/demo-carousel/g-0-1.jpg',
    'img/demo-carousel/g-0-2.jpg',
    'img/demo-carousel/g-0-0.jpg',
    'img/demo-carousel/g-0-1.jpg',
    'img/demo-carousel/g-0-2.jpg',
    'img/demo-carousel/p-0-0.jpg',
    'img/demo-carousel/p-0-1.jpg',
    'img/demo-carousel/p-0-2.jpg',
    'img/demo-carousel/p-0-3.jpg',
    'img/demo-carousel/p-1-0.jpg',
    'img/demo-carousel/p-1-1.jpg',
    'img/demo-carousel/p-1-2.jpg',
    'img/demo-carousel/p-1-3.jpg',
    'img/demo-carousel/p-2-0.jpg',
    'img/demo-carousel/p-2-1.jpg',
    'img/demo-carousel/p-2-2.jpg',
    'img/demo-carousel/p-2-3.jpg',
    'img/demo-carousel/p-3-0.jpg',
    'img/demo-carousel/p-3-1.jpg',
    'img/demo-carousel/p-3-2.jpg',
    'img/demo-carousel/p-3-3.jpg',
    'img/demo-carousel/p-4-0.jpg',
    'img/demo-carousel/p-4-1.jpg',
    'img/demo-carousel/p-4-2.jpg',
    'img/demo-carousel/p-4-3.jpg'];
  
  preloadAll(sources)
    .then(images => initFuncs())
    .catch(err => console.error('Failed', err));
