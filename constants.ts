import { Property, VibeType, Booking } from './types';

export const MOCK_PROPERTIES: Property[] = [
  {
    id: '1',
    title: 'Nebula Glasshouse',
    location: 'Nordland, Norway',
    price: 45000,
    rating: 4.9,
    image: 'https://picsum.photos/800/600?random=1',
    vibe: VibeType.ZEN,
    description: 'Suspended above the fjords, this glass cube offers uninterrupted views of the Aurora Borealis. Complete silence, pure immersion.',
    tags: ['Glass', 'Aurora', 'Isolation'],
    features: ['Heated Floor', 'Telescope', 'Private Chef']
  },
  {
    id: '2',
    title: 'The Brutalist Bunker',
    location: 'Berlin, Germany',
    price: 32000,
    rating: 4.7,
    image: 'https://picsum.photos/800/600?random=2',
    vibe: VibeType.PARTY,
    description: 'Converted WWII bunker featuring Funktion-One sound systems and soundproof concrete walls. The ultimate private venue.',
    tags: ['Industrial', 'Techno', 'History'],
    features: ['Sound System', 'Bar', 'Lighting Rig']
  },
  {
    id: '3',
    title: 'Bamboo Cloud Forest',
    location: 'Ubud, Bali',
    price: 18000,
    rating: 4.95,
    image: 'https://picsum.photos/800/600?random=3',
    vibe: VibeType.DETOX,
    description: 'A biodynamic bamboo structure woven into the jungle canopy. No Wi-Fi, just waterfalls and meditation pods.',
    tags: ['Eco', 'Jungle', 'Wellness'],
    features: ['Natural Pool', 'Yoga Deck', 'Raw Food Kitchen']
  },
  {
    id: '4',
    title: 'Silicon Valley Ranch',
    location: 'California, USA',
    price: 55000,
    rating: 4.8,
    image: 'https://picsum.photos/800/600?random=4',
    vibe: VibeType.WORKATION,
    description: 'High-speed fiber optics meet rustic charm. Equipped with ergonomic Herman Miller setups and breakout meeting pods.',
    tags: ['Tech', 'Ranch', 'Productivity'],
    features: ['Starlink', 'Meeting Rooms', 'Espresso Bar']
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'B-1029',
    propertyId: '1',
    date: '2023-11-15',
    status: 'UPCOMING',
    guests: 2,
    totalPrice: 45000
  },
  {
    id: 'B-0921',
    propertyId: '3',
    date: '2023-08-10',
    status: 'COMPLETED',
    guests: 1,
    totalPrice: 18000
  }
];

export const ADDONS = [
  { id: 'bonfire', name: 'Bonfire Kit', price: 500, emoji: '🔥' },
  { id: 'trek', name: 'Guided Village Trek', price: 300, emoji: '🥾' },
  { id: 'bbq', name: 'Barbecue Setup', price: 1000, emoji: '🍖' },
];
