var plantCards = {
    'flowering': [
        {   // flowering-0
            'name': 'African Violet',
            'id': 'africanViolet',
            'lighting': ['half'],
            'verdancyRequired': 4,
            'vps': 4
        },{  // flowering-1
            'name': 'Bird of Paradise',
            'id': 'birdParadise',
            'lighting': ['full', 'half'],
            'verdancyRequired': 8,
            'vps': 9
        },{  // flowering-2
            'name': 'Angel Wing Begonia',
            'id': 'angelWingBegonia',
            'lighting': ['full', 'half', 'none'],
            'verdancyRequired': 7,
            'vps': 7
        },{  // flowering-3
            'name': 'Peace Lily',
            'id': 'peaceLily',
            'lighting': ['half', 'none'],
            'verdancyRequired': 5,
            'vps': 5
        },{  // flowering-4
            'name': 'Bush Lily',
            'id': 'bushLily',
            'lighting': ['half'],
            'verdancyRequired': 5,
            'vps': 6
        },{  // flowering-5
            'name': 'Amaryllis',
            'id': 'amaryllis',
            'lighting': ['full', 'half'],
            'verdancyRequired': 4,
            'vps': 3
        }
    ],
    'foliage': [
        {   // foliage-0
            'name': 'Lucky Bamboo',
            'id': 'luckyBamboo',
            'lighting': ['full', 'half'],
            'verdancyRequired': 6,
            'vps': 6
        },{  // foliage-1
            'name': 'Snake Plant',
            'id': 'snakePlant',
            'lighting': ['full', 'half', 'none'],
            'verdancyRequired': 7,
            'vps': 7
        },{  // foliage-2
            'name': 'ZZ Plant',
            'id': 'zzPlant',
            'lighting': ['full', 'half', 'none'],
            'verdancyRequired': 6,
            'vps': 5
        },{  // foliage-3
            'name': 'Coin Plant',
            'id': 'coinPlant',
            'lighting': ['half'],
            'verdancyRequired': 4,
            'vps': 4
        },{  // foliage-4
            'name': 'Prayer Plant',
            'id': 'prayerPlant',
            'lighting': ['half', 'none'],
            'verdancyRequired': 4,
            'vps': 3
        },{  // foliage-5
            'name': 'Swiss Cheese Plant',
            'id': 'swissCheesePlant',
            'lighting': ['half', 'none'],
            'verdancyRequired': 7,
            'vps': 8
        }
    ],
    'succulent': [
        {   // succulent-0
            'name': 'Mexican Snowball',
            'id': 'mexicanSnowball',
            'lighting': ['full', 'half'],
            'verdancyRequired': 3,
            'vps': 2
        },{  // succulent-1
            'name': 'Zebra Haworthia',
            'id': 'zebraHaworthia',
            'lighting': ['full', 'half', 'none'],
            'verdancyRequired': 4,
            'vps': 2
        },{  // succulent-2
            'name': 'Candelabra Cactus',
            'id': 'candelbraCactus',
            'lighting': ['full'],
            'verdancyRequired': 8,
            'vps': 10
        },{  // succulent-3
            'name': 'Aloe',
            'id': 'aloe',
            'lighting': ['full'],
            'verdancyRequired': 5,
            'vps': 6
        },{  // succulent-4
            'name': 'Jade',
            'id': 'jade',
            'lighting': ['full', 'half'],
            'verdancyRequired': 7,
            'vps': 8
        },{  // succulent-5
            'name': 'Panda Plant',
            'id': 'pandaPlant',
            'lighting': ['full', 'half'],
            'verdancyRequired': 6,
            'vps': 6
        }
    ],
    'unusual': [
        {   // unusual-0
            'name': 'Chenille Plant',
            'id': 'chenillePlant',
            'lighting': ['full', 'half'],
            'verdancyRequired': 8,
            'vps': 9
        },{  // unusual-1
            'name': 'Nerve Plant',
            'id': 'nervePlant',
            'lighting': ['full', 'half', 'none'],
            'verdancyRequired': 4,
            'vps': 2
        },{  // unusual-2
            'name': 'Ficus Bonsai',
            'id': 'ficusBonsai',
            'lighting': ['full', 'half'],
            'verdancyRequired': 4,
            'vps': 3
        },{  // unusual-3
            'name': 'Rabbit\'s Foot Fern',
            'id': 'rabbitsFootFern',
            'lighting': ['half', 'none'],
            'verdancyRequired': 5,
            'vps': 5
        },{  // unusual-4
            'name': 'Living Stone',
            'id': 'livingStone',
            'lighting': ['full'],
            'verdancyRequired': 3,
            'vps': 3
        },{  // unusual-5
            'name': 'Corkscrew Plant',
            'id': 'corkscrewPlant',
            'lighting': ['full', 'half'],
            'verdancyRequired': 3,
            'vps': 2
        }
    ],
    'vining': [
        {   // vining-0
            'name': 'Black-Eyed Susan Vine',
            'id': 'blackeyedSusanVine',
            'lighting': ['full'],
            'verdancyRequired': 7,
            'vps': 9
        },{  // vining-1
            'name': 'Inch Plant',
            'id': 'inchPlant',
            'lighting': ['full', 'half'],
            'verdancyRequired': 5,
            'vps': 5
        },{  // vining-2
            'name': 'Hoya',
            'id': 'hoya',
            'lighting': ['full', 'half', 'none'],
            'verdancyRequired': 8,
            'vps': 8
        },{  // vining-3
            'name': 'Arrowhead Vine',
            'id': 'arrowheadVine',
            'lighting': ['half', 'none'],
            'verdancyRequired': 4,
            'vps': 3
        },{  // vining-4
            'name': 'Devil\s Ivy',
            'id': 'devilsIvy',
            'lighting': ['half', 'none'],
            'verdancyRequired': 9,
            'vps': 11
        },{  // vining-5
            'name': 'Jasmine',
            'id': 'jasmine',
            'lighting': ['full', 'half'],
            'verdancyRequired': 9,
            'vps': 11
        }
    ]
};

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
