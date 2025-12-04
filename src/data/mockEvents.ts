/**
 * Mock Events Data for Casa Latina
 * Premium Latin social club events with Unsplash images
 */

export type RsvpStatus = 'none' | 'going' | 'went' | 'waitlist';

export interface EventData {
  id: string;
  title: string;
  city: string;
  neighborhood: string;
  date: string; // e.g. "Vie, 15 Dic · 8:00 PM"
  type: string; // e.g. "Cóctel íntimo", "Cena privada", "Arte & Vino"
  membersCount: number;
  remainingSpots: number;
  isMembersOnly: boolean;
  rsvpStatus: RsvpStatus;
  imageUrl: string;
}

export const mockEvents: EventData[] = [
  {
    id: '1',
    title: 'Noche de Cocteles en Brickell',
    city: 'Miami',
    neighborhood: 'Brickell',
    date: 'Vie, 15 Dic · 8:00 PM',
    type: 'Cóctel íntimo',
    membersCount: 45,
    remainingSpots: 5,
    isMembersOnly: true,
    rsvpStatus: 'going',
    imageUrl: 'https://images.unsplash.com/photo-1519677100203-a0e668c92439?w=800&q=80',
  },
  {
    id: '2',
    title: 'Cena Privada en Rooftop de Wynwood',
    city: 'Miami',
    neighborhood: 'Wynwood',
    date: 'Sáb, 16 Dic · 7:30 PM',
    type: 'Cena privada',
    membersCount: 32,
    remainingSpots: 8,
    isMembersOnly: true,
    rsvpStatus: 'none',
    imageUrl: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&q=80',
  },
  {
    id: '3',
    title: 'Arte & Vino en South Beach',
    city: 'Miami',
    neighborhood: 'South Beach',
    date: 'Dom, 17 Dic · 6:00 PM',
    type: 'Arte & Vino',
    membersCount: 28,
    remainingSpots: 12,
    isMembersOnly: false,
    rsvpStatus: 'went',
    imageUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?w=800&q=80',
  },
  {
    id: '4',
    title: 'Networking Nocturno en Design District',
    city: 'Miami',
    neighborhood: 'Design District',
    date: 'Lun, 18 Dic · 7:00 PM',
    type: 'Networking',
    membersCount: 52,
    remainingSpots: 3,
    isMembersOnly: true,
    rsvpStatus: 'waitlist',
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
  },
  {
    id: '5',
    title: 'Cóctel Exclusivo en Coral Gables',
    city: 'Miami',
    neighborhood: 'Coral Gables',
    date: 'Mar, 19 Dic · 8:30 PM',
    type: 'Cóctel íntimo',
    membersCount: 38,
    remainingSpots: 7,
    isMembersOnly: true,
    rsvpStatus: 'none',
    imageUrl: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=800&q=80',
  },
  {
    id: '6',
    title: 'Cena de Gala en Aventura',
    city: 'Miami',
    neighborhood: 'Aventura',
    date: 'Mié, 20 Dic · 7:00 PM',
    type: 'Cena privada',
    membersCount: 60,
    remainingSpots: 0,
    isMembersOnly: true,
    rsvpStatus: 'going',
    imageUrl: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800&q=80',
  },
  {
    id: '7',
    title: 'Brunch Exclusivo en Key Biscayne',
    city: 'Miami',
    neighborhood: 'Key Biscayne',
    date: 'Sáb, 23 Dic · 11:00 AM',
    type: 'Brunch',
    membersCount: 25,
    remainingSpots: 10,
    isMembersOnly: false,
    rsvpStatus: 'none',
    imageUrl: 'https://images.unsplash.com/photo-1521017432531-fbd92d768814?w=800&q=80',
  },
  {
    id: '8',
    title: 'Noche de Jazz en Little Havana',
    city: 'Miami',
    neighborhood: 'Little Havana',
    date: 'Vie, 22 Dic · 9:00 PM',
    type: 'Música en vivo',
    membersCount: 40,
    remainingSpots: 15,
    isMembersOnly: false,
    rsvpStatus: 'went',
    imageUrl: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&q=80',
  },
];


