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
    'img/items/flowering-bird.png',
    'img/items/flowering-cat.png',
    'img/items/flowering-chair.png',
    'img/items/flowering-dog.png',
    'img/items/flowering-fish.png',
    'img/items/flowering-lamp.png',
    'img/items/flowering-shelf.png',
    'img/items/flowering-sofa.png',
    'img/items/flowering-table.png',
    'img/items/foliage-bird.png',
    'img/items/foliage-cat.png',
    'img/items/foliage-chair.png',
    'img/items/foliage-dog.png',
    'img/items/foliage-fish.png',
    'img/items/foliage-lamp.png',
    'img/items/foliage-shelf.png',
    'img/items/foliage-sofa.png',
    'img/items/foliage-table.png',
    'img/items/succulent-bird.png',
    'img/items/succulent-cat.png',
    'img/items/succulent-chair.png',
    'img/items/succulent-dog.png',
    'img/items/succulent-fish.png',
    'img/items/succulent-lamp.png',
    'img/items/succulent-shelf.png',
    'img/items/succulent-sofa.png',
    'img/items/succulent-table.png',
    'img/items/unusual-bird.png',
    'img/items/unusual-cat.png',
    'img/items/unusual-chair.png',
    'img/items/unusual-dog.png',
    'img/items/unusual-fish.png',
    'img/items/unusual-lamp.png',
    'img/items/unusual-shelf.png',
    'img/items/unusual-sofa.png',
    'img/items/unusual-table.png',
    'img/items/vining-bird.png',
    'img/items/vining-cat.png',
    'img/items/vining-chair.png',
    'img/items/vining-dog.png',
    'img/items/vining-fish.png',
    'img/items/vining-lamp.png',
    'img/items/vining-shelf.png',
    'img/items/vining-sofa.png',
    'img/items/vining-table.png',
    'img/itemsNurture/fertilizer.png',
    'img/itemsNurture/trowel.png',
    'img/itemsNurture/watering-can.png',
    'img/lighting/full.png',
    'img/lighting/half.png',
    'img/lighting/none.png',
    'img/plants/back.jpg',
    'img/plants/flowering-0.jpg',
    'img/plants/flowering-1.jpg',
    'img/plants/flowering-2.jpg',
    'img/plants/flowering-3.jpg',
    'img/plants/flowering-4.jpg',
    'img/plants/flowering-5.jpg',
    'img/plants/foliage-0.jpg',
    'img/plants/foliage-1.jpg',
    'img/plants/foliage-2.jpg',
    'img/plants/foliage-3.jpg',
    'img/plants/foliage-4.jpg',
    'img/plants/foliage-5.jpg',
    'img/plants/succulent-0.jpg',
    'img/plants/succulent-1.jpg',
    'img/plants/succulent-2.jpg',
    'img/plants/succulent-3.jpg',
    'img/plants/succulent-4.jpg',
    'img/plants/succulent-5.jpg',
    'img/plants/unusual-0.jpg',
    'img/plants/unusual-1.jpg',
    'img/plants/unusual-2.jpg',
    'img/plants/unusual-3.jpg',
    'img/plants/unusual-4.jpg',
    'img/plants/unusual-5.jpg',
    'img/plants/vining-0.jpg',
    'img/plants/vining-1.jpg',
    'img/plants/vining-2.jpg',
    'img/plants/vining-3.jpg',
    'img/plants/vining-4.jpg',
    'img/plants/vining-5.jpg',
    'img/plants/icons/banners/flowering.png',
    'img/plants/icons/banners/foliage.png',
    'img/plants/icons/banners/succulent.png',
    'img/plants/icons/banners/unusual.png',
    'img/plants/icons/banners/vining.png',
    'img/plants/icons/symbols/flowering.png',
    'img/plants/icons/symbols/foliage.png',
    'img/plants/icons/symbols/succulent.png',
    'img/plants/icons/symbols/unusual.png',
    'img/plants/icons/symbols/vining.png',
    'img/plants/icons/verdancy/3.png',
    'img/plants/icons/verdancy/4.png',
    'img/plants/icons/verdancy/5.png',
    'img/plants/icons/verdancy/6.png',
    'img/plants/icons/verdancy/7.png',
    'img/plants/icons/verdancy/8.png',
    'img/plants/icons/verdancy/9.png',
    'img/plants/icons/vp/2.png',
    'img/plants/icons/vp/3.png',
    'img/plants/icons/vp/4.png',
    'img/plants/icons/vp/5.png',
    'img/plants/icons/vp/6.png',
    'img/plants/icons/vp/7.png',
    'img/plants/icons/vp/8.png',
    'img/plants/icons/vp/9.png',
    'img/plants/icons/vp/10.png',
    'img/plants/icons/vp/11.png',
    'img/pots/concrete.png',
    'img/pots/concrete-0.png',
    'img/pots/concrete-1.png',
    'img/pots/concrete-2.png',
    'img/pots/wood.png',
    'img/pots/wood-0.png',
    'img/pots/wood-1.png',
    'img/pots/wood-2.png',
    'img/pots/porcelain.png',
    'img/pots/porcelain-0.png',
    'img/pots/porcelain-1.png',
    'img/pots/porcelain-2.png',
    'img/pots/terracotta-0.png',
    'img/pots/terracotta-1.png',
    'img/pots/terracotta-2.png',
    'img/pots/terracotta-3.png',
    'img/rooms/back.jpg',
    'img/rooms/flowering.jpg',
    'img/rooms/foliage.jpg',
    'img/rooms/succulent.jpg',
    'img/rooms/unusual.jpg',
    'img/rooms/vining.jpg',
    'img/thumbs/0.png',
    'img/thumbs/1.png',
    'img/thumbs/2.png',
    'img/thumbs/3.png',
    'img/thumbs/4.png',
    'img/bg.jpg',
    'img/title-under-construction.jpg'
  ];
  
  preloadAll(sources)
    .then(images => initFuncs())
    .catch(err => console.error('Failed', err));
