var plantTypes = ['flowering', 'foliage', 'succulent', 'unusual', 'vining'];

var plantCards = [
    {   // flowering-0
        'cardType': 'plant',
        'plantType': 'flowering',
        'name': 'African Violet',            
        'id': 'africanViolet',            
        'img': 'flowering-0',
        'lighting': ['half'],
        'verdancyRequired': 4,
        'vps': 4
    },{  // flowering-1
        'cardType': 'plant',
        'plantType': 'flowering',
        'name': 'Bird of Paradise',            
        'id': 'birdParadise',            
        'img': 'flowering-1',
        'lighting': ['full', 'half'],
        'verdancyRequired': 8,
        'vps': 9
    },{  // flowering-2
        'cardType': 'plant',
        'plantType': 'flowering',
        'name': 'Angel Wing Begonia',            
        'id': 'angelWingBegonia',            
        'img': 'flowering-2',
        'lighting': ['full', 'half', 'none'],
        'verdancyRequired': 7,
        'vps': 7
    },{  // flowering-3
        'cardType': 'plant',
        'plantType': 'flowering',
        'name': 'Peace Lily',            
        'id': 'peaceLily',            
        'img': 'flowering-3',
        'lighting': ['half', 'none'],
        'verdancyRequired': 5,
        'vps': 5
    },{  // flowering-4
        'cardType': 'plant',
        'plantType': 'flowering',
        'name': 'Bush Lily',            
        'id': 'bushLily',            
        'img': 'flowering-4',
        'lighting': ['half'],
        'verdancyRequired': 5,
        'vps': 6
    },{  // flowering-5
        'cardType': 'plant',
        'plantType': 'flowering',
        'name': 'Amaryllis',            
        'id': 'amaryllis',            
        'img': 'flowering-5',
        'lighting': ['full', 'half'],
        'verdancyRequired': 4,
        'vps': 3
    },{   // foliage-0
        'cardType': 'plant',
        'plantType': 'foliage',
        'name': 'Lucky Bamboo',
        'id': 'luckyBamboo',
        'img': 'foliage-0',
        'lighting': ['full', 'half'],
        'verdancyRequired': 6,
        'vps': 6
    },{  // foliage-1
        'cardType': 'plant',
        'plantType': 'foliage',
        'name': 'Snake Plant',
        'id': 'snakePlant',
        'img': 'foliage-1',
        'lighting': ['full', 'half', 'none'],
        'verdancyRequired': 7,
        'vps': 7
    },{  // foliage-2
        'cardType': 'plant',
        'plantType': 'foliage',
        'name': 'ZZ Plant',
        'id': 'zzPlant',
        'img': 'foliage-2',
        'lighting': ['full', 'half', 'none'],
        'verdancyRequired': 6,
        'vps': 5
    },{  // foliage-3
        'cardType': 'plant',
        'plantType': 'foliage',
        'name': 'Coin Plant',
        'id': 'coinPlant',
        'img': 'foliage-3',
        'lighting': ['half'],
        'verdancyRequired': 4,
        'vps': 4
    },{  // foliage-4
        'cardType': 'plant',
        'plantType': 'foliage',
        'name': 'Prayer Plant',
        'id': 'prayerPlant',
        'img': 'foliage-4',
        'lighting': ['half', 'none'],
        'verdancyRequired': 4,
        'vps': 3
    },{  // foliage-5
        'cardType': 'plant',
        'plantType': 'foliage',
        'name': 'Swiss Cheese Plant',
        'id': 'swissCheesePlant',
        'img': 'foliage-5',
        'lighting': ['half', 'none'],
        'verdancyRequired': 7,
        'vps': 8
    },{   // succulent-0
        'cardType': 'plant',
        'plantType': 'succulent',
        'name': 'Mexican Snowball',
        'id': 'mexicanSnowball',
        'img': 'succulent-0',
        'lighting': ['full', 'half'],
        'verdancyRequired': 3,
        'vps': 2
    },{  // succulent-1
        'cardType': 'plant',
        'plantType': 'succulent',
        'name': 'Zebra Haworthia',
        'id': 'zebraHaworthia',
        'img': 'succulent-1',
        'lighting': ['full', 'half', 'none'],
        'verdancyRequired': 4,
        'vps': 2
    },{  // succulent-2
        'cardType': 'plant',
        'plantType': 'succulent',
        'name': 'Candelabra Cactus',
        'id': 'candelbraCactus',
        'img': 'succulent-2',
        'lighting': ['full'],
        'verdancyRequired': 8,
        'vps': 10
    },{  // succulent-3
        'cardType': 'plant',
        'plantType': 'succulent',
        'name': 'Aloe',
        'id': 'aloe',
        'img': 'succulent-3',
        'lighting': ['full'],
        'verdancyRequired': 5,
        'vps': 6
    },{  // succulent-4
        'cardType': 'plant',
        'plantType': 'succulent',
        'name': 'Jade',
        'id': 'jade',
        'img': 'succulent-4',
        'lighting': ['full', 'half'],
        'verdancyRequired': 7,
        'vps': 8
    },{  // succulent-5
        'cardType': 'plant',
        'plantType': 'succulent',
        'name': 'Panda Plant',
        'id': 'pandaPlant',
        'img': 'succulent-5',
        'lighting': ['full', 'half'],
        'verdancyRequired': 6,
        'vps': 6
    },{   // unusual-0
        'cardType': 'plant',
        'plantType': 'unusual',
        'name': 'Chenille Plant',
        'id': 'chenillePlant',
        'img': 'unusual-0',
        'lighting': ['full', 'half'],
        'verdancyRequired': 8,
        'vps': 9
    },{  // unusual-1
        'cardType': 'plant',
        'plantType': 'unusual',
        'name': 'Nerve Plant',
        'id': 'nervePlant',
        'img': 'unusual-1',
        'lighting': ['full', 'half', 'none'],
        'verdancyRequired': 4,
        'vps': 2
    },{  // unusual-2
        'cardType': 'plant',
        'plantType': 'unusual',
        'name': 'Ficus Bonsai',
        'id': 'ficusBonsai',
        'img': 'unusual-2',
        'lighting': ['full', 'half'],
        'verdancyRequired': 4,
        'vps': 3
    },{  // unusual-3
        'cardType': 'plant',
        'plantType': 'unusual',
        'name': 'Rabbit\'s Foot Fern',
        'id': 'rabbitsFootFern',
        'img': 'unusual-3',
        'lighting': ['half', 'none'],
        'verdancyRequired': 5,
        'vps': 5
    },{  // unusual-4
        'cardType': 'plant',
        'plantType': 'unusual',
        'name': 'Living Stone',
        'id': 'livingStone',
        'img': 'unusual-4',
        'lighting': ['full'],
        'verdancyRequired': 3,
        'vps': 3
    },{  // unusual-5
        'cardType': 'plant',
        'plantType': 'unusual',
        'name': 'Corkscrew Plant',
        'id': 'corkscrewPlant',
        'img': 'unusual-5',
        'lighting': ['full', 'half'],
        'verdancyRequired': 3,
        'vps': 2
    },{   // vining-0
        'cardType': 'plant',
        'plantType': 'vining',
        'name': 'Black-Eyed Susan Vine',
        'id': 'blackeyedSusanVine',
        'img': 'vining-0',
        'lighting': ['full'],
        'verdancyRequired': 7,
        'vps': 9
    },{  // vining-1
        'cardType': 'plant',
        'plantType': 'vining',
        'name': 'Inch Plant',
        'id': 'inchPlant',
        'img': 'vining-1',
        'lighting': ['full', 'half'],
        'verdancyRequired': 5,
        'vps': 5
    },{  // vining-2
        'cardType': 'plant',
        'plantType': 'vining',
        'name': 'Hoya',
        'id': 'hoya',
        'img': 'vining-2',
        'lighting': ['full', 'half', 'none'],
        'verdancyRequired': 8,
        'vps': 8
    },{  // vining-3
        'cardType': 'plant',
        'plantType': 'vining',
        'name': 'Arrowhead Vine',
        'id': 'arrowheadVine',
        'img': 'vining-3',
        'lighting': ['half', 'none'],
        'verdancyRequired': 4,
        'vps': 3
    },{  // vining-4
        'cardType': 'plant',
        'plantType': 'vining',
        'name': 'Devil\s Ivy',
        'id': 'devilsIvy',
        'img': 'vining-4',
        'lighting': ['half', 'none'],
        'verdancyRequired': 9,
        'vps': 11
    },{  // vining-5
        'cardType': 'plant',
        'plantType': 'vining',
        'name': 'Jasmine',
        'id': 'jasmine',
        'img': 'vining-5',
        'lighting': ['full', 'half'],
        'verdancyRequired': 9,
        'vps': 11
    }
];

var roomCards = {
    'flowering': [  // lighting key = ['top', 'right', 'bottom', 'left']
        ['half', 'full', 'half', 'none'], // flowering-room-0
        ['half', 'none', 'half', 'full'], // flowering-room-1
        ['none', 'half', 'full', 'half'], // flowering-room-2
        ['full', 'half', 'none', 'half'], // flowering-room-3
        ['half', 'none', 'full', 'half'], // flowering-room-4
        ['none', 'half', 'half', 'full'], // flowering-room-5
        ['half', 'half', 'none', 'full'], // flowering-room-6
        ['none', 'full', 'half', 'half'], // flowering-room-7
        ['none', 'half', 'full', 'none'], // flowering-room-8
        ['half', 'full', 'none', 'none'], // flowering-room-9
    ],
    'foliage': [
        ['half', 'none', 'half', 'full'], // foliage-room-0
        ['half', 'full', 'none', 'half'], // foliage-room-1
        ['none', 'half', 'full', 'half'], // foliage-room-2
        ['full', 'half', 'half', 'none'], // foliage-room-3
        ['full', 'full', 'none', 'half'], // foliage-room-4
        ['half', 'none', 'full', 'full'], // foliage-room-5
        ['full', 'half', 'none', 'full'], // foliage-room-6
        ['half', 'full', 'full', 'none'], // foliage-room-7
        ['none', 'full', 'half', 'none'], // foliage-room-8
        ['full', 'half', 'none', 'none'], // foliage-room-9
    ],
    'succulent': [
        ['full', 'none', 'half', 'full'], // succulent-room-0
        ['half', 'full', 'full', 'none'], // succulent-room-1
        ['full', 'full', 'none', 'half'], // succulent-room-2
        ['full', 'none', 'half', 'full'], // succulent-room-3
        ['full', 'full', 'half', 'none'], // succulent-room-4
        ['full', 'none', 'full', 'half'], // succulent-room-5
        ['none', 'full', 'full', 'half'], // succulent-room-6
        ['none', 'half', 'full', 'full'], // succulent-room-7
        ['none', 'full', 'half', 'full'], // succulent-room-8
        ['half', 'full', 'none', 'full'], // succulent-room-9
    ],
    'unusual': [
        ['full', 'full', 'half', 'none'], // unusual-room-0
        ['full', 'half', 'none', 'full'], // unusual-room-1
        ['half', 'none', 'full', 'full'], // unusual-room-2
        ['none', 'full', 'full', 'half'], // unusual-room-3
        ['full', 'full', 'half', 'none'], // unusual-room-4
        ['none', 'half', 'full', 'full'], // unusual-room-5
        ['full', 'none', 'half', 'full'], // unusual-room-6
        ['none', 'full', 'full', 'half'], // unusual-room-7
        ['none', 'full', 'half', 'half'], // unusual-room-8
        ['half', 'half', 'none', 'full'], // unusual-room-9
    ],
    'vining': [
        ['half', 'none', 'half', 'full'], // vining-room-0
        ['half', 'full', 'half', 'none'], // vining-room-1
        ['half', 'half', 'full', 'none'], // vining-room-2
        ['full', 'none', 'half', 'half'], // vining-room-3
        ['none', 'full', 'none', 'half'], // vining-room-4
        ['none', 'half', 'none', 'full'], // vining-room-5
        ['full', 'none', 'half', 'none'], // vining-room-6
        ['half', 'none', 'full', 'none'], // vining-room-7
        ['none', 'none', 'half', 'full'], // vining-room-8
        ['full', 'none', 'none', 'half'], // vining-room-9
    ]
};

var itemsAndNurtureItems = {
    'items': ['bird', 'cat', 'chair', 'dog', 'fish', 'lamp', 'shelf', 'sofa', 'table'], // 9 items in each 5 room colors = 45 total
    'itemsNurture': ['fertilizer', 'trowel', 'watering-can'] // 15 each = 45 total
};
