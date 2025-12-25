export type Product = {
    id: string;
    name: string;
    category: 'Shawls' | 'Stoles' | 'Mufflers' | 'Rumala' | 'Dresses' | 'Kimonos' | 'Capes' | 'Kaftans' | 'Scarfs';
    materials: string[];
    description: string;
    price: string;
    colors: string[];
    sizes: string[];
    image: string;
    attributes?: Record<string, string>;
};

export const products: Product[] = [
    {
        id: '1',
        name: 'Royal Pashmina Kani Shawl',
        category: 'Shawls',
        materials: ['Pashmina', 'Silk'],
        description: 'Authentic handcrafted Pashmina shawl featuring intricate Kani weave. A masterpiece of Kashmiri heritage.',
        price: '€450.00',
        colors: ['Red', 'Midnight Black', 'Gold'],
        sizes: ['100x200cm'],
        image: '/shawl1.jpg',
        attributes: {
            'Weave': 'Kani',
            'GSM': '180'
        }
    },
    {
        id: '2',
        name: 'Merino Wool Check muffler',
        category: 'Mufflers',
        materials: ['Merino Wool'],
        description: 'Classic check pattern muffler made from soft Merino wool. Perfect for European winters.',
        price: '€35.00',
        colors: ['Grey', 'Navy Blue', 'Charcoal'],
        sizes: ['30x160cm'],
        image: '/muffler1.jpg'
    },
    {
        id: '3',
        name: 'Traditional Silk Kimono',
        category: 'Kimonos',
        materials: ['Silk'],
        description: 'Elegant silk kimono with traditional patterns. Perfect for luxury loungewear.',
        price: '€120.00',
        colors: ['Red', 'Black', 'Gold'],
        sizes: ['Free Size'],
        image: '/kimono.jpg',
        attributes: {
            'Pattern': 'Embroidered',
            'Length': 'Full'
        }
    },
    {
        id: '4',
        name: 'Cashmere Blend Stole',
        category: 'Stoles',
        materials: ['Cashmere Wool', 'Modal'],
        description: 'Lightweight cashmere blend stole, offering warmth with a soft drape.',
        price: '€65.00',
        colors: ['Beige', 'Pastel Pink', 'Grey'],
        sizes: ['70x200cm'],
        image: '/stole1.jpg'
    },
    {
        id: '5',
        name: 'Traditional Rumala Sahib',
        category: 'Rumala',
        materials: ['Silk', 'Pashmina'],
        description: 'Exquisitely embroidered Rumala Sahib set for religious ceremonies.',
        price: '€120.00',
        colors: ['Blue', 'Orange'],
        sizes: ['Standard'],
        image: '/rumala1.jpg'
    },
    {
        id: '6',
        name: 'Cotton Voile Summer Dress',
        category: 'Dresses',
        materials: ['Cotton'],
        description: 'Breezy cotton voile dress with block prints.',
        price: '€45.00',
        colors: ['White', 'Yellow'],
        sizes: ['S', 'M', 'L'],
        image: '/dress1.jpg'
    },
    {
        id: '7',
        name: 'Winter Wool Cape',
        category: 'Capes',
        materials: ['Wool', 'Cashmere Wool'],
        description: 'Stylish and warm wool cape for casual winter wear.',
        price: '€95.00',
        colors: ['Camel', 'Grey'],
        sizes: ['Free Size'],
        image: '/cape.jpg'
    }
];

export const CATEGORIES = ['Shawls', 'Stoles', 'Mufflers', 'Rumala', 'Dresses', 'Kimonos', 'Capes', 'Kaftans', 'Scarfs'];

export const MATERIALS = [
    'Pashmina',
    'Cashmere Wool',
    'Merino Wool',
    'Lambswool',
    'Yak Wool',
    'Alpaca Wool',
    'Angora Wool',
    'Wool',
    'Tweed Wool',
    'Worsted Wool',
    'Boiled Wool',
    'Super Silk',
    'Silk–Wool Blend',
    'Cotton–Wool Blend',
    'Acrylic–Wool Blend',
    'Poly–Wool Blend',
    'Silk',
    'Mulberry Silk',
    'Tussar Silk',
    'Eri Silk',
    'Modal',
    'Modal–Silk Blend',
    'Viscose / Rayon',
    'Cotton',
    'Organic Cotton',
    'Linen',
    'Bamboo',
    'Tencel / Lyocell',
    'Wool (lightweight)',
    'Blended',
    'Viscose crepe',
    'Satin',
    'Cashmere',
    'Blend',
    'Pure Silk (Mulberry Silk)',
    'Pashmina (Cashmere Grade)'
];

export const SUB_CATEGORIES: Record<string, string[]> = {
    'SHAWL': [
        'Plain Shawls',
        'Embroidered Shawls',
        'Printed Shawls',
        'Woven Shawls',
        'Reversible Shawls'
    ],
    'STOLE': [
        'Lightweight Stoles',
        'Digital Printed Stoles',
        'Embroidered Stoles',
        'Kani Stoles',
        'Reversible Stoles',
        'Hand Printed Stoles'
    ],
    'MUFFLER': [
        'Super Silk Mufflers',
        'Wool Mufflers',
        'Boiled Wool Mufflers',
        'Embriodary Mufflers',
        'Unisex Mufflers'
    ],
    'RUMALA': [
        'Plain Rumala',
        'Printed Rumala',
        'Embroidered Rumala',
        'Mulberry Silk Rumala',
        'Pure Silk Rumala',
        'Silk Embroidered Rumala',
        'Silk Printed Rumala'
    ],
    'KIMONO': [
        'Open Kimonos',
        'Belted Kimonos',
        'Long Kimonos',
        'Short Kimonos'
    ],
    'DRESS': [
        'Casual Dresses',
        'Evening Dresses',
        'Ethnic Dresses',
        'Layered / Winter Dresses',
        'Beach Dress'
    ],
    'CAPE': [
        'Winter Capes',
        'Fashion Capes',
        'Long Capes',
        'Short Capes'
    ],
    'KAFTAN': [
        'Tunics',
        'Dress'
    ],
    'SCARF': [
        'Scarf (Long): 50 × 180 cm',
        'Scarf (Square): 90 × 90 cm'
    ]
};

export const CATEGORY_MATERIALS: Record<string, string[]> = {
    'MUFFLER': [
        'Merino Wool',
        'Lambswool',
        'Cashmere Wool',
        'Yak Wool',
        'Wool',
        'Acrylic–Wool Blend',
        'Poly–Wool Blend',
        'Cotton'
    ],
    'RUMALA': [
        'Mulberry Silk',
        'Tussar Silk',
        'Eri Silk',
        'Cotton',
        'Organic Cotton',
        'Modal',
        'Modal–Silk Blend',
        'Linen',
        'Pashmina',
        'Cashmere Wool',
        'Merino Wool',
        'Tweed Wool',
        'Blended',
        'Acrylic–Wool Blend'
    ],
    'KIMONO': [
        'Silk',
        'Mulberry Silk',
        'Modal',
        'Modal–Silk Blend',
        'Viscose / Rayon',
        'Cotton',
        'Linen',
        'Bamboo',
        'Tencel / Lyocell'
    ],
    'DRESS': [
        'Cotton',
        'Organic Cotton',
        'Linen',
        'Modal',
        'Viscose / Rayon',
        'Bamboo',
        'Tencel / Lyocell',
        'Silk',
        'Wool',
        'Cotton–Wool Blend',
        'Silk–Wool Blend'
    ],
    'CAPE': [
        'Cashmere Wool',
        'Merino Wool',
        'Lambswool',
        'Alpaca Wool',
        'Tweed Wool',
        'Worsted Wool',
        'Wool',
        'Silk–Wool Blend',
        'Poly–Wool Blend',
        'Viscose crepe'
    ],
    'KAFTAN': [
        'Modal',
        'Satin',
        'Silk'
    ],
    'SCARF': [
        'Cotton',
        'Organic Cotton',
        'Super Silk',
        'Wool',
        'Merino Wool',
        'Cashmere',
        'Linen',
        'Viscose / Rayon',
        'Modal',
        'Blend',
        'Pure Silk (Mulberry Silk)',
        'Pashmina (Cashmere Grade)'
    ]
};

export const WASH_CARE_OPTIONS = ['Dry Clean Only', 'Hand Wash Cold', 'Machine Wash Gentle', 'Do Not Bleach', 'Iron Low Heat', 'Tumble Dry Low'];
